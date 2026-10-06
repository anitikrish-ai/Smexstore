import React from 'react';
import { Link } from 'react-router-dom';
import { Tournament } from '../../types/tournament';
import { Badge } from '../common/Badge';
import { formatDate } from '../../utils/formatters';

interface TournamentCardProps {
  tournament: Tournament;
}

/**
 * Tournament Card (FR-004, FR-012)
 * Features motion-card-lift, full details, date, rating, and status badge.
 */
export const TournamentCard: React.FC<TournamentCardProps> = ({ tournament }) => {
  return (
    <article
      className="card motion-card-lift flex flex-col justify-between"
      style={{ height: '100%' }}
    >
      <div>
        <div
          className="flex justify-between items-center"
          style={{ marginBottom: 'var(--space-xs)' }}
        >
          <span
            style={{
              fontSize: '0.8rem',
              fontWeight: 700,
              color: 'var(--color-accent)',
              textTransform: 'uppercase',
              letterSpacing: '0.04em',
            }}
          >
            {tournament.gameTitle}
          </span>
          <Badge variant={tournament.status}>{tournament.status}</Badge>
        </div>

        <h3 style={{ marginBottom: 'var(--space-xs)' }}>
          <Link
            to={`/tournaments/${tournament.id}`}
            style={{ color: 'var(--color-text)', textDecoration: 'none' }}
          >
            {tournament.name}
          </Link>
        </h3>

        <p
          className="text-muted"
          style={{ fontSize: '0.9rem', marginBottom: 'var(--space-md)' }}
        >
          {tournament.description}
        </p>
      </div>

      <div
        style={{
          borderTop: 'var(--border-width) solid var(--color-border)',
          paddingTop: 'var(--space-sm)',
          marginTop: 'var(--space-sm)',
          fontSize: '0.82rem',
        }}
      >
        <div
          className="flex justify-between items-center"
          style={{ marginBottom: 'var(--space-xs)' }}
        >
          <span className="text-muted">Start Date:</span>
          <span className="tabular-nums" style={{ fontWeight: 600 }}>
            {formatDate(tournament.startDate)}
          </span>
        </div>

        {tournament.prizePool && (
          <div
            className="flex justify-between items-center"
            style={{ marginBottom: 'var(--space-xs)' }}
          >
            <span className="text-muted">Prize Pool:</span>
            <span style={{ fontWeight: 700, color: 'var(--color-text)' }}>
              {tournament.prizePool}
            </span>
          </div>
        )}

        <div
          className="flex justify-between items-center"
          style={{ marginTop: 'var(--space-xs)' }}
        >
          <div className="flex items-center gap-xs">
            <span className="text-muted">Rating:</span>
            <span className="tabular-nums" style={{ fontWeight: 700 }}>
              ★ {tournament.rating.toFixed(1)}
            </span>
            <span className="text-muted" style={{ fontSize: '0.75rem' }}>
              ({tournament.ratingCount})
            </span>
          </div>

          <Link
            to={`/tournaments/${tournament.id}`}
            className="btn btn-secondary motion-press"
            style={{ padding: '3px 10px', fontSize: '0.8rem' }}
          >
            Details
          </Link>
        </div>
      </div>
    </article>
  );
};
