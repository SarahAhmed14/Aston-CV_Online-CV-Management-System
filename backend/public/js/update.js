const msg = document.getElementById('msg');
const updateBtn = document.getElementById('updateBtn');
const apiUrl = window.apiUrl || 'https://cv-website-backend-r376.onrender.com';

function showMessage(text) {
  msg.textContent = text;
}

function getUser() {
  const raw = localStorage.getItem('user');
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function getToken() {
  return localStorage.getItem('token');
}

const user = getUser();
const token = getToken();

const params = new URLSearchParams(window.location.search);
const id = params.get('id');

if (!user || !token) {
  showMessage('Please login first');
} else if (updateBtn) {
  updateBtn.addEventListener('click', () => {
    const name = document.getElementById('name').value.trim();
    const keyprogramming = document.getElementById('keyprogramming').value.trim();
    const education = document.getElementById('education').value.trim();
    const profile = document.getElementById('profile').value.trim();
    const URLlinks = document.getElementById('URLlinks').value.trim();

    if (!name || !keyprogramming || !education || !profile || !URLlinks) {
      showMessage('Please fill required fields');
      return;
    }

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
