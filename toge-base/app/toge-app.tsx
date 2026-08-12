"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";

type Garage = {
  name: string;
  rank: string;
  car: string;
  stage: number;
  course: string;
};
type Post = {
  id: number;
  category: string;
  title: string;
  body: string;
  author: string;
  tags: string[];
  likes: number;
  replies: number;
  time: string;
};

const STORAGE = {
  garage: "toge-base.garage",
  posts: "toge-base.posts",
  vote: "toge-base.vote",
} as const;

const defaultGarage: Garage = {
  name: "AKINA★86",
  rank: "B級",
  car: "SPRINTER TRUENO (AE86)",
  stage: 12,
  course: "秋名山",
};

const initialPosts: Post[] = [
  {
    id: 1,
    category: "質問・相談",
    title: "碓氷のヘアピン、進入速度の目安は？",
    body: "下りでインに寄せすぎるとアンダーが出ます。AE86でのブレーキングポイントを知りたいです。",
    author: "B級 / AE86",
    tags: ["碓氷峠", "初心者"],
    likes: 31,
    replies: 0,
    time: "11分前",
  },
  {
    id: 2,
    category: "攻略情報",
    title: "秋名山・夜間、ブラインドコーナーの視線の作り方",
    body: "コーナー先のガードレールを先読みし、アクセルオフは短く。出口でトラクションを戻すとタイムが安定します。",
    author: "A級 / FD3S",
    tags: ["秋名山", "ライン取り"],
    likes: 74,
    replies: 11,
    time: "42分前",
  },
  {
    id: 3,
    category: "対戦募集",
    title: "今週末、初心者同士で峠練習しませんか？",
    body: "勝敗よりライン確認重視。秋名・碓氷どちらでも歓迎です。",
    author: "C級 / EG6",
    tags: ["対戦募集", "初心者歓迎"],
    likes: 22,
    replies: 5,
    time: "1時間前",
  },
];

const courses = [
  {
    name: "秋名山",
    sub: "上り / 下り",
    level: "TECHNICAL",
    tune: "ハンドリング重視",
    note: "ブラインドと連続コーナーで基本を固める",
    color: "amber",
    href: "/guides/akina",
  },
  {
    name: "碓氷峠",
    sub: "ヘアピン連発",
    level: "BRAKING",
    tune: "ブレーキ耐性",
    note: "減速とイン寄せの精度を磨く",
    color: "ember",
    href: "/guides/usui",
  },
  {
    name: "いろは坂",
    sub: "ヘアピン密集",
    level: "PRECISION",
    tune: "回頭性高め",
    note: "短いコーナーのリズムを覚える",
    color: "moss",
    href: "/guides/irohazaka",
  },
  {
    name: "八方ヶ原",
    sub: "高速セクションあり",
    level: "HIGH SPEED",
    tune: "安定感重視",
    note: "ストレート後の姿勢作りが勝負",
    color: "mist",
    href: "/guides/happogahara",
  },
];

const cars = [
  ["01", "TOYOTA", "SPRINTER TRUENO", "AE86", "軽快な回頭", "★★★★★"],
  ["02", "MAZDA", "RX-7", "FD3S", "パワーと旋回", "★★★★☆"],
  ["03", "HONDA", "CIVIC", "EG6", "コンパクト機動", "★★★★★"],
  ["04", "NISSAN", "SKYLINE GT-R", "BNR32", "安定した接地", "★★★★☆"],
  ["05", "MAZDA", "RX-7", "FC3S", "バランス型", "★★★★☆"],
  ["06", "MITSUBISHI", "LANCER Evolution IV", "CN9A", "四駆トラクション", "★★★★☆"],
];

const pollCars = [
  { name: "SPRINTER TRUENO (AE86)", votes: 212 },
  { name: "RX-7 (FD3S)", votes: 168 },
  { name: "CIVIC (EG6)", votes: 141 },
  { name: "SKYLINE GT-R (BNR32)", votes: 119 },
];

const contributors = [
  { rank: 1, name: "TOFU_86", score: 1340, badge: "攻略王" },
  { rank: 2, name: "ROTARY7", score: 1112, badge: "ベスト回答" },
  { rank: 3, name: "USUI_RUN", score: 980, badge: "募集マスター" },
];

