'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import api from '@/lib/api';

interface VerifyEmailPageProps {
  params: {
    id: string;
  };
}

const VerifyEmailPage: React.FC<VerifyEmailPageProps> = ({ params }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Validate ID parameter
  if (!params.id || params.id === 'undefined' || isNaN(Number(params.id))) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-red-500 text-3xl">❌</span>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              شناسه نامعتبر
            </h3>
            <p className="text-gray-600 mb-6">
              شناسه تأیید ایمیل نامعتبر است
            </p>
            <button
              onClick={() => router.push('/index')}
              className="w-full py-3 bg-blue-500 text-white rounded-lg font-bold hover:bg-blue-600 transition-colors"
            >
              بازگشت به صفحه اصلی
            </button>
          </div>
        </div>
      </div>
    );
  }

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await api.post(`/auth/verify-email/${params.id}`);

        if (response.data.success) {
          setSuccess(response.data.message);
        } else {
          setError(response.data.message);
        }
      } catch (err: unknown) {
        const error = err as { response?: { data?: { message?: string } } };
        setError(error.response?.data?.message || 'خطا در تأیید ایمیل');
      } finally {
        setLoading(false);
      }
    };

    verifyEmail();
  }, [params.id]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <span className="text-white text-2xl">📧</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            تأیید ایمیل
          </h1>
          <p className="text-gray-600">
            در حال تأیید ایمیل شما...
          </p>
        </div>

        {/* Content */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {loading && (
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
              <p className="text-gray-600">در حال تأیید ایمیل...</p>
            </div>
          )}

          {success && (
            <div className="text-center space-y-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                <span className="text-green-500 text-3xl">✅</span>
              </div>
              
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  ایمیل تأیید شد!
                </h3>
                <p className="text-gray-600">
                  {success}
                </p>
              </div>

              <div className="space-y-3">
                <button
                  onClick={() => router.push('/login')}
                  className="w-full py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg font-bold hover:from-blue-600 hover:to-purple-700 transition-all duration-300"
                >
                  ورود به حساب کاربری
                </button>
                <button
                  onClick={() => router.push('/index')}
                  className="w-full py-3 bg-gray-500 text-white rounded-lg font-bold hover:bg-gray-600 transition-colors"
                >
                  بازگشت به صفحه اصلی
                </button>
              </div>
            </div>
          )}

          {error && (
            <div className="text-center space-y-6">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">
                <span className="text-red-500 text-3xl">❌</span>
              </div>
              
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  خطا در تأیید ایمیل
                </h3>
                <p className="text-gray-600">
                  {error}
                </p>
              </div>

              <div className="space-y-3">
                <button
                  onClick={() => router.push('/register')}
                  className="w-full py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg font-bold hover:from-blue-600 hover:to-purple-700 transition-all duration-300"
                >
                  ثبت‌نام مجدد
                </button>
                <button
                  onClick={() => router.push('/index')}
                  className="w-full py-3 bg-gray-500 text-white rounded-lg font-bold hover:bg-gray-600 transition-colors"
                >
                  بازگشت به صفحه اصلی
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VerifyEmailPage;
