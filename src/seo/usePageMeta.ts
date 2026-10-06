import { useEffect } from 'react';
import { getRouteMeta } from './routeMeta';
import { SITE_URL } from '../config/site';

function setMeta(
  selector: string,
  attr: 'name' | 'property',
  key: string,
  content: string,
): void {
  let el = document.head.querySelector<HTMLMetaElement>(selector);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

/** Keeps title, description, canonical, social tags and robots in sync with the current route. */
export function usePageMeta(pathname: string): void {
  useEffect(() => {
    const meta = getRouteMeta(pathname);
    const clean = pathname.length > 1 ? pathname.replace(/\/+$/, '') : pathname;
    const url = `${SITE_URL}${clean === '/' ? '' : clean}`;

    document.title = meta.title;
    setMeta('meta[name="description"]', 'name', 'description', meta.description);
    setMeta(
      'meta[name="robots"]',
      'name',
      'robots',
      meta.noindex ? 'noindex, nofollow' : 'index, follow',
    );
    setMeta('meta[property="og:title"]', 'property', 'og:title', meta.title);
    setMeta(
      'meta[property="og:description"]',
      'property',
      'og:description',
      meta.description,
    );
    setMeta('meta[property="og:url"]', 'property', 'og:url', url);
    setMeta('meta[name="twitter:title"]', 'name', 'twitter:title', meta.title);
    setMeta(
      'meta[name="twitter:description"]',
      'name',
      'twitter:description',
      meta.description,
    );

    let canonical = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.rel = 'canonical';
      document.head.appendChild(canonical);
    }
    canonical.href = url;
  }, [pathname]);
}
