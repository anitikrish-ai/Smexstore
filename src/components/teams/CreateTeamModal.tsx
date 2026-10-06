import React, { useState } from 'react';
import { CreateTeamPayload } from '../../types/team';
import { Dialog } from '../common/Dialog';
import { ErrorMessage } from '../common/ErrorMessage';
import { sanitizeMultiline, sanitizeText } from '../../utils/validation';

interface CreateTeamModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (payload: CreateTeamPayload) => Promise<void>;
}

/**
 * Team Creation Modal (FR-020)
 * Uses the shared accessible Dialog (focus trap, Escape, animated enter and exit).
 */
export const CreateTeamModal: React.FC<CreateTeamModalProps> = ({
  isOpen,
  onClose,
  onCreate,
}) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [maxSlots, setMaxSlots] = useState(5);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanName = sanitizeText(name, 60);
    if (cleanName.length < 2) {
      setError('Team name must be at least 2 characters.');
      return;
    }
    setIsSubmitting(true);
    setError(null);
    try {
      await onCreate({
        name: cleanName,
        description: sanitizeMultiline(description, 500) || undefined,
        maxSlots,
      });
      setName('');
      setDescription('');
      onClose();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Could not create team.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onClose={onClose} title="Create Team or Group" maxWidth="500px">
      {error && <ErrorMessage message={error} onDismiss={() => setError(null)} />}

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: 'var(--space-md)' }}>
          <label htmlFor="team-name">Team Name *</label>
          <input
            id="team-name"
            type="text"
            required
            maxLength={60}
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your team name"
            data-autofocus
          />
        </div>

        <div style={{ marginBottom: 'var(--space-md)' }}>
          <label htmlFor="team-desc">Description and Playstyle</label>
          <textarea
            id="team-desc"
            rows={3}
            maxLength={500}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="What kind of players and matches are you looking for?"
          />
        </div>

        <div style={{ marginBottom: 'var(--space-lg)' }}>
          <label htmlFor="team-slots">Roster Size (Max Members)</label>
          <select
            id="team-slots"
            value={maxSlots}
            onChange={(e) => setMaxSlots(Number(e.target.value))}
          >
            <option value={2}>2 Players (Duo)</option>
            <option value={3}>3 Players (Trio)</option>
            <option value={4}>4 Players (Squad)</option>
            <option value={5}>5 Players (Full Team)</option>
            <option value={6}>6 Players (Roster + Sub)</option>
          </select>
        </div>

        <div className="flex flex-wrap justify-between gap-sm">
          <button type="button" onClick={onClose} className="btn btn-outline">
            Cancel
          </button>
          <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
            {isSubmitting ? 'Creating' : 'Create Team'}
          </button>
        </div>
      </form>
    </Dialog>
  );
};
