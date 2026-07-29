namespace Rakuten02.Core;

public sealed record HotelSearchRequest(
    string Place,
    DateOnly CheckinDate,
    DateOnly CheckoutDate,
    double SearchRadiusKm,
    int Page = 1,
    int AdultNum = 1);

public sealed record HotelSearchResult(
    string HotelNo,
    string Name,
    string Address,
    string ImageUrl,
    string ReviewAverage,
    string ReviewCount,
    string NearStation,
    string Access,
    IReadOnlyList<HotelPlan> Plans);

public sealed record HotelPlan(
    string PlanName,
    string RoomName,
    bool WithBreakfast,
    bool WithDinner,
    long? TotalPrice,
    string ReserveUrl);

public sealed record GeoPoint(double Latitude, double Longitude);

public sealed record RakutenApiOptions(string ApplicationId, string? AffiliateId, string? AccessKey)
{
    public bool IsConfigured =>
        !string.IsNullOrWhiteSpace(ApplicationId)
        && !string.IsNullOrWhiteSpace(AccessKey);
}
