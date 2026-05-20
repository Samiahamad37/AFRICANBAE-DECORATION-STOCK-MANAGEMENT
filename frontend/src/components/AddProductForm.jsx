import { useState } from 'react'
import styles from './AddProductForm.module.css'

const EMPTY = { name: '', category: '', description: '', price: '', stock: '' }

export default function AddProductForm({ onAdd, loading }) {
  const [form, setForm] = useState(EMPTY)
  const [image, setImage] = useState(null)
  const [preview, setPreview] = useState(null)
  const [errors, setErrors] = useState({})

  const set = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }))

  const handleImage = (e) => {
    const file = e.target.files[0]
    if (!file) return
    setImage(file)
    setPreview(URL.createObjectURL(file))
  }

  const validate = () => {
    const errs = {}
    if (!form.name.trim()) errs.name = 'Name is required'
    if (!form.category.trim()) errs.category = 'Category is required'
    if (!form.price || isNaN(form.price) || Number(form.price) < 0)
      errs.price = 'Valid price required'
    if (!form.stock || isNaN(form.stock) || Number(form.stock) < 0)
      errs.stock = 'Valid stock required'
    return errs
  }

  const handleSubmit = () => {
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }
    setErrors({})

    const data = new FormData()
    data.append('name', form.name.trim())
    data.append('category', form.category.trim())
    data.append('description', form.description.trim())
    data.append('price', form.price)
    data.append('stock', form.stock)
    if (image) data.append('image', image)

    onAdd(data, () => {
      setForm(EMPTY)
      setImage(null)
      setPreview(null)
    })
  }

  return (
    <div className={styles.wrap}>
      <h2 className={styles.heading}>Add New Product</h2>

      {preview && (
        <img src={preview} alt="Preview" className={styles.preview} />
      )}

      <label className={styles.label}>Product Image</label>
      <input type="file" accept="image/*" onChange={handleImage} className={styles.fileInput} />

      <label className={styles.label}>Product Name *</label>
      <input
        className={`${styles.input} ${errors.name ? styles.inputError : ''}`}
        placeholder="e.g. Rattan Basket"
        value={form.name}
        onChange={set('name')}
      />
      {errors.name && <p className={styles.error}>{errors.name}</p>}

      <label className={styles.label}>Category *</label>
      <input
        className={`${styles.input} ${errors.category ? styles.inputError : ''}`}
        placeholder="e.g. Wall Art"
        value={form.category}
        onChange={set('category')}
      />
      {errors.category && <p className={styles.error}>{errors.category}</p>}

      <label className={styles.label}>Description</label>
      <textarea
        className={styles.textarea}
        placeholder="Short product description…"
        value={form.description}
        onChange={set('description')}
        rows={3}
      />

      <div className={styles.row}>
        <div className={styles.col}>
          <label className={styles.label}>Price ($) *</label>
          <input
            className={`${styles.input} ${errors.price ? styles.inputError : ''}`}
            type="number"
            min="0"
            step="0.01"
            placeholder="0.00"
            value={form.price}
            onChange={set('price')}
          />
          {errors.price && <p className={styles.error}>{errors.price}</p>}
        </div>
        <div className={styles.col}>
          <label className={styles.label}>Initial Stock *</label>
          <input
            className={`${styles.input} ${errors.stock ? styles.inputError : ''}`}
            type="number"
            min="0"
            placeholder="0"
            value={form.stock}
            onChange={set('stock')}
          />
          {errors.stock && <p className={styles.error}>{errors.stock}</p>}
        </div>
      </div>

      <button className={styles.submit} onClick={handleSubmit} disabled={loading}>
        {loading ? 'Adding…' : '+ Add Product'}
      </button>
    </div>
  )
}
