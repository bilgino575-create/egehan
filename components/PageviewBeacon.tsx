"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export default function PageviewBeacon() {
  const pathname = usePathname();

  useEffect(() => {
    const payload = JSON.stringify({ path: pathname, referrer: document.referrer || undefined });
    const blob = new Blob([payload], { type: "application/json" });
    if (navigator.sendBeacon) {
      navigator.sendBeacon("/api/track", blob);
    } else {
      fetch("/api/track", { method: "POST", body: payload, keepalive: true }).catch(() => {});
    }
  }, [pathname]);

  return null;
}
