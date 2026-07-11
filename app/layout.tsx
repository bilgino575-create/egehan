import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import MotionProvider from "@/components/MotionProvider";
import {
  SITE_DESCRIPTION,
  SITE_NAME,
  SITE_SLOGAN,
  SITE_URL,
} from "@/lib/site";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin", "latin-ext"],
  variable: "--font-jakarta",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} | ${SITE_SLOGAN}`,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  keywords: [
    "evden eve nakliyat",
    "şehirler arası nakliyat",
    "parça eşya taşıma",
    "ofis taşıma",
    "81 il nakliye",
    "sigortalı taşımacılık",
    "asansörlü taşıma",
    "nakliye firması",
    "Egehan Lojistik",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "tr_TR",
    url: "/",
    siteName: SITE_NAME,
    title: `${SITE_NAME} | ${SITE_SLOGAN}`,
    description: SITE_DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} | ${SITE_SLOGAN}`,
    description: SITE_DESCRIPTION,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  colorScheme: "light dark",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#080e24" },
  ],
};

/**
 * Tema tercihi ilk boyamadan önce uygulanır (FOUC engellenir).
 * Ayrıca no-js sınıfı kaldırılır; JS kapalıyken animasyonlu içerik
 * CSS tarafında görünür tutulur.
 */
const themeInitScript = `(function(){try{var e=document.documentElement;e.classList.remove("no-js");var t=null;try{t=localStorage.getItem("theme")}catch(o){}var d=t?t==="dark":window.matchMedia("(prefers-color-scheme: dark)").matches;e.classList.toggle("dark",d)}catch(o){}})();`;

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="tr"
      className={`${jakarta.variable} no-js`}
      suppressHydrationWarning
    >
      <body>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
        <a
          href="#icerik"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-100 focus:rounded-lg focus:bg-navy-950 focus:px-4 focus:py-2.5 focus:text-sm focus:font-bold focus:text-white"
        >
          İçeriğe geç
        </a>
        <MotionProvider>{children}</MotionProvider>
      </body>
    </html>
  );
}
