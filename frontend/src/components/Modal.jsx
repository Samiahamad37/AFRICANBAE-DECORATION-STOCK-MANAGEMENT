import { useState } from 'react'
import styles from './Modal.module.css'

export default function Modal({ product, type, onConfirm, onClose, loading }) {
  const [qty, setQty] = useState(1)
  const isSell = type === 'sell'

  const handleConfirm = () => {
    if (loading) return
    if (qty < 1) return
    if (isSell && qty > product.stock) return
    onConfirm(qty)
  }

  return (
    <div className={styles.overlay} onClick={() => {
      if (!loading) onClose()
    }}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <h3 className={styles.title}>
          {isSell ? 'Sell Product' : 'Restock Product'}
        </h3>
        <p className={styles.productName}>{product.name}</p>
        <p className={styles.stockInfo}>Current stock: <strong>{product.stock}</strong></p>

        <label className={styles.label}>
          Quantity to {isSell ? 'sell' : 'add'}
        </label>
        <input
          type="number"
          className={styles.input}
          min={1}
          max={isSell ? product.stock : undefined}
          value={qty}
          onChange={(e) => setQty(Math.max(1, parseInt(e.target.value) || 1))}
        />

        {isSell && qty > product.stock && (
          <p className={styles.error}>Not enough stock!</p>
        )}

        <div className={styles.actions}>
          <button className={styles.btnCancel} onClick={onClose} disabled={loading}>
            Cancel
          </button>
          <button
            className={isSell ? styles.btnSell : styles.btnRestock}
            onClick={handleConfirm}
            disabled={loading || (isSell && qty > product.stock)}
          >
            {loading ? 'Processing…' : isSell ? 'Confirm Sale' : 'Add Stock'}
          </button>
        </div>
      </div>
    </div>
  )
}
