'use client';

import { FormEvent, useMemo, useState } from "react";

type Prompt = {
  id: string;
  label: string;
  hint: string;
};

type Recommendation = {
  id: string;
  intentExample: string;
  title: string;
  ensName: string;
  nightlyRate: string;
  alignment: string[];
  summary: string;
};

type TimelineEvent = {
  id: string;
  time: string;
  label: string;
  detail: string;
};

type PropertyCard = {
  id: string;
  name: string;
  ensName: string;
  status: "available" | "held" | "conflict";
  nextAvailability: string;
  price: string;
  cid: string;
};

const quickPrompts: Prompt[] = [
  {
    id: "romantic",
    label: "Find a sunlit loft in Palermo for next weekend",
    hint: "2 guests · budget 220 USDC/night · prefer balcony",
  },
  {
    id: "conference",
    label: "Need a 3-night stay near La Rural conference halls",
    hint: "Sept 12-15 · work desk · verified WiFi",
  },
  {
    id: "family",
    label: "Secure a family apartment with two bedrooms and privacy",
    hint: "4 guests · kids friendly · 1.5 baths min",
  },
];

const recommendations: Recommendation[] = [
  {
    id: "palermo-loft",
    intentExample: quickPrompts[0].label,
    title: "Palermo Rooftop Loft · sunrise view",
    ensName: "loft1.host.eth",
    nightlyRate: "210 USDC",
    alignment: [
      "Dates free across Airbnb, Vrbo, Google Calendar",
      "Host trust score: 92/100 (privacy-respecting hash)",
      "Balcony + espresso station matched from metadata",
    ],
    summary:
      "Polygon escrow opened at 09:42 — funds held under 3-minute settlement policy. Filecoin CID cid://Qm123 proves the calendar snapshot Flare attested.",
  },
  {
    id: "conference-hub",
    intentExample: quickPrompts[1].label,
    title: "Recoleta Executive Suite · 12 min to La Rural",
    ensName: "suite.recoleta.eth",
    nightlyRate: "265 USDC",
    alignment: [
      "Desk + fiber internet validated via latest host upload",
      "Nylas sync shows no conflicts on Google Calendar",
      "Agent reserved courtesy hold for 45 minutes",
    ],
    summary:
      "USDC permit signed; ledger entry 0x74… keyed to BookingLedger #118 with Hedera mirror hash for auditing.",
  },
  {
    id: "family-stay",
    intentExample: quickPrompts[2].label,
    title: "Colegiales Family Duplex · garden patio",
    ensName: "duplex.casa.eth",
    nightlyRate: "238 USDC",
    alignment: [
      "Two bedrooms + crib available per ENS text records",
      "No conflicts detected; duplicate listing flagged + reconciled",
      "Cleanup buffer auto-inserted between stays",
    ],
    summary:
      "Filecoin snapshot cid://Qm456 ties to ENS text record syncbnb:calendarProof. PaymentEscrow hold ready for host confirmation.",
  },
];

const timeline: TimelineEvent[] = [
  {
    id: "event-1",
    time: "09:35",
    label: "Polygon Tx Finalised",
    detail: "Guest permit processed — 210 USDC locked in PaymentEscrow #132.",
  },
  {
    id: "event-2",
    time: "09:37",
    label: "Flare FDC Attestation",
    detail: "Airbnb + Vrbo ICS synced, attestation digest 0x9e… stored on BookingLedger.",
  },
  {
    id: "event-3",
    time: "09:41",
    label: "LLM Duplicate Check",
    detail: "Agent confirmed `loft1.host.eth` matches Vrbo listing 84721 with 0.92 confidence.",
  },
  {
    id: "event-4",
    time: "09:44",
    label: "ENS Story Badge Issued",
    detail: "De-concierge minted subname `palermo.weekend.host.eth` for shareable proof.",
  },
];

const verificationHighlights = [
  {
    title: "Polygon Agentic Payments",
    blurb: "Permits execute in 3 clicks; automated refunds and release rules cut disputes by 87%.",
    pill: "Polygon track",
  },
  {
    title: "ENS-powered Trust",
    blurb: "Every property fingerprint sits on ENS text records with Filecoin CIDs for evidence.",
    pill: "ENS track",
  },
  {
    title: "Filecoin Proof Vault",
    blurb: "Calendar snapshots, LLM reasoning, and host assets live immutably for audits.",
    pill: "Protocol Labs",
  },
];

