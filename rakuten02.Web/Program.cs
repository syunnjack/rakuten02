using System.Globalization;
using System.Net;
using System.Text;
using Rakuten02.Core;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddHttpClient<GeoCodingClient>(client =>
{
    client.Timeout = TimeSpan.FromSeconds(10);
});
builder.Services.AddHttpClient<RakutenTravelClient>(client =>
{
    var allowedOrigin =
        Environment.GetEnvironmentVariable("RAKUTEN_ALLOWED_ORIGIN")
        ?? "https://shudenhotel.jp";

    client.Timeout = TimeSpan.FromSeconds(10);
    client.DefaultRequestHeaders.Add("Origin", allowedOrigin);
    client.DefaultRequestHeaders.Referrer = new Uri($"{allowedOrigin.TrimEnd('/')}/");
    client.DefaultRequestHeaders.UserAgent.ParseAdd("ShudenHotel/1.0");
});
builder.Services.AddSingleton(_ => new RakutenApiOptions(
    builder.Configuration["Rakuten:ApplicationId"]
        ?? Environment.GetEnvironmentVariable("RAKUTEN_APPLICATION_ID")
        ?? string.Empty,
    builder.Configuration["Rakuten:AffiliateId"]
        ?? Environment.GetEnvironmentVariable("RAKUTEN_AFFILIATE_ID"),
    builder.Configuration["Rakuten:AccessKey"]
        ?? Environment.GetEnvironmentVariable("RAKUTEN_ACCESS_KEY")));

var app = builder.Build();

app.UseStaticFiles();

