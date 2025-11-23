import type { RecommendationBase } from "../types.js";

type ScoreResult = {
  score: number;
  matchedKeywords: string[];
};

const BASELINE_SCORE = 5;

export const normalizeIntent = (intent: string): string =>
  intent
    .toLowerCase()
    .replace(/[^\w\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

export const scoreRecommendation = (
  normalizedIntent: string,
  recommendation: RecommendationBase
): ScoreResult => {
  if (!normalizedIntent) {
    return {
      score: (recommendation.priority ?? 0) + BASELINE_SCORE,
      matchedKeywords: [],
    };
  }

  const matchedKeywords = recommendation.keywords.filter((keyword) =>
    normalizedIntent.includes(keyword.toLowerCase())
  );

  const partialMatches = recommendation.keywords.filter(
    (keyword) =>
      !matchedKeywords.includes(keyword) &&
      keyword
        .split(" ")
        .some((part) => part.length > 3 && normalizedIntent.includes(part.toLowerCase()))
  );

  const score =
    matchedKeywords.length * 5 +
    partialMatches.length * 2 +
    (recommendation.priority ?? 0) * 2 +
    BASELINE_SCORE;

  return {
    score,
    matchedKeywords,
  };
};

export const computeConfidence = (score: number): number => {
  const capped = Math.min(score, 25);
  return Number((capped / 25).toFixed(2));
};

