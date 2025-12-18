import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { getApiUrl } from '../config/api.config';

export interface UrlRequest {
    url: string;
    expiresAt?: string;
}

export interface UrlResponse {
    originalUrl: string;
    shortLink: string;
    expiresAt?: string;
}

export interface UrlErrorResponse {
    status: number;
    error: string;
}

@Injectable({
    providedIn: 'root'
})
export class UrlService {
    private apiUrl = `${getApiUrl()}/urls`;

    constructor(private http: HttpClient) { }

    shortenUrl(url: string, expiresAt?: string): Observable<UrlResponse> {
        const request: UrlRequest = {
            url,
            ...(expiresAt && { expiresAt })
        };
        return this.http.post<UrlResponse>(`${this.apiUrl}/generate`, request);
    }

    redirectToOriginal(shortLink: string): Observable<any> {
        return this.http.get<any>(`${this.apiUrl}/${shortLink}`);
    }
}

