# De-concierge — Verifiable Booking Ledger

De-concierge is a Polygon-native, ENS-powered source of truth for short-term rental availability. We aggregate Web2 calendars (Airbnb, Vrbo, Google) into a tamper-proof ledger, store evidence on Filecoin Onchain Cloud, and surface conflicts before they cause double-bookings.

## Core Narrative

- **Describe your stay** — Guests type their intent, the AI concierge finds matching listings, and every recommendation cites on-chain history.
- **Trust every host** — ENS primary names and property subnames anchor verifiable metadata, so `loft1.host.eth` is recognizable everywhere.
- **Audit every booking** — Smart contracts log USDC permits, Flare attestations, and Filecoin CIDs so managers can prove what happened, when, and why.

## Prize Track Alignment

- Polygon: Agentic USDC payments orchestrated on-chain with EIP-2612 permits and automation hooks.
- ENS: Creative identity layer for hosts, properties, and AI agents, including subname minting.
- Circle: Programmable USDC flows on Arc (permits, refunds, cross-chain payouts).
- The Graph: Subgraphs powering AI-driven intents, conflict analytics, and dashboards.
- Flare: FDC attestations certifying every Web2 calendar ingest; FTSO for historical price checks.
- Protocol Labs/Filecoin: Immutable storage for calendars, booking proofs, photos, and LLM reasonings.

## Monorepo Layout

```
de-concierge/
├─ STRATEGY.md             # Non-negotiable UI/UX + story guardrails
├─ README.md               # You are here
├─ packages/
│  ├─ contracts/           # Solidity contracts (PropertyRegistry, BookingLedger, Escrow)
│  ├─ frontend/            # Next.js 14 app with Tailwind/daisyUI
│  ├─ services/            # Ingestion workers, agent runners, intent assistant
│  └─ subgraph/            # The Graph project indexing on-chain events
├─ docs/
│  ├─ ARCHITECTURE.md      # System diagram, data flow, prize mapping
│  └─ DEMO_SCRIPT.md       # Story-first walkthrough for judges
└─ scripts/
   └─ bootstrap.sh         # One-command local setup (install, env templates, dev scripts)
```

## High-Level Build Roadmap

1. **Bootstrap**: Scaffold-ETH 2 setup, repo hygiene, shared TypeScript tooling.
2. **Contracts**: PropertyRegistry + BookingLedger + PaymentEscrow with Foundry tests.
3. **Data Indexing**: Subgraph and Postgres schemas; Filecoin Onchain Cloud connector.
4. **Web2 Ingestion**: iCal + Nylas client, Flare Data Connector attestations, Circle USDC permit helpers.
5. **Frontend**: Intent-first UX, host dashboard, ENS integration, verification cards.
6. **AI/Agents**: Vector search, GPT-powered duplicate reasoning, automation runner for bookings.
7. **Polish & Demo**: Architecture diagrams, prize-specific callouts, story-driven video.

## Getting Started (Coming Soon)

Setup scripts and detailed instructions will land as soon as the new scaffolding is committed. For now, review `STRATEGY.md` and `docs/ARCHITECTURE.md` (once published) to stay aligned with the build vision.

