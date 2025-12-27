import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Script from "next/script";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "JARCOS",
  description: "JARCOS is a design practice led by João Ferreira, a Brazilian multidisciplinary designer with over 14 years of experience in branding and digital design.",
  generator: "Framer 569fd08",
  robots: "max-image-preview:large",
  openGraph: {
    type: "website",
    title: "JARCOS",
    description: "JARCOS is a design practice led by João Ferreira, a Brazilian multidisciplinary designer with over 14 years of experience in branding and digital design.",
    images: [
      {
        url: "https://framerusercontent.com/images/KzbPKaxMBB9pggMU52SND3kyRtE.png",
      },
    ],
    url: "https://jarcos.work/",
  },
  twitter: {
    card: "summary_large_image",
    title: "JARCOS",
    description: "JARCOS is a design practice led by João Ferreira, a Brazilian multidisciplinary designer with over 14 years of experience in branding and digital design.",
    images: ["https://framerusercontent.com/images/KzbPKaxMBB9pggMU52SND3kyRtE.png"],
  },
  other: {
    "framer-search-index": "https://framerusercontent.com/sites/4zHLQ5JKcTmZixCag7pCtz/searchIndex-dvgMy3SuszCg.json",
    "framer-search-index-fallback": "https://framerusercontent.com/sites/4zHLQ5JKcTmZixCag7pCtz/searchIndex-cXTGFU6bMlY9.json",
  },
  icons: [
    {
      url: "https://framerusercontent.com/images/yl03VZZolpRkWUTB2jeEPPtmocQ.png",
      media: "(prefers-color-scheme: light)",
    },
    {
      url: "https://framerusercontent.com/images/yl03VZZolpRkWUTB2jeEPPtmocQ.png",
      media: "(prefers-color-scheme: dark)",
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-redirect-timezone="1" className="lenis lenis-smooth">
      <head>
        <link rel="canonical" href="https://jarcos.work/" />
        <link 
          rel="modulepreload" 
          href="https://framer.com/edit/init.mjs"
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        
        {/* Google Analytics */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-2VYGG1ZWE3"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-2VYGG1ZWE3');
          `}
        </Script>

        {/* Framer Editor Bar Script */}
        <Script id="framer-editor" strategy="beforeInteractive">
          {`
            try { 
              if (localStorage.getItem("__framer_force_showing_editorbar_since")) { 
                const n = document.createElement("link"); 
                n.rel = "modulepreload"; 
                n.href = "https://framer.com/edit/init.mjs"; 
                document.head.appendChild(n);
              } 
            } catch (e) { 
              // Silent fail
            }
          `}
        </Script>
      </body>
    </html>
  );
}
