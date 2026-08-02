import type { ReactNode } from "react";

export function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-[color-mix(in_oklab,var(--brand)_45%,transparent)] bg-[color-mix(in_oklab,var(--brand)_12%,transparent)] px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[2px] text-brand sm:text-[11px]">
      <svg aria-hidden="true" viewBox="0 0 24 24" className="h-3 w-3 shrink-0" fill="currentColor">
        <path d="M12 2l1.8 5.6L19.5 9l-4.4 3.4 1.6 5.8L12 15l-4.7 3.2 1.6-5.8L4.5 9l5.7-1.4z" />
      </svg>
      <span className="min-w-0">{children}</span>
    </span>
  );
}
