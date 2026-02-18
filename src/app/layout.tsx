import type { Metadata } from "next";
import "./globals.css";
import Script from "next/script";

export const metadata: Metadata = {
  title: "Imagen Website Template",
  description: "The ultimate web template designed for UI/UX, product designers, photographers, and creatives. Elevate your portfolio with stunning visuals, showcase your design expertise, and present your impactful case studies and outcomes like never before.",
  generator: "Framer 62e4d63",
  robots: "max-image-preview:large",
  icons: {
    icon: [
      { url: "https://framerusercontent.com/images/Dot3958ygJOFRVjSqVniGvBYIm8.png", media: "(prefers-color-scheme: light)" },
      { url: "https://framerusercontent.com/images/Dot3958ygJOFRVjSqVniGvBYIm8.png", media: "(prefers-color-scheme: dark)" }
    ]
  },
  openGraph: {
    type: "website",
    title: "Imagen Website Template",
    description: "The ultimate web template designed for UI/UX, product designers, photographers, and creatives. Elevate your portfolio with stunning visuals, showcase your design expertise, and present your impactful case studies and outcomes like never before.",
    images: ["https://framerusercontent.com/assets/rgrLNiio26kbWFOTMwdno6GuI.png"],
    url: "https://imagen-temlis.framer.website/"
  },
  twitter: {
    card: "summary_large_image",
    title: "Imagen Website Template",
    description: "The ultimate web template designed for UI/UX, product designers, photographers, and creatives. Elevate your portfolio with stunning visuals, showcase your design expertise, and present your impactful case studies and outcomes like never before.",
    images: ["https://framerusercontent.com/assets/rgrLNiio26kbWFOTMwdno6GuI.png"]
  },
  other: {
    "framer-search-index": "https://framerusercontent.com/sites/lgACSsffkWShHr5FjQKim/searchIndex-fUoVeQIO9vZ8.json",
    "framer-search-index-fallback": "https://framerusercontent.com/sites/lgACSsffkWShHr5FjQKim/searchIndex-laVSiFEeHZlO.json",
    "framer-html-plugin": "disable"
  }
};

export default function RootLayout({
  children,
  sidebar,
  content,
}: Readonly<{
  children: React.ReactNode;
  sidebar: React.ReactNode;
  content: React.ReactNode;
}>){
  return (
    <html lang="en">
      <head>
        <link href="https://fonts.gstatic.com" rel="preconnect" crossOrigin="" />
        <link rel="canonical" href="https://imagen-temlis.framer.website/" />
        <Script id="framer-editorbar-check" strategy="beforeInteractive">
          {`try { if (localStorage.get("__framer_force_showing_editorbar_since")) { const n = document.createElement("link"); n.rel = "modulepreload"; n.href = "https://framer.com/edit/init.mjs"; document.head.appendChild(n) } } catch (e) { }`}
        </Script>
      </head>
      <body>
        <Script
          async
          src="https://events.framer.com/script?v=2"
          data-fid="3e9c2d90335cfd678dc10a2bdc4617446706d51c62bf8e5d60a5ff03e38c208d"
          data-no-nt=""
        />
        <div id="main"
          data-framer-hydrate-v2='{"routeId":"augiA20Il","localeId":"default","breakpoints":[{"hash":"72rtr7","mediaQuery":"(min-width: 1200px)"},{"hash":"ih24pf","mediaQuery":"(min-width: 810px) and (max-width: 1199px)"},{"hash":"3ud5uq","mediaQuery":"(max-width: 809px)"},{"hash":"10mb1y6","mediaQuery":"(min-width: 1200px)"},{"hash":"hfs46s","mediaQuery":"(min-width: 810px) and (max-width: 1199.98px)"},{"hash":"182i2eb","mediaQuery":"(max-width: 809.98px)"}]}'
          data-framer-ssr-released-at="2025-10-10T00:35:35.953Z"
          data-framer-page-optimized-at="2025-10-10T17:52:44.432Z"
          data-framer-generated-page="">
          {/* $*/}
          <div className="framer-DpqqR framer-10mb1y6" data-layout-template="true"
            style={{ 
              minHeight: "100vh", 
              width: "auto",
              overflow: "visible",
              height: "auto",
              alignItems: "flex-start"
            }}>
            {sidebar}
            {content}
            <div id="overlay"></div>
          </div>
          <div id="template-overlay"></div>
          {/* /$*/}
        </div>
      </body>
    </html>
  );
}
