import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { UserButton } from "@daveyplate/better-auth-ui";
import { auth } from "@/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { UserSidebarNav } from "./_components/user-sidebar-nav";
import { UserTitlebar } from "./_components/user-titlebar";

export default async function UserLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    return redirect("/");
  }

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <div className="h-12 bg-indigo-600 text-white rounded text-xl flex items-center justify-center font-bold">
            User Portal
          </div>
        </SidebarHeader>
        <SidebarContent>
          <UserSidebarNav />
        </SidebarContent>
        <SidebarFooter></SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator
            orientation="vertical"
            className="mr-2 data-[orientation=vertical]:h-4"
          />
          <div className="flex flex-1">
            <UserTitlebar />
          </div>
          <UserButton size={"default"} />
        </header>
        <main className="w-full p-4">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
