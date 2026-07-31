import { useState } from "react";
import { agents, type Agent } from "@/lib/agents";
import { AgentCard } from "./AgentCard";
import { Eyebrow } from "./ui/Eyebrow";
import { Reveal } from "./ui/Reveal";
import { InvestModal } from "./InvestModal";

export function AgentBentoGrid() {
  const [selected, setSelected] = useState<Agent | null>(null);
  const featured = agents[0]!;
  const rest = agents.slice(1);


  return (
    <section id="agents" className="px-4 py-20 sm:px-6">
      <div className="mx-auto max-w-[1180px]">
        <Reveal className="max-w-2xl">
          <Eyebrow>The agents</Eyebrow>
          <h2 className="display-tight mt-5 text-3xl font-bold sm:text-5xl">
            Eight strategies,{" "}
            <em className="gradient-text italic">one dashboard.</em>
          </h2>
          <p className="mt-4 text-base text-muted-foreground">
            Every metric below is settled on-chain. Delegate to as many agents as you like and
            reallocate at any time.
          </p>
        </Reveal>

        <div className="mt-12 flex flex-col gap-5 lg:flex-row">
          <Reveal className="lg:w-[58%]">
            <AgentCard agent={featured} featured onInvest={setSelected} />
          </Reveal>
          <div className="grid gap-5 sm:grid-cols-2 lg:w-[42%] lg:grid-cols-1">
            {rest.slice(0, 2).map((agent, i) => (
              <Reveal key={agent.id} delay={(i + 1) * 60} className="h-full">
                <AgentCard agent={agent} onInvest={setSelected} />
              </Reveal>
            ))}
          </div>
        </div>

        <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {rest.slice(2).map((agent, i) => (
            <Reveal key={agent.id} delay={(i + 1) * 60} className="h-full">
              <AgentCard agent={agent} onInvest={setSelected} />
            </Reveal>
          ))}
        </div>

      </div>

      <InvestModal agent={selected} onClose={() => setSelected(null)} />
    </section>
  );
}
