import { UserAuthProvider } from "./userAuthProvider";

export default async function UserLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <UserAuthProvider>
      {children}
    </UserAuthProvider>
  );
}
