import React from 'react';
import { RankPackage } from '../../types/rankPackage';
import { Badge } from '../common/Badge';
import { formatCurrency } from '../../utils/formatters';

interface RankPackageCardProps {
  pkg: RankPackage;
  onBook: (pkg: RankPackage) => void;
}

/**
 * Rank Boosting Package Card (FR-050a to FR-050c)
 * Shows current to target rank, provider info, and booking button.
 */
export const RankPackageCard: React.FC<RankPackageCardProps> = ({ pkg, onBook }) => {
  const isAvailable = pkg.availability === 'available';

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
            }}
          >
            {pkg.gameTitle}
          </span>
          <Badge variant={isAvailable ? 'open' : 'closed'}>
            {isAvailable ? 'AVAILABLE' : 'UNAVAILABLE'}
          </Badge>
        </div>

        <h3 style={{ marginBottom: 'var(--space-xs)' }}>{pkg.title}</h3>

        <div
          style={{
            padding: 'var(--space-sm)',
            backgroundColor: 'var(--color-surface-alt)',
            borderRadius: 'var(--radius-sm)',
            marginBottom: 'var(--space-md)',
            border: 'var(--border-width) solid var(--color-border)',
          }}
        >
          <div
            className="flex justify-between items-center"
            style={{ fontSize: '0.85rem' }}
          >
            <span className="text-muted">Target:</span>
            <span style={{ fontWeight: 700 }}>
              {pkg.currentRankTier} &rarr; {pkg.targetRankTier}
            </span>
          </div>
          <div
            className="flex justify-between items-center"
            style={{ fontSize: '0.85rem', marginTop: '4px' }}
          >
            <span className="text-muted">Est. Duration:</span>
            <span className="tabular-nums">{pkg.estimatedDuration}</span>
          </div>
        </div>

        <p
          className="text-muted"
          style={{ fontSize: '0.85rem', marginBottom: 'var(--space-md)' }}
        >
          {pkg.description}
        </p>
      </div>

      <div
        style={{
          borderTop: 'var(--border-width) solid var(--color-border)',
          paddingTop: 'var(--space-sm)',
        }}
      >
        <div
          className="flex justify-between items-center"
          style={{ marginBottom: 'var(--space-sm)' }}
        >
          <div>
            <div className="text-muted" style={{ fontSize: '0.75rem' }}>
              Provider:
            </div>
            <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>
              {pkg.providerDetails.providerName}
              {pkg.providerDetails.verified && ' (Verified)'}
            </div>
          </div>
          <div className="tabular-nums" style={{ fontSize: '1.25rem', fontWeight: 800 }}>
            {formatCurrency(pkg.price)}
          </div>
        </div>

        <button
          type="button"
          onClick={() => onBook(pkg)}
          disabled={!isAvailable}
          className="btn btn-primary motion-press"
          style={{ width: '100%' }}
        >
          {isAvailable ? 'Book Package' : 'Currently Unavailable'}
        </button>
      </div>
    </article>
  );
};
