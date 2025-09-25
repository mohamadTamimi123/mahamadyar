export default function AdminDashboardPage() {
  return (
    <div>
      <div className="mb-6">
        <div className="rounded-xl bg-gradient-to-l from-indigo-600 via-indigo-500 to-indigo-400 p-5 text-white shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">داشبورد ادمین</h1>
              <p className="mt-1 text-sm text-indigo-50/90">مدیریت کاربران، گروه‌ها و اعلان‌ها</p>
            </div>
            <span className="rounded-md bg-indigo-700/40 px-3 py-1 text-xs">نسخه پیش‌نمایش</span>
          </div>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <div className="rounded-lg bg-white/10 p-3 text-sm leading-6">
              این داشبورد برای مدیریت محتوای سامانه طراحی شده است. لطفاً قبل از انتشار هر تغییری آن را بازبینی کنید. برای صفحه معرفی محصول (لندینگ) و فرم درخواست کد ثبت‌نام از لینک‌های زیر استفاده کنید.
            </div>
            <div className="flex items-center justify-end gap-2">
              <a href="/" className="inline-flex items-center justify-center rounded-md border border-white/40 bg-white/10 px-3 py-2 text-sm text-white hover:bg-white/20">مشاهده لندینگ</a>
              <a href="/auth/request-invite" className="inline-flex items-center justify-center rounded-md bg-white px-3 py-2 text-sm font-medium text-indigo-700 hover:bg-indigo-50">فرم درخواست کد</a>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border p-5 shadow-sm ring-1 ring-indigo-100">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">کاربران</div>
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-50 text-indigo-600">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M16 11c1.657 0 3-1.79 3-4s-1.343-4-3-4-3 1.79-3 4 1.343 4 3 4Zm-8 0c1.657 0 3-1.79 3-4S9.657 3 8 3 5 4.79 5 7s1.343 4 3 4Zm0 2c-2.673 0-8 1.337-8 4v2h10v-2c0-1.209.51-2.31 1.355-3.23A9.1 9.1 0 0 0 8 13Zm8 0c-.71 0-1.391.074-2.03.207A6.01 6.01 0 0 1 16 17v2h8v-2c0-2.663-5.327-4-8-4Z"/></svg>
            </div>
          </div>
          <div className="mt-2 text-2xl font-semibold text-gray-900">—</div>
          <div className="mt-1 text-xs text-gray-500">تعداد کاربران کل</div>
        </div>
        <div className="rounded-xl border p-5 shadow-sm ring-1 ring-emerald-100">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">گروه‌ها</div>
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M3 7h18v2H3V7Zm0 4h18v2H3v-2Zm0 4h18v2H3v-2Z"/></svg>
            </div>
          </div>
          <div className="mt-2 text-2xl font-semibold text-gray-900">—</div>
          <div className="mt-1 text-xs text-gray-500">گروه‌های ایجاد شده</div>
        </div>
        <div className="rounded-xl border p-5 shadow-sm ring-1 ring-amber-100">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">اعلان‌ها</div>
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-50 text-amber-600">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a7 7 0 0 0-7 7v3.586L3.293 16.293A1 1 0 0 0 4 18h16a1 1 0 0 0 .707-1.707L19 12.586V9a7 7 0 0 0-7-7Zm0 20a3 3 0 0 0 3-3H9a3 3 0 0 0 3 3Z"/></svg>
            </div>
          </div>
          <div className="mt-2 text-2xl font-semibold text-gray-900">—</div>
          <div className="mt-1 text-xs text-gray-500">اعلان‌های در انتظار تایید</div>
        </div>
        <div className="rounded-xl border p-5 shadow-sm ring-1 ring-fuchsia-100">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">رویدادها</div>
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-fuchsia-50 text-fuchsia-600">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M7 2h2v2h6V2h2v2h3v18H4V4h3V2Zm13 8H4v10h16V10Z"/></svg>
            </div>
          </div>
          <div className="mt-2 text-2xl font-semibold text-gray-900">—</div>
          <div className="mt-1 text-xs text-gray-500">رویدادهای آینده</div>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="rounded-xl border bg-white p-5 shadow-sm lg:col-span-2">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">آخرین فعالیت‌ها</h2>
            <button className="rounded-md bg-indigo-600 px-3 py-1.5 text-xs text-white shadow-sm hover:bg-indigo-700">مشاهده همه</button>
          </div>
          <ul className="mt-4 space-y-3 text-sm">
            <li className="rounded-md border bg-gray-50 p-3 text-gray-700">— داده‌ای برای نمایش موجود نیست.</li>
          </ul>
        </div>
        <div className="rounded-xl border bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold">اقدامات سریع</h2>
          <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
            <a href="#" className="rounded-md border bg-white px-3 py-2 text-center shadow-sm hover:bg-gray-50">ایجاد کاربر</a>
            <a href="#" className="rounded-md border bg-white px-3 py-2 text-center shadow-sm hover:bg-gray-50">ایجاد گروه</a>
            <a href="/admin/requests" className="rounded-md border bg-white px-3 py-2 text-center shadow-sm hover:bg-gray-50">درخواست‌های ارسالی</a>
            <a href="/auth/request-invite" className="rounded-md border bg-white px-3 py-2 text-center shadow-sm hover:bg-gray-50">فرم درخواست کد</a>
          </div>
          <div className="mt-4 rounded-lg bg-indigo-50 p-3 text-xs text-indigo-800">
            راهنمای طراحی: از رنگ‌های پرکنتراست برای عناصر تعاملی، فاصله‌گذاری یکنواخت و کارت‌های سفید با سایهٔ ظریف استفاده شده تا محتوا قابل‌اسکن و خوانا باشد.
          </div>
        </div>
      </div>
    </div>
  );
}


