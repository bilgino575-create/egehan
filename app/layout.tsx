import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import MotionProvider from "@/components/MotionProvider";
import ScriptInjector from "@/components/ScriptInjector";
import PageviewBeacon from "@/components/PageviewBeacon";
import { getSettings } from "@/lib/data/settings";
import { prisma } from "@/lib/prisma";

// Tüm site DB-driven (Settings dahil) — kök layout'ta zorlamak her alt
// segmentin build-time statik üretim yerine istek anında render edilmesini
// garanti eder.
export const dynamic = "force-dynamic";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin", "latin-ext"],
  variable: "--font-jakarta",
  display: "swap",
});

export async function generateMetadata(): Promise<Metadata> {
  const [settings, seo] = await Promise.all([
    getSettings(),
    prisma.seoMeta.findUnique({ where: { pageKey: "home" } }),
  ]);

  const title = seo?.title || `${settings.siteName} | ${settings.siteSlogan}`;
  const description = seo?.description || settings.siteDescription;

  return {
    metadataBase: new URL(settings.siteUrl),
    title: {
      default: title,
      template: `%s | ${settings.siteName}`,
    },
    description,
    keywords: seo?.keywords ?? [],
    alternates: {
      canonical: seo?.canonicalPath || "/",
    },
    openGraph: {
      type: "website",
      locale: "tr_TR",
      url: "/",
      siteName: settings.siteName,
      title: seo?.ogTitle || title,
      description: seo?.ogDescription || description,
    },
    twitter: {
      card: (seo?.twitterCard as "summary_large_image") || "summary_large_image",
      title: seo?.ogTitle || title,
      description: seo?.ogDescription || description,
    },
    robots: {
      index: seo?.robotsIndex ?? true,
      follow: seo?.robotsFollow ?? true,
      googleBot: {
        index: seo?.robotsIndex ?? true,
        follow: seo?.robotsFollow ?? true,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    other: settings.gscVerification
      ? { "google-site-verification": settings.gscVerification }
      : undefined,
  };
}

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

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const settings = await getSettings();

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
        <PageviewBeacon />
        <ScriptInjector html={settings.headScripts} target="head" />
        <ScriptInjector html={settings.bodyScripts} target="body-start" />
        <ScriptInjector html={settings.footerScripts} target="body-end" />
      </body>
    </html>
  );
}
