import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  ListObjectsV2Command,
  DeleteObjectCommand,
  HeadObjectCommand
} from "@aws-sdk/client-s3";

const s3 = new S3Client({ region: process.env.AWS_REGION });

const BUCKET_NAME = process.env.BUCKET_NAME;
const ALLOWED_ORIGIN = process.env.ALLOWED_ORIGIN || "*";

const ROOTS = ["resources", "volunteer"];

function response(statusCode, body) {
  return {
    statusCode,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": ALLOWED_ORIGIN,
      "Access-Control-Allow-Headers": "Content-Type,Authorization,x-admin-token",
      "Access-Control-Allow-Methods": "OPTIONS,GET,POST"
    },
    body: JSON.stringify(body)
  };
}

function normalizeRoots(input) {
  if (!input) return [];
  if (typeof input === "string") {
    if (input === "both") return ["resources", "volunteer"];
    return ROOTS.includes(input) ? [input] : [];
  }
  if (Array.isArray(input)) {
    return [...new Set(input.filter((x) => ROOTS.includes(x)))];
  }
  return [];
}

function buildKey(root, status, id) {
  return `${root}/${status}/${id}.json`;
}
// commented for hardcoded login for tsa
// function isAdminAuthorized(event) {
//   const headers = event.headers || {};
//   const provided =
//     headers["x-admin-token"] ||
//     headers["X-Admin-Token"] ||
//     headers["x-admin-token".toLowerCase()];

//   return provided && provided === process.env.ADMIN_TOKEN;
// }
async function streamToString(stream) {
  const chunks = [];
  for await (const chunk of stream) {
    chunks.push(chunk);
  }
  return Buffer.concat(chunks).toString("utf-8");
}

async function objectExists(key) {
  try {
    await s3.send(new HeadObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key
    }));
    return true;
  } catch (err) {
    return false;
  }
}

async function getNextSubmissionId() {
  // Generate ID using timestamp for uniqueness
  return Date.now().toString();
}

async function submitSubmission(body) {
  const rootFolders = normalizeRoots(body.rootFolders);
  const data = body.data || {};
  const submittedBy = body.submittedBy || {};

  if (!rootFolders.length) {
    return response(400, {
      message: "rootFolders must contain resources, volunteer, or both"
    });
  }

  if (!data.title || !data.category || !data.address) {
    return response(400, {
      message: "data.title, data.category, and data.address are required"
    });
  }

  const id = await getNextSubmissionId();
  const now = new Date().toISOString();

  const payload = {
    ...data,
    id,
    moderationStatus: "PENDING",
    submittedAt: now,
    submittedBy: {
      name: submittedBy.name || "",
      email: submittedBy.email || "",
      relation: submittedBy.relation || "",
      notes: submittedBy.notes || ""
    }
  };

  const writtenKeys = [];

  for (const root of rootFolders) {
    const key = buildKey(root, "PENDING", id);

    await s3.send(new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
      Body: JSON.stringify(payload, null, 2),
      ContentType: "application/json"
    }));

    writtenKeys.push(key);
  }

  return response(201, {
    message: "Submission stored in PENDING",
    id,
    writtenKeys
  });
}

async function approveSubmission(body) {
  const id = String(body.id || "");
  const rootFolders = normalizeRoots(body.rootFolders);

  if (!id) {
    return response(400, { message: "id is required" });
  }

  if (!rootFolders.length) {
    return response(400, {
      message: "rootFolders must contain resources, volunteer, or both"
    });
  }

  const results = [];

  for (const root of rootFolders) {
    const pendingKey = buildKey(root, "PENDING", id);
    const approvedKey = buildKey(root, "APPROVED", id);

    const exists = await objectExists(pendingKey);

    if (!exists) {
      results.push({
        root,
        id,
        status: "NOT_FOUND_IN_PENDING"
      });
      continue;
    }

    const getRes = await s3.send(new GetObjectCommand({
      Bucket: BUCKET_NAME,
      Key: pendingKey
    }));

    const fileText = await streamToString(getRes.Body);
    const json = JSON.parse(fileText);

    const approvedPayload = {
      ...json,
      moderationStatus: "APPROVED",
      approvedAt: new Date().toISOString()
    };

    await s3.send(new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: approvedKey,
      Body: JSON.stringify(approvedPayload, null, 2),
      ContentType: "application/json"
    }));

    await s3.send(new DeleteObjectCommand({
      Bucket: BUCKET_NAME,
      Key: pendingKey
    }));

    results.push({
      root,
      id,
      status: "APPROVED",
      from: pendingKey,
      to: approvedKey
    });
  }

  return response(200, {
    message: "Approval processed",
    results
  });
}

