import styles from './SalesTable.module.css'

export default function SalesTable({ sales }) {
  if (!sales.length) {
    return (
      <div className={styles.empty}>
        <p>🧾 No sales recorded yet.</p>
        <p>Go to Inventory and sell a product to see it here.</p>
      </div>
    )
  }

  const grandTotal = sales.reduce((s, x) => s + Number(x.total), 0)

  return (
    <div className={styles.wrap}>
      <div className={styles.summary}>
        Grand total revenue: <strong>${grandTotal.toFixed(2)}</strong>
        &nbsp;·&nbsp; {sales.length} transaction{sales.length !== 1 ? 's' : ''}
      </div>
      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>#</th>
              <th>Product</th>
              <th>Category</th>
              <th>Qty</th>
              <th>Unit Price</th>
              <th>Total</th>
              <th>Date</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {sales.map((s, i) => (
              <tr key={s.id}>
                <td className={styles.num}>{i + 1}</td>
                <td>{s.product_name}</td>
                <td className={styles.muted}>{s.product_category}</td>
                <td>{s.quantity}</td>
                <td>${Number(s.unit_price).toFixed(2)}</td>
                <td className={styles.bold}>${Number(s.total).toFixed(2)}</td>
                <td className={styles.muted}>
                  {new Date(s.sold_at).toLocaleDateString()}
                </td>
                <td><span className={styles.badge}>Sold</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
