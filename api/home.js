export default async function handler(req, res) {
  const BASE = process.env.SHORTMAX_API_BASE
  const TOKEN = process.env.SHORTMAX_TOKEN
  const lang = req.query.lang || "en"
  const r = await fetch(`${BASE}/home?lang=${encodeURIComponent(lang)}`, {
    headers: { Authorization: `Bearer ${TOKEN}` }
  })
  const text = await r.text()
  res.status(r.status)
  res.setHeader("content-type", r.headers.get("content-type") || "application/json")
  res.send(text)
}
