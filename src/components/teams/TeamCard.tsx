import React, { useState } from 'react';
import { TeamGroup } from '../../types/team';
import { Badge } from '../common/Badge';
import { useAuth } from '../../hooks/useAuth';

interface TeamCardProps {
  team: TeamGroup;
  onJoin: (teamId: string, message?: string) => Promise<void>;
}

/**
 * Team & Group Card (FR-022, FR-023, EDGE-003)
 * Displays total member count, open slot availability, and join request modal.
 */
export const TeamCard: React.FC<TeamCardProps> = ({ team, onJoin }) => {
  const { isAuthenticated, user } = useAuth();
  const [isJoining, setIsJoining] = useState(false);
  const [joinMessage, setJoinMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successNotice, setSuccessNotice] = useState<string | null>(null);

  const isFull = team.memberCount >= team.maxSlots;
  const isMember = team.members.some((m) => m.userId === user?.id);
  const isLeader = team.leaderId === user?.id;

  const handleJoinSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onJoin(team.id, joinMessage);
      setSuccessNotice('Join request sent!');
      setIsJoining(false);
    } catch {
      // Handled in parent/hook
    } finally {
      setIsSubmitting(false);
    }
  };

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
          <h3 style={{ margin: 0 }}>{team.name}</h3>
          <Badge variant={isFull ? 'closed' : 'open'}>
            {isFull ? 'NOT AVAILABLE' : 'OPEN TO JOIN'}
          </Badge>
        </div>

        <p
          className="text-muted"
          style={{ fontSize: '0.85rem', marginBottom: 'var(--space-sm)' }}
        >
          Leader: <strong>{team.leaderUsername}</strong>
        </p>

        {team.description && (
          <p
            className="text-muted"
            style={{ fontSize: '0.9rem', marginBottom: 'var(--space-md)' }}
          >
            {team.description}
          </p>
        )}
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
          <span className="text-muted" style={{ fontSize: '0.85rem' }}>
            Roster Slots:
          </span>
          <span className="tabular-nums" style={{ fontWeight: 700, fontSize: '0.95rem' }}>
            {team.memberCount} / {team.maxSlots}
          </span>
        </div>

        {/* Member preview list */}
        <div style={{ marginBottom: 'var(--space-md)' }}>
          <div className="flex gap-xs" style={{ flexWrap: 'wrap' }}>
            {team.members.map((member) => (
              <span
                key={member.userId}
                className="badge"
                style={{ fontSize: '0.7rem' }}
                title={member.inGameRole || 'Player'}
              >
                {member.username} {member.isLeader && '(Leader)'}
              </span>
            ))}
          </div>
        </div>

        {successNotice ? (
          <div
            style={{
              padding: '6px 10px',
              backgroundColor: 'var(--color-surface-alt)',
              borderColor: 'var(--color-success)',
              borderWidth: '1px',
              borderStyle: 'solid',
              fontSize: '0.85rem',
              color: 'var(--color-success)',
              borderRadius: 'var(--radius-sm)',
            }}
          >
            {successNotice}
          </div>
        ) : isMember || isLeader ? (
          <div className="text-muted" style={{ fontSize: '0.85rem' }}>
            {isLeader ? 'You are the leader' : 'You are a team member'}
          </div>
        ) : isFull ? (
          <button
            type="button"
            className="btn btn-secondary"
            disabled
            style={{ width: '100%' }}
          >
            Roster Full
          </button>
        ) : isAuthenticated ? (
          <div>
            {!isJoining ? (
              <button
                type="button"
                className="btn btn-primary motion-press"
                style={{ width: '100%' }}
                onClick={() => setIsJoining(true)}
              >
                Request to Join
              </button>
            ) : (
              <form onSubmit={handleJoinSubmit} className="flex flex-col gap-xs">
                <input
                  type="text"
                  placeholder="Optional note or role..."
                  value={joinMessage}
                  onChange={(e) => setJoinMessage(e.target.value)}
                  style={{ fontSize: '0.85rem', padding: '4px 8px' }}
                />
                <div className="flex gap-xs">
                  <button
                    type="submit"
                    className="btn btn-primary motion-press"
                    style={{ flex: 1, padding: '4px 8px', fontSize: '0.8rem' }}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Sending...' : 'Confirm Request'}
                  </button>
                  <button
                    type="button"
                    className="btn btn-outline"
                    style={{ padding: '4px 8px', fontSize: '0.8rem' }}
                    onClick={() => setIsJoining(false)}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
        ) : (
          <a
            href="/login"
            className="btn btn-outline"
            style={{ width: '100%', textAlign: 'center' }}
          >
            Login to Join
          </a>
        )}
      </div>
    </article>
  );
};
