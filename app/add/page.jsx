import ProtectedRoute from '@/components/ProtectedRoute'
import AddProductPage from '@/components/AddProductPage'

export default function Add() {
  return (
    <ProtectedRoute>
      <AddProductPage />
    </ProtectedRoute>
  )
}
