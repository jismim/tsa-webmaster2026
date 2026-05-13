document.addEventListener('DOMContentLoaded', async () => {
  const auth = window.CareMapAdminAuth;
  const dataUtils = window.CareMapAdminData;
  auth.requireAdminAuth();
  auth.wireLogoutButtons();
  auth.markActiveNav();

  const isVolunteerPage = window.location.pathname.includes('volunteer-submission');
  const tbody = document.getElementById('resourceTableBody');
  const cards = document.getElementById('resourceCards');
  const searchInput = document.getElementById('resourceSearch');
  const filterSelect = document.getElementById('resourceStatusFilter');
  const errorBox = document.getElementById('resourceError');
  const showApprovedBtn = document.querySelector('[data-show-approved]');
  const showRejectedBtn = document.querySelector('[data-show-rejected]');

  let submissions = [];
  let approvedItemsVisible = false;
  let rejectedItemsVisible = false;

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

  async function handleStatusChange(event) {
    const select = event.target;
    const previousStatus = select.dataset.currentStatus || '';
    const nextStatus = select.value;
    const submissionId = select.dataset.submissionId;
    const organizationName = select.dataset.organizationName || 'This resource';

    const validStatuses = ['Pending', 'Approved', 'Rejected'];

    if (previousStatus === nextStatus) return;

    if (!validStatuses.includes(previousStatus) || !validStatuses.includes(nextStatus)) {
      select.dataset.currentStatus = nextStatus;
      return;
    }

    if (typeof window.moveCaremapSubmission !== 'function') {
      select.value = previousStatus;
      showError('Status updates are unavailable. Refresh the page and try again.');
      return;
    }

    select.disabled = true;
    clearError();

    try {
      await window.moveCaremapSubmission(
        isVolunteerPage ? 'volunteer' : 'resource',
        submissionId,
        previousStatus.toUpperCase(),
        nextStatus.toUpperCase()
      );

      if (nextStatus === 'Pending') {
        submissions = submissions.map((submission) => (
          String(submission.id) === String(submissionId)
            ? { ...submission, status: 'Pending' }
            : submission
        ));
      } else {
        submissions = submissions.filter((submission) => String(submission.id) !== String(submissionId));
      }
      applyFilters();
      let successMessage = `${organizationName} moved to ${nextStatus.toLowerCase()} status.`;
      if (nextStatus === 'Approved') {
        successMessage = `${organizationName} moved to approved status and is available on the website.`;
      }
      showSuccess(successMessage);
    } catch (error) {
      console.error(error);
      select.value = previousStatus;
      select.dataset.currentStatus = previousStatus;
      select.disabled = false;
      showError(error.message || 'Unable to update this submission status.');
    }
  }

  async function handleShowRejected() {
    if (!showRejectedBtn || typeof dataUtils.loadRejectedSubmissions !== 'function') return;

    if (rejectedItemsVisible) {
      submissions = submissions.filter((item) => item.status !== 'Rejected');
      rejectedItemsVisible = false;
      showRejectedBtn.textContent = 'Show Rejected';
      filterSelect.value = 'All';
      applyFilters();
      clearError();
      return;
    }

    const originalText = showRejectedBtn.textContent;
    showRejectedBtn.disabled = true;
    showRejectedBtn.textContent = 'Loading...';
    clearError();

    try {
      const root = isVolunteerPage ? 'volunteer' : 'resources';
      const rejectedItems = await dataUtils.loadRejectedSubmissions(root);
      const normalizedRejectedItems = rejectedItems.map((item) => ({
        ...item,
        status: 'Rejected'
      }));
      const existingIds = new Set(submissions.map((item) => String(item.id)));
      const newRejectedItems = normalizedRejectedItems.filter((item) => !existingIds.has(String(item.id)));

      submissions = [...submissions, ...newRejectedItems];
      rejectedItemsVisible = true;
      showRejectedBtn.textContent = 'Hide Rejected';
      filterSelect.value = 'All';
      applyFilters();
      showSuccess(`Loaded ${newRejectedItems.length} rejected ${isVolunteerPage ? 'volunteer' : 'resource'} submission${newRejectedItems.length === 1 ? '' : 's'}.`);
    } catch (error) {
      console.error(error);
      showError(error.message || 'Unable to load rejected submissions.');
    } finally {
      showRejectedBtn.disabled = false;
      if (!rejectedItemsVisible) showRejectedBtn.textContent = originalText;
    }
  }

  async function handleShowApproved() {
    if (!showApprovedBtn || typeof dataUtils.loadApprovedSubmissions !== 'function') return;

    if (approvedItemsVisible) {
      submissions = submissions.filter((item) => item.status !== 'Approved');
      approvedItemsVisible = false;
      showApprovedBtn.textContent = 'Show Approved';
      filterSelect.value = 'All';
      applyFilters();
      clearError();
      return;
    }

    const originalText = showApprovedBtn.textContent;
    showApprovedBtn.disabled = true;
    showApprovedBtn.textContent = 'Loading...';
    clearError();

    try {
      const root = isVolunteerPage ? 'volunteer' : 'resources';
      const approvedItems = await dataUtils.loadApprovedSubmissions(root);
      const normalizedApprovedItems = approvedItems.map((item) => ({
        ...item,
        status: 'Approved'
      }));
      const existingIds = new Set(submissions.map((item) => String(item.id)));
      const newApprovedItems = normalizedApprovedItems.filter((item) => !existingIds.has(String(item.id)));

      submissions = [...submissions, ...newApprovedItems];
      approvedItemsVisible = true;
      showApprovedBtn.textContent = 'Hide Approved';
      filterSelect.value = 'All';
      applyFilters();
      showSuccess(`Loaded ${newApprovedItems.length} approved ${isVolunteerPage ? 'volunteer' : 'resource'} submission${newApprovedItems.length === 1 ? '' : 's'}.`);
    } catch (error) {
      console.error(error);
      showError(error.message || 'Unable to load approved submissions.');
    } finally {
      showApprovedBtn.disabled = false;
      if (!approvedItemsVisible) showApprovedBtn.textContent = originalText;
    }
  }

  function render(items) {
    if (!items.length) {
      const empty = '<tr><td colspan="6"><div class="empty-state">No submissions match the current filter.</div></td></tr>';
      tbody.innerHTML = empty;
      cards.innerHTML = '<div class="empty-state">No submissions match the current filter.</div>';
      return;
    }

    tbody.innerHTML = items.map((item) => {
      const services = (item.servicesProvided || []).map(dataUtils.prettifyService).map((service) => `<span class="pill">${dataUtils.escapeHtml(service)}</span>`).join(' ');
      return `
        <tr>
          <td>
            <strong>${dataUtils.escapeHtml(item.organizationName)}</strong><br>
            <span class="muted">${dataUtils.escapeHtml(dataUtils.prettifyCategory(item.resourceType))}</span>
          </td>
          <td>${item.website ? `<a href="${dataUtils.escapeHtml(item.website)}" target="_blank" rel="noopener">Website</a>` : '—'}</td>
          <td>${dataUtils.escapeHtml(item.address)}<br><span class="muted">${dataUtils.escapeHtml(item.phone || 'No phone')} · ${dataUtils.escapeHtml(item.email || 'No email')}</span></td>
          <td><div class="tag-row">${services || '<span class="muted">None listed</span>'}</div></td>
          <td>${dataUtils.formatDate(item.submissionDate)}</td>
          <td>
            <div class="stack">
              ${dataUtils.renderStatusBadge(item.status)}
              <select
                data-submission-id="${dataUtils.escapeHtml(item.id)}"
                data-current-status="${dataUtils.escapeHtml(item.status)}"
                data-organization-name="${dataUtils.escapeHtml(item.organizationName)}"
                aria-label="Change submission status for ${dataUtils.escapeHtml(item.organizationName)}"
              >
                <option ${item.status === 'Pending' ? 'selected' : ''}>Pending</option>
                <option ${item.status === 'Approved' ? 'selected' : ''}>Approved</option>
                <option ${item.status === 'Rejected' ? 'selected' : ''}>Rejected</option>
              </select>
            </div>
          </td>
        </tr>
      `;
    }).join('');

    tbody.querySelectorAll('select[data-submission-id]').forEach((select) => {
      select.addEventListener('change', handleStatusChange);
    });

    cards.innerHTML = items.map((item) => {
      const services = (item.servicesProvided || []).map(dataUtils.prettifyService).map((service) => `<span class="pill">${dataUtils.escapeHtml(service)}</span>`).join(' ');
      return `
        <article class="submission-card">
          <div class="entry-top">
            <div>
              <p class="entry-title">${dataUtils.escapeHtml(item.organizationName)}</p>
              <p class="entry-meta">${dataUtils.escapeHtml(dataUtils.prettifyCategory(item.resourceType))} · ${dataUtils.formatDate(item.submissionDate)}</p>
            </div>
            ${dataUtils.renderStatusBadge(item.status)}
          </div>
          <p>${dataUtils.escapeHtml(item.description)}</p>
          <div class="meta-grid">
            <div class="meta-item"><span class="meta-label">Website</span>${item.website ? `<a href="${dataUtils.escapeHtml(item.website)}" target="_blank" rel="noopener">${dataUtils.escapeHtml(item.website)}</a>` : '—'}</div>
            <div class="meta-item"><span class="meta-label">Address</span>${dataUtils.escapeHtml(item.address)}</div>
            <div class="meta-item"><span class="meta-label">Phone</span>${dataUtils.escapeHtml(item.phone || '—')}</div>
            <div class="meta-item"><span class="meta-label">Email</span>${dataUtils.escapeHtml(item.email || '—')}</div>
            <div class="meta-item"><span class="meta-label">Hours</span>${dataUtils.escapeHtml(item.hours || '—')}</div>
            <div class="meta-item"><span class="meta-label">Submitter</span>${dataUtils.escapeHtml(item.submitterName || 'Anonymous')} ${item.submitterEmail ? `(${dataUtils.escapeHtml(item.submitterEmail)})` : ''}</div>
            <div class="meta-item"><span class="meta-label">Relationship</span>${dataUtils.escapeHtml(item.submitterRelationship || '—')}</div>
            <div class="meta-item"><span class="meta-label">Donation Needs</span>${dataUtils.escapeHtml(item.donationNeeds || '—')}</div>
            <div class="meta-item"><span class="meta-label">Volunteer Opportunities</span>${dataUtils.escapeHtml(item.volunteerOpportunities || '—')}</div>
            <div class="meta-item"><span class="meta-label">Additional Notes</span>${dataUtils.escapeHtml(item.additionalNotes || '—')}</div>
          </div>
          <div style="margin-top: 1rem;">
            <span class="meta-label">Services Provided</span>
            <div class="tag-row">${services || '<span class="muted">None listed</span>'}</div>
          </div>
        </article>
      `;
    }).join('');
  }

  function applyFilters() {
    const searchTerm = searchInput.value.trim().toLowerCase();
    const status = filterSelect.value;
    const filtered = submissions.filter((item) => {
      const haystack = [
        item.organizationName,
        item.resourceType,
        item.description,
        item.address,
        item.submitterName,
        item.submitterEmail,
        ...(item.servicesProvided || [])
      ].join(' ').toLowerCase();
      const matchesSearch = !searchTerm || haystack.includes(searchTerm);
      const matchesStatus = status === 'All' || item.status === status;
      return matchesSearch && matchesStatus;
    });
    render(filtered);
  }

  try {
    submissions = isVolunteerPage
      ? await dataUtils.loadVolunteerSubmissions()
      : await dataUtils.loadResourceSubmissions();
    render(submissions);
    searchInput.addEventListener('input', applyFilters);
    filterSelect.addEventListener('change', applyFilters);
    if (showApprovedBtn) showApprovedBtn.addEventListener('click', handleShowApproved);
    if (showRejectedBtn) showRejectedBtn.addEventListener('click', handleShowRejected);
  } catch (error) {
    console.error(error);
    errorBox.textContent = isVolunteerPage
      ? 'Unable to load volunteer submissions from the API.'
      : 'Unable to load resource submissions from the API.';
    errorBox.classList.add('visible');
  }
});
