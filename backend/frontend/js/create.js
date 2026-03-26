const msg = document.getElementById('msg');
const createBtn = document.getElementById('createBtn');
const emailInput = document.getElementById('email');
const apiUrl = window.apiUrl || 'https://cv-website-backend-r376.onrender.com';

// display message on page
function showMessage(text) {
  msg.textContent = text;
}

// get user data from localStorage
function getUser() {
  const raw = localStorage.getItem('user');
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

// get auth token from localStorage
function getToken() {
  return localStorage.getItem('token');
}

const user = getUser();
const token = getToken();

// check if user is logged in
if (!user) {
  showMessage('Please login first to create a CV');
} else {
  emailInput.value = user.email;
}

// handle create button click
if (createBtn) {
  createBtn.addEventListener('click', () => {
    if (!user || !token) {
      showMessage('Please login first to create a CV');
      return;
    }

    // get form field values
    const name = document.getElementById('name').value.trim();
    const keyprogramming = document.getElementById('keyprogramming').value.trim();
    const education = document.getElementById('education').value.trim();
    const profile = document.getElementById('profile').value.trim();
    const URLlinks = document.getElementById('URLlinks').value.trim();

    // check if all fields are filled
    if (!name || !keyprogramming || !education || !profile || !URLlinks) {
      showMessage('Please fill required fields');
      return;
    }

    showMessage('Creating CV...');

    // send CV data to backend
    fetch(`${apiUrl}/api/cvs`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token
      },
      body: JSON.stringify({
        name,
        keyprogramming,
        education,
        profile,
        URLlinks
      })
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          showMessage('CV created successfully!');
          // redirect to home after 800ms
          setTimeout(() => {
            window.location.href = 'index.html';
          }, 800);
        } else {
          showMessage(data.message || 'Create failed');
        }
      })
      .catch(() => showMessage('Create error'));
  });
}