var landingPages = new[]
{
    new LandingPage("/areas/shinjuku-last-train", "新宿駅で終電を逃した時のホテル検索", "新宿駅周辺で終電後に今夜泊まれるホテルを探すためのページです。歌舞伎町、西新宿、新宿三丁目方面の空室探しに使えます。", "新宿駅", "新宿駅で終電を逃したら", "歌舞伎町、西新宿、新宿三丁目方面は徒歩圏のホテル候補が多く、深夜でも検索意図が強いエリアです。まず半径1kmで探し、見つからなければ1.5km、2kmへ広げるのがおすすめです。"),
    new LandingPage("/areas/shibuya-tonight-hotel", "渋谷駅周辺で今夜泊まれるホテル検索", "渋谷駅周辺で飲み会後、ライブ後、終電後に泊まれるホテルを探せます。道玄坂、宮益坂、神泉方面の空室探しに。", "渋谷駅", "渋谷で今夜泊まるなら", "渋谷は深夜の移動需要が高く、道玄坂、神泉、恵比寿寄りまで広げると候補が増えます。現在地に近い駅名や会場名でも検索できます。"),
    new LandingPage("/areas/tokyo-station-tonight-hotel", "東京駅周辺で今夜泊まれるホテル検索", "東京駅周辺で終電後、出張延長、深夜到着時に泊まれるホテルを探せます。丸の内、八重洲、日本橋方面の空室探しに。", "東京駅", "東京駅周辺で今夜泊まるなら", "東京駅は深夜到着や出張延長の需要が高いエリアです。丸の内側、八重洲側、日本橋方面まで広げると候補を見つけやすくなります。"),
    new LandingPage("/areas/yokohama-last-train", "横浜駅で終電を逃した時のホテル検索", "横浜駅周辺で終電後に泊まれるホテルを探せます。西口、東口、みなとみらい方面の空室探しに。", "横浜駅", "横浜駅で終電を逃したら", "横浜駅周辺は繁華街とビジネスホテルが近く、徒歩圏の候補を探しやすいエリアです。みなとみらい方面まで広げると選択肢が増えます。"),
    new LandingPage("/areas/ikebukuro-last-train", "池袋駅で終電を逃した時のホテル検索", "池袋駅周辺で飲み会後、ライブ後、終電後に泊まれるホテルを探せます。東口、西口、サンシャイン方面の空室探しに。", "池袋駅", "池袋駅で終電を逃したら", "池袋は東口・西口に宿泊候補が分かれます。駅から近い空室を優先し、見つからない時はサンシャイン方面まで検索範囲を広げます。"),
    new LandingPage("/areas/ueno-tonight-hotel", "上野駅周辺で今夜泊まれるホテル検索", "上野駅周辺で終電後、旅行前後、飲み会後に泊まれるホテルを探せます。御徒町、鶯谷、浅草方面の空室探しに。", "上野駅", "上野駅周辺で今夜泊まるなら", "上野はJR、地下鉄、新幹線アクセスがあり、当日宿泊需要が出やすいエリアです。御徒町や鶯谷方面まで含めると候補が増えます。"),
    new LandingPage("/areas/shinagawa-business-hotel", "品川駅周辺で急な出張延長に泊まれるホテル検索", "品川駅周辺で出張延長、終電後、早朝移動前に泊まれるホテルを探せます。高輪、港南、大崎方面の空室探しに。", "品川駅", "品川駅で急に泊まるなら", "品川駅は出張、空港移動、新幹線移動の前後に宿泊需要が高いエリアです。高輪側と港南側の両方を見ながら探すのがおすすめです。"),
    new LandingPage("/areas/namba-last-train", "なんば駅で終電を逃した時のホテル検索", "なんば駅周辺で飲み会後、観光後、終電後に泊まれるホテルを探せます。心斎橋、日本橋、道頓堀方面の空室探しに。", "なんば駅", "なんばで終電を逃したら", "なんばは繁華街とホテルが近く、深夜でも宿泊ニーズが強いエリアです。心斎橋や日本橋方面まで含めて探すと候補が広がります。"),
    new LandingPage("/venues/tokyo-dome-after-live", "東京ドームのライブ後に泊まれるホテル検索", "東京ドームのライブ、イベント、野球観戦後に帰れない時のホテル検索ページです。水道橋、後楽園、飯田橋周辺の空室を探せます。", "東京ドーム", "東京ドームの終演後に帰れない時", "終演直後は水道橋駅周辺が混みやすいため、後楽園、飯田橋、御茶ノ水方面まで候補に入れると見つかりやすくなります。"),
    new LandingPage("/venues/saitama-super-arena-after-live", "さいたまスーパーアリーナのライブ後に泊まれるホテル検索", "さいたまスーパーアリーナのライブ、イベント後に泊まれるホテルを探せます。さいたま新都心、大宮、浦和方面の空室探しに。", "さいたまスーパーアリーナ", "さいたまスーパーアリーナの終演後に泊まるなら", "終演後はさいたま新都心駅周辺が混みやすいため、大宮や浦和方面まで広げて探すと候補を見つけやすくなります。"),
    new LandingPage("/venues/yokohama-arena-after-live", "横浜アリーナのライブ後に泊まれるホテル検索", "横浜アリーナのライブ、イベント後に泊まれるホテルを探せます。新横浜、横浜、菊名方面の空室探しに。", "横浜アリーナ", "横浜アリーナの終演後に泊まるなら", "新横浜駅周辺はイベント日程で混みやすいため、横浜駅方面や菊名方面も含めて探すと選択肢が広がります。"),
    new LandingPage("/venues/makuhari-messe-after-event", "幕張メッセのイベント後に泊まれるホテル検索", "幕張メッセの展示会、フェス、ライブ後に泊まれるホテルを探せます。海浜幕張、幕張本郷、千葉方面の空室探しに。", "幕張メッセ", "幕張メッセのイベント後に泊まるなら", "大型イベント後は海浜幕張周辺が埋まりやすいため、幕張本郷や千葉方面まで範囲を広げると候補が見つかりやすくなります。"),
    new LandingPage("/guides/taxi-or-hotel", "終電後はタクシーとホテルどっちが安いか比較する方法", "終電後にタクシーで帰るかホテルに泊まるか迷った時、料金、距離、翌日の予定で判断するための比較ページです。", "新宿駅", "終電後、タクシーとホテルどっちが安い？", "遠距離のタクシー代が高くなる時は、駅近のビジネスホテルやカプセルホテルの方が現実的な場合があります。宿泊費、移動時間、翌日の体力をまとめて判断します。"),
    new LandingPage("/guides/after-live-hotel", "ライブ後に帰れない時のホテル検索", "ライブやイベントの終演後に帰れない時、会場名から今夜泊まれるホテルを探すためのページです。", "東京ドーム", "ライブ後に帰れない時のホテル探し", "終演後は最寄り駅周辺のホテルが埋まりやすいため、会場名で検索したあと近隣駅まで候補を広げます。遠征や翌日移動がある場合は早めの予約確認が重要です。"),
    new LandingPage("/guides/nomikai-after-hotel", "飲み会後に帰れない時のホテル検索", "飲み会後、終電後、深夜に帰宅が難しい時に近くで今夜泊まれるホテルを探すためのページです。", "新宿駅", "飲み会後に帰れない時のホテル探し", "飲み会後は現在地に近い駅名や繁華街名で探すのが早いです。徒歩圏のホテル、チェックイン可能時間、価格を確認してから予約画面へ進みます。")
};

