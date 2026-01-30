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
import { routeMeta } from "./user-nav-data";

export function UserTitlebar() {
  const pathname = usePathname();

  const currentMeta = routeMeta.find((meta) => meta.matcher(pathname));
  const breadcrumbs = currentMeta?.breadcrumbs ?? [
    { label: "User", href: "/user" },
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
                  <BreadcrumbLink href={crumb.href ?? "/user"}>
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
