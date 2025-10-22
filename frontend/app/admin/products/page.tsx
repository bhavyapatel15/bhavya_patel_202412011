'use client'
import axios from 'axios'
import { useEffect, useState } from 'react'

interface ProductForm {
  sku: string
  name: string
  price: string
  category: string
  image?: string
}

interface Product {
  _id: string
  sku: string
  name: string
  price: number
  category: string
  image?: string
}

export default function AdminProducts() {
  const [items, setItems] = useState<Product[]>([])
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [editing, setEditing] = useState<Product | null>(null)
  const [form, setForm] = useState<ProductForm>({ sku: '', name: '', price: '', category: '', image: '' })
  const [file, setFile] = useState<File | null>(null)
  const [message, setMessage] = useState<string>('')

  useEffect(() => { fetchList() }, [])

  const tokenHeader = () => {
    const token = localStorage.getItem('token') || ''
    return token ? { Authorization: 'Bearer ' + token } : {}
  }

  const fetchList = async () => {
    setLoading(true)
    try {
      const base = process.env.NEXT_PUBLIC_API_URL || ''
      const res = await axios.get(base + '/api/products', { headers: tokenHeader() })
      setItems(res.data.items || [])
    } catch (err) {
      console.error(err)
      setItems([])
    } finally { setLoading(false) }
  }

  const validateForm = (): boolean => {
    if (!form.name.trim()) { alert('Name is required'); return false }
    if (!form.category.trim()) { alert('Category is required'); return false }
    if (!form.price.trim() || Number(form.price) <= 0) { alert('Price must be greater than 0'); return false }
    return true
  }

  const save = async () => {
    if (!validateForm()) return
    setSaving(true)
    try {
      const base = process.env.NEXT_PUBLIC_API_URL || ''
      const formData = new FormData()
      formData.append('sku', form.sku)
      formData.append('name', form.name)
      formData.append('price', form.price)
      formData.append('category', form.category)

      if (file) {
        formData.append('image', file)
      } else if (!editing?.image) {
        const q = encodeURIComponent((form.category || form.name).split(' ')[0])
        formData.append('image', `https://source.unsplash.com/featured/?${q}`)
      }

      if (editing) {
        await axios.put(
          base + '/api/products/' + editing._id,
          formData,
          { headers: { ...tokenHeader(), 'Content-Type': 'multipart/form-data' } }
        )
        setMessage('Product updated successfully!')
      } else {
        await axios.post(
          base + '/api/products',
          formData,
          { headers: { ...tokenHeader(), 'Content-Type': 'multipart/form-data' } }
        )
        setMessage('Product created successfully!')
      }

      setForm({ sku: '', name: '', price: '', category: '', image: '' })
      setFile(null)
      setEditing(null)
      fetchList()
      setTimeout(() => setMessage(''), 3000)
    } catch (err: any) {
      alert(err?.response?.data?.error || 'Save failed')
      console.error(err)
    } finally { setSaving(false) }
  }

  const remove = async (id: string) => {
    if (!confirm('Delete product?')) return
    try {
      const base = process.env.NEXT_PUBLIC_API_URL || ''
      await axios.delete(base + '/api/products/' + id, { headers: tokenHeader() })
      setMessage('Product deleted successfully!')
      fetchList()
      setTimeout(() => setMessage(''), 3000)
    } catch (err) { alert('Delete failed'); console.error(err) }
  }

  const edit = (product: Product) => {
    setEditing(product)
    setForm({
      sku: product.sku || '',
      name: product.name || '',
      price: String(product.price || ''),
      category: product.category || '',
      image: product.image || ''
    })
    setFile(null)
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null
    setFile(selectedFile)
  }

  return (
    <main className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-semibold mb-4">Admin - Products</h2>

      {message && <div className="mb-4 p-3 bg-green-100 text-green-800 rounded-md">{message}</div>}

      <div className="mb-4 grid grid-cols-1 md:grid-cols-2 gap-4">

        <div className="border p-4 rounded-md">
          <h3 className="font-semibold mb-2">{editing ? 'Edit product' : 'Create product'}</h3>

          <input
            value={form.sku}
            onChange={e => setForm(f => ({ ...f, sku: e.target.value }))}
            placeholder="SKU"
            className="w-full px-3 py-2 border rounded-md mb-2 focus:outline-blue-500"
          />
          <input
            value={form.name}
            onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
            placeholder="Name"
            className="w-full px-3 py-2 border rounded-md mb-2 focus:outline-blue-500"
          />
          <input
            type="text"
            value={form.price}
            onChange={e => {
              const val = e.target.value
              if (/^\d*\.?\d*$/.test(val)) setForm(f => ({ ...f, price: val }))
            }}
            placeholder="Price"
            className="w-full px-3 py-2 border rounded-md mb-2 focus:outline-blue-500"
          />
          <input
            value={form.category}
            onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
            placeholder="Category"
            className="w-full px-3 py-2 border rounded-md mb-2 focus:outline-blue-500"
          />

          <label className="block font-medium mb-1">Product Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="w-full mb-2 border p-1 rounded-md"
          />

          <div className="flex gap-2 mt-2">
            <button
              onClick={save}
              disabled={saving}
              className="px-3 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition"
            >
              {editing ? (saving ? 'Saving...' : 'Save') : (saving ? 'Creating...' : 'Create')}
            </button>
            <button
              onClick={() => { setEditing(null); setForm({ sku: '', name: '', price: '', category: '', image: '' }); setFile(null) }}
              className="px-3 py-2 border rounded-md hover:bg-gray-100 transition"
            >
              Cancel
            </button>
          </div>
        </div>

        <div className="border p-4 rounded-md">
          <h3 className="font-semibold mb-2">Products</h3>
          <div className="space-y-2">
            {loading ? <div>Loading...</div> : items.map(it => (
              <div key={it._id} className="flex items-center justify-between p-2 border rounded-md">
                <div>
                  <div className="font-semibold">{it.name}</div>
                  <div className="text-sm text-gray-600">{it.category} • ₹{it.price}</div>
                  {it.image && (
                    <img
                      src={it.image.startsWith('http') ? it.image : `${process.env.NEXT_PUBLIC_API_URL}${it.image}`}
                      alt={it.name}
                      className="mt-1 w-24 h-24 object-cover rounded"
                    />
                  )}
                </div>
                <div className="flex gap-2">
                  <button onClick={() => edit(it)} className="px-2 py-1 border rounded-md hover:bg-gray-100 transition">Edit</button>
                  <button onClick={() => remove(it._id)} className="px-2 py-1 bg-red-600 text-white rounded-md hover:bg-red-700 transition">Delete</button>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </main>
  )
}
