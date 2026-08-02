import { createPublicClient, createWalletClient, custom, http } from "viem";
import { arcTestnet } from "viem/chains";
import type { Account, Address, Hex } from "viem";

export type WalletClientT = ReturnType<typeof walletClientFor>;

const ethereumProvider = () =>
  (window as unknown as { ethereum: Parameters<typeof custom>[0] }).ethereum;

export const API_BASE = "https://api.pulsmarket.tech";

export const USDC = "0x3600000000000000000000000000000000000000" as const;
export const GATEWAY_WALLET = "0x0077777d7EBA4688BDeF3E311b846F25870A19B9" as const;
export const GATEWAY_API = "https://gateway-api-testnet.circle.com/v1";
export const ARCSCAN_TX = (hash: string) => `https://testnet.arcscan.app/tx/${hash}`;
export const ARCSCAN_ADDR = (addr: string) => `https://testnet.arcscan.app/address/${addr}`;

const erc20Abi = [
  {
    name: "balanceOf",
    type: "function",
    stateMutability: "view",
    inputs: [{ name: "a", type: "address" }],
    outputs: [{ name: "", type: "uint256" }],
  },
  {
    name: "allowance",
    type: "function",
    stateMutability: "view",
    inputs: [
      { name: "owner", type: "address" },
      { name: "spender", type: "address" },
    ],
    outputs: [{ name: "", type: "uint256" }],
  },
  {
    name: "approve",
    type: "function",
    stateMutability: "nonpayable",
    inputs: [
      { name: "spender", type: "address" },
      { name: "amount", type: "uint256" },
    ],
    outputs: [{ name: "", type: "bool" }],
  },
] as const;

const gatewayAbi = [
  {
    name: "deposit",
    type: "function",
    stateMutability: "nonpayable",
    inputs: [
      { name: "token", type: "address" },
      { name: "value", type: "uint256" },
    ],
    outputs: [],
  },
] as const;

export const publicClient = createPublicClient({
  chain: arcTestnet,
  transport: http(),
});

export function hasInjectedWallet(): boolean {
  return typeof window !== "undefined" && Boolean((window as { ethereum?: unknown }).ethereum);
}

export function walletClientFor(account: Address) {
  return createWalletClient({ chain: arcTestnet, transport: custom(ethereumProvider()), account });
}

export async function connectWallet(): Promise<{ address: Address; client: WalletClientT }> {
  if (!hasInjectedWallet()) throw new Error("no-wallet");
  const client = createWalletClient({ chain: arcTestnet, transport: custom(ethereumProvider()) });
  const [address] = await client.requestAddresses();
  if (!address) throw new Error("Wallet returned no accounts");
  return { address, client: walletClientFor(address) };
}

export async function ensureArcChain(client: WalletClientT): Promise<void> {
  const ethereum = ethereumProvider();
  if (!ethereum) throw new Error("no-wallet");
  const chainId = `0x${arcTestnet.id.toString(16)}`;
  try {
    await ethereum.request({ method: "wallet_switchEthereumChain", params: [{ chainId }] });
  } catch (err) {
    const code = (err as { code?: number }).code;
    if (code === 4902) {
      await ethereum.request({
        method: "wallet_addEthereumChain",
        params: [
          {
            chainId,
            chainName: "Arc Testnet",
            nativeCurrency: { name: "USDC", symbol: "USDC", decimals: 18 },
            rpcUrls: ["https://rpc.testnet.arc.network"],
            blockExplorerUrls: ["https://testnet.arcscan.app"],
          },
        ],
      });
    } else {
      throw err;
    }
  }
}

export async function usdcBalance(address: Address): Promise<bigint> {
  return publicClient.readContract({
    address: USDC,
    abi: erc20Abi,
    functionName: "balanceOf",
    args: [address],
  });
}

export interface GatewayBalance {
  available: bigint;
  total: bigint;
}

export async function gatewayBalance(address: Address): Promise<GatewayBalance> {
  const res = await fetch(`${GATEWAY_API}/balances`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token: "USDC", sources: [{ depositor: address, domain: 26 }] }),
  });
  if (!res.ok) throw new Error(`Gateway balance check failed (${res.status})`);
  const data = (await res.json()) as {
    balances?: Array<{ balance: string; withdrawing?: string }>;
  };
  const b = data.balances?.[0];
  if (!b) return { available: 0n, total: 0n };
  const available = BigInt(b.balance ?? "0");
  const withdrawing = BigInt(b.withdrawing ?? "0");
  return { available, total: available + withdrawing };
}

export interface DepositResult {
  approvalTx?: Hex | undefined;
  depositTx: Hex;
}

