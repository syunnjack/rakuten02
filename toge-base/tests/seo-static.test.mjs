import assert from "node:assert/strict";
import { readFile, access } from "node:fs/promises";
import { join } from "node:path";
import test from "node:test";

const outRoot = new URL("../out/", import.meta.url);
const publicRoot = new URL("../public/", import.meta.url);

async function readOut(relativePath) {
  return readFile(new URL(relativePath, outRoot), "utf8");
}

test("static export includes home SEO signals", async () => {
  const html = await readOut("index.html");
  assert.match(html, /TOGE BASE/);
  assert.match(html, /峠で、つながる/);
  assert.match(html, /application\/ld\+json/);
  assert.match(html, /WebSite/);
  assert.match(html, /FAQPage/);
  assert.match(html, /og:title|property="og:title"/i);
});

test("guide pages are exported with article content", async () => {
  const html = await readOut("guides/akina.html").catch(() =>
    readOut("guides/akina/index.html"),
  );
  assert.match(html, /秋名山/);
  assert.match(html, /AI検索向けの要点/);
  assert.match(html, /Article/);
});

test("public SEO files exist", async () => {
  for (const file of ["robots.txt", "sitemap.xml", "llms.txt", "CNAME", "og.svg", "favicon.svg"]) {
    await access(new URL(file, publicRoot));
  }
  const robots = await readFile(new URL("robots.txt", publicRoot), "utf8");
  assert.match(robots, /Sitemap:\s*https:\/\/togepass\.jp\/sitemap\.xml/);
  const llms = await readFile(new URL("llms.txt", publicRoot), "utf8");
  assert.match(llms, /TOGE BASE/);
  assert.match(llms, /非公式/);
});

test("legal and disclosure pages export", async () => {
  for (const page of ["about", "privacy", "terms", "affiliate-disclosure"]) {
    const html = await readOut(`${page}.html`).catch(() =>
      readOut(`${page}/index.html`),
    );
    assert.match(html, /TOGE BASE|プライバシー|利用規約|アフィリエイト|非公式/);
  }
});

test("sitemap lists core URLs", async () => {
  const sitemap = await readFile(new URL("sitemap.xml", publicRoot), "utf8");
  for (const path of ["/", "/guides/akina", "/arcades", "/arcades/tokyo", "/about", "/llms.txt"]) {
    assert.match(sitemap, new RegExp(`https://togepass\\.jp${path === "/" ? "/" : path}`));
  }
});

test("arcade location pages export nationwide data", async () => {
  const index = await readOut("arcades.html").catch(() =>
    readOut("arcades/index.html"),
  );
  assert.match(index, /全国の設置店舗|設置店舗/);
  assert.match(index, /CollectionPage|ItemList|AmusementArcade|店舗/);

  const tokyo = await readOut("arcades/tokyo.html").catch(() =>
    readOut("arcades/tokyo/index.html"),
  );
  assert.match(tokyo, /東京都/);
  assert.match(tokyo, /ＧｉＧＯ総本店|GiGO総本店|総本店/);
  assert.match(tokyo, /AmusementArcade|ItemList/);

  const locations = JSON.parse(
    await readFile(new URL("../app/arcades/locations.json", import.meta.url), "utf8"),
  );
  assert.equal(locations.prefectures.length, 47);
  assert.ok(locations.totalStores > 500);
});

test("booth soft revenue paths are present", async () => {
  const html = await readOut("index.html");
  assert.match(html, /BOOTH|ショップ/);
  assert.match(html, /booth\.pm|PASS NOTES|峠メモ|SHOP/);
  assert.match(html, /nofollow sponsored noopener|\/shop/);

  const guide = await readOut("guides/akina.html").catch(() =>
    readOut("guides/akina/index.html"),
  );
  assert.match(guide, /BOOTH|PASS NOTES|ショップ/);

  const disclosure = await readOut("affiliate-disclosure.html").catch(() =>
    readOut("affiliate-disclosure/index.html"),
  );
  assert.match(disclosure, /BOOTH/);
});

test("shop pages list three booth products", async () => {
  const shop = await readOut("shop.html").catch(() =>
    readOut("shop/index.html"),
  );
  assert.match(shop, /秋名・碓氷 練習メモセット/);
  assert.match(shop, /壁接触を減らす初心者チェックリスト/);
  assert.match(shop, /運営応援パック/);
  assert.match(shop, /BOOTHで購入/);
  assert.match(shop, /Product|ItemList/);

  const notes = await readOut("shop/pass-notes.html").catch(() =>
    readOut("shop/pass-notes/index.html"),
  );
  assert.match(notes, /秋名山の進入チェック/);
  assert.match(notes, /nofollow sponsored noopener/);
});

test("package identity is toge-base", async () => {
  const pkg = JSON.parse(
    await readFile(new URL("../package.json", import.meta.url), "utf8"),
  );
  assert.equal(pkg.name, "toge-base");
  await access(join(new URL("../app/", import.meta.url).pathname, "toge-app.tsx"));
});
