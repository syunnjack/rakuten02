using System.Globalization;
using System.Net;
using System.Text;
using Rakuten02.Core;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddHttpClient<GeoCodingClient>();
builder.Services.AddHttpClient<RakutenTravelClient>();
builder.Services.AddSingleton(_ => new RakutenApiOptions(
    builder.Configuration["Rakuten:ApplicationId"]
        ?? Environment.GetEnvironmentVariable("RAKUTEN_APPLICATION_ID")
        ?? string.Empty,
    builder.Configuration["Rakuten:AffiliateId"]
        ?? Environment.GetEnvironmentVariable("RAKUTEN_AFFILIATE_ID")));

var app = builder.Build();

app.UseStaticFiles();

app.MapGet("/", (HttpRequest request) =>
{
    var today = DateOnly.FromDateTime(DateTime.Today);
    var defaultCheckin = today.AddDays(7);
    var defaultCheckout = today.AddDays(8);
    return Results.Content(HtmlPages.Home(request, defaultCheckin, defaultCheckout), "text/html; charset=utf-8");
});

app.MapGet("/healthz", () => Results.Ok(new { status = "ok" }));

app.MapGet("/affiliate-disclosure", (HttpRequest request) =>
{
    return Results.Content(HtmlPages.AffiliateDisclosure(request), "text/html; charset=utf-8");
});

app.MapGet("/privacy", (HttpRequest request) =>
{
    return Results.Content(HtmlPages.Privacy(request), "text/html; charset=utf-8");
});

app.MapGet("/terms", (HttpRequest request) =>
{
    return Results.Content(HtmlPages.Terms(request), "text/html; charset=utf-8");
});

app.MapGet("/guides/missed-last-train", (HttpRequest request) =>
{
    return Results.Content(HtmlPages.Guide(request), "text/html; charset=utf-8");
});

app.MapGet("/areas/shinjuku-last-train", (HttpRequest request) =>
{
    return Results.Content(HtmlPages.AreaLanding(
        request,
        "新宿駅で終電を逃した時のホテル検索",
        "新宿駅周辺で終電後に今夜泊まれるホテルを探すためのページです。歌舞伎町、西新宿、新宿三丁目方面の空室探しに使えます。",
        "新宿駅",
        "新宿駅で終電を逃したら",
        "歌舞伎町、西新宿、新宿三丁目方面は徒歩圏のホテル候補が多く、深夜でも検索意図が強いエリアです。まず半径1kmで探し、見つからなければ1.5km、2kmへ広げるのがおすすめです。",
        "/areas/shinjuku-last-train"), "text/html; charset=utf-8");
});

app.MapGet("/areas/shibuya-tonight-hotel", (HttpRequest request) =>
{
    return Results.Content(HtmlPages.AreaLanding(
        request,
        "渋谷駅周辺で今夜泊まれるホテル検索",
        "渋谷駅周辺で飲み会後、ライブ後、終電後に泊まれるホテルを探せます。道玄坂、宮益坂、神泉方面の空室探しに。",
        "渋谷駅",
        "渋谷で今夜泊まるなら",
        "渋谷は深夜の移動需要が高く、道玄坂、神泉、恵比寿寄りまで広げると候補が増えます。現在地に近い駅名や会場名でも検索できます。",
        "/areas/shibuya-tonight-hotel"), "text/html; charset=utf-8");
});

app.MapGet("/venues/tokyo-dome-after-live", (HttpRequest request) =>
{
    return Results.Content(HtmlPages.AreaLanding(
        request,
        "東京ドームのライブ後に泊まれるホテル検索",
        "東京ドームのライブ、イベント、野球観戦後に帰れない時のホテル検索ページです。水道橋、後楽園、飯田橋周辺の空室を探せます。",
        "東京ドーム",
        "東京ドームの終演後に帰れない時",
        "終演直後は水道橋駅周辺が混みやすいため、後楽園、飯田橋、御茶ノ水方面まで候補に入れると見つかりやすくなります。",
        "/venues/tokyo-dome-after-live"), "text/html; charset=utf-8");
});

