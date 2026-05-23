import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './api/AuthContext'
import Header from './components/Header'
import Login from './components/Login'
import Register from './components/Register'
import Inventory from './components/Inventory'
import ProtectedRoute from './components/ProtectedRoute'
import styles from './App.module.css'

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <Header />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/*"
            element={
              <ProtectedRoute>
                <Inventory />
              </ProtectedRoute>
            }
          />
        </Routes>
      </AuthProvider>
    </Router>
  )
}
