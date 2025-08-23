// SEO metadata configuration
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Brutalist Portfolio - Next.js Developer",
  description:
    "A sophisticated brutalist portfolio showcasing modern web development expertise",
  keywords: [
    "Next.js",
    "React",
    "TypeScript",
    "Brutalist Design",
    "Web Development",
  ],
  authors: [{ name: "Portfolio Owner" }],
  creator: "Portfolio Owner",
  publisher: "Portfolio Owner",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://your-domain.com"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://your-domain.com",
    title: "Brutalist Portfolio - Next.js Developer",
    description:
      "A sophisticated brutalist portfolio showcasing modern web development expertise",
    siteName: "Brutalist Portfolio",
  },
  twitter: {
    card: "summary_large_image",
    title: "Brutalist Portfolio - Next.js Developer",
    description:
      "A sophisticated brutalist portfolio showcasing modern web development expertise",
    creator: "@your-twitter",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};
