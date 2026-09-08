import { prisma } from '@/lib/prisma'
import { signAccessToken, verifyToken } from '@/lib/auth'

export const dynamic = 'force-dynamic'

export async function POST(req) {
  const { refresh } = (await req.json().catch(() => ({}))) || {}
  const payload = refresh ? await verifyToken(refresh, 'refresh') : null

  const user = payload?.sub
    ? await prisma.user.findUnique({ where: { id: Number(payload.sub) } })
    : null

  if (!user) {
    return Response.json(
      { detail: 'Token is invalid or expired', code: 'token_not_valid' },
      { status: 401 }
    )
  }

  return Response.json({ access: await signAccessToken(user) })
}
