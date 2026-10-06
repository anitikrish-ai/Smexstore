import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageLayout } from '../components/layout/PageLayout';
import { RankPackageCard } from '../components/rankBoosting/RankPackageCard';
import { ProgressBar } from '../components/common/ProgressBar';
import { Dialog } from '../components/common/Dialog';
import { ErrorMessage } from '../components/common/ErrorMessage';
import { SuccessMessage } from '../components/common/SuccessMessage';
import { sanitizeMultiline, sanitizeText } from '../utils/validation';
import { EmptyState } from '../components/common/EmptyState';
import { LoadingSkeleton } from '../components/common/LoadingSkeleton';
import { useRankBoosting } from '../hooks/useRankBoosting';
import { useAuth } from '../hooks/useAuth';
import { rankBoostingApi } from '../api/rankBoosting';
import { RankPackage } from '../types/rankPackage';
import { formatCurrency } from '../utils/formatters';

/**
 * Rank-Boosting Booking Hub (FR-050a to FR-050c)
 * Features tiered rank packages and request dispatching with progress-fill feedback.
 */
export const RankBoostingPage: React.FC = () => {
  const { packages, isLoading, error, refetch } = useRankBoosting();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [selectedPkg, setSelectedPkg] = useState<RankPackage | null>(null);
  // Keeps the last package visible while the dialog plays its exit animation.
  const lastPkgRef = useRef<RankPackage | null>(null);
  if (selectedPkg) lastPkgRef.current = selectedPkg;
  const shownPkg = selectedPkg ?? lastPkgRef.current;
  const [userContact, setUserContact] = useState('');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingProgress, setBookingProgress] = useState(0);
  const [bookingSuccess, setBookingSuccess] = useState<string | null>(null);
  const [bookingError, setBookingError] = useState<string | null>(null);

  const handleOpenBooking = (pkg: RankPackage) => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    setSelectedPkg(pkg);
    setBookingSuccess(null);
    setBookingError(null);
  };

  const handleConfirmBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPkg) return;

    setIsSubmitting(true);
    setBookingProgress(0.25);
    setBookingError(null);

    try {
      setBookingProgress(0.7);
      await rankBoostingApi.bookPackage(selectedPkg.id, {
        userContact: sanitizeText(userContact, 120),
        notes: sanitizeMultiline(notes, 500) || undefined,
      });
      setBookingProgress(1.0);
      setBookingSuccess('Your booking request has been submitted.');
      setUserContact('');
      setNotes('');
    } catch (err: unknown) {
      setBookingError(err instanceof Error ? err.message : 'Could not submit booking.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <PageLayout title="Rank-Boosting Services">
      <p
        className="text-muted"
        style={{ maxWidth: '720px', marginBottom: 'var(--space-lg)' }}
      >
        Browse verified boosting packages across competitive game titles. Select a package
        to schedule an appointment directly with the registered service provider.
      </p>

      {isLoading ? (
        <div className="grid grid-cols-1 grid-cols-2-sm grid-cols-3-lg gap-md">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <LoadingSkeleton key={i} height="300px" borderRadius="var(--radius-md)" />
          ))}
        </div>
      ) : error ? (
        <EmptyState
          title="Could Not Load Packages"
          description={error}
          actionText="Retry"
          onAction={refetch}
        />
      ) : packages.length === 0 ? (
        <EmptyState
          title="No Boosting Packages Configured"
          description="Packages will appear here once listed by providers or system administrators."
        />
      ) : (
        <div className="grid grid-cols-1 grid-cols-2-sm grid-cols-3-lg gap-md">
          {packages.map((pkg) => (
            <RankPackageCard key={pkg.id} pkg={pkg} onBook={handleOpenBooking} />
          ))}
        </div>
      )}

      <Dialog
        open={selectedPkg !== null}
        onClose={() => setSelectedPkg(null)}
        title={shownPkg ? `Book ${shownPkg.title}` : 'Book package'}
        maxWidth="480px"
      >
        {shownPkg && (
          <>
            <div
              style={{
                padding: 'var(--space-sm) var(--space-md)',
                backgroundColor: 'var(--color-surface-alt)',
                border: 'var(--border-width) solid var(--color-border)',
                borderRadius: 'var(--radius-sm)',
                marginBottom: 'var(--space-md)',
                fontSize: '0.85rem',
              }}
            >
              <div>
                Game: <strong>{shownPkg.gameTitle}</strong>
              </div>
              <div>
                Target:{' '}
                <strong>
                  {shownPkg.currentRankTier} to {shownPkg.targetRankTier}
                </strong>
              </div>
              <div>
                Estimated time: <strong>{shownPkg.estimatedDuration}</strong>
              </div>
              <div>
                Fee: <strong>{formatCurrency(shownPkg.price)}</strong>
              </div>
            </div>

            {bookingSuccess ? (
              <div>
                <SuccessMessage message={bookingSuccess} />
                <button
                  type="button"
                  onClick={() => setSelectedPkg(null)}
                  className="btn btn-primary"
                  style={{ width: '100%' }}
                  data-autofocus
                >
                  Done
                </button>
              </div>
            ) : (
              <form onSubmit={handleConfirmBooking}>
                {bookingError && (
                  <ErrorMessage
                    message={bookingError}
                    onDismiss={() => setBookingError(null)}
                  />
                )}

                {isSubmitting && (
                  <ProgressBar progress={bookingProgress} label="Securing booking" />
                )}

                <div style={{ marginBottom: 'var(--space-md)' }}>
                  <label htmlFor="user-contact">
                    Your contact (Discord, email or phone) *
                  </label>
                  <input
                    id="user-contact"
                    type="text"
                    required
                    maxLength={120}
                    placeholder="How should we reach you?"
                    value={userContact}
                    onChange={(e) => setUserContact(e.target.value)}
                    data-autofocus
                  />
                </div>

                <div style={{ marginBottom: 'var(--space-lg)' }}>
                  <label htmlFor="user-notes">
                    Optional notes or schedule constraints
                  </label>
                  <textarea
                    id="user-notes"
                    rows={3}
                    maxLength={500}
                    placeholder="Anything we should know about your availability?"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                  />
                </div>

                <div className="dialog-actions">
                  <button
                    type="button"
                    onClick={() => setSelectedPkg(null)}
                    className="btn btn-outline"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Booking' : 'Confirm Request'}
                  </button>
                </div>
              </form>
            )}
          </>
        )}
      </Dialog>
    </PageLayout>
  );
};
