export default function CTA() {
  return (
    <section id="get-started" className="py-16">
      <div className="mx-auto max-w-3xl rounded-2xl border px-6 py-10 text-center">
        <h3 className="text-2xl font-semibold">برای ساختن آماده‌اید؟</h3>
        <p className="mt-2 text-gray-600">محصول خود را با این تمپلیت تمیز و دسترس‌پذیر آغاز کنید.</p>
        <div className="mt-6 flex items-center justify-center gap-3">
          <a className="inline-flex h-11 items-center justify-center rounded-md bg-indigo-600 px-5 font-medium text-white hover:bg-indigo-700" href="#">
            شروع کنید
          </a>
          <a className="inline-flex h-11 items-center justify-center rounded-md border px-5 font-medium hover:bg-gray-50" href="#features">
            مشاهده ویژگی‌ها
          </a>
        </div>
      </div>
    </section>
  );
}


