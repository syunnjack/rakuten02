import type { Metadata } from "next"
import Link from "next/link"
import storeData from "../data/store-videos.json"
import { resolveVideoAssetUrl } from "../lib/video-assets"
import {
  recommendedNewProducts,
  storeProductCategories,
  storeProducts,
} from "./store-products"

const pageTitle = "知多丸ストア | 積み上げログ"
const pageDescription =
  "知多丸の買い切り・月額・B2B候補ツールをBOOTHで販売。副業・せどり・終電ホテル・個人開発など、おすすめ順に揃えています。"

const personalEntries = [
  {
    id: "affiliate",
    title: "副業アフィリエイトを伸ばす",
    body: "投稿文・リンク診断・週次収支。ROOMとASPの「感覚運用」をやめる。",
    cta: "アフィリエイト商品を見る",
    picks: "ROOM改善ツール ¥2,480 ／ 週次ログブック ¥580",
  },
  {
    id: "seo-ops",
    title: "個人開発の公開を早くする",
    body: "SEO・GA4・IndexNowとリポジトリ棚卸し。毎回調べ直す時間をキットにする。",
    cta: "SEO・運用商品を見る",
    picks: "サイト公開キット ¥980 ／ RepoKura ¥2,480",
  },
  {
    id: "resale",
    title: "せどりの査定を速くする",
    body: "JANスキャン・相場・店舗間価格差。仕入れ判断を手元で完結させる。",
    cta: "せどり商品を見る",
    picks: "せどらーS ¥3,800 ／ BuybackAlert ¥980",
  },
] as const

const BOOTH_SHOP_URL = "https://chitamaru.booth.pm"

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

function TrialLink({ href, label }: { href: string; label: string }) {
  const style = { color: "#f97316", textDecoration: "underline" as const }
  if (href.startsWith("http")) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" style={style}>
        {label}
      </a>
    )
  }
  return (
    <Link href={href} style={style}>
      {label}
    </Link>
  )
}

