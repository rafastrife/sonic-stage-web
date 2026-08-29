/**
 * MVP Feature Flags
 *
 * To unlock a feature in a future release, move its route
 * from LOCKED_ROUTES to ENABLED_ROUTES (or simply remove it from LOCKED_ROUTES).
 */
export const ENABLED_ROUTES: string[] = [
  '/dashboard',
  '/dashboard/repertoire',
  '/dashboard/members',
  '/dashboard/agenda',
  '/dashboard/profile',
];

export const LOCKED_ROUTES: string[] = [];

export function isRouteEnabled(path: string): boolean {
  return ENABLED_ROUTES.some(r => path === r || path.startsWith(r + '/'));
}

export function isRouteLocked(path: string): boolean {
  return LOCKED_ROUTES.some(r => path === r || path.startsWith(r + '/'));
}
