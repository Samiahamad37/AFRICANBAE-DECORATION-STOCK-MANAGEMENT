import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'
import { getAuthUser, unauthorized } from '@/lib/auth'

export const dynamic = 'force-dynamic'

export async function POST(req) {
  const user = await getAuthUser(req)
  if (!user) return unauthorized()

  const { old_password, new_password, new_password2 } =
    (await req.json().catch(() => ({}))) || {}

  const errors = {}
  if (!old_password) errors.old_password = ['This field is required.']
  if (!new_password) errors.new_password = ['This field is required.']
  else if (new_password.length < 8)
    errors.new_password = ['This password is too short. It must contain at least 8 characters.']
  if (new_password && new_password !== new_password2)
    errors.new_password = ["Passwords don't match."]
  if (Object.keys(errors).length) return Response.json(errors, { status: 400 })

  if (!(await bcrypt.compare(old_password, user.password))) {
    return Response.json({ old_password: 'Wrong password.' }, { status: 400 })
  }

  await prisma.user.update({
    where: { id: user.id },
    data: { password: await bcrypt.hash(new_password, 10) },
  })

  return Response.json({ message: 'Password changed successfully.' })
}
