'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import CompleteProfile from '@/components/CompleteProfile';
// import axios from 'axios';

interface UserData {
  id: number;
  email: string;
  is_verified: boolean;
  member?: {
    id: number;
    name: string;
    family_name: string;
    father_name: string | null;
    invite_code: string | null;
  };
}

const DashboardPage: React.FC = () => {
  const router = useRouter();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    // در اینجا می‌توانید API برای دریافت اطلاعات کاربر اضافه کنید
    // فعلاً اطلاعات از localStorage یا mock data استفاده می‌شود
    setUserData({
      id: 1,
      email: 'user@example.com',
      is_verified: true,
      member: {
        id: 1,
        name: 'نام کاربر',
        family_name: 'نام خانوادگی',
        father_name: 'نام پدر',
        invite_code: 'ABC12345',
      }
    });
    setLoading(false);
  }, [router]);

  // const handleLogout = () => {
  //   localStorage.removeItem('token');
  //   router.push('/index');
  // };

  const copyInviteCode = (inviteCode: string) => {
    navigator.clipboard.writeText(inviteCode).then(() => {
      alert('کد دعوت کپی شد!');
    }).catch(() => {
      alert('خطا در کپی کردن کد دعوت');
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          در حال بارگذاری داشبورد...
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Content inside dashboard layout */}
      <div className="space-y-6">
        {/* Complete Profile Card */}
        <CompleteProfile />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* User Info Card */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center mr-3">
                <span className="text-green-600 text-xl">👤</span>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">اطلاعات شخصی</h3>
                <p className="text-sm text-gray-500">جزئیات حساب کاربری</p>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">نام:</span>
                <span className="font-medium">{userData?.member?.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">نام خانوادگی:</span>
                <span className="font-medium">{userData?.member?.family_name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">نام پدر:</span>
                <span className="font-medium">{userData?.member?.father_name || 'ندارد'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">وضعیت:</span>
                <span className={`px-2 py-1 rounded-full text-xs transition-colors ${
                  userData?.is_verified ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                }`}>
                  {userData?.is_verified ? 'تأیید شده' : 'در انتظار تأیید'}
                </span>
              </div>
            </div>
          </div>

          {/* Invite Code Card */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mr-3">
                <span className="text-blue-600 text-xl">🎫</span>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">کد دعوت شما</h3>
                <p className="text-sm text-gray-500">برای دعوت دیگران</p>
              </div>
            </div>
            <div className="space-y-4">
              <div className="bg-gray-50 rounded-xl p-4">
                <div className="text-center">
                  <p className="text-sm text-gray-600 mb-2">کد دعوت شما:</p>
                  <p className="text-2xl font-mono font-bold text-gray-900">
                    {userData?.member?.invite_code || 'ندارد'}
                  </p>
                </div>
              </div>
              {userData?.member?.invite_code && (
                <button
                  onClick={() => {
                    if (userData?.member?.invite_code) {
                      copyInviteCode(userData.member.invite_code);
                    }
                  }}
                  className="w-full py-2 rounded-lg bg-gray-900 text-white hover:bg-black transition-all duration-300"
                >
                  کپی کد دعوت
                </button>
              )}
            </div>
          </div>

          {/* Quick Actions Card */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center mr-3">
                <span className="text-purple-600 text-xl">⚡</span>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">دسترسی سریع</h3>
                <p className="text-sm text-gray-500">عملیات مفید</p>
              </div>
            </div>
            <div className="space-y-3">
              <button
                onClick={() => router.push('/family')}
                className="w-full py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg font-medium hover:from-green-600 hover:to-emerald-700 transition-all duration-300 shadow-sm hover:shadow"
              >
                🌳 مشاهده شجره‌نامه
              </button>
              <button
                onClick={() => router.push('/index')}
                className="w-full py-3 bg-gray-100 text-gray-800 rounded-lg font-medium hover:bg-gray-200 transition-all duration-300"
              >
                🏠 صفحه اصلی
              </button>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="mt-8">
          <div className="bg-white rounded-2xl border border-gray-100 p-6 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">فعالیت‌های اخیر</h3>
            <div className="space-y-3">
              <div className="flex items-center p-3 bg-green-50 rounded-xl">
                <span className="text-green-600 text-lg mr-3">✅</span>
                <div>
                  <p className="font-medium text-gray-900">حساب کاربری تأیید شد</p>
                  <p className="text-sm text-gray-600">امروز</p>
                </div>
              </div>
              <div className="flex items-center p-3 bg-blue-50 rounded-xl">
                <span className="text-blue-600 text-lg mr-3">🎫</span>
                <div>
                  <p className="font-medium text-gray-900">کد دعوت دریافت شد</p>
                  <p className="text-sm text-gray-600">امروز</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DashboardPage;
