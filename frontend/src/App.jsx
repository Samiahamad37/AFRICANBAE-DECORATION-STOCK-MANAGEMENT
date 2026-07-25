import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { useState } from 'react'
import { AuthProvider } from './api/AuthContext'
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
