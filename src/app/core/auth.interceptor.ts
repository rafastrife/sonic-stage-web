import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('access_token');
  const router = inject(Router);

  let modifiedReq = req;
  
  // Prepend backend URL only if running locally
  if (req.url.startsWith('/api/') && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')) {
    modifiedReq = req.clone({ url: `http://localhost:8000${req.url}` });
  }

  if (token) {
    modifiedReq = modifiedReq.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  return next(modifiedReq).pipe(
    catchError((error) => {
      if (error.status === 401) {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        router.navigate(['/login']);
      }
      return throwError(() => error);
    })
  );
};
