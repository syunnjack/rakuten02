/** BOOTH shop / product URLs for subtle revenue paths. */

export const BOOTH_SHOP_URL =
  process.env.NEXT_PUBLIC_BOOTH_SHOP_URL?.trim() ||
  "https://togebase.booth.pm";

export const BOOTH_ITEMS = [
  {
    id: "pass-notes",
    label: "峠メモセット",
    blurb: "秋名・碓氷の進入メモを1枚にまとめた練習用データ",
    href:
      process.env.NEXT_PUBLIC_BOOTH_ITEM_NOTES_URL?.trim() || BOOTH_SHOP_URL,
  },
  {
    id: "beginner-checklist",
    label: "初心者チェックリスト",
    blurb: "壁接触を減らすための確認リスト（印刷・端末保存向け）",
    href:
      process.env.NEXT_PUBLIC_BOOTH_ITEM_CHECKLIST_URL?.trim() || BOOTH_SHOP_URL,
  },
  {
    id: "support-pack",
    label: "応援パック",
    blurb: "サイト運営を支えるデジタル応援アイテム",
    href:
      process.env.NEXT_PUBLIC_BOOTH_ITEM_SUPPORT_URL?.trim() || BOOTH_SHOP_URL,
  },
] as const;

export const boothRel = "nofollow sponsored noopener" as const;
