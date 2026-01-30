import type { LucideIcon } from "lucide-react";
import { Home, Bell, Activity, User, Shield } from "lucide-react";

export interface NavItem {
  title: string;
  href: string;
  icon?: LucideIcon;
  isActive: (path: string) => boolean;
}

export interface NavGroup {
  title: string;
  items: NavItem[];
}

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export interface RouteMeta {
  title: string;
  breadcrumbs: BreadcrumbItem[];
  matcher: (path: string) => boolean;
}

const USER_ROOT: BreadcrumbItem = { label: "User", href: "/user" };

export const navGroups: NavGroup[] = [
  {
    title: "Overview",
    items: [
      {
        title: "Dashboard",
        href: "/user",
        icon: Home,
        isActive: (path) => path === "/user" || path === "/user/",
      },
      {
        title: "Activity",
        href: "/user/activity",
        icon: Activity,
        isActive: (path) => path === "/user/activity",
      },
      {
        title: "Notifications",
        href: "/user/notifications",
        icon: Bell,
        isActive: (path) => path === "/user/notifications",
      },
    ],
  },
  {
    title: "My Account",
    items: [
      {
        title: "Settings",
        href: "/user/account/settings",
        icon: User,
        isActive: (path) => path === "/user/account/settings",
      },
      {
        title: "Security",
        href: "/user/account/security",
        icon: Shield,
        isActive: (path) => path === "/user/account/security",
      },
    ],
  },
];

export const routeMeta: RouteMeta[] = [
  {
    title: "Dashboard",
    breadcrumbs: [USER_ROOT, { label: "Dashboard" }],
    matcher: (path) => path === "/user" || path === "/user/",
  },
  {
    title: "Activity",
    breadcrumbs: [USER_ROOT, { label: "Activity" }],
    matcher: (path) => path === "/user/activity",
  },
  {
    title: "Notifications",
    breadcrumbs: [USER_ROOT, { label: "Notifications" }],
    matcher: (path) => path === "/user/notifications",
  },
  {
    title: "Settings",
    breadcrumbs: [USER_ROOT, { label: "Settings" }],
    matcher: (path) => path === "/user/account/settings",
  },
  {
    title: "Security",
    breadcrumbs: [USER_ROOT, { label: "Security" }],
    matcher: (path) => path === "/user/account/security",
  },
  {
    title: "Account",
    breadcrumbs: [USER_ROOT, { label: "Account" }],
    matcher: (path) => path.startsWith("/user/account/"),
  },
];
