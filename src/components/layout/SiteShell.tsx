import React, { Suspense, useEffect, useRef } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { WelcomeDialog } from '../welcome/WelcomeDialog';
import { LoadingSkeleton } from '../common/LoadingSkeleton';
import { usePageMeta } from '../../seo/usePageMeta';

const RouteFallback: React.FC = () => (
  <div role="status" aria-label="Loading page">
    <LoadingSkeleton
      height="2rem"
      width="260px"
      style={{ marginBottom: 'var(--space-lg)' }}
    />
    <div className="grid grid-cols-1 grid-cols-3-lg">
      <LoadingSkeleton height="200px" borderRadius="var(--radius-md)" />
      <LoadingSkeleton height="200px" borderRadius="var(--radius-md)" />
      <LoadingSkeleton height="200px" borderRadius="var(--radius-md)" />
    </div>
  </div>
);

/**
 * Persistent frame around every route: skip link, navbar, animated main region, footer and the
 * first-visit welcome dialog.
 */
export const SiteShell: React.FC = () => {
  const { pathname, hash } = useLocation();
  const mainRef = useRef<HTMLElement>(null);
  const isFirstRender = useRef(true);

  usePageMeta(pathname);

  useEffect(() => {
    if (hash) return; // Let in-page anchors scroll natively.
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    // Move keyboard and screen reader position to the new page content.
    mainRef.current?.focus({ preventScroll: true });
  }, [pathname, hash]);

  return (
    <div className="site-shell">
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>
      <Navbar />
      <main id="main-content" ref={mainRef} tabIndex={-1} className="site-main">
        <div key={pathname} className="container route-enter">
          <Suspense fallback={<RouteFallback />}>
            <Outlet />
          </Suspense>
        </div>
      </main>
      <Footer />
      <WelcomeDialog />
    </div>
  );
};
