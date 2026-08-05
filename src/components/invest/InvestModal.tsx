import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { accentHex, type Agent } from "@/lib/agents";
import { Button } from "./ui/Button";
import {
  API_BASE,
  ARCSCAN_TX,
  connectWallet,
  depositToGateway,
  ensureArcChain,
  gatewayBalance,
  payInvest,
  usdcBalance,
  walletClientFor,
  type WalletClientT,
  type PayResult,
} from "@/lib/pay";
import { fetchMyInvestments, type Position } from "@/lib/api";

type TxState = "idle" | "busy" | "success";

type Step = "connect" | "chain" | "deposit" | "sign" | "done";

const quickAmounts = [10, 50, 100];

export function InvestModal({ agent, onClose }: { agent: Agent | null; onClose: () => void }) {
  const [amount, setAmount] = useState("10");
  const [tx, setTx] = useState<TxState>("idle");
  const [step, setStep] = useState<Step>("connect");
  const [wallet, setWallet] = useState<string | null>(null);
  const [walletUsdc, setWalletUsdc] = useState<string>("–");
  const [gatewayUsdc, setGatewayUsdc] = useState<string>("–");
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<PayResult | null>(null);
  const [position, setPosition] = useState<Position | null>(null);
  const [depositTxs, setDepositTxs] = useState<{
    approvalTx?: string | undefined;
    depositTx: string;
  } | null>(null);
  const [cliCopied, setCliCopied] = useState(false);
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const restoreFocus = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!agent) return;
    restoreFocus.current = document.activeElement as HTMLElement | null;
    setTx("idle");
    setStep("connect");
    setError(null);
    setResult(null);
    setPosition(null);
    setDepositTxs(null);
    setAmount("10");
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
        "button, input, a[href], [tabindex]:not([tabindex='-1'])",
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
  const apy = agent.apy;
  const hasProfit = apy > 0;
  const projected = useMemo(() => (agent ? (parsed * agent.apy) / 100 : 0), [parsed, agent]);
  const fee = hasProfit ? projected * 0.2 : 0;
  const share = hasProfit ? projected - fee : 0;
  const apyLabel = agent.apy === 0 ? "n/a" : `${agent.apy.toFixed(1)}%`;

  const refreshBalances = useCallback(async (address: string) => {
    try {
      const [w, g] = await Promise.all([
        usdcBalance(address as `0x${string}`),
        gatewayBalance(address as `0x${string}`).catch(() => null),
      ]);
      setWalletUsdc((Number(w) / 1e6).toFixed(2));
      setGatewayUsdc(g ? (Number(g.available) / 1e6).toFixed(2) : "0.00");
    } catch {
      // balances are cosmetic
    }
  }, []);

  const connect = useCallback(async () => {
    setError(null);
    try {
      const { address } = await connectWallet();
      setWallet(address);
      setStep("chain");
      await ensureArcChain(walletClientFor(address));
      setStep("connect");
      await refreshBalances(address);
    } catch (e) {
      setError((e as Error).message === "no-wallet" ? "no-wallet" : (e as Error).message);
    }
  }, [refreshBalances]);

  const invest = useCallback(async () => {
    if (!agent || !wallet || parsed <= 0) return;
    setError(null);
    setTx("busy");
    setDepositTxs(null);
    const addr = wallet as `0x${string}`;
    const client = walletClientFor(addr);
    const url = `${API_BASE}/api/invest/${agent.id}?amountUsdc=${parsed.toFixed(2)}`;
    try {
      await ensureArcChain(client);
      setStep("chain");
      const micro = BigInt(Math.round(parsed * 1_000_000));
      const gw = await gatewayBalance(addr).catch(() => null);
      if (!gw || gw.available < micro) {
        setStep("deposit");
        const txs = await depositToGateway(client, addr, micro);
        setDepositTxs(txs);
      }
      setStep("sign");
      const pay = await payInvest(url, client, addr);
      setResult(pay);
      setStep("done");
      setTx("success");
      const me = await fetchMyInvestments(wallet).catch(() => null);
      const pos = me?.positions?.find((p) => p.agentId === agent.id) ?? null;
      if (pos) setPosition(pos);
      void refreshBalances(wallet);
    } catch (e) {
      setError((e as Error).message);
      setTx("idle");
      setStep("connect");
    }
  }, [agent, wallet, parsed, refreshBalances]);

  const copyCli = useCallback(async () => {
    const cmd = `circle services pay --address ${wallet ?? "<EOA>"} --chain ARC-TESTNET "${API_BASE}/api/invest/${agent?.id}?amountUsdc=${parsed.toFixed(2)}"`;
    try {
      await navigator.clipboard.writeText(cmd);
      setCliCopied(true);
      window.setTimeout(() => setCliCopied(false), 2000);
    } catch {
      setCliCopied(false);
    }
  }, [wallet, agent, parsed]);

  if (!agent) return null;
  const color = accentHex[agent.accent];

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
              Invest in {agent.name}
            </h2>
            <p className="truncate font-mono text-[11px] text-subtle">{agent.address}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close dialog"
            className="grid h-9 w-9 shrink-0 place-items-center rounded-lg border border-border text-muted-foreground hover:text-foreground"
          >
            <svg
              viewBox="0 0 24 24"
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        {tx === "success" && result ? (
          <div className="mt-8 text-center">
            <span
              className="mx-auto grid h-12 w-12 place-items-center rounded-full pulse-gradient"
              aria-hidden="true"
            >
              <svg
                viewBox="0 0 24 24"
                className="h-6 w-6"
                fill="none"
                stroke="#08111c"
                strokeWidth="2.5"
              >
                <path d="M5 12l5 5L19 7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
            <p className="mt-4 font-display text-xl font-bold">Investment settled</p>
            <p className="mt-2 text-sm text-muted-foreground">
              ${parsed.toFixed(2)} USDC is now working with {agent.name} on Arc Testnet.
            </p>
            {(result.data as { payment?: { transaction?: string } })?.payment?.transaction && (
              <a
                href={ARCSCAN_TX(
                  (result.data as { payment: { transaction: string } }).payment.transaction,
                )}
                target="_blank"
                rel="noreferrer"
                className="mt-3 inline-block font-mono text-[11px] text-subtle underline decoration-dotted underline-offset-4 hover:text-foreground"
              >
                gateway tx{" "}
                {(result.data as { payment: { transaction: string } }).payment.transaction.slice(
                  0,
                  18,
                )}
                …
              </a>
            )}
            {position && (
              <dl className="mt-4 space-y-2 rounded-2xl border border-border bg-[rgba(10,14,26,.45)] p-4 text-left text-sm">
                <Row
                  label="Your invested"
                  value={`$${position.invested.toFixed(2)}`}
                  accent={color}
                />
                <Row label="Agent pool" value={`$${position.pool.toFixed(2)}`} />
                <Row label="Pool share" value={`${(position.share * 100).toFixed(2)}%`} />
                <Row
                  label="Claimable now"
                  value={`$${position.claimable.toFixed(4)}`}
                  accent={color}
                />
              </dl>
            )}
            <Button className="mt-6 w-full" onClick={onClose}>
              Done
            </Button>
          </div>
        ) : (
          <>
            <label
              htmlFor="usdc-amount"
              className="mt-7 block text-[11px] uppercase tracking-[1.5px] text-subtle"
            >
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

            {wallet && (
              <p className="mt-3 text-center font-mono text-[11px] text-subtle">
                {wallet.slice(0, 6)}…{wallet.slice(-4)} · wallet {walletUsdc} · gateway{" "}
                {gatewayUsdc} USDC
              </p>
            )}

            <dl
              id="delegation-summary"
              className="mt-6 space-y-2.5 rounded-2xl border border-border bg-[rgba(10,14,26,.45)] p-4 text-sm"
            >
              <Row
                label={`Est. annual yield (${apyLabel} est. APY)`}
                value={hasProfit ? `$${projected.toFixed(2)}` : apy < 0 ? `−${Math.abs(projected).toFixed(2)}` : "$0.00"}
              />
              <Row label="Agent performance fee (20%)" value={`−$${fee.toFixed(2)}`} />
              <Row
                label="Your share"
                value={`$${share.toFixed(2)}`}
                strong
                accent={color}
              />
              {!hasProfit && (
                <p className="text-[11px] text-subtle">
                  {apy < 0
                    ? "Agent is currently net-negative — no fee is charged, losses reduce principal."
                    : "No profit yet — the projection appears once the agent is net positive."}
                </p>
              )}
              <Row label="Network" value="Arc · gas in USDC" />
            </dl>

            {step !== "connect" && tx === "busy" && (
              <ProgressSteps
                step={step}
                approveTx={depositTxs?.approvalTx}
                depositTx={depositTxs?.depositTx}
              />
            )}

            {error && (
              <p className="mt-4 rounded-xl border border-red-500/25 bg-red-500/10 px-3 py-2.5 text-xs text-red-300">
                {error === "no-wallet"
                  ? "No wallet detected — use the Circle CLI path below."
                  : error}
              </p>
            )}

            {error === "no-wallet" ? (
              <div className="mt-6">
                <p className="text-center text-xs text-muted-foreground">
                  Pay from any wallet with the Circle CLI:
                </p>
                <button
                  type="button"
                  onClick={copyCli}
                  className="mt-3 w-full rounded-xl border border-border bg-[rgba(10,14,26,.6)] px-4 py-3 text-left font-mono text-[10px] leading-relaxed text-subtle hover:border-brand"
                >
                  circle services pay --address &lt;EOA&gt; --chain ARC-TESTNET
                  <br />"{API_BASE}/api/invest/{agent.id}?amountUsdc={parsed.toFixed(2)}"
                  <span className="mt-1 block text-right text-[10px] text-muted-foreground">
                    {cliCopied ? "copied ✓" : "tap to copy"}
                  </span>
                </button>
              </div>
            ) : (
              <Button
                className="mt-6 w-full"
                size="lg"
                onClick={() => void (wallet ? invest() : connect())}
                disabled={tx === "busy" || parsed <= 0}
              >
                {tx === "busy"
                  ? step === "deposit"
                    ? "Confirm deposit in wallet…"
                    : step === "sign"
                      ? "Sign payment…"
                      : "Settling…"
                  : wallet
                    ? "Invest via x402"
                    : "Connect wallet"}
              </Button>
            )}
            <p className="mt-3 text-center text-[11px] text-subtle">
              Arc Testnet · real USDC · 20% fee on profits only. Projections are estimates.
            </p>
          </>
        )}
      </div>
    </div>
  );
}

