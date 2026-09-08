import ProtectedRoute from '@/components/ProtectedRoute'
import SalesPage from '@/components/SalesPage'

export default function Sales() {
  return (
    <ProtectedRoute>
      <SalesPage />
    </ProtectedRoute>
  )
}
