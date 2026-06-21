import { LandingHeader } from "@/components/landing/landing-header";
import { Footer } from "@/components/landing/footer";

export default function LandingLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <LandingHeader />
      <main className="flex-1">{children}</main>
      <Footer />
    </>
  );
}
