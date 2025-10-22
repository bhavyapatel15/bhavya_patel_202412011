'use client'
import axios from 'axios'
import { useEffect, useState } from 'react'

function BarChart({ data, labelKey, valueKey, title }: any) {
  if (!data || data.length === 0) return <div>No data</div>
  const max = Math.max(...data.map((d:any)=>d[valueKey] || 0))
  return (
    <div>
      <h4 className="font-semibold mb-2">{title}</h4>
      <div className="space-y-2">
        {data.map((d:any, i:number)=>{
          const val = d[valueKey] || 0
          const w = Math.round((val / (max || 1)) * 100)
          return (
            <div key={i} className="flex items-center gap-3">
              <div className="w-28 text-sm">{d[labelKey]}</div>
              <div className="flex-1 bg-gray-200 rounded h-6 overflow-hidden">
                <div style={{ width: w + '%' }} className="h-6 bg-slate-800"></div>
              </div>
              <div className="w-20 text-right text-sm">₹{val.toFixed ? val.toFixed(2) : val}</div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default function ReportsPage() {
  const [sql, setSql] = useState<any>(null)
  const [mongo, setMongo] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  useEffect(()=>{ fetchReports() }, [])
  async function fetchReports() {
    setLoading(true)
    try {
      const base = process.env.NEXT_PUBLIC_API_URL || ''
      const token = localStorage.getItem('token') || ''
      const headers = token ? { authorization: 'Bearer ' + token } : {}
      const [r1, r2] = await Promise.all([
        axios.get(base + '/api/reports/sql', { headers }),
        axios.get(base + '/api/reports/mongo', { headers })
      ])
      setSql(r1.data)
      setMongo(r2.data)
    } catch (e) {
      setSql(null); setMongo(null)
    } finally {
      setLoading(false)
    }
  }
  return (
    <main className="p-6 max-w-6xl mx-auto">
      <h2 className="text-2xl font-semibold mb-4">Reports</h2>
      {loading ? <div>Loading...</div> : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 border rounded-md">
            <BarChart data={sql?.dailyRevenue || []} labelKey="date" valueKey="revenue" title="Daily Revenue (last 7 days)" />
          </div>
          <div className="p-4 border rounded-md">
            <BarChart data={mongo?.categoryStats || []} labelKey="category" valueKey="count" title="Products by Category" />
          </div>
        </div>
      )}
    </main>
  )
}