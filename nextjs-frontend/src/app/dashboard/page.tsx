export default function DashboardPage() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">داشبورد</h1>
        <p className="mt-1 text-sm text-gray-600">خوش آمدید! اینجا خلاصه‌ای از فعالیت‌ها و اطلاعات شما نمایش داده می‌شود.</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-xl border p-5">
          <div className="text-sm text-gray-600">کاربران</div>
          <div className="mt-2 text-2xl font-semibold">—</div>
          <div className="mt-1 text-xs text-gray-500">تعداد کل کاربران ثبت‌شده</div>
        </div>
        <div className="rounded-xl border p-5">
          <div className="text-sm text-gray-600">گروه‌ها</div>
          <div className="mt-2 text-2xl font-semibold">—</div>
          <div className="mt-1 text-xs text-gray-500">گروه‌های فعال شما</div>
        </div>
        <div className="rounded-xl border p-5">
          <div className="text-sm text-gray-600">اعلان‌ها</div>
          <div className="mt-2 text-2xl font-semibold">—</div>
          <div className="mt-1 text-xs text-gray-500">اعلان‌های اخیر</div>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="rounded-xl border p-5 lg:col-span-2">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">فعالیت‌های اخیر</h2>
            <button className="text-sm text-indigo-600 hover:text-indigo-700">مشاهده همه</button>
          </div>
          <ul className="mt-4 space-y-3 text-sm">
            <li className="rounded-md border p-3">— موردی برای نمایش وجود ندارد.</li>
          </ul>
        </div>
        <div className="rounded-xl border p-5">
          <h2 className="text-lg font-semibold">میانبرها</h2>
          <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
            <a href="/auth/login" className="rounded-md border px-3 py-2 text-center hover:bg-gray-50">ورود</a>
            <a href="/auth/register" className="rounded-md border px-3 py-2 text-center hover:bg-gray-50">ثبت‌نام</a>
            <a href="/#features" className="rounded-md border px-3 py-2 text-center hover:bg-gray-50">ویژگی‌ها</a>
            <a href="/#get-started" className="rounded-md border px-3 py-2 text-center hover:bg-gray-50">شروع</a>
          </div>
        </div>
      </div>
    </main>
  );
}


