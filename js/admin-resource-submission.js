document.addEventListener('DOMContentLoaded', async () => {
  const auth = window.CareMapAdminAuth;
  const dataUtils = window.CareMapAdminData;
  auth.requireAdminAuth();
  auth.wireLogoutButtons();
  auth.markActiveNav();

  const tbody = document.getElementById('resourceTableBody');
  const cards = document.getElementById('resourceCards');
  const searchInput = document.getElementById('resourceSearch');
  const filterSelect = document.getElementById('resourceStatusFilter');
  const errorBox = document.getElementById('resourceError');

  let submissions = [];

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
              <select aria-label="Change submission status for ${dataUtils.escapeHtml(item.organizationName)}">
                <option ${item.status === 'Pending' ? 'selected' : ''}>Pending</option>
                <option ${item.status === 'Approved' ? 'selected' : ''}>Approved</option>
                <option ${item.status === 'Rejected' ? 'selected' : ''}>Rejected</option>
              </select>
            </div>
          </td>
        </tr>
      `;
    }).join('');

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
    submissions = await dataUtils.fetchJson('/data/resource-submissions.json');
    render(submissions);
    searchInput.addEventListener('input', applyFilters);
    filterSelect.addEventListener('change', applyFilters);
  } catch (error) {
    console.error(error);
    errorBox.textContent = 'Unable to load /data/resource-submissions.json.';
    errorBox.classList.add('visible');
  }
});