const revenueLinks = {
  support:
    process.env.NEXT_PUBLIC_SUPPORT_URL ||
    "mailto:support@togepass.jp?subject=TOGE%20BASE%E3%82%B5%E3%83%9D%E3%83%BC%E3%82%BF%E3%83%BC%E7%99%BB%E9%8C%B2",
  gear:
    process.env.NEXT_PUBLIC_GEAR_AFFILIATE_URL ||
    "https://www.amazon.co.jp/s?k=%E3%83%89%E3%83%A9%E3%82%A4%E3%83%93%E3%83%B3%E3%82%B0%E3%82%B0%E3%83%AD%E3%83%BC%E3%83%96+%E3%82%B2%E3%83%BC%E3%83%A0",
  partner:
    process.env.NEXT_PUBLIC_PARTNER_URL ||
    "mailto:partner@togepass.jp?subject=TOGE%20BASE%E6%8E%B2%E8%BC%89%E3%81%AE%E3%81%94%E7%9B%B8%E8%AB%87",
};

function targetFor(stage: number) {
  if (stage < 5) return { next: 5, label: "基礎ライン完成", tip: "秋名山で壁接触を減らす" };
  if (stage < 15) return { next: 15, label: "中級峠へ進出", tip: "碓氷のヘアピン精度を上げる" };
  if (stage < 30) return { next: 30, label: "高速セクション攻略", tip: "八方ヶ原で姿勢を安定させる" };
  return { next: 50, label: "全峠制覇へ", tip: "得意コースを1本仕上げる" };
}

