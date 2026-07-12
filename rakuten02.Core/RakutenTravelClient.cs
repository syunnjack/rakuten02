using System.Globalization;
using System.Collections.Concurrent;
using System.Text.Json;

namespace Rakuten02.Core;

public sealed class RakutenTravelClient
{
    private static readonly ConcurrentDictionary<string, CacheEntry> Cache = new(StringComparer.Ordinal);
    private static readonly TimeSpan CacheDuration = TimeSpan.FromMinutes(10);
    private readonly HttpClient _httpClient;
    private readonly GeoCodingClient _geoCodingClient;
    private readonly RakutenApiOptions _options;

    public RakutenTravelClient(HttpClient httpClient, GeoCodingClient geoCodingClient, RakutenApiOptions options)
    {
        _httpClient = httpClient;
        _geoCodingClient = geoCodingClient;
        _options = options;
    }

    public async Task<IReadOnlyList<HotelSearchResult>> SearchAsync(
        HotelSearchRequest request,
        CancellationToken cancellationToken = default)
    {
        if (!_options.IsConfigured)
        {
            throw new InvalidOperationException("楽天APIの applicationId が未設定です。");
        }

        var cacheKey = BuildCacheKey(request);
        if (Cache.TryGetValue(cacheKey, out var cached) && cached.ExpiresAt > DateTimeOffset.UtcNow)
        {
            return cached.Results;
        }

        var point = await _geoCodingClient.SearchAsync(request.Place, cancellationToken);
        var query = new Dictionary<string, string?>
        {
            ["applicationId"] = _options.ApplicationId,
            ["affiliateId"] = _options.AffiliateId,
            ["latitude"] = point.Latitude.ToString("F6", CultureInfo.InvariantCulture),
            ["longitude"] = point.Longitude.ToString("F6", CultureInfo.InvariantCulture),
            ["searchRadius"] = request.SearchRadiusKm.ToString("F1", CultureInfo.InvariantCulture),
            ["checkinDate"] = request.CheckinDate.ToString("yyyy-MM-dd", CultureInfo.InvariantCulture),
            ["checkoutDate"] = request.CheckoutDate.ToString("yyyy-MM-dd", CultureInfo.InvariantCulture),
            ["responseType"] = "middle",
            ["searchPattern"] = "1",
            ["datumType"] = "1",
            ["adultNum"] = request.AdultNum.ToString(CultureInfo.InvariantCulture),
            ["formatVersion"] = "2",
            ["format"] = "json",
            ["page"] = request.Page.ToString(CultureInfo.InvariantCulture)
        };

        var url = "https://app.rakuten.co.jp/services/api/Travel/VacantHotelSearch/20170426"
            + "?"
            + string.Join("&", query
                .Where(pair => !string.IsNullOrWhiteSpace(pair.Value))
                .Select(pair => $"{Uri.EscapeDataString(pair.Key)}={Uri.EscapeDataString(pair.Value!)}"));

        using var response = await _httpClient.GetAsync(url, cancellationToken);
        if ((int)response.StatusCode == 404)
        {
            return Array.Empty<HotelSearchResult>();
        }

        response.EnsureSuccessStatusCode();

        await using var stream = await response.Content.ReadAsStreamAsync(cancellationToken);
        using var json = await JsonDocument.ParseAsync(stream, cancellationToken: cancellationToken);
        if (!json.RootElement.TryGetProperty("hotels", out var hotels) || hotels.ValueKind != JsonValueKind.Array)
        {
            return Array.Empty<HotelSearchResult>();
        }

        var grouped = new Dictionary<string, HotelAccumulator>();
        foreach (var hotel in hotels.EnumerateArray())
        {
            if (hotel.ValueKind != JsonValueKind.Array || hotel.GetArrayLength() < 4)
            {
                continue;
            }

            if (!hotel[0].TryGetProperty("hotelBasicInfo", out var basicInfo))
            {
                continue;
            }

            var hotelNo = ReadString(basicInfo, "hotelNo");
            if (string.IsNullOrWhiteSpace(hotelNo))
            {
                continue;
            }

            if (!hotel[3].TryGetProperty("roomInfo", out var roomInfo)
                || roomInfo.ValueKind != JsonValueKind.Array
                || roomInfo.GetArrayLength() < 2)
            {
                continue;
            }

            if (!roomInfo[0].TryGetProperty("roomBasicInfo", out var roomBasicInfo))
            {
                continue;
            }

            roomInfo[1].TryGetProperty("dailyCharge", out var dailyCharge);

            if (!grouped.TryGetValue(hotelNo, out var accumulator))
            {
                accumulator = new HotelAccumulator(
                    hotelNo,
                    ReadString(basicInfo, "hotelName", "不明"),
                    $"{ReadString(basicInfo, "address1")} {ReadString(basicInfo, "address2")}".Trim(),
                    ReadString(basicInfo, "hotelImageUrl"),
                    ReadString(basicInfo, "reviewAverage", "-"),
                    ReadString(basicInfo, "reviewCount", "0"),
                    ReadString(basicInfo, "nearStation"),
                    ReadString(basicInfo, "access"));
                grouped.Add(hotelNo, accumulator);
            }

            accumulator.Plans.Add(new HotelPlan(
                ReadString(roomBasicInfo, "planName"),
                ReadString(roomBasicInfo, "roomName"),
                ReadString(roomBasicInfo, "withBreakfastFlag") == "1",
                ReadString(roomBasicInfo, "withDinnerFlag") == "1",
                ReadPrice(dailyCharge),
                ReadAffiliateUrl(roomBasicInfo, basicInfo)));
        }

        var results = grouped.Values
            .Select(item => new HotelSearchResult(
                item.HotelNo,
                item.Name,
                item.Address,
                item.ImageUrl,
                item.ReviewAverage,
                item.ReviewCount,
                item.NearStation,
                item.Access,
                item.Plans))
            .ToArray();
        Cache[cacheKey] = new CacheEntry(results, DateTimeOffset.UtcNow.Add(CacheDuration));
        CleanupExpiredCacheEntries();
        return results;
    }

