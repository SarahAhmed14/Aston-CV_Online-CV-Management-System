const msg = document.getElementById('msg');
const loginBtn = document.getElementById('loginBtn');
const apiUrl = window.apiUrl || window.location.origin;

// display message on page
function showMessage(text) {
  msg.textContent = text;
}

// handle login button click
loginBtn.addEventListener('click', () => {
  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value.trim();

  // check if fields are filled
  if (!email || !password) {
    showMessage('Please fill all fields');
    return;
  }

  showMessage('Logging in...');

  // send login request
  fetch(`${apiUrl}/api/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.user && data.token) {
        // save user and token to localStorage
        localStorage.setItem('user', JSON.stringify(data.user));
        localStorage.setItem('token', data.token);
        showMessage('Login completed. Redirecting to home...');
        // redirect after 800ms
        setTimeout(() => {
          window.location.href = 'index.html';
        }, 800);
        return;
      }
      showMessage(data.message || 'Login failed');
    })
    .catch(() => showMessage('Login error'))
});
