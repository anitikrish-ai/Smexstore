import React, { useState } from 'react';

interface SellerContactRevealProps {
  contactInfo?: string;
  sellerUsername: string;
}

/**
 * Deliberate Seller Contact Reveal (FR-041, SEC-007)
 * Strictly prevents public indexing or scraping by requiring intentional user interaction.
 */
export const SellerContactReveal: React.FC<SellerContactRevealProps> = ({
  contactInfo,
  sellerUsername,
}) => {
  const [isRevealed, setIsRevealed] = useState<boolean>(false);

  if (!contactInfo) {
    return (
      <div
        className="card"
        style={{
          padding: 'var(--space-md)',
          backgroundColor: 'var(--color-surface-alt)',
        }}
      >
        <span className="text-muted" style={{ fontSize: '0.9rem' }}>
          Seller contact information is not provided for this listing.
        </span>
      </div>
    );
  }

  return (
    <div
      className="card"
      style={{
        padding: 'var(--space-md)',
        backgroundColor: 'var(--color-surface-alt)',
        border: 'var(--border-width) solid var(--color-border)',
      }}
    >
      <div
        style={{ marginBottom: 'var(--space-xs)', fontSize: '0.85rem', fontWeight: 600 }}
      >
        Direct Seller Contact
      </div>
      <p
        className="text-muted"
        style={{ fontSize: '0.8rem', marginBottom: 'var(--space-sm)' }}
      >
        In-platform chat and payments are not handled. Contact{' '}
        <strong>{sellerUsername}</strong> directly.
      </p>

      {!isRevealed ? (
        <button
          type="button"
          onClick={() => setIsRevealed(true)}
          className="btn btn-primary motion-press"
          style={{ width: '100%', fontSize: '0.85rem' }}
        >
          Click to Reveal Contact (Anti-Scraping Protection)
        </button>
      ) : (
        <div
          style={{
            padding: 'var(--space-sm) var(--space-md)',
            backgroundColor: 'var(--color-surface)',
            border: 'var(--border-width) solid var(--color-accent)',
            borderRadius: 'var(--radius-sm)',
            fontWeight: 700,
            fontSize: '1rem',
            textAlign: 'center',
            userSelect: 'all',
          }}
        >
          {contactInfo}
        </div>
      )}
    </div>
  );
};
