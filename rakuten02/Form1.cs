using System;
using System.Net.Http;
using System.Security.Cryptography.Pkcs;
using System.Text;
using System.Windows.Forms;
using Newtonsoft.Json.Linq;
using System.Globalization;
using System.Collections.Generic;


namespace rakuten02
{
    public partial class Form1 : Form
    {
        private static readonly string APP_ID = Environment.GetEnvironmentVariable("RAKUTEN_APPLICATION_ID") ?? "";
        private static readonly string AFFILIATE_ID = Environment.GetEnvironmentVariable("RAKUTEN_AFFILIATE_ID") ?? "";
        private static readonly HttpClient httpClient = new HttpClient();
        private int page = 1;
        private List<JToken> allHotels = new List<JToken>();

        public Form1()
        {
            InitializeComponent();
            InitializeWebView();
            txtCheckin.Text = DateTime.Today.AddDays(7).ToString("yyyy-MM-dd");
            txtCheckout.Text = DateTime.Today.AddDays(8).ToString("yyyy-MM-dd");
            for (double r = 0.5; r <= 3.0; r += 0.5)
                cboRadius.Items.Add(r.ToString("F1"));
            cboRadius.SelectedItem = "1.0";
        }
        private async void InitializeWebView()
        {
            await webView.EnsureCoreWebView2Async(null);
            await webView.CoreWebView2.Profile.ClearBrowsingDataAsync();
        }


        private async Task<(double lat, double lon)> GetLatLonAsync(string place)
        {
            string url = $"https://nominatim.openstreetmap.org/search"
                + $"?q={Uri.EscapeDataString(place)}"
                + $"&format=json"
                + $"&limit=1";
            var request = new HttpRequestMessage(HttpMethod.Get, url);
            request.Headers.Add("User-Agent", "HotelSearchApp/1.0");
            var response = await httpClient.SendAsync(request);
            string text = await response.Content.ReadAsStringAsync();
            JArray results = JArray.Parse(text);
            if (results == null || results.Count == 0)
                throw new Exception("緯度経度が取得できません");
            double lat = double.Parse(results[0]["lat"]!.ToString(), System.Globalization.CultureInfo.InvariantCulture);
            double lon = double.Parse(results[0]["lon"]!.ToString(), System.Globalization.CultureInfo.InvariantCulture);
            return (lat, lon);
        }

