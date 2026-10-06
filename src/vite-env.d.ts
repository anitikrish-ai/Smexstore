/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Base URL of the backend API. Leave empty until the backend exists. */
  readonly VITE_API_BASE_URL?: string;
  /** Public origin of the site, used for canonical URLs, sitemap and robots. */
  readonly VITE_SITE_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
