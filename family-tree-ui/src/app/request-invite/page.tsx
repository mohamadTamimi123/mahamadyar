'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';

const RequestInvitePage: React.FC = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    fatherName: '',
    email: '',
    phone: '',
    message: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim() || !formData.fatherName.trim() || !formData.email.trim()) {
      setError('لطفاً تمام فیلدهای ضروری را پر کنید');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // ارسال درخواست به بکاند
      const response = await api.post('/family-members/request-invite', formData);

      if (response.data) {
        setSuccess(true);
        // پاک کردن فرم
        setFormData({
          name: '',
          fatherName: '',
          email: '',
          phone: '',
          message: '',
        });
      }
    } catch (err: unknown) {
      console.error('Error submitting request:', err);
      setError('خطا در ارسال درخواست. لطفاً دوباره تلاش کنید');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-4xl">✅</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            درخواست شما ارسال شد!
          </h2>
          <p className="text-gray-600 mb-6 leading-relaxed">
            درخواست کد دعوت شما با موفقیت ارسال شد. مدیران سیستم درخواست شما را بررسی کرده و در صورت تأیید، کد دعوت را برای شما ارسال خواهند کرد.
          </p>
          <div className="space-y-3">
            <button
              onClick={() => setSuccess(false)}
              className="w-full px-6 py-3 bg-blue-500 text-white rounded-xl font-medium hover:bg-blue-600 transition-colors"
            >
              درخواست جدید
            </button>
            <button
              onClick={() => router.push('/index')}
              className="w-full px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-colors"
            >
              بازگشت به صفحه اصلی
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-indigo-50 py-12">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-100 text-blue-800 text-sm font-medium mb-6">
            <span className="w-2 h-2 bg-blue-500 rounded-full mr-2 animate-pulse"></span>
            درخواست کد دعوت
          </div>
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 bg-clip-text text-transparent mb-4">
            🎫 درخواست کد دعوت
          </h1>
          <p className="text-xl text-gray-600 leading-relaxed">
            برای عضویت در خانواده، اطلاعات خود را وارد کنید تا مدیران سیستم کد دعوت را برای شما ارسال کنند
          </p>
        </div>

        {/* Form */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl p-8 border border-white/20">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl">
                <div className="flex items-center">
                  <span className="text-xl mr-2">⚠️</span>
                  {error}
                </div>
              </div>
            )}

            {/* Personal Information */}
            <div className="space-y-6">
              <h3 className="text-lg font-bold text-gray-800 flex items-center">
                <span className="text-2xl mr-3">👤</span>
                اطلاعات شخصی
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    نام کامل <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="نام و نام خانوادگی خود را وارد کنید"
                    className="w-full p-4 border border-gray-300 rounded-xl text-base focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    dir="rtl"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    نام پدر <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="fatherName"
                    value={formData.fatherName}
                    onChange={handleInputChange}
                    placeholder="نام پدر خود را وارد کنید"
                    className="w-full p-4 border border-gray-300 rounded-xl text-base focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    dir="rtl"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="space-y-6">
              <h3 className="text-lg font-bold text-gray-800 flex items-center">
                <span className="text-2xl mr-3">📞</span>
                اطلاعات تماس
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    ایمیل <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="example@email.com"
                    className="w-full p-4 border border-gray-300 rounded-xl text-base focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    dir="ltr"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    شماره تماس
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="09123456789"
                    className="w-full p-4 border border-gray-300 rounded-xl text-base focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    dir="ltr"
                  />
                </div>
              </div>
            </div>

            {/* Additional Message */}
            <div className="space-y-6">
              <h3 className="text-lg font-bold text-gray-800 flex items-center">
                <span className="text-2xl mr-3">💬</span>
                پیام اضافی
              </h3>
              
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  توضیحات اضافی
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  placeholder="در صورت نیاز، توضیحات اضافی خود را اینجا بنویسید..."
                  rows={4}
                  className="w-full p-4 border border-gray-300 rounded-xl text-base focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                  dir="rtl"
                />
              </div>
            </div>

            {/* Info Box */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
              <div className="flex items-start">
                <span className="text-xl mr-3">ℹ️</span>
                <div className="text-sm text-blue-800">
                  <p className="font-medium mb-1">نکات مهم:</p>
                  <ul className="space-y-1 text-xs">
                    <li>• درخواست شما توسط مدیران سیستم بررسی خواهد شد</li>
                    <li>• در صورت تأیید، کد دعوت به ایمیل شما ارسال می‌شود</li>
                    <li>• فرآیند بررسی ممکن است چند روز طول بکشد</li>
                    <li>• لطفاً اطلاعات صحیح و کامل وارد کنید</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Submit Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-6">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-gradient-to-r from-blue-500 to-purple-500 text-white py-4 px-8 rounded-xl font-bold text-lg hover:from-blue-600 hover:to-purple-600 disabled:opacity-50 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    در حال ارسال...
                  </span>
                ) : (
                  '📤 ارسال درخواست'
                )}
              </button>
              <button
                type="button"
                onClick={() => router.push('/index')}
                disabled={loading}
                className="flex-1 bg-gray-100 text-gray-700 py-4 px-8 rounded-xl font-bold text-lg hover:bg-gray-200 disabled:opacity-50 transition-all duration-300"
              >
                ❌ انصراف
              </button>
            </div>
          </form>
        </div>

        {/* Help Section */}
        <div className="mt-12 bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
          <h3 className="text-lg font-bold text-gray-800 mb-4 text-center">
            💡 راهنمای درخواست کد دعوت
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-gray-600">
            <div className="space-y-2">
              <div className="flex items-start">
                <span className="text-blue-500 mr-2">1.</span>
                <span>اطلاعات شخصی خود را به دقت وارد کنید</span>
              </div>
              <div className="flex items-start">
                <span className="text-blue-500 mr-2">2.</span>
                <span>ایمیل معتبر وارد کنید تا کد دعوت ارسال شود</span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-start">
                <span className="text-blue-500 mr-2">3.</span>
                <span>درخواست شما توسط مدیران بررسی می‌شود</span>
              </div>
              <div className="flex items-start">
                <span className="text-blue-500 mr-2">4.</span>
                <span>پس از تأیید، کد دعوت برای شما ارسال می‌شود</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RequestInvitePage;
