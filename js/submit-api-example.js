/*
  CAREMAP MORRIS — PUBLIC FORM SUBMISSION EXAMPLE

  IMPORTANT:
  GitHub Pages can serve static files, but it cannot safely write form submissions
  back into your repository directly from browser JavaScript because that would
  expose your GitHub token to the public.

  Recommended flow:
  1) submit.html sends form data to a serverless endpoint you control
  2) that endpoint writes the data to your repo or database
  3) your admin pages read /data/resource-submissions.json and /data/questions.json

  Replace RESOURCE_ENDPOINT and QUESTION_ENDPOINT with your real backend URL.
*/

const RESOURCE_ENDPOINT = 'https://YOUR-SERVERLESS-ENDPOINT.example.com/api/resource-submission';
const QUESTION_ENDPOINT = 'https://YOUR-SERVERLESS-ENDPOINT.example.com/api/question-submission';

function getCheckedValues(selector) {
  return Array.from(document.querySelectorAll(selector))
    .filter((input) => input.checked)
    .map((input) => input.value);
}

async function submitResourceForm(event) {
  event.preventDefault();

  const payload = {
    organizationName: document.getElementById('orgName').value.trim(),
    resourceType: document.getElementById('orgType').value,
    website: document.getElementById('orgWebsite').value.trim(),
    description: document.getElementById('orgDescription').value.trim(),
    address: document.getElementById('orgAddress').value.trim(),
    phone: document.getElementById('orgPhone').value.trim(),
    email: document.getElementById('orgEmail').value.trim(),
    hours: document.getElementById('orgHours').value.trim(),
    servicesProvided: getCheckedValues('input[name="services"]'),
    donationNeeds: document.getElementById('donationNeeds').value.trim(),
    volunteerOpportunities: document.getElementById('volunteerRoles').value.trim(),
    submitterName: document.getElementById('submitterName').value.trim(),
    submitterEmail: document.getElementById('submitterEmail').value.trim(),
    submitterRelationship: document.getElementById('submitterRelation').value,
    additionalNotes: document.getElementById('additionalNotes').value.trim()
  };

  const response = await fetch(RESOURCE_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    throw new Error('Resource submission failed');
  }

  document.getElementById('successBanner').classList.add('visible');
  document.querySelector('.form-card').style.display = 'none';
}

async function submitQuestionForm(event) {
  event.preventDefault();

  const payload = {
    name: document.getElementById('questionName')?.value.trim() || '',
    email: document.getElementById('questionEmail')?.value.trim() || '',
    question: document.getElementById('questionText')?.value.trim() || ''
  };

  const response = await fetch(QUESTION_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    throw new Error('Question submission failed');
  }
}

const resourceForm = document.getElementById('submitForm');
if (resourceForm) {
  resourceForm.addEventListener('submit', submitResourceForm);
}

const questionForm = document.getElementById('questionForm');
if (questionForm) {
  questionForm.addEventListener('submit', submitQuestionForm);
}
