import { prisma } from '@/lib/prisma'
import { serializeSale } from '@/lib/serializers'

export const dynamic = 'force-dynamic'

// GET /api/sales — public read (matches the old DRF IsAuthenticatedOrReadOnly)
export async function GET() {
  const sales = await prisma.sale.findMany({
    orderBy: { soldAt: 'desc' },
  })
  return Response.json(sales.map(serializeSale))
}
