import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../api/AuthContext'
import styles from './Header.module.css'
import logo from '../assets/images/logo.png'

export default function Header() {
  const { user, isAuthenticated, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  // Don't show full header on auth pages
  const isAuthPage = location.pathname === '/login' || location.pathname === '/register'

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

      <div className={styles.auth}>
        {isAuthenticated && !isAuthPage ? (
          <div className={styles.userInfo}>
            <span className={styles.username}>Welcome, {user?.username}!</span>
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
    </header>
  )
}
