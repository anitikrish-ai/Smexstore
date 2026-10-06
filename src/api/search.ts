/**
 * Universal Search API (API-011, FR-030 to FR-033)
 */

import { apiClient } from './client';
import { SearchQuery, CrossEntitySearchResults } from '../types/search';

export const searchApi = {
  search: (query: SearchQuery) =>
    apiClient<CrossEntitySearchResults>('/search', {
      params: {
        q: query.q,
        category: query.category,
        sort: query.sort,
      },
    }),
};