export default function TogeApp() {
  const [garage, setGarage] = useState(defaultGarage);
  const [posts, setPosts] = useState(initialPosts);
  const [active, setActive] = useState("ホーム");
  const [postFilter, setPostFilter] = useState("すべて");
  const [query, setQuery] = useState("");
  const [modal, setModal] = useState<"garage" | "post" | null>(null);
  const [postSeed, setPostSeed] = useState("");
  const [vote, setVote] = useState("");

  useEffect(() => {
    const timer = window.setTimeout(() => {
      const savedGarage = localStorage.getItem(STORAGE.garage);
      const savedPosts = localStorage.getItem(STORAGE.posts);
      const savedVote = localStorage.getItem(STORAGE.vote);
      if (savedGarage) setGarage(JSON.parse(savedGarage));
      if (savedPosts) {
        setPosts(
          (JSON.parse(savedPosts) as Post[]).map((post) => ({
            ...post,
            replies: post.replies ?? 0,
          })),
        );
      }
      if (savedVote) setVote(savedVote);
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  const target = targetFor(garage.stage);
  const progress = Math.min(100, Math.round((garage.stage / target.next) * 100));
  const filteredPosts = useMemo(
    () =>
      posts.filter((post) => {
        const categoryMatch =
          postFilter === "すべて" ||
          (postFilter === "未回答"
            ? post.category === "質問・相談" && post.replies === 0
            : post.category === postFilter);
        const text = `${post.title} ${post.body} ${post.tags.join(" ")}`.toLowerCase();
        return categoryMatch && text.includes(query.toLowerCase());
      }),
    [posts, postFilter, query],
  );

  const jump = (label: string, id: string) => {
    setActive(label);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  const saveGarage = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const next: Garage = {
      name: String(data.get("name")),
      rank: String(data.get("rank")),
      car: String(data.get("car")),
      stage: Number(data.get("stage")),
      course: String(data.get("course")),
    };
    setGarage(next);
    localStorage.setItem(STORAGE.garage, JSON.stringify(next));
    setModal(null);
  };

  const addPost = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const next: Post = {
      id: Date.now(),
      category: String(data.get("category")),
      title: String(data.get("title")),
      body: String(data.get("body")),
      author: `${garage.rank} / ${garage.name}`,
      tags: [String(data.get("tag") || "初心者")],
      likes: 0,
      replies: 0,
      time: "たった今",
    };
    const updated = [next, ...posts];
    setPosts(updated);
    localStorage.setItem(STORAGE.posts, JSON.stringify(updated));
    setPostSeed("");
    setModal(null);
    jump("コミュニティ", "community");
  };

  const castVote = (car: string) => {
    if (vote) return;
    setVote(car);
    localStorage.setItem(STORAGE.vote, car);
  };

  return (
    <main>
      <header className="site-header">
        <button
          className="brand"
          onClick={() => jump("ホーム", "top")}
          aria-label="TOGE BASE ホーム"
        >
          <span className="brand-mark">
            <i />
          </span>
          <span>
            TOGE <b>BASE</b>
            <small>TOUGE PLAYER COMMUNITY</small>
          </span>
        </button>
        <nav aria-label="メインメニュー">
          {(
            [
              ["ホーム", "top"],
              ["攻略", "guides"],
              ["車種", "cars"],
              ["コミュニティ", "community"],
            ] as const
          ).map(([label, id]) => (
            <button
              className={active === label ? "active" : ""}
              onClick={() => jump(label, id)}
              key={label}
            >
              {label}
            </button>
          ))}
        </nav>
        <button className="garage-button" onClick={() => setModal("garage")}>
          <span>◉</span> マイガレージ
        </button>
      </header>

      <section className="hero" id="top">
        <div className="mountain-haze" aria-hidden="true" />
        <div className="road-lines" aria-hidden="true" />
        <div className="hero-copy">
          <p className="eyebrow">
            <span>●</span> TOUGE PLAYER COMMUNITY
          </p>
          <h1>
            峠で、<br />
            <em>つながる。</em>
          </h1>
          <p className="hero-lead">
            攻略を調べる。成長を記録する。仲間と走る。
            <br />
            イニシャルDプレイヤーのための、峠の攻略基地。
          </p>
          <div className="hero-actions">
            <button className="primary" onClick={() => jump("攻略", "guides")}>
              攻略を見つける <span>→</span>
            </button>
            <button className="secondary" onClick={() => setModal("post")}>
              ＋ 投稿する
            </button>
          </div>
          <div className="live">
            <span className="pulse" /> <b>96</b> DRIVERS ONLINE <i /> UPDATE 12
            AUG. 2026
          </div>
        </div>
        <aside className="garage-card">
          <div className="card-top">
            <span>MY GARAGE</span>
            <button onClick={() => setModal("garage")}>編集 ↗</button>
          </div>
          <div className="rank-row">
            <div>
              <small>DRIVER RANK</small>
              <strong>{garage.rank}</strong>
            </div>
            <div className="driver">
              <small>DRIVER</small>
              <b>{garage.name}</b>
              <span>{garage.car}</span>
            </div>
          </div>
          <div className="goal-head">
            <div>
              <small>STAGE PROGRESS</small>
              <b>
                {garage.stage} <span>/ {target.next}</span>
              </b>
            </div>
            <strong>{progress}%</strong>
          </div>
          <div className="progress">
            <i style={{ width: `${progress}%` }} />
          </div>
          <div className="next-goal">
            <span>→</span>
            <div>
              <small>NEXT TARGET</small>
              <b>
                {target.next}ステージ到達で {target.label}
              </b>
              <em>{target.tip}</em>
            </div>
          </div>
        </aside>
      </section>

      <section className="ticker">
        <span>NOW TRENDING</span>
        <div>01　秋名山・夜間ブラインド攻略</div>
        <div>02　初心者向け車種ガイド（AE86 / EG6）</div>
        <div>03　碓氷ヘアピンのブレーキング</div>
      </section>

      <section className="section" id="guides">
        <div className="section-title">
          <div>
            <p className="kicker">COURSE GUIDE</p>
            <h2>
              峠を知れば、
              <br />
              <em>もっと速くなる。</em>
            </h2>
          </div>
          <p>
            壁接触を減らし、出口速度を上げる。
            <br />
            まずは得意な峠をひとつ作ろう。
          </p>
        </div>
        <div className="course-grid">
          {courses.map((course, index) => (
            <article className={`course-card ${course.color}`} key={course.name}>
              <div className="course-number">0{index + 1}</div>
              <div className="course-route">
                <i />
                <i />
                <i />
              </div>
              <p>{course.level}</p>
              <h3>{course.name}</h3>
              <span>{course.sub}</span>
              <dl>
                <div>
                  <dt>推奨設定</dt>
                  <dd>{course.tune}</dd>
                </div>
                <div>
                  <dt>練習テーマ</dt>
                  <dd>{course.note}</dd>
                </div>
              </dl>
              <a href={course.href}>
                攻略を見る <b>↗</b>
              </a>
            </article>
          ))}
        </div>
      </section>

      <section className="section dark-panel" id="cars">
        <div className="section-title">
          <div>
            <p className="kicker">MACHINE DATABASE</p>
            <h2>
              相棒を、<em>見つける。</em>
            </h2>
          </div>
          <a className="outline-button" href="/guides/beginner-cars">
            初心者向け車種 →
          </a>
        </div>
        <div className="car-list">
          {cars.map((car) => (
            <article key={car[0]}>
              <span className="car-no">{car[0]}</span>
              <div className="car-icon">◇</div>
              <div className="car-name">
                <small>{car[1]}</small>
                <h3>{car[2]}</h3>
                <span>{car[3]}</span>
              </div>
              <div className="car-stat">
                <small>特徴</small>
                <b>{car[4]}</b>
              </div>
              <div className="car-rate">
                <small>初心者おすすめ</small>
                <b>{car[5]}</b>
              </div>
              <a href="/guides/beginner-cars" aria-label={`${car[2]}を見る`}>
                ↗
              </a>
            </article>
          ))}
        </div>
      </section>

      <section className="section" id="community">
        <div className="section-title community-title">
          <div>
            <p className="kicker">COMMUNITY PASS</p>
            <h2>
              走りの答えは、
              <br />
              <em>ここに集まる。</em>
            </h2>
          </div>
          <button className="primary" onClick={() => setModal("post")}>
            ＋ 新しい投稿
          </button>
        </div>
        <div className="ugc-boost">
          <article className="daily-topic">
            <div>
              <span className="live-badge">TODAY&apos;S TOPIC</span>
              <p>今日のお題</p>
              <h3>あなたが最初に「壁接触ゼロ」を達成した峠は？</h3>
            </div>
            <button
              onClick={() => {
                setPostSeed("初めて壁接触ゼロを達成した峠");
                setModal("post");
              }}
            >
              お題に答える →
            </button>
          </article>
          <article className="contribution-card">
            <p className="kicker">YOUR CONTRIBUTION</p>
            <strong>
              {posts.filter((post) => post.author.includes(garage.name)).length}
            </strong>
            <span>POSTS</span>
            <div>
              <b>次のバッジまであと1投稿</b>
              <i>
                <em />
              </i>
            </div>
          </article>
          <article className="answer-call">
            <p className="kicker">PASS SUPPORT</p>
            <strong>
              {
                posts.filter(
                  (post) =>
                    post.category === "質問・相談" && post.replies === 0,
                ).length
              }
            </strong>
            <span>未回答の質問</span>
            <button onClick={() => setPostFilter("未回答")}>
              最初の回答者になる →
            </button>
          </article>
        </div>
        <div className="engagement-grid">
          <section className="poll-panel">
            <div className="panel-heading">
              <div>
                <p className="kicker">WEEKLY POLL</p>
                <h3>初心者にすすめたい1台は？</h3>
              </div>
              <span>
                {pollCars.reduce((sum, car) => sum + car.votes, 0) +
                  (vote ? 1 : 0)}{" "}
                VOTES
              </span>
            </div>
            <div className="poll-options">
              {pollCars.map((car) => {
                const votes = car.votes + (vote === car.name ? 1 : 0);
                const total =
                  pollCars.reduce((sum, item) => sum + item.votes, 0) +
                  (vote ? 1 : 0);
                return (
                  <button
                    className={vote === car.name ? "selected" : ""}
                    disabled={Boolean(vote)}
                    onClick={() => castVote(car.name)}
                    key={car.name}
                  >
                    <span>{car.name}</span>
                    <i>
                      <em style={{ width: `${Math.round((votes / total) * 100)}%` }} />
                    </i>
                    <b>{Math.round((votes / total) * 100)}%</b>
                  </button>
                );
              })}
            </div>
            <p className="vote-note">
              {vote
                ? `「${vote}」に投票しました。`
                : "タップするだけで投票できます。結果は投票後も表示されます。"}
            </p>
          </section>
          <section className="ranking-panel">
            <div className="panel-heading">
              <div>
                <p className="kicker">PASS RANKING</p>
                <h3>今週の貢献ドライバー</h3>
              </div>
              <span>WEEKLY</span>
            </div>
            <ol>
              {contributors.map((driver) => (
                <li key={driver.rank}>
                  <strong>0{driver.rank}</strong>
                  <div>
                    <b>{driver.name}</b>
                    <span>{driver.badge}</span>
                  </div>
                  <em>{driver.score.toLocaleString()} PT</em>
                </li>
              ))}
            </ol>
            <p>投稿・回答・共感された回数からポイントを集計</p>
          </section>
        </div>
        <div className="community-tools">
          <div className="filters">
            {["すべて", "攻略情報", "質問・相談", "未回答", "対戦募集"].map(
              (filter) => (
                <button
                  className={postFilter === filter ? "active" : ""}
                  onClick={() => setPostFilter(filter)}
                  key={filter}
                >
                  {filter}
                </button>
              ),
            )}
          </div>
          <label className="search">
            ⌕
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="投稿を検索"
            />
          </label>
        </div>
        <div className="post-grid">
          {filteredPosts.map((post) => (
            <article key={post.id}>
              <div className="post-meta">
                <span>{post.category}</span>
                <time>{post.time}</time>
              </div>
              <h3>{post.title}</h3>
              <p>{post.body}</p>
              <div className="tags">
                {post.tags.map((tag) => (
                  <span key={tag}>#{tag}</span>
                ))}
              </div>
              <footer>
                <b>{post.author}</b>
                <div className="post-actions">
                  <span>↳ {post.replies}</span>
                  <button
                    aria-label={`${post.title}に共感する`}
                    onClick={() => {
                      const updated = posts.map((item) =>
                        item.id === post.id
                          ? { ...item, likes: item.likes + 1 }
                          : item,
                      );
                      setPosts(updated);
                      localStorage.setItem(
                        STORAGE.posts,
                        JSON.stringify(updated),
                      );
                    }}
                  >
                    ♡ {post.likes}
                  </button>
                </div>
              </footer>
            </article>
          ))}
        </div>
        {filteredPosts.length === 0 && (
          <div className="empty-posts">
            <p>この条件の投稿はまだありません。</p>
            <button onClick={() => setModal("post")}>最初の投稿をする →</button>
          </div>
        )}
      </section>

      <section className="section revenue-section" id="support">
        <div className="section-title">
          <div>
            <p className="kicker">SUPPORT THE PASS</p>
            <h2>
              この場所を、
              <br />
              <em>一緒に育てる。</em>
            </h2>
          </div>
          <p>
            攻略情報はこれまで通り無料。
            <br />
            応援とパートナー掲載が運営を支えます。
          </p>
        </div>
        <div className="revenue-grid">
          <article className="support-plan">
            <div className="revenue-label">FOR DRIVERS</div>
            <p className="kicker">PASS CREW MEMBERSHIP</p>
            <h3>パッスクルー</h3>
            <div className="price">
              <strong>¥390</strong>
              <span>/ 月</span>
            </div>
            <ul>
              <li>プロフィールに限定バッジ</li>
              <li>広告を控えめに表示</li>
              <li>新機能への先行投票</li>
              <li>月次の活動レポート</li>
            </ul>
            <a className="revenue-cta" href={revenueLinks.support}>
              サポーターになる →
            </a>
            <small>いつでも解除できます</small>
          </article>
          <article className="gear-guide">
            <div className="revenue-label pr">AFFILIATE</div>
            <p className="kicker">DRIVER&apos;S GEAR</p>
            <h3>プレイを快適にするギア</h3>
            <p>
              手の滑りを抑えるグローブ、アーケードカードケース、イヤホンなど、プレイヤー目線で選んだアイテムを紹介。
            </p>
            <div className="gear-items">
              <span>01　ドライビンググローブ</span>
              <span>02　アーケードカードケース</span>
              <span>03　有線イヤホン</span>
            </div>
            <a
              className="revenue-cta secondary-cta"
              href={revenueLinks.gear}
              target="_blank"
              rel="nofollow sponsored noopener"
            >
              おすすめギアを見る ↗
            </a>
            <small>購入により運営者へ紹介料が入る場合があります</small>
          </article>
          <article className="partner-plan">
            <div className="revenue-label sponsor">FOR PARTNERS</div>
            <p className="kicker">SPONSORED PASS</p>
            <h3>店舗・イベント掲載</h3>
            <p>
              大会、交流会、ゲームセンターの情報を、地域とプレイヤー層に合わせて届けます。
            </p>
            <dl>
              <div>
                <dt>掲載枠</dt>
                <dd>トップ / 地域 / 募集</dd>
              </div>
              <div>
                <dt>レポート</dt>
                <dd>表示・クリック数</dd>
              </div>
              <div>
                <dt>表記</dt>
                <dd>PRを明示</dd>
              </div>
            </dl>
            <a className="revenue-cta secondary-cta" href={revenueLinks.partner}>
              掲載を相談する →
            </a>
            <small>内容を確認してから掲載します</small>
          </article>
        </div>
        <p className="revenue-policy">
          TOGE BASEは、広告や提携の有無によって攻略評価を変更しません。広告・アフィリエイト・スポンサー投稿には「PR」を明記します。詳細は
          <a href="/affiliate-disclosure">広告・アフィリエイト表記</a>
          をご覧ください。
        </p>
      </section>

      <section className="cta">
        <p className="kicker">YOUR NEXT RUN STARTS HERE</p>
        <h2>
          次の1プレイを、
          <br />
          <em>今日より速く。</em>
        </h2>
        <p>現在の進捗を記録すると、次にやるべきことが見えてくる。</p>
        <button className="primary" onClick={() => setModal("garage")}>
          マイガレージを更新 <span>→</span>
        </button>
      </section>

      <footer className="footer">
        <div className="brand">
          <span className="brand-mark">
            <i />
          </span>
          <span>
            TOGE <b>BASE</b>
          </span>
        </div>
        <p>
          ファンによる非公式コミュニティサイトです。ゲームメーカーおよび権利者各社とは関係ありません。
          <br />
          ゲーム名、車名、商標等は各権利者に帰属します。
        </p>
        <div>
          <a href="#guides">攻略</a>
          <a href="/about">サイトについて</a>
          <a href="/privacy">プライバシー</a>
          <a href="/terms">利用規約</a>
          <a href="/affiliate-disclosure">広告表記</a>
          <a href="#support">運営を支援</a>
        </div>
      </footer>

      <nav className="mobile-nav">
        {(
          [
            ["⌂", "ホーム", "top"],
            ["⌁", "攻略", "guides"],
            ["＋", "投稿", "post"],
            ["♢", "ガレージ", "garage"],
          ] as const
        ).map(([icon, label, id]) => (
          <button
            onClick={() =>
              id === "post" || id === "garage"
                ? setModal(id)
                : jump(label, id)
            }
            key={label}
          >
            <b>{icon}</b>
            {label}
          </button>
        ))}
      </nav>

      {modal && (
        <div
          className="modal-backdrop"
          role="presentation"
          onMouseDown={() => setModal(null)}
        >
          <section
            className="modal"
            role="dialog"
            aria-modal="true"
            aria-label={
              modal === "garage" ? "マイガレージを編集" : "新しい投稿"
            }
            onMouseDown={(e) => e.stopPropagation()}
          >
            <button className="modal-close" onClick={() => setModal(null)}>
              ×
            </button>
            {modal === "garage" ? (
              <>
                <p className="kicker">MY GARAGE</p>
                <h2>進捗を更新する</h2>
                <form onSubmit={saveGarage}>
                  <label>
                    プレイヤーネーム
                    <input name="name" defaultValue={garage.name} required />
                  </label>
                  <div className="form-row">
                    <label>
                      ランク
                      <input name="rank" defaultValue={garage.rank} required />
                    </label>
                    <label>
                      クリアステージ数
                      <input
                        name="stage"
                        type="number"
                        min="0"
                        max="100"
                        defaultValue={garage.stage}
                        required
                      />
                    </label>
                  </div>
                  <label>
                    使用車種
                    <input name="car" defaultValue={garage.car} required />
                  </label>
                  <label>
                    練習中の峠
                    <select name="course" defaultValue={garage.course}>
                      {courses.map((c) => (
                        <option key={c.name}>{c.name}</option>
                      ))}
                    </select>
                  </label>
                  <button className="primary">保存する →</button>
                </form>
              </>
            ) : (
              <>
                <p className="kicker">NEW POST</p>
                <h2>コミュニティへ投稿</h2>
                {postSeed && (
                  <p className="post-prompt">今日のお題：{postSeed}</p>
                )}
                <form onSubmit={addPost}>
                  <label>
                    カテゴリー
                    <select name="category">
                      <option>攻略情報</option>
                      <option>質問・相談</option>
                      <option>対戦募集</option>
                      <option>店舗情報</option>
                    </select>
                  </label>
                  <label>
                    タイトル
                    <input
                      name="title"
                      defaultValue={postSeed}
                      required
                      placeholder="聞きたいこと・共有したいこと"
                    />
                  </label>
                  <label>
                    本文
                    <textarea
                      name="body"
                      required
                      rows={4}
                      placeholder="プレイヤーに伝わるように詳しく書いてください"
                    />
                  </label>
                  <label>
                    タグ
                    <input
                      name="tag"
                      defaultValue={postSeed ? "今日のお題" : ""}
                      placeholder="例：秋名山、初心者"
                    />
                  </label>
                  <button className="primary">投稿する →</button>
                </form>
              </>
            )}
          </section>
        </div>
      )}
    </main>
  );
}
