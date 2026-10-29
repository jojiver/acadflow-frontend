import { NavLink } from "react-router";
import { cn } from "@/lib/cn";

const LINKS = [
  { to: "/", label: "Dashboard", end: true },
  { to: "/tasks", label: "Tasks & Priorities", end: false },
];

const SOON = ["Schedule", "Calendar", "Workload"];

function Navbar() {
  return (
    <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center gap-6 px-4">
        <NavLink to="/" className="flex items-center gap-2">
          <span className="grid size-8 place-items-center rounded-lg bg-indigo-600 text-sm font-bold text-white">
            AF
          </span>
          <span className="text-lg font-semibold text-slate-900">AcadFlow</span>
        </NavLink>

        <nav className="flex flex-1 items-center gap-1 overflow-x-auto">
          {LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              className={({ isActive }) =>
                cn(
                  "whitespace-nowrap rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-indigo-50 text-indigo-700"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900",
                )
              }
            >
              {link.label}
            </NavLink>
          ))}
          {SOON.map((label) => (
            <span
              key={label}
              title="Coming soon"
              className="hidden cursor-not-allowed whitespace-nowrap rounded-lg px-3 py-2 text-sm font-medium text-slate-400 sm:inline"
            >
              {label}
            </span>
          ))}
        </nav>

        <span className="grid size-9 shrink-0 place-items-center rounded-full bg-slate-200 text-sm font-semibold text-slate-700">
          JS
        </span>
      </div>
    </header>
  );
}

export default Navbar;
