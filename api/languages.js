import { proxy } from "./_utils.js"

export default async function handler(req, res) {
  return proxy(req, res, `/languages?`)
}
