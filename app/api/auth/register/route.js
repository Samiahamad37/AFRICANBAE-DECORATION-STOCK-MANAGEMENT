import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'
import { signAccessToken, signRefreshToken } from '@/lib/auth'

export const dynamic = 'force-dynamic'

export async function POST(req) {
  const body = await req.json().catch(() => null)
  const { username, email, password, password2 } = body || {}

  const errors = {}
  if (!username) errors.username = ['This field is required.']
  if (!email) errors.email = ['This field is required.']
  if (!password) errors.password = ['This field is required.']
  else if (password.length < 8)
    errors.password = ['This password is too short. It must contain at least 8 characters.']
  else if (/^\d+$/.test(password))
    errors.password = ['This password is entirely numeric.']
  if (password && password2 !== undefined && password !== password2)
    errors.password = ["Passwords don't match."]

  if (username && (await prisma.user.findUnique({ where: { username } })))
    errors.username = ['A user with that username already exists.']
  if (email && (await prisma.user.findUnique({ where: { email } })))
    errors.email = ['A user with this email already exists.']

  if (Object.keys(errors).length) return Response.json(errors, { status: 400 })

  const user = await prisma.user.create({
    data: { username, email, password: await bcrypt.hash(password, 10) },
  })

  return Response.json(
    {
      user: { id: user.id, username: user.username, email: user.email },
      tokens: {
        refresh: await signRefreshToken(user),
        access: await signAccessToken(user),
      },
    },
    { status: 201 }
  )
}
