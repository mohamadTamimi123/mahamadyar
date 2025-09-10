'use client'

import React, { useEffect, useState } from 'react'
import api from '@/lib/api'
import AdminSidebar from '@/components/AdminSidebar'

type Member = {
  id: number
  name: string
  family_name?: string
}

type User = {
  id: number
  email: string
  is_verified: boolean
  created_at: string
  member?: Member
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const load = async () => {
    try {
      setLoading(true)
      setError(null)
      const res = await api.get('/family-members/users')
      setUsers(res.data || [])
    } catch (e: unknown) {
      const error = e as { response?: { data?: { message?: string } } };
      setError(error?.response?.data?.message || 'خطا در دریافت کاربران')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  const toggleVerify = async (user: User) => {
    try {
      await api.patch(`/family-members/users/${user.id}/verify`, { is_verified: !user.is_verified })
      await load()
    } catch {
      // noop
    }
  }

  const removeUser = async (user: User) => {
    if (!confirm('کاربر حذف شود؟')) return
    try {
      await api.delete(`/family-members/users/${user.id}`)
      await load()
    } catch {
      // noop
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 ">
        <div className="p-6 space-y-6">
          {/* Mobile Header */}
          <div className="lg:hidden bg-white rounded-lg border p-4">
            <div className="flex items-center justify-between">
              <button
                onClick={() => setSidebarOpen(true)}
                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              <h1 className="text-lg font-bold">مدیریت کاربران</h1>
              <div className="w-10" />
            </div>
          </div>

          {/* Header */}
          <div className="hidden lg:flex items-center justify-between bg-white rounded-lg border p-4">
            <h1 className="text-xl font-bold">مدیریت کاربران</h1>
            <button onClick={load} className="px-4 py-2 rounded-lg bg-gray-900 text-white hover:bg-black">بروزرسانی</button>
          </div>

          {loading && <div className="text-gray-600">در حال بارگذاری...</div>}
          {error && <div className="text-red-600">{error}</div>}

          {!loading && users.length === 0 && (
            <div className="text-gray-600">کاربری یافت نشد</div>
          )}

          {!loading && users.length > 0 && (
            <div className="overflow-x-auto bg-white rounded-xl border">
              <table className="min-w-full text-sm">
                <thead className="bg-gray-50 text-gray-600">
                  <tr>
                    <th className="px-4 py-3 text-right">ایمیل</th>
                    <th className="px-4 py-3 text-right">عضو مرتبط</th>
                    <th className="px-4 py-3 text-right">وضعیت</th>
                    <th className="px-4 py-3 text-right">ایجاد</th>
                    <th className="px-4 py-3 text-right">اقدامات</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {users.map(u => (
                    <tr key={u.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3">{u.email}</td>
                      <td className="px-4 py-3">{u.member ? `${u.member.name}${u.member.family_name ? ' ' + u.member.family_name : ''}` : '-'}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded-full text-xs ${u.is_verified ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                          {u.is_verified ? 'تأیید شده' : 'در انتظار تأیید'}
                        </span>
                      </td>
                      <td className="px-4 py-3">{new Date(u.created_at).toLocaleString('fa-IR')}</td>
                      <td className="px-4 py-3 space-x-2 space-x-reverse">
                        <button onClick={() => toggleVerify(u)} className="px-3 py-1 rounded-lg bg-blue-600 text-white hover:bg-blue-700">
                          {u.is_verified ? 'غیرفعال' : 'فعال'}
                        </button>
                        <button onClick={() => removeUser(u)} className="px-3 py-1 rounded-lg bg-red-600 text-white hover:bg-red-700">
                          حذف
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}


