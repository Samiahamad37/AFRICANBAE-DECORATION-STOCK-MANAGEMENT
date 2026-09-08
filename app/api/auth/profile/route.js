import { getAuthUser, unauthorized } from '@/lib/auth'

export const dynamic = 'force-dynamic'

export async function GET(req) {
  const user = await getAuthUser(req)
  if (!user) return unauthorized()

  return Response.json({
    id: user.id,
    username: user.username,
    email: user.email,
    first_name: '',
    last_name: '',
  })
}
