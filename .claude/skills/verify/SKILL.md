---
name: verify
description: Egehan Lojistik sitesini production modda çalıştırıp uçtan uca doğrulama reçetesi
---

# Doğrulama Reçetesi

Tek sayfalık statik Next.js 15 sitesi. Sunucu yüzeyi HTTP'dir; ekran
görüntüsü için headless Edge kullanılır (bu makinede Playwright/Chrome yok).

## Build + çalıştırma

```powershell
npm run build                 # tamamı statik prerender olmalı (8/8)
npx next start -p 3210        # DİKKAT: proje kökünden çalıştırın (cwd kayarsa
                              # ".next bulunamadı" hatası verir)
```

## Zorunlu kontroller

1. **Telefon kuralı (kritik):** `curl -s http://localhost:3210/` çıktısında
   `905530503951` YALNIZCA `href="tel:..."` ve `href="https://wa.me/..."`
   içinde geçmeli. Script/style blokları ve tüm etiketler atıldıktan sonra
   kalan görünür metinde `553|3951|\+90` bulunmamalı; `title/aria-label/alt/
   placeholder` öznitelikleri ve JSON-LD blokları da taranmalı
   (JSON-LD'de `telephone` alanı bilinçli olarak yok).
2. Rotalar: `/robots.txt`, `/sitemap.xml`, `/icon.svg`, `/opengraph-image`
   (PNG, Türkçe karakterler `assets/fonts/*.ttf` ile render olur) → hepsi 200.
3. `html lang="tr"`, tek `<h1>`, 2 adet JSON-LD (`MovingCompany` + `FAQPage`).

## Ekran görüntüsü (headless Edge)

```powershell
& "C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe" `
  --headless --disable-gpu --no-first-run --no-sandbox `
  --user-data-dir="$env:TEMP\edge-verify" --hide-scrollbars `
  --virtual-time-budget=12000 --window-size=1440,6800 `
  --screenshot="$env:TEMP\site.png" "http://localhost:3210"
```

Tuzaklar:
- Önce asılı `msedge` süreçlerini öldürün; profil kilidi görüntü üretimini
  sessizce engelliyor. Her çekimde farklı `--user-data-dir` kullanmak güvenli.
- `--window-size` ~500px altına inmez (Chromium alt sınırı); 390px görüntü
  istenirse layout ~500px'te render olup kırpılır — bu bir site hatası değil.
- `--force-dark-mode` koyu temayı tetikler (prefers-color-scheme: dark).
- `--virtual-time-budget` Framer Motion reveal animasyonlarının bitmesini
  sağlar; verilmezse bölümler opacity:0 yakalanabilir.
