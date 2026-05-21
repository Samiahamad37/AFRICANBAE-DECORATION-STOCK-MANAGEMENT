import styles from './Header.module.css'
import logo from '../assets/images/logo.png'

export default function Header({ totalProducts, totalSales }) {
  return (
    <header className={styles.header}>
      <div className={styles.brand}>
        <div className={styles.logo}>
          <img src={logo} alt="African Bae Logo" />
        </div>
        <div>
          <h1 className={styles.title}>AFRICAN BAE</h1>
          <p className={styles.subtitle}>Recycle for a Life cycle</p>
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
