import type { ButtonHTMLAttributes, AnchorHTMLAttributes, ReactNode } from "react";

const base =
  "inline-flex items-center justify-center gap-2 rounded-full text-sm font-semibold transition-all duration-200 active:scale-[.97] disabled:cursor-not-allowed disabled:opacity-60";

const sizes = {
  md: "px-5 py-2.5",
  lg: "px-6 py-3.5 text-base",
  sm: "px-4 py-2 text-[13px]",
} as const;

type Variant = "primary" | "secondary" | "ghost";
type Size = keyof typeof sizes;

function classesFor(variant: Variant, size: Size) {
  const variants: Record<Variant, string> = {
    primary:
      "pulse-gradient text-[#08111c] shadow-[0_8px_30px_-12px_rgba(246,95,169,.6)] hover:shadow-[0_14px_44px_-10px_rgba(52,229,192,.55)] hover:scale-[1.02]",
    secondary:
      "border border-border bg-surface text-foreground hover:border-[color-mix(in_oklab,var(--brand)_50%,transparent)] hover:bg-raised",
    ghost: "text-muted-foreground hover:text-foreground",
  };
  return `${base} ${sizes[size]} ${variants[variant]}`;
}

export function Button({
  variant = "primary",
  size = "md",
  className = "",
  children,
  ...rest
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  size?: Size;
  children: ReactNode;
}) {
  return (
    <button className={`${classesFor(variant, size)} ${className}`} {...rest}>
      {children}
    </button>
  );
}

export function ButtonLink({
  variant = "primary",
  size = "md",
  className = "",
  children,
  ...rest
}: AnchorHTMLAttributes<HTMLAnchorElement> & {
  variant?: Variant;
  size?: Size;
  children: ReactNode;
}) {
  return (
    <a className={`${classesFor(variant, size)} ${className}`} {...rest}>
      {children}
    </a>
  );
}
