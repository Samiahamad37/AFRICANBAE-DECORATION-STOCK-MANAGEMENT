import { prisma } from '@/lib/prisma'
import { getAuthUser, unauthorized } from '@/lib/auth'
import { uploadImage } from '@/lib/cloudinary'
import { serializeProduct } from '@/lib/serializers'

export const dynamic = 'force-dynamic'

async function findProduct(id) {
  const productId = Number(id)
  if (!Number.isInteger(productId)) return null
  return prisma.product.findUnique({ where: { id: productId } })
}

function notFound() {
  return Response.json({ detail: 'Not found.' }, { status: 404 })
}

// PATCH /api/products/:id — partial update (multipart/form-data, image optional)
export async function PATCH(req, { params }) {
  const user = await getAuthUser(req)
  if (!user) return unauthorized()

  const existing = await findProduct(params.id)
  if (!existing) return notFound()

  const contentType = req.headers.get('content-type') || ''
  const fields = {}
  let imageFile = null

  if (contentType.includes('multipart/form-data')) {
    const form = await req.formData()
    for (const [key, value] of form.entries()) {
      if (typeof value === 'string') fields[key] = value
    }
    imageFile = form.get('image')
  } else {
    Object.assign(fields, await req.json().catch(() => ({})))
  }

  const data = {}
  if (fields.name !== undefined) data.name = String(fields.name).trim()
  if (fields.category !== undefined) data.category = String(fields.category).trim()
  if (fields.description !== undefined) data.description = String(fields.description).trim()

  if (fields.price !== undefined && fields.price !== '') {
    const price = Number(fields.price)
    if (isNaN(price) || price < 0)
      return Response.json({ price: ['A valid price is required.'] }, { status: 400 })
    data.price = price
  }

  if (fields.stock !== undefined && fields.stock !== '') {
    const stock = Number(fields.stock)
    if (isNaN(stock) || stock < 0)
      return Response.json({ stock: ['A valid stock is required.'] }, { status: 400 })
    data.stock = Math.trunc(stock)
  }

  if (imageFile && imageFile.size > 0) {
    try {
      data.image = await uploadImage(imageFile)
    } catch {
      return Response.json(
        { image: ['Image upload failed. Check Cloudinary credentials.'] },
        { status: 400 }
      )
    }
  }

  const product = await prisma.product.update({
    where: { id: existing.id },
    data,
  })

  return Response.json(serializeProduct(product))
}

// DELETE /api/products/:id
export async function DELETE(req, { params }) {
  const user = await getAuthUser(req)
  if (!user) return unauthorized()

  const existing = await findProduct(params.id)
  if (!existing) return notFound()

  await prisma.product.delete({ where: { id: existing.id } })
  return new Response(null, { status: 204 })
}
