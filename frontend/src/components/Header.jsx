import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../api/AuthContext'
import styles from './Header.module.css'
import logo from '../assets/images/logo.png'

const TABS = [
  { key: 'inventory', label: 'Inventory', path: '/' },
  { key: 'sales', label: 'Sales', path: '/sales' },
  { key: 'add', label: 'Add Product', path: '/add' },
]

export default function Header({ totalProducts = 0, totalSales = 0 }) {
  const { user, isAuthenticated, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  // Don't show full header on auth pages
  const isAuthPage =
    location.pathname === '/login' ||
    location.pathname === '/register' ||
    location.pathname === '/forgot-password' ||
    location.pathname.startsWith('/reset-password')

  // Determine active tab based on current path
  const getActiveTab = () => {
    if (location.pathname === '/') return 'inventory'
    if (location.pathname === '/sales') return 'sales'
    if (location.pathname === '/add') return 'add'
    return 'inventory'
  }

  return (
    <header className={styles.header}>
      {/* Top section: Brand + User Info + Stats */}
      <div className={styles.topSection}>
        <div className={styles.brand}>
          <div className={styles.logo}>
            <img src={logo} alt="African Bae Logo" />
          </div>
          <div>
            <h1 className={styles.title}>AFRICAN BAE</h1>
            <p className={styles.subtitle}>RECYCLE FOR A LIFE CYCLE</p>
          </div>
        </div>

        <div className={styles.topRight}>
          {isAuthenticated && user && !isAuthPage ? (
            <div className={styles.userInfo}>
              <span className={styles.username}>Welcome, {user.username}!</span>
              <button onClick={handleLogout} className={styles.logoutBtn}>
                Logout
              </button>
            </div>
          ) : !isAuthPage ? (
            <div className={styles.authLinks}>
              <Link to="/login" className={styles.link}>
                Login
              </Link>
              <Link to="/register" className={styles.link}>
                Register
              </Link>
            </div>
          ) : null}
        </div>
      </div>

      {/* Bottom section: Navigation tabs + Stats */}
      {isAuthenticated && !isAuthPage && (
        <nav className={styles.navSection}>
          <div className={styles.navTabs}>
            {TABS.map((tab) => (
              <button
                key={tab.key}
                className={`${styles.navTab} ${getActiveTab() === tab.key ? styles.active : ''}`}
                onClick={() => navigate(tab.path)}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className={styles.stats}>
            <div className={styles.stat}>
              <span className={styles.statLabel}>Total Products:</span>
              <span className={styles.statValue}>{totalProducts}</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.statLabel}>Total Sales:</span>
              <span className={styles.statValue}>{totalSales}</span>
            </div>
          </div>
        </nav>
      )}
    </header>
  )
}
