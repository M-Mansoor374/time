function requireAuth(requiredRole) {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');

    if (!token) {
        window.location.href = 'login.html';
        return;
    }

    if (role !== requiredRole) {
        document.body.innerHTML = '<div class="container"><div class="error-card"><h1>Access Denied</h1><p>You do not have permission to access this page.</p><button onclick="logout()" class="btn-primary">Go to Login</button></div></div>';
        return;
    }
}

function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    window.location.href = 'login.html';
}

