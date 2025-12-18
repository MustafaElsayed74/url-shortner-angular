import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, timeout } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class HealthCheckService {
    constructor(private http: HttpClient) { }

    checkApiHealth(apiUrl: string): Observable<any> {
        // Try to reach the API root endpoint
        return this.http.get(`${apiUrl.replace('/urls', '')}/health`, {
            responseType: 'text'
        }).pipe(
            timeout(5000),
            catchError((error: HttpErrorResponse) => {
                console.error('API Health Check Failed:', {
                    status: error.status,
                    statusText: error.statusText,
                    url: error.url,
                    message: error.message
                });
                return of({ status: 'offline', error: error.message });
            })
        );
    }

    diagnosticInfo(): { [key: string]: string } {
        const info: { [key: string]: string } = {
            'Current URL': typeof window !== 'undefined' ? window.location.href : 'N/A',
            'Hostname': typeof window !== 'undefined' ? window.location.hostname : 'N/A',
            'Protocol': typeof window !== 'undefined' ? window.location.protocol : 'N/A',
            'Expected API': 'https://www.urlshort.somee.com/api'
        };

        return info;
    }
}
