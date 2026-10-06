import React from 'react';
import { Link } from 'react-router-dom';

export interface Crumb {
  label: string;
  to?: string;
}

/** Breadcrumb trail. The last crumb is the current page and is not a link. */
export const Breadcrumbs: React.FC<{ items: Crumb[] }> = ({ items }) => (
  <nav className="breadcrumbs" aria-label="Breadcrumb">
    <ol>
      {items.map((item, i) => {
        const isLast = i === items.length - 1;
        return (
          <li key={`${item.label}-${i}`}>
            {isLast || !item.to ? (
              <span aria-current={isLast ? 'page' : undefined}>{item.label}</span>
            ) : (
              <Link to={item.to}>{item.label}</Link>
            )}
          </li>
        );
      })}
    </ol>
  </nav>
);
