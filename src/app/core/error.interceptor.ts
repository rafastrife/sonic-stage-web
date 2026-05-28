import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req).pipe(
    catchError((error) => {
      // Don't alert for 401, as auth interceptor handles it
      if (error.status !== 401) {
        let errorMsg = 'An unexpected error occurred.';
        if (error.error instanceof ErrorEvent) {
          errorMsg = `Error: ${error.error.message}`;
        } else if (error.error && error.error.detail) {
          errorMsg = error.error.detail;
        } else if (error.status) {
          errorMsg = `Server returned code ${error.status}`;
        }
        
        // Em um cenário de produção, usaria um Toast/Snackbar component.
        console.error('Global Error Caught:', errorMsg, error);
      }
      return throwError(() => error);
    })
  );
};
