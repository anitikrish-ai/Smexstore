import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { PageLayout } from '../components/layout/PageLayout';
import { TournamentCard } from '../components/tournaments/TournamentCard';
import { TeamCard } from '../components/teams/TeamCard';
import { ListingCard } from '../components/marketplace/ListingCard';
import { EmptyState } from '../components/common/EmptyState';
import { LoadingSkeleton } from '../components/common/LoadingSkeleton';
import { Tabs, TabItem } from '../components/common/Tabs';
import { useSearch } from '../hooks/useSearch';
import { SearchCategory, SearchSortOption } from '../types/search';

/**
 * Universal Search Page (FR-030 to FR-033, API-011)
 * Cross-entity search spanning tournaments, team rosters, and verified marketplace listings.
 */
const SEARCH_TABS: ReadonlyArray<TabItem<SearchCategory>> = [
  { id: 'all', label: 'All' },
  { id: 'tournaments', label: 'Tournaments' },
  { id: 'teams', label: 'Teams' },
  { id: 'marketplace', label: 'Marketplace' },
];

export const UniversalSearchPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || '';

  const [query, setQuery] = useState(initialQuery);
  const [category, setCategory] = useState<SearchCategory>('all');
  const [sort, setSort] = useState<SearchSortOption>('relevance');

  useEffect(() => {
    const qParam = searchParams.get('q');
    if (qParam !== null && qParam !== query) {
      setQuery(qParam);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  const { results, isLoading, error } = useSearch({
    q: query,
    category,
    sort,
  });

  const handleQueryChange = (val: string) => {
    setQuery(val);
    setSearchParams(val ? { q: val } : {}, { replace: true });
  };

  const totalResults =
    results.tournaments.length + results.teams.length + results.listings.length;

  return (
    <PageLayout title="Search">
      {/* Search Input Bar */}
      <div
        className="card"
        style={{ padding: 'var(--space-md)', marginBottom: 'var(--space-lg)' }}
      >
        <form
          role="search"
          onSubmit={(e) => e.preventDefault()}
          style={{ marginBottom: 'var(--space-md)' }}
        >
          <label htmlFor="universal-search-input" className="visually-hidden">
            Search tournaments, teams and marketplace listings
          </label>
          <input
            id="universal-search-input"
            type="search"
            placeholder="Search tournaments, teams or game IDs"
            autoComplete="off"
            maxLength={100}
            value={query}
            onChange={(e) => handleQueryChange(e.target.value)}
            style={{
              fontSize: '1rem',
              padding: '10px 14px',
            }}
          />
        </form>

        {/* Filters and Sorting Controls (FR-031, FR-032) */}
        <div
          className="flex justify-between items-center"
          style={{ flexWrap: 'wrap', gap: 'var(--space-sm)' }}
        >
          <div style={{ flex: '1 1 280px', minWidth: 0 }}>
            <Tabs<SearchCategory>
              idPrefix="search"
              ariaLabel="Search categories"
              value={category}
              onChange={setCategory}
              tabs={SEARCH_TABS}
            />
          </div>

          {/* Sort */}
          <div className="flex items-center gap-xs">
            <label htmlFor="search-sort" style={{ margin: 0, fontSize: '0.85rem' }}>
              Sort:
            </label>
            <select
              id="search-sort"
              value={sort}
              onChange={(e) => setSort(e.target.value as SearchSortOption)}
              style={{ width: 'auto', padding: '4px 8px', fontSize: '0.85rem' }}
            >
              <option value="relevance">Relevance</option>
              <option value="newest">Newest First</option>
              <option value="name">Alphabetical</option>
            </select>
          </div>
        </div>
      </div>

      <div id="search-panel" role="tabpanel" aria-labelledby={`search-tab-${category}`}>
        {isLoading ? (
          <div className="grid grid-cols-1 grid-cols-3-lg gap-md">
            {[1, 2, 3].map((i) => (
              <LoadingSkeleton key={i} height="240px" borderRadius="var(--radius-md)" />
            ))}
          </div>
        ) : error ? (
          <EmptyState title="Search Failed" description={error} />
        ) : !query.trim() ? (
          <EmptyState
            title="Begin Your Search"
            description="Type a keyword above to find matches across tournaments, teams, and listings."
          />
        ) : totalResults === 0 ? (
          <EmptyState
            title="No Results Found"
            description={`No items matched your search query "${query}". Try different keywords or broaden category filters.`}
          />
        ) : (
          <div className="flex flex-col gap-xl">
            {/* Tournaments Results */}
            {(category === 'all' || category === 'tournaments') &&
              results.tournaments.length > 0 && (
                <section>
                  <h2 style={{ fontSize: '1.25rem', marginBottom: 'var(--space-md)' }}>
                    Tournaments ({results.tournaments.length})
                  </h2>
                  <div className="grid grid-cols-1 grid-cols-2-sm grid-cols-3-lg gap-md">
                    {results.tournaments.map((t) => (
                      <TournamentCard key={t.id} tournament={t} />
                    ))}
                  </div>
                </section>
              )}

            {/* Teams Results */}
            {(category === 'all' || category === 'teams') && results.teams.length > 0 && (
              <section>
                <h2 style={{ fontSize: '1.25rem', marginBottom: 'var(--space-md)' }}>
                  Teams & Rosters ({results.teams.length})
                </h2>
                <div className="grid grid-cols-1 grid-cols-2-sm grid-cols-3-lg gap-md">
                  {results.teams.map((team) => (
                    <TeamCard
                      key={team.id}
                      team={team}
                      onJoin={async () => {
                        navigate(`/teams/${team.id}`);
                      }}
                    />
                  ))}
                </div>
              </section>
            )}

            {/* Marketplace Results */}
            {(category === 'all' || category === 'marketplace') &&
              results.listings.length > 0 && (
                <section>
                  <h2 style={{ fontSize: '1.25rem', marginBottom: 'var(--space-md)' }}>
                    Marketplace Game IDs ({results.listings.length})
                  </h2>
                  <div className="grid grid-cols-1 grid-cols-2-sm grid-cols-3-lg gap-md">
                    {results.listings.map((l) => (
                      <ListingCard key={l.id} listing={l} />
                    ))}
                  </div>
                </section>
              )}
          </div>
        )}
      </div>
    </PageLayout>
  );
};
