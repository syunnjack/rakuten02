export const SITE_NAME = "TOGE BASE";
export const SITE_DOMAIN = "togepass.jp";
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
  `https://${SITE_DOMAIN}`;
export const SITE_TAGLINE = "峠で、つながる。";
export const SITE_DESCRIPTION =
  "攻略を調べる、成長を記録する、仲間とつながる。イニシャルDプレイヤーのための非公式コミュニティサイト。";
export const SITE_SHORT_DESCRIPTION =
  "峠で、つながる。イニシャルDプレイヤーの攻略基地。";
export const GA_MEASUREMENT_ID =
  process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID?.trim() || "";
