import { getQuery, createError } from "h3";

export default defineEventHandler(async (event) => {
  // --- 1. MANUALLY SET CORS HEADERS ---
  event.node.res.setHeader("Access-Control-Allow-Origin", "*");
  event.node.res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  event.node.res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  // --- 2. HANDLE PREFLIGHT (OPTIONS) ---
  if (event.node.req.method === 'OPTIONS') {
    event.node.res.statusCode = 204;
    event.node.res.statusMessage = "No Content";
    return event.node.res.end();
  }

  // --- 3. HANDLE THE GET REQUEST ---
  try {
    // Extract 'id' from query parameters (?id=xxxx)
    const { id } = getQuery(event);

    if (!id) {
      throw createError({
        statusCode: 400,
        statusMessage: "Bad Request: Missing Job ID",
      });
    }

    const baseUrl = process.env.DMP_API;
    
    if (!baseUrl) {
      console.error("ERROR: DMP_API environment variable is not set!");
      throw createError({
        statusCode: 500,
        statusMessage: "Server configuration error: Missing Flask URL",
      });
    }

    // Forward the GET request to the Flask server via Tailscale
    // Path: http://<tailscale_ip>:<port>/status/<job_id>
    const response = await $fetch(`${baseUrl}/status/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      timeout: 10000, // Quick 10s timeout for status checks
    });

    return response;

  } catch (err: any) {
    console.error("[Status Check Error]:", err.data || err.message);

    // Ensure CORS headers persist on error
    event.node.res.setHeader("Access-Control-Allow-Origin", "*");

    throw createError({
      statusCode: err?.response?.status ?? 500,
      statusMessage: "GPU Status Check Failed",
      data: err?.data || "Could not retrieve job status from GPU server.",
    });
  }
});