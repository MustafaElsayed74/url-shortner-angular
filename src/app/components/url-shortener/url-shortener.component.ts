import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UrlService, UrlResponse } from '../../services/url.service';

@Component({
    selector: 'app-url-shortener',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './url-shortener.component.html',
    styleUrl: './url-shortener.component.css'
})
export class UrlShortenerComponent {
    originalUrl = signal('');
    shortLink = signal('');
    fullShortUrl = signal('');
    loading = signal(false);
    error = signal('');
    success = signal(false);
    copySuccess = signal(false);
    expiresAt = signal('');
    showAdvanced = signal(false);
    private baseUrl = 'http://www.urlshort.somee.com/';

    constructor(private urlService: UrlService) { }

    shortenUrl() {
        if (!this.isValidUrl(this.originalUrl())) {
            this.error.set('Please enter a valid URL');
            return;
        }

        this.loading.set(true);
        this.error.set('');
        this.success.set(false);
        this.copySuccess.set(false);

        this.urlService.shortenUrl(this.originalUrl(), this.expiresAt() || undefined).subscribe({
            next: (response: UrlResponse) => {
                // Backend returns OriginalUrl, ShortLink, ExpiresAt
                this.shortLink.set(response.shortLink);
                this.fullShortUrl.set(this.baseUrl + response.shortLink);
                this.success.set(true);
                this.loading.set(false);
            },
            error: (error) => {
                // Handle error response from backend
                const errorMessage = error.error?.error || error.error?.message || 'Failed to shorten URL. Please try again.';
                this.error.set(errorMessage);
                this.loading.set(false);
                console.error('Error shortening URL:', error);
            }
        });
    }

    copyToClipboard() {
        if (this.fullShortUrl()) {
            navigator.clipboard.writeText(this.fullShortUrl()).then(() => {
                this.copySuccess.set(true);
                setTimeout(() => this.copySuccess.set(false), 2000);
            });
        }
    }

    isValidUrl(url: string): boolean {
        try {
            new URL(url);
            return true;
        } catch {
            return false;
        }
    }

    reset() {
        this.originalUrl.set('');
        this.shortLink.set('');
        this.fullShortUrl.set('');
        this.expiresAt.set('');
        this.error.set('');
        this.success.set(false);
        this.copySuccess.set(false);
        this.showAdvanced.set(false);
    }

    getMinDateTime(): string {
        const now = new Date();
        now.setMinutes(now.getMinutes() + 1);
        return now.toISOString().slice(0, 16);
    }

    toggleAdvanced() {
        this.showAdvanced.set(!this.showAdvanced());
    }

    navigateToShort() {
        if (this.fullShortUrl()) {
            window.open(this.fullShortUrl(), '_blank');
        }
    }
}