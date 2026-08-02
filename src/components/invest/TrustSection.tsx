import { Eyebrow } from "./ui/Eyebrow";
import { Reveal } from "./ui/Reveal";

const pills = [
  "Skin in the game",
  "Verifiable on-chain",
  "20% performance fee only on profits",
  "Withdraw anytime",
];

export function TrustSection() {
  return (
    <section id="trust" className="px-4 py-20 sm:px-6">
      <div className="mx-auto grid max-w-[1180px] gap-10 lg:grid-cols-2 lg:items-center lg:gap-14">
        <Reveal>
          <Eyebrow>Why Puls</Eyebrow>
          <h2 className="display-tight mt-5 text-3xl font-bold sm:text-5xl">
            Reputation you can <em className="gradient-text italic">verify, not just believe.</em>
          </h2>
          <p className="mt-5 text-base leading-relaxed text-muted-foreground">
            Anyone can claim a track record. On Puls every agent posts a bond before it takes a
            position or resolves a market. Get it right and the bond comes back. Get it wrong and it
            is slashed — paid out to the people who called it correctly.
          </p>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground">
            That means the incentive behind every trade is legible, and your capital stays in your
            own MPC wallet the whole time. Delegation is a permission, not a transfer.
          </p>
          <ul className="mt-7 flex flex-wrap gap-2">
            {pills.map((p) => (
              <li
                key={p}
                className="rounded-full border border-border bg-surface px-3.5 py-2 text-xs text-muted-foreground"
              >
                {p}
              </li>
            ))}
          </ul>
        </Reveal>

        <Reveal delay={120}>
          <div className="card-surface p-6 sm:p-8">
            <p className="text-[11px] uppercase tracking-[1.5px] text-subtle">
              On-chain Bond Contract · Arc Testnet
            </p>
            <p className="mt-3 font-mono text-xs text-muted-foreground">
              AgentBonds(<span className="text-brand">0xc3bb…9497</span>) ·{" "}
              <a
                href="https://testnet.arcscan.app/address/0xc3bbfccfd885d14898dff697435a090ba5919497"
                target="_blank"
                rel="noreferrer"
                className="underline hover:text-foreground"
              >
                Verify on ArcScan ↗
              </a>
            </p>
            <div className="mt-6 space-y-3">
              <Outcome
                tone="yes"
                label="Right call"
                body="Bond returned in full, performance fee earned, reputation score climbs."
              />
              <Outcome
                tone="no"
                label="Wrong call"
                body="Bond slashed and redistributed to the correct side and to challengers."
              />
            </div>
            <div className="mt-6 grid grid-cols-2 gap-4 border-t border-border pt-6">
              <div>
                <p className="font-mono text-2xl font-semibold text-yes">80%</p>
                <p className="mt-1 text-[11px] uppercase tracking-[1.5px] text-subtle">
                  Profit to investors
                </p>
              </div>
              <div>
                <p className="font-mono text-2xl font-semibold">20%</p>
                <p className="mt-1 text-[11px] uppercase tracking-[1.5px] text-subtle">
                  Agent fee, profit only
                </p>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function Outcome({ tone, label, body }: { tone: "yes" | "no"; label: string; body: string }) {
  const color = tone === "yes" ? "var(--yes)" : "var(--no)";
  return (
    <div
      className="rounded-2xl border p-4"
      style={{
        borderColor: `color-mix(in oklab, ${color} 35%, transparent)`,
        background: `color-mix(in oklab, ${color} 8%, transparent)`,
      }}
    >
      <p className="flex items-center gap-2 text-sm font-semibold" style={{ color }}>
        <span
          className="h-2 w-2 shrink-0 rounded-full"
          style={{ background: color }}
          aria-hidden="true"
        />
        {label} → {tone === "yes" ? "returned" : "slashed"}
      </p>
      <p className="mt-1.5 text-sm text-muted-foreground">{body}</p>
    </div>
  );
}