const propertyCards: PropertyCard[] = [
  {
    id: "prop-132",
    name: "Palermo Rooftop Loft",
    ensName: "loft1.host.eth",
    status: "held",
    nextAvailability: "Feb 21 · auto-release in 27m",
    price: "210 USDC",
    cid: "cid://Qm123",
  },
  {
    id: "prop-441",
    name: "Recoleta Executive Suite",
    ensName: "suite.recoleta.eth",
    status: "available",
    nextAvailability: "Sept 12-15",
    price: "265 USDC",
    cid: "cid://Qm22D",
  },
  {
    id: "prop-828",
    name: "Colegiales Family Duplex",
    ensName: "duplex.casa.eth",
    status: "conflict",
    nextAvailability: "Flagged overlap on Sept 3",
    price: "238 USDC",
    cid: "cid://Qm456",
  },
];

export default function Home() {
  const defaultResult = recommendations[0];
  const [intent, setIntent] = useState(defaultResult.intentExample);
  const [activeResult, setActiveResult] = useState<Recommendation>(defaultResult);

  const statusBadge = useMemo(
    () =>
      ({
        available: "border-emerald-400/40 bg-emerald-500/10 text-emerald-200",
        held: "border-sky-400/40 bg-sky-500/10 text-sky-200",
        conflict: "border-rose-400/40 bg-rose-500/10 text-rose-200",
      }) as const,
    []
  );

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const match =
      recommendations.find(
        (item) => item.intentExample.toLowerCase() === intent.toLowerCase()
      ) ?? recommendations[0];
    setActiveResult(match);
  };

  const handleQuickPrompt = (prompt: Prompt) => {
    setIntent(prompt.label);
    const match = recommendations.find((item) => item.intentExample === prompt.label);
    if (match) setActiveResult(match);
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(90%_90%_at_50%_0%,rgba(59,130,246,0.35),rgba(2,6,23,0.9))]" />

      <main className="mx-auto flex w-full max-w-6xl flex-col gap-16 px-6 pb-24 pt-16 md:px-10 lg:px-16">
        <header className="flex flex-col gap-10">
          <nav className="flex items-center justify-between rounded-full border border-slate-500/20 bg-slate-900/50 px-6 py-4 shadow-2xl shadow-slate-900/60 backdrop-blur">
            <div className="flex items-center gap-3">
              <span className="brand-gradient inline-flex h-10 w-10 items-center justify-center rounded-full text-lg font-semibold text-slate-950 shadow-lg shadow-emerald-400/50">
                Δ
              </span>
              <div>
                <p className="text-sm uppercase tracking-[0.22em] text-slate-400">
                  De-concierge
                </p>
                <p className="text-sm text-slate-200">
                  Verifiable booking intelligence for humans & agents
                </p>
              </div>
            </div>
            <div className="hidden items-center gap-6 text-sm font-medium text-slate-300 md:flex">
              <span>Story</span>
              <span>Proofs</span>
              <span>Roadmap</span>
            </div>
            <span className="hidden rounded-full border border-slate-400/30 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-slate-200 md:inline-flex">
              Syncing calendars since 2025
            </span>
          </nav>

          <section className="grid gap-12 lg:grid-cols-[1.1fr,0.9fr]">
            <div className="glass-panel rounded-3xl border border-slate-600/30 p-8 backdrop-blur-2xl">
              <p className="inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.32em] text-emerald-100">
                Describe your stay · we surface proofs
              </p>
              <h1 className="mt-6 text-4xl font-semibold leading-tight text-slate-50 md:text-5xl">
                Intent-first booking that proves availability before you trust a
                platform.
              </h1>
              <p className="mt-4 max-w-2xl text-lg text-slate-300">
                De-concierge consolidates Airbnb, Vrbo, Google Calendar and ENS metadata
                into a Polygon-backed ledger. Guests see why a listing fits. Hosts keep
                a Filecoin receipt for every decision.
              </p>

              <form
                onSubmit={handleSubmit}
                className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-stretch"
              >
                <div className="relative flex-1">
                  <input
                    value={intent}
                    onChange={(e) => setIntent(e.target.value)}
                    placeholder="Describe the stay you need…"
                    className="w-full rounded-2xl border border-slate-500/40 bg-slate-900/70 px-5 py-4 text-base text-slate-100 shadow-inner shadow-slate-950 outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/40"
                  />
                  <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-xs uppercase tracking-[0.25em] text-slate-500">
                    AI concierge
                  </span>
                </div>
                <button
                  type="submit"
                  className="brand-gradient flex items-center justify-center rounded-2xl px-6 py-4 text-sm font-semibold uppercase tracking-[0.3em] text-slate-950 shadow-lg shadow-emerald-400/30 transition hover:shadow-emerald-200/60"
                >
                  Generate plan
                </button>
              </form>

              <div className="mt-6 grid gap-3 md:grid-cols-3">
                {quickPrompts.map((prompt) => (
                  <button
                    key={prompt.id}
                    onClick={() => handleQuickPrompt(prompt)}
                    className="rounded-2xl border border-slate-500/30 bg-slate-900/50 px-4 py-4 text-left text-sm text-slate-200 transition hover:border-emerald-400/50 hover:bg-slate-800/60"
                  >
                    <p className="font-medium leading-relaxed text-slate-100">
                      {prompt.label}
                    </p>
                    <p className="mt-2 text-xs text-slate-400">{prompt.hint}</p>
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-6">
              <div className="glass-panel rounded-3xl border border-slate-600/30 p-6 backdrop-blur-2xl">
                <p className="text-xs uppercase tracking-[0.32em] text-slate-400">
                  Recommended match
                </p>
                <h2 className="mt-3 text-2xl font-semibold text-slate-50">
                  {activeResult.title}
                </h2>
                <p className="text-sm text-slate-300">
                  ENS: <span className="font-mono text-emerald-200">{activeResult.ensName}</span>
                </p>
                <p className="mt-3 text-sm text-slate-200">{activeResult.summary}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {activeResult.alignment.map((item) => (
                    <span
                      key={item}
                      className="rounded-full border border-slate-500/40 bg-slate-900/70 px-3 py-1 text-xs text-slate-300"
                    >
                      {item}
                    </span>
                  ))}
                </div>
                <div className="mt-5 flex items-center justify-between rounded-2xl border border-slate-500/30 bg-slate-900/60 px-4 py-3 text-sm text-slate-200">
                  <span>Nightly rate</span>
                  <span className="text-lg font-semibold text-emerald-200">
                    {activeResult.nightlyRate}
                  </span>
                </div>
              </div>

              <div className="glass-panel rounded-3xl border border-slate-600/30 p-6 backdrop-blur-2xl">
                <p className="text-xs uppercase tracking-[0.32em] text-slate-400">
                  Why hosts love it
                </p>
                <ul className="mt-4 space-y-3 text-sm text-slate-300">
                  <li>• One dashboard, verified across all platforms.</li>
                  <li>• Polygon escrow + Circle arc logic handle payouts instantly.</li>
                  <li>• ENS identity & Filecoin evidence keep guests coming back.</li>
                </ul>
              </div>
            </div>
          </section>
        </header>

        <section className="grid gap-6 md:grid-cols-3">
          {verificationHighlights.map((card) => (
            <div
              key={card.title}
              className="glass-panel rounded-3xl border border-slate-600/40 px-6 py-6 transition hover:border-emerald-400/40"
            >
              <p className="text-xs uppercase tracking-[0.32em] text-emerald-200">
                {card.pill}
              </p>
              <h3 className="mt-3 text-xl font-semibold text-slate-50">{card.title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-300">{card.blurb}</p>
            </div>
          ))}
        </section>

        <section className="grid gap-8 lg:grid-cols-[1.05fr,0.95fr]">
          <div className="glass-panel rounded-3xl border border-slate-600/30 p-6 backdrop-blur-2xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.32em] text-slate-400">
                  Live ledger feed
                </p>
                <h3 className="mt-2 text-2xl font-semibold text-slate-50">
                  Booking timeline you can verify
                </h3>
              </div>
              <span className="rounded-full border border-slate-500/40 bg-slate-900/70 px-4 py-2 text-xs text-slate-300">
                Hedera mirror hash synced
              </span>
            </div>
            <ol className="mt-6 space-y-4">
              {timeline.map((event) => (
                <li
                  key={event.id}
                  className="rounded-2xl border border-slate-600/30 bg-slate-900/60 px-4 py-4"
                >
                  <div className="flex items-center justify-between text-xs uppercase tracking-[0.32em] text-slate-400">
                    <span>{event.label}</span>
                    <span>{event.time}</span>
                  </div>
                  <p className="mt-3 text-sm text-slate-200">{event.detail}</p>
                </li>
              ))}
            </ol>
          </div>

          <div className="glass-panel rounded-3xl border border-slate-600/30 p-6 backdrop-blur-2xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.32em] text-slate-400">
                  Inventory snapshot
                </p>
                <h3 className="mt-2 text-2xl font-semibold text-slate-50">
                  ENS-verified properties
                </h3>
              </div>
              <span className="rounded-full border border-slate-500/40 bg-slate-900/70 px-4 py-2 text-xs text-slate-300">
                Filecoin vault synced
              </span>
            </div>
            <div className="mt-6 space-y-4">
              {propertyCards.map((property) => (
                <article
                  key={property.id}
                  className="rounded-2xl border border-slate-600/30 bg-slate-900/60 px-4 py-4"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h4 className="text-lg font-semibold text-slate-100">{property.name}</h4>
                      <p className="text-xs uppercase tracking-[0.28em] text-slate-400">
                        {property.ensName}
                      </p>
                    </div>
                    <span
                      className={`rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.28em] ${
                        statusBadge[property.status]
                      }`}
                    >
                      {property.status}
                    </span>
                  </div>
                  <dl className="mt-4 grid grid-cols-2 gap-3 text-xs text-slate-300">
                    <div>
                      <dt className="uppercase tracking-[0.28em] text-slate-500">
                        Next availability
                      </dt>
                      <dd className="mt-1 text-sm text-slate-100">{property.nextAvailability}</dd>
                    </div>
                    <div>
                      <dt className="uppercase tracking-[0.28em] text-slate-500">Rate</dt>
                      <dd className="mt-1 text-sm text-emerald-200">{property.price}</dd>
                    </div>
                    <div className="col-span-2">
                      <dt className="uppercase tracking-[0.28em] text-slate-500">
                        Filecoin proof
                      </dt>
                      <dd className="mt-1 font-mono text-xs text-slate-400">{property.cid}</dd>
                    </div>
                  </dl>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="glass-panel rounded-3xl border border-slate-600/30 px-8 py-10 backdrop-blur-2xl">
          <div className="grid gap-8 lg:grid-cols-[1.1fr,0.9fr]">
            <div>
              <p className="text-xs uppercase tracking-[0.32em] text-slate-400">The story</p>
              <h3 className="mt-2 text-3xl font-semibold text-slate-50">
                “We overbooked twice last quarter. De-concierge gave us a reconciled ledger in
                a day.”
              </h3>
              <p className="mt-4 text-sm text-slate-300">
                Buenos Aires host @loft1 now syncs Airbnb, Vrbo, and Google Calendar via Flare
                attestations. The agent reconciles duplicates with an explainable LLM, wraps up
               payments via Circle Arc, and exports a Filecoin-backed timeline for insurance.
              </p>
            </div>
            <div className="rounded-3xl border border-slate-500/40 bg-slate-900/60 p-6 text-sm text-slate-200">
              <p className="text-xs uppercase tracking-[0.32em] text-emerald-200">
                Hackathon pitch ready
              </p>
              <ul className="mt-4 space-y-3">
                <li>• Polygon track → showcase agentic permit automation.</li>
                <li>• ENS track → subname UX & property fingerprinting.</li>
                <li>• Circle track → programmable refunds + treasury logic.</li>
                <li>• Flare track → FDC-backed Web2 ingestion evidence.</li>
                <li>• Filecoin track → immutable booking & LLM proof archive.</li>
              </ul>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
