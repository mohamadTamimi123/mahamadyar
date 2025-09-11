'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import FamilyTreeDiagram from '@/components/FamilyTreeDiagram';
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
          <p className="text-gray-600">نمودار درختی شخصی شما</p>
        </div>

        {/* Personal Family Tree */}
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <FamilyTreeDiagram />
        </div>
      </div>
    </>
  );
};

export default DashboardPage;
