import crypto from 'crypto'

const secret = () => process.env.JWT_SECRET || 'dev-insecure-secret-change-me'

// Reset links stay valid for 24 hours (Django's default behaviour)
const MAX_AGE_MS = 24 * 60 * 60 * 1000

export function uidToB64(id) {
  return Buffer.from(String(id)).toString('base64url')
}

export function b64ToUid(uidb64) {
  try {
    const s = Buffer.from(uidb64, 'base64url').toString('utf8')
    return /^-?\d+$/.test(s) ? Number(s) : null
  } catch {
    return null
  }
}

export function makeResetToken(user) {
  const ts = Date.now()
  const sig = crypto
    .createHmac('sha256', secret())
    .update(`${user.id}.${ts}.${user.password}`)
    .digest('base64url')
  return `${ts}.${sig}`
}

export function checkResetToken(user, token) {
  const [tsStr, sig] = (token || '').split('.')
  const ts = Number(tsStr)
  if (!ts || !sig) return false
  if (Date.now() - ts > MAX_AGE_MS) return false

  const expected = crypto
    .createHmac('sha256', secret())
    .update(`${user.id}.${ts}.${user.password}`)
    .digest('base64url')

  const a = Buffer.from(sig)
  const b = Buffer.from(expected)
  return a.length === b.length && crypto.timingSafeEqual(a, b)
}
