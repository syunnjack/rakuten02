using System.Globalization;
using System.Collections.Concurrent;
using System.Text.Json;

namespace Rakuten02.Core;

public sealed class GeoCodingClient
{
    private static readonly ConcurrentDictionary<string, CacheEntry> Cache = new(StringComparer.OrdinalIgnoreCase);
    private static readonly TimeSpan CacheDuration = TimeSpan.FromDays(14);
    private readonly HttpClient _httpClient;

    public GeoCodingClient(HttpClient httpClient)
    {
        _httpClient = httpClient;
        if (!_httpClient.DefaultRequestHeaders.UserAgent.Any())
        {
            _httpClient.DefaultRequestHeaders.UserAgent.ParseAdd("ShudenHotelSearch/1.0");
        }
    }

    public async Task<GeoPoint> SearchAsync(string place, CancellationToken cancellationToken = default)
    {
        if (string.IsNullOrWhiteSpace(place))
        {
            throw new ArgumentException("場所を入力してください。", nameof(place));
        }

        var normalizedPlace = place.Trim();
        if (Cache.TryGetValue(normalizedPlace, out var cached) && cached.ExpiresAt > DateTimeOffset.UtcNow)
        {
            return cached.Point;
        }

        var url = "https://nominatim.openstreetmap.org/search"
            + $"?q={Uri.EscapeDataString(normalizedPlace)}"
            + "&format=json"
            + "&limit=1";

        using var response = await _httpClient.GetAsync(url, cancellationToken);
        response.EnsureSuccessStatusCode();

        await using var stream = await response.Content.ReadAsStreamAsync(cancellationToken);
        using var json = await JsonDocument.ParseAsync(stream, cancellationToken: cancellationToken);
        if (json.RootElement.ValueKind != JsonValueKind.Array || json.RootElement.GetArrayLength() == 0)
        {
            throw new InvalidOperationException("緯度経度が取得できませんでした。駅名や地名を変えてお試しください。");
        }

        var first = json.RootElement[0];
        var lat = double.Parse(first.GetProperty("lat").GetString() ?? "0", CultureInfo.InvariantCulture);
        var lon = double.Parse(first.GetProperty("lon").GetString() ?? "0", CultureInfo.InvariantCulture);
        var point = new GeoPoint(lat, lon);
        Cache[normalizedPlace] = new CacheEntry(point, DateTimeOffset.UtcNow.Add(CacheDuration));
        return point;
    }

    private sealed record CacheEntry(GeoPoint Point, DateTimeOffset ExpiresAt);
}
