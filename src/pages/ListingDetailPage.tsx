import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { PageLayout } from '../components/layout/PageLayout';
import { Badge } from '../components/common/Badge';
import { SellerContactReveal } from '../components/marketplace/SellerContactReveal';
import { LoadingSkeleton } from '../components/common/LoadingSkeleton';
import { EmptyState } from '../components/common/EmptyState';
import { Dialog } from '../components/common/Dialog';
import { ConfirmDialog } from '../components/common/ConfirmDialog';
import { ErrorMessage } from '../components/common/ErrorMessage';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { useListingDetail } from '../hooks/useMarketplace';
import { useSellerRatings, useSubmitRating } from '../hooks/useRatings';
import { useAuth } from '../hooks/useAuth';
import { calculatePriceBadges } from '../utils/priceCalculation';
import { formatCurrency, formatDate } from '../utils/formatters';

/**
 * Listing Detail Page (FR-041 to FR-045, SEC-007, SEC-008)
 */
export const ListingDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  const { listing, isLoading, error, updatePrice, markSold, deleteListing } =
    useListingDetail(id || '');

  const { summary: sellerRatings } = useSellerRatings(listing?.sellerRef.id || '');
  const { submitRating, isSubmitting: isRatingSubmitting } = useSubmitRating();

  // Confirmation for irreversible owner actions
  const [pendingAction, setPendingAction] = useState<'sold' | 'delete' | null>(null);
  const [isActionBusy, setIsActionBusy] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  // Price adjustment modal
  const [isPriceModalOpen, setIsPriceModalOpen] = useState(false);
  const [newPriceInput, setNewPriceInput] = useState('');
  const [priceActionError, setPriceActionError] = useState<string | null>(null);

  // Rating submission form (SEC-008)
  const [ratingValue, setRatingValue] = useState(5);
  const [ratingComment, setRatingComment] = useState('');
  const [ratingNotice, setRatingNotice] = useState<string | null>(null);

  if (isLoading) {
    return (
      <PageLayout>
        <LoadingSkeleton
          height="40px"
          width="40%"
          style={{ marginBottom: 'var(--space-md)' }}
        />
        <LoadingSkeleton height="350px" style={{ marginBottom: 'var(--space-md)' }} />
        <LoadingSkeleton height="200px" />
      </PageLayout>
    );
  }

  if (error || !listing) {
    return (
      <PageLayout>
        <EmptyState
          title="Listing Not Found"
          description={error || 'This listing does not exist or has been removed.'}
          actionText="Back to Marketplace"
          onAction={() => navigate('/marketplace')}
        />
      </PageLayout>
    );
  }

  const isOwner = user?.id === listing.sellerRef.id;
  const isSold = listing.status === 'sold';
  const isDeleted = listing.status === 'deleted';

  const analysis = calculatePriceBadges(
    listing.currentPrice,
    listing.initialPrice,
    listing.priceHistory,
  );

  const handlePriceUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    const val = Number(newPriceInput);
    if (isNaN(val) || val <= 0) {
      setPriceActionError('Please enter a valid price.');
      return;
    }

    try {
      await updatePrice({ newPrice: val });
      setIsPriceModalOpen(false);
      setNewPriceInput('');
      setPriceActionError(null);
    } catch (err: unknown) {
      setPriceActionError(err instanceof Error ? err.message : 'Failed to update price.');
    }
  };

  const runConfirmed = async () => {
    const action = pendingAction;
    if (!action) return;
    setIsActionBusy(true);
    setActionError(null);
    try {
      if (action === 'sold') {
        await markSold();
      } else {
        await deleteListing();
        navigate('/marketplace');
      }
      setPendingAction(null);
    } catch (err: unknown) {
      setPendingAction(null);
      setActionError(
        err instanceof Error ? err.message : 'That action could not be completed.',
      );
    } finally {
      setIsActionBusy(false);
    }
  };

  const handleMarkSold = () => setPendingAction('sold');
  const handleDelete = () => setPendingAction('delete');

  const handleRatingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setRatingNotice(null);
    try {
      await submitRating({
        sellerId: listing.sellerRef.id,
        listingId: listing.id,
        value: ratingValue,
        comment: ratingComment.trim() || undefined,
      });
      setRatingNotice('Your seller rating has been registered.');
      setRatingComment('');
    } catch (err: unknown) {
      // EDGE-006: Error when no purchase relationship exists
      setRatingNotice(
        err instanceof Error
          ? err.message
          : 'Rating denied. Only verified buyers may rate.',
      );
    }
  };

  return (
    <PageLayout>
      <Breadcrumbs
        items={[
          { label: 'Home', to: '/' },
          { label: 'Marketplace', to: '/marketplace' },
          { label: 'Listing' },
        ]}
      />

      {actionError && (
        <ErrorMessage message={actionError} onDismiss={() => setActionError(null)} />
      )}

      {isSold && (
        <div
          style={{
            padding: 'var(--space-sm) var(--space-md)',
            backgroundColor: 'var(--color-surface-alt)',
            border: 'var(--border-width) solid var(--color-border)',
            borderRadius: 'var(--radius-sm)',
            marginBottom: 'var(--space-md)',
            fontWeight: 700,
          }}
        >
          This game ID has been marked as sold by the seller.
        </div>
      )}

      {isDeleted && (
        <div
          style={{
            padding: 'var(--space-sm) var(--space-md)',
            backgroundColor: 'var(--color-surface-alt)',
            border: 'var(--border-width) solid var(--color-error)',
            borderRadius: 'var(--radius-sm)',
            marginBottom: 'var(--space-md)',
            color: 'var(--color-error)',
            fontWeight: 700,
          }}
        >
          This listing has been removed or deleted.
        </div>
      )}

      <div className="grid grid-cols-1 grid-cols-3-lg gap-lg">
        {/* Left 2 Cols: Screenshots & Details */}
        <div className="span-2-lg">
          <div className="card" style={{ marginBottom: 'var(--space-lg)' }}>
            <div
              className="flex justify-between items-center"
              style={{ marginBottom: 'var(--space-xs)' }}
            >
              <span
                style={{
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  color: 'var(--color-accent)',
                  textTransform: 'uppercase',
                }}
              >
                {listing.gameTitle}
              </span>
              <div className="flex gap-xs">
                {analysis.tags.includes('good_deal') && (
                  <Badge variant="good_deal">
                    GOOD DEAL{' '}
                    {analysis.discountPercentage
                      ? `(-${analysis.discountPercentage}%)`
                      : ''}
                  </Badge>
                )}
                {analysis.tags.includes('hot') && (
                  <Badge variant="hot">HOT LISTING</Badge>
                )}
              </div>
            </div>

            <h1 style={{ fontSize: '1.6rem', marginBottom: 'var(--space-md)' }}>
              {listing.gameIdDetails}
            </h1>

            {/* Screenshots proof gallery */}
            <div style={{ marginBottom: 'var(--space-lg)' }}>
              <h3 style={{ fontSize: '1rem', marginBottom: 'var(--space-xs)' }}>
                Account Verification Screenshots
              </h3>
              {listing.screenshots && listing.screenshots.length > 0 ? (
                <div className="grid grid-cols-1 grid-cols-2-sm gap-sm">
                  {listing.screenshots.map((url, i) => (
                    <div
                      key={i}
                      style={{
                        position: 'relative',
                        aspectRatio: '16/9',
                        overflow: 'hidden',
                        borderRadius: 'var(--radius-sm)',
                        border: 'var(--border-width) solid var(--color-border)',
                        backgroundColor: 'var(--color-surface-alt)',
                      }}
                    >
                      <img
                        src={url}
                        alt={`Proof screenshot ${i + 1}`}
                        loading="lazy"
                        decoding="async"
                        style={{
                          position: 'absolute',
                          inset: 0,
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                        }}
                        onError={(e) => {
                          const el = e.currentTarget as HTMLImageElement;
                          el.style.display = 'none';
                          const fb = el.nextElementSibling as HTMLElement | null;
                          if (fb) fb.style.display = 'flex';
                        }}
                      />
                      <span
                        aria-hidden="true"
                        style={{
                          display: 'none',
                          position: 'absolute',
                          inset: 0,
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '0.8rem',
                          color: 'var(--color-text-muted)',
                        }}
                      >
                        Image unavailable
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div
                  style={{
                    padding: 'var(--space-xl)',
                    textAlign: 'center',
                    backgroundColor: 'var(--color-surface-alt)',
                    borderRadius: 'var(--radius-sm)',
                    border: 'var(--border-width) solid var(--color-border)',
                  }}
                  className="text-muted"
                >
                  Verified proof screenshots submitted to platform.
                </div>
              )}
            </div>

            {/* Price change history (EDGE-002) */}
            <div
              style={{
                borderTop: 'var(--border-width) solid var(--color-border)',
                paddingTop: 'var(--space-md)',
              }}
            >
              <h4 style={{ fontSize: '0.9rem', marginBottom: 'var(--space-xs)' }}>
                Price History
              </h4>
              <div className="flex gap-sm" style={{ flexWrap: 'wrap' }}>
                <span className="badge">
                  Initial Price: {formatCurrency(listing.initialPrice)}
                </span>
                {listing.priceHistory.map((pt, idx) => (
                  <span key={idx} className="badge">
                    {formatDate(pt.timestamp)}: {formatCurrency(pt.price)}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Seller Ratings Section (FR-045) */}
          <div className="card">
            <div
              className="flex justify-between items-center"
              style={{ marginBottom: 'var(--space-md)' }}
            >
              <h3>Seller Community Trust</h3>
              <div className="tabular-nums" style={{ fontWeight: 700 }}>
                ★ {sellerRatings.average.toFixed(1)} / 5.0 ({sellerRatings.totalCount}{' '}
                ratings)
              </div>
            </div>

            {sellerRatings.ratings.length === 0 ? (
              <p className="text-muted" style={{ fontSize: '0.85rem' }}>
                No completed reviews recorded for this seller yet.
              </p>
            ) : (
              <div className="flex flex-col gap-sm">
                {sellerRatings.ratings.map((r) => (
                  <div
                    key={r.id}
                    style={{
                      padding: 'var(--space-sm)',
                      backgroundColor: 'var(--color-surface-alt)',
                      borderRadius: 'var(--radius-sm)',
                    }}
                  >
                    <div
                      className="flex justify-between items-center"
                      style={{ fontSize: '0.85rem' }}
                    >
                      <strong>{r.buyerRef.username}</strong>
                      <span className="tabular-nums">★ {r.value} / 5</span>
                    </div>
                    {r.comment && (
                      <p style={{ margin: '4px 0 0 0', fontSize: '0.85rem' }}>
                        {r.comment}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* SEC-008: Rate Seller Form (Eligible buyers only) */}
            {!isOwner && (
              <div
                style={{
                  marginTop: 'var(--space-md)',
                  paddingTop: 'var(--space-md)',
                  borderTop: 'var(--border-width) solid var(--color-border)',
                }}
              >
                <h4 style={{ fontSize: '0.9rem', marginBottom: 'var(--space-xs)' }}>
                  Rate This Seller (Verified Purchase Required)
                </h4>
                {ratingNotice && (
                  <div
                    style={{
                      padding: '6px 10px',
                      backgroundColor: 'var(--color-surface-alt)',
                      borderColor: 'var(--color-border)',
                      borderWidth: '1px',
                      borderStyle: 'solid',
                      fontSize: '0.85rem',
                      marginBottom: 'var(--space-xs)',
                      borderRadius: 'var(--radius-sm)',
                    }}
                  >
                    {ratingNotice}
                  </div>
                )}
                <form onSubmit={handleRatingSubmit} className="flex flex-col gap-xs">
                  <div className="flex gap-xs items-center">
                    <label
                      htmlFor="rating-val"
                      style={{ margin: 0, fontSize: '0.85rem' }}
                    >
                      Stars:
                    </label>
                    <select
                      id="rating-val"
                      value={ratingValue}
                      onChange={(e) => setRatingValue(Number(e.target.value))}
                      style={{ width: '80px', padding: '4px' }}
                    >
                      <option value={5}>5 ★</option>
                      <option value={4}>4 ★</option>
                      <option value={3}>3 ★</option>
                      <option value={2}>2 ★</option>
                      <option value={1}>1 ★</option>
                    </select>
                  </div>
                  <input
                    type="text"
                    placeholder="Optional review details..."
                    value={ratingComment}
                    onChange={(e) => setRatingComment(e.target.value)}
                    style={{ fontSize: '0.85rem', padding: '4px 8px' }}
                  />
                  <button
                    type="submit"
                    className="btn btn-secondary motion-press"
                    disabled={isRatingSubmitting}
                    style={{
                      alignSelf: 'flex-start',
                      padding: '4px 12px',
                      fontSize: '0.8rem',
                    }}
                  >
                    {isRatingSubmitting ? 'Verifying...' : 'Submit Rating'}
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>

        {/* Right Col: Price, Contact, and Owner Controls */}
        <div>
          {/* Price Box */}
          <div className="card" style={{ marginBottom: 'var(--space-lg)' }}>
            <span className="text-muted" style={{ fontSize: '0.8rem' }}>
              Asking Price
            </span>
            <div className="tabular-nums" style={{ fontSize: '2rem', fontWeight: 800 }}>
              {formatCurrency(listing.currentPrice)}
            </div>

            {/* FR-042: Owner Controls */}
            {isOwner ? (
              <div
                style={{
                  marginTop: 'var(--space-md)',
                  paddingTop: 'var(--space-md)',
                  borderTop: 'var(--border-width) solid var(--color-border)',
                }}
              >
                <div
                  style={{
                    fontSize: '0.85rem',
                    fontWeight: 700,
                    marginBottom: 'var(--space-xs)',
                  }}
                >
                  Manage Your Listing
                </div>
                <div className="flex flex-col gap-xs">
                  <button
                    type="button"
                    onClick={() => setIsPriceModalOpen(true)}
                    className="btn btn-secondary motion-press"
                  >
                    Adjust Price (Triggers Deal / Hot)
                  </button>
                  {!isSold && (
                    <button
                      type="button"
                      onClick={handleMarkSold}
                      className="btn btn-outline motion-press"
                    >
                      Mark as Sold
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={handleDelete}
                    className="btn btn-danger motion-press"
                  >
                    Delete Listing
                  </button>
                </div>
              </div>
            ) : (
              /* SEC-007: Deliberate Contact Reveal for Buyers */
              <div style={{ marginTop: 'var(--space-md)' }}>
                <SellerContactReveal
                  sellerUsername={listing.sellerRef.username}
                  contactInfo={listing.contact}
                />
              </div>
            )}
          </div>

          {/* Seller Profile Summary */}
          <div className="card">
            <h4>Seller Profile</h4>
            <div style={{ margin: 'var(--space-sm) 0', fontSize: '0.9rem' }}>
              <div>
                Username: <strong>{listing.sellerRef.username}</strong>
              </div>
              <div className="text-muted" style={{ marginTop: '4px' }}>
                In-Game Handle: {listing.sellerRef.inGameUsername}
              </div>
            </div>
            <Link
              to={`/profile/${listing.sellerRef.id}`}
              className="btn btn-outline"
              style={{ width: '100%', textAlign: 'center', fontSize: '0.85rem' }}
            >
              View Full Seller Profile
            </Link>
          </div>
        </div>
      </div>

      <ConfirmDialog
        open={pendingAction !== null}
        title={
          pendingAction === 'delete'
            ? 'Delete this listing?'
            : 'Mark this listing as sold?'
        }
        message={
          pendingAction === 'delete'
            ? 'This permanently removes the listing and cannot be undone.'
            : 'Buyers will see this game ID as sold.'
        }
        confirmLabel={pendingAction === 'delete' ? 'Delete listing' : 'Mark as sold'}
        destructive={pendingAction === 'delete'}
        isBusy={isActionBusy}
        onConfirm={runConfirmed}
        onCancel={() => setPendingAction(null)}
      />

      <Dialog
        open={isPriceModalOpen}
        onClose={() => setIsPriceModalOpen(false)}
        title="Update Listing Price"
        maxWidth="420px"
      >
        <p
          className="text-muted"
          style={{ fontSize: '0.85rem', marginBottom: 'var(--space-md)' }}
        >
          Current price: {formatCurrency(listing.currentPrice)}. Lowering the price adds a
          Good Deal badge. Raising it adds a Hot tag.
        </p>

        {priceActionError && (
          <ErrorMessage
            message={priceActionError}
            onDismiss={() => setPriceActionError(null)}
          />
        )}

        <form onSubmit={handlePriceUpdate}>
          <div style={{ marginBottom: 'var(--space-md)' }}>
            <label htmlFor="new-price-input">New price ($)</label>
            <input
              id="new-price-input"
              type="number"
              step="1"
              min="1"
              required
              inputMode="numeric"
              value={newPriceInput}
              onChange={(e) => setNewPriceInput(e.target.value)}
              placeholder="Enter a whole-dollar price"
              data-autofocus
            />
          </div>

          <div className="dialog-actions">
            <button
              type="button"
              onClick={() => setIsPriceModalOpen(false)}
              className="btn btn-outline"
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Save New Price
            </button>
          </div>
        </form>
      </Dialog>
    </PageLayout>
  );
};