app.MapGet("/search", async (
    HttpRequest httpRequest,
    RakutenTravelClient client,
    string? place,
    string? checkin,
    string? checkout,
    double? radius,
    CancellationToken cancellationToken) =>
{
    var today = DateOnly.FromDateTime(DateTime.Today);
    var parsedCheckin = ParseDate(checkin) ?? today;
    var parsedCheckout = ParseDate(checkout) ?? parsedCheckin.AddDays(1);
    var searchRadius = Math.Clamp(radius ?? 1.0, 0.5, 3.0);

    if (string.IsNullOrWhiteSpace(place))
    {
        return Results.Content(
            HtmlPages.SearchError(httpRequest, "場所を入力してください。", parsedCheckin, parsedCheckout),
            "text/html; charset=utf-8");
    }

    try
    {
        var results = await client.SearchAsync(new HotelSearchRequest(
            place.Trim(),
            parsedCheckin,
            parsedCheckout,
            searchRadius), cancellationToken);

        return Results.Content(
            HtmlPages.SearchResults(httpRequest, place.Trim(), parsedCheckin, parsedCheckout, searchRadius, results),
            "text/html; charset=utf-8");
    }
    catch (InvalidOperationException ex)
    {
        return Results.Content(
            HtmlPages.SearchError(httpRequest, ex.Message, parsedCheckin, parsedCheckout),
            "text/html; charset=utf-8");
    }
    catch (HttpRequestException ex)
    {
        return Results.Content(
            HtmlPages.SearchError(httpRequest, $"検索APIへの接続に失敗しました: {ex.Message}", parsedCheckin, parsedCheckout),
            "text/html; charset=utf-8");
    }
});

app.MapGet("/robots.txt", (HttpRequest request) =>
{
    var origin = Origin(request);
    return Results.Text($"""
User-agent: *
Allow: /

Sitemap: {origin}/sitemap.xml
""", "text/plain; charset=utf-8");
});

app.MapGet("/llms.txt", (HttpRequest request) =>
{
    var origin = Origin(request);
    return Results.Text($"""
# 終電ホテル

終電ホテルは、終電後、ライブ後、飲み会後、出張延長などで「今夜近くで泊まれるホテル」を探すための楽天トラベル空室検索サービスです。

## Main URLs
- Home: {origin}/
- Search: {origin}/search?place=%E6%96%B0%E5%AE%BF%E9%A7%85&radius=1.0

## Useful Query Intents
- 終電逃した ホテル
- 今夜 泊まれる ホテル 近く
- 新宿駅 周辺 空室 ホテル
- ライブ後 泊まれる ホテル

## Domain
- Production: https://shudenhotel.jp/

## Notes
検索結果は楽天トラベルAPIとOpenStreetMap Nominatimを利用して生成されます。楽天アフィリエイトリンクはAPIレスポンスのaffiliateUrlを優先して出力します。
""", "text/plain; charset=utf-8");
});

app.MapGet("/sitemap.xml", (HttpRequest request) =>
{
    var origin = Origin(request);
    return Results.Text($"""
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>{WebUtility.HtmlEncode(origin)}/</loc>
  </url>
  <url>
    <loc>{WebUtility.HtmlEncode(origin)}/affiliate-disclosure</loc>
  </url>
  <url>
    <loc>{WebUtility.HtmlEncode(origin)}/privacy</loc>
  </url>
  <url>
    <loc>{WebUtility.HtmlEncode(origin)}/terms</loc>
  </url>
  <url>
    <loc>{WebUtility.HtmlEncode(origin)}/guides/missed-last-train</loc>
  </url>
  <url>
    <loc>{WebUtility.HtmlEncode(origin)}/areas/shinjuku-last-train</loc>
  </url>
  <url>
    <loc>{WebUtility.HtmlEncode(origin)}/areas/shibuya-tonight-hotel</loc>
  </url>
  <url>
    <loc>{WebUtility.HtmlEncode(origin)}/venues/tokyo-dome-after-live</loc>
  </url>
  <url>
    <loc>{WebUtility.HtmlEncode(origin)}/search?place=%E6%96%B0%E5%AE%BF%E9%A7%85&amp;radius=1.0</loc>
  </url>
  <url>
    <loc>{WebUtility.HtmlEncode(origin)}/search?place=%E6%B8%8B%E8%B0%B7%E9%A7%85&amp;radius=1.0</loc>
  </url>
  <url>
    <loc>{WebUtility.HtmlEncode(origin)}/search?place=%E6%9D%B1%E4%BA%AC%E9%A7%85&amp;radius=1.0</loc>
  </url>
</urlset>
""", "application/xml; charset=utf-8");
});

