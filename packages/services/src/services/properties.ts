import { PROPERTY_DIGESTS } from "../data/sample";
import type { PropertyDigest } from "../types";

export const getPropertyInventory = (featuredPropertyId?: string): PropertyDigest[] => {
  const ordered = [...PROPERTY_DIGESTS];
  if (featuredPropertyId) {
    ordered.sort((a, b) => {
      if (a.id === featuredPropertyId) return -1;
      if (b.id === featuredPropertyId) return 1;
      return a.status.localeCompare(b.status);
    });
  } else {
    ordered.sort((a, b) => a.status.localeCompare(b.status));
  }
  return ordered;
};

