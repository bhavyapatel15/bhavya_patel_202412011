'use client'
import axios from 'axios'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState<string[]>([])
  const router = useRouter()

  const validateEmail = (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)

  const submit = async (e: any) => {
    e.preventDefault()
    const validationErrors: string[] = []

    if (!email.trim()) validationErrors.push('Email is required')
    else if (!validateEmail(email)) validationErrors.push('Invalid email format')

    if (!password.trim()) validationErrors.push('Password is required')
    else if (password.length < 6) validationErrors.push('Password must be at least 6 characters')

    setErrors(validationErrors)
    if (validationErrors.length > 0) return

    try {
      const base = process.env.NEXT_PUBLIC_API_URL || ''
      const r = await axios.post(base + '/api/auth/login', { email, password })
      localStorage.setItem('token', r.data.token)

      window.dispatchEvent(new Event('login'))

      router.push('/products')
    } catch (err: any) {
      setErrors([err?.response?.data?.error || 'Login failed'])
    }
  }

  return (
    <main className="p-6 max-w-md mx-auto">
      <h2 className="text-2xl font-semibold mb-4">Login</h2>

      {errors.length > 0 && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md space-y-1">
          {errors.map((err, i) => (
            <div key={i}>• {err}</div>
          ))}
        </div>
      )}

      <form onSubmit={submit} className="space-y-3">
        <input
          value={email}
          type="email"
          onChange={e => setEmail(e.target.value)}
          placeholder="Email"
          className="w-full px-3 py-2 border rounded-md focus:outline-blue-500"
        />
        <input
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          placeholder="Password"
          className="w-full px-3 py-2 border rounded-md focus:outline-blue-500"
        />
        <div className="flex gap-2">
          <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition">
            Login
          </button>
        </div>
      </form>
    </main>
  )
}
