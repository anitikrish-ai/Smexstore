import React, { useState, useEffect } from 'react';
import { PresetAvatar } from '../../types/user';
import { profileApi } from '../../api/profile';
import { LoadingSkeleton } from './LoadingSkeleton';
import { EmptyState } from './EmptyState';

interface AvatarPickerProps {
  selectedRef: string;
  onSelect: (avatarRef: string) => void;
}

/**
 * Preset Avatar Selector Component (FR-024, TC-008)
 * Strictly loads approved avatars from the API/server config.
 * Prohibits custom file uploads and contains zero bundled mock images.
 */
export const AvatarPicker: React.FC<AvatarPickerProps> = ({ selectedRef, onSelect }) => {
  const [avatars, setAvatars] = useState<PresetAvatar[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    profileApi
      .getPresetAvatars()
      .then((res) => {
        if (isMounted) {
          setAvatars(res.avatars || []);
          setIsLoading(false);
        }
      })
      .catch((err: unknown) => {
        if (isMounted) {
          setError(
            err instanceof Error ? err.message : 'Could not fetch preset avatars.',
          );
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  if (isLoading) {
    return (
      <div
        className="grid grid-cols-4-lg gap-sm"
        style={{ padding: 'var(--space-sm) 0' }}
      >
        {[1, 2, 3, 4].map((i) => (
          <LoadingSkeleton key={i} height="70px" borderRadius="var(--radius-md)" />
        ))}
      </div>
    );
  }

  if (error || avatars.length === 0) {
    return (
      <EmptyState
        title="No Preset Avatars Available"
        description="The preset avatars catalog has not been populated by the server yet."
      />
    );
  }

  return (
    <div
      role="radiogroup"
      aria-label="Choose profile avatar"
      className="grid grid-cols-4-lg gap-sm"
      style={{ padding: 'var(--space-sm) 0' }}
    >
      {avatars.map((avatar) => {
        const isSelected = selectedRef === avatar.id;
        return (
          <button
            key={avatar.id}
            type="button"
            role="radio"
            aria-checked={isSelected}
            onClick={() => onSelect(avatar.id)}
            className="card motion-press ui-interactive"
            style={{
              padding: 'var(--space-sm)',
              textAlign: 'center',
              borderWidth: isSelected ? '2px' : 'var(--border-width)',
              borderColor: isSelected ? 'var(--color-accent)' : 'var(--color-border)',
              backgroundColor: isSelected
                ? 'var(--color-surface-alt)'
                : 'var(--color-surface)',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 'var(--space-xs)',
            }}
          >
            {avatar.url ? (
              <img
                src={avatar.url}
                alt={avatar.name}
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: 'var(--radius-sm)',
                  objectFit: 'cover',
                  backgroundColor: 'var(--color-surface-alt)',
                }}
              />
            ) : (
              <div
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: 'var(--color-surface-alt)',
                  border: 'var(--border-width) solid var(--color-border)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 700,
                  fontSize: '0.85rem',
                }}
              >
                {avatar.name.slice(0, 2).toUpperCase()}
              </div>
            )}
            <span style={{ fontSize: '0.75rem', fontWeight: 600 }}>{avatar.name}</span>
          </button>
        );
      })}
    </div>
  );
};
