import { proxy } from "./_utils.js"

export default async function handler(req, res) {
  const lang = req.query.lang || "en"
  const code = req.query.code
  if (!code) {
    res.status(400).json({ error: "Missing code" })
    return
  }
  return proxy(req, res, `/episodes/${encodeURIComponent(code)}?lang=${encodeURIComponent(lang)}`)
}
