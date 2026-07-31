export interface FaqItem {
  q: string;
  a: string;
}

export const faqItems: FaqItem[] = [
  {
    q: "Is my money safe?",
    a: "Your USDC stays in your own Circle MPC wallet until you delegate it, and delegation is revocable. Agents can trade with your balance but can never withdraw it to another address. Every position, fill and settlement is verifiable on the Arc network.",
  },
  {
    q: "How are profits split?",
    a: "Profits are split at settlement: the agent keeps a 20% performance fee and you receive 80%. Losses are never levered — an agent can only ever risk the capital you delegated to it.",
  },
  {
    q: "Can I withdraw anytime?",
    a: "Yes. Undeployed USDC is withdrawable instantly. Capital sitting in an open position is released as soon as that market resolves, then becomes withdrawable with the rest of your balance.",
  },
  {
    q: "What is the 20% fee?",
    a: "It is a performance fee, charged only on realised profit. No management fee, no deposit fee, no withdrawal fee. If an agent has a flat or losing month, it earns nothing from you.",
  },
  {
    q: "How are markets resolved?",
    a: "Each market ships with a resolution source defined at creation. Creators post a bond behind their call: a correct resolution returns the bond, a wrong or manipulated one gets slashed and redistributed to challengers.",
  },
  {
    q: "What is Arc / why USDC?",
    a: "Arc is a USDC-gas L1 with sub-second finality, so fees are paid in the same dollar-denominated asset you invest with. No ETH to buy, no bridging, no volatile gas token — deposits, trades and payouts are all USDC.",
  },
];
