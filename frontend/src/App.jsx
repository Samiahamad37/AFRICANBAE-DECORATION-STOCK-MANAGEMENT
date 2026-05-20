import { useState, useEffect, useCallback } from 'react'
import {
  getProducts, createProduct, deleteProduct,
  sellProduct, restockProduct, getSales,
} from './api/client'
import Header from './components/Header'
import TabNav from './components/TabNav'
import ProductCard from './components/ProductCard'
import Modal from './components/Modal'
import AddProductForm from './components/AddProductForm'
import SalesTable from './components/SalesTable'
import styles from './App.module.css'

export default function App() {
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

  if (fetching) {
    return (
      <div className={styles.loader}>
        <div className={styles.spinner} />
        <p>Loading…</p>
      </div>
    )
  }

  return (
    <div className={styles.app}>
      <Header totalProducts={products.length} totalSales={totalSales} />
      <TabNav active={tab} onChange={setTab} />

      <main className={styles.main}>
        {error && <div className={styles.error}>{error}</div>}

        {tab === 'inventory' && (
          products.length === 0
            ? <div className={styles.empty}>No products yet. Add one!</div>
            : (
              <div className={styles.grid}>
                {products.map((p) => (
                  <ProductCard
                    key={p.id}
                    product={p}
                    onSell={(p) => setModal({ product: p, type: 'sell' })}
                    onRestock={(p) => setModal({ product: p, type: 'restock' })}
                    onDelete={handleDelete}
                  />
                ))}
              </div>
            )
        )}

        {tab === 'sales' && <SalesTable sales={sales} />}

        {tab === 'add' && (
          <AddProductForm onAdd={handleAdd} loading={loading} />
        )}
      </main>

      {modal && (
        <Modal
          product={modal.product}
          type={modal.type}
          onConfirm={modal.type === 'sell' ? handleSellConfirm : handleRestockConfirm}
          onClose={() => setModal(null)}
          loading={loading}
        />
      )}
    </div>
  )
}
