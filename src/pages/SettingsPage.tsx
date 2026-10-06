import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageLayout } from '../components/layout/PageLayout';
import { ThemeToggle } from '../components/common/ThemeToggle';
import { Tabs, TabItem } from '../components/common/Tabs';
import { ConfirmDialog } from '../components/common/ConfirmDialog';
import { DensityToggle } from '../components/common/DensityToggle';
import { EmptyState } from '../components/common/EmptyState';
import { LoadingSkeleton } from '../components/common/LoadingSkeleton';
import { useSessions } from '../hooks/useSessions';
import { useActivity } from '../hooks/useActivity';
import { useAuth } from '../hooks/useAuth';
import { formatDateTime } from '../utils/formatters';
import { ActivityVisibility } from '../types/user';

type SettingsTab = 'theme' | 'sessions' | 'loginHistory' | 'activityHistory';

/**
 * Settings & Account Security Hub
 * DEV-001 to DEV-004: Session and device management with revocation.
 * FR-100 to FR-102: User activity log and privacy controls.
 * FR-093 & Section 1.3: Theme mode and interface density.
 */
export const SettingsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<SettingsTab>('theme');
  const { logout } = useAuth();
  const navigate = useNavigate();

  const {
    sessions,
    history: loginHistory,
    isLoading: isSessionsLoading,
    revokeSession,
  } = useSessions();

  const {
    activities,
    visibility: activityVisibility,
    isLoading: isActivityLoading,
    updateVisibility,
  } = useActivity();

  const [sessionToRevoke, setSessionToRevoke] = useState<{
    id: string;
    isCurrent: boolean;
  } | null>(null);
  const [isRevoking, setIsRevoking] = useState(false);

  const handleRevokeSession = async () => {
    if (!sessionToRevoke) return;
    setIsRevoking(true);
    try {
      await revokeSession(sessionToRevoke.id);
      // Revoking the session you are using signs you out.
      if (sessionToRevoke.isCurrent) {
        await logout();
        navigate('/login');
      }
    } finally {
      setIsRevoking(false);
      setSessionToRevoke(null);
    }
  };

  const settingsTabs: ReadonlyArray<TabItem<SettingsTab>> = [
    { id: 'theme', label: 'Theme and Interface' },
    { id: 'sessions', label: `Active Sessions (${sessions.length})` },
    { id: 'loginHistory', label: 'Login History' },
    { id: 'activityHistory', label: 'Activity History and Privacy' },
  ];

  return (
    <PageLayout title="Account Settings and Security">
      <Tabs<SettingsTab>
        idPrefix="settings"
        ariaLabel="Settings sections"
        value={activeTab}
        onChange={setActiveTab}
        tabs={settingsTabs}
      />

      <div
        id="settings-panel"
        role="tabpanel"
        aria-labelledby={`settings-tab-${activeTab}`}
      >
        {/* Content Pane */}
        <div>
          {/* TAB 1: Theme & Interface */}
          {activeTab === 'theme' && (
            <div className="card" style={{ padding: 'var(--space-xl)' }}>
              <h2 style={{ fontSize: '1.25rem', marginBottom: 'var(--space-sm)' }}>
                Theme & Interface Customization
              </h2>
              <p
                className="text-muted"
                style={{ fontSize: '0.9rem', marginBottom: 'var(--space-lg)' }}
              >
                Choose how Smexstore looks and how much space it uses.
              </p>

              {/* Theme Toggle (Section 1.3) */}
              <div
                style={{
                  padding: 'var(--space-md)',
                  backgroundColor: 'var(--color-surface-alt)',
                  borderRadius: 'var(--radius-sm)',
                  marginBottom: 'var(--space-lg)',
                }}
              >
                <h3 style={{ fontSize: '1rem', marginBottom: 'var(--space-xs)' }}>
                  Colour Mode
                </h3>
                <p
                  className="text-muted"
                  style={{ fontSize: '0.85rem', marginBottom: 'var(--space-md)' }}
                >
                  Crimson is the default palette. Midnight is the alternate dark palette.
                  The selection is preserved across sessions.
                </p>
                <ThemeToggle />
              </div>

              {/* Interface Density (FR-093) */}
              <div
                style={{
                  padding: 'var(--space-md)',
                  backgroundColor: 'var(--color-surface-alt)',
                  borderRadius: 'var(--radius-sm)',
                }}
              >
                <h3 style={{ fontSize: '1rem', marginBottom: 'var(--space-xs)' }}>
                  Interface Spacing Density
                </h3>
                <p
                  className="text-muted"
                  style={{ fontSize: '0.85rem', marginBottom: 'var(--space-md)' }}
                >
                  Adjust padding and scale factors across typography and card components.
                </p>
                <DensityToggle />
              </div>
            </div>
          )}

          {/* TAB 2: Active Sessions (DEV-001, DEV-004) */}
          {activeTab === 'sessions' && (
            <div className="card" style={{ padding: 'var(--space-xl)' }}>
              <h2 style={{ fontSize: '1.25rem', marginBottom: 'var(--space-sm)' }}>
                Active Devices and Sessions
              </h2>
              <p
                className="text-muted"
                style={{ fontSize: '0.9rem', marginBottom: 'var(--space-lg)' }}
              >
                View and revoke active sessions connected to your account.
              </p>

              {isSessionsLoading ? (
                <LoadingSkeleton height="150px" />
              ) : sessions.length === 0 ? (
                <EmptyState
                  title="No Active Sessions"
                  description="No remote active sessions detected."
                />
              ) : (
                <div className="flex flex-col gap-sm">
                  {sessions.map((sess) => (
                    <div
                      key={sess.sessionId}
                      className="flex justify-between items-center"
                      style={{
                        padding: 'var(--space-md)',
                        backgroundColor: 'var(--color-surface-alt)',
                        borderRadius: 'var(--radius-sm)',
                        border: 'var(--border-width) solid var(--color-border)',
                      }}
                    >
                      <div>
                        <div style={{ fontWeight: 600 }}>
                          {sess.deviceMetadata.browser} on {sess.deviceMetadata.os}
                          {sess.isCurrent && (
                            <span
                              className="badge"
                              style={{
                                marginLeft: '8px',
                                borderColor: 'var(--color-accent)',
                                color: 'var(--color-accent)',
                              }}
                            >
                              Current Session
                            </span>
                          )}
                        </div>
                        <div
                          className="text-muted"
                          style={{ fontSize: '0.8rem', marginTop: '2px' }}
                        >
                          Location: {sess.deviceMetadata.approximateLocation || 'Unknown'}{' '}
                          &bull; IP: {sess.deviceMetadata.ipAddress || 'Hidden'}
                        </div>
                        <div className="text-muted" style={{ fontSize: '0.75rem' }}>
                          Login: {formatDateTime(sess.loginTimestamp)}
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() =>
                          setSessionToRevoke({
                            id: sess.sessionId,
                            isCurrent: Boolean(sess.isCurrent),
                          })
                        }
                        className="btn btn-outline motion-press"
                        style={{ fontSize: '0.8rem', color: 'var(--color-error)' }}
                      >
                        {sess.isCurrent ? 'Logout This Device' : 'Revoke Session'}
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: Login History (DEV-002, SEC-005) */}
          {activeTab === 'loginHistory' && (
            <div className="card" style={{ padding: 'var(--space-xl)' }}>
              <h2 style={{ fontSize: '1.25rem', marginBottom: 'var(--space-sm)' }}
              >
                Login History
              </h2>
              <p
                className="text-muted"
                style={{ fontSize: '0.9rem', marginBottom: 'var(--space-lg)' }}
              >
                Chronological authentication events recorded for your account.
              </p>

              {isSessionsLoading ? (
                <LoadingSkeleton height="150px" />
              ) : loginHistory.length === 0 ? (
                <EmptyState
                  title="No Login Events Recorded"
                  description="Your historical authentication events will display here."
                />
              ) : (
                <div
                  style={{
                    overflowX: 'auto',
                    border: 'var(--border-width) solid var(--color-border)',
                    borderRadius: 'var(--radius-sm)',
                  }}
                >
                  <div className="table-scroll">
                    <table
                      style={{
                        width: '100%',
                        borderCollapse: 'collapse',
                        textAlign: 'left',
                      }}
                    >
                      <thead>
                        <tr
                          style={{
                            backgroundColor: 'var(--color-surface-alt)',
                            fontSize: '0.85rem',
                          }}
                        >
                          <th style={{ padding: '10px 14px' }}>Timestamp</th>
                          <th style={{ padding: '10px 14px' }}>Device</th>
                          <th style={{ padding: '10px 14px' }}>Location / IP</th>
                          <th style={{ padding: '10px 14px' }}>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {loginHistory.map((item) => (
                          <tr
                            key={item.id}
                            style={{
                              borderTop: 'var(--border-width) solid var(--color-border)',
                            }}
                          >
                            <td style={{ padding: '10px 14px', fontSize: '0.85rem' }}>
                              {formatDateTime(item.timestamp)}
                            </td>
                            <td style={{ padding: '10px 14px', fontSize: '0.85rem' }}>
                              {item.deviceSummary}
                            </td>
                            <td
                              style={{ padding: '10px 14px', fontSize: '0.85rem' }}
                              className="text-muted"
                            >
                              {item.approximateLocation ||
                                item.ipAddress ||
                                'Not recorded'}
                            </td>
                            <td style={{ padding: '10px 14px' }}>
                              <span
                                className="badge"
                                style={{
                                  color:
                                    item.status === 'success'
                                      ? 'var(--color-success)'
                                      : 'var(--color-error)',
                                }}
                              >
                                {item.status.toUpperCase()}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 4: Activity History & Privacy (FR-100 to FR-102, SEC-006, EDGE-004) */}
          {activeTab === 'activityHistory' && (
            <div className="card" style={{ padding: 'var(--space-xl)' }}>
              <div
                className="flex justify-between items-center"
                style={{ marginBottom: 'var(--space-sm)' }}
              >
                <h2 style={{ fontSize: '1.25rem', margin: 0 }}>
                  Activity History & Privacy
                </h2>
              </div>
              <p
                className="text-muted"
                style={{ fontSize: '0.9rem', marginBottom: 'var(--space-lg)' }}
              >
                Track your platform actions and control what is visible on your public profile.
              </p>

              {/* Privacy Setting Toggle (EDGE-004) */}
              <div
                style={{
                  padding: 'var(--space-md)',
                  backgroundColor: 'var(--color-surface-alt)',
                  borderRadius: 'var(--radius-sm)',
                  marginBottom: 'var(--space-lg)',
                }}
              >
                <div
                  style={{
                    fontWeight: 600,
                    marginBottom: 'var(--space-xs)',
                    fontSize: '0.9rem',
                  }}
                >
                  Activity Privacy Preference
                </div>
                <div className="flex gap-xs" style={{ flexWrap: 'wrap' }}>
                  {(['public', 'hidden', 'off'] as ActivityVisibility[]).map((mode) => (
                    <button
                      key={mode}
                      type="button"
                      onClick={() => updateVisibility(mode)}
                      className="ui-interactive motion-press"
                      style={{
                        padding: '6px 14px',
                        fontSize: '0.85rem',
                        fontWeight: 600,
                        border: 'none',
                        borderRadius: 'var(--radius-sm)',
                        backgroundColor:
                          activityVisibility === mode
                            ? 'var(--color-accent)'
                            : 'var(--color-surface)',
                        color:
                          activityVisibility === mode
                            ? 'var(--color-accent-text)'
                            : 'var(--color-text-muted)',
                        cursor: 'pointer',
                      }}
                    >
                      {mode.toUpperCase()}
                    </button>
                  ))}
                </div>
                <span
                  className="text-muted"
                  style={{ fontSize: '0.75rem', marginTop: '6px', display: 'block' }}
                >
                  {activityVisibility === 'off'
                    ? 'Activity recording is turned off. No new actions will be logged.'
                    : activityVisibility === 'hidden'
                      ? 'Activity is logged but hidden from your public profile.'
                      : 'Activity is visible to community members on your public profile.'}
                </span>
              </div>

              {/* Activity Log List */}
              {isActivityLoading ? (
                <LoadingSkeleton height="150px" />
              ) : activities.length === 0 ? (
                <EmptyState
                  title="No Activity Events Recorded"
                  description="Your platform interactions will be logged here when active."
                />
              ) : (
                <div className="flex flex-col gap-xs">
                  {activities.map((act) => (
                    <div
                      key={act.id}
                      style={{
                        padding: 'var(--space-sm) var(--space-md)',
                        backgroundColor: 'var(--color-surface-alt)',
                        borderRadius: 'var(--radius-sm)',
                        fontSize: '0.85rem',
                        display: 'flex',
                        justifyContent: 'space-between',
                      }}
                    >
                      <div>
                        <strong>{act.event}</strong>
                        {act.eventDetails && (
                          <span className="text-muted"> &bull; {act.eventDetails}</span>
                        )}
                      </div>
                      <div
                        className="text-muted tabular-nums"
                        style={{ fontSize: '0.75rem' }}
                      >
                        {formatDateTime(act.timestamp)}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      <ConfirmDialog
        open={sessionToRevoke !== null}
        title="Revoke this session?"
        message={
          sessionToRevoke?.isCurrent
            ? 'This is the session you are using. You will be signed out.'
            : 'The device will be signed out of your account.'
        }
        confirmLabel="Revoke session"
        destructive
        isBusy={isRevoking}
        onConfirm={handleRevokeSession}
        onCancel={() => setSessionToRevoke(null)}
      />
    </PageLayout>
  );
};
