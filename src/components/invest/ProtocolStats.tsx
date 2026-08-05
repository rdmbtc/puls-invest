import { useEffect, useState } from "react";
import { Reveal } from "./ui/Reveal";
import { API_BASE } from "@/lib/pay";

interface LiveStats {
  marketsDeployed: number;
  agentTrades: number;
}

const compact = (n: number): string => (n >= 1000 ? `${(n / 1000).toFixed(1)}K` : String(n));

const baseStats = [
  {
    value: "1,988",
    label: "Markets deployed",
    tint: "#F472B6",
    icon: <path d="M4 18V7m6 11V4m6 14v-7m4 7V9" strokeLinecap="round" />,
    live: "markets" as const,
  },
  {
    value: "<1s",
    label: "Sub-second finality",
    tint: "#2DD4BF",
    icon: <path d="M13 2L4 14h7l-1 8 9-12h-7z" strokeLinecap="round" strokeLinejoin="round" />,
  },
  {
    value: "$0",
    label: "ETH gas — 100% USDC",
    tint: "#F59E0B",
    icon: <path d="M12 3v18M8 7h6a3 3 0 010 6H8h7a3 3 0 010 6H8" strokeLinecap="round" />,
  },
  {
    value: "36.5K",
    label: "AI agent trades",
    tint: "#818CF8",
    icon: (
      <path
        d="M12 3l8 4v6c0 5-3.5 7.5-8 8-4.5-.5-8-3-8-8V7z"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    ),
    live: "agentTrades" as const,
  },
];

export function ProtocolStats() {
  const [live, setLive] = useState<LiveStats | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch(`${API_BASE}/api/stats`)
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (!cancelled && d && typeof d.marketsDeployed === "number") {
          setLive({
            marketsDeployed: d.marketsDeployed,
            agentTrades: d.agentTrades ?? 0,
          });
        }
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  const stats = baseStats.map((s) => {
    if (s.live === "markets") {
      const v = live ? live.marketsDeployed.toLocaleString("en-US") : s.value;
      return { ...s, value: v, isLive: live !== null };
    }
    if (s.live === "agentTrades") {
      const v = live ? compact(live.agentTrades) : s.value;
      return { ...s, value: v, isLive: live !== null };
    }
    return { ...s, isLive: false };
  });

  return (
    <section className="px-4 py-10 sm:px-6">
      <div className="mx-auto grid max-w-[1180px] gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s, i) => (
          <Reveal key={s.label} delay={i * 80}>
            <div className="card-surface sheen group relative h-full overflow-hidden p-6 transition-all duration-500 hover:-translate-y-[4px]">
              <span
                className="grid h-10 w-10 place-items-center rounded-xl transition-transform duration-500 group-hover:scale-110"
                style={{
                  background: `color-mix(in oklab, ${s.tint} 15%, transparent)`,
                  border: `1px solid color-mix(in oklab, ${s.tint} 35%, transparent)`,
                  boxShadow: `0 0 26px -8px color-mix(in oklab, ${s.tint} 70%, transparent)`,
                }}
              >
                <svg
                  viewBox="0 0 24 24"
                  className="h-5 w-5"
                  fill="none"
                  stroke={s.tint}
                  strokeWidth="2"
                  aria-hidden="true"
                >
                  {s.icon}
                </svg>
              </span>
              <p
                className="mt-5 font-display text-3xl font-bold tracking-[-1px] tabular-nums"
                style={{ color: s.tint }}
              >
                {s.value}
              </p>
              <p className="mt-1 flex items-center gap-1.5 text-[11px] uppercase tracking-[1.5px] text-subtle">
                {s.label}
                {s.isLive && (
                  <span
                    className="live-dot h-1.5 w-1.5 shrink-0 rounded-full"
                    style={{ background: s.tint }}
                    aria-label="live"
                  />
                )}
              </p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
