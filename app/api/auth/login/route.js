import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'
import { signAccessToken, signRefreshToken } from '@/lib/auth'

export const dynamic = 'force-dynamic'

export async function POST(req) {
  const { username, password } = (await req.json().catch(() => ({}))) || {}

  const user = username
    ? await prisma.user.findUnique({ where: { username } })
    : null

  if (!user || !(await bcrypt.compare(password || '', user.password))) {
    return Response.json(
      { detail: 'No active account found with the given credentials' },
      { status: 401 }
    )
  }

  return Response.json({
    refresh: await signRefreshToken(user),
    access: await signAccessToken(user),
  })
}
