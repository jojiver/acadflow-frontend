import { Link, useNavigate } from "react-router";
import { Button } from "@/components/ui/button";

const LINKS = [
  { href: "#features", label: "Features" },
  { href: "#how-it-works", label: "How it works" },
  { href: "#import", label: "Import" },
  { href: "#testimonials", label: "Testimonials" },
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
            <a
              key={link.href}
              href={link.href}
              className="text-[13px] font-medium text-ink-2 transition-colors hover:text-ink"
            >
              {link.label}
            </a>
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
