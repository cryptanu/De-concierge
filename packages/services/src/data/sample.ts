import { DateTime } from "luxon";
import type {
  PropertyDigest,
  QuickPrompt,
  RecommendationBase,
  TimelineEvent,
} from "../types";

export const QUICK_PROMPTS: QuickPrompt[] = [
  {
    id: "palermo-weekend",
    label: "Find a sunlit loft in Palermo for next weekend",
    hint: "2 guests · 220 USDC/night budget · balcony for morning coffee",
    keywords: ["palermo", "loft", "weekend", "balcony", "sunlit"],
  },
  {
    id: "conference-suite",
    label: "Need a 3-night stay near La Rural conference halls",
    hint: "Executives · desk + fiber · Sept 12-15",
    keywords: ["conference", "la rural", "desk", "fiber", "executive"],
  },
  {
    id: "family-retreat",
    label: "Secure a family apartment with two bedrooms and privacy",
    hint: "Parents with kids · 2 bedrooms · garden or outdoor space",
    keywords: ["family", "two bedroom", "garden", "kids", "privacy"],
  },
];

export const RECOMMENDATIONS: RecommendationBase[] = [
  {
    id: "rec-palermo-loft",
    intentExample: QUICK_PROMPTS[0].label,
    title: "Palermo Rooftop Loft · sunrise view",
    ensName: "loft1.host.eth",
    nightlyRate: "210 USDC",
    summary:
      "Polygon escrow opened at 09:42 — funds held under 3-minute settlement policy. Filecoin CID cid://Qm123 proves the calendar snapshot Flare attested.",
    highlights: [
      "Dates free across Airbnb, Vrbo, Google Calendar",
      "Host trust score: 92/100 (privacy-preserving hash)",
      "Balcony + espresso station mapped from metadata upload",
    ],
    propertyId: "prop-132",
    keywords: [
      "palermo",
      "loft",
      "sunlit",
      "balcony",
      "espresso",
      "weekend",
      "sunrise",
    ],
    priority: 3,
  },
  {
    id: "rec-conference-suite",
    intentExample: QUICK_PROMPTS[1].label,
    title: "Recoleta Executive Suite · 12 min to La Rural",
    ensName: "suite.recoleta.eth",
    nightlyRate: "265 USDC",
    summary:
      "USDC permit signed; ledger entry 0x74… keyed to BookingLedger #118 with Hedera mirror hash for auditing.",
    highlights: [
      "Desk + fiber internet validated via latest host upload",
      "Nylas sync shows zero conflicts on Google Calendar",
      "Agent reserved courtesy hold for 45 minutes",
    ],
    propertyId: "prop-441",
    keywords: [
      "conference",
      "la rural",
      "executive",
      "desk",
      "wifi",
      "fiber",
      "business",
    ],
    priority: 2,
  },
  {
    id: "rec-family-duplex",
    intentExample: QUICK_PROMPTS[2].label,
    title: "Colegiales Family Duplex · garden patio",
    ensName: "duplex.casa.eth",
    nightlyRate: "238 USDC",
    summary:
      "Filecoin snapshot cid://Qm456 ties to ENS text record syncbnb:calendarProof. PaymentEscrow hold ready for host confirmation.",
    highlights: [
      "Two bedrooms + crib confirmed via ENS text records",
      "No conflicts detected; duplicate listing reconciled by agent",
      "Cleanup buffer auto-inserted between stays",
    ],
    propertyId: "prop-828",
    keywords: [
      "family",
      "two bedroom",
      "garden",
      "kids",
      "privacy",
      "duplex",
      "patio",
    ],
    priority: 2,
  },
];

export const TIMELINE_EVENTS: TimelineEvent[] = [
  {
    id: "tm-132-1",
    propertyId: "prop-132",
    time: "09:35",
    label: "Polygon Tx Finalised",
    detail: "Guest permit processed — 210 USDC locked in PaymentEscrow #132.",
  },
  {
    id: "tm-132-2",
    propertyId: "prop-132",
    time: "09:37",
    label: "Flare FDC Attestation",
    detail: "Airbnb + Vrbo ICS synced, attestation digest 0x9e… stored on BookingLedger.",
  },
  {
    id: "tm-132-3",
    propertyId: "prop-132",
    time: "09:41",
    label: "LLM Duplicate Check",
    detail: "Agent confirmed `loft1.host.eth` matches Vrbo listing 84721 with 0.92 confidence.",
  },
  {
    id: "tm-132-4",
    propertyId: "prop-132",
    time: "09:44",
    label: "ENS Story Badge Issued",
    detail: "De-concierge minted subname `palermo.weekend.host.eth` for shareable proof.",
  },
  {
    id: "tm-441-1",
    propertyId: "prop-441",
    time: "08:15",
    label: "Payment Hold",
    detail: "Circle Arc wallet opened 24-hour hold for executive stay.",
  },
  {
    id: "tm-441-2",
    propertyId: "prop-441",
    time: "08:18",
    label: "Availability Cross-check",
    detail: "Nylas Google Calendar sync double confirmed open desk hours.",
  },
  {
    id: "tm-828-1",
    propertyId: "prop-828",
    time: "07:52",
    label: "Duplicate Resolved",
    detail: "Vrbo + Airbnb listings merged; Filecoin CID updated for audit trace.",
  },
];

export const PROPERTY_DIGESTS: PropertyDigest[] = [
  {
    id: "prop-132",
    name: "Palermo Rooftop Loft",
    ensName: "loft1.host.eth",
    status: "held",
    nextAvailability: "Feb 21 · auto-release in 27m",
    price: "210 USDC",
    cid: "cid://Qm123",
    tags: ["balcony", "espresso", "sunrise"],
    relatedRecommendationIds: ["rec-palermo-loft"],
    lastSyncISO: DateTime.utc().minus({ minutes: 6 }).toISO(),
  },
  {
    id: "prop-441",
    name: "Recoleta Executive Suite",
    ensName: "suite.recoleta.eth",
    status: "available",
    nextAvailability: "Sept 12-15",
    price: "265 USDC",
    cid: "cid://Qm22D",
    tags: ["desk", "fiber", "executive"],
    relatedRecommendationIds: ["rec-conference-suite"],
    lastSyncISO: DateTime.utc().minus({ minutes: 14 }).toISO(),
  },
  {
    id: "prop-828",
    name: "Colegiales Family Duplex",
    ensName: "duplex.casa.eth",
    status: "conflict",
    nextAvailability: "Flagged overlap on Sept 3",
    price: "238 USDC",
    cid: "cid://Qm456",
    tags: ["garden", "kids", "privacy"],
    relatedRecommendationIds: ["rec-family-duplex"],
    lastSyncISO: DateTime.utc().minus({ minutes: 32 }).toISO(),
  },
];

