'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useAuth } from '@/lib/AuthContext'
import { useShop } from '@/lib/ShopContext'
import styles from './Header.module.css'

const TABS = [
  { key: 'inventory', label: 'Inventory', path: '/' },
  { key: 'sales', label: 'Sales', path: '/sales' },
  { key: 'add', label: 'Add Product', path: '/add' },
]

export default function Header() {
  const { user, isAuthenticated, logout } = useAuth()
  const { products, sales } = useShop()
  const router = useRouter()
  const pathname = usePathname()

  const handleLogout = async () => {
    await logout()
    router.push('/login')
  }

  // Don't show full header on auth pages
  const isAuthPage =
    pathname === '/login' ||
    pathname === '/register' ||
    pathname === '/forgot-password' ||
    pathname.startsWith('/reset-password')

  // Determine active tab based on current path
  const getActiveTab = () => {
    if (pathname === '/') return 'inventory'
    if (pathname === '/sales') return 'sales'
    if (pathname === '/add') return 'add'
    return 'inventory'
  }

  return (
    <header className={styles.header}>
      {/* Top section: Brand + User Info */}
      <div className={styles.topSection}>
        <div className={styles.brand}>
          <div className={styles.logo}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/images/logo.png" alt="African Bae Logo" />
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
              <Link href="/login" className={styles.link}>
                Login
              </Link>
              <Link href="/register" className={styles.link}>
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
                onClick={() => router.push(tab.path)}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className={styles.stats}>
            <div className={styles.stat}>
              <span className={styles.statLabel}>Total Products:</span>
              <span className={styles.statValue}>{products.length}</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.statLabel}>Total Sales:</span>
              <span className={styles.statValue}>{sales.length}</span>
            </div>
          </div>
        </nav>
      )}
    </header>
  )
}
