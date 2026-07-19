import {
  Award,
  Boxes,
  Building2,
  CalendarClock,
  Check,
  CheckCircle2,
  ClipboardCheck,
  Clock,
  Globe,
  Headset,
  Home,
  MapPin,
  Package,
  PackageCheck,
  PackageOpen,
  Phone,
  Route,
  Shield,
  ShieldCheck,
  Sparkles,
  Star,
  Truck,
  Users,
  Wallet,
  Warehouse,
  type LucideIcon,
} from "lucide-react";

/**
 * Whitelist of icons that can be stored (as a string key) on Service /
 * WhyUsCard / ProcessStep rows and resolved back to a component at render
 * time. Postgres can't store a React component, so admin UI icon pickers
 * are constrained to this map.
 */
export const ICON_MAP: Record<string, LucideIcon> = {
  Award,
  Boxes,
  Building2,
  CalendarClock,
  Check,
  CheckCircle2,
  ClipboardCheck,
  Clock,
  Globe,
  Headset,
  Home,
  MapPin,
  Package,
  PackageCheck,
  PackageOpen,
  Phone,
  Route,
  Shield,
  ShieldCheck,
  Sparkles,
  Star,
  Truck,
  Users,
  Wallet,
  Warehouse,
};

export const ICON_NAMES = Object.keys(ICON_MAP);

export function resolveIcon(name: string | null | undefined): LucideIcon {
  return (name && ICON_MAP[name]) || Package;
}
