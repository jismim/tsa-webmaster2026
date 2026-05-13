const CAREMAP_API_BASE_URL = "https://8dz55fh325.execute-api.us-east-1.amazonaws.com/prod";

async function moveCaremapSubmission(type, id, fromStatus, toStatus) {
  const rootFolders = getCaremapRootFolder(type);
  const submissionId = String(id || "").trim();

  if (!submissionId) {
    throw new Error("id is required");
  }

  const response = await fetch(`${CAREMAP_API_BASE_URL}/move`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      id: submissionId,
      rootFolders,
      fromStatus,
      toStatus
    })
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "move failed");
  }

  return result;
}

async function getApprovedCaremapSubmissions(type) {
  return await getCaremapSubmissionsByStatus(type, "approved");
}

async function getRejectedCaremapSubmissions(type) {
  return await getCaremapSubmissionsByStatus(type, "rejected");
}

async function getCaremapSubmissionsByStatus(type, status) {
  const rootFolders = getCaremapRootFolder(type);
  const response = await fetch(`${CAREMAP_API_BASE_URL}/${status}/formatted?root=${encodeURIComponent(rootFolders)}`);
  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || `Failed to load ${status} submissions`);
  }

  return result;
}

function getCaremapRootFolder(type) {
  const rootFoldersByType = {
    resource: "resources",
    resources: "resources",
    volunteer: "volunteer"
  };

  const rootFolders = rootFoldersByType[String(type || "").toLowerCase()];

  if (!rootFolders) {
    throw new Error("type must be resource or volunteer");
  }

  return rootFolders;
}

window.moveCaremapSubmission = moveCaremapSubmission;
window.getApprovedCaremapSubmissions = getApprovedCaremapSubmissions;
window.getRejectedCaremapSubmissions = getRejectedCaremapSubmissions;
