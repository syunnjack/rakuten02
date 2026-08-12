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
        練習メモは <a href="/shop">ショップ</a> /{" "}
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
            などをショップで公開しています。
          </p>
        </div>
        <a href={`/shop/${item.id}`}>詳細を見る →</a>
      </aside>
    );
  }

  return (
    <aside className="booth-strip" aria-label="BOOTHショップ">
      <div className="booth-strip-copy">
        <span className="booth-pr">PR</span>
        <p className="kicker">SHOP / BOOTH</p>
        <p>
          攻略本文は無料。応援したいときだけ、峠メモやチェックリストをどうぞ。
        </p>
      </div>
      <div className="booth-strip-items">
        {BOOTH_ITEMS.map((item) => (
          <a key={item.id} href={`/shop/${item.id}`}>
            <b>{item.label}</b>
            <span>{item.blurb}</span>
          </a>
        ))}
      </div>
      <a className="booth-strip-shop" href="/shop">
        ショップを見る →
      </a>
    </aside>
  );
}
