import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { LoadingSkeleton } from '../common/LoadingSkeleton';

interface RoleGuardProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

/**
 * Client-Side Route and Role Guard (SEC-009, ADM-001)
 * NOTE: Frontend route guards protect UI views only;
 * real authorization MUST be enforced on the backend server for every API endpoint (API-014).
 */
export const RoleGuard: React.FC<RoleGuardProps> = ({
  children,
  requireAdmin = false,
}) => {
  const { user, isAuthenticated, isAdmin, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="container" style={{ padding: 'var(--space-2xl) 0' }}>
        <LoadingSkeleton
          height="40px"
          width="300px"
          style={{ marginBottom: 'var(--space-md)' }}
        />
        <LoadingSkeleton height="200px" />
      </div>
    );
  }

  if (!isAuthenticated) {
    // Redirect to login preserving destination
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requireAdmin && !isAdmin) {
    // Normal user attempting to access admin route
    return (
      <div className="container" style={{ padding: 'var(--space-2xl) 0' }}>
        <div
          className="card"
          style={{
            maxWidth: '540px',
            margin: '0 auto',
            textAlign: 'center',
            borderColor: 'var(--color-error)',
          }}
        >
          <h2 style={{ color: 'var(--color-error)' }}>Access Restricted</h2>
          <p className="text-muted" style={{ margin: 'var(--space-md) 0' }}>
            Elevated administrative privileges are required to view this area (Current
            role: <strong>{user?.role}</strong>).
          </p>
          <a href="/" className="btn btn-secondary">
            Return to Home
          </a>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
