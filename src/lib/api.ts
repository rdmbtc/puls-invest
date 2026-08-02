import { API_BASE } from "./pay";

export interface AgentCard {
  id: string;
  key: string;
  name: string;
  glyph: string;
  role: string;
  strategy: string;
  address: string | null;
  balance: number;
  invested: number;
  pool: number;
  tvlUsdc: number;
  netUsdc: number;
  isProfitable: boolean;
  apyEstimatePct: number;
}

export interface AgentsResponse {
  ok: boolean;
  network: string;
  asset: string;
  payee: string | null;
  performanceFeePct: number;
  agents: AgentCard[];
  updatedAt: string;
}

export interface PositionInvestment {
  id: string;
  amountUsdc: number;
  status: string;
  createdAt: string;
}

export interface Position {
  agentId: string;
  agentName: string;
  glyph: string;
  role: string;
  invested: number;
  pool: number;
  share: number;
  netShare: number;
  fee: number;
  claimable: number;
  investments: PositionInvestment[];
}

export interface MeResponse {
  ok: boolean;
  address: string;
  performanceFeePct: number;
  totalInvested: number;
  totalClaimable: number;
  positions: Position[];
}

export interface WithdrawResponse {
  ok: boolean;
  agentId: string;
  investor: string;
  amountUsdc: number;
  txHash: string;
  claimableAfter: number;
}

export async function fetchAgents(): Promise<AgentsResponse> {
  const res = await fetch(`${API_BASE}/api/invest/agents`);
  if (!res.ok) throw new Error(`Agent cards failed (${res.status})`);
  return res.json() as Promise<AgentsResponse>;
}

export async function fetchMyInvestments(address: string): Promise<MeResponse> {
  const res = await fetch(`${API_BASE}/api/invest/me?address=${encodeURIComponent(address)}`);
  if (!res.ok) throw new Error(`Position fetch failed (${res.status})`);
  return res.json() as Promise<MeResponse>;
}

export async function withdrawInvestment(
  agentId: string,
  address: string,
  signature: string,
): Promise<WithdrawResponse> {
  const res = await fetch(`${API_BASE}/api/invest/withdraw`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ agentId, address, signature }),
  });
  const body = (await res.json()) as WithdrawResponse & { error?: string };
  if (!res.ok) throw new Error(body.error ?? `Withdraw failed (${res.status})`);
  return body;
}
