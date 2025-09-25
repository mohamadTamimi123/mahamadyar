export default function RegisterPage() {
  return (
    <main className="mx-auto max-w-md px-6 py-12">
      <h1 className="text-2xl font-bold">ثبت‌نام</h1>
      <p className="mt-2 text-sm text-gray-600">برای شروع حساب جدید بسازید.</p>
      <form className="mt-6 space-y-4">
        <div>
          <label className="block text-sm mb-1">نام</label>
          <input type="text" className="w-full rounded-md border px-3 py-2" placeholder="نام شما" />
        </div>
        <div>
          <label className="block text-sm mb-1">ایمیل</label>
          <input type="email" className="w-full rounded-md border px-3 py-2" placeholder="you@example.com" />
        </div>
        <div>
          <label className="block text-sm mb-1">کد دعوت (اختیاری)</label>
          <input type="text" className="w-full rounded-md border px-3 py-2" placeholder="INVITE-XXXX" />
        </div>
        <div>
          <label className="block text-sm mb-1">رمز عبور</label>
          <input type="password" className="w-full rounded-md border px-3 py-2" placeholder="••••••••" />
        </div>
        <button type="submit" className="w-full rounded-md bg-indigo-600 py-2.5 text-white hover:bg-indigo-700">ثبت‌نام</button>
      </form>
    </main>
  );
}


