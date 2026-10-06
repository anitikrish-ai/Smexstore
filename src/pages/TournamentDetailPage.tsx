import React from 'react';
import { useParams } from 'react-router-dom';
import { PageLayout } from '../components/layout/PageLayout';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { Badge } from '../components/common/Badge';
import { LoadingSkeleton } from '../components/common/LoadingSkeleton';
import { EmptyState } from '../components/common/EmptyState';
import { useTournamentDetail } from '../hooks/useTournaments';
import { formatDate } from '../utils/formatters';

/**
 * Tournament Detail Page (FR-012)
 * Full details, rules, prize pool, date range, rating, and participants.
 */
export const TournamentDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { tournament, isLoading, error } = useTournamentDetail(id || '');

  if (isLoading) {
    return (
      <PageLayout>
        <LoadingSkeleton
          height="40px"
          width="50%"
          style={{ marginBottom: 'var(--space-md)' }}
        />
        <LoadingSkeleton height="200px" style={{ marginBottom: 'var(--space-md)' }} />
        <LoadingSkeleton height="300px" />
      </PageLayout>
    );
  }

  if (error || !tournament) {
    return (
      <PageLayout>
        <EmptyState
          title="Tournament Not Found"
          description={error || 'The requested tournament does not exist.'}
          actionText="Back to Tournaments"
          onAction={() => window.history.back()}
        />
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <Breadcrumbs
        items={[
          { label: 'Home', to: '/' },
          { label: 'Tournaments', to: '/tournaments' },
          { label: tournament.name },
        ]}
      />

      <div
        className="card"
        style={{
          padding: 'var(--space-xl)',
          marginBottom: 'var(--space-lg)',
        }}
      >
        <div
          className="flex justify-between items-center"
          style={{
            marginBottom: 'var(--space-sm)',
            flexWrap: 'wrap',
            gap: 'var(--space-xs)',
          }}
        >
          <span
            style={{
              fontSize: '0.9rem',
              fontWeight: 700,
              color: 'var(--color-accent)',
              textTransform: 'uppercase',
              letterSpacing: '0.04em',
            }}
          >
            {tournament.gameTitle}
          </span>
          <Badge variant={tournament.status}>{tournament.status.toUpperCase()}</Badge>
        </div>

        <h1 style={{ marginBottom: 'var(--space-sm)' }}>{tournament.name}</h1>

        <p
          className="text-muted"
          style={{
            fontSize: '1.05rem',
            lineHeight: 1.6,
            marginBottom: 'var(--space-lg)',
            maxWidth: '800px',
          }}
        >
          {tournament.description}
        </p>

        {/* Metadata Grid */}
        <div
          className="grid grid-cols-1 grid-cols-3-lg gap-md"
          style={{
            padding: 'var(--space-md)',
            backgroundColor: 'var(--color-surface-alt)',
            borderRadius: 'var(--radius-sm)',
            border: 'var(--border-width) solid var(--color-border)',
            marginBottom: 'var(--space-xl)',
          }}
        >
          <div>
            <span className="text-muted" style={{ fontSize: '0.8rem' }}>
              Schedule
            </span>
            <div className="tabular-nums" style={{ fontWeight: 700 }}>
              {formatDate(tournament.startDate)}
              {tournament.endDate && ` - ${formatDate(tournament.endDate)}`}
            </div>
          </div>

          <div>
            <span className="text-muted" style={{ fontSize: '0.8rem' }}>
              Prize Pool
            </span>
            <div style={{ fontWeight: 800, color: 'var(--color-text)' }}>
              {tournament.prizePool || 'Glory & Recognition'}
            </div>
          </div>

          <div>
            <span className="text-muted" style={{ fontSize: '0.8rem' }}>
              Community Rating
            </span>
            <div className="tabular-nums" style={{ fontWeight: 700 }}>
              ★ {tournament.rating.toFixed(1)} / 5.0 ({tournament.ratingCount} reviews)
            </div>
          </div>
        </div>

        {/* Full Details Section (FR-012) */}
        <div style={{ marginBottom: 'var(--space-xl)' }}>
          <h2 style={{ fontSize: '1.3rem', marginBottom: 'var(--space-sm)' }}>
            Tournament Specifications
          </h2>
          <div
            style={{
              lineHeight: 1.7,
              color: 'var(--color-text)',
              whiteSpace: 'pre-wrap',
            }}
          >
            {tournament.fullDetails ||
              'Full bracket and matchup details will be announced prior to match commencement.'}
          </div>
        </div>

        {/* Official Rules */}
        {tournament.rules && (
          <div
            style={{
              padding: 'var(--space-md)',
              borderTop: 'var(--border-width) solid var(--color-border)',
            }}
          >
            <h3 style={{ fontSize: '1.1rem', marginBottom: 'var(--space-xs)' }}>
              Rules & Guidelines
            </h3>
            <p
              className="text-muted"
              style={{ fontSize: '0.9rem', whiteSpace: 'pre-wrap' }}
            >
              {tournament.rules}
            </p>
          </div>
        )}
      </div>
    </PageLayout>
  );
};
