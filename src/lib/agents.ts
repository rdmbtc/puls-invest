export type AgentRole = "trader" | "creator";

export type AgentAccent = "mint" | "sky" | "violet" | "amber" | "pink" | "teal" | "indigo" | "rose";

export const accentHex: Record<AgentAccent, string> = {
  mint: "#2DD4BF",
  sky: "#38BDF8",
  violet: "#A78BFA",
  amber: "#F59E0B",
  pink: "#F472B6",
  teal: "#14B8A6",
  indigo: "#818CF8",
  rose: "#FB7185",
};

export interface Agent {
  id: string;
  name: string;
  glyph: string;
  role: AgentRole;
  accent: AgentAccent;
  strategy: string;
  winRate: number;
  apy: number;
  roi30d: number;
  tvl: number;
  realizedPnlUsdc?: number;
  tradesCount?: number;
  winsCount?: number;
  resolvedCount?: number;
  address: string;
  seed: number;
}

export const agents: Agent[] = [
  {
    id: "vega",
    name: "Vega ⚡",
    glyph: "⚡",
    role: "trader",
    accent: "mint",
    strategy:
      "VOLATILITY: Hunts high-uncertainty prediction markets with momentum & data edge. Fades crowd overreactions.",
    winRate: 71.4,
    apy: 58.9,
    roi30d: 12.6,
    tvl: 4120,
    address: "0xed23…0b4c",
    seed: 11,
  },
  {
    id: "cygnus",
    name: "Cygnus 🎯",
    glyph: "🎯",
    role: "trader",
    accent: "sky",
    strategy:
      "MOMENTUM: High-volume sentiment shifts & event liquidity flow across active prediction markets.",
    winRate: 66.2,
    apy: 49.3,
    roi30d: 9.1,
    tvl: 2080,
    address: "0x7a37…96ba",
    seed: 23,
  },
  {
    id: "orion",
    name: "Orion 🔭",
    glyph: "🔭",
    role: "trader",
    accent: "violet",
    strategy:
      "ARBITRAGE: Sub-second cross-market probability gap exploitation and automated convergence trades.",
    winRate: 74.8,
    apy: 41.7,
    roi30d: 7.4,
    tvl: 1760,
    address: "0x37e5…c08f",
    seed: 37,
  },
  {
    id: "atlas",
    name: "Atlas 🌍",
    glyph: "🌍",
    role: "creator",
    accent: "amber",
    strategy:
      "MACRO: Deploys high-conviction macro & economic prediction markets on Arc, bonding capital on outcome calls.",
    winRate: 63.9,
    apy: 45.2,
    roi30d: 8.8,
    tvl: 1430,
    address: "0x9f63…09b5",
    seed: 41,
  },
  {
    id: "nova",
    name: "Nova 🌐",
    glyph: "🌐",
    role: "creator",
    accent: "pink",
    strategy:
      "CULTURE & TECH: Deploys fast-resolving technology and trending culture markets with tight automated spreads.",
    winRate: 61.5,
    apy: 52.6,
    roi30d: 11.2,
    tvl: 1210,
    address: "0x4fc4…9a10",
    seed: 53,
  },
  {
    id: "striker",
    name: "Striker ⚡",
    glyph: "⚡",
    role: "creator",
    accent: "teal",
    strategy:
      "SPORTS & EVENTS: High-frequency sports outcome market creator and live event market maker.",
    winRate: 68.7,
    apy: 38.4,
    roi30d: 6.3,
    tvl: 970,
    address: "0x108c…2677",
    seed: 67,
  },
  {
    id: "sage",
    name: "Sage 🧠",
    glyph: "🧠",
    role: "trader",
    accent: "indigo",
    strategy:
      "QUANT: Fundamental value and deep statistical edge analysis on long-horizon science and tech bets.",
    winRate: 69.8,
    apy: 44.1,
    roi30d: 8.9,
    tvl: 740,
    address: "0x8893…e377",
    seed: 79,
  },
  {
    id: "pulse",
    name: "Pulse 💓",
    glyph: "💓",
    role: "creator",
    accent: "rose",
    strategy:
      "MARKET MAKER: Protocol liquidity provider and house market creator ensuring tight spreads across Arc.",
    winRate: 64.3,
    apy: 47.8,
    roi30d: 7.9,
    tvl: 490,
    address: "0x3a5d…539e",
    seed: 91,
  },
];

/** Deterministic pseudo-random walk used by the sparklines. */
export function sparkSeries(seed: number, points = 24): number[] {
  let state = seed * 9301 + 49297;
  const out: number[] = [];
  let value = 50;
  for (let i = 0; i < points; i += 1) {
    state = (state * 9301 + 49297) % 233280;
    const noise = state / 233280 - 0.45;
    value = Math.max(6, Math.min(94, value + noise * 22));
    out.push(value);
  }
  return out;
}

export const usd = (value: number) =>
  value >= 1_000_000
    ? `$${(value / 1_000_000).toFixed(2)}M`
    : value >= 1000
      ? `$${(value / 1000).toFixed(1)}K`
      : `$${Math.round(value)}`;
