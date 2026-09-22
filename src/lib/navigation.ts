/**
 * CineTrack Navigation & GitHub Pages Path Resolver
 * Handles base path: /CineTrack-web/ on GitHub Pages, or / when hosted at root.
 */

export type AppRoute = 'home' | 'updates' | 'reset-password';

/**
 * Returns the detected repository base path (e.g. "/CineTrack-web" or "")
 */
export function getBasePath(): string {
  if (typeof window === 'undefined') return '';
  const pathname = window.location.pathname;
  if (pathname.startsWith('/CineTrack-web')) {
    return '/CineTrack-web';
  }
  return '';
}

/**
 * Resolves an internal route to the correct URL pathname
 */
export function getRouteUrl(route: AppRoute): string {
  const base = getBasePath();
  switch (route) {
    case 'home':
      return base ? `${base}/` : './';
    case 'updates':
      return base ? `${base}/updates/` : './updates/';
    case 'reset-password':
      return base ? `${base}/reset-password/` : './reset-password/';
    default:
      return base ? `${base}/` : './';
  }
}

/**
 * Detects the current active route from the window URL
 */
export function getCurrentRoute(): AppRoute {
  if (typeof window === 'undefined') return 'home';

  const pathname = window.location.pathname.toLowerCase();
  const search = window.location.search.toLowerCase();
  const hash = window.location.hash.toLowerCase();

  // Check search query ?p=... (from 404.html redirect) or ?page=...
  const urlParams = new URLSearchParams(window.location.search);
  const pParam = urlParams.get('p')?.toLowerCase() || '';

  if (pParam.includes('updates')) {
    return 'updates';
  }
  if (pParam.includes('reset-password')) {
    return 'reset-password';
  }

  if (search.includes('page=updates') || hash.includes('/updates') || hash.includes('updates')) {
    return 'updates';
  }
  if (search.includes('page=reset-password') || hash.includes('/reset-password') || hash.includes('reset-password')) {
    return 'reset-password';
  }

  // Check URL pathname
  if (pathname.includes('/updates')) {
    return 'updates';
  }
  if (pathname.includes('/reset-password')) {
    return 'reset-password';
  }

  return 'home';
}

/**
 * Navigate to a route programmatically using pushState
 */
export function navigateTo(route: AppRoute) {
  if (typeof window === 'undefined') return;
  const targetUrl = getRouteUrl(route);
  
  try {
    window.history.pushState({ route }, '', targetUrl);
    window.dispatchEvent(new PopStateEvent('popstate', { state: { route } }));
  } catch {
    window.location.href = targetUrl;
  }
}
