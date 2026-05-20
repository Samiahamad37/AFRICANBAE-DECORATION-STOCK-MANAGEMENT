import styles from './ProductCard.module.css'

const FALLBACK = 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=400&q=80'

export default function ProductCard({ product, onSell, onRestock, onDelete }) {
  const { name, category, description, price, stock, image_url } = product

  return (
    <div className={styles.card}>
      <div className={styles.imgWrap}>
        <img
          src={image_url || FALLBACK}
          alt={name}
          className={styles.img}
          onError={(e) => { e.target.src = FALLBACK }}
        />
        <button
          className={styles.delBtn}
          onClick={() => onDelete(product.id)}
          aria-label={`Delete ${name}`}
        >
          🗑
        </button>
      </div>

      <div className={styles.body}>
        <p className={styles.name}>{name}</p>
        <p className={styles.category}>{category}</p>
        <p className={styles.desc}>{description}</p>

        <div className={styles.meta}>
          <span className={styles.price}>${Number(price).toFixed(2)}</span>
          <span className={`${styles.stock} ${stock <= 5 ? styles.stockLow : ''}`}>
            Stock: {stock}
          </span>
        </div>

        <button className={styles.btnSell} onClick={() => onSell(product)}>
          🛒 Sell Product
        </button>
        <button className={styles.btnRestock} onClick={() => onRestock(product)}>
          + Restock
        </button>
      </div>
    </div>
  )
}
