import React, { useState } from 'react';
import { PageLayout } from '../components/layout/PageLayout';
import { TournamentCard } from '../components/tournaments/TournamentCard';
import { EmptyState } from '../components/common/EmptyState';
import { LoadingSkeleton } from '../components/common/LoadingSkeleton';
import { Tabs, TabItem } from '../components/common/Tabs';
import { useTournaments } from '../hooks/useTournaments';
import { TournamentStatus } from '../types/tournament';

/**
 * Tournaments Page (FR-010 to FR-012)
 * Categorized by Past, Current/Ongoing, and Future statuses.
 */
type TournamentTab = TournamentStatus | 'all';

const TOURNAMENT_TABS: ReadonlyArray<TabItem<TournamentTab>> = [
  { id: 'all', label: 'All Tournaments' },
  { id: 'current', label: 'Ongoing and Current' },
  { id: 'future', label: 'Upcoming' },
  { id: 'past', label: 'Past Tournaments' },
];

export const TournamentsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TournamentTab>('all');
  const [searchGame, setSearchGame] = useState('');

  const filterStatus = activeTab === 'all' ? undefined : activeTab;
  const { tournaments, isLoading, error, refetch } = useTournaments({
    status: filterStatus,
    game: searchGame.trim() || undefined,
  });

  return (
    <PageLayout
      title="Tournaments and Brackets"
      action={
        <div className="flex gap-xs">
          <input
            type="search"
            placeholder="Filter by game title"
            aria-label="Filter tournaments by game title"
            maxLength={80}
            value={searchGame}
            onChange={(e) => setSearchGame(e.target.value)}
          />
        </div>
      }
    >
      <Tabs<TournamentTab>
        idPrefix="tournaments"
        ariaLabel="Filter tournaments by status"
        value={activeTab}
        onChange={setActiveTab}
        tabs={TOURNAMENT_TABS}
      />

      <div
        id="tournaments-panel"
        role="tabpanel"
        aria-labelledby={`tournaments-tab-${activeTab}`}
      >
        {isLoading ? (
          <div className="grid grid-cols-1 grid-cols-2-sm grid-cols-3-lg gap-md">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <LoadingSkeleton key={i} height="260px" borderRadius="var(--radius-md)" />
            ))}
          </div>
        ) : error ? (
          <EmptyState
            title="Could Not Load Tournaments"
            description={error}
            actionText="Retry"
            onAction={refetch}
          />
        ) : tournaments.length === 0 ? (
          <EmptyState
            title="No Tournaments Found"
            description={`There are currently no tournaments matching the "${activeTab}" filter.`}
          />
        ) : (
          <div className="grid grid-cols-1 grid-cols-2-sm grid-cols-3-lg gap-md">
            {tournaments.map((tournament) => (
              <TournamentCard key={tournament.id} tournament={tournament} />
            ))}
          </div>
        )}
      </div>
    </PageLayout>
  );
};
