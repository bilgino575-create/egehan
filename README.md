# Egehan Lojistik — Kurumsal Web Sitesi

**81 İlde Güvenli ve Profesyonel Taşımacılık**

Next.js 15 (App Router), React 19, TypeScript, Tailwind CSS v4 ve Framer Motion
ile geliştirilmiş; SEO uyumlu, mobil öncelikli, koyu tema destekli tek sayfalık
kurumsal lojistik sitesi.

## Geliştirme

```bash
npm install
npm run dev      # http://localhost:3000
```

## Production

```bash
npm run build
npm run start
```

## Vercel'e Deploy

Proje ek yapılandırma gerektirmez; depoyu Vercel'e bağlayıp **Deploy**
demeniz yeterlidir (Framework Preset: Next.js otomatik algılanır).

## Özelleştirme

| Ne | Nerede |
| --- | --- |
| Telefon / WhatsApp numarası | [lib/site.ts](lib/site.ts) — `PHONE_E164` |
| Alan adı (canonical, sitemap, OG) | [lib/site.ts](lib/site.ts) — `SITE_URL` |
| SSS, yorumlar, iller, istatistikler | [lib/content.ts](lib/content.ts) |
| Hizmet kartları | [components/Services.tsx](components/Services.tsx) |
| Renkler ve tema | [app/globals.css](app/globals.css) (`--color-navy-*`) |

## Önemli Kural: Telefon Numarası

Telefon numarası sitede **hiçbir yerde metin olarak gösterilmez** — JSON-LD
şemalarına dahi eklenmemiştir. Numara yalnızca `tel:` ve `wa.me` bağlantı
adreslerinde (href) bulunur; kullanıcılar telefon ve WhatsApp butonlarına
tıklayarak ulaşır. Bu kuralı bozmamak için numarayı yalnızca
[lib/site.ts](lib/site.ts) üzerinden kullanın.

## Teknik Özellikler

- **SEO**: metadata + Open Graph + Twitter Card, `robots.txt`, `sitemap.xml`,
  JSON-LD (`MovingCompany` + `FAQPage`), canonical URL
- **Performans**: statik ön-render (SSG), inline SVG illüstrasyon (LCP için
  görsel indirme yok), `next/font` ile kendinden barındırılan font,
  LazyMotion ile küçültülmüş animasyon paketi
- **Erişilebilirlik**: semantik HTML, WCAG uyumlu kontrast, klavye odak
  stilleri, `aria-*` etiketleri, `prefers-reduced-motion` desteği,
  içeriğe atlama bağlantısı
- **Koyu tema**: sistem tercihini izler, elle değiştirilebilir,
  `localStorage`'da saklanır, FOUC engellenir
