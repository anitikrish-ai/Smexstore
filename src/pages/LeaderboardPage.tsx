import React from 'react';
import { Link } from 'react-router-dom';
import { PageLayout } from '../components/layout/PageLayout';
import { EmptyState } from '../components/common/EmptyState';
import { LoadingSkeleton } from '../components/common/LoadingSkeleton';
import { useLeaderboard } from '../hooks/useLeaderboard';
import { useCountUp } from '../hooks/useCountUp';

// Numeric count-up metric display component
const TabularScore: React.FC<{ score: number }> = ({ score }) => {
  const displayScore = useCountUp({ end: score });
  return <span className="tabular-nums">{displayScore}</span>;
};

/**
 * Community Leaderboard (FR-060, FR-061, ANIM-105)
 * Displays top-rated tournaments and hot teams with count-up numeric animations.
 */
export const LeaderboardPage: React.FC = () => {
  const { data, isLoading, error, refetch } = useLeaderboard();

  return (
    <PageLayout title="Community Leaderboard">
      <p
        className="text-muted"
        style={{ maxWidth: '640px', marginBottom: 'var(--space-xl)' }}
      >
        Real-time community rankings for top-rated competitive tournaments and active
        high-scoring squad rosters.
      </p>

      {isLoading ? (
        <div className="grid grid-cols-1 grid-cols-2-sm gap-lg">
          <LoadingSkeleton height="360px" borderRadius="var(--radius-md)" />
          <LoadingSkeleton height="360px" borderRadius="var(--radius-md)" />
        </div>
      ) : error ? (
        <EmptyState
          title="Could Not Load Leaderboard"
          description={error}
          actionText="Retry"
          onAction={refetch}
        />
      ) : (
        <div className="grid grid-cols-1 grid-cols-2-sm gap-lg">
          {/* FR-060: Top-Rated Tournaments */}
          <div className="card">
            <h2 style={{ fontSize: '1.25rem', marginBottom: 'var(--space-md)' }}>
              Top-Rated Tournaments
            </h2>

            {data.topTournaments.length === 0 ? (
              <p className="text-muted" style={{ fontSize: '0.9rem' }}>
                No tournament ratings recorded yet.
              </p>
            ) : (
              <div className="flex flex-col gap-sm">
                {data.topTournaments.map((t, idx) => (
                  <div
                    key={t.id}
                    className="flex justify-between items-center"
                    style={{
                      padding: 'var(--space-sm)',
                      backgroundColor: 'var(--color-surface-alt)',
                      borderRadius: 'var(--radius-sm)',
                      border: 'var(--border-width) solid var(--color-border)',
                    }}
                  >
                    <div className="flex items-center gap-sm">
                      <span
                        className="tabular-nums"
                        style={{
                          fontWeight: 800,
                          fontSize: '1.1rem',
                          color:
                            idx === 0 ? 'var(--color-accent)' : 'var(--color-text-muted)',
                          width: '24px',
                        }}
                      >
                        #{idx + 1}
                      </span>
                      <div>
                        <Link
                          to={`/tournaments/${t.id}`}
                          style={{ fontWeight: 600, color: 'var(--color-text)' }}
                        >
                          {t.name}
                        </Link>
                        <div className="text-muted" style={{ fontSize: '0.8rem' }}>
                          {t.gameTitle}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-xs">
                      <span className="tabular-nums" style={{ fontWeight: 700 }}>
                        ★ {t.rating.toFixed(1)}
                      </span>
                      <span className="text-muted" style={{ fontSize: '0.75rem' }}>
                        ({t.ratingCount})
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* FR-061: Hot Teams / Groups */}
          <div className="card">
            <h2 style={{ fontSize: '1.25rem', marginBottom: 'var(--space-md)' }}>
              Hot Teams & Squads
            </h2>

            {data.hotTeams.length === 0 ? (
              <p className="text-muted" style={{ fontSize: '0.9rem' }}>
                No active squads listed yet.
              </p>
            ) : (
              <div className="flex flex-col gap-sm">
                {data.hotTeams.map((team, idx) => (
                  <div
                    key={team.id}
                    className="flex justify-between items-center"
                    style={{
                      padding: 'var(--space-sm)',
                      backgroundColor: 'var(--color-surface-alt)',
                      borderRadius: 'var(--radius-sm)',
                      border: 'var(--border-width) solid var(--color-border)',
                    }}
                  >
                    <div className="flex items-center gap-sm">
                      <span
                        className="tabular-nums"
                        style={{
                          fontWeight: 800,
                          fontSize: '1.1rem',
                          color:
                            idx === 0 ? 'var(--color-accent)' : 'var(--color-text-muted)',
                          width: '24px',
                        }}
                      >
                        #{idx + 1}
                      </span>
                      <div>
                        <Link
                          to={`/teams/${team.id}`}
                          style={{ fontWeight: 600, color: 'var(--color-text)' }}
                        >
                          {team.name}
                        </Link>
                        <div className="text-muted" style={{ fontSize: '0.8rem' }}>
                          Roster: {team.memberCount} / {team.maxSlots} players
                        </div>
                      </div>
                    </div>

                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontWeight: 800, fontSize: '1rem' }}>
                        <TabularScore score={team.score} /> pts
                      </div>
                      <span className="badge" style={{ fontSize: '0.65rem' }}>
                        {team.availability.toUpperCase()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </PageLayout>
  );
};
