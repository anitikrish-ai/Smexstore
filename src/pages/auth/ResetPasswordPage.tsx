import React, { useState } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { PageLayout } from '../../components/layout/PageLayout';
import { BrandLogo } from '../../components/brand/BrandLogo';
import { PasswordInput } from '../../components/common/PasswordInput';
import { ErrorMessage } from '../../components/common/ErrorMessage';
import { authApi } from '../../api/auth';

/**
 * Reset Password Page (AUTH-003, SEC-003, UX-003)
 * Sets new password using token with show/hide password toggle.
 */
export const ResetPasswordPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') || '';
  const navigate = useNavigate();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(
    token ? null : 'No password reset token provided.',
  );
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }

    setIsSubmitting(true);
    try {
      await authApi.resetPassword({
        token,
        newPassword: password,
      });
      setIsSuccess(true);
      setTimeout(() => navigate('/login'), 2000);
    } catch (err: unknown) {
      setError(
        err instanceof Error ? err.message : 'Invalid or expired password reset link.',
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <PageLayout>
      <div style={{ maxWidth: '440px', margin: 'var(--space-xl) auto' }}>
        <div className="card card-accent" style={{ padding: 'var(--space-xl)' }}>
          <div style={{ marginBottom: 'var(--space-md)' }}>
            <BrandLogo size="lg" />
          </div>

          <h1 style={{ fontSize: '1.4rem', marginBottom: 'var(--space-xs)' }}>
            Choose New Password
          </h1>
          <p
            className="text-muted"
            style={{ fontSize: '0.85rem', marginBottom: 'var(--space-lg)' }}
          >
            Enter your new password below.
          </p>

          {error && <ErrorMessage message={error} onDismiss={() => setError(null)} />}

          {isSuccess ? (
            <div
              style={{
                padding: 'var(--space-md)',
                backgroundColor: 'var(--color-surface-alt)',
                border: 'var(--border-width) solid var(--color-success)',
                borderRadius: 'var(--radius-sm)',
                textAlign: 'center',
              }}
            >
              <h3
                style={{ color: 'var(--color-success)', marginBottom: 'var(--space-xs)' }}
              >
                Password Updated
              </h3>
              <p className="text-muted" style={{ fontSize: '0.85rem' }}>
                Your password has been reset successfully. Redirecting to login...
              </p>
              <Link
                to="/login"
                className="btn btn-primary"
                style={{ marginTop: 'var(--space-sm)' }}
              >
                Sign In Now
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <PasswordInput
                id="reset-new-password"
                name="newPassword"
                label="New Password"
                required
                placeholder="At least 8 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              <PasswordInput
                id="reset-confirm-password"
                name="confirmPassword"
                label="Confirm New Password"
                required
                placeholder="Repeat password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />

              <button
                type="submit"
                className="btn btn-primary motion-press"
                disabled={isSubmitting || !token}
                style={{ width: '100%', marginBottom: 'var(--space-md)' }}
              >
                {isSubmitting ? 'Updating...' : 'Set New Password'}
              </button>

              <div style={{ textAlign: 'center', fontSize: '0.85rem' }}>
                <Link to="/login" className="inline-link">Cancel & Return to Login</Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </PageLayout>
  );
};
