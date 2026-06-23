import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { isRouteLocked } from '../config/feature-flags';

/**
 * Redirects to /dashboard/repertoire if the user tries to access a locked route
 * directly via the address bar or a bookmark.
 */
export const mvpGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const url = state.url.split('?')[0]; // strip query params

  if (isRouteLocked(url)) {
    return router.createUrlTree(['/dashboard/repertoire']);
  }

  return true;
};
