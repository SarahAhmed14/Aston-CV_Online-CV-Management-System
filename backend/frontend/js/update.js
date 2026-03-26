const msg = document.getElementById('msg');
const updateBtn = document.getElementById('updateBtn');
const apiUrl = window.apiUrl || 'https://cv-website-backend-r376.onrender.com';

// display message on page
function showMessage(text) {
  msg.textContent = text;
}

// get user from localStorage
function getUser() {
  const raw = localStorage.getItem('user');
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

// get token from localStorage
function getToken() {
  return localStorage.getItem('token');
}

const user = getUser();
const token = getToken();

// get CV id from URL query params
const params = new URLSearchParams(window.location.search);
const id = params.get('id');

// check if user is logged in
if (!user || !token) {
  showMessage('Please login first');
} else if (updateBtn) {
  // handle update button click
  updateBtn.addEventListener('click', () => {
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

    // send updated CV to backend
    fetch(`${apiUrl}/api/cvs/${id}`, {
      method: 'PUT',
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
          showMessage('Updated successfully!');
          // redirect to home after 800ms
          setTimeout(() => {
            window.location.href = 'index.html';
          }, 800);
        } else {
          showMessage(data.message || 'Update failed');
        }
      })
      .catch(() => showMessage('Update error'));
  });
}
