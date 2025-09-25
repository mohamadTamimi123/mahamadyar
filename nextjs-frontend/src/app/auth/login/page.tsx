"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [snack, setSnack] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const router = useRouter();

  const apiBase = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5008';

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSnack(null);
    setLoading(true);
    try {
      const res = await fetch(`${apiBase}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
        credentials: 'include',
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data?.message || 'خطا در ورود');
      }
      setSnack({ type: 'success', message: 'با موفقیت وارد شدید' });
      // Persist minimal user info for client-side header rendering
      try {
        if (typeof window !== 'undefined') {
          const user = data?.user || { email, role: data?.role };
          const token = data?.token;
          window.localStorage.setItem('app_user', JSON.stringify(user));
          if (token) {
            window.localStorage.setItem('token', token);
          }
          // notify navbar to refresh session state immediately
          window.dispatchEvent(new Event('app_user:update'));
        }
      } catch {}
      const role = (data?.user?.role || data?.role || '').toString().toLowerCase();
      if (role === 'admin') {
        router.replace('/admin');
      } else {
        router.replace('/dashboard');
      }
    } catch (err: any) {
      setSnack({ type: 'error', message: err?.message || 'مشکلی پیش آمد' });
    } finally {
      setLoading(false);
      setTimeout(() => setSnack(null), 3500);
    }
  }

  return (
    <main className="mx-auto max-w-md px-4 py-12 sm:px-6">
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-bold">ورود به حساب</h1>
        <p className="mt-2 text-sm text-gray-600">برای ادامه وارد حساب کاربری خود شوید.</p>
      </div>

      <div className="rounded-2xl border p-6 shadow-sm">
        {/* Social auth */}
        <div className="grid gap-3 sm:grid-cols-2">
          <button type="button" className="inline-flex items-center justify-center gap-2 rounded-md border px-4 py-2.5 text-sm hover:bg-gray-50">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M21.6 12.227c0-.68-.061-1.333-.176-1.96H12v3.709h5.381a4.602 4.602 0 0 1-1.995 3.017v2.505h3.228c1.888-1.737 2.986-4.294 2.986-7.271Z" fill="#4285F4"/>
              <path d="M12 22c2.7 0 4.968-.894 6.624-2.417l-3.228-2.505c-.896.6-2.041.954-3.396.954-2.61 0-4.817-1.761-5.606-4.126H3.03v2.594A9.996 9.996 0 0 0 12 22Z" fill="#34A853"/>
              <path d="M6.394 13.906A6.01 6.01 0 0 1 6.08 12c0-.663.114-1.306.314-1.906V7.5H3.03A10.003 10.003 0 0 0 2 12c0 1.623.39 3.158 1.03 4.5l3.364-2.594Z" fill="#FBBC05"/>
              <path d="M12 5.5c1.47 0 2.793.506 3.833 1.497l2.875-2.875C16.964 2.943 14.7 2 12 2A9.996 9.996 0 0 0 3.03 7.5l3.364 2.594C7.183 7.73 9.39 5.5 12 5.5Z" fill="#EA4335"/>
            </svg>
            ورود با گوگل
          </button>
          <button type="button" className="inline-flex items-center justify-center gap-2 rounded-md border px-4 py-2.5 text-sm hover:bg-gray-50">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
              <path d="M16.365 1.43c0 1.14-.454 2.197-1.28 3.04-.826.844-2.186 1.483-3.329 1.372-.145-1.1.48-2.271 1.315-3.097.908-.916 2.451-1.577 3.294-1.315ZM20.66 20.29c-.974 1.447-1.975 2.88-3.553 2.905-1.56.03-2.06-.944-3.845-.944-1.785 0-2.338.915-3.81.973-1.513.059-2.663-1.563-3.647-3.002-1.986-2.879-3.51-8.153-1.47-11.719A5.445 5.445 0 0 1 7.09 5.918c1.6-.126 3.115 1.08 3.845 1.08.73 0 2.645-1.333 4.463-1.134a5.59 5.59 0 0 1 4.383 2.39c-3.873 2.132-3.253 7.699.88 9.037Z"/>
            </svg>
            ورود با اپل
          </button>
        </div>

        <div className="my-6 flex items-center gap-3 text-xs text-gray-500">
          <div className="h-px flex-1 bg-gray-200" />
          یا
          <div className="h-px flex-1 bg-gray-200" />
        </div>

        {/* Email/password */}
        <form className="space-y-4" onSubmit={onSubmit}>
          <div>
            <label className="mb-1 block text-sm">ایمیل</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-md border px-3 py-2 outline-none ring-0 focus:border-indigo-400"
              placeholder="you@example.com"
              required
            />
          </div>
          <div>
            <div className="mb-1 flex items-center justify-between">
              <label className="block text-sm">رمز عبور</label>
              <button type="button" className="text-xs text-indigo-600 hover:text-indigo-700">فراموشی رمز؟</button>
            </div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-md border px-3 py-2 outline-none ring-0 focus:border-indigo-400"
              placeholder="••••••••"
              required
            />
          </div>
          <button type="submit" disabled={loading} className="w-full rounded-md bg-indigo-600 py-2.5 text-white hover:bg-indigo-700 disabled:opacity-60 disabled:cursor-not-allowed">
            {loading ? 'در حال ورود...' : 'ورود'}
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-gray-600">
          حساب ندارید؟ <Link href="/auth/register" className="font-medium text-indigo-600 hover:text-indigo-700">ثبت‌نام</Link>
        </p>
      </div>

      {/* Right-side snackbar */}
      {snack && (
        <div className="fixed right-4 top-20 z-50">
          <div className={`rounded-md border px-4 py-2 text-sm shadow-md ${snack.type === 'error' ? 'border-red-200 bg-red-50 text-red-700' : 'border-green-200 bg-green-50 text-green-700'}`}>
            {snack.message}
          </div>
        </div>
      )}
    </main>
  );
}


