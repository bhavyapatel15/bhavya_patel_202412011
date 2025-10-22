'use client'
import axios from 'axios'
import { useEffect, useState } from 'react'
export default function CartPage() {
  const [items, setItems] = useState<any[]>([])
  useEffect(()=>{ const c = JSON.parse(localStorage.getItem('cart')||'[]'); setItems(c) }, [])
  function remove(index:number) {
    const next = items.slice()
    next.splice(index,1)
    setItems(next)
    localStorage.setItem('cart', JSON.stringify(next))
  }
  function updateQty(index:number, q:number) {
    if (q < 1) return
    const next = items.slice()
    next[index].quantity = q
    setItems(next)
    localStorage.setItem('cart', JSON.stringify(next))
  }
  function total() {
    return items.reduce((s, it) => s + (it.price * it.quantity), 0)
  }
  async function checkout() {
    const token = localStorage.getItem('token') || ''
    if (!token) { alert('Please login to checkout'); return }
    try {
      const base = process.env.NEXT_PUBLIC_API_URL || ''
      const res = await axios.post(base + '/api/orders/checkout', { items }, { headers: { authorization: 'Bearer ' + token } })
      localStorage.removeItem('cart')
      setItems([])
      alert('Order created: ' + (res.data.id || res.data.id))
    } catch (e:any) {
      alert('Checkout failed')
    }
  }
  return (
    <main className="p-6 max-w-3xl mx-auto">
      <h2 className="text-2xl font-semibold mb-4">Cart</h2>
      {items.length === 0 ? (
        <div className="text-gray-600">Your cart is empty</div>
      ) : (
        <div className="space-y-4">
          {items.map((it, idx)=>(
            <div key={it.productId} className="flex items-center justify-between border p-4 rounded-md">
              <div>
                <div className="font-semibold">{it.name}</div>
                <div className="text-sm text-gray-600">₹{it.price} each</div>
              </div>
              <div className="flex items-center gap-3">
                <input type="number" value={it.quantity} onChange={e=>updateQty(idx, Number(e.target.value))} className="w-20 px-2 py-1 border rounded-md" />
                <div className="font-semibold">₹{it.price * it.quantity}</div>
                <button onClick={()=>remove(idx)} className="px-3 py-1 bg-red-600 text-white rounded-md">Remove</button>
              </div>
            </div>
          ))}
          <div className="flex items-center justify-between">
            <div className="text-xl font-bold">Total: ₹{total()}</div>
            <div>
              <button onClick={checkout} className="px-4 py-2 bg-emerald-600 text-white rounded-md">Checkout</button>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}
