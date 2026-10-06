import React from 'react';
import { Link } from 'react-router-dom';
import { Listing } from '../../types/listing';
import { Badge } from '../common/Badge';
import { calculatePriceBadges } from '../../utils/priceCalculation';
import { formatCurrency } from '../../utils/formatters';

interface ListingCardProps {
  listing: Listing;
  isOwner?: boolean;
}

/**
 * Game ID Marketplace Card (FR-040 to FR-045, UI-015)
 * Dynamically computes 'Good Deal' (with discount %) and 'Hot' badges.
 */
export const ListingCard: React.FC<ListingCardProps> = ({ listing, isOwner = false }) => {
  const analysis = calculatePriceBadges(
    listing.currentPrice,
    listing.initialPrice,
    listing.priceHistory,
  );

  const isSold = listing.status === 'sold';

  return (
    <article
      className="card motion-card-lift flex flex-col justify-between"
      style={{
        height: '100%',
        opacity: isSold ? 0.75 : 1,
      }}
    >
      <div>
        {/* Screenshot preview or media container */}
        <div
          style={{
            height: '160px',
            backgroundColor: 'var(--color-surface-alt)',
            borderRadius: 'var(--radius-sm)',
            overflow: 'hidden',
            marginBottom: 'var(--space-md)',
            position: 'relative',
            border: 'var(--border-width) solid var(--color-border)',
          }}
        >
          {listing.screenshots && listing.screenshots.length > 0 ? (
            <img
              src={listing.screenshots[0]}
              alt={`Screenshot for ${listing.gameTitle} ID`}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          ) : (
            <div
              style={{
                width: '100%',
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.85rem',
                color: 'var(--color-text-muted)',
              }}
            >
              Verified Proof
            </div>
          )}

          {/* Badges in top corners */}
          <div
            style={{
              position: 'absolute',
              top: 'var(--space-xs)',
              left: 'var(--space-xs)',
              display: 'flex',
              gap: 'var(--space-xs)',
              flexWrap: 'wrap',
            }}
          >
            {isSold && <Badge variant="past">SOLD</Badge>}
            {analysis.tags.includes('good_deal') && (
              <Badge variant="good_deal">
                GOOD DEAL{' '}
                {analysis.discountPercentage ? `(-${analysis.discountPercentage}%)` : ''}
              </Badge>
            )}
            {analysis.tags.includes('hot') && <Badge variant="hot">HOT LISTING</Badge>}
          </div>
        </div>

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
            {listing.gameTitle}
          </span>
          <span className="tabular-nums" style={{ fontSize: '1.15rem', fontWeight: 800 }}>
            {formatCurrency(listing.currentPrice)}
          </span>
        </div>

        <h3 style={{ fontSize: '1rem', marginBottom: 'var(--space-xs)' }}>
          <Link
            to={`/marketplace/${listing.id}`}
            style={{ color: 'var(--color-text)', textDecoration: 'none' }}
          >
            {listing.gameIdDetails}
          </Link>
        </h3>
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
          style={{ marginBottom: 'var(--space-sm)' }}
        >
          <span className="text-muted">Seller:</span>
          <span>
            <strong>{listing.sellerRef.username}</strong>
            <span
              className="tabular-nums"
              style={{ marginLeft: '6px', color: 'var(--color-text-muted)' }}
            >
              ★ {listing.sellerRef.ratingAverage.toFixed(1)} (
              {listing.sellerRef.ratingCount})
            </span>
          </span>
        </div>

        <div className="flex justify-between items-center">
          <Link
            to={`/marketplace/${listing.id}`}
            className="btn btn-secondary motion-press"
            style={{ width: '100%', textAlign: 'center', fontSize: '0.85rem' }}
          >
            {isOwner ? 'Manage Listing' : 'View Details & Contact'}
          </Link>
        </div>
      </div>
    </article>
  );
};
