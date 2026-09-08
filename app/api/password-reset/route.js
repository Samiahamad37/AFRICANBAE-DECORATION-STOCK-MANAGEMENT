import { prisma } from '@/lib/prisma'
import { uidToB64, makeResetToken } from '@/lib/passwordReset'

export const dynamic = 'force-dynamic'

export async function POST(req) {
  const { email } = (await req.json().catch(() => ({}))) || {}

  if (!email) {
    return Response.json({ email: ['This field is required.'] }, { status: 400 })
  }

  const user = await prisma.user.findUnique({ where: { email } })

  if (user) {
    const uidb64 = uidToB64(user.id)
    const token = makeResetToken(user)
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || new URL(req.url).origin
    const reset_path = `/reset-password/${uidb64}/${token}`

    return Response.json({
      success: true,
      message: 'Password reset link generated',
      reset_link: `${appUrl}${reset_path}`,
      reset_path,
    })
  }

  // Don't leak whether the email exists
  return Response.json({
    success: true,
    message: 'If that email exists, a password reset link has been sent',
  })
}
