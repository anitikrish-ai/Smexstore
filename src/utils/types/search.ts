/**
 * Universal Search Models (FR-030 to FR-033, API-011)
 */

import { Tournament } from './tournament';
import { TeamGroup } from './team';
import { Listing } from './listing';

export type SearchCategory = 'all' | 'tournaments' | 'teams' | 'marketplace';
export type SearchSortOption = 'relevance' | 'newest' | 'name';

export interface SearchQuery {
  q: string;
  category?: SearchCategory;
  sort?: SearchSortOption;
}

export interface CrossEntitySearchResults {
  tournaments: Tournament[];
  teams: TeamGroup[];
  listings: Listing[];
}
