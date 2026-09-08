'use client'

import { useState } from 'react'
import {
  updateProduct,
  deleteProduct,
  sellProduct,
  restockProduct,
} from '@/lib/api'
import { useShop } from '@/lib/ShopContext'
import ProductCard from './ProductCard'
import Modal from './Modal'
import AddProductForm from './AddProductForm'
import styles from './App.module.css'
import modalStyles from './Modal.module.css'

export default function InventoryPage() {
  const { products, setProducts, sales, setSales, fetching, error, loadAll } =
    useShop()
  const [modal, setModal] = useState(null) // { product, type: 'sell'|'restock' }
  const [loading, setLoading] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)

  // ── Sell ──────────────────────────────────────────────────
  const handleSellConfirm = async (productId, qty) => {
    if (loading) return
    setLoading(true)
    try {
      const res = await sellProduct(productId, qty)
      setProducts((prev) => prev.map((p) => (p.id === productId ? res.data.product : p)))
      setSales((prev) => [res.data.sale, ...prev])
      setModal(null)
      await loadAll()
    } catch (e) {
      alert(e.response?.data?.quantity?.[0] || 'Sale failed.')
    } finally {
      setLoading(false)
    }
  }

  // ── Restock ────────────────────────────────────────────────
  const handleRestockConfirm = async (productId, qty) => {
    if (loading) return
    setLoading(true)
    try {
      const res = await restockProduct(productId, parseInt(qty))
      setProducts((prev) => prev.map((p) => (p.id === productId ? res.data : p)))
      setModal(null)
      await loadAll()
    } catch (e) {
      alert('Restock failed.')
    } finally {
      setLoading(false)
    }
  }

  // ── Delete ─────────────────────────────────────────────────
  const handleDelete = async (id) => {
    if (!window.confirm('Delete this product?')) return
    setLoading(true)
    try {
      await deleteProduct(id)
      setProducts((prev) => prev.filter((p) => p.id !== id))
    } catch (e) {
      alert('Delete failed.')
    } finally {
      setLoading(false)
    }
  }

  // ── Edit product ───────────────────────────────────────────
  const handleEdit = async (formData, onSuccess) => {
    if (!editingProduct) return
    setLoading(true)
    try {
      const res = await updateProduct(editingProduct.id, formData)
      setProducts((prev) =>
        prev.map((p) => (p.id === editingProduct.id ? res.data : p))
      )
      onSuccess()
      setEditingProduct(null)
    } catch (e) {
      alert('Failed to update product. Check your inputs.')
    } finally {
      setLoading(false)
    }
  }

  if (fetching) return <div className={styles.loading}>Loading...</div>

  if (error) return <div className={styles.error}>{error}</div>

  return (
    <div className={styles.container}>
      <div className={styles.section}>
        <div className={styles.grid}>
          {products.map((p) => (
            <ProductCard
              key={p.id}
              product={p}
              onSell={() => setModal({ product: p, type: 'sell' })}
              onRestock={() => setModal({ product: p, type: 'restock' })}
              onEdit={setEditingProduct}
              onDelete={handleDelete}
            />
          ))}
        </div>
        {products.length === 0 && <p>No products yet.</p>}
      </div>

      {modal && (
        <Modal
          product={modal.product}
          type={modal.type}
          onConfirm={(qty) =>
            modal.type === 'sell'
              ? handleSellConfirm(modal.product.id, qty)
              : handleRestockConfirm(modal.product.id, qty)
          }
          onClose={() => setModal(null)}
          loading={loading}
        />
      )}

      {editingProduct && (
        <div
          className={modalStyles.overlay}
          onClick={() => {
            if (!loading) setEditingProduct(null)
          }}
        >
          <div className={modalStyles.modal} onClick={(e) => e.stopPropagation()}>
            <AddProductForm
              mode="edit"
              product={editingProduct}
              onSave={handleEdit}
              onCancel={() => setEditingProduct(null)}
              loading={loading}
            />
          </div>
        </div>
      )}
    </div>
  )
}