app.MapGet("/", (HttpRequest request) =>
{
    var today = CurrentJapanDate();
    var defaultCheckin = today;
    var defaultCheckout = today.AddDays(1);
    return Results.Content(HtmlPages.Home(request, defaultCheckin, defaultCheckout), "text/html; charset=utf-8");
});

app.MapGet("/healthz", () => Results.Ok(new { status = "ok" }));

app.MapGet("/favicon.svg", () => Results.Text("""
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <rect width="64" height="64" rx="12" fill="#bf0000"/>
  <path d="M14 42h36v8H14z" fill="#fff"/>
  <path d="M18 34c0-9 6-16 14-16s14 7 14 16v8H18z" fill="#fff"/>
  <path d="M26 34h12v8H26z" fill="#bf0000"/>
  <circle cx="24" cy="26" r="3" fill="#bf0000"/>
  <circle cx="40" cy="26" r="3" fill="#bf0000"/>
</svg>
""", "image/svg+xml; charset=utf-8"));

app.MapGet("/og-image.svg", () => Results.Text("""
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <linearGradient id="night" x1="0" x2="1" y1="0" y2="1">
      <stop offset="0" stop-color="#202124"/>
      <stop offset="1" stop-color="#4b1111"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#night)"/>
  <rect x="72" y="72" width="1056" height="486" rx="28" fill="#ffffff" opacity="0.94"/>
  <text x="116" y="178" fill="#bf0000" font-family="Meiryo, sans-serif" font-size="44" font-weight="700">shudenhotel.jp</text>
  <text x="116" y="305" fill="#202124" font-family="Meiryo, sans-serif" font-size="88" font-weight="800">終電ホテル</text>
  <text x="116" y="395" fill="#3c4043" font-family="Meiryo, sans-serif" font-size="42" font-weight="600">終電を逃した夜に、今夜泊まれるホテルを探す。</text>
  <text x="116" y="476" fill="#5f6368" font-family="Meiryo, sans-serif" font-size="30">楽天トラベル空室検索 / 駅名・地名・会場名から検索</text>
  <path d="M930 210h110c46 0 84 38 84 84v126H846V294c0-46 38-84 84-84z" fill="#bf0000"/>
  <rect x="810" y="420" width="350" height="54" rx="10" fill="#202124"/>
  <circle cx="938" cy="284" r="20" fill="#fff"/>
  <circle cx="1034" cy="284" r="20" fill="#fff"/>
  <rect x="944" y="342" width="84" height="78" rx="8" fill="#fff"/>
</svg>
""", "image/svg+xml; charset=utf-8"));

app.MapGet("/site.webmanifest", (HttpRequest request) =>
{
    var origin = Origin(request);
    return Results.Json(new
    {
        name = "終電ホテル",
        short_name = "終電ホテル",
        start_url = origin + "/",
        display = "standalone",
        background_color = "#f7f5ef",
        theme_color = "#bf0000",
        icons = new[]
        {
            new
            {
                src = origin + "/favicon.svg",
                sizes = "any",
                type = "image/svg+xml"
            }
        }
    });
});

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

foreach (var landingPage in landingPages)
{
    app.MapGet(landingPage.Path, (HttpRequest request) =>
    {
        return Results.Content(HtmlPages.AreaLanding(request, landingPage), "text/html; charset=utf-8");
    });
}

