import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'
import { signAccessToken, signRefreshToken } from '@/lib/auth'

export const dynamic = 'force-dynamic'

export async function POST(req) {
  try {
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
  } catch (err) {
    // TEMPORARY: surface the real error so it can be diagnosed from the browser.
    // Remove the "error" field once login works.
    console.error('Login failed:', err)
    return Response.json(
      {
        detail: 'Login failed on the server.',
        error: String(err?.message || err).slice(0, 500),
        code: err?.code || err?.errorCode || null,
      },
      { status: 500 }
    )
  }
}