        private async void btnSearch_Click(object sender, EventArgs e)
        {
            btnSearch.Enabled = false;
            btnSearch.Text = "検索中";
            allHotels.Clear();//検索ごとにリセットする
            page = 1;
            try
            {
                if (string.IsNullOrWhiteSpace(APP_ID))
                {
                    MessageBox.Show(
                        "楽天APIの applicationId が未設定です。\n環境変数 RAKUTEN_APPLICATION_ID を設定してください。",
                        "設定エラー");
                    return;
                }

                (double slat, double slon) = await GetLatLonAsync(txtPlace.Text.Trim());

                string sLat = slat.ToString("F6", System.Globalization.CultureInfo.InvariantCulture);
                string sLon = slon.ToString("F6", System.Globalization.CultureInfo.InvariantCulture);
                string sRadius = double.Parse(cboRadius.SelectedItem.ToString()).ToString("F1", System.Globalization.CultureInfo.InvariantCulture);

                System.Diagnostics.Debug.WriteLine($"[GeoCode] lat={sLat}, lon={sLon}, radius={sRadius}");



                string baseUrl = "https://app.rakuten.co.jp/services/api/Travel/VacantHotelSearch/20170426";
                string url = $"{baseUrl}?applicationId={APP_ID}"
                           + $"&affiliateId={AFFILIATE_ID}"
                           + $"&latitude={sLat}"
                           + $"&longitude={sLon}"
                           + $"&searchRadius={double.Parse(cboRadius.SelectedItem.ToString()).ToString("F1", CultureInfo.InvariantCulture)}"
                           + $"&checkinDate={txtCheckin.Text.Trim()}"
                           + $"&checkoutDate={txtCheckout.Text.Trim()}"
                           + $"&responseType=middle"
                           + $"&searchPattern=1"
                           + $"&datumType=1&adultNum=1&formatVersion=2&format=json"
                           + $"&page={page}";
                System.Diagnostics.Debug.WriteLine($"[Reqest] {url}");

                var response = await httpClient.GetAsync(url);
                string responseText = await response.Content.ReadAsStringAsync();
                System.Diagnostics.Debug.WriteLine($"[Response] Status={response.StatusCode}, Body(200)={responseText.Substring(0, Math.Min(200, responseText.Length))}");

                if (!response.IsSuccessStatusCode)
                {
                    if((int)response.StatusCode == 404)
                    {
                        webView.NavigateToString(BuildHtml(new JArray(), txtCheckin.Text.Trim(), txtCheckout.Text.Trim()));
                        return;
                    }
                    if ((int)response.StatusCode == 503)
                    {
                        MessageBox.Show(
                            "楽天トラベルAPIが一時的に混み合っている可能性があります。\n少し時間を置いてから再検索してください。",
                            "検索エラー");
                        return;
                    }
                    MessageBox.Show(
                        $"HTTP {(int)response.StatusCode} {response.ReasonPhrase}\n\n{responseText}",
                        "HTTPエラー");
                    return;
                }

                JObject json = JObject.Parse(responseText);
                JArray hotels = (JArray)json["hotels"];
                System.Diagnostics.Debug.WriteLine($"[Hotels] page={page}, count={hotels?.Count ?? 0}");

                if (hotels == null || hotels.Count == 0)
                    return;
                allHotels.AddRange(hotels);
                page++;


                webView.NavigateToString(BuildHtml(new JArray(allHotels), txtCheckin.Text.Trim(), txtCheckout.Text.Trim()));
            }
            catch (Exception ex)
            {
                System.Diagnostics.Debug.WriteLine($"[Exception] {ex}");
                MessageBox.Show($"エラー発生：{ex.Message}");
            }
            finally
            {
                btnSearch.Enabled = true;
                btnSearch.Text = "検索";
            }
        }



