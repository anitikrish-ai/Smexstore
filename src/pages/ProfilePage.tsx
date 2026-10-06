import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { PageLayout } from '../components/layout/PageLayout';
import { AvatarPicker } from '../components/common/AvatarPicker';
import { ErrorMessage } from '../components/common/ErrorMessage';
import { SuccessMessage } from '../components/common/SuccessMessage';
import { LoadingSkeleton } from '../components/common/LoadingSkeleton';
import { EmptyState } from '../components/common/EmptyState';
import { useAuth } from '../hooks/useAuth';
import { profileApi } from '../api/profile';
import { User } from '../types/user';

/**
 * Profile Page (FR-024 to FR-027, TC-008)
 * Preset profile picture picker only (no custom upload).
 * Displays in-game ID, username, role/playstyle, and bio.
 */
export const ProfilePage: React.FC = () => {
  const { id } = useParams<{ id?: string }>();
  const { user: currentUser, refreshUser } = useAuth();

  const isSelf = !id || id === currentUser?.id;
  const [profileUser, setProfileUser] = useState<User | null>(
    isSelf ? currentUser : null,
  );
  const [isLoading, setIsLoading] = useState(!isSelf);
  const [isEditing, setIsEditing] = useState(false);

  // Edit form states
  const [presetAvatar, setPresetAvatar] = useState(
    currentUser?.presetProfilePictureRef || '',
  );
  const [inGameId, setInGameId] = useState(currentUser?.inGameId || '');
  const [inGameUsername, setInGameUsername] = useState(currentUser?.inGameUsername || '');
  const [inGameRole, setInGameRole] = useState(currentUser?.inGameRole || '');
  const [bio, setBio] = useState(currentUser?.bio || '');
  const [isSaving, setIsSaving] = useState(false);
  const [feedbackSuccess, setFeedbackSuccess] = useState<string | null>(null);
  const [feedbackError, setFeedbackError] = useState<string | null>(null);

  useEffect(() => {
    if (isSelf) {
      setProfileUser(currentUser);
      if (currentUser) {
        setPresetAvatar(currentUser.presetProfilePictureRef || '');
        setInGameId(currentUser.inGameId || '');
        setInGameUsername(currentUser.inGameUsername || '');
        setInGameRole(currentUser.inGameRole || '');
        setBio(currentUser.bio || '');
      }
    } else if (id) {
      setIsLoading(true);
      profileApi
        .getProfileById(id)
        .then((res) => setProfileUser(res.user))
        .catch(() => setProfileUser(null))
        .finally(() => setIsLoading(false));
    }
  }, [id, isSelf, currentUser]);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setFeedbackSuccess(null);
    setFeedbackError(null);

    try {
      await profileApi.updateProfile({
        presetProfilePictureRef: presetAvatar,
        inGameId: inGameId.trim(),
        inGameUsername: inGameUsername.trim(),
        inGameRole: inGameRole.trim(),
        bio: bio.trim(),
      });
      await refreshUser();
      setFeedbackSuccess('Profile successfully updated.');
      setIsEditing(false);
    } catch (err: unknown) {
      setFeedbackError(
        err instanceof Error ? err.message : 'Could not save profile changes.',
      );
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <PageLayout>
        <LoadingSkeleton height="200px" borderRadius="var(--radius-md)" />
      </PageLayout>
    );
  }

  if (!profileUser) {
    return (
      <PageLayout>
        <EmptyState
          title="User Not Found"
          description="The requested profile does not exist."
        />
      </PageLayout>
    );
  }

  return (
    <PageLayout
      title={
        isSelf ? 'Your Profile' : `${profileUser.inGameUsername || 'User'}'s Profile`
      }
    >
      <div style={{ maxWidth: '780px', margin: '0 auto' }}>
        {feedbackSuccess && (
          <SuccessMessage
            message={feedbackSuccess}
            onDismiss={() => setFeedbackSuccess(null)}
          />
        )}
        {feedbackError && (
          <ErrorMessage
            message={feedbackError}
            onDismiss={() => setFeedbackError(null)}
          />
        )}

        {/* Profile Card View */}
        {!isEditing ? (
          <div className="card" style={{ padding: 'var(--space-xl)' }}>
            <div
              className="flex justify-between items-center"
              style={{
                marginBottom: 'var(--space-lg)',
                flexWrap: 'wrap',
                gap: 'var(--space-sm)',
              }}
            >
              <div className="flex items-center gap-md">
                {/* Profile Avatar Container */}
                <div
                  style={{
                    width: '64px',
                    height: '64px',
                    borderRadius: 'var(--radius-sm)',
                    backgroundColor: 'var(--color-surface-alt)',
                    border: 'var(--border-width) solid var(--color-border)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 800,
                    fontSize: '1.25rem',
                  }}
                >
                  {(profileUser.inGameUsername || profileUser.email)
                    .slice(0, 2)
                    .toUpperCase()}
                </div>

                <div>
                  <h2 style={{ margin: 0, fontSize: '1.4rem' }}>
                    {profileUser.inGameUsername || 'No In-Game Name Set'}
                  </h2>
                  <div className="text-muted" style={{ fontSize: '0.85rem' }}>
                    Registered Role: {profileUser.role} &bull; Email: {profileUser.email}
                  </div>
                </div>
              </div>

              {isSelf && (
                <button
                  type="button"
                  onClick={() => setIsEditing(true)}
                  className="btn btn-primary motion-press"
                >
                  Edit Profile
                </button>
              )}
            </div>

            {/* Profile Fields (FR-025, FR-026, FR-027) */}
            <div
              className="grid grid-cols-1 grid-cols-2-sm gap-md"
              style={{
                padding: 'var(--space-md)',
                backgroundColor: 'var(--color-surface-alt)',
                borderRadius: 'var(--radius-sm)',
                marginBottom: 'var(--space-lg)',
              }}
            >
              <div>
                <span className="text-muted" style={{ fontSize: '0.8rem' }}>
                  In-Game User ID
                </span>
                <div style={{ fontWeight: 600 }}>
                  {profileUser.inGameId || 'Not specified'}
                </div>
              </div>

              <div>
                <span className="text-muted" style={{ fontSize: '0.8rem' }}>
                  In-Game Role / Playstyle
                </span>
                <div style={{ fontWeight: 600 }}>
                  {profileUser.inGameRole || 'Not specified'}
                </div>
              </div>
            </div>

            <div>
              <h4 style={{ marginBottom: 'var(--space-xs)', fontSize: '0.95rem' }}>
                Bio
              </h4>
              <p
                style={{
                  fontSize: '0.95rem',
                  lineHeight: 1.6,
                  color: profileUser.bio
                    ? 'var(--color-text)'
                    : 'var(--color-text-muted)',
                }}
              >
                {profileUser.bio || 'This player has not added a biography yet.'}
              </p>
            </div>
          </div>
        ) : (
          /* Profile Edit Mode */
          <form
            onSubmit={handleSaveProfile}
            className="card"
            style={{ padding: 'var(--space-xl)' }}
          >
            <h2 style={{ fontSize: '1.25rem', marginBottom: 'var(--space-md)' }}>
              Edit Profile Information
            </h2>

            {/* FR-024, TC-008: Preset Avatar Picker Only (No file upload) */}
            <div style={{ marginBottom: 'var(--space-lg)' }}>
              <span
                style={{
                  display: 'block',
                  fontWeight: 500,
                  fontSize: '0.875rem',
                  marginBottom: 'var(--space-xs)',
                }}
              >
                Select a preset profile avatar
              </span>
              <span
                className="text-muted"
                style={{
                  fontSize: '0.8rem',
                  display: 'block',
                  marginBottom: 'var(--space-xs)',
                }}
              >
                Profile avatars can only be chosen from the official presets. Custom image
                uploads are not supported.
              </span>
              <AvatarPicker selectedRef={presetAvatar} onSelect={setPresetAvatar} />
            </div>

            <div
              className="grid grid-cols-1 grid-cols-2-sm gap-md"
              style={{ marginBottom: 'var(--space-md)' }}
            >
              <div>
                <label htmlFor="inGameUsername">In-Game Username *</label>
                <input
                  id="inGameUsername"
                  type="text"
                  required
                  value={inGameUsername}
                  onChange={(e) => setInGameUsername(e.target.value)}
                />
              </div>

              <div>
                <label htmlFor="inGameId">In-Game ID *</label>
                <input
                  id="inGameId"
                  type="text"
                  required
                  value={inGameId}
                  onChange={(e) => setInGameId(e.target.value)}
                />
              </div>
            </div>

            <div style={{ marginBottom: 'var(--space-md)' }}>
              <label htmlFor="inGameRole">In-Game Role / Playstyle</label>
              <input
                id="inGameRole"
                type="text"
                placeholder="e.g. Duelist, Entry Fragger, Sniper, Support"
                value={inGameRole}
                onChange={(e) => setInGameRole(e.target.value)}
              />
            </div>

            <div style={{ marginBottom: 'var(--space-lg)' }}>
              <label htmlFor="bio">Bio</label>
              <textarea
                id="bio"
                rows={4}
                placeholder="Share your competitive background, tournament history, and schedule..."
                value={bio}
                onChange={(e) => setBio(e.target.value)}
              />
            </div>

            <div className="flex justify-between items-center">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="btn btn-outline"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary motion-press"
                disabled={isSaving}
              >
                {isSaving ? 'Saving Changes...' : 'Save Profile'}
              </button>
            </div>
          </form>
        )}
      </div>
    </PageLayout>
  );
};
