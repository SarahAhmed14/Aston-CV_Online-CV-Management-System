const list = document.getElementById('cvList');
const msg = document.getElementById('msg');
const searchBtn = document.getElementById('searchBtn');
const clearBtn = document.getElementById('clearBtn');
const apiUrl = window.apiUrl || window.location.origin;

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
  } catch (e) {
    return null;
  }
}

// get token from localStorage
function getToken() {
  return localStorage.getItem('token');
}

// escape HTML to prevent injection
function escapeHtml(value) {
  return String(value || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

// display CV list
function renderCVs(data) {
  list.innerHTML = '';
  if (!data || data.length === 0) {
    list.innerHTML = '<div class="card">No results found</div>';
    return;
  }

  const user = getUser();
  const token = getToken();

  data.forEach((cv) => {
    const div = document.createElement('div');
    div.className = 'card';

    // show update link only for CV owner
    let updateLink = '';
    if (user && token && (cv.email === user.email || cv.id === user.id)) {
      updateLink = ` | <a href="update.html?id=${cv.id}">Update</a>`;
    }

    div.innerHTML = `
      <strong>${escapeHtml(cv.name || 'No name')}</strong><br>
      <span class="small">${escapeHtml(cv.email || '')}</span><br>
      <span class="small">${escapeHtml(cv.keyprogramming || '')}</span><br>
      <a href="cv.html?id=${cv.id}">View</a>${updateLink}
    `;
    list.appendChild(div);
  });
}

// load all CVs
function loadAll() {
  showMessage('Loading...');
  fetch(`${apiUrl}/api/cvs`)
    .then((res) => res.json())
    .then((data) => {
      renderCVs(data);
      showMessage('');
    })
    .catch(() => showMessage('Error loading CVs'));
}

// handle search button click
searchBtn.addEventListener('click', () => {
  const name = document.getElementById('searchName').value.trim();
  const keyprogramming = document.getElementById('searchLang').value.trim();

  if (!name && !keyprogramming) {
    showMessage('Enter name or keyprogramming');
    return;
  }

  showMessage('Searching...');
  const params = new URLSearchParams();
  if (name) params.append('name', name);
  if (keyprogramming) params.append('keyprogramming', keyprogramming);

  // fetch search results
  fetch(`${apiUrl}/api/cvs/search?` + params.toString())
    .then((res) => res.json())
    .then((data) => {
      renderCVs(data);
      showMessage('');
    })
    .catch(() => showMessage('Error searching'));
});

// handle clear button click
clearBtn.addEventListener('click', () => {
  document.getElementById('searchName').value = '';
  document.getElementById('searchLang').value = '';
  loadAll();
});

loadAll();
