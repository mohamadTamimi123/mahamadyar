'use client'

import React, { useEffect, useState } from 'react'
import axios from 'axios'
import PersonalTree, { TreeNode } from '@/components/PersonalTree'

export default function DashboardTreePage() {
  const [data, setData] = useState<TreeNode | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetch = async () => {
      try {
        setLoading(true)
        const res = await axios.get('http://localhost:5000/family-members')
        const members = res.data as Array<{id: number; name: string; father_name?: string; father_id?: number}>
        if (!members || members.length === 0) {
          setError('داده‌ای یافت نشد')
          setLoading(false)
          return
        }
        // یک شخص ریشه (بدون پدر) را انتخاب می‌کنیم
        const roots = members.filter((m) => m.father_id == null)
        const root = roots[0] || members[0]
        // تبدیل داده‌ها به ساختار درختی ساده
        const idToNode: Record<number, TreeNode> = {}
        members.forEach((m) => {
          idToNode[m.id] = { id: m.id, name: m.name, family_name: m.family_name, father_name: m.father_name, children: [] }
        })
        members.forEach((m) => {
          if (m.father_id && idToNode[m.father_id]) {
            idToNode[m.father_id].children!.push(idToNode[m.id])
          }
        })
        setData(idToNode[root.id])
      } catch {
        setError('خطا در دریافت داده‌ها')
      } finally {
        setLoading(false)
      }
    }
    fetch()
  }, [])

  if (loading) return <div className="p-6 text-gray-600">در حال بارگذاری...</div>
  if (error) return <div className="p-6 text-red-600">{error}</div>
  if (!data) return <div className="p-6 text-gray-600">داده‌ای یافت نشد</div>

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">نمودار شجره‌نامه</h1>
      <PersonalTree data={data} />
    </div>
  )
}


