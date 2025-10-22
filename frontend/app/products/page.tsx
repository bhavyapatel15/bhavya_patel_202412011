'use client'
import axios from 'axios'
import { useEffect, useState } from 'react'

export default function ProductsPage() {
  const [items, setItems] = useState<any[]>([])
  const [categories, setCategories] = useState<string[]>([])
  const [q, setQ] = useState('')
  const [category, setCategory] = useState('')
  const [page, setPage] = useState(1)
  const [limit] = useState(9)
  const [loading, setLoading] = useState(false)
  const [sortAsc, setSortAsc] = useState(false)
  const [total, setTotal] = useState(0)

  useEffect(() => { fetchProducts() }, [page, sortAsc, category, q])
  useEffect(() => { fetchCategories() }, [])

  async function fetchProducts() {
    setLoading(true)
    try {
      const params: any = { page, limit }
      if (q) params.q = q
      if (category) params.category = category
      if (sortAsc) params.sort = 'asc'
      const base = process.env.NEXT_PUBLIC_API_URL || ''
      const res = await axios.get(base + '/api/products', { params })
      setItems(res.data.items || [])
      setTotal(res.data.total || 0)
    } catch (e) {
      setItems([])
    } finally {
      setLoading(false)
    }
  }

  async function fetchCategories() {
    try {
      const base = process.env.NEXT_PUBLIC_API_URL || ''
      const res = await axios.get(base + '/api/products/categories') 
      setCategories(res.data.categories || [])
    } catch (e) {
      console.error('Failed to fetch categories', e)
    }
  }

  function onSearch(e: any) {
    e.preventDefault()
    setPage(1)
    fetchProducts()
  }

  function toggleSort() {
    setPage(1)
    setSortAsc(s => !s)
  }

  const pages = Math.max(1, Math.ceil((total || items.length) / limit))

  return (
    <main className="p-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold">Products</h2>
        <div className="flex gap-3">
          <form onSubmit={onSearch} className="flex gap-2">
            <input
              value={q}
              onChange={e => setQ(e.target.value)}
              placeholder="Search products"
              className="px-3 py-2 border rounded-md"
            />
            <button className="px-3 py-2 bg-slate-800 text-white rounded-md">Search</button>
          </form>
          <div>
            <button onClick={toggleSort} className="px-3 py-2 border rounded-md">
              Sort: {sortAsc ? 'Price ↑' : 'Price ↓'}
            </button>
          </div>
        </div>
      </div>

      <div className="mb-4 flex gap-2">
        <select
          value={category}
          onChange={e => { setCategory(e.target.value); setPage(1); }}
          className="px-3 py-2 border rounded-md"
        >
          <option value="">All categories</option>
          {categories.map(c => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
        <button onClick={() => { setCategory(''); setPage(1); }} className="px-3 py-2 border rounded-md">Clear</button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="p-4 border rounded-md animate-pulse h-40" />
          ))}
        </div>
      ) : (
        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((p: any) => (
            <li key={p._id || p.sku || p.id} className="border rounded-lg p-4 flex flex-col justify-between">
              <div>
                <div className="h-40 rounded-md mb-3 overflow-hidden bg-gray-100">
                  <img
                    src={p.image || ('https://source.unsplash.com/featured/?' + encodeURIComponent(p.category || p.name || 'product'))}
                    alt={p.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="font-semibold text-lg">{p.name}</h3>
                <div className="text-sm text-gray-600">Category: {p.category || '—'}</div>
              </div>
              <div className="mt-4 flex items-center justify-between">
                <div className="text-xl font-bold">₹{p.price}</div>
                <button onClick={() => {
                  const cart = JSON.parse(localStorage.getItem('cart') || '[]')
                  const existing = cart.find((c: any) => c.productId === (p._id || p.sku || p.id))
                  if (existing) existing.quantity += 1
                  else cart.push({ productId: p._id || p.sku || p.id, name: p.name, price: p.price, quantity: 1 })
                  localStorage.setItem('cart', JSON.stringify(cart))
                  alert('Added to cart')
                }} className="px-3 py-2 bg-slate-800 text-white rounded-md">Add</button>
              </div>
            </li>
          ))}
        </ul>
      )}

      <div className="mt-6 flex items-center justify-between">
        <div>Page {page} of {pages}</div>
        <div className="flex gap-2">
          <button onClick={() => setPage(p => Math.max(1, p - 1))} className="px-3 py-2 border rounded-md">Prev</button>
          <button onClick={() => setPage(p => Math.min(pages, p + 1))} className="px-3 py-2 border rounded-md">Next</button>
        </div>
      </div>
    </main>
  )
}
