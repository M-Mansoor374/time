requireAuth('RESELLER');

const API_BASE = 'http://localhost:5000/api';

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
            <td>${user.email}</td>
            <td><span class="status ${user.isActive ? 'active' : 'inactive'}">${user.isActive ? 'Active' : 'Inactive'}</span></td>
            <td>${user.keywordUsed || 0}</td>
            <td>${user.keywordsLeft || 0}</td>
            <td>${user.startDate ? new Date(user.startDate).toLocaleDateString() : '-'}</td>
            <td>${user.expireDate ? new Date(user.expireDate).toLocaleDateString() : '-'}</td>
            <td>-</td>
        </tr>
    `).join('');
    
    // Render cards for mobile
    if (cardsContainer) {
        cardsContainer.innerHTML = users.map(user => `
            <div class="user-card">
                <div class="user-card-header">
                    <div>
                        <h3 class="user-card-email">${user.email}</h3>
                    </div>
                    <span class="status ${user.isActive ? 'active' : 'inactive'}">${user.isActive ? 'Active' : 'Inactive'}</span>
                </div>
                <div class="user-card-body">
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

// Close modal when clicking outside
window.onclick = (e) => {
    if (e.target.classList.contains('modal')) {
        const modalId = e.target.id;
        if (modalId === 'addUserModal') {
            closeModal('addUser');
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
            }
        });
    }
});

loadUsers();

