import { prisma } from '@/lib/prisma'
import { getAuthUser, unauthorized } from '@/lib/auth'
import { serializeProduct, serializeSale } from '@/lib/serializers'

export const dynamic = 'force-dynamic'

// POST /api/products/:id/sell { quantity }
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

  const result = await prisma.$transaction(async (tx) => {
    // Atomically decrement only if enough stock — race-safe
    const updated = await tx.product.updateMany({
      where: { id: productId, stock: { gte: qty } },
      data: { stock: { decrement: qty } },
    })
    if (updated.count === 0) return null

    const product = await tx.product.findUnique({ where: { id: productId } })
    const sale = await tx.sale.create({
      data: {
        productId: product.id,
        productName: product.name,
        productCategory: product.category,
        unitPrice: product.price,
        quantity: qty,
        total: Number(product.price) * qty,
      },
    })
    return { product, sale }
  })

  if (!result) {
    const current = await prisma.product.findUnique({ where: { id: productId } })
    if (!current) return Response.json({ detail: 'Not found.' }, { status: 404 })
    return Response.json(
      { quantity: [`Only ${current.stock} units in stock.`] },
      { status: 400 }
    )
  }

  return Response.json(
    {
      sale: serializeSale(result.sale),
      product: serializeProduct(result.product),
    },
    { status: 201 }
  )
}
