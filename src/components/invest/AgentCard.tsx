import type { MouseEvent } from "react";
import { accentHex, usd, type Agent } from "@/lib/agents";
import { Sparkline } from "./Sparkline";
import { Button } from "./ui/Button";

interface Props {
  agent: Agent;
  featured?: boolean;
  onInvest: (agent: Agent) => void;
}

export function AgentCard({ agent, featured = false, onInvest }: Props) {
  const color = accentHex[agent.accent];

  const onMove = (e: MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty("--mx", `${e.clientX - rect.left}px`);
    e.currentTarget.style.setProperty("--my", `${e.clientY - rect.top}px`);
  };

  return (
    <div
      onMouseMove={onMove}
      style={{ ["--card-accent" as string]: color }}
      className="spotlight gradient-ring card-surface group relative flex h-full flex-col overflow-hidden p-5 transition-transform duration-300 hover:-translate-y-[3px] sm:p-6"
    >
      <div className="relative z-10 flex min-h-0 flex-1 min-w-0 flex-col gap-5">
        <div className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3">
          <span
            className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl text-lg"
            style={{
              background: `color-mix(in oklab, ${color} 18%, transparent)`,
              border: `1px solid color-mix(in oklab, ${color} 45%, transparent)`,
              color,
            }}
            aria-hidden="true"
          >
            {agent.glyph}
          </span>
          <div className="min-w-0">
            <h3
              className={`truncate font-display font-bold tracking-[-0.5px] ${
                featured ? "text-2xl sm:text-3xl" : "text-xl"
              }`}
            >
              {agent.name}
            </h3>
            <p className="truncate font-mono text-[11px] text-subtle">{agent.address}</p>
          </div>
          <span
            className="shrink-0 rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[1.5px]"
            style={{
              color,
              background: `color-mix(in oklab, ${color} 12%, transparent)`,
              border: `1px solid color-mix(in oklab, ${color} 35%, transparent)`,
            }}
          >
            {agent.role}
          </span>
        </div>

        {featured && (
          <p className="text-sm leading-relaxed text-muted-foreground">{agent.strategy}</p>
        )}

        <div className={`grid gap-4 ${featured ? "grid-cols-2 sm:grid-cols-4" : "grid-cols-2"}`}>
          <Metric label="Win rate" value={`${agent.winRate.toFixed(1)}%`} />
          <Metric label="APY" value={`${agent.apy.toFixed(1)}%`} accent={color} />
          <Metric label="30d ROI" value={`+${agent.roi30d.toFixed(1)}%`} accent="#2DD4BF" />
          <Metric label="TVL" value={usd(agent.tvl)} />
        </div>

        <div className="min-h-[44px]">
          <Sparkline seed={agent.seed} color={color} height={featured ? 96 : 44} />
        </div>


        <Button
          onClick={() => onInvest(agent)}
          variant={featured ? "primary" : "secondary"}
          size="sm"
          aria-label={`Invest in ${agent.name}`}
          className="mt-auto w-full"
        >
          Invest in {agent.name}
        </Button>
      </div>
    </div>
  );
}

function Metric({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent?: string;
}) {
  return (
    <div className="min-w-0">
      <p className="truncate text-[10px] uppercase tracking-[1.5px] text-subtle">{label}</p>
      <p className="mt-1 font-mono text-base font-semibold" style={accent ? { color: accent } : undefined}>
        {value}
      </p>
    </div>
  );
}
