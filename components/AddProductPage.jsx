'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createProduct } from '@/lib/api'
import { useShop } from '@/lib/ShopContext'
import AddProductForm from './AddProductForm'
import styles from './App.module.css'

export default function AddProductPage() {
  const router = useRouter()
  const { setProducts } = useShop()
  const [loading, setLoading] = useState(false)

  const handleAdd = async (formData, onSuccess) => {
    setLoading(true)
    try {
      const res = await createProduct(formData)
      setProducts((prev) => [res.data, ...prev])
      onSuccess()
      router.push('/')
    } catch (e) {
      alert('Failed to add product. Check your inputs.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.section}>
        <h2>Add New Product</h2>
        <AddProductForm onAdd={handleAdd} loading={loading} />
      </div>
    </div>
  )
}
