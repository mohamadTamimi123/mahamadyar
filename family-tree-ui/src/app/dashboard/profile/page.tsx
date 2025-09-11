'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import CompleteProfile from '@/components/CompleteProfile';
import AccountSettings from '@/components/AccountSettings';
import FamilyMembersTable from '@/components/FamilyMembersTable';

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
    profile_image: string | null;
    national_id: string | null;
  };
}

const ProfilePage: React.FC = () => {
  const router = useRouter();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'profile' | 'settings' | 'family'>('profile');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }
    fetchUserData();
  }, [router]);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/me`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('خطا در دریافت اطلاعات کاربر');
      }

      const data = await response.json();
      setUserData(data);
    } catch (error) {
      console.error('Error fetching user data:', error);
      // router.push('/login');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">در حال بارگذاری...</p>
        </div>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-4xl mb-4">❌</div>
          <p className="text-red-600 mb-4">خطا در بارگذاری اطلاعات کاربر</p>
          <button 
            onClick={() => router.push('/login')}
            className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors"
          >
            بازگشت به ورود
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            مدیریت حساب کاربری
          </h1>
          <p className="text-gray-600">تکمیل و ویرایش اطلاعات شخصی شما</p>
        </div>

        {/* Tab Navigation */}
        <div className="flex justify-center mb-8">
          <div className="bg-gray-100 rounded-2xl p-2 inline-flex">
            <button
              onClick={() => setActiveTab('profile')}
              className={`flex items-center px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                activeTab === 'profile'
                  ? 'bg-white text-gray-900 shadow-lg shadow-gray-200/50'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'
              }`}
            >
              <span className="text-xl mr-3">📝</span>
              <span className="text-sm font-semibold">تکمیل پروفایل</span>
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              className={`flex items-center px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                activeTab === 'settings'
                  ? 'bg-white text-gray-900 shadow-lg shadow-gray-200/50'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'
              }`}
            >
              <span className="text-xl mr-3">⚙️</span>
              <span className="text-sm font-semibold">تنظیمات حساب</span>
            </button>
            <button
              onClick={() => setActiveTab('family')}
              className={`flex items-center px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                activeTab === 'family'
                  ? 'bg-white text-gray-900 shadow-lg shadow-gray-200/50'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'
              }`}
            >
              <span className="text-xl mr-3">👥</span>
              <span className="text-sm font-semibold">اعضای خانواده</span>
            </button>
          </div>
        </div>

        {/* Tab Content */}
        <div className="min-h-[600px]">
          {activeTab === 'profile' && (
            <div className="animate-fadeIn">
              <div className="bg-white rounded-xl p-8 border border-gray-200 shadow-sm">
                <CompleteProfile />
              </div>
            </div>
          )}
          
          {activeTab === 'settings' && (
            <div className="animate-fadeIn">
              <div className="bg-white rounded-xl p-8 border border-gray-200 shadow-sm">
                <AccountSettings userData={userData} />
              </div>
            </div>
          )}
          
          {activeTab === 'family' && (
            <div className="animate-fadeIn">
              <div className="bg-white rounded-xl p-8 border border-gray-200 shadow-sm">
                <FamilyMembersTable />
              </div>
            </div>
          )}
        </div>

        {/* Quick Info */}
        <div className="mt-8 bg-gray-50 rounded-xl p-6">
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
    </div>
  );
};

export default ProfilePage;
