document.addEventListener('DOMContentLoaded', () => {
  const { DEMO_ADMIN, setAdminSession, isAdminLoggedIn } = window.CareMapAdminAuth;

  if (isAdminLoggedIn()) {
    window.location.replace('/admin/dashboard.html');
    return;
  }

  const form = document.getElementById('adminLoginForm');
  const errorBox = document.getElementById('loginError');
  const usernameInput = document.getElementById('adminUsername');
  const passwordInput = document.getElementById('adminPassword');

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const username = usernameInput.value.trim();
    const password = passwordInput.value;

    if (username === DEMO_ADMIN.username && password === DEMO_ADMIN.password) {
      setAdminSession();
      window.location.href = '/admin/dashboard.html';
      return;
    }

    errorBox.textContent = 'Incorrect username or password. Please use the demo credentials shown above.';
    errorBox.classList.add('visible');
  });
});