app.MapGet("/search", async (
    HttpRequest httpRequest,
    RakutenTravelClient client,
    string? place,
    string? checkin,
    string? checkout,
    double? radius,
    CancellationToken cancellationToken) =>
{
    var today = CurrentJapanDate();
    var parsedCheckin = ParseDate(checkin) ?? today;
    var parsedCheckout = ParseDate(checkout) ?? parsedCheckin.AddDays(1);
    var searchRadius = Math.Clamp(radius ?? 1.0, 0.5, 3.0);

    if (string.IsNullOrWhiteSpace(place))
    {
        return Results.Content(
            HtmlPages.SearchError(httpRequest, "場所を入力してください。", parsedCheckin, parsedCheckout),
            "text/html; charset=utf-8");
    }

    if (parsedCheckin < today)
    {
        return Results.Content(
            HtmlPages.SearchError(httpRequest, "チェックイン日は今日以降を指定してください。", today, today.AddDays(1)),
            "text/html; charset=utf-8");
    }

    if (parsedCheckout <= parsedCheckin)
    {
        return Results.Content(
            HtmlPages.SearchError(httpRequest, "チェックアウト日はチェックイン日の翌日以降を指定してください。", parsedCheckin, parsedCheckin.AddDays(1)),
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
- Missed last train guide: {origin}/guides/missed-last-train
- Taxi or hotel guide: {origin}/guides/taxi-or-hotel
- After live hotel guide: {origin}/guides/after-live-hotel
- Shinjuku area: {origin}/areas/shinjuku-last-train
- Tokyo Dome venue: {origin}/venues/tokyo-dome-after-live

## Useful Query Intents
- 終電逃した ホテル
- 今夜 泊まれる ホテル 近く
- 新宿駅 周辺 空室 ホテル
- ライブ後 泊まれる ホテル
- タクシーより安い ホテル
- 飲み会後 帰れない ホテル
- 東京ドーム ライブ後 ホテル

## Domain
- Production: https://shudenhotel.jp/

## Notes
検索結果は楽天トラベルAPIとOpenStreetMap Nominatimを利用して生成されます。楽天アフィリエイトリンクはAPIレスポンスのaffiliateUrlを優先して出力します。
""", "text/plain; charset=utf-8");
});

app.MapGet("/sitemap.xml", (HttpRequest request) =>
{
    var origin = Origin(request);
    return Results.Text(BuildSitemap(origin, landingPages), "application/xml; charset=utf-8");
});

app.Run();

static DateOnly? ParseDate(string? value)
{
    return DateOnly.TryParseExact(value, "yyyy-MM-dd", CultureInfo.InvariantCulture, DateTimeStyles.None, out var date)
        ? date
        : null;
}

static DateOnly CurrentJapanDate()
{
    return DateOnly.FromDateTime(DateTime.UtcNow.AddHours(9));
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

static string BuildSitemap(string origin, IReadOnlyList<LandingPage> landingPages)
{
    var lastmod = CurrentJapanDate().ToString("yyyy-MM-dd", CultureInfo.InvariantCulture);
    var entries = new List<(string Path, string ChangeFreq, string Priority)>
    {
        ("/", "daily", "1.0"),
        ("/guides/missed-last-train", "weekly", "0.9")
    };

    entries.AddRange(landingPages.Select(page => (page.Path, "weekly", "0.8")));
    entries.AddRange(new[]
    {
        ("/affiliate-disclosure", "monthly", "0.3"),
        ("/privacy", "monthly", "0.3"),
        ("/terms", "monthly", "0.3")
    });

    var searchPlaces = new[]
    {
        "新宿駅", "渋谷駅", "東京駅", "横浜駅", "池袋駅", "上野駅", "品川駅", "なんば駅",
        "東京ドーム", "さいたまスーパーアリーナ", "横浜アリーナ", "幕張メッセ"
    };
    entries.AddRange(searchPlaces.Select(place =>
        ($"/search?place={Uri.EscapeDataString(place)}&radius=1.0", "daily", "0.7")));

    var urls = string.Join(Environment.NewLine, entries.Select(entry => $"""
  <url>
    <loc>{WebUtility.HtmlEncode(origin + entry.Path)}</loc>
    <lastmod>{lastmod}</lastmod>
    <changefreq>{entry.ChangeFreq}</changefreq>
    <priority>{entry.Priority}</priority>
  </url>
"""));

    return $"""
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
{urls}
</urlset>
""";
}

internal sealed record LandingPage(
    string Path,
    string Title,
    string Description,
    string Place,
    string Heading,
    string BodyText);

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
    <p>本サイトでは、Google Analytics（GA4）を利用してアクセス状況を分析しています。GA4はCookie等を利用し、ページ閲覧数や参照元などの統計情報を収集します。収集された情報は個人を特定する目的では利用しません。ブラウザのアドオンや設定でCookieを無効にできます。</p>
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
    <p class="eyebrow">今夜の空室を、すぐ検索</p>
    <h1>終電を逃した夜に、近くで今夜泊まれるホテルを探す。</h1>
    <p class="lead">駅名・地名・会場名を入れるだけで、楽天トラベルの空室プランを検索できます。飲み会後、ライブ後、急な出張延長にも。</p>
  </div>
  {SearchForm(defaultCheckin, defaultCheckout, "新宿駅", 1.0)}
</section>

<section class="content-band">
  <h2>よく検索されるシーン</h2>
  <div class="quick-links">
    <a href="/areas/shinjuku-last-train">新宿駅で終電を逃した</a>
    <a href="/areas/shibuya-tonight-hotel">渋谷駅周辺で今夜泊まる</a>
    <a href="/areas/tokyo-station-tonight-hotel">東京駅近くの空室</a>
    <a href="/areas/yokohama-last-train">横浜駅周辺のホテル</a>
    <a href="/areas/ikebukuro-last-train">池袋駅で終電を逃した</a>
    <a href="/areas/ueno-tonight-hotel">上野駅周辺で今夜泊まる</a>
    <a href="/venues/tokyo-dome-after-live">東京ドームのライブ後</a>
    <a href="/guides/taxi-or-hotel">タクシーとホテルを比較</a>
    <a href="/guides/missed-last-train">終電を逃した時の探し方</a>
    <a href="/guides/after-live-hotel">ライブ後のホテル探し</a>
    <a href="/guides/nomikai-after-hotel">飲み会後のホテル探し</a>
    <a href="/areas/shinagawa-business-hotel">品川駅で急に泊まる</a>
    <a href="/areas/namba-last-train">なんばで終電を逃した</a>
    <a href="/venues/saitama-super-arena-after-live">さいたまアリーナのライブ後</a>
    <a href="/venues/yokohama-arena-after-live">横浜アリーナのライブ後</a>
    <a href="/venues/makuhari-messe-after-event">幕張メッセのイベント後</a>
  </div>
</section>

<section class="content-band two-column">
  <div>
    <h2>駅名や会場名から探せる</h2>
    <p>現在地に近い駅、繁華街、ライブ会場などを入力すると、周辺の空室をまとめて確認できます。見つからない時は検索半径を広げて探せます。</p>
  </div>
  <div>
    <h2>料金と条件を比べやすい</h2>
    <p>ホテル名、住所、アクセス、レビュー、宿泊プラン、食事条件、料金を一覧で確認できます。予約前に楽天トラベルで最新の空室とチェックイン条件をご確認ください。</p>
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
        var faqs = new (string Question, string Answer)[]
        {
            ("終電を逃した時、最初に何をすればいい？", "現在地に近い駅名や繁華街名を入力し、半径1km以内で空室を探します。見つからなければ2km、3kmへ広げます。"),
            ("タクシーとホテル、どちらが安い？", "帰宅距離が長いほどタクシー代は高くなります。駅近のビジネスホテルやカプセルホテルの方が現実的な場合があります。"),
            ("表示される空室は最新ですか？", "検索結果は10分間キャッシュされます。予約前には必ず楽天トラベルで最新の空室と料金を確認してください。")
        };
        var breadcrumb = BreadcrumbSection("ガイド", "終電を逃した時の探し方", "/guides/missed-last-train");
        var jsonLd = CombineJsonLd(
            WebApplicationNode(origin),
            BreadcrumbJsonLd(origin, breadcrumb),
            FaqJsonLd(faqs));

        return Layout(
            title: "終電を逃した時に今夜泊まれるホテルを探す方法 | 終電ホテル",
            description: "終電を逃した時、タクシー、ネットカフェ、カプセルホテル、ビジネスホテルを比較しながら今夜泊まれる宿を探す方法をまとめました。",
            canonicalUrl: origin + "/guides/missed-last-train",
            body: $"""
{BreadcrumbHtml(breadcrumb)}
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

{FaqSection(faqs)}
""",
            jsonLd: jsonLd);
    }

    public static string AreaLanding(HttpRequest request, LandingPage page)
    {
        var origin = Origin(request);
        var today = CurrentJapanDate();
        var faqs = LandingFaqs(page);
        var breadcrumb = BreadcrumbSection("エリア・会場", page.Heading, page.Path);
        var jsonLd = CombineJsonLd(
            WebApplicationNode(origin),
            BreadcrumbJsonLd(origin, breadcrumb),
            FaqJsonLd(faqs));

        return Layout(
            title: $"{page.Title} | 終電ホテル",
            description: page.Description,
            canonicalUrl: origin + page.Path,
            body: $"""
{BreadcrumbHtml(breadcrumb)}
<section class="article-hero">
  <a class="back-link" href="/">検索トップへ</a>
  <h1>{Html(page.Heading)}</h1>
  <p>{Html(page.BodyText)}</p>
  {SearchForm(today, today.AddDays(1), page.Place, 1.0)}
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

<section class="content-band two-column">
  <div>
    <h2>このページで探せること</h2>
    <p>{Html(page.Place)}周辺で、終電後、イベント後、飲み会後、急な出張延長などに今夜泊まれるホテル候補を探せます。</p>
  </div>
  <div>
    <h2>AI検索向けの要点</h2>
    <p>{Html(page.Place)}周辺のホテル探しでは、徒歩圏、チェックイン可能時間、レビュー、合計価格を確認し、予約前に楽天トラベル側の最新情報を確認します。</p>
  </div>
</section>

{FaqSection(faqs)}
""",
            jsonLd: jsonLd);
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
  <meta name="robots" content="index, follow">
  <link rel="canonical" href="{Html(canonicalUrl)}">
  {GoogleSiteVerificationMeta()}
  <meta property="og:type" content="website">
  <meta property="og:locale" content="ja_JP">
  <meta property="og:site_name" content="終電ホテル">
  <meta property="og:title" content="{Html(title)}">
  <meta property="og:description" content="{Html(description)}">
  <meta property="og:url" content="{Html(canonicalUrl)}">
  <meta property="og:image" content="{Html(OriginFromCanonical(canonicalUrl) + "/og-image.svg")}">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="{Html(title)}">
  <meta name="twitter:description" content="{Html(description)}">
  <meta name="twitter:image" content="{Html(OriginFromCanonical(canonicalUrl) + "/og-image.svg")}">
  <meta name="theme-color" content="#bf0000">
  <link rel="icon" href="/favicon.svg" type="image/svg+xml">
  <link rel="manifest" href="/site.webmanifest">
  <link rel="stylesheet" href="/styles.css">
  {GoogleAnalyticsHead()}
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
        var today = CurrentJapanDate();
        return $"""
<form class="search-form" action="/search" method="get">
  <label>
    場所
    <input name="place" value="{Html(place)}" placeholder="駅名・地名・会場名" required>
  </label>
  <label>
    チェックイン
    <input type="date" name="checkin" value="{checkin:yyyy-MM-dd}" min="{today:yyyy-MM-dd}" required>
  </label>
  <label>
    チェックアウト
    <input type="date" name="checkout" value="{checkout:yyyy-MM-dd}" min="{today.AddDays(1):yyyy-MM-dd}" required>
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

    private static string WebApplicationNode(string origin)
    {
        return $$"""
{
  "@type": "WebApplication",
  "name": "終電ホテル",
  "url": "{{origin}}/",
  "applicationCategory": "TravelApplication",
  "operatingSystem": "Web",
  "description": "終電後や急な宿泊時に、駅名や地名から今夜泊まれるホテル空室を探すWebアプリです。"
}
""";
    }

    private static string GoogleAnalyticsHead()
    {
        var measurementId = Environment.GetEnvironmentVariable("GOOGLE_ANALYTICS_MEASUREMENT_ID");
        if (string.IsNullOrWhiteSpace(measurementId))
        {
            return string.Empty;
        }

        var id = Html(measurementId.Trim());
        return $"""
  <script async src="https://www.googletagmanager.com/gtag/js?id={id}"></script>
  <script>
    window.dataLayer = window.dataLayer || [];
    function gtag(){{dataLayer.push(arguments);}}
    gtag('js', new Date());
    gtag('config', '{id}');
  </script>
""";
    }

    private static string GoogleSiteVerificationMeta()
    {
        var token = Environment.GetEnvironmentVariable("GOOGLE_SITE_VERIFICATION");
        return string.IsNullOrWhiteSpace(token)
            ? string.Empty
            : $"""  <meta name="google-site-verification" content="{Html(token.Trim())}">""";
    }

    private static (string Question, string Answer)[] LandingFaqs(LandingPage page)
    {
        return
        [
            ($"{page.Place}周辺で今夜泊まれるホテルはどう探しますか？", $"{page.Place}を検索欄に入力し、半径1kmから始めて空室が少なければ2kmまで広げます。{page.BodyText}"),
            ("予約前に確認すべきことは？", "チェックイン可能時間、最寄り駅からの徒歩時間、レビュー、食事条件、合計価格を確認してから楽天トラベルの予約画面へ進んでください。"),
            ("表示される空室情報は最新ですか？", "検索結果は10分間キャッシュされます。予約前には必ずリンク先の楽天トラベルで最新の空室と料金を確認してください。")
        ];
    }

    private static string FaqSection(IReadOnlyList<(string Question, string Answer)> faqs)
    {
        var items = string.Join(Environment.NewLine, faqs.Select(faq => $"""
  <details class="faq-item">
    <summary>{Html(faq.Question)}</summary>
    <p>{Html(faq.Answer)}</p>
  </details>
"""));

        return $"""
<section class="content-band faq">
  <h2>よくある質問</h2>
  <div class="faq-list">
{items}
  </div>
</section>
""";
    }

    private static string FaqJsonLd(IReadOnlyList<(string Question, string Answer)> faqs)
    {
        var entities = string.Join(",", faqs.Select(faq => $$"""
{
  "@type": "Question",
  "name": "{{Json(faq.Question)}}",
  "acceptedAnswer": {
    "@type": "Answer",
    "text": "{{Json(faq.Answer)}}"
  }
}
"""));

        return $$"""
{
  "@type": "FAQPage",
  "mainEntity": [{{entities}}]
}
""";
    }

    private static (string Label, string Path)[] BreadcrumbSection(string sectionLabel, string pageLabel, string pagePath)
    {
        return
        [
            ("トップ", "/"),
            (sectionLabel, string.Empty),
            (pageLabel, pagePath)
        ];
    }

    private static string BreadcrumbHtml((string Label, string Path)[] items)
    {
        var links = string.Join("", items.Select((item, index) =>
        {
            if (index == items.Length - 1)
            {
                return $"""<span aria-current="page">{Html(item.Label)}</span>""";
            }

            return item.Path.Length > 0
                ? $"""<a href="{Html(item.Path)}">{Html(item.Label)}</a><span>/</span>"""
                : $"""<span>{Html(item.Label)}</span><span>/</span>""";
        }));

        return $"""<nav class="breadcrumb" aria-label="パンくず">{links}</nav>""";
    }

    private static string BreadcrumbJsonLd(string origin, (string Label, string Path)[] items)
    {
        var elements = new StringBuilder();
        var position = 1;
        foreach (var item in items)
        {
            if (elements.Length > 0)
            {
                elements.Append(',');
            }

            var itemUrl = item.Path.Length > 0 ? origin + item.Path : null;
            var urlField = itemUrl is null ? string.Empty : $$""",
  "item": "{{itemUrl}}"
""";
            elements.Append($$"""
{
  "@type": "ListItem",
  "position": {{position}},
  "name": "{{Json(item.Label)}}"{{urlField}}
}
""");
            position++;
        }

        return $$"""
{
  "@type": "BreadcrumbList",
  "itemListElement": [{{elements}}]
}
""";
    }

    private static string CombineJsonLd(params string[] graphs)
    {
        var joined = string.Join(',', graphs.Where(graph => !string.IsNullOrWhiteSpace(graph)));
        return $$"""
{
  "@context": "https://schema.org",
  "@graph": [{{joined}}]
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

    private static DateOnly CurrentJapanDate()
    {
        return DateOnly.FromDateTime(DateTime.UtcNow.AddHours(9));
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

    private static string OriginFromCanonical(string canonicalUrl)
    {
        return Uri.TryCreate(canonicalUrl, UriKind.Absolute, out var uri)
            ? $"{uri.Scheme}://{uri.Authority}"
            : string.Empty;
    }

    private static string Json(string value)
    {
        return value
            .Replace("\\", "\\\\", StringComparison.Ordinal)
            .Replace("\"", "\\\"", StringComparison.Ordinal);
    }
}
