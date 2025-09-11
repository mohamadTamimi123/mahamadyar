'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import DashboardTabs from '@/components/DashboardTabs';
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
      <div className="space-y-8">
        {/* Dashboard Tabs */}
        <DashboardTabs />

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* User Info Card */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-2xl p-6 border border-blue-200/50">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center mr-4">
                <span className="text-white text-xl">👤</span>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{userData?.member?.name}</h3>
                <p className="text-sm text-gray-600">{userData?.member?.family_name}</p>
              </div>
            </div>
          </div>

          {/* Invite Code Card */}
          <div className="bg-gradient-to-br from-green-50 to-emerald-100 rounded-2xl p-6 border border-green-200/50">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-600 mb-1">کد دعوت</h3>
                <p className="text-xl font-bold text-gray-900 font-mono">
                  {userData?.member?.invite_code || 'ندارد'}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center">
                <span className="text-white text-xl">🎫</span>
              </div>
            </div>
          </div>

          {/* Status Card */}
          <div className="bg-gradient-to-br from-purple-50 to-violet-100 rounded-2xl p-6 border border-purple-200/50">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-600 mb-1">وضعیت</h3>
                <p className={`text-lg font-semibold ${
                  userData?.is_verified ? 'text-green-600' : 'text-yellow-600'
                }`}>
                  {userData?.is_verified ? 'تأیید شده' : 'در انتظار تأیید'}
                </p>
              </div>
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                userData?.is_verified ? 'bg-green-500' : 'bg-yellow-500'
              }`}>
                <span className="text-white text-xl">{userData?.is_verified ? '✅' : '⏳'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DashboardPage;
