document.addEventListener('DOMContentLoaded', async () => {
  const auth = window.CareMapAdminAuth;
  const dataUtils = window.CareMapAdminData;
  auth.requireAdminAuth();
  auth.wireLogoutButtons();
  auth.markActiveNav();

  const list = document.getElementById('questionsList');
  const searchInput = document.getElementById('questionSearch');
  const filterSelect = document.getElementById('questionStatusFilter');
  const errorBox = document.getElementById('questionsError');
  let questions = [];

  function render(items) {
    if (!items.length) {
      list.innerHTML = '<div class="empty-state">No questions match the current filter.</div>';
      return;
    }

    list.innerHTML = items.map((item) => `
      <article class="question-card">
        <div class="entry-top">
          <div>
            <p class="entry-title">${dataUtils.escapeHtml(item.name || 'Anonymous')}</p>
            <p class="entry-meta">${dataUtils.escapeHtml(item.email || 'No email provided')} · ${dataUtils.formatDate(item.submissionDate)}</p>
          </div>
          ${dataUtils.renderStatusBadge(item.status)}
        </div>
        <p>${dataUtils.escapeHtml(item.question)}</p>
        <div class="inline-form">
          <label class="sr-only" for="status-${dataUtils.escapeHtml(item.id)}">Status</label>
          <select id="status-${dataUtils.escapeHtml(item.id)}">
            <option ${item.status === 'New' ? 'selected' : ''}>New</option>
            <option ${item.status === 'In Progress' ? 'selected' : ''}>In Progress</option>
            <option ${item.status === 'Answered' ? 'selected' : ''}>Answered</option>
          </select>
          <button class="btn btn-secondary" type="button">Mark as Answered</button>
        </div>
        <div class="admin-response-box">
          <label class="meta-label" for="response-${dataUtils.escapeHtml(item.id)}">Optional admin response</label>
          <textarea id="response-${dataUtils.escapeHtml(item.id)}" rows="3" placeholder="Type a judge/demo response here...">${dataUtils.escapeHtml(item.adminResponse || '')}</textarea>
          ${item.adminResponse ? `<div class="admin-response">${dataUtils.escapeHtml(item.adminResponse)}</div>` : ''}
        </div>
      </article>
    `).join('');
  }

  function applyFilters() {
    const searchTerm = searchInput.value.trim().toLowerCase();
    const status = filterSelect.value;
    const filtered = questions.filter((item) => {
      const haystack = [item.name, item.email, item.question, item.adminResponse].join(' ').toLowerCase();
      const matchesSearch = !searchTerm || haystack.includes(searchTerm);
      const matchesStatus = status === 'All' || item.status === status;
      return matchesSearch && matchesStatus;
    });
    render(filtered);
  }

  try {
    questions = await dataUtils.fetchJson('/data/questions.json');
    render(questions);
    searchInput.addEventListener('input', applyFilters);
    filterSelect.addEventListener('change', applyFilters);
  } catch (error) {
    console.error(error);
    errorBox.textContent = 'Unable to load /data/questions.json.';
    errorBox.classList.add('visible');
  }
});
