import { TestBed } from '@angular/core/testing';
import { provideRouter, Router, UrlTree } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { authGuard } from './auth.guard';

function makeToken(payload: Record<string, unknown>): string {
  const header = btoa(JSON.stringify({ alg: 'none', typ: 'JWT' }));
  const body = btoa(JSON.stringify(payload));
  return `${header}.${body}.signature`;
}

describe('authGuard', () => {
  const dummyRoute = {} as any;
  const dummyState = { url: '/dashboard/repertoire' } as any;

  beforeEach(() => {
    localStorage.removeItem('access_token');
    TestBed.configureTestingModule({
      providers: [provideRouter([]), provideHttpClient()]
    });
  });

  afterEach(() => {
    localStorage.removeItem('access_token');
  });

  it('redirects to /login with the attempted url when there is no token', () => {
    const result = TestBed.runInInjectionContext(() => authGuard(dummyRoute, dummyState));

    expect(result instanceof UrlTree).toBeTrue();
    const router = TestBed.inject(Router);
    expect(router.serializeUrl(result as UrlTree)).toBe('/login?redirect=%2Fdashboard%2Frepertoire');
  });

  it('redirects to /login when the token exp is in the past', () => {
    localStorage.setItem('access_token', makeToken({ user_id: 1, exp: Math.floor(Date.now() / 1000) - 60 }));

    const result = TestBed.runInInjectionContext(() => authGuard(dummyRoute, dummyState));

    expect(result instanceof UrlTree).toBeTrue();
  });

  it('allows navigation when the token is valid', () => {
    localStorage.setItem('access_token', makeToken({ user_id: 1, exp: Math.floor(Date.now() / 1000) + 3600 }));

    const result = TestBed.runInInjectionContext(() => authGuard(dummyRoute, dummyState));

    expect(result).toBeTrue();
  });
});