app.Run();

static DateOnly? ParseDate(string? value)
{
    return DateOnly.TryParseExact(value, "yyyy-MM-dd", CultureInfo.InvariantCulture, DateTimeStyles.None, out var date)
        ? date
        : null;
}

static string Origin(HttpRequest request)
{
    var configured = Environment.GetEnvironmentVariable("PUBLIC_BASE_URL");
    if (!string.IsNullOrWhiteSpace(configured))
    {
        return configured.TrimEnd('/');
    }

    return $"{request.Scheme}://{request.Host}";
}

internal static class HtmlPages
{
    public static string AffiliateDisclosure(HttpRequest request)
    {
        var origin = Origin(request);
        return Layout(
            title: "広告・アフィリエイト表記 | 終電ホテル",
            description: "終電ホテルの広告、アフィリエイトリンク、楽天トラベルAPI利用についての表記です。",
            canonicalUrl: origin + "/affiliate-disclosure",
            body: """
<section class="article-hero">
  <a class="back-link" href="/">検索トップへ</a>
  <h1>広告・アフィリエイト表記</h1>
  <p>終電ホテルは、楽天トラベルAPIを利用してホテル空室情報を表示しています。検索結果や予約ボタンには広告・アフィリエイトリンクが含まれる場合があります。</p>
</section>

<section class="content-band two-column">
  <div>
    <h2>予約について</h2>
    <p>予約、料金、空室状況、キャンセル条件、支払い条件は、リンク先の楽天トラベルまたは各宿泊施設の表示内容をご確認ください。</p>
  </div>
  <div>
    <h2>収益について</h2>
    <p>ユーザーが本サイトのリンク経由で予約した場合、運営者が成果報酬を受け取ることがあります。表示順位や掲載内容は、検索条件とAPIレスポンスに基づきます。</p>
  </div>
</section>
""",
            jsonLd: SoftwareJsonLd(origin));
    }

    public static string Privacy(HttpRequest request)
    {
        var origin = Origin(request);
        return Layout(
            title: "プライバシーポリシー | 終電ホテル",
            description: "終電ホテルのプライバシーポリシーです。検索時に利用する情報、外部サービス、Cookie等について説明します。",
            canonicalUrl: origin + "/privacy",
            body: """
<section class="article-hero">
  <a class="back-link" href="/">検索トップへ</a>
  <h1>プライバシーポリシー</h1>
  <p>終電ホテルは、駅名・地名・会場名などユーザーが入力した検索条件をもとに、ホテル空室情報を表示します。</p>
</section>

<section class="content-band two-column">
  <div>
    <h2>取得する情報</h2>
    <p>本サイトは、検索フォームに入力された場所、日付、検索半径を検索処理に利用します。氏名、住所、電話番号、クレジットカード番号などの予約情報は本サイトでは取得しません。</p>
  </div>
  <div>
    <h2>外部サービス</h2>
    <p>ホテル検索には楽天トラベルAPI、地名の緯度経度変換にはOpenStreetMap Nominatimを利用します。予約はリンク先の楽天トラベル上で行われます。</p>
  </div>
</section>

<section class="content-band two-column">
  <div>
    <h2>アクセス解析とCookie</h2>
    <p>今後アクセス解析や広告配信を導入する場合、Cookie等を利用することがあります。導入時には本ページの内容を更新します。</p>
  </div>
  <div>
    <h2>お問い合わせ</h2>
    <p>本サイトに関するお問い合わせは、GitHubリポジトリまたは運営者が別途指定する連絡先からお願いします。</p>
  </div>
</section>
""",
            jsonLd: SoftwareJsonLd(origin));
    }

