# De-concierge Architecture Blueprint

> Story-first reminder: every component must be explainable in one sentence that ties back to verifiable, user-focused booking sync.

## System Overview

```
Guest/Host UI (Next.js 14)
 ├─ Intent prompt + AI concierge
 ├─ Host dashboard (timeline, conflicts, ENS branding)
 └─ Booking receipts with Polygon + Filecoin proofs
        │
        ▼
Backend Services (TypeScript Monorepo)
 ├─ Intent Orchestrator (OpenAI + pgvector)
 ├─ Calendar Ingestion (iCal, Nylas) + Flare FDC attestations
 ├─ Duplicate Detector (deterministic scoring + GPT reasoning)
 └─ Agent Runner (booking confirmation, notifications, Circle x402 payments)
        │
        ▼
Polygon Smart Contracts
 ├─ PropertyRegistry (ENS + Filecoin metadata)
 ├─ BookingLedger (USDC permits, attested bookings, dispute states)
 └─ PaymentEscrow (conditional release, refunds, Circle Arc interoperability)
        │
        ▼
Data Layers
 ├─ Filecoin Onchain Cloud (raw artifacts, photos, LLM logs)
 ├─ The Graph Subgraph (on-chain indexing for UI + AI)
 └─ Postgres (operational cache, embeddings, agent state)
```

## Key Interactions

1. **Host onboarding**
   - Connect wallet → resolve ENS → mint/assign property subnames.
   - Upload metadata (address, geo, amenities, photo) → stored on Filecoin → hash anchored in `PropertyRegistry`.
2. **Calendar ingestion**
   - Host supplies ICS URLs or OAuth credentials.
   - Ingestion job fetches data, signs with Flare Data Connector, stores raw file on Filecoin, writes digest reference to Polygon.
3. **Intent booking**
   - Guest describes stay → Intent Orchestrator maps to filters → vector search returns candidate properties.
   - UI shows ranked list with explanation tags (“ENS host verified”, “Conflicts resolved”).
   - Guest signs USDC permit; transaction hits `BookingLedger`.
4. **Agent verification**
   - Agent worker reads event, cross-checks latest calendar snapshots.
   - If clear, confirms booking and triggers escrow release; otherwise cancels and refunds.
   - Duplicate detection (deterministic + LLM) runs whenever new listings appear; host approves matches.
5. **Audit + exports**
   - The Graph subgraph powers dashboards, AI queries, and external analytics.
   - Auto-generated ICS feeds (from clean ledger) let hosts push updates back to platforms manually until native integrations exist.

## Compliance With Prize Tracks

- **Polygon**: Agent-driven permit flow (x402 optional), automated settlements, low-fee ledger.
- **ENS**: Identity layer, property subnames, AI agent naming, all visible in UI.
- **Circle**: Advanced USDC logic (Arc deployments + programmable wallets), cross-chain payout showcase.
- **The Graph**: Subgraph powering AI intent queries and conflict analytics.
- **Flare**: FDC attestations on ingestion; README includes developer feedback.
- **Filecoin**: Onchain Cloud storing every artifact; CIDs hashed into ENS + contracts.

## Next Steps

- Scaffold monorepo (Scaffold-ETH 2 for contracts/frontend, turborepo or pnpm workspaces for services).
- Define shared TypeScript config, linting, formatting.
- Commit bootstrap scripts and environment templates (`.env.example`).
- Flesh out detailed component specifications in subsequent docs (LLM prompts, data models, event schemas).

