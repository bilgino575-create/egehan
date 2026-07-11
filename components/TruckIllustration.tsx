/**
 * Hero için hafif, tema uyumlu SVG kamyon illüstrasyonu.
 * Fotoğraf yerine SVG: sıfır ağ isteği, keskin görüntü, mükemmel LCP.
 */
export default function TruckIllustration() {
  return (
    <svg
      viewBox="0 0 760 460"
      role="img"
      aria-label="Egehan Lojistik nakliye kamyonu illüstrasyonu"
      className="h-auto w-full select-none"
    >
      <defs>
        <linearGradient id="trailerGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#28325a" />
          <stop offset="100%" stopColor="#141c3f" />
        </linearGradient>
        <linearGradient id="cabGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#fb923c" />
          <stop offset="100%" stopColor="#ea580c" />
        </linearGradient>
        <linearGradient id="glassGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#dbeafe" />
          <stop offset="100%" stopColor="#93c5fd" />
        </linearGradient>
      </defs>

      {/* Gökyüzü detayları */}
      <ellipse cx="150" cy="64" rx="64" ry="17" className="fill-navy-100 dark:fill-white/5" />
      <ellipse cx="216" cy="78" rx="44" ry="13" className="fill-navy-100/70 dark:fill-white/5" />
      <ellipse cx="560" cy="48" rx="52" ry="14" className="fill-navy-100/80 dark:fill-white/5" />
      <circle cx="682" cy="76" r="26" className="fill-orange-400/90" />
      <circle cx="682" cy="76" r="36" className="fill-none stroke-orange-400/30" strokeWidth="3" />

      {/* Rota çizgisi */}
      <path
        d="M70 104 C 230 46, 470 44, 636 106"
        className="stroke-orange-400/50"
        strokeWidth="3"
        strokeLinecap="round"
        strokeDasharray="1 13"
        fill="none"
      />
      <circle cx="636" cy="106" r="6" className="fill-orange-500" />
      <circle cx="70" cy="104" r="4" className="fill-navy-300 dark:fill-navy-500" />

      {/* Hız çizgileri */}
      <g strokeLinecap="round" strokeWidth="7">
        <line x1="14" y1="196" x2="56" y2="196" className="animate-pulse stroke-orange-400/50" />
        <line x1="4" y1="234" x2="60" y2="234" className="animate-pulse stroke-navy-300/70 dark:stroke-navy-500/50" style={{ animationDelay: "0.5s" }} />
        <line x1="20" y1="272" x2="54" y2="272" className="animate-pulse stroke-orange-400/40" style={{ animationDelay: "1s" }} />
      </g>

      {/* Zemin */}
      <ellipse cx="400" cy="398" rx="310" ry="15" className="fill-navy-950/10 dark:fill-black/40" />
      <line x1="36" y1="392" x2="724" y2="392" className="stroke-navy-200 dark:stroke-white/10" strokeWidth="5" strokeLinecap="round" strokeDasharray="46 26" />

      {/* Dorse */}
      <rect x="70" y="130" width="400" height="190" rx="16" fill="url(#trailerGrad)" />
      <rect x="70.5" y="130.5" width="399" height="189" rx="15.5" fill="none" stroke="#ffffff" strokeOpacity="0.06" />
      <g stroke="#ffffff" strokeOpacity="0.05" strokeWidth="2">
        <line x1="110" y1="142" x2="110" y2="308" />
        <line x1="150" y1="142" x2="150" y2="308" />
        <line x1="390" y1="142" x2="390" y2="308" />
        <line x1="430" y1="142" x2="430" y2="308" />
      </g>
      <text
        x="270"
        y="216"
        textAnchor="middle"
        fill="#ffffff"
        fontSize="46"
        fontWeight="800"
        letterSpacing="3"
      >
        EGEHAN
      </text>
      <text
        x="270"
        y="252"
        textAnchor="middle"
        fill="#f97316"
        fontSize="19"
        fontWeight="700"
        letterSpacing="9"
      >
        LOJİSTİK
      </text>
      <rect x="82" y="292" width="376" height="8" rx="4" fill="#f97316" fillOpacity="0.9" />
      <rect x="386" y="148" width="64" height="26" rx="13" fill="#ffffff" fillOpacity="0.1" />
      <text x="418" y="166" textAnchor="middle" fill="#ffffff" fontSize="13" fontWeight="700" letterSpacing="1">
        81 İL
      </text>

      {/* Şasi bağlantısı */}
      <rect x="452" y="282" width="76" height="38" rx="6" fill="#10173a" />

      {/* Çekici kabin */}
      <path
        d="M480 320 L480 190 Q480 176 494 176 L560 176 Q574 176 583 187 L622 236 Q628 244 628 254 L628 320 Z"
        fill="url(#cabGrad)"
      />
      <path
        d="M497 192 L552 192 Q560 192 565 199 L590 232 Q593 238 585 238 L497 238 Q492 238 492 233 L492 197 Q492 192 497 192 Z"
        fill="url(#glassGrad)"
      />
      <line x1="505" y1="196" x2="530" y2="234" stroke="#ffffff" strokeOpacity="0.55" strokeWidth="5" strokeLinecap="round" />
      <line x1="540" y1="238" x2="540" y2="298" stroke="#c2410c" strokeOpacity="0.55" strokeWidth="2.5" />
      <rect x="548" y="250" width="16" height="5" rx="2.5" fill="#7c2d12" fillOpacity="0.55" />
      <rect x="488" y="306" width="66" height="20" rx="10" fill="#3b4a7a" />
      <rect x="598" y="298" width="44" height="18" rx="7" fill="#cbd5e1" />
      <rect x="616" y="260" width="12" height="17" rx="3" fill="#fde68a" />
      <path d="M630 260 L722 248 L722 290 L630 278 Z" className="fill-orange-400/15" />

      {/* Tekerlekler */}
      {[150, 228, 505, 596].map((cx) => (
        <g key={cx}>
          <circle cx={cx} cy="354" r="37" fill="#0b1024" />
          <circle cx={cx} cy="354" r="36.5" fill="none" stroke="#ffffff" strokeOpacity="0.08" />
          <circle cx={cx} cy="354" r="17" fill="#e2e8f0" />
          <circle cx={cx} cy="354" r="7" fill="#f97316" />
        </g>
      ))}
    </svg>
  );
}
