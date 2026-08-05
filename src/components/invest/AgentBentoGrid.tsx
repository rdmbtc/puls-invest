import { useEffect, useMemo, useState } from "react";
import { agents as staticAgents, type Agent, type AgentAccent } from "@/lib/agents";
import { fetchAgents, type AgentCard } from "@/lib/api";
import { AgentCard as AgentCardView } from "./AgentCard";
import { Eyebrow } from "./ui/Eyebrow";
import { Reveal } from "./ui/Reveal";
import { InvestModal } from "./InvestModal";
import { MyInvestments } from "./MyInvestments";

const accentByKey: Record<string, AgentAccent> = {
  vega: "mint",
  cygnus: "sky",
  orion: "violet",
  atlas: "amber",
  nova: "pink",
  striker: "teal",
  sage: "indigo",
  pulse: "rose",
};

function mergeLive(staticAgent: Agent, live?: AgentCard): Agent {
  if (!live) return staticAgent;
  return {
    ...staticAgent,
    id: live.key,
    name: live.name,
    glyph: live.glyph || staticAgent.glyph,
    role: (live.role as Agent["role"]) ?? staticAgent.role,
    strategy: live.strategy || staticAgent.strategy,
    address: live.address
      ? `${live.address.slice(0, 6)}…${live.address.slice(-4)}`
      : staticAgent.address,
    apy: live.apyEstimatePct,
    roi30d: live.roi30dPct,
    winRate: live.winRatePct ?? staticAgent.winRate,
    tvl: live.tvlUsdc,
    realizedPnlUsdc: live.realizedPnlUsdc,
    tradesCount: live.tradesCount,
    winsCount: live.winsCount,
    resolvedCount: live.resolvedCount,
  };
}

export function AgentBentoGrid() {
  const [selected, setSelected] = useState<Agent | null>(null);
  const [live, setLive] = useState<Map<string, AgentCard> | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetchAgents()
      .then((res) => {
        if (!cancelled) setLive(new Map(res.agents.map((a) => [a.key, a])));
      })
      .catch(() => {
        // fall back to static agents
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const agents = useMemo(
    () =>
      staticAgents.map((a) => ({
        ...mergeLive(a, live?.get(a.id)),
        accent: accentByKey[a.id] ?? a.accent,
      })),
    [live],
  );

  const featured = agents[0]!;
  const rest = agents.slice(1);

  return (
    <section id="agents" className="px-4 py-20 sm:px-6">
      <div className="mx-auto max-w-[1180px]">
        <Reveal className="max-w-2xl">
          <Eyebrow>The agents</Eyebrow>
          <h2 className="display-tight mt-5 text-3xl font-bold sm:text-5xl">
            Eight strategies, <em className="gradient-text italic">live on Arc.</em>
          </h2>
          <p className="mt-4 text-base text-muted-foreground">
            TVL, APY estimates and agent addresses are fetched live from{" "}
            <code className="font-mono text-xs">api.pulsmarket.tech/api/invest/agents</code>. Pay
            USDC from your own wallet via x402 — 20% fee on profits only.
          </p>
          <p className="mt-2 text-xs text-subtle">
            {live ? "live data connected" : "showing static preview — API unreachable"}
          </p>
        </Reveal>

        <div className="mt-12 flex flex-col gap-5 lg:flex-row">
          <Reveal className="lg:w-[58%]">
            <AgentCardView agent={featured} featured onInvest={setSelected} />
          </Reveal>
          <div className="grid gap-5 sm:grid-cols-2 lg:w-[42%] lg:grid-cols-1">
            {rest.slice(0, 2).map((agent, i) => (
              <Reveal key={agent.id} delay={(i + 1) * 60} className="h-full">
                <AgentCardView agent={agent} onInvest={setSelected} />
              </Reveal>
            ))}
          </div>
        </div>

        <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {rest.slice(2).map((agent, i) => (
            <Reveal key={agent.id} delay={(i + 1) * 60} className="h-full">
              <AgentCardView agent={agent} onInvest={setSelected} />
            </Reveal>
          ))}
        </div>
      </div>

      <InvestModal agent={selected} onClose={() => setSelected(null)} />
      <MyInvestments />
    </section>
  );
}
