// API Base URL - auto-detect based on environment
const getApiBase = () => {
    // In production, use current hostname; in development, use localhost
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        return 'http://localhost:5000/api';
    }
    // Production: use same origin (same domain)
    return `${window.location.protocol}//${window.location.host}/api`;
};

const API_BASE = getApiBase();
