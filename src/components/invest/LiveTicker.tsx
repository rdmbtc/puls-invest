import { useEffect, useState } from "react";
import { API_BASE } from "@/lib/pay";
import { usePrefersReducedMotion } from "./ui/Reveal";

interface TickerMarket {
  id: string;
  question: string;
  yesPrice: number | null;
  volumeNum: number;
}

const price = (p: number | null): string =>
  p === null || p === undefined ? "—" : `${(p * 100).toFixed(1)}%`;

const volume = (v: number): string =>
  v >= 1000 ? `$${(v / 1000).toFixed(1)}K` : `$${Math.round(v)}`;

const TickerItem = ({ m }: { m: TickerMarket }) => (
  <span className="flex shrink-0 items-center gap-2.5 px-6">
    <span className="live-dot h-1.5 w-1.5 shrink-0 rounded-full bg-mint" aria-hidden="true" />
    <span className="max-w-[44ch] truncate text-xs text-muted-foreground" title={m.question}>
      {m.question}
    </span>
    <span className="shrink-0 font-mono text-xs font-semibold tabular-nums text-foreground">
      {price(m.yesPrice)}
    </span>
    <span className="shrink-0 font-mono text-[10px] text-subtle">vol {volume(m.volumeNum)}</span>
  </span>
);

/** Live "market tape" — the same market questions the agents are trading,
 *  streamed straight from api.pulsmarket.tech. */
export function LiveTicker() {
  const reduced = usePrefersReducedMotion();
  const [markets, setMarkets] = useState<TickerMarket[] | null>(null);

  useEffect(() => {
    let cancelled = false;
    const load = () =>
      fetch(`${API_BASE}/api/markets?limit=10&status=open`)
        .then((r) => (r.ok ? r.json() : []))
        .then((list) => {
          if (cancelled || !Array.isArray(list) || !list.length) return;
          setMarkets(
            list.map((m) => ({
              id: String(m.id),
              question: String(m.question || ""),
              yesPrice: typeof m.yesPrice === "number" ? m.yesPrice : null,
              volumeNum: Number(m.volumeNum || 0),
            })),
          );
        })
        .catch(() => {});
    load();
    const t = window.setInterval(load, 120_000);
    return () => {
      cancelled = true;
      window.clearInterval(t);
    };
  }, []);

  if (!markets) return null;
  const items = markets.map((m) => <TickerItem key={m.id} m={m} />);

  return (
    <section
      aria-label="Live markets on Arc"
      className="border-y border-white/[0.06] bg-black/25 py-3"
    >
      <div
        className="overflow-hidden"
        style={{
          maskImage:
            "linear-gradient(90deg, transparent 0, #000 6rem, #000 calc(100% - 6rem), transparent 100%)",
          WebkitMaskImage:
            "linear-gradient(90deg, transparent 0, #000 6rem, #000 calc(100% - 6rem), transparent 100%)",
        }}
      >
        <div className={reduced ? "flex flex-wrap" : "ticker-track flex w-max"}>
          {items}
          {!reduced && items}
        </div>
      </div>
    </section>
  );
}
