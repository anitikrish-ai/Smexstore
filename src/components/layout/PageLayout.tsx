import React from 'react';

interface PageLayoutProps {
  children: React.ReactNode;
  title?: string;
  action?: React.ReactNode;
}

/**
 * Page content frame: optional title row with an action slot.
 * The navbar, footer, skip link and route transition live in SiteShell, so they persist across
 * navigation instead of remounting on every page.
 */
export const PageLayout: React.FC<PageLayoutProps> = ({ children, title, action }) => {
  return (
    <>
      {title && (
        <div className="page-header">
          <h1>{title}</h1>
          {action && <div className="page-header-action">{action}</div>}
        </div>
      )}
      {children}
    </>
  );
};