        private string BuildHtml(JArray hotels, string checkin, string checkout)
        {
            //DateTime dtIn = DateTime.Parse(checkin);
            //DateTime dtOut = DateTime.Parse(checkout);
            var sb = new StringBuilder();
            sb.Append(@"<!DOCTYPE html>
<html lang='ja'>
<head>
<meta charset='UTF-8'>
<style>
body { font-family:'Meiryo',sans-serif; margin:20px; background:#f5f5f5; }
  h1   { color:#bf0000; }
  .card {
    background:white; border-radius:8px; padding:15px; margin-bottom:10px;
    box-shadow:0 2px 4px rgba(0,0,0,0.1);
    display:flex; gap:15px;
  }
  .card img  { width:120px; height:90px; object-fit:cover; border-radius:4px; }
  .name      { font-size:16px; font-weight:bold; color:#333; }
  .price     { color:#bf0000; font-size:16px; font-weight:bold; margin:5px 0; }
  .btn {
    display:inline-block; padding:8px 15px;
    background:#bf0000; color:white; border-radius:4px; text-decoration:none; font-size:14px;
  }
.access { color:#666; font-size:13px; margin-top:4px; }
.plan   { color:#333; font-size:13px; margin-top:4px; }
.meal   { color:#4a9; font-size:13px; margin-top:4px; }
.plan-row   { border-top:1px solid #eee; margin-top:8px; padding-top:8px; }
.plan-name  { font-size:13px; color:#333; font-weight:bold; }
.plan-room  { font-size:12px; color:#666; }
.plan-meal  { font-size:12px; color:#4a9; }
.plan-price { color:#bf0000; font-weight:bold; font-size:13px; }
.plan-btn   {
  display:inline-block; margin-top:6px; padding:6px 12px;
  background:#bf0000; color:white; border-radius:4px; text-decoration:none; font-size:12px;
}
</style>
</head>
<body>
<h1>🏨 ホテル空室検索結果</h1>");
            var grouped = new Dictionary<string, (JToken info, List<(JToken rb, JToken ch)> plans)>();

            foreach (var hotel in hotels)
            {

                var info = hotel[0]?["hotelBasicInfo"];
                System.Diagnostics.Debug.WriteLine($"[Hotel0] {hotel[0]}");
                System.Diagnostics.Debug.WriteLine($"[Hotel1] {hotel[1]}");
                System.Diagnostics.Debug.WriteLine($"[Hotel2] {hotel[2]}");
                System.Diagnostics.Debug.WriteLine($"[Hotel3] {hotel[3]}");
                if (info == null) continue;
                string hotelNo = info["hotelNo"]?.ToString() ?? "";
                var roomInfoArray = hotel[3]?["roomInfo"] as JArray;
                if (roomInfoArray == null) continue;

                var rb = roomInfoArray[0]?["roomBasicInfo"];
                var ch = roomInfoArray[1]?["dailyCharge"];
                if (rb == null) continue;

                if (!grouped.ContainsKey(hotelNo))
                    grouped[hotelNo] = (info, new List<(JToken, JToken)>());
                grouped[hotelNo].plans.Add((rb, ch));
            }
            if(grouped.Count == 0)
            {
                sb.Append("<p>空室が見つかりません</p>");
                sb.Append("</body></html>");
                return sb.ToString();
            }
            foreach (var kv in grouped)
            {
                var info = kv.Value.info;
                var plans = kv.Value.plans;

                string name = info["hotelName"]?.ToString() ?? "不明";
                string address = $"{info["address1"]} {info["address2"]}";
                string imageUrl = info["hotelImageUrl"]?.ToString() ?? "";

                string reviewAvg = info["reviewAverage"]?.ToString() ?? "-";
                string reviewCount = info["reviewCount"]?.ToString() ?? "0";
                string nearStation = info["nearStation"]?.ToString() ?? "";
                string access = info["access"]?.ToString() ?? "";

                string stars = "";
                if (double.TryParse(reviewAvg, out double rev))
                    stars = new string('★', (int)Math.Round(rev))
                        + new string('☆', 5 - (int)Math.Round(rev));





                var sb_plans = new StringBuilder();


                foreach (var (rb, ch) in plans)
                {

                    string pName = rb["planName"]?.ToString() ?? "";
                    string rName = rb["roomName"]?.ToString() ?? "";
                    string pBreakfast = rb["withBreakfastFlag"]?.ToString() == "1" ? "🍳朝食あり" : "朝食なし";
                    string pDinner = rb["withDinnerFlag"]?.ToString() == "1" ? "🍽夕食あり" : "夕食なし";
                    string planUrl = rb["reserveUrl"]?.ToString() ?? "#";
                    string planPrice = "価格情報なし";


                    if (ch?["total"] != null)
                        planPrice = $"{long.Parse(ch["total"]!.ToString()):N0}";
                    else if (ch?["rakutenCharge"] != null)
                        planPrice = $"{long.Parse(ch["rakutenCharge"]!.ToString()):N0}";


                    sb_plans.Append($@"
<div class='plan-row'>
    <div class='plan-name'>📋 {System.Net.WebUtility.HtmlEncode(pName)}</div>
  <div class='plan-room'>🛏 {System.Net.WebUtility.HtmlEncode(rName)}</div>
  <div class='plan-meal'>{pBreakfast} / {pDinner}</div>
  <div class='plan-price'>{planPrice} / 泊</div>
  <a class='plan-btn' href='{planUrl}' target='_blank'>このプランを予約</a>
</div>");
                }

                sb.Append($@"
            
<div class='card'>
        <img src='{imageUrl}' onerror=""this.src='https://placehold.co/120x90?text=NoImage'"">
            <div style='flex:1'>
    <div class='name'>{System.Net.WebUtility.HtmlEncode(name)}</div>
    <div class='address'>📍 {System.Net.WebUtility.HtmlEncode(address)}</div>
    <div class='access'>🚃 {System.Net.WebUtility.HtmlEncode(nearStation)} {System.Net.WebUtility.HtmlEncode(access)}</div>
    <div class='review'>{stars} {reviewAvg}（{reviewCount}件）</div>
    <div class='plans'>{sb_plans}</div>
  </div>
</div>");

            }
            

                
                sb.Append("</body></html>");
                return sb.ToString();
            
        }

        
        
        private void Form1_Load(object sender, EventArgs e)
        {
        }
    }
    
}


            
