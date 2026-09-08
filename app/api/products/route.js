import { prisma } from '@/lib/prisma'
import { getAuthUser, unauthorized } from '@/lib/auth'
import { uploadImage } from '@/lib/cloudinary'
import { serializeProduct } from '@/lib/serializers'

export const dynamic = 'force-dynamic'

// GET /api/products — public read (matches the old DRF IsAuthenticatedOrReadOnly)
export async function GET() {
  const products = await prisma.product.findMany({
    orderBy: { createdAt: 'desc' },
  })
  return Response.json(products.map(serializeProduct))
}

// POST /api/products — create product (multipart/form-data, image optional)
export async function POST(req) {
  const user = await getAuthUser(req)
  if (!user) return unauthorized()

  const { fields, imageFile } = await parsePayload(req)

  const errors = {}
  if (!fields.name?.trim()) errors.name = ['This field is required.']
  if (!fields.category?.trim()) errors.category = ['This field is required.']

  const price = Number(fields.price)
  if (fields.price === undefined || fields.price === '' || isNaN(price) || price < 0)
    errors.price = ['A valid price is required.']

  const stock = Number(fields.stock)
  if (fields.stock === undefined || fields.stock === '' || isNaN(stock) || stock < 0)
    errors.stock = ['A valid stock is required.']

  if (Object.keys(errors).length) return Response.json(errors, { status: 400 })

  let imageUrl = null
  if (imageFile && imageFile.size > 0) {
    try {
      imageUrl = await uploadImage(imageFile)
    } catch {
      return Response.json(
        { image: ['Image upload failed. Check Cloudinary credentials.'] },
        { status: 400 }
      )
    }
  }

  const product = await prisma.product.create({
    data: {
      name: fields.name.trim(),
      category: fields.category.trim(),
      description: (fields.description || '').trim(),
      price,
      stock: Math.trunc(stock),
      image: imageUrl,
    },
  })

  return Response.json(serializeProduct(product), { status: 201 })
}

async function parsePayload(req) {
  const contentType = req.headers.get('content-type') || ''

  if (contentType.includes('multipart/form-data')) {
    const form = await req.formData()
    const fields = {}
    for (const [key, value] of form.entries()) {
      if (typeof value === 'string') fields[key] = value
    }
    return { fields, imageFile: form.get('image') }
  }

  const fields = await req.json().catch(() => ({}))
  return { fields, imageFile: null }
}
