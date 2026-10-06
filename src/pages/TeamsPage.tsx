import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageLayout } from '../components/layout/PageLayout';
import { TeamCard } from '../components/teams/TeamCard';
import { CreateTeamModal } from '../components/teams/CreateTeamModal';
import { EmptyState } from '../components/common/EmptyState';
import { LoadingSkeleton } from '../components/common/LoadingSkeleton';
import { ErrorMessage } from '../components/common/ErrorMessage';
import { Tabs, TabItem } from '../components/common/Tabs';
import { useTeams } from '../hooks/useTeams';
import { useAuth } from '../hooks/useAuth';
import { TeamAvailability } from '../types/team';

/**
 * Teams & Groups Hub (FR-020 to FR-023)
 * Displays rosters, member counts, availability status, and squad formation.
 */
type TeamTab = TeamAvailability | 'all';

const TEAM_TABS: ReadonlyArray<TabItem<TeamTab>> = [
  { id: 'all', label: 'All Rosters' },
  { id: 'open', label: 'Open Slots Only' },
  { id: 'closed', label: 'Full Rosters' },
];

export const TeamsPage: React.FC = () => {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const [formNotice, setFormNotice] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filterAvailability, setFilterAvailability] = useState<TeamTab>('all');
  const [search, setSearch] = useState('');

  const { teams, isLoading, error, refetch, createTeam, joinTeam } = useTeams({
    availability: filterAvailability === 'all' ? undefined : filterAvailability,
    search: search.trim() || undefined,
  });

  const handleOpenCreate = () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    // TBD-04: Warn if email is unverified
    if (user && !user.emailVerified) {
      setFormNotice('Verify your email address before forming a new team.');
      return;
    }
    setFormNotice(null);
    setIsModalOpen(true);
  };

  return (
    <PageLayout
      title="Teams and Groups"
      action={
        <button
          type="button"
          onClick={handleOpenCreate}
          className="btn btn-primary motion-press"
        >
          + Form New Team
        </button>
      }
    >
      {formNotice && (
        <ErrorMessage message={formNotice} onDismiss={() => setFormNotice(null)} />
      )}

      <div
        className="flex flex-wrap items-center justify-between gap-md"
        style={{ marginBottom: 'var(--space-md)' }}
      >
        <div style={{ flex: '1 1 260px', minWidth: 0 }}>
          <Tabs<TeamTab>
            idPrefix="teams"
            ariaLabel="Filter teams by roster availability"
            value={filterAvailability}
            onChange={setFilterAvailability}
            tabs={TEAM_TABS}
          />
        </div>

        <div className="page-header-action" style={{ marginBottom: 'var(--space-lg)' }}>
          <input
            type="search"
            placeholder="Filter by team name"
            aria-label="Filter teams by name"
            maxLength={80}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div
        id="teams-panel"
        role="tabpanel"
        aria-labelledby={`teams-tab-${filterAvailability}`}
      >
        {isLoading ? (
          <div className="grid grid-cols-1 grid-cols-2-sm grid-cols-3-lg gap-md">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <LoadingSkeleton key={i} height="280px" borderRadius="var(--radius-md)" />
            ))}
          </div>
        ) : error ? (
          <EmptyState
            title="Could Not Load Teams"
            description={error}
            actionText="Retry"
            onAction={refetch}
          />
        ) : teams.length === 0 ? (
          <EmptyState
            title="No Teams Listed"
            description="Be the first to create a team or group for competitive matchmaking."
            actionText="Create Team"
            onAction={handleOpenCreate}
          />
        ) : (
          <div className="grid grid-cols-1 grid-cols-2-sm grid-cols-3-lg gap-md">
            {teams.map((team) => (
              <TeamCard
                key={team.id}
                team={team}
                onJoin={async (teamId, message) => {
                  await joinTeam(teamId, message);
                }}
              />
            ))}
          </div>
        )}

        {/* Creation Modal */}
        <CreateTeamModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onCreate={async (payload) => {
            await createTeam(payload);
          }}
        />
      </div>
    </PageLayout>
  );
};
