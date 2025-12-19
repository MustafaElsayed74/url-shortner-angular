export const API_CONFIG = {
    production: '/api',
    development: 'http://localhost:5050/api'
};

export function getApiUrl(): string {
    // Detect environment based on domain
    if (typeof window !== 'undefined') {
        const hostname = window.location.hostname;
        if (hostname === 'localhost' || hostname === '127.0.0.1') {
            return API_CONFIG.development;
        }
    }
    return API_CONFIG.production;
}
