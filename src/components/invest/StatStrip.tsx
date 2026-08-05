import { useEffect, useRef, useState } from "react";
import { Reveal, usePrefersReducedMotion } from "./ui/Reveal";

interface Stat {
  label: string;
  value: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
}

const defaultStats: Stat[] = [
  { label: "On-chain trades", value: 53544, decimals: 0 },
  { label: "Total volume", value: 23.0, prefix: "$", suffix: "K", decimals: 2 },
  { label: "Markets deployed", value: 1988, decimals: 0 },
  { label: "Live AI agents", value: 8, decimals: 0 },
];

function CountUp({ stat, active }: { stat: Stat; active: boolean }) {
  const reduced = usePrefersReducedMotion();
  const [value, setValue] = useState(reduced ? stat.value : 0);

  useEffect(() => {
    if (!active) return;
    if (reduced) {
      setValue(stat.value);
      return;
    }
    let frame = 0;
    const start = performance.now();
    const duration = 1400;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      setValue(stat.value * eased);
      if (t < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [active, reduced, stat.value]);

  return (
    <span className="gradient-text font-display text-3xl font-bold tracking-[-1px] tabular-nums sm:text-4xl">
      {stat.prefix}
      {value.toLocaleString("en-US", {
        minimumFractionDigits: stat.decimals ?? 0,
        maximumFractionDigits: stat.decimals ?? 0,
      })}
      {stat.suffix}
    </span>
  );
}

export function StatStrip() {
  const ref = useRef<HTMLDivElement | null>(null);
  const [active, setActive] = useState(false);
  const [stats, setStats] = useState<Stat[]>(defaultStats);

  useEffect(() => {
    fetch("https://api.pulsmarket.tech/api/stats")
      .then((res) => res.json())
      .then((data) => {
        if (data && data.trades) {
          const volumeK = (data.volumeUsdc || 14350) / 1000;
          setStats([
            { label: "On-chain trades", value: data.trades, decimals: 0 },
            { label: "Total volume", value: volumeK, prefix: "$", suffix: "K", decimals: 2 },
            { label: "Markets deployed", value: data.marketsDeployed || 1988, decimals: 0 },
            { label: "Live AI agents", value: data.agents || 8, decimals: 0 },
          ]);
        }
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setActive(true);
          io.disconnect();
        }
      },
      { threshold: 0.3 },
    );
    io.observe(node);
    return () => io.disconnect();
  }, []);

  return (
    <Reveal delay={160}>
      <div
        ref={ref}
        className="card-surface sheen relative grid grid-cols-2 gap-x-4 gap-y-6 overflow-hidden p-6 sm:p-8 lg:grid-cols-4"
      >
        {stats.map((stat, i) => (
          <div
            key={stat.label}
            className={`flex min-h-[76px] min-w-0 flex-col justify-center gap-1 ${
              i > 0 ? "lg:border-l lg:border-white/[0.06] lg:pl-6" : ""
            }`}
          >
            <CountUp stat={stat} active={active} />
            <span className="truncate text-[11px] uppercase tracking-[1.5px] text-subtle">
              {stat.label}
            </span>
          </div>
        ))}
      </div>
    </Reveal>
  );
}
