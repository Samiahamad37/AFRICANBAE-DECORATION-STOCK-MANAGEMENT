'use client'

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from 'react'
import { useAuth } from './AuthContext'
import { getProducts, getSales } from './api'

const ShopContext = createContext()

export function ShopProvider({ children }) {
  const { isAuthenticated, loading: authLoading } = useAuth()
  const [products, setProducts] = useState([])
  const [sales, setSales] = useState([])
  const [fetching, setFetching] = useState(true)
  const [error, setError] = useState(null)

  const loadAll = useCallback(async () => {
    if (!isAuthenticated) {
      setProducts([])
      setSales([])
      setFetching(false)
      return
    }
    try {
      setFetching(true)
      const [pRes, sRes] = await Promise.all([getProducts(), getSales()])
      setProducts(pRes.data.results ?? pRes.data)
      setSales(sRes.data.results ?? sRes.data)
      setError(null)
    } catch (e) {
      setError('Failed to load data. Please try again.')
    } finally {
      setFetching(false)
    }
  }, [isAuthenticated])

  useEffect(() => {
    if (!authLoading) loadAll()
  }, [loadAll, authLoading])

  return (
    <ShopContext.Provider
      value={{ products, setProducts, sales, setSales, fetching, error, loadAll }}
    >
      {children}
    </ShopContext.Provider>
  )
}

export const useShop = () => {
  const context = useContext(ShopContext)
  if (!context) {
    throw new Error('useShop must be used within ShopProvider')
  }
  return context
}
