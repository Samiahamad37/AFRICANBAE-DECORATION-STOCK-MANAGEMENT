import './globals.css'
import { AuthProvider } from '@/lib/AuthContext'
import { ShopProvider } from '@/lib/ShopContext'
import Header from '@/components/Header'

export const metadata = {
  title: 'AfricanBae Manager',
  description: 'African Bae — decoration stock management. Recycle for a life cycle.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <ShopProvider>
            <Header />
            <main>{children}</main>
          </ShopProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
