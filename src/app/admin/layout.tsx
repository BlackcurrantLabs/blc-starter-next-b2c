import { AdminAuthProvider } from "./adminAuthProvider";

export default async function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <AdminAuthProvider>{children}</AdminAuthProvider>;
}
