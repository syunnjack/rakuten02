"use client";

import { BOOTH_ITEMS, BOOTH_SHOP_URL, boothRel } from "../booth";

type BoothSoftCtaProps = {
  variant?: "inline" | "strip" | "guide";
  guideTitle?: string;
};

export function BoothSoftCta({
  variant = "strip",
  guideTitle,
}: BoothSoftCtaProps) {
  if (variant === "inline") {
    return (
      <p className="booth-inline">
        <span className="booth-pr">PR</span>
        練習メモは{" "}
        <a href={BOOTH_SHOP_URL} target="_blank" rel={boothRel}>
          BOOTH
        </a>{" "}
        でも公開しています。
      </p>
    );
  }

  if (variant === "guide") {
    const item = BOOTH_ITEMS[0];
    return (
      <aside className="booth-guide-note" aria-label="BOOTHのおすすめ">
        <div>
          <span className="booth-pr">PR</span>
          <p className="kicker">PASS NOTES ON BOOTH</p>
          <h3>
            {guideTitle
              ? `「${guideTitle}」の続きをメモで残す`
              : "攻略の続きをメモで残す"}
          </h3>
          <p>
            サイトの攻略は無料のまま。手元に残したい人向けに、{item.label}
            などをBOOTHで静かに公開しています。
          </p>
        </div>
        <a href={item.href} target="_blank" rel={boothRel}>
          BOOTHで見る ↗
        </a>
      </aside>
    );
  }

  return (
    <aside className="booth-strip" aria-label="BOOTHショップ">
      <div className="booth-strip-copy">
        <span className="booth-pr">PR</span>
        <p className="kicker">BOOTH</p>
        <p>
          攻略本文は無料。応援したいときだけ、峠メモやチェックリストをBOOTHからどうぞ。
        </p>
      </div>
      <div className="booth-strip-items">
        {BOOTH_ITEMS.map((item) => (
          <a key={item.id} href={item.href} target="_blank" rel={boothRel}>
            <b>{item.label}</b>
            <span>{item.blurb}</span>
          </a>
        ))}
      </div>
      <a className="booth-strip-shop" href={BOOTH_SHOP_URL} target="_blank" rel={boothRel}>
        ショップを開く →
      </a>
    </aside>
  );
}
