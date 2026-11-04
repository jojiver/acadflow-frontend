const COLUMNS = [
  { title: "Product", links: ["Features", "How it works", "Import", "Pricing"] },
  { title: "Company", links: ["About", "Blog", "Careers", "Contact"] },
  { title: "Resources", links: ["Help centre", "Student guide", "Status"] },
  { title: "Legal", links: ["Privacy", "Terms", "Security"] },
];

export function LandingFooter() {
  return (
    <footer className="bg-brand-dark pt-14 pb-8">
      <div className="mx-auto max-w-[1280px] px-5 sm:px-8">
        <div className="flex flex-col gap-12 lg:flex-row lg:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="grid size-7 place-items-center rounded-lg bg-white text-xs font-bold text-brand-dark">
                A
              </span>
              <span className="text-[17px] font-semibold text-white">
                AcadFlow
              </span>
            </div>
            <p className="mt-5 text-[13px] text-ink-3">
              Study smarter. Live lighter.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-10 sm:grid-cols-4 lg:gap-16">
            {COLUMNS.map((column) => (
              <div key={column.title}>
                <p className="text-[11px] font-bold tracking-[0.08em] text-ink-3 uppercase">
                  {column.title}
                </p>
                <ul className="mt-4 space-y-3">
                  {column.links.map((link) => (
                    <li key={link}>
                      <a
                        href="#"
                        className="text-[13px] text-[#CBD5E1] transition-colors hover:text-white"
                      >
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-[#1E3A54] pt-6 sm:flex-row sm:justify-between">
          <p className="text-xs text-ink-3">
            © 2026 AcadFlow. Built for students, by students.
          </p>
          <p className="text-xs text-ink-3">
            Made with care for the semester grind.
          </p>
        </div>
      </div>
    </footer>
  );
}
