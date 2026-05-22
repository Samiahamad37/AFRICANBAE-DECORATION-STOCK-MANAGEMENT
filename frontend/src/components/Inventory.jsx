import { useState, useEffect, useCallback } from 'react'
import {
  getProducts, createProduct, deleteProduct,
  sellProduct, restockProduct, getSales,
} from '../api/client'
import TabNav from './TabNav'
import ProductCard from './ProductCard'
import Modal from './Modal'
import AddProductForm from './AddProductForm'
import SalesTable from './SalesTable'
import styles from '../App.module.css'

export default function Inventory() {
  const [tab, setTab] = useState('inventory')
  const [products, setProducts] = useState([])
  const [sales, setSales] = useState([])
  const [modal, setModal] = useState(null)   // { product, type: 'sell'|'restock' }
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)
  const [error, setError] = useState(null)

  const loadAll = useCallback(async () => {
    try {
      setFetching(true)
      const [pRes, sRes] = await Promise.all([getProducts(), getSales()])
      setProducts(pRes.data.results ?? pRes.data)
      setSales(sRes.data.results ?? sRes.data)
    } catch (e) {
      setError('Failed to connect to server. Is the Django backend running?')
    } finally {
      setFetching(false)
    }
  }, [])

  useEffect(() => { loadAll() }, [loadAll])

  // ── Sell ──────────────────────────────────────────────────
  const handleSellConfirm = async (productId, qty) => {
    setLoading(true)
    try {
      const res = await sellProduct(productId, qty)
      setProducts((prev) =>
        prev.map((p) => (p.id === productId ? res.data.product : p))
      )
      setSales((prev) => [res.data.sale, ...prev])
      setModal(null)
    } catch (e) {
      alert(e.response?.data?.quantity?.[0] || 'Sale failed.')
    } finally {
      setLoading(false)
    }
  }

  // ── Restock ────────────────────────────────────────────────
  const handleRestockConfirm = async (productId, qty) => {
    setLoading(true)
    try {
      const res = await restockProduct(productId, qty)
      setProducts((prev) =>
        prev.map((p) => (p.id === productId ? res.data : p))
      )
      setModal(null)
    } catch (e) {
      alert('Restock failed.')
    } finally {
      setLoading(false)
    }
  }

  // ── Delete ─────────────────────────────────────────────────
  const handleDelete = async (id) => {
    if (!window.confirm('Delete this product?')) return
    try {
      await deleteProduct(id)
      setProducts((prev) => prev.filter((p) => p.id !== id))
    } catch (e) {
      alert('Delete failed.')
    }
  }

  // ── Add product ────────────────────────────────────────────
  const handleAdd = async (formData, onSuccess) => {
    setLoading(true)
    try {
      const res = await createProduct(formData)
      setProducts((prev) => [res.data, ...prev])
      onSuccess()
      setTab('inventory')
    } catch (e) {
      alert('Failed to add product. Check your inputs.')
    } finally {
      setLoading(false)
    }
  }

  // ── Derived stats ──────────────────────────────────────────
  const totalSales = sales.reduce((s, x) => s + Number(x.total), 0)

  if (fetching)
    return <div className={styles.loading}>Loading...</div>

  if (error)
    return <div className={styles.error}>{error}</div>

  return (
    <div className={styles.container}>
      <TabNav tab={tab} setTab={setTab} />

      {tab === 'inventory' && (
        <div className={styles.section}>
          <div className={styles.header}>
            <h2>Inventory</h2>
            <button
              className={styles.btn}
              onClick={() => setTab('add-product')}
            >
              + Add Product
            </button>
          </div>
          <div className={styles.grid}>
            {products.map((p) => (
              <ProductCard
                key={p.id}
                product={p}
                onSell={() => setModal({ product: p, type: 'sell' })}
                onRestock={() => setModal({ product: p, type: 'restock' })}
                onDelete={handleDelete}
              />
            ))}
          </div>
          {products.length === 0 && <p>No products yet.</p>}
        </div>
      )}

      {tab === 'sales' && (
        <div className={styles.section}>
          <div className={styles.header}>
            <h2>Sales ({sales.length})</h2>
            <div className={styles.totalSales}>Total: ${totalSales.toFixed(2)}</div>
          </div>
          <SalesTable sales={sales} />
          {sales.length === 0 && <p>No sales yet.</p>}
        </div>
      )}

      {tab === 'add-product' && (
        <div className={styles.section}>
          <h2>Add New Product</h2>
          <AddProductForm onSubmit={handleAdd} isLoading={loading} />
        </div>
      )}

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
          isLoading={loading}
        />
      )}
    </div>
  )
}