export async function depositToGateway(
  client: WalletClientT,
  address: Address,
  amountMicro: bigint,
): Promise<DepositResult> {
  const allowance = await publicClient.readContract({
    address: USDC,
    abi: erc20Abi,
    functionName: "allowance",
    args: [address, GATEWAY_WALLET],
  });
  let approvalTx: Hex | undefined;
  if (allowance < amountMicro) {
    approvalTx = await client.writeContract({
      address: USDC,
      abi: erc20Abi,
      functionName: "approve",
      args: [GATEWAY_WALLET, amountMicro],
    });
    await publicClient.waitForTransactionReceipt({ hash: approvalTx });
  }
  const depositTx = await client.writeContract({
    address: GATEWAY_WALLET,
    abi: gatewayAbi,
    functionName: "deposit",
    args: [USDC, amountMicro],
    gas: 120000n,
  });
  await publicClient.waitForTransactionReceipt({ hash: depositTx });
  return { approvalTx, depositTx };
}

// ── x402 browser pay (mirrors @circle-fin/x402-batching client, no Buffer) ──

interface BatchingOption {
  scheme: string;
  network: string;
  asset: string;
  amount: string;
  payTo: string;
  maxTimeoutSeconds: number;
  extra?: { name?: string; version?: string; verifyingContract?: string };
}

interface PaymentRequired {
  x402Version?: number;
  resource?: { url: string; description: string; mimeType: string };
  accepts?: BatchingOption[];
}

export interface PayResult {
  data: unknown;
  amountMicro: bigint;
  payTo: string;
}

const b64encode = (json: string) => btoa(String.fromCharCode(...new TextEncoder().encode(json)));

function randomNonce(): Hex {
  const bytes = new Uint8Array(32);
  crypto.getRandomValues(bytes);
  return `0x${Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("")}`;
}

export async function payInvest(
  url: string,
  client: WalletClientT,
  address: Address,
): Promise<PayResult> {
  const initial = await fetch(url);
  if (initial.status === 200) {
    return { data: await initial.json(), amountMicro: 0n, payTo: "" };
  }
  if (initial.status !== 402) throw new Error(`Invest endpoint error (${initial.status})`);
  const header = initial.headers.get("PAYMENT-REQUIRED");
  if (!header) throw new Error("Missing PAYMENT-REQUIRED header");

  const paymentRequired: PaymentRequired = JSON.parse(atob(header));
  const option = paymentRequired.accepts?.find(
    (o) =>
      o.network === `eip155:${arcTestnet.id}` &&
      o.extra?.name === "GatewayWalletBatched" &&
      o.extra?.version === "1" &&
      o.extra?.verifyingContract,
  );
  if (!option || !option.extra?.verifyingContract)
    throw new Error("Gateway batching not supported for Arc");
  if (option.asset.toLowerCase() !== USDC) throw new Error("USDC required");

  const now = Math.floor(Date.now() / 1e3);
  const validity = Math.max(option.maxTimeoutSeconds ?? 0, 7 * 24 * 60 * 60 + 100);
  const authorization = {
    from: address,
    to: option.payTo,
    value: option.amount,
    validAfter: String(now - 600),
    validBefore: String(now + validity),
    nonce: randomNonce(),
  };

  const signature = await client.signTypedData({
    account: address,
    domain: {
      name: "GatewayWalletBatched",
      version: "1",
      chainId: arcTestnet.id,
      verifyingContract: option.extra.verifyingContract as Address,
    },
    types: {
      TransferWithAuthorization: [
        { name: "from", type: "address" },
        { name: "to", type: "address" },
        { name: "value", type: "uint256" },
        { name: "validAfter", type: "uint256" },
        { name: "validBefore", type: "uint256" },
        { name: "nonce", type: "bytes32" },
      ],
    },
    primaryType: "TransferWithAuthorization",
    message: {
      from: address,
      to: option.payTo as Address,
      value: BigInt(option.amount),
      validAfter: BigInt(authorization.validAfter),
      validBefore: BigInt(authorization.validBefore),
      nonce: authorization.nonce,
    },
  });

  const paymentHeader = b64encode(
    JSON.stringify({
      x402Version: paymentRequired.x402Version ?? 2,
      payload: { authorization, signature },
      resource: paymentRequired.resource,
      accepted: option,
    }),
  );

  const paid = await fetch(url, { headers: { "Payment-Signature": paymentHeader } });
  const body = await paid.json().catch(() => ({}));
  if (!paid.ok)
    throw new Error((body as { error?: string }).error ?? `Payment failed (${paid.status})`);
  return { data: body, amountMicro: BigInt(option.amount), payTo: option.payTo };
}