    public static string Terms(HttpRequest request)
    {
        var origin = Origin(request);
        return Layout(
            title: "利用規約 | 終電ホテル",
            description: "終電ホテルの利用規約です。ホテル空室情報の確認、予約、免責事項について説明します。",
            canonicalUrl: origin + "/terms",
            body: """
<section class="article-hero">
  <a class="back-link" href="/">検索トップへ</a>
  <h1>利用規約</h1>
  <p>終電ホテルは、急な宿泊先探しを補助するための検索サービスです。利用前に以下をご確認ください。</p>
</section>

<section class="content-band two-column">
  <div>
    <h2>情報の正確性</h2>
    <p>本サイトに表示されるホテル情報、価格、空室状況は外部APIから取得しています。最新かつ正確な情報は、必ずリンク先の予約画面で確認してください。</p>
  </div>
  <div>
    <h2>予約契約</h2>
    <p>宿泊予約はユーザーと予約サイトまたは宿泊施設との間で成立します。本サイトは予約契約の当事者ではありません。</p>
  </div>
</section>

<section class="content-band two-column">
  <div>
    <h2>禁止事項</h2>
    <p>本サイトへの過度な連続アクセス、スクレイピング、サービス妨害、不正利用、第三者の権利を侵害する行為を禁止します。</p>
  </div>
  <div>
    <h2>免責事項</h2>
    <p>本サイトの利用により発生した損害について、運営者は法令上認められる範囲で責任を負いません。</p>
  </div>
</section>
""",
            jsonLd: SoftwareJsonLd(origin));
    }

    public static string Home(HttpRequest request, DateOnly defaultCheckin, DateOnly defaultCheckout)
    {
        var origin = Origin(request);
        return Layout(
            title: "終電ホテル | 終電を逃した夜に今夜泊まれる近くのホテルを探す",
            description: "終電を逃した時、ライブ後、飲み会後、出張延長で今夜泊まれるホテルを駅名や地名から探せます。",
            canonicalUrl: origin + "/",
            body: $"""
<section class="hero">
  <div class="hero-copy">
    <p class="eyebrow">Shuden Hotel by Rakuten Travel Search</p>
    <h1>終電を逃した夜に、近くで今夜泊まれるホテルを探す。</h1>
    <p class="lead">駅名・地名・会場名を入れるだけで、楽天トラベルの空室プランを検索できます。飲み会後、ライブ後、急な出張延長にも。</p>
  </div>
  {SearchForm(defaultCheckin, defaultCheckout, "新宿駅", 1.0)}
</section>

<section class="content-band">
  <h2>よく検索されるシーン</h2>
  <div class="quick-links">
    <a href="/search?place=%E6%96%B0%E5%AE%BF%E9%A7%85&radius=1.0">新宿駅で終電を逃した</a>
    <a href="/search?place=%E6%B8%8B%E8%B0%B7%E9%A7%85&radius=1.0">渋谷駅周辺で今夜泊まる</a>
    <a href="/search?place=%E6%9D%B1%E4%BA%AC%E9%A7%85&radius=1.0">東京駅近くの空室</a>
    <a href="/search?place=%E6%A8%AA%E6%B5%9C%E9%A7%85&radius=1.0">横浜駅周辺のホテル</a>
  </div>
</section>

<section class="content-band two-column">
  <div>
    <h2>AI検索で拾われやすい情報設計</h2>
    <p>検索結果にはホテル名、住所、アクセス、レビュー、プラン名、食事条件、価格を本文として表示します。AI OverviewやLLM検索が引用しやすいように、画像だけに頼らずテキストで要点を残します。</p>
  </div>
  <div>
    <h2>バズらせる切り口</h2>
    <p>「終電逃した」「ライブ後に帰れない」「飲み会後に即ホテル」のような感情が乗る検索意図に寄せています。駅名別リンクをSNS投稿や動画の着地点にできます。</p>
  </div>
</section>
""",
            jsonLd: SoftwareJsonLd(origin));
    }

