import styles from './ProductCard.module.css';

export default function ProductCard({
  product,
  onSell,
  onRestock,
  onEdit,
  onDelete,
}) {
  const {
    name,
    category,
    description,
    price,
    stock,
  } = product;

  // Use the full URL from the backend
  const img =
    product.image_url?.replace("http://", "https://") ||
    product.image ||
    null;

  return (
    <div className={styles.card}>
      {img ? (
        <img
          src={img}
          alt={name}
          className={styles.img}
          onError={() => {
            console.error("Image load error:", img);
          }}
        />
      ) : (
        <div className={styles.noImage}>
          No image uploaded
        </div>
      )}

      <div className={styles.cardActions}>
        <button
          className={styles.editBtn}
          onClick={() => onEdit(product)}
          aria-label={`Edit ${name}`}
        >
          Edit
        </button>
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
          <span className={styles.price}>
            ${Number(price).toFixed(2)}
          </span>

          <span
            className={`${styles.stock} ${
              stock <= 5 ? styles.stockLow : ''
            }`}
          >
            Stock: {stock}
          </span>
        </div>

        <button
          className={styles.btnSell}
          onClick={() => onSell(product)}
          disabled={stock <= 0}
        >
          {stock <= 0 ? 'Out of Stock' : '🛒 Sell Product'}
        </button>

        <button
          className={styles.btnRestock}
          onClick={() => onRestock(product)}
        >
          + Restock
        </button>
      </div>
    </div>
  );
}