/**
 * MVP Feature Flags
 *
 * To unlock a feature in a future release, move its route
 * from LOCKED_ROUTES to ENABLED_ROUTES (or simply remove it from LOCKED_ROUTES).
 */
export const ENABLED_ROUTES: string[] = [
  '/dashboard',
  '/dashboard/repertoire',
];

export const LOCKED_ROUTES: string[] = [
  '/dashboard/agenda',
  '/dashboard/members',
  '/dashboard/profile',
];

export function isRouteEnabled(path: string): boolean {
  return ENABLED_ROUTES.some(r => path === r || path.startsWith(r + '/'));
}

export function isRouteLocked(path: string): boolean {
  return LOCKED_ROUTES.some(r => path === r || path.startsWith(r + '/'));
}
