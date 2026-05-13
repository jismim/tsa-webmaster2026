const RESOURCE_SUBMISSIONS_API = 'https://8dz55fh325.execute-api.us-east-1.amazonaws.com/prod/pending?root=resources';
const VOLUNTEER_SUBMISSIONS_API = 'https://8dz55fh325.execute-api.us-east-1.amazonaws.com/prod/pending?root=volunteer';
const QUESTIONS_API = 'https://8dz55fh325.execute-api.us-east-1.amazonaws.com/prod/pending?root=questions';

async function fetchJson(path) {
  const response = await fetch(path, { cache: 'no-store' });
  if (!response.ok) {
    throw new Error(`Failed to load ${path}`);
  }
  return response.json();
}

function unwrapS3Items(payload) {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.items)) {
    return payload.items.map((item) => item.data || item);
  }
  return [];
}

function formatDate(dateString) {
  if (!dateString) return '—';
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return dateString;
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  }).format(date);
}

function escapeHtml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function prettifyCategory(value) {
  if (!value) return 'Unspecified';
  return value
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

function prettifyService(value) {
  const serviceMap = {
    meals: 'Meals / Food',
    'emergency-housing': 'Emergency Housing',
    counseling: 'Counseling / Mental Health',
    legal: 'Legal Support',
    'case-management': 'Case Management',
    'job-readiness': 'Job Readiness / Training',
    childcare: 'Childcare / Youth Programs',
    transportation: 'Transportation',
    healthcare: 'Healthcare / Clinics',
    hygiene: 'Hygiene / Personal Care'
  };
  return serviceMap[value] || prettifyCategory(value);
}

function getStatusClass(status) {
  return `status-${String(status || '').toLowerCase().replace(/\s+/g, '-')}`;
}

function renderStatusBadge(status) {
  const safeStatus = escapeHtml(status || 'Unknown');
  return `<span class="status-badge ${getStatusClass(status)}">${safeStatus}</span>`;
}

function countByStatus(items, target) {
  return items.filter((item) => String(item.status).toLowerCase() === target.toLowerCase()).length;
}

async function loadResourceSubmissions() {
  return fetchJson(RESOURCE_SUBMISSIONS_API);
}

async function loadVolunteerSubmissions() {
  return fetchJson(VOLUNTEER_SUBMISSIONS_API);
}

async function loadQuestions() {
  return unwrapS3Items(await fetchJson(QUESTIONS_API));
}

async function loadAdminData() {
  const [resourceSubmissions, volunteerSubmissions, questions] = await Promise.all([
    loadResourceSubmissions(),
    loadVolunteerSubmissions(),
    loadQuestions()
  ]);
  return { resourceSubmissions, volunteerSubmissions, questions };
}

window.CareMapAdminData = {
  fetchJson,
  unwrapS3Items,
  formatDate,
  escapeHtml,
  prettifyCategory,
  prettifyService,
  getStatusClass,
  renderStatusBadge,
  countByStatus,
  loadResourceSubmissions,
  loadVolunteerSubmissions,
  loadQuestions,
  loadAdminData
};
