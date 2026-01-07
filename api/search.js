import { proxy } from "./_utils.js"

export default async function handler(req, res) {
  const lang = req.query.lang || "en"
  const q = req.query.q || ""
  return proxy(
    req,
    res,
    `/search?q=${encodeURIComponent(q)}&lang=${encodeURIComponent(lang)}`
  )
}
