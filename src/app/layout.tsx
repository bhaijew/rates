import type { Metadata, Viewport } from "next";
import { Poppins, Cinzel, Cormorant_Garamond } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import Header from "@/components/Header";
import SiteLoader from "@/components/SiteLoader";

const poppins = Poppins({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-poppins",
  display: "swap",
});

const cinzel = Cinzel({
  weight: ["400", "500", "600", "700", "800"],
  subsets: ["latin"],
  variable: "--font-cinzel",
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-numbers",
  display: "swap",
});

const notche = localFont({
  src: [
    {
      path: "../../public/fonts/CFNotcheDemo-Regular.otf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/fonts/CFNotcheDemo-Bold.otf",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-notche",
  display: "swap",
});

const rugis = localFont({
  src: [
    {
      path: "../../public/fonts/Rugis.otf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/fonts/Rugis-Alt.otf",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-rugis",
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: "#dfcca6",
};

export const metadata: Metadata = {
  metadataBase: new URL("https://bhaijeweller.com"),
  title: "Bhai Jeweller - Live Gold & Silver Rates (GBP)",
  description: "Live gold and silver bullion market rates in pounds (GBP) at Bhai Jeweller. Check rates per gram, traditional tola (11.66g), 10g tola and troy ounce, updated live.",
  manifest: "/manifest.json",
  openGraph: {
    title: "Bhai Jeweller - Live Gold & Silver Rates (GBP)",
    description: "Live gold and silver bullion market rates in pounds (GBP) at Bhai Jeweller. Check rates per gram, tola and ounce.",
    url: "https://bhaijeweller.com",
    siteName: "Bhai Jeweller",
    images: [
      {
        url: "/logo.svg",
        width: 800,
        height: 600,
        alt: "Bhai Jeweller Logo",
      },
    ],
    locale: "en_GB",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Bhai Jeweller - Live Gold & Silver Rates (GBP)",
    description: "Live gold and silver bullion market rates in pounds (GBP) at Bhai Jeweller.",
    images: ["/logo.svg"],
  },
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/favicon.ico", sizes: "any" },
    ],
    shortcut: "/favicon.ico",
    apple: "/icon.svg",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "name": "Bhai Jeweller",
        "url": "https://bhaijeweller.com",
      },
      {
        "@type": "JewelryStore",
        "name": "Bhai Jeweller",
        "url": "https://bhaijeweller.com",
        "logo": "https://bhaijeweller.com/logo.svg",
        "description": "Live gold and silver bullion rates, investment gold bars, coins and scrap gold valuation.",
        "currenciesAccepted": "GBP",
      },
    ],
  };

  return (
    <html
      lang="en"
      className={`${notche.variable} ${cinzel.variable} ${cormorant.variable} ${rugis.variable} ${poppins.variable} font-sans`}
      suppressHydrationWarning
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body
        className="bg-white text-slate-800 min-h-screen flex flex-col font-sans"
        suppressHydrationWarning
      >
        <SiteLoader />
        <Header />
        <main className="flex-1">{children}</main>
      </body>
    </html>
  );
}
