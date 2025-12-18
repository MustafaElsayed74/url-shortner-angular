import { Injectable } from '@angular/core';
import {
    HttpRequest,
    HttpHandler,
    HttpEvent,
    HttpInterceptor,
    HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
    intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
        // Add credentials and headers for CORS requests
        const modifiedRequest = request.clone({
            withCredentials: false,
            headers: request.headers.set('Content-Type', 'application/json')
        });

        return next.handle(modifiedRequest).pipe(
            catchError((error: HttpErrorResponse) => {
                console.error('HTTP Error:', error);

                // Better error messages for network errors
                if (error.status === 0) {
                    console.error('Network error or CORS issue. Error details:', {
                        statusCode: error.status,
                        statusText: error.statusText,
                        url: error.url,
                        message: 'Unable to reach the API server. Please check if the backend is running and accessible.'
                    });
                }

                return throwError(() => error);
            })
        );
    }
}
