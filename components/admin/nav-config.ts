import type { LucideIcon } from "lucide-react";
import {
  Activity,
  FileQuestion,
  Home,
  Images,
  Inbox,
  LayoutDashboard,
  ListTree,
  MessageSquareQuote,
  Route,
  Search,
  Settings,
  ShieldCheck,
  Sparkles,
  Users,
} from "lucide-react";
import type { Role } from "@/lib/generated/prisma/client";

export interface AdminNavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  roles: Role[];
}

export interface AdminNavGroup {
  label: string;
  items: AdminNavItem[];
}

const ALL: Role[] = ["ADMIN", "EDITOR", "SEO", "CONTENT_EDITOR", "SUPPORT"];
const EDITORS: Role[] = ["ADMIN", "EDITOR", "CONTENT_EDITOR"];

export const ADMIN_NAV: AdminNavGroup[] = [
  {
    label: "Genel",
    items: [{ label: "Dashboard", href: "/admin", icon: LayoutDashboard, roles: ALL }],
  },
  {
    label: "İçerik Yönetimi",
    items: [
      { label: "Ana Sayfa (Hero)", href: "/admin/content/hero", icon: Home, roles: EDITORS },
      { label: "Hizmetler", href: "/admin/content/services", icon: Sparkles, roles: EDITORS },
      { label: "Neden Biz", href: "/admin/content/why-us", icon: ShieldCheck, roles: EDITORS },
      { label: "Çalışma Süreci", href: "/admin/content/process", icon: Route, roles: EDITORS },
      { label: "SSS", href: "/admin/content/faq", icon: FileQuestion, roles: EDITORS },
      { label: "Yorumlar", href: "/admin/content/testimonials", icon: MessageSquareQuote, roles: EDITORS },
      { label: "Menü", href: "/admin/content/nav", icon: ListTree, roles: EDITORS },
    ],
  },
  {
    label: "Yönetim",
    items: [
      { label: "Medya Kütüphanesi", href: "/admin/media", icon: Images, roles: EDITORS },
      { label: "Gelen Kutusu", href: "/admin/inbox", icon: Inbox, roles: ["ADMIN", "EDITOR", "SUPPORT"] },
      { label: "SEO", href: "/admin/seo", icon: Search, roles: ["ADMIN", "SEO"] },
    ],
  },
  {
    label: "Sistem",
    items: [
      { label: "Ayarlar", href: "/admin/settings", icon: Settings, roles: ["ADMIN"] },
      { label: "Kullanıcılar", href: "/admin/users", icon: Users, roles: ["ADMIN"] },
      { label: "Aktivite Günlüğü", href: "/admin/activity", icon: Activity, roles: ["ADMIN"] },
    ],
  },
];
