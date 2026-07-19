import { listFolders, listMedia } from "@/lib/data/media";
import MediaManager from "@/components/admin/media/MediaManager";

export default async function MediaAdminPage() {
  const [media, folders] = await Promise.all([listMedia(), listFolders()]);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight text-navy-950 dark:text-white">
          Medya Kütüphanesi
        </h1>
        <p className="mt-1 text-sm text-muted">
          Görselleri yükleyin, klasörleyin, kullanılmayanları temizleyin.
        </p>
      </div>
      <MediaManager initialMedia={media} folders={folders} />
    </div>
  );
}
