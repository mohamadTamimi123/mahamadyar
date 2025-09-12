'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import axios from 'axios';
import api from '@/lib/api';

interface FamilyMember {
  id: number;
  name: string;
  father_name: string | null;
  father_id: number | null;
  father?: FamilyMember;
  children?: FamilyMember[];
  invite_code: string | null;
  created_at: string;
}

const EditMemberPage: React.FC = () => {
  const params = useParams();
  const router = useRouter();
  const memberId = params.id as string;

  // Validate memberId
  if (!memberId || memberId === 'undefined' || isNaN(Number(memberId))) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">خطا</h1>
          <p className="text-gray-600 mb-4">شناسه عضو نامعتبر است</p>
          <button
            onClick={() => router.push('/dashboard')}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            بازگشت به داشبورد
          </button>
        </div>
      </div>
    );
  }

  const [member, setMember] = useState<FamilyMember | null>(null);
  const [allMembers, setAllMembers] = useState<FamilyMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    father_id: null as number | null,
  });

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      
      // دریافت اطلاعات عضو
      const memberResponse = await api.get(`/family-members/${memberId}`);
      setMember(memberResponse.data);

      // دریافت همه اعضا برای انتخاب پدر
      const allMembersResponse = await api.get('/family-members');
      setAllMembers(allMembersResponse.data);

      // تنظیم فرم
      setFormData({
        name: memberResponse.data.name,
        father_id: memberResponse.data.father_id,
      });
    } catch (err: unknown) {
      console.error('Error fetching data:', err);
      setError('خطا در بارگذاری اطلاعات');
    } finally {
      setLoading(false);
    }
  }, [memberId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!member) return;

    try {
      setSaving(true);
      setError(null);

      const response = await axios.patch(
        `/family-members/${memberId}/edit`,
        formData,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.data) {
        alert('اطلاعات با موفقیت ذخیره شد!');
        router.push('/');
      }
    } catch (err: unknown) {
      console.error('Error updating member:', err);
      setError('خطا در ذخیره تغییرات');
    } finally {
      setSaving(false);
    }
  };

  const handleGenerateNewInviteCode = async () => {
    if (!member) return;

    try {
      setSaving(true);
      const response = await axios.post(
        `/family-members/${memberId}/generate-invite-code`,
        {},
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.data) {
        setMember({ ...member, invite_code: response.data.invite_code });
        alert(`کد دعوت جدید تولید شد: ${response.data.invite_code}`);
      }
    } catch (error) {
      console.error('Error generating invite code:', error);
      alert('خطا در تولید کد دعوت');
    } finally {
      setSaving(false);
    }
  };

  const copyInviteCode = () => {
    if (member?.invite_code) {
      navigator.clipboard.writeText(member.invite_code).then(() => {
        alert('کد دعوت کپی شد!');
      }).catch(() => {
        alert('خطا در کپی کردن کد دعوت');
      });
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-lg text-gray-600">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          در حال بارگذاری...
        </div>
      </div>
    );
  }

  if (error || !member) {
    return (
      <div className="flex justify-center items-center h-screen text-lg text-red-500">
        <div className="text-center">
          <div className="text-6xl mb-4">❌</div>
          {error || 'عضو مورد نظر یافت نشد'}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-lg mb-6 text-center shadow-lg">
          <h1 className="text-3xl font-bold mb-2">
            ✏️ ویرایش اطلاعات عضو
          </h1>
          <p className="text-lg opacity-90">
            ویرایش کامل اطلاعات {member.name}
          </p>
        </div>

        {/* Back Button */}
        <div className="mb-6">
          <button
            onClick={() => router.push('/')}
            className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
          >
            ← بازگشت به صفحه اصلی
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          {/* اطلاعات اصلی */}
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-bold text-gray-800 mb-4">📋 اطلاعات اصلی</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  نام:
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg text-base focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  dir="rtl"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  شناسه:
                </label>
                <input
                  type="text"
                  value={member.id}
                  disabled
                  className="w-full p-3 border border-gray-300 rounded-lg text-base bg-gray-100 text-gray-600"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  تاریخ ایجاد:
                </label>
                <input
                  type="text"
                  value={new Date(member.created_at).toLocaleDateString('fa-IR')}
                  disabled
                  className="w-full p-3 border border-gray-300 rounded-lg text-base bg-gray-100 text-gray-600"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  تعداد فرزندان:
                </label>
                <input
                  type="text"
                  value={member.children?.length || 0}
                  disabled
                  className="w-full p-3 border border-gray-300 rounded-lg text-base bg-gray-100 text-gray-600"
                />
              </div>
            </div>
          </div>

          {/* رابطه خانوادگی */}
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-bold text-gray-800 mb-4">👨‍👩‍👧‍👦 رابطه خانوادگی</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  نام پدر:
                </label>
                <select
                  value={formData.father_id || ''}
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    father_id: e.target.value ? parseInt(e.target.value) : null 
                  })}
                  className="w-full p-3 border border-gray-300 rounded-lg text-base focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  dir="rtl"
                >
                  <option value="">بدون پدر</option>
                  {allMembers
                    .filter(m => m.id !== member.id) // جلوگیری از انتخاب خود شخص به عنوان پدر
                    .map(father => (
                      <option key={father.id} value={father.id}>
                        {father.name} (شناسه: {father.id})
                      </option>
                    ))}
                </select>
              </div>

              {member.children && member.children.length > 0 && (
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    فرزندان:
                  </label>
                  <div className="bg-gray-50 p-4 rounded border">
                    <div className="space-y-2">
                      {member.children.map(child => (
                        <div key={child.id} className="text-sm text-gray-600 bg-white p-2 rounded">
                          • {child.name} (شناسه: {child.id})
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* کد دعوت */}
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-bold text-gray-800 mb-4">🎫 کد دعوت</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  کد دعوت فعلی:
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="text"
                    value={member.invite_code || 'ندارد'}
                    disabled
                    className="flex-1 p-3 border border-gray-300 rounded-lg text-base bg-gray-100 text-gray-600 font-mono"
                  />
                  {member.invite_code && (
                    <button
                      type="button"
                      onClick={copyInviteCode}
                      className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                      title="کپی کد دعوت"
                    >
                      📋 کپی
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={handleGenerateNewInviteCode}
                    disabled={saving}
                    className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50 transition-colors"
                    title="تولید کد دعوت جدید"
                  >
                    {saving ? '...' : '🔄 جدید'}
                  </button>
                </div>
              </div>

              <div className="bg-blue-50 p-4 rounded border">
                <div className="text-sm text-blue-800">
                  <strong>💡 راهنما:</strong> کد دعوت برای ثبت‌نام اعضای جدید استفاده می‌شود. 
                  هر عضو می‌تواند با استفاده از کد دعوت شما، عضو جدیدی را به خانواده اضافه کند.
                </div>
              </div>
            </div>
          </div>

          {/* دکمه‌های عملیات */}
          <div className="flex gap-4 pt-6">
            <button
              type="submit"
              disabled={saving}
              className="flex-1 bg-green-500 text-white py-4 px-8 rounded-lg font-bold text-lg hover:bg-green-600 disabled:opacity-50 transition-colors"
            >
              {saving ? 'در حال ذخیره...' : '💾 ذخیره تغییرات'}
            </button>
            <button
              type="button"
              onClick={() => router.push('/')}
              disabled={saving}
              className="flex-1 bg-gray-500 text-white py-4 px-8 rounded-lg font-bold text-lg hover:bg-gray-600 disabled:opacity-50 transition-colors"
            >
              ❌ انصراف
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditMemberPage;
