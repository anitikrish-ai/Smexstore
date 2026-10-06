import React, { useState, useEffect } from 'react';
import { PageLayout } from '../../components/layout/PageLayout';
import { RoleGuard } from '../../components/layout/RoleGuard';
import { LoadingSkeleton } from '../../components/common/LoadingSkeleton';
import { adminApi } from '../../api/admin';
import { AdminPlatformStats } from '../../types/api';

/**
 * Admin Elevated Management Dashboard (ADM-001, ADM-002, API-013)
 * Implements platform metrics overview and marketplace listing moderation controls.
 */
export const AdminDashboardPage: React.FC = () => {
  const [stats, setStats] = useState<AdminPlatformStats>({
    totalUsers: 0,
    activeListings: 0,
    totalTournaments: 0,
    openTeams: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [moderationId, setModerationId] = useState('');
  const [moderationNotice, setModerationNotice] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    adminApi
      .getPlatformStats()
      .then((res) => {
        if (isMounted) {
          setStats(res);
          setIsLoading(false);
        }
      })
      .catch(() => {
        if (isMounted) {
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const handleModerateListing = async (status: 'active' | 'deleted') => {
    if (!moderationId.trim()) return;
    try {
      const res = await adminApi.moderateMarketplaceListing(moderationId.trim(), status);
      setModerationNotice(res.message);
      setModerationId('');
    } catch (err: unknown) {
      setModerationNotice(
        err instanceof Error ? err.message : 'Moderation action failed.',
      );
    }
  };

  return (
    <RoleGuard requireAdmin>
      <PageLayout title="Administrative Control Center">
        <div style={{ marginBottom: 'var(--space-xl)' }}>
          <p className="text-muted" style={{ maxWidth: '680px' }}>
            Platform management area. Access is also enforced by the server for every
            action.
          </p>
        </div>

        {/* Platform Metrics (ADM-002) */}
        <div
          className="grid grid-cols-1 grid-cols-2-sm grid-cols-4-lg gap-md"
          style={{ marginBottom: 'var(--space-2xl)' }}
        >
          <div className="card">
            <span className="text-muted" style={{ fontSize: '0.85rem' }}>
              Registered Users
            </span>
            <div className="tabular-nums" style={{ fontSize: '1.8rem', fontWeight: 800 }}>
              {isLoading ? (
                <LoadingSkeleton height="36px" width="60px" />
              ) : (
                stats.totalUsers
              )}
            </div>
          </div>

          <div className="card">
            <span className="text-muted" style={{ fontSize: '0.85rem' }}>
              Active Marketplace Listings
            </span>
            <div className="tabular-nums" style={{ fontSize: '1.8rem', fontWeight: 800 }}>
              {isLoading ? (
                <LoadingSkeleton height="36px" width="60px" />
              ) : (
                stats.activeListings
              )}
            </div>
          </div>

          <div className="card">
            <span className="text-muted" style={{ fontSize: '0.85rem' }}>
              Platform Tournaments
            </span>
            <div className="tabular-nums" style={{ fontSize: '1.8rem', fontWeight: 800 }}>
              {isLoading ? (
                <LoadingSkeleton height="36px" width="60px" />
              ) : (
                stats.totalTournaments
              )}
            </div>
          </div>

          <div className="card">
            <span className="text-muted" style={{ fontSize: '0.85rem' }}>
              Active Squad Rosters
            </span>
            <div className="tabular-nums" style={{ fontSize: '1.8rem', fontWeight: 800 }}>
              {isLoading ? (
                <LoadingSkeleton height="36px" width="60px" />
              ) : (
                stats.openTeams
              )}
            </div>
          </div>
        </div>

        {/* Marketplace Moderation Scope (ADM-002) */}
        <div className="card" style={{ padding: 'var(--space-xl)', maxWidth: '640px' }}>
          <h2 style={{ fontSize: '1.25rem', marginBottom: 'var(--space-xs)' }}>
            Marketplace Moderation Tool
          </h2>
          <p
            className="text-muted"
            style={{ fontSize: '0.85rem', marginBottom: 'var(--space-md)' }}
          >
            Flag or force-remove reported listings that violate community guidelines or
            lack verified proofs.
          </p>

          {moderationNotice && (
            <div
              style={{
                padding: '8px 12px',
                backgroundColor: 'var(--color-surface-alt)',
                border: 'var(--border-width) solid var(--color-border)',
                borderRadius: 'var(--radius-sm)',
                marginBottom: 'var(--space-md)',
                fontSize: '0.85rem',
              }}
            >
              {moderationNotice}
            </div>
          )}

          <div className="flex flex-col gap-sm">
            <div>
              <label htmlFor="mod-listing-id">Listing ID</label>
              <input
                id="mod-listing-id"
                type="text"
                placeholder="Enter listing UUID..."
                value={moderationId}
                onChange={(e) => setModerationId(e.target.value)}
              />
            </div>

            <div className="flex gap-sm" style={{ marginTop: 'var(--space-xs)' }}>
              <button
                type="button"
                onClick={() => handleModerateListing('deleted')}
                className="btn btn-danger motion-press"
              >
                Delete / Takedown Listing
              </button>
              <button
                type="button"
                onClick={() => handleModerateListing('active')}
                className="btn btn-secondary motion-press"
              >
                Reinstate Listing
              </button>
            </div>
          </div>
        </div>
      </PageLayout>
    </RoleGuard>
  );
};