    public static string SearchResults(
        HttpRequest request,
        string place,
        DateOnly checkin,
        DateOnly checkout,
        double radius,
        IReadOnlyList<HotelSearchResult> results)
    {
        var origin = Origin(request);
        var titlePlace = Html(place);
        var title = $"{titlePlace} 周辺の今夜泊まれるホテル | 終電ホテル";
        var description = $"{titlePlace} 周辺{radius:F1}kmで、{checkin:yyyy-MM-dd}から泊まれる楽天トラベル空室プランを検索します。";

        var cards = results.Count == 0
            ? "<p class=\"empty\">空室が見つかりませんでした。検索半径や日付を変えてお試しください。</p>"
            : string.Join(Environment.NewLine, results.Select(HotelCard));

        return Layout(
            title,
            description,
            canonicalUrl: $"{origin}/search?place={Uri.EscapeDataString(place)}&checkin={checkin:yyyy-MM-dd}&checkout={checkout:yyyy-MM-dd}&radius={radius:F1}",
            body: $"""
<section class="search-header">
  <a class="back-link" href="/">検索トップへ</a>
  <h1>{titlePlace}周辺の空室ホテル</h1>
  <p>{Html(checkin.ToString("yyyy-MM-dd"))} から {Html(checkout.ToString("yyyy-MM-dd"))}、半径 {radius:F1}km の検索結果です。</p>
  {SearchForm(checkin, checkout, place, radius)}
</section>

<section class="results">
  {cards}
</section>
""",
            jsonLd: SearchJsonLd(origin, place, results));
    }

    public static string Guide(HttpRequest request)
    {
        var origin = Origin(request);
        return Layout(
            title: "終電を逃した時に今夜泊まれるホテルを探す方法 | 終電ホテル",
            description: "終電を逃した時、タクシー、ネットカフェ、カプセルホテル、ビジネスホテルを比較しながら今夜泊まれる宿を探す方法をまとめました。",
            canonicalUrl: origin + "/guides/missed-last-train",
            body: """
<section class="article-hero">
  <a class="back-link" href="/">検索トップへ</a>
  <h1>終電を逃した時に、今夜泊まれるホテルを探す方法</h1>
  <p>終電後は、徒歩圏の空室、チェックイン可能時間、移動費を同時に見るのが大事です。まず駅名や会場名で半径1km以内を検索し、見つからなければ2kmまで広げます。</p>
</section>

<section class="content-band two-column">
  <div>
    <h2>最初に見るポイント</h2>
    <p>ホテル名、住所、アクセス、レビュー、プラン価格を確認します。深夜移動では「駅から近い」「予約画面まで進める」「価格がタクシー代より現実的」の3点が判断材料になります。</p>
  </div>
  <div>
    <h2>代替案との比較</h2>
    <p>タクシー代が高い時は、ビジネスホテルやカプセルホテルの方が安くなる場合があります。ネットカフェは安い一方で、翌日の体力を残したい時はホテルが向きます。</p>
  </div>
</section>

<section class="content-band">
  <h2>すぐ探す</h2>
  <div class="quick-links">
    <a href="/search?place=%E6%96%B0%E5%AE%BF%E9%A7%85&radius=1.0">新宿駅周辺</a>
    <a href="/search?place=%E6%B8%8B%E8%B0%B7%E9%A7%85&radius=1.0">渋谷駅周辺</a>
    <a href="/search?place=%E6%9D%B1%E4%BA%AC%E9%A7%85&radius=1.0">東京駅周辺</a>
    <a href="/search?place=%E6%A8%AA%E6%B5%9C%E9%A7%85&radius=1.0">横浜駅周辺</a>
  </div>
</section>
""",
            jsonLd: SoftwareJsonLd(origin));
    }

