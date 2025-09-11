'use client';

import React, { useState } from 'react';
import api from '@/lib/api';

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

interface AccountSettingsProps {
  userData: UserData | null;
}

const AccountSettings: React.FC<AccountSettingsProps> = ({ userData }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  
  const [formData, setFormData] = useState({
    name: userData?.member?.name || '',
    family_name: userData?.member?.family_name || '',
    father_name: userData?.member?.father_name || '',
    email: userData?.email || '',
    national_id: userData?.member?.national_id || '',
    profile_image: userData?.member?.profile_image || '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = async () => {
    if (!userData?.member?.id) return;
    
    setLoading(true);
    setMessage(null);
    
    try {
      // Update profile information
      await api.patch(`/family-members/${userData.member.id}/profile`, {
        national_id: formData.national_id,
        profile_image: formData.profile_image,
      });
      
      setMessage({ type: 'success', text: 'اطلاعات با موفقیت به‌روزرسانی شد' });
      setIsEditing(false);
    } catch (error) {
      setMessage({ type: 'error', text: 'خطا در به‌روزرسانی اطلاعات' });
      console.error('Error updating profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      name: userData?.member?.name || '',
      family_name: userData?.member?.family_name || '',
      father_name: userData?.member?.father_name || '',
      email: userData?.email || '',
      national_id: userData?.member?.national_id || '',
      profile_image: userData?.member?.profile_image || '',
    });
    setIsEditing(false);
    setMessage(null);
  };

  return (
    <div className="space-y-6">
      {/* Message */}
      {message && (
        <div className={`p-4 rounded-lg ${
          message.type === 'success' 
            ? 'bg-green-50 text-green-700 border border-green-200' 
            : 'bg-red-50 text-red-700 border border-red-200'
        }`}>
          {message.text}
        </div>
      )}

      {/* Profile Image */}
      <div className="text-center">
        <div className="w-20 h-20 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center overflow-hidden">
          {formData.profile_image ? (
            <img 
              src={formData.profile_image} 
              alt="Profile" 
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-2xl text-gray-500">👤</span>
          )}
        </div>
        {isEditing && (
          <input
            type="url"
            name="profile_image"
            value={formData.profile_image}
            onChange={handleInputChange}
            placeholder="آدرس تصویر پروفایل"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        )}
      </div>

      {/* Form Fields */}
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">نام</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            disabled={!isEditing}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:text-gray-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">نام خانوادگی</label>
          <input
            type="text"
            name="family_name"
            value={formData.family_name}
            onChange={handleInputChange}
            disabled={!isEditing}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:text-gray-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">نام پدر</label>
          <input
            type="text"
            name="father_name"
            value={formData.father_name}
            onChange={handleInputChange}
            disabled={!isEditing}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:text-gray-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">ایمیل</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            disabled
            className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-500"
          />
          <p className="text-xs text-gray-500 mt-1">ایمیل قابل تغییر نیست</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">کد ملی</label>
          <input
            type="text"
            name="national_id"
            value={formData.national_id}
            onChange={handleInputChange}
            disabled={!isEditing}
            placeholder="کد ملی 10 رقمی"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:text-gray-500"
          />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3">
        {isEditing ? (
          <>
            <button
              onClick={handleSave}
              disabled={loading}
              className="flex-1 bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50"
            >
              {loading ? 'در حال ذخیره...' : 'ذخیره تغییرات'}
            </button>
            <button
              onClick={handleCancel}
              className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400 transition-colors"
            >
              انصراف
            </button>
          </>
        ) : (
          <button
            onClick={() => setIsEditing(true)}
            className="w-full bg-gray-900 text-white py-2 px-4 rounded-lg hover:bg-black transition-colors"
          >
            ویرایش اطلاعات
          </button>
        )}
      </div>

      {/* Account Status */}
      <div className="pt-4 border-t border-gray-200">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">وضعیت حساب:</span>
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
            userData?.is_verified 
              ? 'bg-green-100 text-green-700' 
              : 'bg-yellow-100 text-yellow-700'
          }`}>
            {userData?.is_verified ? 'تأیید شده' : 'در انتظار تأیید'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default AccountSettings;
