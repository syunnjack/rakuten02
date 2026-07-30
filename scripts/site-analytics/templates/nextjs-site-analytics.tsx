import Script from "next/script";

type SiteAnalyticsProps = {
  measurementId?: string;
  siteVerification?: string;
};

export function SiteAnalytics({ measurementId, siteVerification }: SiteAnalyticsProps) {
  const gaId = measurementId ?? process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_MEASUREMENT_ID;
  const gsc = siteVerification ?? process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION;

  return (
    <>
      {gsc ? <meta name="google-site-verification" content={gsc} /> : null}
      {gaId ? (
        <>
          <Script async src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`} />
          <Script id="ga4-init">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${gaId}');
            `}
          </Script>
        </>
      ) : null}
    </>
  );
}

// Usage in app/layout.tsx:
// import { SiteAnalytics } from "@/components/SiteAnalytics";
// export default function RootLayout({ children }) {
//   return (
//     <html lang="ja">
//       <head><SiteAnalytics /></head>
//       <body>{children}</body>
//     </html>
//   );
// }
