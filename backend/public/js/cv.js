const msg = document.getElementById('msg');
const details = document.getElementById('cvDetails');
const apiUrl = window.apiUrl || window.location.origin;

function showMessage(text) {
  msg.textContent = text;
}

function getId() {
  const params = new URLSearchParams(window.location.search);
  return params.get('id');
}

function escapeHtml(value) {
  return String(value || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

const id = getId();
if (!id) {
  showMessage('No ID found');
} else {
  showMessage('Loading...');

  fetch(`${apiUrl}/api/cvs/` + id)
    .then((res) => res.json())
    .then((data) => {
      if (data.message) {
        showMessage(data.message);
        return;
      }
      showMessage('');
      details.innerHTML = `
        <div class="card">
          <strong>${escapeHtml(data.name || 'No name')}</strong><br>
          <span class="small">${escapeHtml(data.email || '')}</span><br>
          <div><b>Key Programming:</b> ${escapeHtml(data.keyprogramming || '')}</div>
          <div><b>Education:</b> ${escapeHtml(data.education || '')}</div>
          <div><b>Profile:</b> ${escapeHtml(data.profile || '')}</div>
          <div><b>URL Links:</b> ${escapeHtml(data.URLlinks || '')}</div>
        </div>
      `;
    })
    .catch(() => showMessage('Error loading'));
}
