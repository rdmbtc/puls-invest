import { useCallback, useEffect, useState } from "react";
import { accentHex } from "@/lib/agents";
import { fetchMyInvestments, withdrawInvestment, type Position } from "@/lib/api";
import { ARCSCAN_TX, connectWallet, ensureArcChain } from "@/lib/pay";
import { Button } from "./ui/Button";
import { Eyebrow } from "./ui/Eyebrow";
import { Reveal } from "./ui/Reveal";

export function MyInvestments() {
  const [address, setAddress] = useState<string>("");
  const [loaded, setLoaded] = useState(false);
  const [positions, setPositions] = useState<Position[] | null>(null);
  const [totals, setTotals] = useState<{ invested: number; claimable: number } | null>(null);
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [okMsg, setOkMsg] = useState<string | null>(null);

  const load = useCallback(async (addr: string) => {
    setError(null);
    setOkMsg(null);
    try {
      const me = await fetchMyInvestments(addr);
      setPositions(me.positions.length ? me.positions : []);
      setTotals({ invested: me.totalInvested, claimable: me.totalClaimable });
    } catch (e) {
      setError((e as Error).message);
      setPositions(null);
      setTotals(null);
    }
  }, []);

  const connect = useCallback(async () => {
    setError(null);
    try {
      const { address: addr } = await connectWallet();
      setAddress(addr);
      setLoaded(true);
      await load(addr);
    } catch (e) {
      setError(
        (e as Error).message === "no-wallet" ? "No injected wallet found." : (e as Error).message,
      );
    }
  }, [load]);

  const submit = useCallback(async () => {
    const addr = address.trim().toLowerCase();
    if (!/^0x[0-9a-f]{40}$/.test(addr)) {
      setError("Enter a valid 0x… address");
      return;
    }
    setLoaded(true);
    await load(addr);
  }, [address, load]);

  const withdraw = useCallback(
    async (pos: Position) => {
      setBusy(pos.agentId);
      setError(null);
      setOkMsg(null);
      try {
        const { address: addr, client } = await connectWallet();
        await ensureArcChain(client);
        const message = `puls-invest:withdraw:${pos.agentId}`;
        const signature = await client.signMessage({ account: addr, message });
        const res = await withdrawInvestment(pos.agentId, addr, signature);
        setOkMsg(`${res.amountUsdc.toFixed(4)} USDC sent — tx ${res.txHash.slice(0, 10)}…`);
        await load(addr);
      } catch (e) {
        setError((e as Error).message);
      } finally {
        setBusy(null);
      }
    },
    [load],
  );

  return (
    <section id="investments" className="px-4 pt-4 pb-8 sm:px-6">
      <div className="mx-auto max-w-[1180px]">
        <Reveal>
          <Eyebrow>My investments</Eyebrow>
          <h2 className="display-tight mt-5 text-3xl font-bold sm:text-4xl">
            Track <em className="gradient-text italic">your position.</em>
          </h2>
          <p className="mt-3 max-w-2xl text-sm text-muted-foreground">
            Positions are public on Arc. Enter any 0x… address to see invested amounts, pool share
            and claimable value, or connect a wallet to withdraw.
          </p>
        </Reveal>

        <Reveal delay={80}>
          <div className="mt-8 flex flex-col gap-3 rounded-3xl border border-border bg-[rgba(10,14,26,.45)] p-5 sm:flex-row sm:items-center">
            <input
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") void submit();
              }}
              placeholder="0x… address"
              spellCheck={false}
              className="min-w-0 flex-1 rounded-xl border border-border bg-surface px-4 py-3 font-mono text-sm outline-none placeholder:text-subtle focus:border-brand"
            />
            <div className="flex gap-2">
              <Button variant="secondary" size="md" onClick={() => void submit()}>
                Look up
              </Button>
              <Button size="md" onClick={() => void connect()}>
                Connect wallet
              </Button>
            </div>
          </div>
        </Reveal>

        {error && <p className="mt-4 text-xs text-red-300">{error}</p>}
        {okMsg && (
          <p className="mt-4 rounded-xl border border-emerald-500/25 bg-emerald-500/10 px-3 py-2.5 text-xs text-emerald-300">
            {okMsg}
          </p>
        )}

        {loaded && positions !== null && (
          <div className="mt-8">
            {positions.length === 0 ? (
              <p className="rounded-2xl border border-border bg-[rgba(10,14,26,.45)] p-6 text-sm text-muted-foreground">
                No active investments for this address yet — pick an agent above to get started.
              </p>
            ) : (
              <div className="grid gap-4 lg:grid-cols-2">
                {positions.map((pos) => {
                  const color = accentHex[pos.glyph === "⚡" ? "mint" : "sky"] ?? accentHex.mint;
                  return (
                    <div
                      key={pos.agentId}
                      className="rounded-3xl border border-border bg-[rgba(10,14,26,.45)] p-5"
                      style={{ ["--card-accent" as string]: color }}
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex min-w-0 items-center gap-3">
                          <span
                            className="grid h-9 w-9 shrink-0 place-items-center rounded-xl text-base"
                            style={{
                              background: `color-mix(in oklab, ${color} 18%, transparent)`,
                              color,
                            }}
                            aria-hidden="true"
                          >
                            {pos.glyph}
                          </span>
                          <div className="min-w-0">
                            <p className="truncate font-display font-bold">{pos.agentName}</p>
                            <p className="truncate font-mono text-[10px] text-subtle">
                              {pos.agentId}
                            </p>
                          </div>
                        </div>
                        <span className="shrink-0 rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[1.5px] text-muted-foreground">
                          {pos.role}
                        </span>
                      </div>

                      <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
                        <Metric label="Invested" value={`$${pos.invested.toFixed(2)}`} />
                        <Metric label="Pool" value={`$${pos.pool.toFixed(2)}`} />
                        <Metric label="Share" value={`${(pos.share * 100).toFixed(3)}%`} />
                        <Metric
                          label="Claimable"
                          value={`$${pos.claimable.toFixed(4)}`}
                          accent={color}
                        />
                      </div>

                      <div className="mt-4 flex items-center justify-between gap-3 border-t border-border pt-4">
                        <p className="text-[11px] text-subtle">
                          {pos.investments.length} investment
                          {pos.investments.length === 1 ? "" : "s"} ·{" "}
                          {pos.investments[0]?.createdAt?.slice(0, 10)}
                        </p>
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => void withdraw(pos)}
                          disabled={busy !== null || pos.claimable <= 0}
                        >
                          {busy === pos.agentId
                            ? "Withdrawing…"
                            : `Withdraw $${pos.claimable.toFixed(2)}`}
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
            {totals && (
              <p className="mt-5 text-center font-mono text-xs text-subtle">
                total invested ${totals.invested.toFixed(2)} · total claimable $
                {totals.claimable.toFixed(4)}
              </p>
            )}
          </div>
        )}
      </div>
    </section>
  );
}

function Metric({ label, value, accent }: { label: string; value: string; accent?: string }) {
  return (
    <div className="min-w-0">
      <p className="truncate text-[10px] uppercase tracking-[1.5px] text-subtle">{label}</p>
      <p
        className="mt-1 font-mono text-sm font-semibold"
        style={accent ? { color: accent } : undefined}
      >
        {value}
      </p>
    </div>
  );
}
