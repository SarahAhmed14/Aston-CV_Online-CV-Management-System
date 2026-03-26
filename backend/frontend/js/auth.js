// get user from localStorage
function getUser() {
  const raw = localStorage.getItem('user');
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch (e) {
    return null;
  }
}

// get token from localStorage
function getToken() {
  return localStorage.getItem('token');
}

// display login status on page
const logoutBtn = document.getElementById('logoutBtn');
const userBox = document.getElementById('userBox');
const currentUser = getUser();
const token = getToken();

if (userBox) {
  if (currentUser && token) {
    userBox.textContent = 'Logged in as: ' + currentUser.email;
  } else {
    userBox.textContent = 'Not logged in';
  }
}

// handle logout button click
if (logoutBtn) {
  if (!currentUser || !token) {
    logoutBtn.style.display = 'none';
  }
  logoutBtn.addEventListener('click', () => {
    // clear saved user data
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    alert('Logout completed');
    window.location.href = 'login.html';
  });
}