function ProductCard({ product }: { product: (typeof storeProducts)[number] }) {
  return (
    <article className="store-video-card" id={`product-${product.slug}`}>
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
        <a className="store-buy-button" href={product.boothUrl} target="_blank" rel="noopener noreferrer">
          BOOTHで購入する — {product.price}
        </a>
        <p className="store-price-note">
          {product.priceNote}
          {product.trialUrl && product.trialLabel && (
            <>
              {" | "}
              <TrialLink href={product.trialUrl} label={product.trialLabel} />
            </>
          )}
        </p>
        <a
          className="store-repo-link"
          href={product.repoUrl}
          target="_blank"
          rel="noopener noreferrer"
        >
          GitHub ↗
        </a>
      </div>
    </article>
  )
}

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
    numberOfItems: storeProducts.length + allVideos.length,
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
          text: "決済はBOOTHで完結します。クレジットカード、PayPay、コンビニ払い、キャリア決済など、BOOTHが対応する方法が使えます。",
        },
      },
      {
        "@type": "Question",
        name: "買い切りですか？月額ですか？",
        acceptedAnswer: {
          "@type": "Answer",
          text: "いま出している本体は買い切り（と一部PPV）です。月額アラート系は準備中で、ストアではまず買い切りから始められます。",
        },
      },
      {
        "@type": "Question",
        name: "どれから買えばいいですか？",
        acceptedAnswer: {
          "@type": "Answer",
          text: "副業なら楽天ROOMクリック改善ツールか週次収支ログブック、個人開発ならサイト公開キット、せどりならBuybackAlertかせどらーS。ページ上部の「おすすめ3つの入口」から選んでください。",
        },
      },
      {
        "@type": "Question",
        name: "無料で試せる商品はありますか？",
        acceptedAnswer: {
          "@type": "Answer",
          text: "時短レシピ、GoalPilot、AI Quiz Study、RepoKura、えらびよりなど、デモや無料枠がある商品があります。各商品の「デモを見る」からどうぞ。",
        },
      },
      {
        "@type": "Question",
        name: "ソースコードは含まれますか？",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Webアプリ・Laravel・Windows系はソース一式が基本です。スプレッドシートはコピー用URL、公開キットはZIPです。",
        },
      },
      {
        "@type": "Question",
        name: "会社や店舗向けの掲載・SaaSはありますか？",
        acceptedAnswer: {
          "@type": "Answer",
          text: "B2B（店舗掲載や業務向けSaaS）は別フェーズで準備中です。まずは個人向けの買い切りラインをご利用ください。",
        },
      },
    ],
  }

  return (
    <main className="store-page">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <section className="archive-hero store-hero">
        <p className="eyebrow">
          <span />
          知多丸
        </p>
        <h1>
          使えるものを、
          <br />
          買い切りで。
        </h1>
        <p>
          副業・個人開発・せどり。まず自分の収益と運用を整えるツールだけをBOOTHで。
        </p>
        <div className="store-hero-cta">
          <a className="store-hero-cta-primary" href="#recommend-rank">
            おすすめ順で見る
          </a>
          <a className="store-hero-cta-secondary" href="#personal-entries">
            3つの入口へ
          </a>
          <a
            className="store-hero-cta-secondary"
            href={BOOTH_SHOP_URL}
            target="_blank"
            rel="noopener noreferrer"
          >
            BOOTHショップを開く ↗
          </a>
        </div>
      </section>

      <section className="store-recommend" id="recommend-rank">
        <div className="section-heading">
          <div>
            <p className="eyebrow">
              <span />
              おすすめ順
            </p>
            <h2>ニーズの強い順に {recommendedNewProducts.length} 製品</h2>
          </div>
          <p>既存ラインに加え、新規ラインを優先度順で掲載しています。</p>
        </div>
        <ol className="store-recommend-list">
          {recommendedNewProducts.map((product) => (
            <li key={product.slug}>
              <a href={`#product-${product.slug}`}>
                <span className="store-recommend-rank">
                  #{String(product.recommendRank ?? 0).padStart(2, "0")}
                </span>
                <span className="store-recommend-main">
                  <strong>
                    {product.emoji} {product.title}
                  </strong>
                  <span>{product.sublabel}</span>
                </span>
                <span className="store-recommend-price">{product.price}</span>
              </a>
            </li>
          ))}
        </ol>
        <div className="store-video-grid store-recommend-grid">
          {recommendedNewProducts.map((product) => (
            <ProductCard key={`rec-${product.slug}`} product={product} />
          ))}
        </div>
      </section>

      <section className="store-entries" id="personal-entries">
        <div className="section-heading">
          <div>
            <p className="eyebrow">
              <span />
              個人向け
            </p>
            <h2>おすすめ3つの入口</h2>
          </div>
          <p>迷ったらここから。買い切りのみ。</p>
        </div>
        <ol className="store-entry-list">
          {personalEntries.map((entry, index) => (
            <li key={entry.id}>
              <a className="store-entry-link" href={`#cat-${entry.id}`}>
                <span className="store-entry-index">{String(index + 1).padStart(2, "0")}</span>
                <span className="store-entry-copy">
                  <strong>{entry.title}</strong>
                  <span>{entry.body}</span>
                  <em>{entry.picks}</em>
                </span>
                <span className="store-entry-cta">{entry.cta}</span>
              </a>
            </li>
          ))}
        </ol>
      </section>

      {/* ── カテゴリ別（既存＋新規。カードidはおすすめ順と共有）── */}
      {storeProductCategories.map((cat) => {
        const products = storeProducts.filter((p) => p.category === cat.id)
        if (products.length === 0) return null
        // おすすめ順セクションで既に出した新規はカテゴリでは既存のみ＋新規の重複を避けるため
        // カテゴリでは全件表示（既存16の居場所確保）。新規カードは id 重複を避けるためキーだけ変える
        const legacy = products.filter((p) => p.recommendRank == null)
        const newer = products.filter((p) => p.recommendRank != null)
        return (
          <section className="store-products-section" id={`cat-${cat.id}`} key={cat.id}>
            <div className="section-heading">
              <div>
                <p className="eyebrow">
                  <span />
                  {cat.label}
                </p>
                <h2>{cat.label}</h2>
              </div>
              <p>
                {products.length}製品
                {newer.length > 0 ? `（うち新規 ${newer.length}）` : ""}
              </p>
            </div>
            {legacy.length > 0 && (
              <div className="store-video-grid">
                {legacy.map((product) => (
                  <ProductCard key={product.slug} product={product} />
                ))}
              </div>
            )}
            {newer.length > 0 && (
              <p className="store-category-new-note">
                このカテゴリの新規 {newer.length} 製品は上の「おすすめ順」に掲載しています。
                {newer.slice(0, 5).map((p) => (
                  <a key={p.slug} href={`#product-${p.slug}`}>
                    {" "}
                    #{p.recommendRank} {p.label}
                  </a>
                ))}
                {newer.length > 5 ? " …" : ""}
              </p>
            )}
          </section>
        )
      })}

      {/* ── PPV動画 ── */}
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
            <p>各作品の導入部分は無料でご覧いただけます。</p>
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

      {/* ── プロジェクト紹介動画（無料）── */}
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
            <p>全編無料でご覧いただけます。</p>
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
