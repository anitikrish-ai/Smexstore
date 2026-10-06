import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { PageLayout } from '../components/layout/PageLayout';
import { ProgressBar } from '../components/common/ProgressBar';
import { ErrorMessage } from '../components/common/ErrorMessage';
import { useCreateListing } from '../hooks/useMarketplace';
import { useAuth } from '../hooks/useAuth';

/**
 * Create Game ID Listing (FR-040, FR-111, TBD-04)
 * Supports screenshot proofs and upload progress feedback using transform scaleX.
 */
export const CreateListingPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { createListing, uploadProgress, isSubmitting, error } = useCreateListing();

  const [gameTitle, setGameTitle] = useState('');
  const [gameIdDetails, setGameIdDetails] = useState('');
  const [price, setPrice] = useState('');
  const [contact, setContact] = useState('');
  const [screenshotUrl, setScreenshotUrl] = useState('');

  // TBD-04: Check email verification
  if (user && !user.emailVerified) {
    return (
      <PageLayout title="List Game ID">
        <div
          className="card"
          style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}
        >
          <h2>Email Verification Required</h2>
          <p className="text-muted" style={{ margin: 'var(--space-md) 0' }}>
            To safeguard the community and prevent fraudulent listings, you must verify
            your email before publishing marketplace items.
          </p>
          <Link to="/settings" className="btn btn-primary">
            Go to Settings & Profile
          </Link>
        </div>
      </PageLayout>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const numericPrice = Number(price);

    try {
      const newListing = await createListing({
        gameTitle: gameTitle.trim(),
        gameIdDetails: gameIdDetails.trim(),
        price: numericPrice,
        contact: contact.trim(),
        screenshots: screenshotUrl.trim() ? [screenshotUrl.trim()] : [],
      });
      navigate(`/marketplace/${newListing.id}`);
    } catch {
      // Error displayed via hook state
    }
  };

  return (
    <PageLayout title="List a Verified Game ID">
      <div style={{ maxWidth: '680px', margin: '0 auto' }}>
        <p className="text-muted" style={{ marginBottom: 'var(--space-lg)' }}>
          Provide accurate account specifications and direct screenshot proofs. All
          listings are subject to community seller rating oversight.
        </p>

        {error && <ErrorMessage message={error} />}

        {isSubmitting && (
          <div style={{ marginBottom: 'var(--space-md)' }}>
            <ProgressBar
              progress={uploadProgress}
              label="Uploading account proof and listing..."
            />
          </div>
        )}

        <form onSubmit={handleSubmit} className="card">
          <div style={{ marginBottom: 'var(--space-md)' }}>
            <label htmlFor="listing-game">Game Title *</label>
            <input
              id="listing-game"
              type="text"
              required
              placeholder="e.g. Valorant, Apex Legends, CS2"
              value={gameTitle}
              onChange={(e) => setGameTitle(e.target.value)}
            />
          </div>

          <div style={{ marginBottom: 'var(--space-md)' }}>
            <label htmlFor="listing-details">Game ID Details & Highlights *</label>
            <textarea
              id="listing-details"
              rows={4}
              required
              placeholder="e.g. Level 340, Radiant Peak, 18 Rare Weapon Skins, Full Battle Pass Unlocked..."
              value={gameIdDetails}
              onChange={(e) => setGameIdDetails(e.target.value)}
            />
          </div>

          <div
            className="grid grid-cols-1 grid-cols-2-sm gap-md"
            style={{ marginBottom: 'var(--space-md)' }}
          >
            <div>
              <label htmlFor="listing-price">Asking Price (USD) *</label>
              <input
                id="listing-price"
                type="number"
                min="1"
                step="1"
                required
                placeholder="250"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
            </div>

            <div>
              <label htmlFor="listing-contact">
                Contact Info (Discord / WhatsApp / Phone) *
              </label>
              <input
                id="listing-contact"
                type="text"
                required
                placeholder="e.g. Discord: player#1234"
                value={contact}
                onChange={(e) => setContact(e.target.value)}
              />
              <span
                className="text-muted"
                style={{ fontSize: '0.75rem', marginTop: '2px', display: 'block' }}
              >
                Only revealed to a buyer after they choose to contact you.
              </span>
            </div>
          </div>

          <div style={{ marginBottom: 'var(--space-lg)' }}>
            <label htmlFor="listing-screenshot">Screenshot Proof URL</label>
            <input
              id="listing-screenshot"
              type="url"
              placeholder="https://example.com/screenshot.jpg"
              value={screenshotUrl}
              onChange={(e) => setScreenshotUrl(e.target.value)}
            />
          </div>

          <div className="flex justify-between items-center">
            <Link to="/marketplace" className="btn btn-outline">
              Cancel
            </Link>
            <button
              type="submit"
              className="btn btn-primary motion-press"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Submitting Proof...' : 'Publish Listing'}
            </button>
          </div>
        </form>
      </div>
    </PageLayout>
  );
};
