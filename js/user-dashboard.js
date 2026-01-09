requireAuth('USER');

const API_BASE = 'http://localhost:5000/api';
const PROXY_URL = 'ahrefs-placeholder.html'; // Placeholder page - replace with actual proxy URL when ready

function getAuthHeaders() {
    return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
    };
}

async function useTool() {
    try {
        const response = await fetch(`${API_BASE}/tool/use`, {
            method: 'POST',
            headers: getAuthHeaders()
        });
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to use tool');
        }
        
        const data = await response.json();
        
        // Update UI immediately
        document.getElementById('keywordsUsed').textContent = data.keywordUsed || 0;
        document.getElementById('keywordsRemaining').textContent = data.remaining || 0;
        
        // Check if limit reached
        if (data.remaining === 0) {
            document.getElementById('limitBlocked').style.display = 'block';
            document.getElementById('ahrefsFrame').style.display = 'none';
        }
        
        return data;
    } catch (error) {
        console.error('Tool usage error:', error);
        return null;
    }
}

async function loadUserData() {
    const loadingIndicator = document.getElementById('loadingIndicator');
    const errorMessage = document.getElementById('errorMessage');
    const keywordsUsed = document.getElementById('keywordsUsed');
    const keywordsRemaining = document.getElementById('keywordsRemaining');
    const totalLimit = document.getElementById('totalLimit');
    const iframe = document.getElementById('ahrefsFrame');
    const limitBlocked = document.getElementById('limitBlocked');

    try {
        loadingIndicator.style.display = 'block';
        errorMessage.style.display = 'none';
        limitBlocked.style.display = 'none';

        // Get full user data including dates and status
        const response = await fetch(`${API_BASE}/auth/me`, {
            headers: getAuthHeaders()
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to load user data');
        }

        const data = await response.json();

        if (data.user) {
            const user = data.user;
            const used = user.keywordUsed || 0;
            const limit = user.keywordLimit || 0;
            const remaining = Math.max(0, limit - used);

            keywordsUsed.textContent = used;
            keywordsRemaining.textContent = remaining;
            totalLimit.textContent = limit;

            // Check account status
            if (!user.isActive) {
                errorMessage.textContent = 'Your account is inactive. Please contact your administrator.';
                errorMessage.style.display = 'block';
                iframe.style.display = 'none';
                limitBlocked.style.display = 'none';
                loadingIndicator.style.display = 'none';
                return;
            }

            // Check subscription dates
            const now = new Date();
            const startDate = user.startDate ? new Date(user.startDate) : null;
            const expireDate = user.expireDate ? new Date(user.expireDate) : null;

            if (startDate && now < startDate) {
                errorMessage.textContent = 'Service has not started yet.';
                errorMessage.style.display = 'block';
                iframe.style.display = 'none';
                limitBlocked.style.display = 'none';
                loadingIndicator.style.display = 'none';
                return;
            }

            if (expireDate && now > expireDate) {
                errorMessage.textContent = 'Your subscription has expired. Please contact your administrator.';
                errorMessage.style.display = 'block';
                iframe.style.display = 'none';
                limitBlocked.style.display = 'none';
                loadingIndicator.style.display = 'none';
                return;
            }

            // Check keyword limit
            if (limit === 0 || remaining === 0) {
                limitBlocked.style.display = 'block';
                iframe.style.display = 'none';
                loadingIndicator.style.display = 'none';
                return;
            }

            // All checks passed - load iframe
            limitBlocked.style.display = 'none';
            errorMessage.style.display = 'none';
            
            if (!PROXY_URL || PROXY_URL === 'https://yourdomain.com/proxy/ahrefs') {
                // Proxy URL not configured
                errorMessage.textContent = 'Ahrefs tool proxy URL is not configured. Please contact your administrator.';
                errorMessage.style.display = 'block';
                iframe.style.display = 'none';
                loadingIndicator.style.display = 'none';
                return;
            }
            
            iframe.src = PROXY_URL;
            iframe.style.display = 'block';
            
            // Add timeout for iframe loading
            let loadTimeout = setTimeout(() => {
                loadingIndicator.style.display = 'none';
                errorMessage.textContent = 'Ahrefs tool is taking too long to load. Please check your connection or contact support.';
                errorMessage.style.display = 'block';
            }, 30000); // 30 second timeout
            
            iframe.onload = async () => {
                clearTimeout(loadTimeout);
                loadingIndicator.style.display = 'none';
                // Only increment usage if it's not the placeholder page
                if (PROXY_URL !== 'ahrefs-placeholder.html') {
                    await useTool();
                }
            };
            
            iframe.onerror = () => {
                clearTimeout(loadTimeout);
                loadingIndicator.style.display = 'none';
                errorMessage.textContent = 'Failed to load Ahrefs tool. Please check your connection or contact support.';
                errorMessage.style.display = 'block';
            };
        } else {
            throw new Error('Invalid user data received');
        }
    } catch (error) {
        errorMessage.textContent = error.message || 'Failed to connect to server. Please try again later.';
        errorMessage.style.display = 'block';
        loadingIndicator.style.display = 'none';
    }
}

async function loadBranding() {
    try {
        const response = await fetch(`${API_BASE}/branding`, {
            headers: getAuthHeaders()
        });
        const data = await response.json();
        if (response.ok && data.text) {
            document.getElementById('brandingText').textContent = data.text;
        } else {
            document.getElementById('brandingText').textContent = 'This service is used by XYZ';
        }
    } catch (error) {
        document.getElementById('brandingText').textContent = 'This service is used by XYZ';
    }
}

async function fetchCookies() {
    try {
        const response = await fetch(`${API_BASE}/admin/cookies/user`, {
            headers: getAuthHeaders()
        });
        if (response.ok) {
            const data = await response.json();
            // Cookies are available for proxy injection
            // Actual injection happens server-side via proxy URL
            return data.cookies;
        }
    } catch (error) {
        console.error('Cookie fetch error:', error);
    }
    return null;
}

loadUserData();
loadBranding();
fetchCookies();