    private static string BuildCacheKey(HotelSearchRequest request)
    {
        return string.Join("|",
            request.Place.Trim().ToUpperInvariant(),
            request.CheckinDate.ToString("yyyy-MM-dd", CultureInfo.InvariantCulture),
            request.CheckoutDate.ToString("yyyy-MM-dd", CultureInfo.InvariantCulture),
            request.SearchRadiusKm.ToString("F1", CultureInfo.InvariantCulture),
            request.Page.ToString(CultureInfo.InvariantCulture),
            request.AdultNum.ToString(CultureInfo.InvariantCulture));
    }

    private static void CleanupExpiredCacheEntries()
    {
        if (Cache.Count < 256)
        {
            return;
        }

        var now = DateTimeOffset.UtcNow;
        foreach (var pair in Cache.Where(pair => pair.Value.ExpiresAt <= now))
        {
            Cache.TryRemove(pair.Key, out _);
        }
    }

    private static string ReadString(JsonElement element, string propertyName, string fallback = "")
    {
        return element.ValueKind == JsonValueKind.Object
            && element.TryGetProperty(propertyName, out var value)
            ? value.ToString()
            : fallback;
    }

    private static long? ReadPrice(JsonElement element)
    {
        if (element.ValueKind != JsonValueKind.Object)
        {
            return null;
        }

        var raw = element.TryGetProperty("total", out var total) ? total.ToString()
            : element.TryGetProperty("rakutenCharge", out var charge) ? charge.ToString()
            : null;

        return long.TryParse(raw, NumberStyles.Integer, CultureInfo.InvariantCulture, out var price)
            ? price
            : null;
    }

    private static string ReadAffiliateUrl(JsonElement roomBasicInfo, JsonElement basicInfo)
    {
        var roomUrl = FirstString(roomBasicInfo, "affiliateUrl", "reserveUrl", "planListUrl");
        if (!string.IsNullOrWhiteSpace(roomUrl))
        {
            return roomUrl;
        }

        var hotelUrl = FirstString(
            basicInfo,
            "affiliateUrl",
            "hotelAffiliateUrl",
            "hotelInformationUrl",
            "planListUrl");

        return string.IsNullOrWhiteSpace(hotelUrl) ? "#" : hotelUrl;
    }

    private static string FirstString(JsonElement element, params string[] propertyNames)
    {
        foreach (var propertyName in propertyNames)
        {
            var value = ReadString(element, propertyName);
            if (!string.IsNullOrWhiteSpace(value))
            {
                return value;
            }
        }

        return string.Empty;
    }

    private sealed class HotelAccumulator
    {
        public HotelAccumulator(
            string hotelNo,
            string name,
            string address,
            string imageUrl,
            string reviewAverage,
            string reviewCount,
            string nearStation,
            string access)
        {
            HotelNo = hotelNo;
            Name = name;
            Address = address;
            ImageUrl = imageUrl;
            ReviewAverage = reviewAverage;
            ReviewCount = reviewCount;
            NearStation = nearStation;
            Access = access;
        }

        public string HotelNo { get; }
        public string Name { get; }
        public string Address { get; }
        public string ImageUrl { get; }
        public string ReviewAverage { get; }
        public string ReviewCount { get; }
        public string NearStation { get; }
        public string Access { get; }
        public List<HotelPlan> Plans { get; } = new();
    }

    private sealed record CacheEntry(IReadOnlyList<HotelSearchResult> Results, DateTimeOffset ExpiresAt);
}
