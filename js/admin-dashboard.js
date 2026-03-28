document.addEventListener('DOMContentLoaded', async () => {
  const auth = window.CareMapAdminAuth;
  const dataUtils = window.CareMapAdminData;

  auth.requireAdminAuth();
  auth.wireLogoutButtons();
  auth.markActiveNav();

  try {
    const { resourceSubmissions, questions } = await dataUtils.loadAdminData();
    document.getElementById('totalResources').textContent = resourceSubmissions.length;
    document.getElementById('totalQuestions').textContent = questions.length;
    document.getElementById('totalPending').textContent = dataUtils.countByStatus(resourceSubmissions, 'Pending') + dataUtils.countByStatus(questions, 'New');

    const recentSubmissions = [...resourceSubmissions]
      .sort((a, b) => new Date(b.submissionDate) - new Date(a.submissionDate))
      .slice(0, 3);

    const recentQuestions = [...questions]
      .sort((a, b) => new Date(b.submissionDate) - new Date(a.submissionDate))
      .slice(0, 3);

    const recentSubmissionsContainer = document.getElementById('recentSubmissions');
    const recentQuestionsContainer = document.getElementById('recentQuestions');

    recentSubmissionsContainer.innerHTML = recentSubmissions.map((item) => `
      <article class="mini-entry">
        <div class="entry-top">
          <div>
            <p class="entry-title">${dataUtils.escapeHtml(item.organizationName)}</p>
            <p class="entry-meta">${dataUtils.escapeHtml(dataUtils.prettifyCategory(item.resourceType))} · ${dataUtils.formatDate(item.submissionDate)}</p>
          </div>
          ${dataUtils.renderStatusBadge(item.status)}
        </div>
        <p class="muted">${dataUtils.escapeHtml(item.description)}</p>
      </article>
    `).join('') || '<div class="empty-state">No resource submissions yet.</div>';

    recentQuestionsContainer.innerHTML = recentQuestions.map((item) => `
      <article class="mini-entry">
        <div class="entry-top">
          <div>
            <p class="entry-title">${dataUtils.escapeHtml(item.name || 'Anonymous')}</p>
            <p class="entry-meta">${dataUtils.formatDate(item.submissionDate)}</p>
          </div>
          ${dataUtils.renderStatusBadge(item.status)}
        </div>
        <p class="muted">${dataUtils.escapeHtml(item.question)}</p>
      </article>
    `).join('') || '<div class="empty-state">No questions submitted yet.</div>';
  } catch (error) {
    console.error(error);
    document.getElementById('dashboardError').textContent = 'There was a problem loading the admin data files. Check that /data/resource-submissions.json and /data/questions.json exist.';
    document.getElementById('dashboardError').classList.add('visible');
  }
});
