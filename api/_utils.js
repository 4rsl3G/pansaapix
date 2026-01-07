const DEFAULT_ALLOWED_METHODS = "GET,OPTIONS"

function getAllowedOrigins() {
  const raw = process.env.CORS_ORIGINS || ""
  return raw
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean)
}

function setCors(req, res) {
  const allow = getAllowedOrigins()
  const origin = req.headers.origin

  // kalau ada Origin dan cocok allowlist -> set spesifik
  if (origin && allow.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin)
    res.setHeader("Vary", "Origin")
  } else {
    // fallback: jangan kirim * kalau kamu mau aman
    // kalau kamu mau bebas semua origin, ganti jadi "*"
    res.setHeader("Access-Control-Allow-Origin", allow[0] || "*")
    res.setHeader("Vary", "Origin")
  }

  res.setHeader("Access-Control-Allow-Methods", DEFAULT_ALLOWED_METHODS)
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization")
  res.setHeader("Access-Control-Max-Age", "86400")
}

function setSecurityHeaders(res) {
  res.setHeader("X-Content-Type-Options", "nosniff")
  res.setHeader("Referrer-Policy", "no-referrer")
  res.setHeader("X-Frame-Options", "DENY")
}

export async function proxy(req, res, upstreamPath) {
  try {
    setCors(req, res)
    setSecurityHeaders(res)

    if (req.method === "OPTIONS") {
      res.status(200).end()
      return
    }

    if (req.method !== "GET") {
      res.status(405).json({ error: "Method Not Allowed" })
      return
    }

    const BASE = process.env.SHORTMAX_API_BASE
    const TOKEN = process.env.SHORTMAX_TOKEN

    if (!BASE || !TOKEN) {
      res.status(500).json({ error: "Missing server env config" })
      return
    }

    const url = `${BASE}${upstreamPath}`

    const r = await fetch(url, {
      headers: {
        Authorization: `Bearer ${TOKEN}`,
      },
    })

    const contentType = r.headers.get("content-type") || "application/json"
    res.setHeader("content-type", contentType)

    // optional caching (tweak sesuai kebutuhan)
    res.setHeader("Cache-Control", "no-store")

    const body = await r.text()
    res.status(r.status).send(body)
  } catch (e) {
    console.error("Proxy error:", e)
    res.status(500).json({ error: "Proxy failed" })
  }
}
