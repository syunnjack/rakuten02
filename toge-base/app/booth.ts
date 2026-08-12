/** BOOTH shop catalog for TOGE BASE sales paths. */

export const BOOTH_SHOP_URL =
  process.env.NEXT_PUBLIC_BOOTH_SHOP_URL?.trim() ||
  "https://togebase.booth.pm";

export const boothRel = "nofollow sponsored noopener" as const;

export type BoothProduct = {
  id: string;
  slug: string;
  label: string;
  title: string;
  priceLabel: string;
  priceNote: string;
  blurb: string;
  contents: string[];
  audience: string[];
  href: string;
  fileHint: string;
};

const COMMON_LEAD =
  "本商品はファン運営サイト「TOGE BASE」の任意購入コンテンツです。公式ではありません。ゲームメーカーおよび権利者各社とは関係ありません。";

const COMMON_NOTES = [
  "アーケード仕様の変更により内容が古くなる場合があります",
  "攻略の基本情報は https://togepass.jp/ で無料公開しています",
  "本データは個人利用向けです",
];

export const BOOTH_PRODUCTS: BoothProduct[] = [
  {
    id: "pass-notes",
    slug: "pass-notes",
    label: "峠メモセット",
    title: "【TOGE BASE】秋名・碓氷 練習メモセット（デジタル）",
    priceLabel: "¥300〜",
    priceNote: "価格目安 ¥300〜¥500（BOOTH側で設定）",
    blurb: "秋名・碓氷の進入チェックと練習メニューをまとめたデジタルメモ。",
    contents: [
      "秋名山の進入チェック／よくあるミス表／練習メニュー",
      "碓氷峠の進入チェック／よくあるミス表／練習メニュー",
      "今日の1テーマ例と記録欄",
    ],
    audience: [
      "壁接触を減らしたい",
      "タイムより先に姿勢を安定させたい",
      "プレイ後に振り返りを残したい",
    ],
    href:
      process.env.NEXT_PUBLIC_BOOTH_ITEM_NOTES_URL?.trim() || BOOTH_SHOP_URL,
    fileHint: "booth-products/01-pass-notes/",
  },
  {
    id: "beginner-checklist",
    slug: "beginner-checklist",
    label: "初心者チェックリスト",
    title: "【TOGE BASE】壁接触を減らす初心者チェックリスト",
    priceLabel: "¥200〜",
    priceNote: "価格目安 ¥200〜¥400（BOOTH側で設定）",
    blurb: "段階別チェックとセッション記録で、練習のテーマぶれを防ぐリスト。",
    contents: [
      "段階0〜3のチェックリスト",
      "セッション記録シート",
      "おすすめ初期ルート（秋名→碓氷）",
    ],
    audience: [
      "何から練習すればいいか迷っている",
      "毎回テーマがぶれる",
      "完走の安定を先に作りたい",
    ],
    href:
      process.env.NEXT_PUBLIC_BOOTH_ITEM_CHECKLIST_URL?.trim() ||
      BOOTH_SHOP_URL,
    fileHint: "booth-products/02-beginner-checklist/",
  },
  {
    id: "support-pack",
    slug: "support-pack",
    label: "応援パック",
    title: "【TOGE BASE】運営応援パック（お礼データ付き）",
    priceLabel: "¥500〜",
    priceNote: "価格目安 ¥500〜¥1,000（応援額として設定）",
    blurb: "サイト運営を支える任意応援パック。お礼データと投稿テンプレ付き。",
    contents: [
      "応援お礼メッセージ",
      "短縮チェック（今日の3点）",
      "壁接触レビュー質問",
      "コミュニティ投稿テンプレ",
    ],
    audience: [
      "無料攻略を続けてほしい",
      "運営をさりげなく応援したい",
      "投稿テンプレがほしい",
    ],
    href:
      process.env.NEXT_PUBLIC_BOOTH_ITEM_SUPPORT_URL?.trim() || BOOTH_SHOP_URL,
    fileHint: "booth-products/03-support-pack/",
  },
];

/** Compact list used by home strip / support cards. */
export const BOOTH_ITEMS = BOOTH_PRODUCTS.map((product) => ({
  id: product.id,
  label: product.label,
  blurb: product.blurb,
  href: product.href,
}));

export function getBoothProduct(slug: string) {
  return BOOTH_PRODUCTS.find((product) => product.slug === slug);
}

export function boothDescription(product: BoothProduct) {
  const contents = product.contents.map((line) => `・${line}`).join("\n");
  const audience = product.audience.map((line) => `・${line}`).join("\n");
  const notes = COMMON_NOTES.map((line) => `・${line}`).join("\n");
  return `${COMMON_LEAD}

■内容
${contents}

■こんな人向け
${audience}

■注意
${notes}`;
}

export { COMMON_LEAD, COMMON_NOTES };
