import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'
import { b64ToUid, checkResetToken } from '@/lib/passwordReset'

export const dynamic = 'force-dynamic'

export async function POST(req, { params }) {
  const { uidb64, token } = params
  const { new_password, new_password2 } = (await req.json().catch(() => ({}))) || {}

  const errors = {}
  if (!new_password) errors.new_password = ['This field is required.']
  else if (new_password.length < 8)
    errors.new_password = ['This password is too short. It must contain at least 8 characters.']
  if (new_password && new_password !== new_password2)
    errors.new_password = ["Passwords don't match."]
  if (Object.keys(errors).length) return Response.json(errors, { status: 400 })

  const userId = b64ToUid(uidb64)
  const user = userId
    ? await prisma.user.findUnique({ where: { id: userId } })
    : null

  if (!user || !checkResetToken(user, token)) {
    return Response.json(
      { success: false, message: 'Invalid token' },
      { status: 400 }
    )
  }

  await prisma.user.update({
    where: { id: user.id },
    data: { password: await bcrypt.hash(new_password, 10) },
  })

  return Response.json({ success: true, message: 'Password reset successful' })
}
