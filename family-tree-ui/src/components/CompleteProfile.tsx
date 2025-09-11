'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface UserProfile {
  id: number;
  email: string;
  is_verified: boolean;
  profile_image?: string;
  national_id?: string;
  member?: {
    id: number;
    name: string;
    family_name: string;
    father_name: string | null;
    invite_code: string | null;
    profile_image?: string;
    national_id?: string;
    phone?: string;
  };
}

interface ProfileFormData {
  profile_image: string;
  national_id: string;
  phone: string;
}

const CompleteProfile: React.FC = () => {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState<ProfileFormData>({
    profile_image: '',
    national_id: '',
    phone: ''
  });
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Partial<ProfileFormData>>({});

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      // Get user data from localStorage or API
      const userData = JSON.parse(localStorage.getItem('userData') || '{}');
      setUserProfile(userData);
      
      // If we have member data, fetch the latest profile info
      if (userData.member?.id) {
        const response = await axios.get(`http://localhost:5000/family-members/${userData.member.id}`);
        setUserProfile(prev => ({
          ...prev,
          member: {
            ...prev?.member,
            ...response.data,
            profile_image: response.data.profile_image,
            national_id: response.data.national_id,
            phone: response.data.phone
          }
        }));

        // Set form data with existing values
        setFormData({
          profile_image: response.data.profile_image || '',
          national_id: response.data.national_id || '',
          phone: response.data.phone || ''
        });
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<ProfileFormData> = {};

    if (!formData.national_id.trim()) {
      newErrors.national_id = 'کد ملی الزامی است';
    } else if (!/^\d{10}$/.test(formData.national_id)) {
      newErrors.national_id = 'کد ملی باید ۱۰ رقم باشد';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'شماره تلفن الزامی است';
    } else if (!/^09\d{9}$/.test(formData.phone)) {
      newErrors.phone = 'شماره تلفن باید با 09 شروع شود و 11 رقم باشد';
    }

    if (formData.profile_image && !isValidUrl(formData.profile_image)) {
      newErrors.profile_image = 'آدرس عکس نامعتبر است';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isValidUrl = (string: string): boolean => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  };

  const handleSave = async () => {
    if (!validateForm() || !userProfile?.member?.id) return;

    setSaving(true);
    try {
      const response = await axios.patch(
        `http://localhost:5000/family-members/${userProfile.member.id}/profile`,
        formData
      );

      if (response.data.success) {
        setUserProfile(prev => ({
          ...prev,
          member: {
            ...prev?.member,
            profile_image: formData.profile_image,
            national_id: formData.national_id,
            phone: formData.phone
          }
        }));
        alert('اطلاعات پروفایل با موفقیت تکمیل شد');
      } else {
        alert(response.data.message || 'خطا در تکمیل پروفایل');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('خطا در تکمیل پروفایل');
    } finally {
      setSaving(false);
    }
  };

  const isProfileComplete = (): boolean => {
    return !!(formData.national_id && formData.phone);
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center mr-3">
            <span className="text-white text-xl">📝</span>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">تکمیل حساب کاربری</h3>
            <p className="text-sm text-gray-500">
              {isProfileComplete() ? 'پروفایل تکمیل شده' : 'لطفاً اطلاعات زیر را تکمیل کنید'}
            </p>
          </div>
        </div>
        <div className={`px-3 py-1 rounded-full text-xs font-medium ${
          isProfileComplete() 
            ? 'bg-green-100 text-green-700' 
            : 'bg-orange-100 text-orange-700'
        }`}>
          {isProfileComplete() ? 'تکمیل شده' : 'ناقص'}
        </div>
      </div>

      <div className="space-y-6">
        {/* Profile Image */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            عکس پروفایل <span className="text-gray-400">(اختیاری)</span>
          </label>
          <div className="space-y-3">
            <input
              type="url"
              value={formData.profile_image}
              onChange={(e) => {
                setFormData(prev => ({ ...prev, profile_image: e.target.value }));
                if (errors.profile_image) {
                  setErrors(prev => ({ ...prev, profile_image: undefined }));
                }
              }}
              placeholder="آدرس URL عکس پروفایل"
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.profile_image ? 'border-red-300' : 'border-gray-300'
              }`}
            />
            {errors.profile_image && (
              <p className="text-red-500 text-sm">{errors.profile_image}</p>
            )}
            {formData.profile_image && (
              <div className="mt-2">
                <img
                  src={formData.profile_image}
                  alt="Preview"
                  className="w-20 h-20 rounded-lg object-cover border border-gray-200"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              </div>
            )}
          </div>
        </div>

        {/* National ID */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            کد ملی <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.national_id}
            onChange={(e) => {
              const value = e.target.value.replace(/\D/g, '').slice(0, 10);
              setFormData(prev => ({ ...prev, national_id: value }));
              if (errors.national_id) {
                setErrors(prev => ({ ...prev, national_id: undefined }));
              }
            }}
            placeholder="کد ملی خود را وارد کنید"
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors.national_id ? 'border-red-300' : 'border-gray-300'
            }`}
            maxLength={10}
          />
          {errors.national_id && (
            <p className="text-red-500 text-sm">{errors.national_id}</p>
          )}
        </div>

        {/* Phone */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            شماره تلفن <span className="text-red-500">*</span>
          </label>
          <input
            type="tel"
            value={formData.phone}
            onChange={(e) => {
              const value = e.target.value.replace(/\D/g, '').slice(0, 11);
              setFormData(prev => ({ ...prev, phone: value }));
              if (errors.phone) {
                setErrors(prev => ({ ...prev, phone: undefined }));
              }
            }}
            placeholder="شماره تلفن خود را وارد کنید"
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors.phone ? 'border-red-300' : 'border-gray-300'
            }`}
            maxLength={11}
          />
          {errors.phone && (
            <p className="text-red-500 text-sm">{errors.phone}</p>
          )}
        </div>

        {/* Current Info Display */}
        <div className="bg-gray-50 rounded-xl p-4">
          <h4 className="font-medium text-gray-900 mb-3">اطلاعات فعلی شما:</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
            <div>
              <span className="text-gray-600">نام:</span>
              <span className="font-medium mr-2">{userProfile?.member?.name || 'ندارد'}</span>
            </div>
            <div>
              <span className="text-gray-600">نام خانوادگی:</span>
              <span className="font-medium mr-2">{userProfile?.member?.family_name || 'ندارد'}</span>
            </div>
            <div>
              <span className="text-gray-600">نام پدر:</span>
              <span className="font-medium mr-2">{userProfile?.member?.father_name || 'ندارد'}</span>
            </div>
            <div>
              <span className="text-gray-600">ایمیل:</span>
              <span className="font-medium mr-2">{userProfile?.email || 'ندارد'}</span>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="pt-4 border-t border-gray-200">
          <button
            onClick={handleSave}
            disabled={saving || !isProfileComplete()}
            className={`w-full py-3 rounded-lg font-medium transition-colors ${
              saving || !isProfileComplete()
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:from-green-600 hover:to-emerald-700'
            }`}
          >
            {saving ? 'در حال ذخیره...' : 'تکمیل حساب کاربری'}
          </button>
          {!isProfileComplete() && (
            <p className="text-center text-sm text-gray-500 mt-2">
              لطفاً فیلدهای الزامی را پر کنید
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default CompleteProfile;
