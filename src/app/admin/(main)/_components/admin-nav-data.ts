import type { LucideIcon } from "lucide-react";
import { Home, Users, MessageSquare, User, Shield, Lock, FileText, Folder, Tag } from "lucide-react";

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

const ADMIN_ROOT: BreadcrumbItem = { label: "Admin", href: "/admin" };

export const navGroups: NavGroup[] = [
  {
    title: "Home",
    items: [
      {
        title: "Dashboard",
        href: "/admin",
        icon: Home,
        isActive: (path) => path === "/admin" || path === "/admin/",
      },
    ],
  },
  {
    title: "User Management",
    items: [
      {
        title: "List Users",
        href: "/admin/list-users",
        icon: Users,
        isActive: (path) => path === "/admin/list-users",
      },
      {
        title: "List Admins",
        href: "/admin/list-admins",
        icon: Shield,
        isActive: (path) => path === "/admin/list-admins",
      },
    ],
  },
  {
    title: "Blog",
    items: [
      {
        title: "Posts",
        href: "/admin/blog/posts",
        icon: FileText,
        isActive: (path) => path.startsWith("/admin/blog/posts"),
      },
      {
        title: "Categories",
        href: "/admin/blog/categories",
        icon: Folder,
        isActive: (path) => path === "/admin/blog/categories",
      },
      {
        title: "Tags",
        href: "/admin/blog/tags",
        icon: Tag,
        isActive: (path) => path === "/admin/blog/tags",
      },
    ],
  },
  {
    title: "Support",
    items: [
      {
        title: "Contact Submissions",
        href: "/admin/contact-us",
        icon: MessageSquare,
        isActive: (path) => path === "/admin/contact-us",
      },
    ],
  },
  {
    title: "My Account",
    items: [
      {
        title: "Account",
        href: "/admin/account/settings",
        icon: User,
        isActive: (path) => path === "/admin/account/settings",
      },
      {
        title: "Security",
        href: "/admin/account/security",
        icon: Lock,
        isActive: (path) => path === "/admin/account/security",
      },
    ],
  },
];

export const routeMeta: RouteMeta[] = [
  {
    title: "Dashboard",
    breadcrumbs: [ADMIN_ROOT, { label: "Dashboard" }],
    matcher: (path) => path === "/admin" || path === "/admin/",
  },
  {
    title: "List Users",
    breadcrumbs: [ADMIN_ROOT, { label: "List Users" }],
    matcher: (path) => path === "/admin/list-users",
  },
  {
    title: "List Admins",
    breadcrumbs: [ADMIN_ROOT, { label: "List Admins" }],
    matcher: (path) => path === "/admin/list-admins",
  },
  {
    title: "Contact Submissions",
    breadcrumbs: [ADMIN_ROOT, { label: "Contact Submissions" }],
    matcher: (path) => path === "/admin/contact-us",
  },
  {
    title: "Account",
    breadcrumbs: [ADMIN_ROOT, { label: "Account" }],
    matcher: (path) => path === "/admin/account/settings",
  },
  {
    title: "Security",
    breadcrumbs: [ADMIN_ROOT, { label: "Security" }],
    matcher: (path) => path === "/admin/account/security",
  },
  {
    title: "Add User",
    breadcrumbs: [ADMIN_ROOT, { label: "Add User" }],
    matcher: (path) => path === "/admin/user-details/new",
  },
  {
    title: "User Details",
    breadcrumbs: [ADMIN_ROOT, { label: "User Details" }],
    matcher: (path) => path.startsWith("/admin/user-details/"),
  },
  {
    title: "Blog Posts",
    breadcrumbs: [ADMIN_ROOT, { label: "Blog Posts" }],
    matcher: (path) => path === "/admin/blog/posts",
  },
  {
    title: "Create Post",
    breadcrumbs: [ADMIN_ROOT, { label: "Blog Posts", href: "/admin/blog/posts" }, { label: "Create Post" }],
    matcher: (path) => path === "/admin/blog/posts/create",
  },
  {
    title: "Edit Post",
    breadcrumbs: [ADMIN_ROOT, { label: "Blog Posts", href: "/admin/blog/posts" }, { label: "Edit Post" }],
    matcher: (path) => path.match(/^\/admin\/blog\/posts\/[^/]+\/edit$/) !== null,
  },
  {
    title: "Blog Categories",
    breadcrumbs: [ADMIN_ROOT, { label: "Blog Categories" }],
    matcher: (path) => path === "/admin/blog/categories",
  },
  {
    title: "Blog Tags",
    breadcrumbs: [ADMIN_ROOT, { label: "Blog Tags" }],
    matcher: (path) => path === "/admin/blog/tags",
  },
];
