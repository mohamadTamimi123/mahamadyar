'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import CompleteProfile from '@/components/CompleteProfile';
import FamilyTreeDiagram from '@/components/FamilyTreeDiagram';
import FamilyMembersTable from '@/components/FamilyMembersTable';
import AccountSettings from '@/components/AccountSettings';
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
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Welcome Section */}
        <div className="text-center py-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            سلام {userData?.member?.name}!
          </h1>
          <p className="text-gray-600">به داشبورد شجره‌نامه خانوادگی خوش آمدید</p>
        </div>

        {/* Family Tree Section */}
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">نمودار درختی خانواده</h3>
          <FamilyTreeDiagram />
        </div>

        {/* Family Members Table */}
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">جدول اعضای خانواده</h3>
          <FamilyMembersTable />
        </div>

        {/* Account Settings */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Profile Completion */}
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">تکمیل پروفایل</h3>
            <CompleteProfile />
          </div>

          {/* Account Settings */}
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">تنظیمات حساب</h3>
            <AccountSettings userData={userData} />
          </div>
        </div>

        {/* Quick Info */}
        <div className="bg-gray-50 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">کد دعوت شما:</p>
              <p className="text-xl font-bold text-gray-900 font-mono">
                {userData?.member?.invite_code || 'ندارد'}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">وضعیت:</p>
              <p className={`text-lg font-semibold ${
                userData?.is_verified ? 'text-green-600' : 'text-yellow-600'
              }`}>
                {userData?.is_verified ? 'تأیید شده' : 'در انتظار تأیید'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DashboardPage;
