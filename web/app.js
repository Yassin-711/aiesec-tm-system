// AIESEC TM System - Main JavaScript

// Load configuration
// Make sure config.js is loaded before app.js in your HTML files
const APPS_SCRIPT_URL = window.APPS_SCRIPT_URL || 'https://script.google.com/macros/s/AKfycbyltRZHQhz4XV1Q010ZtZau3AB5H5jalNqFc3KFr90nnMNCOG_2K3YfbYrIMYgbdzLi/exec';

// Check if Apps Script URL is configured
if (APPS_SCRIPT_URL === 'https://script.google.com/macros/s/AKfycbyltRZHQhz4XV1Q010ZtZau3AB5H5jalNqFc3KFr90nnMNCOG_2K3YfbYrIMYgbdzLi/exec') {
    console.warn('⚠️ Apps Script URL not configured! Please update config.js with your Web App URL.');
}

// Login functionality
document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    const errorMessage = document.getElementById('errorMessage');
    
    if (loginForm) {
        loginForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const memberId = document.getElementById('memberId').value.trim().toUpperCase();
            
            if (!memberId) {
                showError('Please enter your Member ID');
                return;
            }
            
            try {
                // Call Apps Script to verify member and get role
                const response = await fetch(APPS_SCRIPT_URL + '?action=getMember&memberId=' + memberId);
                const result = await response.json();
                
                if (result.success) {
                    const data = result.data;
                    
                    // Store member info in session
                    sessionStorage.setItem('memberId', memberId);
                    sessionStorage.setItem('memberName', data.name);
                    sessionStorage.setItem('roleType', data.roleType);
                    sessionStorage.setItem('memberFunction', data.function);
                    
                    // Check if user has full dashboard access (VP TM or TM Team Leader)
                    const hasFullAccess = data.roleType === 'VP TM' || 
                                        (data.roleType === 'Team Leader' && data.function === 'TM');
                    sessionStorage.setItem('hasFullAccess', hasFullAccess ? 'true' : 'false');
                    
                    // Redirect based on role
                    if (data.roleType === 'VP TM') {
                        sessionStorage.setItem('isVPTM', 'true');
                        window.location.href = 'vptm-dashboard.html';
                    } else if (data.roleType === 'Team Leader') {
                        sessionStorage.setItem('teamLeaderName', data.name);
                        window.location.href = 'tl-dashboard.html';
                    } else {
                        window.location.href = 'member-dashboard.html';
                    }
                } else {
                    showError(result.message || 'Invalid Member ID');
                }
            } catch (error) {
                console.error('Login error:', error);
                showError('Error connecting to server. Please try again.');
            }
        });
    }
});

function showError(message) {
    const errorEl = document.getElementById('errorMessage');
    if (errorEl) {
        errorEl.textContent = message;
        errorEl.classList.add('show');
        setTimeout(() => {
            errorEl.classList.remove('show');
        }, 5000);
    }
}

// Helper function to make API calls
async function callAppsScript(action, params = {}) {
    const queryParams = new URLSearchParams({
        action: action,
        ...params
    });
    
    try {
        const response = await fetch(APPS_SCRIPT_URL + '?' + queryParams.toString());
        return await response.json();
    } catch (error) {
        console.error('API call error:', error);
        return { success: false, message: 'Error connecting to server' };
    }
}

// QR Code generation helper (using qrcode.js library)
function generateQRCode(text, elementId) {
    // This would use a QR code library
    // For now, return a URL that can be used with a QR code generator service
    const qrUrl = 'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=' + encodeURIComponent(text);
    const img = document.createElement('img');
    img.src = qrUrl;
    img.alt = 'QR Code';
    document.getElementById(elementId).appendChild(img);
}

// Dashboard navigation for VP TM and TM Team Leaders
function showDashboardNavigation() {
    const navElement = document.getElementById('dashboardNav');
    if (!navElement) return;
    
    const currentPage = window.location.pathname.split('/').pop();
    const navHTML = `
        <div class="nav-buttons">
            <a href="vptm-dashboard.html" class="nav-btn ${currentPage === 'vptm-dashboard.html' ? 'active' : ''}">VP TM</a>
            <a href="tl-dashboard.html" class="nav-btn ${currentPage === 'tl-dashboard.html' ? 'active' : ''}">Team Leader</a>
            <a href="member-dashboard.html" class="nav-btn ${currentPage === 'member-dashboard.html' ? 'active' : ''}">Member</a>
        </div>
    `;
    navElement.innerHTML = navHTML;
}

