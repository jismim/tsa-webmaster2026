const DEMO_ADMIN = {
  username: 'admin@caremapmorris.org',
  password: 'CareMapAdmin2026!'
};

const AUTH_STORAGE_KEY = 'caremap_admin_session';

function setAdminSession() {
  sessionStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify({
    username: DEMO_ADMIN.username,
    loggedInAt: new Date().toISOString()
  }));
}

function getAdminSession() {
  const raw = sessionStorage.getItem(AUTH_STORAGE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function isAdminLoggedIn() {
  return Boolean(getAdminSession());
}

function requireAdminAuth() {
  if (!isAdminLoggedIn()) {
    window.location.replace('/admin/login.html');
  }
}

function logoutAdmin() {
  sessionStorage.removeItem(AUTH_STORAGE_KEY);
  window.location.replace('/admin/login.html');
}

function wireLogoutButtons() {
  document.querySelectorAll('[data-admin-logout]').forEach((button) => {
    button.addEventListener('click', logoutAdmin);
  });
}

function markActiveNav() {
    const currentPath = window.location.pathname;
    document.querySelectorAll('[data-nav-path]').forEach((link) => {
    const linkPath = link.getAttribute('data-nav-path');
    if (currentPath === linkPath) {
      link.classList.add('active');
      link.setAttribute('aria-current', 'page');
    }
  });
}

window.CareMapAdminAuth = {
  DEMO_ADMIN,
  setAdminSession,
  getAdminSession,
  isAdminLoggedIn,
  requireAdminAuth,
  logoutAdmin,
  wireLogoutButtons,
  markActiveNav
};
