'use client'

import { useState } from 'react'
import { sellProduct } from '@/lib/api'
import { useShop } from '@/lib/ShopContext'
import SalesTable from './SalesTable'
import styles from './App.module.css'
import { formatTsh } from '@/utils/currency'

export default function SalesPage() {
  const { products, setProducts, sales, setSales, fetching, error } = useShop()
  const [loading, setLoading] = useState(false)
  const [selectedProductId, setSelectedProductId] = useState('')
  const [saleQty, setSaleQty] = useState('1')
  const [isProductMenuOpen, setIsProductMenuOpen] = useState(false)

  // ── Process Sale ───────────────────────────────────────────
  const handleProcessSale = async (e) => {
    e.preventDefault()
    if (!selectedProductId || !saleQty) return

    setLoading(true)
    try {
      const res = await sellProduct(selectedProductId, parseInt(saleQty))
      setProducts((prev) =>
        prev.map((p) => (String(p.id) === selectedProductId ? res.data.product : p))
      )
      setSales((prev) => [res.data.sale, ...prev])
      setSelectedProductId('')
      setSaleQty('1')
    } catch (err) {
      alert(err.response?.data?.quantity?.[0] || 'Sale failed.')
    } finally {
      setLoading(false)
    }
  }

  // ── Derived stats ──────────────────────────────────────────
  const totalSales = sales.reduce((s, x) => s + Number(x.total), 0)
  const selectedProduct = products.find((p) => String(p.id) === selectedProductId)

  if (fetching) return <div className={styles.loading}>Loading...</div>

  if (error) return <div className={styles.error}>{error}</div>

  return (
    <div className={styles.container}>
      <div className={styles.section}>
        {/* Stat Cards */}
        <div className={styles.statsGrid}>
          <div className={styles.statCard}>
            <div className={styles.statLabel}>Total Revenue</div>
            <div className={styles.statValue}>{formatTsh(totalSales)}</div>
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
            <div className={styles.productDropdown}>
              <button
                type="button"
                className={styles.productSelectButton}
                onClick={() => setIsProductMenuOpen((open) => !open)}
              >
                <span>
                  {selectedProduct
                    ? `${selectedProduct.name} (Stock: ${selectedProduct.stock})`
                    : 'Select a product...'}
                </span>
                <span className={styles.dropdownArrow}>▾</span>
              </button>

              {isProductMenuOpen && (
                <div className={styles.productOptions}>
                  {products.map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      className={`${styles.productOption} ${
                        String(p.id) === selectedProductId ? styles.productOptionActive : ''
                      }`}
                      onClick={() => {
                        setSelectedProductId(String(p.id))
                        setIsProductMenuOpen(false)
                      }}
                    >
                      <span>{p.name}</span>
                      <span>Stock: {p.stock}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
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
              <p className={styles.emptyText}>
                Sales will appear here once you process them
              </p>
            </div>
          ) : (
            <SalesTable sales={sales} />
          )}
        </div>
      </div>
    </div>
  )
}
