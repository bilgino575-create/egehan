import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { SITE_SLOGAN } from "@/lib/site";

export const alt = `Egehan Lojistik — ${SITE_SLOGAN}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const CHIPS = ["Sigortalı Taşıma", "7/24 Destek", "Ücretsiz Keşif"];

export default async function OpengraphImage() {
  const [extraBold, medium] = await Promise.all([
    readFile(
      join(process.cwd(), "assets", "fonts", "PlusJakartaSans-ExtraBold.ttf")
    ),
    readFile(
      join(process.cwd(), "assets", "fonts", "PlusJakartaSans-Medium.ttf")
    ),
  ]);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "64px 72px",
          background: "linear-gradient(135deg, #0c1330 0%, #141c3f 55%, #28325a 100%)",
          color: "#ffffff",
          fontFamily: "Jakarta",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: -160,
            right: -120,
            width: 480,
            height: 480,
            borderRadius: 9999,
            background:
              "radial-gradient(circle at center, rgba(249,115,22,0.35), rgba(249,115,22,0) 70%)",
          }}
        />

        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 72,
              height: 72,
              borderRadius: 18,
              background: "rgba(255,255,255,0.08)",
              border: "1px solid rgba(255,255,255,0.15)",
            }}
          >
            <svg width="44" height="44" viewBox="0 0 64 64">
              <rect x="8" y="18" width="30" height="22" rx="4" fill="#ffffff" />
              <path
                d="M38 25h9.6a3 3 0 0 1 2.34 1.12l5.4 6.75A3 3 0 0 1 56 34.75V37a3 3 0 0 1-3 3H38V25Z"
                fill="#f97316"
              />
              <circle cx="19" cy="44" r="5.5" fill="#f97316" />
              <circle cx="19" cy="44" r="2" fill="#ffffff" />
              <circle cx="46" cy="44" r="5.5" fill="#f97316" />
              <circle cx="46" cy="44" r="2" fill="#ffffff" />
            </svg>
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ fontSize: 34, fontWeight: 800, display: "flex" }}>
              <span>Egehan</span>
              <span style={{ color: "#f97316", marginLeft: 10 }}>Lojistik</span>
            </div>
            <div
              style={{
                fontSize: 15,
                fontWeight: 500,
                letterSpacing: 4,
                color: "rgba(255,255,255,0.55)",
              }}
            >
              NAKLİYE & TAŞIMACILIK
            </div>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 22,
            maxWidth: 860,
          }}
        >
          <div style={{ fontSize: 66, fontWeight: 800, lineHeight: 1.15 }}>
            {SITE_SLOGAN}
          </div>
          <div
            style={{
              fontSize: 27,
              fontWeight: 500,
              color: "rgba(255,255,255,0.7)",
            }}
          >
            Evden Eve Nakliye • Parça Eşya • Ofis Taşıma
          </div>
        </div>

        <div style={{ display: "flex", gap: 16 }}>
          {CHIPS.map((chip) => (
            <div
              key={chip}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "12px 24px",
                borderRadius: 9999,
                border: "1px solid rgba(255,255,255,0.18)",
                background: "rgba(255,255,255,0.06)",
                fontSize: 21,
                fontWeight: 500,
              }}
            >
              <div
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: 9999,
                  background: "#f97316",
                }}
              />
              {chip}
            </div>
          ))}
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Jakarta", data: extraBold, weight: 800, style: "normal" },
        { name: "Jakarta", data: medium, weight: 500, style: "normal" },
      ],
    }
  );
}
