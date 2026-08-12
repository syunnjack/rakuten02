import type { Metadata } from "next"
import Link from "next/link"
import storeData from "../data/store-videos.json"
import { resolveVideoAssetUrl } from "../lib/video-assets"

const pageTitle = "ストア | 積み上げログ"
const pageDescription =
  "知多丸ブランドの買い切りツール・Webアプリ・スプレッドシートテンプレートをBOOTHで販売しています。限定PPV動画や公開プロジェクトの紹介動画も掲載。"

export const metadata: Metadata = {
  title: pageTitle,
  description: pageDescription,
  alternates: { canonical: "/store" },
  openGraph: { title: pageTitle, description: pageDescription, type: "website", url: "/store", images: ["/og.png"] },
  twitter: { card: "summary_large_image", title: pageTitle, description: pageDescription, images: ["/og.png"] },
}

interface StoreSlide {
  title: string
  body: string
}

interface StoreVideoBase {
  slug: string
  title: string
  description: string
  language: string
  repositoryUrl: string
  articleUrl: string
  freePreviewSlideCount: number
  slides: StoreSlide[]
  narration: string[]
}

interface PpvVideo extends StoreVideoBase {
  kind: "ppv"
  priceNote: string | null
  boothUrl: string | null
}

interface DemoVideo extends StoreVideoBase {
  kind: "demo"
  ctaLabel: string
  ctaUrl: string
}

type StoreVideo = PpvVideo | DemoVideo

const softwareProducts = [
  {
    slug: "seo-dashboard-pro",
    emoji: "🔍",
    label: "SEO管理ダッシュボード Pro",
    sublabel: "Search Console + GA4 を一画面で",
    gradient: "linear-gradient(135deg, #1a73e8 0%, #0d47a1 100%)",
    badge: "ソフトウェア 買い切り",
    title: "SEO管理ダッシュボード Pro",
    description:
      "GoogleアカウントでログインするだけでSearch ConsoleとGA4の全プロパティを一画面に表示。サイトマップ送信・測定IDコピー・プロパティへの直接リンクが即座に行えます。100サイト以上を管理する方の作業時間を大幅に削減します。",
    features: [
      "全SCプロパティを自動取得・一覧表示",
      "GA4測定IDをワンクリックでコピー",
      "サイトマップの確認・送信がその場で完結",
      "Google OAuthによる安全な認証",
    ],
    boothUrl: "https://chitamaru.booth.pm/items/seo-dashboard-pro",
    price: "¥3,800",
    priceNote: "買い切り価格 ¥3,800（税込）| Google OAuthの設定が必要です",
    trialUrl: null,
    trialLabel: null,
  },
  {
    slug: "jitan-recipe",
    emoji: "🍳",
    label: "時短レシピ支援アプリ",
    sublabel: "楽天レシピ × 食材費概算",
    gradient: "linear-gradient(135deg, #f97316 0%, #ef4444 100%)",
    badge: "Webアプリ 買い切り",
    title: "時短レシピ支援アプリ",
    description:
      "楽天レシピから今日の料理を選ぶだけ。必要な食材リストと金額の概算がすぐに確認できます。食材ごとのチェックボックスで買い物リストとしても使え、毎日の食費管理をサポートします。",
    features: [
      "楽天レシピ人気ランキングをカテゴリ別に表示",
      "食材ごとの金額概算を自動表示（独自データベース）",
      "買い物チェックリスト機能付き",
      "調理時間・節約順にソート可能",
    ],
    boothUrl: "https://chitamaru.booth.pm/items/jitan-recipe",
    price: "¥580",
    priceNote: "買い切り価格 ¥580（税込）",
    trialUrl: "/tools/recipe",
    trialLabel: "無料で試す →",
  },
  {
    slug: "rakuafi-tool",
    emoji: "📊",
    label: "楽天ROOMクリック改善ツール",
    sublabel: "投稿文生成 + 報酬ゼロ診断",
    gradient: "linear-gradient(135deg, #a02b36 0%, #6b0f1a 100%)",
    badge: "Webアプリ 買い切り",
    title: "楽天ROOMクリック改善ツール PRO版",
    description:
      "投稿文の自動生成、商品別リンク診断、クリック・報酬データの記録、報酬ゼロ原因の自動言語化まで。楽天ROOM運用をブラウザ1画面で完結させる買い切りツールです。",
    features: [
      "ROOM投稿文をワンタップで自動生成",
      "汎用リンク vs 商品別リンクを自動診断",
      "楽天アフィリエイトCSVをグラフで可視化",
      "データはブラウザ内保存・サーバー送信なし",
    ],
    boothUrl: "https://chitamaru.booth.pm/items/rakuafi-tool",
    price: "¥2,480",
    priceNote: "買い切り価格 ¥2,480（税込）| 購入後に合言葉をお伝えします",
    trialUrl: null,
    trialLabel: null,
  },
  {
    slug: "affiliate-logbook",
    emoji: "📋",
    label: "副業アフィリエイト 週次収支ログブック",
    sublabel: "複数ASP × Googleスプレッドシート",
    gradient: "linear-gradient(135deg, #16a34a 0%, #065f46 100%)",
    badge: "スプレッドシート 買い切り",
    title: "副業アフィリエイト 週次収支ログブック",
    description:
      "楽天・Amazon・A8など複数ASPの週次収益をまとめて記録し、「どのコンテンツが稼いでいるか」を1枚で把握できるGoogleスプレッドシートテンプレートです。",
    features: [
      "ASP別 週次クリック・承認・報酬を一括入力",
      "月別・ASP別サマリーを自動集計",
      "コンテンツ別貢献度シートで強化点が一目瞭然",
      "購入後すぐにコピーして使えるURL提供",
    ],
    boothUrl: "https://chitamaru.booth.pm/items/affiliate-logbook",
    price: "¥580",
    priceNote: "買い切り価格 ¥580（税込）| GoogleスプレッドシートのコピーURLをお渡しします",
    trialUrl: null,
    trialLabel: null,
  },
  {
    slug: "site-launch-kit",
    emoji: "🚀",
    label: "個人開発サイト公開キット",
    sublabel: "SEO・GA4・IndexNow 一括設定",
    gradient: "linear-gradient(135deg, #7c3aed 0%, #4c1d95 100%)",
    badge: "テンプレート 買い切り",
    title: "個人開発サイト公開キット",
    description:
      "Next.js/Vite/静的サイト向けに、SEOメタタグ、GA4、Search Console、IndexNow、sitemap、robots.txtを一括設定するパッチセットと公開前チェックリスト30項目が付属します。",
    features: [
      "Next.js / Vite / 静的サイト対応テンプレート",
      "GitHub Actions workflow（IndexNow自動送信）",
      "公開前チェックリストPDF 30項目",
      "shudenhotel.jp等5サイトで実際に使った手順",
    ],
    boothUrl: "https://chitamaru.booth.pm/items/site-launch-kit",
    price: "¥980",
    priceNote: "買い切り価格 ¥980（税込）| テンプレート一式 + PDF 即ダウンロード",
    trialUrl: null,
    trialLabel: null,
  },
]

