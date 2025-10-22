'use client'
import Link from 'next/link'
import { useEffect, useState } from 'react'

export default function NavBar() {
  const [name, setName] = useState('')
  const [role, setRole] = useState('')
  const [loggedIn, setLoggedIn] = useState(false)

  const parseToken = () => {
    const token = localStorage.getItem('token')
    if (!token) {
      setLoggedIn(false)
      setName('')
      setRole('')
      return
    }
    try {
      const payload = JSON.parse(
        decodeURIComponent(escape(window.atob(token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/'))))
      )
      setName(payload.name || payload.email || '')
      setRole(payload.role || '')
      setLoggedIn(true)
    } catch (e) {
      setLoggedIn(false)
      setName('')
      setRole('')
    }
  }

  useEffect(() => {
    parseToken()
    window.addEventListener('login', parseToken)
    window.addEventListener('logout', parseToken)
    return () => {
      window.removeEventListener('login', parseToken)
      window.removeEventListener('logout', parseToken)
    }
  }, [])

  const logout = () => {
    localStorage.removeItem('token')
    window.dispatchEvent(new Event('logout'))
    window.location.href = '/'
  }

  return (
    <header className="p-4 border-b bg-white">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <Link href="/" className="text-xl font-bold">
          BuySmart
        </Link>

        <nav className="flex items-center gap-4">
          {!loggedIn && (
            <div className="flex gap-3">
              <Link href="/login" className="px-3 py-1 border rounded-md hover:bg-gray-100 transition">
                Login
              </Link>
              <Link href="/register" className="px-3 py-1 border rounded-md hover:bg-gray-100 transition">
                Register
              </Link>
            </div>
          )}

          {loggedIn && role === 'customer' && (
            <>
            <span className="text-sm">Hi, {name}</span>
              <Link href="/products">Products</Link>
              <Link href="/cart">Cart</Link>
              <div className="flex items-center gap-3">
                <button onClick={logout} className="px-3 py-1 border rounded-md hover:bg-red-300 transition">
                  Logout
                </button>
              </div>
            </>
          )}

          {loggedIn && role === 'admin' && (
            <>
              <span className="text-sm">Hi, {name}</span>
              <Link href="/admin/products">Manage Products</Link>
              <Link href="/reports">View Reports</Link>
              <div className="flex items-center gap-3">
                <button onClick={logout} className="px-3 py-1 border rounded-md hover:bg-red-300 transition">
                  Logout
                </button>
              </div>
            </>
          )}
        </nav>
      </div>
    </header>
  )
}
