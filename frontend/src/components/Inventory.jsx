import { useState, useEffect, useCallback } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import {
  getProducts, createProduct, updateProduct, deleteProduct,
  sellProduct, restockProduct, getSales,
} from '../api/client'
import ProductCard from './ProductCard'
import Modal from './Modal'
import AddProductForm from './AddProductForm'
import SalesTable from './SalesTable'
import styles from '../App.module.css'
import modalStyles from './Modal.module.css'

export default function Inventory({
  setProducts: setHeaderProducts,
  setSales: setHeaderSales,
} = {}) {
  const location = useLocation()
  const navigate = useNavigate()
  const [products, setProducts] = useState([])
  const [sales, setSales] = useState([])
  const [modal, setModal] = useState(null)   // { product, type: 'sell'|'restock' }
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)
  const [error, setError] = useState(null)
  const [selectedProductId, setSelectedProductId] = useState('')
  const [saleQty, setSaleQty] = useState('1')
  const [editingProduct, setEditingProduct] = useState(null)

  // Determine active tab based on location pathname
  const currentTab = location.pathname === '/sales' ? 'sales' : location.pathname === '/add' ? 'add' : 'inventory'

  const syncProducts = (updater) => {
    setProducts(updater)
    setHeaderProducts?.(updater)
  }

  const syncSales = (updater) => {
    setSales(updater)
    setHeaderSales?.(updater)
  }

  const loadAll = useCallback(async () => {
    try {
      setFetching(true)
      const [pRes, sRes] = await Promise.all([getProducts(), getSales()])
      const productList = pRes.data.results ?? pRes.data
      const salesList = sRes.data.results ?? sRes.data
      setProducts(productList)
      setSales(salesList)
      setHeaderProducts?.(productList)
      setHeaderSales?.(salesList)
    } catch (e) {
      setError('Failed to connect to server. Is the Django backend running?')
    } finally {
      setFetching(false)
    }
  }, [setHeaderProducts, setHeaderSales])

  useEffect(() => { loadAll() }, [loadAll])

  // ── Sell ──────────────────────────────────────────────────
  const handleSellConfirm = async (productId, qty) => {
    if (loading) return
    setLoading(true)
    try {
      const res = await sellProduct(productId, qty)
      syncProducts((prev) =>
        prev.map((p) => (p.id === productId ? res.data.product : p))
      )
      syncSales((prev) => [res.data.sale, ...prev])
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
      syncProducts((prev) =>
        prev.map((p) => (p.id === productId ? res.data : p))
      )
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
      syncProducts((prev) => prev.filter((p) => p.id !== id))
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
      syncProducts((prev) =>
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

  // ── Process Sale (from Sales page) ─────────────────────────
  const handleProcessSale = async (e) => {
    e.preventDefault()
    if (!selectedProductId || !saleQty) return

    setLoading(true)
    try {
      const res = await sellProduct(selectedProductId, parseInt(saleQty))
      syncProducts((prev) =>
        prev.map((p) => (String(p.id) === selectedProductId ? res.data.product : p))
      )
      syncSales((prev) => [res.data.sale, ...prev])
      setSelectedProductId('')
      setSaleQty('1')
    } catch (e) {
      alert(e.response?.data?.quantity?.[0] || 'Sale failed.')
    } finally {
      setLoading(false)
    }
  }

  // ── Add product ────────────────────────────────────────────
  const handleAdd = async (formData, onSuccess) => {
    setLoading(true)
    try {
      const res = await createProduct(formData)
      syncProducts((prev) => [res.data, ...prev])
      onSuccess()
      navigate('/')
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
      {currentTab === 'inventory' && (
        <div className={styles.section}>
          <div className={styles.header}>
            <h2>Inventory</h2>
          </div>
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
      )}

      {currentTab === 'sales' && (
        <div className={styles.section}>
          {/* Stat Cards */}
          <div className={styles.statsGrid}>
            <div className={styles.statCard}>
              <div className={styles.statLabel}>Total Revenue</div>
              <div className={styles.statValue}>${totalSales.toFixed(2)}</div>
              <div className={styles.statIcon}>💵</div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statLabel}>Total Sales</div>
              <div className={styles.statValue}>{sales.length}</div>
              <div className={styles.statIcon}>🛒</div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statLabel}>Items Sold</div>
              <div className={styles.statValue}>
                {sales.reduce((sum, s) => sum + (s.quantity || 0), 0)}
              </div>
              <div className={styles.statIcon}>📈</div>
            </div>
          </div>

          {/* Process New Sale Form */}
          <div className={styles.processSection}>
            <h3>Process New Sale</h3>
            <form onSubmit={handleProcessSale} className={styles.processForm}>
              <select
                value={selectedProductId}
                onChange={(e) => setSelectedProductId(e.target.value)}
                className={styles.productSelect}
                required
              >
                <option value="">Select a product...</option>
                {products.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} (Stock: {p.stock})
                  </option>
                ))}
              </select>
              <input
                type="number"
                min="1"
                value={saleQty}
                onChange={(e) => setSaleQty(e.target.value)}
                className={styles.qtyInput}
                required
              />
              <button
                type="submit"
                disabled={loading || !selectedProductId}
                className={styles.processSaleBtn}
              >
                {loading ? 'Processing...' : 'Process Sale'}
              </button>
            </form>
          </div>

          {/* Sales History */}
          <div className={styles.historySection}>
            <h3>Sales History</h3>
            {sales.length === 0 ? (
              <div className={styles.emptyState}>
                <div className={styles.emptyIcon}>🛒</div>
                <p className={styles.emptyTitle}>No sales yet</p>
                <p className={styles.emptyText}>Sales will appear here once you process them</p>
              </div>
            ) : (
              <SalesTable sales={sales} />
            )}
          </div>
        </div>
      )}

      {currentTab === 'add' && (
        <div className={styles.section}>
          <h2>Add New Product</h2>
          <AddProductForm onAdd={handleAdd} loading={loading} />
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
