export default function Hero() {
  return (
    <section className="relative overflow-hidden py-20 sm:py-28">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,rgba(99,102,241,0.10),transparent_60%)]" />
      <div className="mx-auto max-w-6xl px-6">
        <div className="text-center">
          <div className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs text-gray-600">
            <span className="h-2 w-2 rounded-full bg-indigo-500" />
            ساخته شده برای بهره‌وری خارق‌العاده
          </div>
          <h1 className="mt-6 text-4xl font-bold tracking-tight sm:text-6xl">
            سریع‌تر کدنویسی کن با تجربهٔ نکست‌جی‌اس مجهز به هوش مصنوعی
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-gray-600 sm:text-lg">
            یک لندینگ زیبا و ریسپانسیو؛ آماده برای توسعه و شخصی‌سازی محصول شما.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <a href="#get-started" className="inline-flex h-11 items-center justify-center rounded-md bg-indigo-600 px-5 font-medium text-white hover:bg-indigo-700">
              شروع کنید
            </a>
            <a href="#features" className="inline-flex h-11 items-center justify-center rounded-md border px-5 font-medium text-gray-900 hover:bg-gray-50">
              بیشتر بدانید
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}