    public static string AreaLanding(
        HttpRequest request,
        string title,
        string description,
        string place,
        string heading,
        string bodyText,
        string path)
    {
        var origin = Origin(request);
        var today = DateOnly.FromDateTime(DateTime.Today);
        return Layout(
            title: $"{title} | 終電ホテル",
            description,
            canonicalUrl: origin + path,
            body: $"""
<section class="article-hero">
  <a class="back-link" href="/">検索トップへ</a>
  <h1>{Html(heading)}</h1>
  <p>{Html(bodyText)}</p>
  {SearchForm(today, today.AddDays(1), place, 1.0)}
</section>

<section class="content-band two-column">
  <div>
    <h2>検索のコツ</h2>
    <p>最初は半径1kmで探し、空室が少ない場合は1.5km、2km、3kmへ広げます。駅名だけでなく、会場名や繁華街名でも検索できます。</p>
  </div>
  <div>
    <h2>予約前の確認</h2>
    <p>深夜チェックインの可否、最寄り駅からの徒歩時間、レビュー、食事条件、合計価格を確認してから予約画面へ進んでください。</p>
  </div>
</section>
""",
            jsonLd: SoftwareJsonLd(origin));
    }

    public static string SearchError(HttpRequest request, string message, DateOnly checkin, DateOnly checkout)
    {
        var origin = Origin(request);
        return Layout(
            title: "検索できませんでした | 終電ホテル",
            description: "ホテル空室検索でエラーが発生しました。",
            canonicalUrl: origin + "/",
            body: $"""
<section class="search-header">
  <a class="back-link" href="/">検索トップへ</a>
  <h1>検索できませんでした</h1>
  <p class="error">{Html(message)}</p>
  {SearchForm(checkin, checkout, "新宿駅", 1.0)}
</section>
""",
            jsonLd: SoftwareJsonLd(origin));
    }

    private static string Layout(string title, string description, string canonicalUrl, string body, string jsonLd)
    {
        return $"""
<!doctype html>
<html lang="ja">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>{title}</title>
  <meta name="description" content="{Html(description)}">
  <link rel="canonical" href="{Html(canonicalUrl)}">
  <meta property="og:type" content="website">
  <meta property="og:title" content="{Html(title)}">
  <meta property="og:description" content="{Html(description)}">
  <meta property="og:url" content="{Html(canonicalUrl)}">
  <meta name="twitter:card" content="summary_large_image">
  <link rel="stylesheet" href="/styles.css">
  <script type="application/ld+json">{jsonLd}</script>
</head>
<body>
  <header class="site-header">
    <a class="brand" href="/">終電ホテル</a>
    <nav>
      <a href="/affiliate-disclosure">広告表記</a>
      <a href="/llms.txt">llms.txt</a>
      <a href="/sitemap.xml">sitemap</a>
    </nav>
  </header>
  <main>
    {body}
  </main>
  <footer class="site-footer">
    <p>終電ホテルは楽天トラベルAPIを利用しています。予約リンクには広告・アフィリエイトリンクが含まれる場合があります。</p>
    <nav>
      <a href="/affiliate-disclosure">広告・アフィリエイト表記</a>
      <a href="/privacy">プライバシーポリシー</a>
      <a href="/terms">利用規約</a>
    </nav>
  </footer>
</body>
</html>
""";
    }

    private static string SearchForm(DateOnly checkin, DateOnly checkout, string place, double radius)
    {
        return $"""
<form class="search-form" action="/search" method="get">
  <label>
    場所
    <input name="place" value="{Html(place)}" placeholder="駅名・地名・会場名" required>
  </label>
  <label>
    チェックイン
    <input type="date" name="checkin" value="{checkin:yyyy-MM-dd}" required>
  </label>
  <label>
    チェックアウト
    <input type="date" name="checkout" value="{checkout:yyyy-MM-dd}" required>
  </label>
  <label>
    半径
    <select name="radius">
      {RadiusOption(0.5, radius)}
      {RadiusOption(1.0, radius)}
      {RadiusOption(1.5, radius)}
      {RadiusOption(2.0, radius)}
      {RadiusOption(3.0, radius)}
    </select>
  </label>
  <button type="submit">空室を探す</button>
</form>
""";
    }

