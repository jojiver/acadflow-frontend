import { Link, NavLink, useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/cn";

const LINKS = [
  { to: "/features", label: "Features" },
  { to: "/how-it-works", label: "How it works" },
  { to: "/import", label: "Import" },
  { to: "/testimonials", label: "Testimonials" },
];

export function LandingNav() {
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-30 border-b border-line bg-canvas/90 backdrop-blur">
      <div className="mx-auto flex h-20 max-w-[1280px] items-center justify-between px-5 sm:px-8">
        <Link to="/" className="flex items-center gap-3">
          <span className="grid size-8 place-items-center rounded-[9px] bg-brand-dark text-[13px] font-bold text-white">
            A
          </span>
          <span className="text-[19px] font-semibold text-ink">AcadFlow</span>
        </Link>

        <nav className="hidden items-center gap-7 lg:flex">
          {LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                cn(
                  "text-[13px] font-medium transition-colors",
                  isActive ? "text-brand" : "text-ink-2 hover:text-ink",
                )
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <Button
            variant="tertiary"
            className="px-0 text-[13px] font-semibold text-ink hover:text-brand"
            onClick={() => navigate("/auth/login")}
          >
            Sign in
          </Button>
          <Button
            className="h-10 rounded-full px-[18px] text-[13px]"
            onClick={() => navigate("/auth/signup")}
          >
            Get started
          </Button>
        </div>
      </div>
    </header>
  );
}
