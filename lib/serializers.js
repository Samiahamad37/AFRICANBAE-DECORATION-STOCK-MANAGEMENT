// Shape responses exactly like the old Django REST API so the
// frontend logic carries over unchanged.

export function serializeProduct(p) {
  return {
    id: p.id,
    name: p.name,
    category: p.category,
    description: p.description,
    price: p.price.toString(),
    stock: p.stock,
    image: p.image,
    image_url: p.image ? p.image.replace('http://', 'https://') : null,
    created_at: p.createdAt.toISOString(),
    updated_at: p.updatedAt.toISOString(),
  }
}

export function serializeSale(s) {
  return {
    id: s.id,
    product: s.productId,
    product_name: s.productName,
    product_category: s.productCategory,
    unit_price: s.unitPrice.toString(),
    quantity: s.quantity,
    total: s.total.toString(),
    sold_at: s.soldAt.toISOString(),
  }
}
