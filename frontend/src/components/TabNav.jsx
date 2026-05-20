import styles from './TabNav.module.css'

const TABS = [
  { key: 'inventory', label: 'Inventory', icon: '📦' },
  { key: 'sales',     label: 'Sales',     icon: '🛒' },
  { key: 'add',       label: 'Add Product', icon: '+' },
]

export default function TabNav({ active, onChange }) {
  return (
    <nav className={styles.nav}>
      {TABS.map((tab) => (
        <button
          key={tab.key}
          className={`${styles.tab} ${active === tab.key ? styles.active : ''}`}
          onClick={() => onChange(tab.key)}
        >
          <span className={styles.icon}>{tab.icon}</span>
          {tab.label}
        </button>
      ))}
    </nav>
  )
}
