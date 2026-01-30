"use client";

import { usePathname } from "next/navigation";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { routeMeta } from "./admin-nav-data";

export function AdminTitlebar() {
  const pathname = usePathname();

  const currentMeta = routeMeta.find((meta) => meta.matcher(pathname));
  const breadcrumbs = currentMeta?.breadcrumbs ?? [
    { label: "Admin", href: "/admin" },
    { label: "Dashboard" },
  ];

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {breadcrumbs.map((crumb, index) => {
          const isLast = index === breadcrumbs.length - 1;
          const itemClassName =
            index === 0 && breadcrumbs.length > 1 ? "hidden md:block" : undefined;
          const separatorClassName =
            index === 0 && breadcrumbs.length > 1 ? "hidden md:block" : undefined;

          return (
            <span key={`${crumb.label}-${index}`} className="contents">
              <BreadcrumbItem className={itemClassName}>
                {isLast ? (
                  <BreadcrumbPage>{crumb.label}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink href={crumb.href ?? "/admin"}>
                    {crumb.label}
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
              {!isLast && <BreadcrumbSeparator className={separatorClassName} />}
            </span>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
