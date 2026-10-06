/**
 * Price Change and Tag Calculation Logic
 * Requirements: FR-043, FR-044, UI-015, EDGE-002
 */

import { ListingTag, PriceHistoryPoint } from '../types/listing';

export interface PriceAnalysis {
  tags: ListingTag[];
  discountAmount?: number;
  discountPercentage?: number;
  isLowered: boolean;
  isRaised: boolean;
}

/**
 * Calculates whether a listing qualifies for 'good_deal' or 'hot' based on price changes.
 * Edge-002: Always compares current price against baseline (initialPrice or previous price in history).
 */
export function calculatePriceBadges(
  currentPrice: number,
  initialPrice: number,
  priceHistory: PriceHistoryPoint[] = [],
): PriceAnalysis {
  // If no previous history or single entry, baseline is initialPrice
  const baselinePrice =
    priceHistory.length > 1 ? priceHistory[priceHistory.length - 2].price : initialPrice;

  const tags: ListingTag[] = [];

  if (currentPrice < baselinePrice) {
    const discountAmount = baselinePrice - currentPrice;
    const discountPercentage = Math.round((discountAmount / baselinePrice) * 100);
    tags.push('good_deal');

    return {
      tags,
      discountAmount,
      discountPercentage,
      isLowered: true,
      isRaised: false,
    };
  }

  if (currentPrice > baselinePrice) {
    tags.push('hot');

    return {
      tags,
      isLowered: false,
      isRaised: true,
    };
  }

  return {
    tags: [],
    isLowered: false,
    isRaised: false,
  };
}
