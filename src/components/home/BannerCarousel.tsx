import React, { useState, useEffect, useCallback } from 'react';
import { BannerItem } from '../../types/content';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { EmptyState } from '../common/EmptyState';
import { toSafeUrl, isExternalUrl } from '../../utils/safeUrl';

interface BannerCarouselProps {
  banners: BannerItem[];
  isLoading?: boolean;
}

/**
 * Banner Carousel (FR-002, ANIM-403)
 * Operates with transform translateX slide ONLY.
 * Banned: Opacity fades (TC-001). Under reduced motion, auto-rotation is disabled (Section 4.6).
 */
export const BannerCarousel: React.FC<BannerCarouselProps> = ({ banners, isLoading }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  const handlePrev = useCallback(() => {
    setCurrentIndex((prev) => (prev === 0 ? banners.length - 1 : prev - 1));
  }, [banners.length]);

  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => (prev === banners.length - 1 ? 0 : prev + 1));
  }, [banners.length]);

  useEffect(() => {
    if (prefersReducedMotion || isPaused || banners.length <= 1) return;

    // 5-second slide interval
    const timer = setInterval(() => {
      handleNext();
    }, 5000);

    return () => clearInterval(timer);
  }, [prefersReducedMotion, isPaused, banners.length, handleNext]);

  if (isLoading) {
    return (
      <div
        className="card"
        style={{
          height: '280px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'var(--color-surface-alt)',
        }}
      >
        <span className="text-muted">Loading announcements</span>
      </div>
    );
  }

  if (banners.length === 0) {
    return (
      <EmptyState
        title="No Current Announcements"
        description="Check back soon for new updates, community tournaments, and posters."
      />
    );
  }

  return (
    <div
      style={{
        position: 'relative',
        overflow: 'hidden',
        borderRadius: 'var(--radius-md)',
        border: 'var(--border-width) solid var(--color-border)',
        backgroundColor: 'var(--color-surface)',
        marginBottom: 'var(--space-xl)',
      }}
      aria-roledescription="carousel"
      aria-label="Community updates and announcements"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocus={() => setIsPaused(true)}
      onBlur={() => setIsPaused(false)}
    >
      {/* Slide track using transform translateX only */}
      <div
        style={{
          display: 'flex',
          transform: `translateX(-${currentIndex * 100}%)`,
          transition: prefersReducedMotion
            ? 'none'
            : 'transform var(--dur-slow) var(--ease-signature)',
          willChange: 'transform',
        }}
      >
        {banners.map((banner, index) => (
          <div
            key={banner.id}
            style={{
              minWidth: '100%',
              flex: '0 0 100%',
              padding: 'var(--space-xl) var(--space-lg)',
              paddingBottom: banners.length > 1 ? '4.5rem' : undefined,
              boxSizing: 'border-box',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              minHeight: '260px',
              backgroundColor: 'var(--color-surface)',
            }}
            role="group"
            aria-roledescription="slide"
            aria-label={`${index + 1} of ${banners.length}`}
            aria-hidden={index !== currentIndex}
            {...(index !== currentIndex ? ({ inert: '' } as Record<string, string>) : {})}
          >
            <div
              className="badge"
              style={{
                alignSelf: 'flex-start',
                marginBottom: 'var(--space-sm)',
                borderColor: 'var(--color-accent)',
                color: 'var(--color-accent)',
              }}
            >
              {banner.type === 'poster' ? 'Poster' : 'Update'}
            </div>
            <h2
              style={{
                fontSize: 'clamp(1.25rem, 1rem + 1.6vw, 1.6rem)',
                marginBottom: 'var(--space-xs)',
              }}
            >
              {banner.title}
            </h2>
            <p
              className="text-muted"
              style={{
                maxWidth: '680px',
                fontSize: '1rem',
                marginBottom: toSafeUrl(banner.linkUrl) ? 'var(--space-md)' : 0,
              }}
            >
              {banner.description}
            </p>
            {toSafeUrl(banner.linkUrl) && (
              <div>
                <a
                  href={toSafeUrl(banner.linkUrl) ?? undefined}
                  {...(isExternalUrl(toSafeUrl(banner.linkUrl) ?? '')
                    ? { target: '_blank', rel: 'noopener noreferrer' }
                    : {})}
                  className="btn btn-primary motion-press"
                  style={{ alignSelf: 'flex-start' }}
                >
                  View Announcement
                </a>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Manual Controls */}
      {banners.length > 1 && (
        <div
          className="flex justify-between items-center"
          style={{
            position: 'absolute',
            bottom: 'var(--space-md)',
            right: 'var(--space-md)',
            gap: 'var(--space-xs)',
          }}
        >
          <button
            type="button"
            onClick={handlePrev}
            className="btn btn-secondary motion-press"
            style={{ padding: '4px 10px', fontSize: '0.8rem' }}
            aria-label="Previous banner"
          >
            Prev
          </button>
          <span
            className="tabular-nums text-muted"
            style={{ fontSize: '0.8rem', padding: '0 4px' }}
          >
            {currentIndex + 1} / {banners.length}
          </span>
          <button
            type="button"
            onClick={handleNext}
            className="btn btn-secondary motion-press"
            style={{ padding: '4px 10px', fontSize: '0.8rem' }}
            aria-label="Next banner"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};
