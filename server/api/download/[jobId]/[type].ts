import { createError, setHeader } from "h3"

export default defineEventHandler(async (event) => {

  /* ---------------- CORS ---------------- */
  setHeader(event, "Access-Control-Allow-Origin", "*")
  setHeader(event, "Access-Control-Allow-Methods", "GET, OPTIONS")
  setHeader(event, "Access-Control-Allow-Headers", "Content-Type")

  if (event.node.req.method === "OPTIONS") {
    event.node.res.statusCode = 204
    return ""
  }

  /* ---------------- Params ---------------- */
  const jobId = event.context.params?.jobId
  const type = event.context.params?.type

  if (!jobId || !type) {
    throw createError({
      statusCode: 400,
      statusMessage: "Missing jobId or type"
    })
  }

  const baseUrl = process.env.DMP_API

  if (!baseUrl) {
    throw createError({
      statusCode: 500,
      statusMessage: "Missing backend URL"
    })
  }

  try {

    /* -------- Call Flask backend -------- */
    const response = await fetch(`${baseUrl}/download/${jobId}/${type}`)

    if (!response.ok) {
      throw createError({
        statusCode: response.status,
        statusMessage: "Backend download failed"
      })
    }

    /* -------- Read file -------- */
    const buffer = await response.arrayBuffer()

    const contentType =
      response.headers.get("content-type") ||
      "application/octet-stream"

    const filename =
      response.headers.get("content-disposition") ||
      `attachment; filename="dmp.${type}"`

    /* -------- Forward headers -------- */
    setHeader(event, "Content-Type", contentType)
    setHeader(event, "Content-Disposition", filename)

    return Buffer.from(buffer)

  } catch (err: any) {

    console.error("Download proxy error:", err)

    throw createError({
      statusCode: err?.statusCode || 500,
      statusMessage: "Download proxy failed"
    })
  }
})