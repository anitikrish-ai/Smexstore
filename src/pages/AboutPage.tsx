import React, { useState, useEffect } from 'react';
import { PageLayout } from '../components/layout/PageLayout';
import { LoadingSkeleton } from '../components/common/LoadingSkeleton';
import { EmptyState } from '../components/common/EmptyState';
import { contentApi } from '../api/content';
import { AboutUsInfo } from '../types/content';
import { toSafeUrl } from '../utils/safeUrl';

/**
 * About Us Page (FR-071)
 * Platform mission statement, owner credentials, and contact details.
 */
export const AboutPage: React.FC = () => {
  const [about, setAbout] = useState<AboutUsInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    contentApi
      .getAboutUs()
      .then((res) => {
        if (isMounted) {
          setAbout(res);
          setIsLoading(false);
        }
      })
      .catch(() => {
        if (isMounted) {
          setAbout(null);
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <PageLayout title="About Smexstore">
      <div style={{ maxWidth: '780px', margin: '0 auto' }}>
        {isLoading ? (
          <div className="flex flex-col gap-md">
            <LoadingSkeleton height="160px" />
            <LoadingSkeleton height="200px" />
          </div>
        ) : !about ? (
          <EmptyState
            title="About Information Pending"
            description="The owner biography and platform mission statement will be populated shortly."
          />
        ) : (
          <div className="card" style={{ padding: 'var(--space-xl)' }}>
            <h2 style={{ fontSize: '1.4rem', marginBottom: 'var(--space-sm)' }}>
              Mission & Community Standards
            </h2>
            <p
              style={{
                lineHeight: 1.7,
                fontSize: '1rem',
                marginBottom: 'var(--space-lg)',
              }}
            >
              {about.missionStatement}
            </p>

            <div
              style={{
                padding: 'var(--space-md)',
                backgroundColor: 'var(--color-surface-alt)',
                borderRadius: 'var(--radius-sm)',
                marginBottom: 'var(--space-lg)',
                border: 'var(--border-width) solid var(--color-border)',
              }}
            >
              <h3 style={{ fontSize: '1.05rem', marginBottom: 'var(--space-xs)' }}>
                Platform Leadership
              </h3>
              <p className="text-muted" style={{ margin: 0, fontSize: '0.9rem' }}>
                Founded in {about.foundedYear} by <strong>{about.ownerName}</strong>.
              </p>
            </div>

            <h3 style={{ fontSize: '1.1rem', marginBottom: 'var(--space-xs)' }}>
              Platform Overview
            </h3>
            <p
              style={{
                lineHeight: 1.6,
                fontSize: '0.95rem',
                marginBottom: 'var(--space-lg)',
              }}
            >
              {about.description}
            </p>

            <div
              style={{
                borderTop: 'var(--border-width) solid var(--color-border)',
                paddingTop: 'var(--space-md)',
              }}
            >
              <span className="text-muted" style={{ fontSize: '0.85rem' }}>
                Contact email
              </span>
              <div style={{ fontWeight: 600 }}>
                <a href={toSafeUrl(`mailto:${about.contactEmail}`) ?? undefined}>
                  {about.contactEmail}
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </PageLayout>
  );
};
