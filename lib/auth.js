import { SignJWT, jwtVerify } from 'jose'
import { prisma } from './prisma'

const secret = () =>
  new TextEncoder().encode(process.env.JWT_SECRET || 'dev-insecure-secret-change-me')

export async function signAccessToken(user) {
  return new SignJWT({ username: user.username, email: user.email, type: 'access' })
    .setProtectedHeader({ alg: 'HS256' })
    .setSubject(String(user.id))
    .setIssuedAt()
    .setExpirationTime('1h')
    .sign(secret())
}

export async function signRefreshToken(user) {
  return new SignJWT({ type: 'refresh' })
    .setProtectedHeader({ alg: 'HS256' })
    .setSubject(String(user.id))
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(secret())
}

export async function verifyToken(token, expectedType) {
  try {
    const { payload } = await jwtVerify(token, secret())
    if (expectedType && payload.type !== expectedType) return null
    return payload
  } catch {
    return null
  }
}

export async function getAuthUser(req) {
  const header = req.headers.get('authorization') || ''
  const [scheme, token] = header.split(' ')
  if (scheme !== 'Bearer' || !token) return null

  const payload = await verifyToken(token, 'access')
  if (!payload?.sub) return null

  return prisma.user.findUnique({ where: { id: Number(payload.sub) } })
}

export function unauthorized() {
  return Response.json(
    { detail: 'Authentication credentials were not provided.' },
    { status: 401 }
  )
}
