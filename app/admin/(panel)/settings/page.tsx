import { getSettings } from "@/lib/data/settings";
import SettingsManager from "@/components/admin/settings/SettingsManager";

export default async function SettingsAdminPage() {
  const settings = await getSettings();

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight text-navy-950 dark:text-white">
          Sistem Ayarları
        </h1>
        <p className="mt-1 text-sm text-muted">
          Site geneli ayarları, iletişim bilgilerini ve entegrasyonları yönetin.
        </p>
      </div>
      <SettingsManager initialSettings={settings} />
    </div>
  );
}
