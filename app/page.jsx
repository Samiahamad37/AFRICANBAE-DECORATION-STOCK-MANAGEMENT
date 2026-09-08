import ProtectedRoute from '@/components/ProtectedRoute'
import InventoryPage from '@/components/InventoryPage'

export default function Home() {
  return (
    <ProtectedRoute>
      <InventoryPage />
    </ProtectedRoute>
  )
}
