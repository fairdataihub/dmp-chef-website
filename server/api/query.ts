import { readBody, createError } from "h3";

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

  // --- 3. HANDLE THE REAL POST REQUEST ---
  try {
    const rawBody = await readBody(event);
    
    // Clean object for Flask
    const body = {
      title: rawBody.title || "Untitled Project",
      agency: rawBody.agency || "Not specified",
      projectSummary: rawBody.projectSummary || "Not provided",
      dataType: rawBody.dataType || "Not specified",
      dataSource: rawBody.dataSource || "Not specified",
      humanSubjects: rawBody.humanSubjects || "No",
      dataSharing: rawBody.dataSharing || "Not specified",
      dataVolume: rawBody.dataVolume || "Not specified",
    };

    console.log("-----------------------------------------");
    console.log("Forwarding Request for Job ID:", new Date().toLocaleTimeString());
    console.log("-----------------------------------------");

    const baseUrl = process.env.DMP_API;
    
    if (!baseUrl) {
      throw createError({
        statusCode: 500,
        statusMessage: "Server configuration error: Missing Flask URL",
      });
    }

    // --- KEY CHANGE: Lower timeout because we only expect a Job ID now ---
    const response = await $fetch(`${baseUrl}/query`, {
      method: "POST",
      body: body,
      headers: {
        "Content-Type": "application/json",
      },
      timeout: 20000, // 20 seconds is plenty to get a simple ID back
    });

    // Returns { job_id: "..." }
    return response;

  } catch (err: any) {
    console.error("[Flask/Tailscale Error]:", err.data || err.message);
    event.node.res.setHeader("Access-Control-Allow-Origin", "*");

    throw createError({
      statusCode: err?.response?.status ?? 500,
      statusMessage: "Flask GPU Server Error",
      data: err?.data || "The GPU server did not respond correctly.",
    });
  }
});