import Footer from "../../components/footer";
import LandingNavbar from "../../components/landing-navbar";

export default function LandingLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <LandingNavbar></LandingNavbar>
      <div className="max-w-screen-xl min-h-screen mx-auto p-4 sm:px-6 lg:px-8">{children}</div>
      <Footer></Footer>
    </>
  );
}
