document.addEventListener('DOMContentLoaded', async () => {
  const auth = window.CareMapAdminAuth;
  const dataUtils = window.CareMapAdminData;
  auth.requireAdminAuth();
  auth.wireLogoutButtons();
  auth.markActiveNav();
  auth.wireAdminMenu();

  const list = document.getElementById('questionsList');
  const searchInput = document.getElementById('questionSearch');
  const filterSelect = document.getElementById('questionStatusFilter');
  const errorBox = document.getElementById('questionsError');
  let questions = [];

  function showError(message) {
    errorBox.textContent = message;
    errorBox.classList.remove('success');
    errorBox.classList.add('visible');
  }

  function clearError() {
    errorBox.textContent = '';
    errorBox.classList.remove('visible', 'success');
  }

  function showSuccess(message) {
    errorBox.textContent = message;
    errorBox.classList.add('visible', 'success');
  }

  async function handleMarkAnswered(event) {
    const button = event.currentTarget;
    const questionId = button.dataset.questionId;
    const questionName = button.dataset.questionName || 'This question';

    if (typeof window.moveCaremapSubmission !== 'function') {
      showError('Question status updates are unavailable. Refresh the page and try again.');
      return;
    }

    button.disabled = true;
    button.textContent = 'Moving...';
    clearError();

    try {
      await window.moveCaremapSubmission('questions', questionId, 'PENDING', 'APPROVED');
      questions = questions.filter((question) => String(question.id) !== String(questionId));
      applyFilters();
      showSuccess(`${questionName} moved to approved questions.`);
    } catch (error) {
      console.error(error);
      button.disabled = false;
      button.textContent = 'Mark as Answered';
      showError(error.message || 'Unable to mark this question as answered.');
    }
  }

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
          <button
            class="btn btn-secondary"
            type="button"
            data-question-id="${dataUtils.escapeHtml(item.id)}"
            data-question-name="${dataUtils.escapeHtml(item.name || 'Anonymous')}"
          >Mark as Answered</button>
        </div>
      </article>
    `).join('');

    list.querySelectorAll('button[data-question-id]').forEach((button) => {
      button.addEventListener('click', handleMarkAnswered);
    });
  }

  function applyFilters() {
    const searchTerm = searchInput.value.trim().toLowerCase();
    const status = filterSelect ? filterSelect.value : 'All';
    const filtered = questions.filter((item) => {
      const haystack = [item.name, item.email, item.question].join(' ').toLowerCase();
      const matchesSearch = !searchTerm || haystack.includes(searchTerm);
      const matchesStatus = status === 'All' || item.status === status;
      return matchesSearch && matchesStatus;
    });
    render(filtered);
  }

  try {
    questions = await dataUtils.loadQuestions();
    render(questions);
    searchInput.addEventListener('input', applyFilters);
    if (filterSelect) filterSelect.addEventListener('change', applyFilters);
  } catch (error) {
    console.error(error);
    showError('Unable to load questions from the API.');
  }
});
