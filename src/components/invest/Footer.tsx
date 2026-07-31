import { PulsLogo } from "./ui/PulsLogo";

const links = [
  { label: "X / Twitter", href: "https://x.com" },
  { label: "Docs", href: "#how" },
  { label: "GitHub", href: "https://github.com" },
  { label: "Terms", href: "#faq" },
  { label: "Privacy", href: "#faq" },
  { label: "Disclaimer", href: "#faq" },
];

export function Footer() {
  return (
    <footer className="border-t border-border px-4 py-12 sm:px-6">
      <div className="mx-auto max-w-[1180px]">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-start">
          <div className="min-w-0">
            <div className="flex min-w-0 items-center gap-2.5">
              <PulsLogo className="h-8 w-8" />
              <span className="truncate font-display text-xl font-bold">Puls</span>
            </div>
            <p className="mt-4 text-sm text-muted-foreground">
              © 2026 Puls · Built on Arc Network
            </p>
            <p className="mt-2 max-w-md text-xs leading-relaxed text-subtle">
              Arc is a trademark of Circle Internet Group, Inc. Puls is not affiliated with Circle.
              Performance figures shown are illustrative placeholders and are not investment advice.
            </p>
          </div>

          <nav aria-label="Footer" className="flex flex-wrap gap-x-6 gap-y-3">
            {links.map((l) => (
              <a
                key={l.label}
                href={l.href}
                className="text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                {l.label}
              </a>
            ))}
          </nav>
        </div>

        <div className="mt-10 flex justify-end">
          <a
            href="#top"
            aria-label="Back to top"
            className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-4 py-2 text-xs text-muted-foreground transition-colors hover:text-foreground"
          >
            Back to top <span aria-hidden="true">↑</span>
          </a>
        </div>
      </div>
    </footer>
  );
}
