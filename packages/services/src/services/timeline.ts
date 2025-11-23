import { TIMELINE_EVENTS } from "../data/sample";
import type { TimelineEvent } from "../types";

export const getTimelineForProperty = (propertyId: string): TimelineEvent[] => {
  const matches = TIMELINE_EVENTS.filter((event) => event.propertyId === propertyId);
  if (matches.length > 0) return matches;
  return TIMELINE_EVENTS.slice(0, 3);
};

