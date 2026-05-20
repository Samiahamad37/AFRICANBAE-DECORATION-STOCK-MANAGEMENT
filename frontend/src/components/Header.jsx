import styles from './Header.module.css'

export default function Header({ totalProducts, totalSales }) {
  return (
    <header className={styles.header}>
      <div className={styles.brand}>
        <div className={styles.logo}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
          </svg>
        </div>
        <div>
          <h1 className={styles.title}>Decoration Shop Manager</h1>
          <p className={styles.subtitle}>Manage your inventory and sales</p>
        </div>
      </div>
      <div className={styles.stats}>
        <div className={styles.stat}>
          Total Products: <strong>{totalProducts}</strong>
        </div>
        <div className={styles.stat}>
          Total Sales: <strong>${Number(totalSales).toFixed(2)}</strong>
        </div>
      </div>
    </header>
  )
}
