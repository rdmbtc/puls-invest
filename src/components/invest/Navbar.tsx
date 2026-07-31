import { useEffect, useState } from "react";
import { PulsLogo } from "./ui/PulsLogo";
import { ButtonLink } from "./ui/Button";

const links = [
  { href: "#how", label: "How it works" },
  { href: "#agents", label: "Agents" },
  { href: "#trust", label: "Trust" },
  { href: "#faq", label: "FAQ" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header
      className={`glass fixed inset-x-0 top-0 z-50 border-b border-border transition-all duration-300 ${
        scrolled ? "py-1.5" : "py-3"
      }`}
    >
      <div className="mx-auto grid max-w-[1180px] grid-cols-[minmax(0,1fr)_auto] items-center gap-4 px-4 sm:px-6">
        <a href="#top" className="flex min-w-0 items-center gap-2.5" aria-label="Puls home">
          <PulsLogo className={scrolled ? "h-7 w-7" : "h-8 w-8"} />
          <span className="truncate font-display text-xl font-bold tracking-[-0.5px]">Puls</span>
          <span className="hidden shrink-0 rounded-full border border-border px-2 py-0.5 font-mono text-[10px] text-subtle sm:inline">
            invest
          </span>
        </a>

        <div className="flex items-center gap-1.5">
          <nav aria-label="Main" className="hidden items-center gap-1 md:flex">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="rounded-full px-3.5 py-2 text-sm text-muted-foreground transition-colors hover:bg-raised hover:text-foreground"
              >
                {l.label}
              </a>
            ))}
          </nav>
          <ButtonLink href="#agents" size="sm" className="hidden sm:inline-flex">
            Invest <span aria-hidden="true">→</span>
          </ButtonLink>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Close menu" : "Open menu"}
            className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-border bg-surface md:hidden"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
              {open ? (
                <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
              ) : (
                <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {open && (
        <nav
          id="mobile-menu"
          aria-label="Mobile"
          className="mx-4 mt-3 rounded-2xl border border-border bg-surface p-2 md:hidden"
        >
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="block rounded-xl px-4 py-3 text-sm text-muted-foreground hover:bg-raised hover:text-foreground"
            >
              {l.label}
            </a>
          ))}
          <ButtonLink href="#agents" className="mt-1 w-full" onClick={() => setOpen(false)}>
            Invest <span aria-hidden="true">→</span>
          </ButtonLink>
        </nav>
      )}
    </header>
  );
}
