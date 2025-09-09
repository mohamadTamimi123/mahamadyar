'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';

const IndexPage: React.FC = () => {
  const router = useRouter();
  const [stats, setStats] = useState({
    totalMembers: 0,
    loading: true,
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await api.get('/family-members');
      setStats({
        totalMembers: response.data.length,
        loading: false,
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
      setStats({
        totalMembers: 0,
        loading: false,
      });
    }
  };

  const features = [
    {
      icon: '👥',
      title: 'مدیریت اعضای خانواده',
      description: 'مشاهده، ویرایش و مدیریت کامل اطلاعات اعضای خانواده',
      color: 'from-blue-500 to-blue-600',
      action: () => router.push('/family'),
    },
    {
      icon: '🌳',
      title: 'شجره‌نامه درختی',
      description: 'نمایش روابط خانوادگی در قالب نمودار درختی تعاملی',
      color: 'from-green-500 to-green-600',
      action: () => router.push('/family'),
    },
    {
      icon: '📝',
      title: 'درخواست کد دعوت',
      description: 'درخواست عضویت در خانواده از مدیران',
      color: 'from-orange-500 to-orange-600',
      action: () => router.push('/request-invite'),
    },
    {
      icon: '🎫',
      title: 'ثبت‌نام با کد دعوت',
      description: 'عضویت جدید در خانواده با استفاده از کد دعوت',
      color: 'from-purple-500 to-purple-600',
      action: () => router.push('/register'),
    },
    {
      icon: '🔐',
      title: 'داشبورد ادمین',
      description: 'مدیریت کامل سیستم و عملیات پیشرفته',
      color: 'from-red-500 to-red-600',
      action: () => router.push('/admin'),
    },
  ];

  const quickActions = [
    {
      icon: '📊',
      title: 'مشاهده جدول',
      description: 'لیست کامل اعضای خانواده',
      action: () => router.push('/family'),
    },
    {
      icon: '🌳',
      title: 'نمایش درختی',
      description: 'شجره‌نامه در قالب نمودار',
      action: () => router.push('/family'),
    },
    {
      icon: '📝',
      title: 'درخواست عضویت',
      description: 'درخواست کد دعوت از مدیران',
      action: () => router.push('/request-invite'),
    },
    {
      icon: '🎫',
      title: 'ثبت‌نام جدید',
      description: 'اضافه کردن عضو جدید',
      action: () => router.push('/register'),
    },
    {
      icon: '🔐',
      title: 'مدیریت سیستم',
      description: 'دسترسی به ابزارهای ادمین',
      action: () => router.push('/admin'),
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-purple-600/5"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-100 text-blue-800 text-sm font-medium mb-8">
              <span className="w-2 h-2 bg-blue-500 rounded-full mr-2 animate-pulse"></span>
              سیستم آنلاین و فعال
            </div>
            <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 bg-clip-text text-transparent mb-6 leading-tight">
              🏠 سیستم مدیریت اعضای خانواده
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-4xl mx-auto leading-relaxed">
              مدیریت کامل شجره‌نامه خانوادگی با قابلیت‌های پیشرفته و رابط کاربری مدرن
            </p>
            
            {/* Stats */}
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl p-8 mb-16 max-w-3xl mx-auto border border-white/20">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent mb-2">
                    {stats.loading ? '...' : stats.totalMembers.toLocaleString()}
                  </div>
                  <div className="text-sm font-medium text-gray-600 uppercase tracking-wide">کل اعضا</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-green-600 to-green-800 bg-clip-text text-transparent mb-2">4</div>
                  <div className="text-sm font-medium text-gray-600 uppercase tracking-wide">قابلیت اصلی</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-600 to-purple-800 bg-clip-text text-transparent mb-2">24/7</div>
                  <div className="text-sm font-medium text-gray-600 uppercase tracking-wide">دسترسی</div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
              {quickActions.map((action, index) => (
                <button
                  key={index}
                  onClick={action.action}
                  className="group bg-white/60 backdrop-blur-sm p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 hover:bg-white/80 border border-white/20"
                >
                  <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">{action.icon}</div>
                  <div className="font-bold text-gray-800 mb-2 text-sm">{action.title}</div>
                  <div className="text-xs text-gray-600 leading-relaxed">{action.description}</div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-24 bg-white/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-6">
              ✨ قابلیت‌های سیستم
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              تمام ابزارهای مورد نیاز برای مدیریت کامل شجره‌نامه خانوادگی
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                onClick={feature.action}
                className={`group bg-gradient-to-br ${feature.color} p-8 rounded-3xl text-white cursor-pointer hover:scale-105 transition-all duration-500 shadow-xl hover:shadow-2xl relative overflow-hidden`}
              >
                <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative flex items-start gap-6">
                  <div className="text-6xl group-hover:scale-110 transition-transform duration-300">{feature.icon}</div>
                  <div>
                    <h3 className="text-2xl font-bold mb-4">{feature.title}</h3>
                    <p className="text-lg opacity-90 leading-relaxed">{feature.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              🚀 نحوه کارکرد سیستم
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              سه مرحله ساده برای استفاده از سیستم
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-blue-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl">🎫</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">دریافت کد دعوت</h3>
              <p className="text-gray-600">
                کد دعوت را از یکی از اعضای خانواده دریافت کنید
              </p>
            </div>

            <div className="text-center">
              <div className="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl">📝</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">ثبت‌نام</h3>
              <p className="text-gray-600">
                با کد دعوت و نام خود در سیستم ثبت‌نام کنید
              </p>
            </div>

            <div className="text-center">
              <div className="bg-purple-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl">👥</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">مدیریت خانواده</h3>
              <p className="text-gray-600">
                اعضای جدید اضافه کنید و شجره‌نامه را مدیریت کنید
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              💡 مزایای استفاده
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              چرا این سیستم را انتخاب کنید؟
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🔒</span>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">امنیت بالا</h3>
              <p className="text-gray-600 text-sm">
                سیستم امن با کدهای دعوت منحصر به فرد
              </p>
            </div>

            <div className="text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📱</span>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">رابط مدرن</h3>
              <p className="text-gray-600 text-sm">
                طراحی زیبا و کاربرپسند برای همه دستگاه‌ها
              </p>
            </div>

            <div className="text-center">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">⚡</span>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">سرعت بالا</h3>
              <p className="text-gray-600 text-sm">
                عملکرد سریع و بهینه برای تجربه بهتر
              </p>
            </div>

            <div className="text-center">
              <div className="bg-yellow-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🔄</span>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">به‌روزرسانی</h3>
              <p className="text-gray-600 text-sm">
                قابلیت‌های جدید و بهبودهای مداوم
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-24 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-8 leading-tight">
            🚀 همین حالا شروع کنید
          </h2>
          <p className="text-xl md:text-2xl text-blue-100 mb-12 leading-relaxed">
            با کد دعوت یکی از اعضای خانواده، عضو جدید شوید
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <button
              onClick={() => router.push('/register')}
              className="group px-10 py-5 bg-white text-blue-600 rounded-2xl font-bold text-lg hover:bg-gray-50 transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-105"
            >
              <span className="flex items-center justify-center gap-3">
                🎫 ثبت‌نام با کد دعوت
                <span className="group-hover:translate-x-1 transition-transform duration-300">→</span>
              </span>
            </button>
            <button
              onClick={() => router.push('/family')}
              className="group px-10 py-5 bg-blue-500/80 backdrop-blur-sm text-white rounded-2xl font-bold text-lg hover:bg-blue-400/80 transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-105 border border-white/20"
            >
              <span className="flex items-center justify-center gap-3">
                👥 مشاهده اعضا
                <span className="group-hover:translate-x-1 transition-transform duration-300">→</span>
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-2xl font-bold mb-4">🏠 سیستم مدیریت خانواده</h3>
              <p className="text-gray-400">
                مدیریت کامل شجره‌نامه خانوادگی با تکنولوژی مدرن
              </p>
            </div>
            
            <div>
              <h4 className="text-lg font-bold mb-4">🔗 لینک‌های مفید</h4>
              <div className="space-y-2">
                <button
                  onClick={() => router.push('/family')}
                  className="block text-gray-400 hover:text-white transition-colors"
                >
                  مشاهده اعضا
                </button>
                <button
                  onClick={() => router.push('/register')}
                  className="block text-gray-400 hover:text-white transition-colors"
                >
                  ثبت‌نام
                </button>
                <button
                  onClick={() => router.push('/admin')}
                  className="block text-gray-400 hover:text-white transition-colors"
                >
                  داشبورد ادمین
                </button>
              </div>
            </div>
            
            <div>
              <h4 className="text-lg font-bold mb-4">📊 آمار سیستم</h4>
              <div className="space-y-2 text-gray-400">
                <div>کل اعضا: {stats.loading ? '...' : stats.totalMembers.toLocaleString()}</div>
                <div>وضعیت: آنلاین</div>
                <div>نسخه: 1.0.0</div>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
            <p>© 2024 سیستم مدیریت اعضای خانواده. تمام حقوق محفوظ است.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default IndexPage;