    private static string RadiusOption(double value, double selected)
    {
        var attr = Math.Abs(value - selected) < 0.01 ? " selected" : "";
        return $"""<option value="{value:F1}"{attr}>{value:F1}km</option>""";
    }

    private static string HotelCard(HotelSearchResult hotel)
    {
        var plans = string.Join(Environment.NewLine, hotel.Plans.Take(3).Select(PlanRow));
        var image = string.IsNullOrWhiteSpace(hotel.ImageUrl)
            ? "https://placehold.co/240x160?text=No+Image"
            : hotel.ImageUrl;

        return $"""
<article class="hotel-card">
  <img src="{Html(image)}" alt="{Html(hotel.Name)} 外観または客室画像" loading="lazy">
  <div class="hotel-body">
    <h2>{Html(hotel.Name)}</h2>
    <p class="meta">住所: {Html(hotel.Address)}</p>
    <p class="meta">アクセス: {Html(hotel.NearStation)} {Html(hotel.Access)}</p>
    <p class="review">レビュー {Html(hotel.ReviewAverage)} / 5 ({Html(hotel.ReviewCount)}件)</p>
    <div class="plans">{plans}</div>
  </div>
</article>
""";
    }

    private static string PlanRow(HotelPlan plan)
    {
        var breakfast = plan.WithBreakfast ? "朝食あり" : "朝食なし";
        var dinner = plan.WithDinner ? "夕食あり" : "夕食なし";
        var price = plan.TotalPrice.HasValue ? $"{plan.TotalPrice.Value:N0}円" : "価格情報なし";

        return $"""
<div class="plan-row">
  <div>
    <strong>{Html(plan.PlanName)}</strong>
    <span>{Html(plan.RoomName)}</span>
    <small>{breakfast} / {dinner}</small>
  </div>
  <a href="{Html(plan.ReserveUrl)}" rel="nofollow sponsored noopener" target="_blank">{price}で見る</a>
</div>
""";
    }

    private static string SoftwareJsonLd(string origin)
    {
        return $$"""
{
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "終電ホテル",
  "url": "{{origin}}/",
  "applicationCategory": "TravelApplication",
  "operatingSystem": "Web",
  "description": "終電後や急な宿泊時に、駅名や地名から今夜泊まれるホテル空室を探すWebアプリです。"
}
""";
    }

    private static string SearchJsonLd(string origin, string place, IReadOnlyList<HotelSearchResult> hotels)
    {
        var itemList = new StringBuilder();
        foreach (var (hotel, index) in hotels.Take(10).Select((hotel, index) => (hotel, index)))
        {
            if (index > 0)
            {
                itemList.Append(',');
            }

            itemList.Append($$"""
{
  "@type": "ListItem",
  "position": {{index + 1}},
  "name": "{{Json(hotel.Name)}}",
  "url": "{{origin}}/search?place={{Uri.EscapeDataString(place)}}"
}
""");
        }

        return $$"""
{
  "@context": "https://schema.org",
  "@type": "ItemList",
  "name": "{{Json(place)}} 周辺の空室ホテル",
  "itemListElement": [{{itemList}}]
}
""";
    }

    private static string Html(string value)
    {
        return WebUtility.HtmlEncode(value);
    }

    private static string Origin(HttpRequest request)
    {
        var configured = Environment.GetEnvironmentVariable("PUBLIC_BASE_URL");
        if (!string.IsNullOrWhiteSpace(configured))
        {
            return configured.TrimEnd('/');
        }

        return $"{request.Scheme}://{request.Host}";
    }

    private static string Json(string value)
    {
        return value
            .Replace("\\", "\\\\", StringComparison.Ordinal)
            .Replace("\"", "\\\"", StringComparison.Ordinal);
    }
}
