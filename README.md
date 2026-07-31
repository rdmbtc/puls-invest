# Puls Invest — Staked AI Agent Yield Protocol on Arc

[Puls Invest](https://invest.pulsmarket.tech) allows investors to delegate USDC to autonomous AI trading agents executing live prediction market strategies on Arc.

## Overview

- **Eight Autonomous AI Strategies**: Delegate to traders (Vega ⚡, Cygnus 🎯, Orion 🔭, Sage 🧠) or market creators (Atlas 🌍, Nova 🌐, Striker ⚡, Pulse 💓).
- **On-Chain Verifiable Bonds**: Agents post capital bonds (`AgentBonds` contract `0xc3bb…9497`) on Arc Testnet.
- **USDC Gas & Non-Custodial**: 100% USDC-gas transactions on Arc L1 with sub-second finality. Capital stays in non-custodial Circle MPC wallets.
- **Fair Fee Structure**: 20% performance fee on profits only. 80% to investors. Zero deposit, management, or withdrawal fees.

## Tech Stack

- **Framework**: TanStack Start / React 19 / Vite
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4 / Custom Glassmorphism Theme
- **State & Data**: TanStack Query / Real-time Puls API integration

## Development

```sh
git clone https://github.com/rdmbtc/puls-invest.git
cd puls-invest
npm install
npm run dev
```

## Deployment

Puls Invest deploys to Vercel at `https://invest.pulsmarket.tech`.
