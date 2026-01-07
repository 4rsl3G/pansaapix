export default async function handler(req, res) {
  const BASE = process.env.SHORTMAX_API_BASE
  const TOKEN = process.env.SHORTMAX_TOKEN
  const lang = req.query.lang || "en"
  const code = req.query.code
  const ep = req.query.ep || "1"
  const r = await fetch(`${BASE}/play/${encodeURIComponent(code)}?lang=${encodeURIComponent(lang)}&ep=${encodeURIComponent(ep)}`, {
    headers: { Authorization: `Bearer ${TOKEN}` }
  })
  const text = await r.text()
  res.status(r.status)
  res.setHeader("content-type", r.headers.get("content-type") || "application/json")
  res.send(text)
}
