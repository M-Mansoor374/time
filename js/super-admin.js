requireAuth('SUPER_ADMIN');

// API_BASE is loaded from config.js (must be loaded before this file)

function getAuthHeaders() {
    return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
    };
}

async function loadUsers() {
    try {
        const response = await fetch(`${API_BASE}/users`, {
            headers: getAuthHeaders()
        });
        const data = await response.json();
        if (response.ok) {
            renderUsers(data.users || []);
        }
    } catch (error) {
        console.error('Failed to load users:', error);
    }
}

function renderUsers(users) {
    const tbody = document.getElementById('usersTableBody');
    const cardsContainer = document.getElementById('usersCards');
    
    // Render table for desktop
    tbody.innerHTML = users.map(user => `
        <tr>
            <td>${user.name || '-'}</td>
            <td>${user.email}</td>
            <td>${user.role}</td>
            <td><span class="status ${user.isActive ? 'active' : 'inactive'}">${user.isActive ? 'Active' : 'Inactive'}</span></td>
            <td>${user.keywordUsed || 0}</td>
            <td>${user.keywordsLeft || 0}</td>
            <td>${user.startDate ? new Date(user.startDate).toLocaleDateString() : '-'}</td>
            <td>${user.expireDate ? new Date(user.expireDate).toLocaleDateString() : '-'}</td>
            <td>
                <button onclick="deleteUser('${user.id || user._id}')" class="btn-danger">Delete</button>
            </td>
        </tr>
    `).join('');
    
    // Render cards for mobile
    if (cardsContainer) {
        cardsContainer.innerHTML = users.map(user => `
            <div class="user-card">
                <div class="user-card-header">
                    <div>
                        <h3 class="user-card-name">${user.name || '-'}</h3>
                        <p class="user-card-email">${user.email}</p>
                    </div>
                    <span class="status ${user.isActive ? 'active' : 'inactive'}">${user.isActive ? 'Active' : 'Inactive'}</span>
                </div>
                <div class="user-card-body">
                    <div class="user-card-field">
                        <span class="user-card-label">Role</span>
                        <span class="user-card-value">${user.role}</span>
                    </div>
                    <div class="user-card-field">
                        <span class="user-card-label">Keywords Used</span>
                        <span class="user-card-value">${user.keywordUsed || 0}</span>
                    </div>
                    <div class="user-card-field">
                        <span class="user-card-label">Keywords Left</span>
                        <span class="user-card-value">${user.keywordsLeft || 0}</span>
                    </div>
                    <div class="user-card-field">
                        <span class="user-card-label">Start Date</span>
                        <span class="user-card-value">${user.startDate ? new Date(user.startDate).toLocaleDateString() : '-'}</span>
                    </div>
                    <div class="user-card-field">
                        <span class="user-card-label">Expire Date</span>
                        <span class="user-card-value">${user.expireDate ? new Date(user.expireDate).toLocaleDateString() : '-'}</span>
                    </div>
                </div>
                <div class="user-card-actions">
                    <button onclick="deleteUser('${user.id || user._id}')" class="btn-danger">Delete</button>
                </div>
            </div>
        `).join('');
    }
}

function openModal(type) {
    const modal = document.getElementById(`${type}Modal`);
    if (modal) {
        modal.style.display = 'block';
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

function closeModal(type) {
    const modal = document.getElementById(`${type}Modal`);
    if (modal) {
        modal.style.display = 'none';
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
    const form = document.getElementById(`${type}Form`);
    const errorDiv = document.getElementById(`${type}Error`);
    if (form) form.reset();
    if (errorDiv) errorDiv.textContent = '';
}

// Mobile Menu Functions
function toggleMobileMenu() {
    const overlay = document.getElementById('mobileMenuOverlay');
    const hamburger = document.querySelector('.hamburger-menu');
    if (overlay) {
        overlay.classList.toggle('active');
        if (hamburger) {
            hamburger.classList.toggle('active');
        }
        document.body.style.overflow = overlay.classList.contains('active') ? 'hidden' : '';
    }
}

function closeMobileMenu() {
    const overlay = document.getElementById('mobileMenuOverlay');
    const hamburger = document.querySelector('.hamburger-menu');
    if (overlay) {
        overlay.classList.remove('active');
        if (hamburger) {
            hamburger.classList.remove('active');
        }
        document.body.style.overflow = '';
    }
}

function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        const offset = 80; // Account for sticky navbar
        const elementPosition = section.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - offset;
        window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
        });
    }
}

async function addUser(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);
    const errorDiv = document.getElementById('addUserError');
    errorDiv.textContent = '';

    try {
        const response = await fetch(`${API_BASE}/users`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify({ ...data, role: 'USER' })
        });

        const result = await response.json();
        if (response.ok) {
            closeModal('addUser');
            loadUsers();
        } else {
            errorDiv.textContent = result.message || 'Failed to add user';
        }
    } catch (error) {
        errorDiv.textContent = 'Failed to add user';
    }
}

