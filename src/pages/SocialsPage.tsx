import React, { useState, useEffect } from 'react';
import { PageLayout } from '../components/layout/PageLayout';
import { EmptyState } from '../components/common/EmptyState';
import { LoadingSkeleton } from '../components/common/LoadingSkeleton';
import { contentApi } from '../api/content';
import { SocialLinkItem } from '../types/content';
import { toSafeUrl } from '../utils/safeUrl';

/**
 * Social Media Links Page (FR-070)
 * Lists all official owner community and social links.
 */
export const SocialsPage: React.FC = () => {
  const [socials, setSocials] = useState<SocialLinkItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    contentApi
      .getSocialLinks()
      .then((res) => {
        if (isMounted) {
          setSocials(res.socials || []);
          setIsLoading(false);
        }
      })
      .catch((err: unknown) => {
        if (isMounted) {
          setError(err instanceof Error ? err.message : 'Could not fetch social links.');
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <PageLayout title="Official Social Links">
      <div style={{ maxWidth: '640px', margin: '0 auto' }}>
        <p className="text-muted" style={{ marginBottom: 'var(--space-xl)' }}>
          Follow Smexstore on its official channels for announcements and community
          discussion.
        </p>

        {isLoading ? (
          <div className="flex flex-col gap-md">
            {[1, 2, 3].map((i) => (
              <LoadingSkeleton key={i} height="70px" borderRadius="var(--radius-sm)" />
            ))}
          </div>
        ) : error || socials.length === 0 ? (
          <EmptyState
            title="Social Links Not Available"
            description="Official social media links will be published once configured by the platform owner."
          />
        ) : (
          <div className="flex flex-col gap-md">
            {socials
              .filter((link) => toSafeUrl(link.url) !== null)
              .map((link) => (
                <a
                  key={link.id}
                  href={toSafeUrl(link.url) ?? undefined}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="card motion-card-lift flex justify-between items-center"
                  style={{
                    padding: 'var(--space-md) var(--space-lg)',
                    textDecoration: 'none',
                    color: 'var(--color-text)',
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '1.05rem' }}>
                      {link.platform}
                    </div>
                    <div className="text-muted" style={{ fontSize: '0.85rem' }}>
                      {link.handle}
                    </div>
                  </div>
                  <span
                    className="btn btn-secondary"
                    style={{ padding: '6px 12px', fontSize: '0.85rem' }}
                  >
                    Visit channel
                  </span>
                </a>
              ))}
          </div>
        )}
      </div>
    </PageLayout>
  );
};
