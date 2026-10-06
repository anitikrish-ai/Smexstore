import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { PageLayout } from '../components/layout/PageLayout';
import { ListingCard } from '../components/marketplace/ListingCard';
import { EmptyState } from '../components/common/EmptyState';
import { LoadingSkeleton } from '../components/common/LoadingSkeleton';
import { Tabs, TabItem } from '../components/common/Tabs';
import { useMarketplace } from '../hooks/useMarketplace';
import { useAuth } from '../hooks/useAuth';
import { ListingTag } from '../types/listing';

/**
 * Game ID Marketplace Hub (FR-040 to FR-045, UI-015)
 * Filterable by deal tags, status, price sorting, and game search.
 * Filter state is persisted in the URL so back/forward/refresh restores filters.
 */
type MarketTab = ListingTag | 'all';
type SortOption = 'newest' | 'price_asc' | 'price_desc';

const VALID_TAGS: MarketTab[] = ['all', 'good_deal', 'hot'];
const VALID_SORTS: SortOption[] = ['newest', 'price_asc', 'price_desc'];

const MARKET_TABS: ReadonlyArray<TabItem<MarketTab>> = [
  { id: 'all', label: 'All Listings' },
  { id: 'good_deal', label: 'Good Deals (Discounted)' },
  { id: 'hot', label: 'Hot (Price Bumped)' },
];

export const MarketplacePage: React.FC = () => {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const rawTag = searchParams.get('tag') as MarketTab | null;
  const rawSort = searchParams.get('sort') as SortOption | null;
  const rawSearch = searchParams.get('q') || '';

  const selectedTag: MarketTab = rawTag && VALID_TAGS.includes(rawTag) ? rawTag : 'all';
  const sortBy: SortOption = rawSort && VALID_SORTS.includes(rawSort) ? rawSort : 'newest';
  const [search, setSearch] = useState(rawSearch);

  // Keep local search in sync when URL changes (e.g. back-nav)
  useEffect(() => {
    setSearch(searchParams.get('q') || '');
  }, [searchParams]);

  const updateParams = (updates: Record<string, string | undefined>) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      Object.entries(updates).forEach(([k, v]) => {
        if (v && (k !== 'tag' || v !== 'all') && (k !== 'sort' || v !== 'newest')) {
          next.set(k, v);
        } else {
          next.delete(k);
        }
      });
      return next;
    }, { replace: true });
  };

  const setSelectedTag = (tag: MarketTab) => updateParams({ tag });
  const setSortBy = (sort: SortOption) => updateParams({ sort });
  const handleSearchChange = (val: string) => {
    setSearch(val);
    updateParams({ q: val || undefined });
  };

  const { listings, isLoading, error, refetch } = useMarketplace({
    tag: selectedTag === 'all' ? undefined : selectedTag,
    sort: sortBy,
    search: search.trim() || undefined,
  });

  return (
    <PageLayout
      title="Game ID Marketplace"
      action={
        <Link to="/marketplace/new" className="btn btn-primary motion-press">
          List a Game ID
        </Link>
      }
    >
      <div
        className="flex flex-wrap items-center justify-between gap-md"
        style={{ marginBottom: 'var(--space-md)' }}
      >
        <div style={{ flex: '1 1 320px', minWidth: 0 }}>
          <Tabs<MarketTab>
            idPrefix="market"
            ariaLabel="Filter listings by deal tag"
            value={selectedTag}
            onChange={setSelectedTag}
            tabs={MARKET_TABS}
          />
        </div>

        <div
          className="flex flex-wrap gap-sm items-center"
          style={{
            marginBottom: 'var(--space-lg)',
            flex: '1 1 280px',
            justifyContent: 'flex-end',
          }}
        >
          <select
            value={sortBy}
            onChange={(e) =>
              setSortBy(e.target.value as SortOption)
            }
            style={{ fontSize: '0.85rem', width: 'auto', flex: '1 1 150px' }}
            aria-label="Sort listings"
          >
            <option value="newest">Newest First</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
          </select>

          <input
            type="search"
            placeholder="Search game or ID info"
            aria-label="Search listings"
            maxLength={80}
            value={search}
            onChange={(e) => handleSearchChange(e.target.value)}
            style={{ fontSize: '0.85rem', flex: '2 1 180px', width: 'auto' }}
          />
        </div>
      </div>

      <div
        id="market-panel"
        role="tabpanel"
        aria-labelledby={`market-tab-${selectedTag}`}
      >
        {isLoading ? (
          <div className="grid grid-cols-1 grid-cols-2-sm grid-cols-3-lg gap-md">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <LoadingSkeleton key={i} height="320px" borderRadius="var(--radius-md)" />
            ))}
          </div>
        ) : error ? (
          <EmptyState
            title="Could Not Load Marketplace"
            description={error}
            actionText="Retry"
            onAction={refetch}
          />
        ) : listings.length === 0 ? (
          <EmptyState
            title="No Game IDs Listed"
            description={
              selectedTag !== 'all'
                ? `No listings currently match the ${selectedTag.replace('_', ' ')} filter.`
                : 'There are currently no game IDs listed in the marketplace.'
            }
            actionText={isAuthenticated ? 'Create a Listing' : 'Login to List ID'}
            onAction={() => {
              navigate(isAuthenticated ? '/marketplace/new' : '/login');
            }}
          />
        ) : (
          <div className="grid grid-cols-1 grid-cols-2-sm grid-cols-3-lg gap-md">
            {listings.map((listing) => (
              <ListingCard
                key={listing.id}
                listing={listing}
                isOwner={listing.sellerRef.id === user?.id}
              />
            ))}
          </div>
        )}
      </div>
    </PageLayout>
  );
};
