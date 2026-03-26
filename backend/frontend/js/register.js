const msg = document.getElementById('msg');
const registerBtn = document.getElementById('registerBtn');
const apiUrl = window.apiUrl || window.location.origin;

// display message on page
function showMessage(text) {
  msg.textContent = text;
}

// handle register button click
registerBtn.addEventListener('click', () => {
  const name = document.getElementById('name').value.trim();
  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value.trim();

  // check if all fields are filled
  if (!name || !email || !password) {
    showMessage('Please fill all fields');
    return;
  }

  showMessage('Registering...');

  // send registration request
  fetch(`${apiUrl}/api/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password })
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.user) {
        showMessage('Registration completed. Go to login.');
        // redirect to login after 800ms
        setTimeout(() => {
          window.location.href = 'login.html';
        }, 800);
        return;
      }
      showMessage(data.message || 'Register failed');
    })
    .catch(() => showMessage('Register error'));
});
