import { proxy } from "./_utils.js"

export default async function handler(req, res) {
  const lang = req.query.lang || "en"
  return proxy(req, res, `/home?lang=${encodeURIComponent(lang)}`)
}
