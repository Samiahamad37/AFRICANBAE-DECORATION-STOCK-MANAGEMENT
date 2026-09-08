import { getAuthUser, unauthorized } from '@/lib/auth'

export const dynamic = 'force-dynamic'

export async function POST(req) {
  const user = await getAuthUser(req)
  if (!user) return unauthorized()

  // Stateless JWT — the client deletes its tokens.
  return Response.json({ message: 'Logged out successfully' })
}
