/**
 * Game ID Marketplace Listing Data Model (DATA-005, FR-040 to FR-045)
 */

export type ListingStatus = 'active' | 'sold' | 'deleted';
export type ListingTag = 'good_deal' | 'hot';

export interface SellerRef {
  id: string;
  username: string;
  inGameUsername: string;
  ratingAverage: number;
  ratingCount: number;
}

export interface PriceHistoryPoint {
  price: number;
  timestamp: string;
}

export interface Listing {
  id: string;
  sellerRef: SellerRef;
  gameTitle: string;
  gameIdDetails: string;
  screenshots: string[];
  contact?: string; // Deliberately hidden until detail click (SEC-007)
  initialPrice: number;
  currentPrice: number;
  priceHistory: PriceHistoryPoint[];
  status: ListingStatus;
  tags: ListingTag[];
  discountAmount?: number;
  discountPercentage?: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateListingPayload {
  gameTitle: string;
  gameIdDetails: string;
  price: number;
  contact: string;
  screenshots: string[];
}

export interface UpdatePricePayload {
  newPrice: number;
}

export interface ListingFilters {
  status?: ListingStatus;
  tag?: ListingTag;
  sort?: 'price_asc' | 'price_desc' | 'newest';
  search?: string;
  gameTitle?: string;
}