async function getApproved(rootParam) {
  const roots = normalizeRoots(rootParam);

  if (!roots.length) {
    return response(400, {
      message: "root query param must be resources, volunteer, or both"
    });
  }

  const allItems = [];

  for (const root of roots) {
    const prefix = `${root}/APPROVED/`;

    let continuationToken;
    do {
      const listRes = await s3.send(new ListObjectsV2Command({
        Bucket: BUCKET_NAME,
        Prefix: prefix,
        ContinuationToken: continuationToken
      }));

      const contents = listRes.Contents || [];

      for (const item of contents) {
        if (!item.Key || !item.Key.endsWith(".json")) continue;

        const getRes = await s3.send(new GetObjectCommand({
          Bucket: BUCKET_NAME,
          Key: item.Key
        }));

        const text = await streamToString(getRes.Body);
        const json = JSON.parse(text);

        allItems.push({
          root,
          key: item.Key,
          data: json
        });
      }

      continuationToken = listRes.IsTruncated
        ? listRes.NextContinuationToken
        : undefined;
    } while (continuationToken);
  }

  return response(200, {
    count: allItems.length,
    items: allItems
  });
}

export const handler = async (event) => {
  try {
    if (event.requestContext?.http?.method === "OPTIONS") {
      return response(200, { ok: true });
    }

    const method = event.requestContext?.http?.method;
    const path = event.rawPath;
    const query = event.queryStringParameters || {};
    const body = event.body ? JSON.parse(event.body) : {};

    if (method === "POST" && path === "/submissions") {
      return await submitSubmission(body);
    }

    if (method === "GET" && path === "/pending") {
      return await getPending(query.root);
    }

    if (method === "GET" && path === "/approved") {
      return await getApproved(query.root);
    }

    if (method === "GET" && path === "/pending") {
      return await getPending(query.root);
    }

    return response(404, { message: "Route not found" });
  } catch (err) {
    console.error("Unhandled error:", err);
    return response(500, {
      message: "Internal server error",
      error: err.message || "Unknown error"
    });
  }
};

async function getPending(rootParam) {
  const roots = normalizeRoots(rootParam);

  if (!roots.length) {
    return response(400, {
      message: "root query param must be resources, volunteer, or both"
    });
  }

  const allItems = [];

  for (const root of roots) {
    const prefix = `${root}/PENDING/`;

    let continuationToken;
    do {
      const listRes = await s3.send(new ListObjectsV2Command({
        Bucket: BUCKET_NAME,
        Prefix: prefix,
        ContinuationToken: continuationToken
      }));

      const contents = listRes.Contents || [];

      for (const item of contents) {
        if (!item.Key || !item.Key.endsWith(".json")) continue;

        const getRes = await s3.send(new GetObjectCommand({
          Bucket: BUCKET_NAME,
          Key: item.Key
        }));

        const text = await streamToString(getRes.Body);
        const json = JSON.parse(text);

        allItems.push({
          root,
          key: item.Key,
          data: json
        });
      }

      continuationToken = listRes.IsTruncated
        ? listRes.NextContinuationToken
        : undefined;
    } while (continuationToken);
  }

  return response(200, {
    count: allItems.length,
    items: allItems
  });
}