function ProgressSteps({
  step,
  approveTx,
  depositTx,
}: {
  step: Exclude<Step, "connect" | "settling">;
  approveTx?: string | undefined;
  depositTx?: string | undefined;
}) {
  const steps = [
    { label: "Switch to Arc Testnet" },
    {
      label: "Deposit USDC into Gateway wallet",
      sub: approveTx
        ? `approve ${approveTx.slice(0, 10)}…`
        : depositTx
          ? `deposit ${depositTx.slice(0, 10)}…`
          : undefined,
    },
    { label: "Sign x402 payment" },
    { label: "Settle & credit investment" },
  ];
  const idx = { chain: 0, deposit: 1, sign: 2, done: 3 }[step];
  return (
    <div className="mt-5 space-y-2 rounded-2xl border border-border bg-[rgba(10,14,26,.45)] p-4">
      {steps.map((s, i) => (
        <StepLine
          key={s.label}
          active={i <= idx}
          label={s.label}
          sub={i === idx ? s.sub : undefined}
        />
      ))}
    </div>
  );
}

function StepLine({
  active,
  label,
  sub,
}: {
  active: boolean;
  label: string;
  sub?: string | undefined;
}) {
  return (
    <div className="flex items-start gap-2.5">
      <span
        className={`mt-0.5 grid h-4 w-4 shrink-0 place-items-center rounded-full text-[9px] ${
          active ? "pulse-gradient text-[#08111c]" : "border border-border text-transparent"
        }`}
      >
        ✓
      </span>
      <div className="min-w-0">
        <p className={`text-xs ${active ? "text-foreground" : "text-muted-foreground"}`}>{label}</p>
        {sub && <p className="truncate font-mono text-[10px] text-subtle">{sub}</p>}
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
