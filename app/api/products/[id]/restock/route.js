import { prisma } from '@/lib/prisma'
import { getAuthUser, unauthorized } from '@/lib/auth'
import { serializeProduct } from '@/lib/serializers'

export const dynamic = 'force-dynamic'

// POST /api/products/:id/restock { quantity }
export async function POST(req, ctx) {
  const user = await getAuthUser(req)
  if (!user) return unauthorized()

  const { id } = await ctx.params
  const productId = Number(id)
  if (!Number.isInteger(productId)) {
    return Response.json({ detail: 'Not found.' }, { status: 404 })
  }

  const body = (await req.json().catch(() => ({}))) || {}
  const qty = Number(body.quantity)
  if (!Number.isInteger(qty) || qty < 1) {
    return Response.json(
      { quantity: ['Ensure this value is greater than or equal to 1.'] },
      { status: 400 }
    )
  }

  try {
    const product = await prisma.product.update({
      where: { id: productId },
      data: { stock: { increment: qty } },
    })
    return Response.json(serializeProduct(product))
  } catch {
    return Response.json({ detail: 'Not found.' }, { status: 404 })
  }
}
