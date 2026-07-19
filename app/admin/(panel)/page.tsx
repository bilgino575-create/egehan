import Link from "next/link";
import {
  AlertTriangle,
  CheckCircle2,
  Eye,
  FileQuestion,
  Gauge,
  Images,
  Inbox,
  MapPin,
  ShieldQuestion,
  Sparkles,
  Users,
} from "lucide-react";
import { getDashboardData } from "@/lib/data/dashboard";
import StatCard from "@/components/admin/StatCard";
import PageviewChart from "@/components/admin/PageviewChart";
import sitemap from "@/app/sitemap";
import robots from "@/app/robots";

export default async function AdminDashboardPage() {
  const data = await getDashboardData();
  const sitemapEntries = await sitemap();
  const robotsRules = await robots();

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight text-navy-950 dark:text-white">
          Dashboard
        </h1>
        <p className="mt-1 text-sm text-muted">Sitenin canlı özeti ve son hareketler.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard icon={Inbox} label="Bugünkü Talepler" value={data.contacts.today} hint={`${data.contacts.unread} okunmadı`} />
        <StatCard icon={Inbox} label="Haftalık Talepler" value={data.contacts.week} accent="navy" />
        <StatCard icon={Inbox} label="Aylık Talepler" value={data.contacts.month} accent="navy" />
        <StatCard icon={Inbox} label="Toplam Talep" value={data.contacts.total} accent="emerald" />

        <StatCard icon={Eye} label="Bugünkü Ziyaretçi" value={data.pageviews.today} />
        <StatCard icon={Eye} label="Haftalık Ziyaretçi" value={data.pageviews.week} accent="navy" />
        <StatCard icon={Eye} label="Toplam Ziyaretçi" value={data.pageviews.total} accent="emerald" />
        <StatCard
          icon={Gauge}
          label="SEO Skoru"
          value={data.seoScore ? `${data.seoScore.score}/100` : "—"}
          hint={data.seoScore && data.seoScore.warnings.length > 0 ? `${data.seoScore.warnings.length} uyarı` : "Sorun yok"}
          accent={data.seoScore && data.seoScore.score < 60 ? "red" : "emerald"}
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="glass rounded-2xl p-5 lg:col-span-2">
          <h2 className="text-sm font-extrabold text-navy-950 dark:text-white">Son 7 Gün Ziyaretçi</h2>
          <PageviewChart data={data.pageviews.series} />
        </div>

        <div className="glass flex flex-col gap-3 rounded-2xl p-5">
          <h2 className="text-sm font-extrabold text-navy-950 dark:text-white">Sistem Durumu</h2>
          <div className="flex items-center gap-2.5 rounded-xl border border-navy-950/10 p-3 text-sm dark:border-white/10">
            <MapPin className="size-4.5 shrink-0 text-emerald-500" aria-hidden="true" />
            <span className="flex-1">Sitemap</span>
            <span className="font-bold text-emerald-600 dark:text-emerald-400">OK · {sitemapEntries.length} URL</span>
          </div>
          <div className="flex items-center gap-2.5 rounded-xl border border-navy-950/10 p-3 text-sm dark:border-white/10">
            <ShieldQuestion className="size-4.5 shrink-0 text-emerald-500" aria-hidden="true" />
            <span className="flex-1">Robots.txt</span>
            <span className="font-bold text-emerald-600 dark:text-emerald-400">
              OK · {robotsRules.rules && Array.isArray(robotsRules.rules) ? robotsRules.rules.length : 1} kural
            </span>
          </div>
          <div className="flex items-center gap-2.5 rounded-xl border border-navy-950/10 p-3 text-sm dark:border-white/10">
            <CheckCircle2 className="size-4.5 shrink-0 text-emerald-500" aria-hidden="true" />
            <span className="flex-1">SSL</span>
            <span className="font-bold text-emerald-600 dark:text-emerald-400">Vercel yönetiyor</span>
          </div>
          <div className="flex items-center gap-2.5 rounded-xl border border-dashed border-navy-950/15 p-3 text-sm text-muted dark:border-white/15">
            <AlertTriangle className="size-4.5 shrink-0" aria-hidden="true" />
            <span className="flex-1">Google Index Durumu</span>
            <span className="font-semibold">Bağlı değil</span>
          </div>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <StatCard icon={Sparkles} label="Aktif Hizmet" value={data.content.services} />
        <StatCard icon={FileQuestion} label="Aktif SSS" value={data.content.faq} />
        <StatCard icon={Users} label="Yorum" value={data.content.testimonials} />
        <StatCard icon={Images} label="Medya" value={data.content.media} />
        <StatCard icon={Users} label="Aktif Kullanıcı" value={data.content.users} />
      </div>

      {data.seoScore && data.seoScore.warnings.length > 0 && (
        <div className="glass rounded-2xl p-5">
          <h2 className="text-sm font-extrabold text-navy-950 dark:text-white">SEO Uyarıları</h2>
          <ul className="mt-3 flex flex-col gap-2">
            {data.seoScore.warnings.map((w) => (
              <li key={w} className="flex items-start gap-2 text-sm text-muted">
                <AlertTriangle className="mt-0.5 size-4 shrink-0 text-amber-500" aria-hidden="true" />
                {w}
              </li>
            ))}
          </ul>
          <Link href="/admin/seo" className="mt-4 inline-block text-sm font-bold text-orange-600 hover:text-orange-500 dark:text-orange-400">
            SEO ayarlarını düzenle →
          </Link>
        </div>
      )}

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="glass rounded-2xl p-5">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-extrabold text-navy-950 dark:text-white">Son İletişim Formları</h2>
            <Link href="/admin/inbox" className="text-xs font-bold text-orange-600 hover:text-orange-500 dark:text-orange-400">
              Tümü →
            </Link>
          </div>
          <ul className="mt-3 flex flex-col divide-y divide-navy-950/5 dark:divide-white/10">
            {data.recentContacts.length === 0 && (
              <li className="py-3 text-sm text-muted">Henüz iletişim formu gönderilmedi.</li>
            )}
            {data.recentContacts.map((c) => (
              <li key={c.id} className="flex items-center justify-between gap-3 py-3">
                <div>
                  <p className="text-sm font-bold text-navy-950 dark:text-white">{c.name}</p>
                  <p className="text-xs text-muted">{c.service ?? "—"}</p>
                </div>
                <span className="text-xs text-muted">
                  {new Date(c.createdAt).toLocaleDateString("tr-TR")}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className="glass rounded-2xl p-5">
          <h2 className="text-sm font-extrabold text-navy-950 dark:text-white">Son Aktiviteler</h2>
          <ul className="mt-3 flex flex-col divide-y divide-navy-950/5 dark:divide-white/10">
            {data.recentActivity.length === 0 && (
              <li className="py-3 text-sm text-muted">Henüz aktivite kaydı yok.</li>
            )}
            {data.recentActivity.map((a) => (
              <li key={a.id} className="flex items-center justify-between gap-3 py-3">
                <div>
                  <p className="text-sm font-bold text-navy-950 dark:text-white">{a.action}</p>
                  <p className="text-xs text-muted">{a.user?.name ?? "Sistem"}</p>
                </div>
                <span className="text-xs text-muted">
                  {new Date(a.createdAt).toLocaleString("tr-TR")}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {data.lastLogin && (
        <p className="text-xs text-muted">
          Son admin girişi: <strong>{data.lastLogin.name}</strong> —{" "}
          {data.lastLogin.lastLoginAt?.toLocaleString("tr-TR")}
        </p>
      )}
    </div>
  );
}
