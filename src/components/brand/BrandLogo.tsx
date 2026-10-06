import React from 'react';
import { Link } from 'react-router-dom';
import { LOGO_PATH, SITE_NAME } from '../../config/site';

type LogoSize = 'sm' | 'md' | 'lg' | 'xl';

interface BrandLogoProps {
  size?: LogoSize;
  /** Render as a plain image with no link, for places that already sit inside a link. */
  asImage?: boolean;
  onNavigate?: () => void;
  className?: string;
}

const sizeClass: Record<LogoSize, string> = {
  sm: 'is-sm',
  md: '',
  lg: 'is-lg',
  xl: 'is-xl',
};

/**
 * The official Smexstore logo, used unmodified. Height is set by CSS, width follows the
 * asset's own aspect ratio. Clicking it goes to the home page.
 */
export const BrandLogo: React.FC<BrandLogoProps> = ({
  size = 'md',
  asImage = false,
  onNavigate,
  className = '',
}) => {
  const img = (
    <img
      src={LOGO_PATH}
      alt={SITE_NAME}
      className={`brand-logo ${sizeClass[size]} ${className}`.trim()}
      decoding="async"
      fetchPriority="high"
      draggable={false}
    />
  );

  if (asImage) return img;

  return (
    <Link
      to="/"
      className="brand-link"
      aria-label={`${SITE_NAME} home`}
      onClick={onNavigate}
    >
      {img}
    </Link>
  );
};
