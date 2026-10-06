import React from 'react';
import { Link } from 'react-router-dom';
import { PageLayout } from '../components/layout/PageLayout';

/** Custom 404 page. Index exclusion is handled by the route metadata (noindex). */
export const NotFoundPage: React.FC = () => {
  return (
    <PageLayout>
      <div
        className="card card-accent flex flex-col items-center justify-center text-center"
        style={{
          maxWidth: '600px',
          margin: 'var(--space-xl) auto',
          padding: 'var(--space-2xl) var(--space-lg)',
        }}
      >
        <p
          className="tabular-nums"
          aria-hidden="true"
          style={{
            fontSize: 'clamp(3.5rem, 18vw, 5.5rem)',
            fontWeight: 800,
            lineHeight: 1,
            letterSpacing: '-0.04em',
            color: 'var(--color-accent-fg)',
            marginBottom: 'var(--space-sm)',
          }}
        >
          404
        </p>

        <h1 style={{ fontSize: '1.5rem', marginBottom: 'var(--space-xs)' }}>
          Page not found
        </h1>

        <p
          className="text-muted"
          style={{ maxWidth: '420px', marginBottom: 'var(--space-lg)' }}
        >
          This page does not exist or may have moved. Head back home or pick a section
          below.
        </p>

        <div className="flex flex-wrap justify-center gap-sm">
          <Link to="/" className="btn btn-primary btn-lg">
            Return home
          </Link>
          <Link to="/tournaments" className="btn btn-outline btn-lg">
            Browse tournaments
          </Link>
        </div>

        <nav
          aria-label="Other sections"
          className="flex flex-wrap justify-center gap-md"
          style={{ marginTop: 'var(--space-lg)', fontSize: '0.9rem' }}
        >
          <Link to="/teams">Teams</Link>
          <Link to="/marketplace">Marketplace</Link>
          <Link to="/rank-boosting">Rank Boosting</Link>
          <Link to="/leaderboard">Leaderboard</Link>
        </nav>
      </div>
    </PageLayout>
  );
};
