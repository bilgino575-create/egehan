"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/actions/session";
import { logActivity } from "@/lib/activity-log";

const optionalStr = z.string().max(4000).optional().nullable();

const settingsSchema = z.object({
  siteName: z.string().min(1).max(120),
  siteSlogan: z.string().min(1).max(200),
  siteDescription: z.string().min(1).max(600),
  siteUrl: z.string().url(),
  phoneE164: z
    .string()
    .regex(/^[1-9][0-9]{7,14}$/, "Uluslararası formatta, boşluksuz ve + olmadan girin (örn. 905551234567)."),
  email: optionalStr,
  addressLine: optionalStr,
  mapEmbedUrl: optionalStr,
  workingHours: optionalStr,
  logoMediaId: optionalStr,
  faviconMediaId: optionalStr,
  instagramUrl: optionalStr,
  facebookUrl: optionalStr,
  twitterUrl: optionalStr,
  linkedinUrl: optionalStr,
  kvkkText: optionalStr,
  cookieText: optionalStr,
  privacyText: optionalStr,
  themePrimaryHex: optionalStr,
  themeAccentHex: optionalStr,
  headScripts: optionalStr,
  bodyScripts: optionalStr,
  footerScripts: optionalStr,
  gaId: optionalStr,
  gtmId: optionalStr,
  gscVerification: optionalStr,
  merchantId: optionalStr,
  googleAdsId: optionalStr,
  businessProfileId: optionalStr,
  recaptchaSiteKey: optionalStr,
  recaptchaSecret: optionalStr,
});

export type SettingsInput = z.infer<typeof settingsSchema>;

export async function updateSettings(input: SettingsInput) {
  const user = await requireUser(["ADMIN"]);
  const data = settingsSchema.parse(input);

  const settings = await prisma.settings.upsert({
    where: { id: "singleton" },
    create: { id: "singleton", ...data, updatedById: user.id },
    update: { ...data, updatedById: user.id },
  });

  await logActivity({ userId: user.id, action: "settings.update", entityType: "Settings", entityId: "singleton" });
  revalidatePath("/");
  revalidatePath("/admin/settings");
  return settings;
}
