"use client";

import { LazyMotion, MotionConfig, domAnimation } from "framer-motion";
import type { ReactNode } from "react";

/**
 * Framer Motion özellikleri LazyMotion ile tembel yüklenir (küçük bundle),
 * reducedMotion="user" ile erişilebilirlik tercihi otomatik uygulanır.
 */
export default function MotionProvider({ children }: { children: ReactNode }) {
  return (
    <MotionConfig reducedMotion="user">
      <LazyMotion features={domAnimation} strict>
        {children}
      </LazyMotion>
    </MotionConfig>
  );
}
