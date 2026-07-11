import { Phone } from "lucide-react";
import WhatsAppIcon from "@/components/icons/WhatsAppIcon";
import { TEL_HREF, WHATSAPP_HREF } from "@/lib/site";

/**
 * Sitedeki tek doğrudan arama noktaları: telefon ve WhatsApp floating
 * butonları. Numara hiçbir yerde metin olarak gösterilmez.
 */
export default function FloatingButtons() {
  return (
    <div
      className="fixed bottom-5 right-5 z-50 flex flex-col items-center gap-3 pb-[env(safe-area-inset-bottom)]"
      role="group"
      aria-label="Hızlı iletişim"
    >
      <a
        href={TEL_HREF}
        aria-label="Bizi telefonla arayın"
        title="Hemen Arayın"
        className="grid size-14 animate-rise place-items-center rounded-full bg-navy-950 text-white shadow-xl shadow-navy-950/30 ring-1 ring-white/20 transition-transform duration-200 hover:scale-105 active:scale-95 dark:bg-orange-500 dark:shadow-orange-500/25 dark:ring-orange-300/40"
        style={{ animationDelay: "0.9s" }}
      >
        <Phone className="size-6" aria-hidden="true" />
      </a>
      <a
        href={WHATSAPP_HREF}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="WhatsApp üzerinden bize yazın"
        title="WhatsApp'tan Yazın"
        className="relative grid size-14 animate-rise place-items-center rounded-full bg-[#25d366] text-white shadow-xl shadow-[#25d366]/40 transition-transform duration-200 hover:scale-105 active:scale-95"
        style={{ animationDelay: "0.7s" }}
      >
        <span
          className="absolute inset-0 animate-ping-slow rounded-full bg-[#25d366]"
          aria-hidden="true"
        />
        <WhatsAppIcon className="relative size-7" />
      </a>
    </div>
  );
}
