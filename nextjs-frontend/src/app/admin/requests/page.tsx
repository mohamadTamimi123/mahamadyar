"use client";

import { useEffect, useState } from 'react';

type InviteItem = { id: number; name: string; email: string; message?: string | null; status: string; createdAt: string };

export default function AdminRequestsPage() {
  const [items, setItems] = useState<InviteItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [snack, setSnack] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const apiBase = (process.env.NEXT_PUBLIC_API_URL || '').replace(/\/$/, '');

  async function load() {
    setLoading(true);
    try {
      const res = await fetch(`${apiBase}/auth/invite-requests`, { credentials: 'include' });
      const data = await res.json();
      setItems(Array.isArray(data?.items) ? data.items : []);
    } catch (e: any) {
      setSnack({ type: 'error', message: 'خطا در بارگیری درخواست‌ها' });
      setTimeout(() => setSnack(null), 3000);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  return (
    <div>
      <div className="mb-4">
        <h1 className="text-xl font-semibold">درخواست‌های کد ثبت‌نام</h1>
        <p className="mt-1 text-sm text-gray-600">لیست درخواست‌های کاربران برای دریافت کد دعوت.</p>
      </div>
      <div className="rounded-xl border bg-white p-4 shadow-sm">
        <div className="mb-3 flex items-center justify-between">
          <div className="text-sm text-gray-600">{loading ? 'در حال بارگیری...' : `${items.length} درخواست`}</div>
          <div className="flex gap-2 text-sm">
            <button onClick={load} className="rounded-md border bg-white px-3 py-1.5 hover:bg-gray-50">بازخوانی</button>
          </div>
        </div>
        <div className="overflow-auto rounded-md border">
          <table className="min-w-full text-right text-sm">
            <thead className="bg-gray-50 text-gray-600">
              <tr>
                <th className="px-3 py-2">نام</th>
                <th className="px-3 py-2">ایمیل</th>
                <th className="px-3 py-2">توضیحات</th>
                <th className="px-3 py-2">وضعیت</th>
                <th className="px-3 py-2">تاریخ</th>
              </tr>
            </thead>
            <tbody>
              {items.length === 0 && (
                <tr>
                  <td className="px-3 py-6 text-center text-gray-500" colSpan={5}>درخواستی یافت نشد.</td>
                </tr>
              )}
              {items.map((it) => (
                <tr key={it.id} className="odd:bg-white even:bg-gray-50">
                  <td className="px-3 py-2">{it.name}</td>
                  <td className="px-3 py-2 ltr:font-mono">{it.email}</td>
                  <td className="px-3 py-2 max-w-[360px] truncate" title={it.message || ''}>{it.message || '—'}</td>
                  <td className="px-3 py-2">
                    <span className={`rounded-full px-2 py-0.5 text-xs ${it.status === 'pending' ? 'bg-amber-50 text-amber-700' : it.status === 'approved' ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'}`}>{it.status}</span>
                  </td>
                  <td className="px-3 py-2 text-xs text-gray-500">{new Date(it.createdAt).toLocaleString('fa-IR')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {snack && (
        <div className="fixed right-4 top-20 z-50">
          <div className={`rounded-md border px-4 py-2 text-sm shadow-md ${snack.type === 'error' ? 'border-red-200 bg-red-50 text-red-700' : 'border-green-200 bg-green-50 text-green-700'}`}>
            {snack.message}
          </div>
        </div>
      )}
    </div>
  );
}


