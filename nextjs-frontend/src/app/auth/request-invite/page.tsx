"use client";

import { useState } from 'react';

export default function RequestInvitePage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [snack, setSnack] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const apiBase = (process.env.NEXT_PUBLIC_API_URL || '').replace(/\/$/, '');

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSnack(null);
    setLoading(true);
    try {
      const res = await fetch(`${apiBase}/auth/request-invite`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ name, email, message }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.message || 'ارسال درخواست ناموفق بود');
      setSnack({ type: 'success', message: 'درخواست شما ارسال شد. منتظر تایید بمانید.' });
      setName(''); setEmail(''); setMessage('');
    } catch (err: any) {
      setSnack({ type: 'error', message: err?.message || 'مشکلی پیش آمد' });
    } finally {
      setLoading(false);
      setTimeout(() => setSnack(null), 3500);
    }
  }

  return (
    <main className="px-4 py-10 sm:px-6">
      <section className="mx-auto max-w-3xl">
        <div className="rounded-2xl bg-gradient-to-l from-indigo-600 via-indigo-500 to-indigo-400 p-6 text-white shadow-sm">
          <h1 className="text-2xl font-bold">درخواست کد ثبت‌نام</h1>
          <p className="mt-2 text-sm text-indigo-50/90">برای پیوستن به سامانه، اطلاعات خود را ثبت کنید تا پس از بررسی کد دعوت برای شما ارسال شود.</p>
          <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
            <span className="rounded-md bg-white/10 px-2 py-1">زمان پاسخ‌گویی: ۱–۲ روز کاری</span>
            <span className="rounded-md bg-white/10 px-2 py-1">اطلاعات شما محرمانه است</span>
          </div>
        </div>

        <div className="mt-6 rounded-2xl border bg-white p-6 shadow-sm">
          <form className="space-y-5" onSubmit={onSubmit}>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-800">نام و نام خانوادگی</label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full rounded-md border px-3 py-2 outline-none ring-0 focus:border-indigo-400"
                placeholder="نام شما"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-800">ایمیل</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full rounded-md border px-3 py-2 outline-none ring-0 focus:border-indigo-400"
                placeholder="you@example.com"
              />
              <p className="mt-1 text-xs text-gray-500">لطفاً ایمیل معتبر وارد کنید؛ پاسخ به این ایمیل ارسال می‌شود.</p>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-800">توضیحات (اختیاری)</label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={4}
                className="w-full rounded-md border px-3 py-2 outline-none ring-0 focus:border-indigo-400"
                placeholder="دلیل درخواست خود را توضیح دهید"
              />
            </div>
            <div className="flex items-center justify-between gap-3">
              <div className="text-xs text-gray-500">با ارسال فرم، شرایط و قوانین را می‌پذیرم.</div>
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center justify-center rounded-md bg-indigo-600 px-5 py-2.5 text-white shadow-sm hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? 'در حال ارسال...' : 'ارسال درخواست'}
              </button>
            </div>
          </form>
        </div>
      </section>

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


