import { useState, useEffect, useCallback } from 'react';
import { SearchQuery, CrossEntitySearchResults } from '../types/search';
import { searchApi } from '../api/search';

export function useSearch(query: SearchQuery) {
  const [results, setResults] = useState<CrossEntitySearchResults>({
    tournaments: [],
    teams: [],
    listings: [],
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const executeSearch = useCallback(async () => {
    if (!query.q || query.q.trim().length === 0) {
      setResults({ tournaments: [], teams: [], listings: [] });
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const response = await searchApi.search(query);
      setResults({
        tournaments: response.tournaments || [],
        teams: response.teams || [],
        listings: response.listings || [],
      });
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Search failed.');
      setResults({ tournaments: [], teams: [], listings: [] });
    } finally {
      setIsLoading(false);
    }
  }, [query.q, query.category, query.sort]);

  useEffect(() => {
    // 300ms debounce
    const timer = setTimeout(() => {
      executeSearch();
    }, 300);

    return () => clearTimeout(timer);
  }, [executeSearch]);

  return { results, isLoading, error, refetch: executeSearch };
}
