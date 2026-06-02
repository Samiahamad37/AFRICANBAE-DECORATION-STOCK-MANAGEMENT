import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { AuthProvider } from './api/AuthContext'
import { getProducts, getSales } from './api/client'
import Header from './components/Header'
import Login from './components/Login'
import Register from './components/Register'
import Inventory from './components/Inventory'
import ForgotPassword from './components/password-reset'
import ResetPasswordConfirm from './components/passwordreset-confirm'
import ProtectedRoute from './components/ProtectedRoute'
import styles from './App.module.css'

export default function App() {
  const [products, setProducts] = useState([])
  const [sales, setSales] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsRes, salesRes] = await Promise.all([getProducts(), getSales()])
        setProducts(productsRes.data.results ?? productsRes.data)
        setSales(salesRes.data.results ?? salesRes.data)
      } catch (e) {
        console.error('Failed to fetch data')
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  return (
    <Router>
      <AuthProvider>
        <Header totalProducts={products.length} totalSales={sales.length} />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          {/* <Route path="/reset-password" element={<ResetPasswordConfirm />} /> */}
          <Route
            path="/reset-password/:uidb64/:token"
            element={<ResetPasswordConfirm />}
          />

          <Route
            path="/*"
            element={
              <ProtectedRoute>
                <Inventory products={products} setProducts={setProducts} sales={sales} setSales={setSales} />
              </ProtectedRoute>
            }
          />
        </Routes>
      </AuthProvider>
    </Router>
  )
}
