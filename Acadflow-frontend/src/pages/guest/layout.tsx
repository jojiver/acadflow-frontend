import { Outlet } from "react-router";
import { LandingNav } from "@/components/features/home/landing-nav";
import { LandingFooter } from "@/components/features/home/landing-footer";

export default function GuestLayout() {
  return (
    <div className="min-h-svh bg-canvas text-ink">
      <LandingNav />
      <main>
        <Outlet />
      </main>
      <LandingFooter />
    </div>
  );
}
