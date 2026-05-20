import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
})

// ── Products ──────────────────────────────────────────────
export const getProducts = () => api.get('/products/')

export const createProduct = (formData) =>
  api.post('/products/', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })

export const deleteProduct = (id) => api.delete(`/products/${id}/`)

export const sellProduct = (id, quantity) =>
  api.post(`/products/${id}/sell/`, { quantity })

export const restockProduct = (id, quantity) =>
  api.post(`/products/${id}/restock/`, { quantity })

// ── Sales ─────────────────────────────────────────────────
export const getSales = () => api.get('/sales/')

export default api
