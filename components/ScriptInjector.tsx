"use client";

import { useEffect } from "react";

/**
 * Admin ayarlarında serbest metin olarak saklanan <script> parçalarını
 * (GTM/GA vb.) gerçek, çalışan script node'ları olarak enjekte eder —
 * dangerouslySetInnerHTML script etiketlerini çalıştırmaz, DOM API'siyle
 * yeniden oluşturmak gerekir.
 */
export default function ScriptInjector({
  html,
  target,
}: {
  html: string | null | undefined;
  target: "head" | "body-start" | "body-end";
}) {
  useEffect(() => {
    if (!html?.trim()) return;

    const container = document.createElement("div");
    container.innerHTML = html;
    const mountPoint = target === "head" ? document.head : document.body;
    const injected: Node[] = [];

    const insert = (node: Node) => {
      if (target === "body-start") {
        mountPoint.insertBefore(node, mountPoint.firstChild);
      } else {
        mountPoint.appendChild(node);
      }
    };

    for (const node of Array.from(container.childNodes)) {
      if (node.nodeName === "SCRIPT") {
        const old = node as HTMLScriptElement;
        const script = document.createElement("script");
        for (const attr of Array.from(old.attributes)) {
          script.setAttribute(attr.name, attr.value);
        }
        script.text = old.textContent ?? "";
        insert(script);
        injected.push(script);
      } else {
        const clone = node.cloneNode(true);
        insert(clone);
        injected.push(clone);
      }
    }

    return () => {
      injected.forEach((n) => n.parentNode?.removeChild(n));
    };
  }, [html, target]);

  return null;
}
