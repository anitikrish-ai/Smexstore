import React from 'react';
import { PageLayout } from '../components/layout/PageLayout';
import { EmptyState } from '../components/common/EmptyState';
import { LoadingSkeleton } from '../components/common/LoadingSkeleton';
import { useNotifications } from '../hooks/useNotifications';
import { formatDateTime } from '../utils/formatters';

/**
 * Notifications Center (FR-080, API-010)
 * Manages requests (team invites/join requests) and updates (tournament notifications, marketplace).
 */
export const NotificationsPage: React.FC = () => {
  const { notifications, isLoading, error, refetch, markAsRead } = useNotifications();

  return (
    <PageLayout title="Notification Center">
      <div style={{ maxWidth: '780px', margin: '0 auto' }}>
        <p className="text-muted" style={{ marginBottom: 'var(--space-lg)' }}>
          Review requests (team join inquiries) and system updates (tournament
          announcements and listing updates).
        </p>

        {isLoading ? (
          <div className="flex flex-col gap-sm">
            {[1, 2, 3].map((i) => (
              <LoadingSkeleton key={i} height="80px" borderRadius="var(--radius-sm)" />
            ))}
          </div>
        ) : error ? (
          <EmptyState
            title="Could Not Load Notifications"
            description={error}
            actionText="Retry"
            onAction={refetch}
          />
        ) : notifications.length === 0 ? (
          <EmptyState
            title="All Caught Up"
            description="You have no notifications or pending requests at this time."
          />
        ) : (
          <div className="flex flex-col gap-sm">
            {notifications.map((n) => (
              <div
                key={n.id}
                className="card flex justify-between items-center"
                style={{
                  padding: 'var(--space-md)',
                  backgroundColor: n.readState
                    ? 'var(--color-surface)'
                    : 'var(--color-surface-alt)',
                  borderLeftWidth: n.readState ? 'var(--border-width)' : '4px',
                  borderLeftColor: n.readState
                    ? 'var(--color-border)'
                    : 'var(--color-accent)',
                }}
              >
                <div>
                  <div
                    className="flex items-center gap-xs"
                    style={{ marginBottom: '4px' }}
                  >
                    <span
                      className="badge"
                      style={{
                        borderColor:
                          n.type === 'request'
                            ? 'var(--color-accent)'
                            : 'var(--color-border)',
                        fontSize: '0.65rem',
                      }}
                    >
                      {n.type.toUpperCase()}
                    </span>
                    <strong style={{ fontSize: '0.95rem' }}>{n.title}</strong>
                  </div>

                  <p style={{ margin: '4px 0', fontSize: '0.85rem' }}>{n.message}</p>

                  <div
                    className="text-muted tabular-nums"
                    style={{ fontSize: '0.75rem' }}
                  >
                    {formatDateTime(n.createdAt)}
                  </div>
                </div>

                {!n.readState && (
                  <button
                    type="button"
                    onClick={() => markAsRead(n.id)}
                    className="btn btn-outline motion-press"
                    style={{ fontSize: '0.75rem', padding: '4px 8px' }}
                  >
                    Mark as Read
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </PageLayout>
  );
};
