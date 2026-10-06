import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { PageLayout } from '../components/layout/PageLayout';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { Badge } from '../components/common/Badge';
import { LoadingSkeleton } from '../components/common/LoadingSkeleton';
import { EmptyState } from '../components/common/EmptyState';
import { useTeamDetail } from '../hooks/useTeams';
import { useAuth } from '../hooks/useAuth';
import { teamsApi } from '../api/teams';

/**
 * Team Detail View (FR-021, FR-022)
 * Full roster, member roles, join request submission.
 */
export const TeamDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { team, isLoading, error, refetch } = useTeamDetail(id || '');
  const { isAuthenticated, user } = useAuth();

  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  if (isLoading) {
    return (
      <PageLayout>
        <LoadingSkeleton
          height="40px"
          width="300px"
          style={{ marginBottom: 'var(--space-md)' }}
        />
        <LoadingSkeleton height="250px" />
      </PageLayout>
    );
  }

  if (error || !team) {
    return (
      <PageLayout>
        <EmptyState
          title="Team Not Found"
          description={error || 'The requested team roster does not exist.'}
          actionText="Back to Teams"
          onAction={() => window.history.back()}
        />
      </PageLayout>
    );
  }

  const isFull = team.memberCount >= team.maxSlots;
  const isMember = team.members.some((m) => m.userId === user?.id);

  const handleJoin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setNotice(null);
    try {
      const res = await teamsApi.joinTeam(team.id, message);
      setNotice(res.message);
      setMessage('');
      await refetch();
    } catch (err: unknown) {
      setNotice(err instanceof Error ? err.message : 'Could not submit join request.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <PageLayout>
      <Breadcrumbs
        items={[
          { label: 'Home', to: '/' },
          { label: 'Teams', to: '/teams' },
          { label: team.name },
        ]}
      />

      <div
        className="card"
        style={{ padding: 'var(--space-xl)', marginBottom: 'var(--space-lg)' }}
      >
        <div
          className="flex justify-between items-center"
          style={{ marginBottom: 'var(--space-sm)' }}
        >
          <h1 style={{ margin: 0 }}>{team.name}</h1>
          <Badge variant={isFull ? 'closed' : 'open'}>
            {isFull ? 'ROSTER FULL' : 'OPEN SLOTS'}
          </Badge>
        </div>

        <p
          className="text-muted"
          style={{ fontSize: '1rem', marginBottom: 'var(--space-lg)' }}
        >
          Leader: <strong>{team.leaderUsername}</strong> &bull; Roster: {team.memberCount}{' '}
          / {team.maxSlots} Members
        </p>

        {team.description && (
          <div style={{ marginBottom: 'var(--space-xl)' }}>
            <h3>About Squad</h3>
            <p className="text-muted">{team.description}</p>
          </div>
        )}

        {/* Member Roster Table */}
        <div style={{ marginBottom: 'var(--space-xl)' }}>
          <h3 style={{ marginBottom: 'var(--space-sm)' }}>Official Roster</h3>
          <div
            style={{
              overflowX: 'auto',
              border: 'var(--border-width) solid var(--color-border)',
              borderRadius: 'var(--radius-sm)',
            }}
          >
            <div className="table-scroll">
              <table
                style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}
              >
                <thead>
                  <tr
                    style={{
                      backgroundColor: 'var(--color-surface-alt)',
                      fontSize: '0.85rem',
                    }}
                  >
                    <th style={{ padding: '10px 14px' }}>Player</th>
                    <th style={{ padding: '10px 14px' }}>In-Game Role</th>
                    <th style={{ padding: '10px 14px' }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {team.members.map((member) => (
                    <tr
                      key={member.userId}
                      style={{
                        borderTop: 'var(--border-width) solid var(--color-border)',
                      }}
                    >
                      <td style={{ padding: '10px 14px', fontWeight: 600 }}>
                        {member.username}
                      </td>
                      <td style={{ padding: '10px 14px' }} className="text-muted">
                        {member.inGameRole || 'Flex'}
                      </td>
                      <td style={{ padding: '10px 14px' }}>
                        {member.isLeader ? (
                          <span
                            className="badge"
                            style={{ borderColor: 'var(--color-accent)' }}
                          >
                            Team Leader
                          </span>
                        ) : (
                          <span className="badge">Active Member</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Join Application Section */}
        <div
          style={{
            padding: 'var(--space-md)',
            backgroundColor: 'var(--color-surface-alt)',
            borderRadius: 'var(--radius-sm)',
            border: 'var(--border-width) solid var(--color-border)',
          }}
        >
          {notice && (
            <div
              style={{
                padding: '8px 12px',
                backgroundColor: 'var(--color-surface)',
                border: 'var(--border-width) solid var(--color-accent)',
                borderRadius: 'var(--radius-sm)',
                marginBottom: 'var(--space-sm)',
                fontSize: '0.85rem',
              }}
            >
              {notice}
            </div>
          )}

          {isMember ? (
            <p className="text-muted" style={{ margin: 0 }}>
              You are currently registered on this squad roster.
            </p>
          ) : isFull ? (
            <p className="text-muted" style={{ margin: 0 }}>
              This squad has reached maximum capacity and is not currently accepting new
              player applications.
            </p>
          ) : isAuthenticated ? (
            <form onSubmit={handleJoin} className="flex flex-col gap-sm">
              <h4 style={{ margin: 0 }}>Request to Join {team.name}</h4>
              <textarea
                rows={2}
                placeholder="Briefly state your preferred role, rank, or availability..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
              <button
                type="submit"
                className="btn btn-primary motion-press"
                disabled={isSubmitting}
                style={{ alignSelf: 'flex-start' }}
              >
                {isSubmitting ? 'Submitting...' : 'Submit Join Request'}
              </button>
            </form>
          ) : (
            <div>
              <p className="text-muted" style={{ marginBottom: 'var(--space-xs)' }}>
                You must be logged in to apply for this team.
              </p>
              <Link to="/login" className="btn btn-primary">
                Login to Apply
              </Link>
            </div>
          )}
        </div>
      </div>
    </PageLayout>
  );
};