export default function StorePage() {
  const allVideos = storeData.videos as StoreVideo[]
  const ppvVideos = allVideos.filter((video): video is PpvVideo => video.kind === "ppv")
  const demoVideos = allVideos.filter((video): video is DemoVideo => video.kind === "demo")

  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "ストア | 積み上げログ",
    description: pageDescription,
    url: "https://syunnjack.dev/store",
    isPartOf: { "@type": "WebSite", name: "積み上げログ", url: "https://syunnjack.dev" },
    numberOfItems: softwareProducts.length + allVideos.length,
  }
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "ホーム", item: "https://syunnjack.dev" },
      { "@type": "ListItem", position: 2, name: "ストア", item: "https://syunnjack.dev/store" },
    ],
  }
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "決済方法は何に対応していますか？",
        acceptedAnswer: {
          "@type": "Answer",
          text: "動画コンテンツ・ソフトウェア製品ともにBOOTHでの購入に対応します。クレジットカード、PayPay、コンビニ払い、キャリア決済など、BOOTHが対応する各種決済方法がご利用いただけます。",
        },
      },
      {
        "@type": "Question",
        name: "購入形式はどのような形ですか？",
        acceptedAnswer: {
          "@type": "Answer",
          text: "ソフトウェア・テンプレートは買い切りです。動画は単品PPV購入。サブスクリプション不要で、一度購入したソフトウェアは永続利用できます。",
        },
      },
      {
        "@type": "Question",
        name: "無料で試せる商品はありますか？",
        acceptedAnswer: {
          "@type": "Answer",
          text: "時短レシピ支援アプリは /tools/recipe で無料お試し版を公開中です。限定動画は導入部分を無料でご覧いただけます。",
        },
      },
      {
        "@type": "Question",
        name: "ソフトウェア製品の動作環境は？",
        acceptedAnswer: {
          "@type": "Answer",
          text: "SEO管理ダッシュボード ProはGoogleアカウントとNext.js環境が必要です。時短レシピ支援アプリは楽天APIキーとNext.js環境（Vercelなど）が必要です。楽天ROOMツールはブラウザのみで動作します。",
        },
      },
    ],
  }

  return (
    <main className="store-page">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      {/* ヒーロー */}
      <section className="archive-hero store-hero">
        <p className="eyebrow">
          <span />
          知多丸 ストア
        </p>
        <h1>
          使えるものを、
          <br />
          買い切りで。
        </h1>
        <p>
          個人開発・アフィリエイト・サイト運営に役立つツール・テンプレートを販売しています。
          すべてBOOTHで購入後すぐに利用できます。
        </p>
        <div className="store-payment-note">
          <span>販売</span>
          <strong>BOOTH</strong>
          <span>形式</span>
          <strong>買い切り / PPV</strong>
          <span>ブランド</span>
          <strong>知多丸</strong>
        </div>
      </section>

      {/* ── セクション1: ソフトウェア製品（有料・最上位）── */}
      <section className="store-products-section">
        <div className="section-heading">
          <div>
            <p className="eyebrow">
              <span />
              ソフトウェア製品・テンプレート
            </p>
            <h2>使えるツールをBOOTHで</h2>
          </div>
          <p>買い切りの開発ツール・Webアプリ・テンプレートです。購入後すぐにご利用いただけます。</p>
        </div>
        <div className="store-video-grid">
          {softwareProducts.map((product) => (
            <article className="store-video-card" key={product.slug}>
              <div
                style={{
                  background: product.gradient,
                  minHeight: "180px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <div style={{ textAlign: "center", color: "white", padding: "24px" }}>
                  <div style={{ fontSize: "44px", marginBottom: "10px" }}>{product.emoji}</div>
                  <div style={{ fontSize: "16px", fontWeight: "bold", lineHeight: 1.3 }}>{product.label}</div>
                  <div style={{ fontSize: "12px", opacity: 0.85, marginTop: "5px" }}>{product.sublabel}</div>
                </div>
              </div>
              <div className="store-video-body">
                <span className="store-video-badge">{product.badge}</span>
                <h2>{product.title}</h2>
                <p>{product.description}</p>
                <ul className="store-feature-list">
                  {product.features.map((f) => (
                    <li key={f}>✅ {f}</li>
                  ))}
                </ul>
                <a
                  className="store-buy-button"
                  href={product.boothUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  BOOTHで購入する — {product.price}
                </a>
                <p className="store-price-note">
                  {product.priceNote}
                  {product.trialUrl && (
                    <>
                      {" | "}
                      <Link href={product.trialUrl} style={{ color: "#f97316", textDecoration: "underline" }}>
                        {product.trialLabel}
                      </Link>
                    </>
                  )}
                </p>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* ── セクション2: PPV動画（限定・有料）── */}
      {ppvVideos.length > 0 && (
        <section className="store-demo-section">
          <div className="section-heading">
            <div>
              <p className="eyebrow">
                <span />
                限定動画（PPV）
              </p>
              <h2>導入は無料。続きはPPVで。</h2>
            </div>
            <p>各作品の導入部分は無料でご覧いただけます。続きはBOOTHでの単品購入でお楽しみください。</p>
          </div>
          <div className="store-video-grid">
            {ppvVideos.map((video) => (
              <article className="store-video-card" key={video.slug}>
                <video
                  className="store-preview-video"
                  controls
                  preload="none"
                  poster={resolveVideoAssetUrl(`/videos/store/${video.slug}/${video.slug}-preview.png`)}
                  aria-label={`${video.title}の無料プレビュー`}
                >
                  <source src={resolveVideoAssetUrl(`/videos/store/${video.slug}/${video.slug}-preview.mp4`)} type="video/mp4" />
                </video>
                <div className="store-video-body">
                  <span className="store-video-badge">無料プレビュー公開中</span>
                  <h2>{video.title}</h2>
                  <p>{video.description}</p>
                  {video.boothUrl ? (
                    <>
                      <a className="store-buy-button" href={video.boothUrl} target="_blank" rel="noopener noreferrer">
                        続きをBOOTHで購入する（PPV）
                      </a>
                      {video.priceNote && <p className="store-price-note">{video.priceNote}</p>}
                    </>
                  ) : (
                    <p className="store-price-note store-coming-soon">BOOTH出品準備中</p>
                  )}
                </div>
              </article>
            ))}
          </div>
        </section>
      )}

      {/* ── セクション3: プロジェクト紹介動画（無料）── */}
      {demoVideos.length > 0 && (
        <section className="store-demo-section">
          <div className="section-heading">
            <div>
              <p className="eyebrow">
                <span />
                プロジェクト紹介動画
              </p>
              <h2>公開プロジェクトを動画で紹介</h2>
            </div>
            <p>全編無料でご覧いただけます。気になったサービスは、紹介先のリンクからチェックできます。</p>
          </div>
          <div className="store-video-grid">
            {demoVideos.map((video) => (
              <article className="store-video-card" key={video.slug}>
                <video
                  className="store-preview-video"
                  controls
                  preload="none"
                  poster={resolveVideoAssetUrl(`/videos/store/${video.slug}/${video.slug}-preview.png`)}
                  aria-label={`${video.title}の紹介動画`}
                >
                  <source src={resolveVideoAssetUrl(`/videos/store/${video.slug}/${video.slug}-preview.mp4`)} type="video/mp4" />
                </video>
                <div className="store-video-body">
                  <span className="store-video-badge store-video-badge-free">全編無料公開中</span>
                  <h2>{video.title}</h2>
                  <p>{video.description}</p>
                  {video.ctaUrl && (
                    <a className="store-buy-button" href={video.ctaUrl} target="_blank" rel="noopener noreferrer sponsored">
                      {video.ctaLabel ?? "サービスを見る"}
                    </a>
                  )}
                </div>
              </article>
            ))}
          </div>
        </section>
      )}

      {/* FAQ */}
      <section className="store-faq">
        <h2>よくある質問</h2>
        <div className="store-faq-grid">
          {faqSchema.mainEntity.map((qa) => (
            <article key={qa.name}>
              <h3>{qa.name}</h3>
              <p>{qa.acceptedAnswer.text}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  )
}
