import { useEffect, useMemo, useRef, useState } from "react";
import { accentHex, type Agent } from "@/lib/agents";
import { Button } from "./ui/Button";

type TxState = "idle" | "pending" | "success";

const quickAmounts = [100, 500, 2500];

export function InvestModal({ agent, onClose }: { agent: Agent | null; onClose: () => void }) {
  const [amount, setAmount] = useState("500");
  const [tx, setTx] = useState<TxState>("idle");
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const restoreFocus = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!agent) return;
    restoreFocus.current = document.activeElement as HTMLElement | null;
    setTx("idle");
    setAmount("500");
    const t = window.setTimeout(() => inputRef.current?.focus(), 30);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.clearTimeout(t);
      document.body.style.overflow = prevOverflow;
      restoreFocus.current?.focus();
    };
  }, [agent]);

  useEffect(() => {
    if (!agent) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
        return;
      }
      if (e.key !== "Tab") return;
      const nodes = dialogRef.current?.querySelectorAll<HTMLElement>(
        'button, input, a[href], [tabindex]:not([tabindex="-1"])',
      );
      if (!nodes || nodes.length === 0) return;
      const list = Array.from(nodes).filter((n) => !n.hasAttribute("disabled"));
      const first = list[0];
      const last = list[list.length - 1];
      if (!first || !last) return;
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }

    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [agent, onClose]);

  const parsed = Math.max(0, Number(amount) || 0);
  const projected = useMemo(() => (agent ? (parsed * agent.apy) / 100 : 0), [parsed, agent]);
  const fee = projected * 0.2;

  if (!agent) return null;
  const color = accentHex[agent.accent];

  const submit = () => {
    setTx("pending");
    window.setTimeout(() => setTx("success"), 1600);
  };

  return (
    <div
      className="fixed inset-0 z-[60] flex items-end justify-center bg-[rgba(4,7,14,.72)] p-0 backdrop-blur-sm sm:items-center sm:p-4"
      onClick={onClose}
      role="presentation"
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="invest-modal-title"
        onClick={(e) => e.stopPropagation()}
        className="glass-card w-full max-w-md rounded-t-3xl p-6 sm:rounded-3xl"
        style={{ ["--card-accent" as string]: color }}
      >
        <div className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3">
          <span
            className="grid h-10 w-10 shrink-0 place-items-center rounded-xl"
            style={{
              background: `color-mix(in oklab, ${color} 18%, transparent)`,
              color,
            }}
            aria-hidden="true"
          >
            {agent.glyph}
          </span>
          <div className="min-w-0">
            <h2 id="invest-modal-title" className="truncate font-display text-xl font-bold">
              Delegate to {agent.name}
            </h2>
            <p className="truncate font-mono text-[11px] text-subtle">{agent.address}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close dialog"
            className="grid h-9 w-9 shrink-0 place-items-center rounded-lg border border-border text-muted-foreground hover:text-foreground"
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        {tx === "success" ? (
          <div className="mt-8 text-center">
            <span className="mx-auto grid h-12 w-12 place-items-center rounded-full pulse-gradient" aria-hidden="true">
              <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="#08111c" strokeWidth="2.5">
                <path d="M5 12l5 5L19 7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
            <p className="mt-4 font-display text-xl font-bold">Delegation confirmed</p>
            <p className="mt-2 text-sm text-muted-foreground">
              {parsed.toLocaleString()} USDC is now working with {agent.name}. This is a demo — no
              funds moved.
            </p>
            <p className="mt-3 font-mono text-[11px] text-subtle">
              tx 0x{(agent.seed * 918273).toString(16)}…a41c
            </p>
            <Button className="mt-6 w-full" onClick={onClose}>
              Done
            </Button>
          </div>
        ) : (
          <>
            <label htmlFor="usdc-amount" className="mt-7 block text-[11px] uppercase tracking-[1.5px] text-subtle">
              Amount (USDC)
            </label>
            <div className="mt-2 flex items-center gap-2 rounded-2xl border border-border bg-[rgba(10,14,26,.6)] px-4 py-3">
              <span className="font-mono text-sm text-subtle">$</span>
              <input
                id="usdc-amount"
                ref={inputRef}
                inputMode="decimal"
                value={amount}
                onChange={(e) => setAmount(e.target.value.replace(/[^0-9.]/g, ""))}
                className="min-w-0 flex-1 bg-transparent font-mono text-lg outline-none"
                aria-describedby="delegation-summary"
              />
              <span className="shrink-0 font-mono text-xs text-subtle">USDC</span>
            </div>
            <div className="mt-3 flex gap-2">
              {quickAmounts.map((q) => (
                <button
                  key={q}
                  type="button"
                  onClick={() => setAmount(String(q))}
                  className="flex-1 rounded-full border border-border bg-surface py-2 font-mono text-xs text-muted-foreground transition-colors hover:border-brand hover:text-foreground"
                >
                  ${q}
                </button>
              ))}
            </div>

            <dl
              id="delegation-summary"
              className="mt-6 space-y-2.5 rounded-2xl border border-border bg-[rgba(10,14,26,.45)] p-4 text-sm"
            >
              <Row label={`Est. annual yield (${agent.apy.toFixed(1)}% APY)`} value={`$${projected.toFixed(2)}`} />
              <Row label="Agent performance fee (20%)" value={`−$${fee.toFixed(2)}`} />
              <Row label="Your share" value={`$${(projected - fee).toFixed(2)}`} strong accent={color} />
              <Row label="Network" value="Arc · gas in USDC" />
            </dl>

            <Button className="mt-6 w-full" size="lg" onClick={submit} disabled={tx === "pending" || parsed <= 0}>
              {tx === "pending" ? "Confirming…" : "Delegate USDC"}
            </Button>
            <p className="mt-3 text-center text-[11px] text-subtle">
              Demo interface. Projections are illustrative, not a guarantee.
            </p>
          </>
        )}
      </div>
    </div>
  );
}

function Row({
  label,
  value,
  strong,
  accent,
}: {
  label: string;
  value: string;
  strong?: boolean;
  accent?: string;
}) {
  return (
    <div className="grid grid-cols-[minmax(0,1fr)_auto] gap-3">
      <dt className="min-w-0 text-muted-foreground">{label}</dt>
      <dd
        className={`shrink-0 font-mono ${strong ? "font-semibold" : ""}`}
        style={accent ? { color: accent } : undefined}
      >
        {value}
      </dd>
    </div>
  );
}
