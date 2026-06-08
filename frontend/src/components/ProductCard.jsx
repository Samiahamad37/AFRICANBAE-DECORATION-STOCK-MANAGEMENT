import styles from './ProductCard.module.css'

export default function ProductCard({ product, onSell, onRestock, onDelete }) {
  const {
    name,
    category,
    description,
    price,
    stock,
    image,
    image_url,
    
  } = product;

const img = image_url || image;


  return (
    <div className={styles.card}>

      {img ? (
        <img
          src={img}
          alt={name}
          className={styles.img}
          onError={(e) => {
    console.error("Image load error:", img);
    e.target.onerror = null;
    e.target.src = "/default-image.png";
}}
          onLoad={(e) => {
            console.log('Image loaded successfully:', img);
          }}
        />
      ) : (
        <div className={styles.noImage}>
          No image uploaded
        </div>
      )}

      <button
        className={styles.delBtn}
        onClick={() => onDelete(product.id)}
        aria-label={`Delete ${name}`}
      >
        🗑
      </button>

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