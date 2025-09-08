'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // هدایت به صفحه ایندکس جدید
    router.push('/index');
  }, [router]);

  return (
    <div className="flex justify-center items-center h-screen text-lg text-gray-600">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
        در حال انتقال به صفحه اصلی...
      </div>
    </div>
  );
}