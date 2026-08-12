import type { Metadata } from "next";
import "./globals.css";
import "./ugc.css";
import "./revenue.css";
import {
  GA_MEASUREMENT_ID,
  SITE_NAME,
  SITE_SHORT_DESCRIPTION,
  SITE_URL,
} from "./site";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: SITE_NAME, template: `%s｜${SITE_NAME}` },
  description: SITE_SHORT_DESCRIPTION,
  icons: { icon: "/favicon.svg", shortcut: "/favicon.svg" },
  alternates: { canonical: "/" },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const gaScript = GA_MEASUREMENT_ID
    ? `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${GA_MEASUREMENT_ID}');`
    : "";

  return (
    <html lang="ja">
      <head>
        {GA_MEASUREMENT_ID ? (
          <>
            <script
              async
              src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
            />
            <script dangerouslySetInnerHTML={{ __html: gaScript }} />
          </>
        ) : null}
      </head>
      <body>{children}</body>
    </html>
  );
}
