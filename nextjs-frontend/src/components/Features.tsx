const features = [
  {
    title: 'بسیار سریع',
    desc: 'تنظیمات بهینهٔ Next.js + Tailwind برای سرعت و تجربهٔ بهتر.',
  },
  {
    title: 'ریسپانسیو پیش‌فرض',
    desc: 'چیدمان موبایل‌اول که به‌زیبایی تا دسکتاپ گسترش می‌یابد.',
  },
  {
    title: 'آمادهٔ تولید',
    desc: 'ساختار تمیز آمادهٔ اتصال به API و احراز هویت.',
  },
  {
    title: 'دسترس‌پذیر',
    desc: 'HTML معنایی و حالت‌های فوکوس از پیش آماده.',
  },
  {
    title: 'نوع‌امن',
    desc: 'TypeScript همه‌جا برای رفکتورهای امن‌تر.',
  },
  {
    title: 'قابل شخصی‌سازی',
    desc: 'به‌سادگی رنگ‌ها، فونت‌ها و کامپوننت‌های برند خود را اضافه کنید.',
  },
];

export default function Features() {
  return (
    <section id="features" className="py-16 sm:py-24">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">هرآنچه نیاز دارید</h2>
          <p className="mt-3 text-gray-600">مجموعه‌ای جمع‌وجور از کامپوننت‌ها و استایل‌ها برای شروع سریع.</p>
        </div>
        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => (
            <div key={f.title} className="rounded-xl border p-6">
              <div className="h-10 w-10 rounded-md bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">{f.title[0]}</div>
              <h3 className="mt-4 text-lg font-semibold">{f.title}</h3>
              <p className="mt-2 text-sm text-gray-600">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}