async function addReseller(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);
    const errorDiv = document.getElementById('addResellerError');
    errorDiv.textContent = '';

    try {
        const response = await fetch(`${API_BASE}/users`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify({ ...data, role: 'RESELLER' })
        });

        const result = await response.json();
        if (response.ok) {
            closeModal('addReseller');
            loadUsers();
        } else {
            errorDiv.textContent = result.message || 'Failed to add reseller';
        }
    } catch (error) {
        errorDiv.textContent = 'Failed to add reseller';
    }
}

async function deleteUser(userId) {
    if (!confirm('Are you sure you want to delete this user?')) return;

    try {
        const response = await fetch(`${API_BASE}/users/${userId}`, {
            method: 'DELETE',
            headers: getAuthHeaders()
        });

        if (response.ok) {
            loadUsers();
        }
    } catch (error) {
        console.error('Failed to delete user:', error);
    }
}

async function saveCookies() {
    const cookieData = document.getElementById('cookieData').value;
    try {
        const response = await fetch(`${API_BASE}/admin/cookies`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify({ cookies: cookieData })
        });
        if (response.ok) {
            alert('Cookies saved successfully');
        }
    } catch (error) {
        console.error('Failed to save cookies:', error);
    }
}

async function saveBranding() {
    const brandingText = document.getElementById('brandingText').value;
    try {
        const response = await fetch(`${API_BASE}/admin/branding`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify({ text: brandingText })
        });
        const result = await response.json();
        if (response.ok) {
            alert('Branding saved successfully');
        } else {
            alert(result.message || 'Failed to save branding');
        }
    } catch (error) {
        console.error('Failed to save branding:', error);
        alert('Failed to save branding');
    }
}

async function loadSettings() {
    try {
        const [cookiesRes, brandingRes, ipSettingsRes] = await Promise.all([
            fetch(`${API_BASE}/admin/cookies`, { headers: getAuthHeaders() }),
            fetch(`${API_BASE}/branding`, { headers: getAuthHeaders() }),
            fetch(`${API_BASE}/superadmin/settings`, { headers: getAuthHeaders() })
        ]);

        if (cookiesRes.ok) {
            const cookiesData = await cookiesRes.json();
            document.getElementById('cookieData').value = cookiesData.cookies || '';
        }

        if (brandingRes.ok) {
            const brandingData = await brandingRes.json();
            document.getElementById('brandingText').value = brandingData.text || '';
        }

        if (ipSettingsRes.ok) {
            const ipData = await ipSettingsRes.json();
            document.getElementById('ipRestrictionEnabled').checked = ipData.isIpRestrictionEnabled || false;
            document.getElementById('ipWhitelist').value = (ipData.ipWhitelist || []).join('\n');
            document.getElementById('staticIP').value = ipData.staticIP || '';
        }
    } catch (error) {
        console.error('Failed to load settings:', error);
    }
}

function toggleIpRestriction() {
    const enabled = document.getElementById('ipRestrictionEnabled').checked;
    document.getElementById('ipWhitelist').disabled = !enabled;
    document.getElementById('staticIP').disabled = !enabled;
}

async function saveIpSettings() {
    const errorDiv = document.getElementById('ipSettingsError');
    errorDiv.textContent = '';

    try {
        const ipWhitelistText = document.getElementById('ipWhitelist').value;
        const ipWhitelist = ipWhitelistText
            .split('\n')
            .map(ip => ip.trim())
            .filter(ip => ip.length > 0);

        const isIpRestrictionEnabled = document.getElementById('ipRestrictionEnabled').checked;
        const staticIP = document.getElementById('staticIP').value.trim();

        const response = await fetch(`${API_BASE}/superadmin/settings`, {
            method: 'PUT',
            headers: getAuthHeaders(),
            body: JSON.stringify({
                ipWhitelist,
                isIpRestrictionEnabled,
                staticIP
            })
        });

        const result = await response.json();
        if (response.ok) {
            alert('IP settings saved successfully');
            toggleIpRestriction();
        } else {
            errorDiv.textContent = result.message || 'Failed to save IP settings';
        }
    } catch (error) {
        errorDiv.textContent = 'Failed to save IP settings';
        console.error('Error:', error);
    }
}

// Close modal when clicking outside
window.onclick = (e) => {
    if (e.target.classList.contains('modal')) {
        const modalId = e.target.id;
        if (modalId === 'addUserModal') {
            closeModal('addUser');
        } else if (modalId === 'addResellerModal') {
            closeModal('addReseller');
        }
    }
};

// Close mobile menu on escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeMobileMenu();
        // Also close any open modals
        document.querySelectorAll('.modal.active').forEach(modal => {
            const modalId = modal.id;
            if (modalId === 'addUserModal') {
                closeModal('addUser');
            } else if (modalId === 'addResellerModal') {
                closeModal('addReseller');
            }
        });
    }
});

loadUsers();
loadSettings();
toggleIpRestriction();

