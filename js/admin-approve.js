const CAREMAP_API_BASE_URL = "https://8dz55fh325.execute-api.us-east-1.amazonaws.com/prod";

async function approveCaremapSubmission(type, id) {
  return await updateCaremapSubmissionStatus(type, id, "approve");
}

async function rejectCaremapSubmission(type, id) {
  return await updateCaremapSubmissionStatus(type, id, "reject");
}

async function updateCaremapSubmissionStatus(type, id, action) {
  const rootFoldersByType = {
    resource: "resources",
    resources: "resources",
    volunteer: "volunteer"
  };

  const rootFolders = rootFoldersByType[String(type || "").toLowerCase()];
  const submissionId = String(id || "").trim();

  if (!rootFolders) {
    throw new Error("type must be resource or volunteer");
  }

  if (!submissionId) {
    throw new Error("id is required");
  }

  const response = await fetch(`${CAREMAP_API_BASE_URL}/${action}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      id: submissionId,
      rootFolders
    })
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || `${action} failed`);
  }

  return result;
}

window.approveCaremapSubmission = approveCaremapSubmission;
window.rejectCaremapSubmission = rejectCaremapSubmission;
