'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import AdminSidebar from '@/components/AdminSidebar';

interface FamilyMember {
  id: number;
  name: string;
  family_name: string;
  father_name?: string;
  father_id?: number;
  invite_code?: string;
  created_at: string;
}

const AddMemberPage: React.FC = () => {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    family_name: '',
    fatherId: '',
  });

  const [availableMembers, setAvailableMembers] = useState<FamilyMember[]>([]);
  const [showMembersList, setShowMembersList] = useState(false);
  const [selectedFather, setSelectedFather] = useState<FamilyMember | null>(null);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const loadAllMembers = async () => {
    try {
      const response = await api.get('/family-members');
      setAvailableMembers(response.data);
    } catch (err: unknown) {
      console.error('خطا در بارگذاری اعضا:', err);
    }
  };

  const selectFather = (member: FamilyMember) => {
    setSelectedFather(member);
    setFormData(prev => ({
      ...prev,
      fatherId: member.id.toString()
    }));
    setShowMembersList(false);
  };

  const removeFather = () => {
    setSelectedFather(null);
    setFormData(prev => ({
      ...prev,
      fatherId: ''
    }));
  };

  useEffect(() => {
    loadAllMembers();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // اعتبارسنجی
    if (!formData.name.trim()) {
      setError('لطفاً نام عضو را وارد کنید');
      return;
    }
    if (!formData.family_name.trim()) {
      setError('لطفاً نام خانوادگی عضو را وارد کنید');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setSuccess(null);

      const memberData = {
        name: formData.name,
        family_name: formData.family_name,
        father_id: formData.fatherId ? parseInt(formData.fatherId) : null,
      };

      const response = await api.post('/family-members', memberData);

      if (response.data) {
        setSuccess('عضو جدید با موفقیت اضافه شد!');
        // پاک کردن فرم
        setFormData({
          name: '',
          family_name: '',
          fatherId: '',
        });
        setSelectedFather(null);
        
        // بعد از 2 ثانیه به صفحه ادمین برگرد
        setTimeout(() => {
          router.push('/admin');
        }, 2000);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'خطا در اضافه کردن عضو');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      <div className="flex-1 ">
        <div className="p-4">
          {/* Mobile Header */}
          <div className="lg:hidden bg-white border border-gray-200 p-3 mb-4">
            <div className="flex items-center justify-between">
              <button
                onClick={() => setSidebarOpen(true)}
                className="p-1 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              <h1 className="text-lg font-semibold text-gray-900">اضافه کردن عضو</h1>
              <div className="w-8"></div>
            </div>
          </div>

          {/* Desktop Header */}
          <div className="hidden lg:block bg-white border border-gray-200 p-3 mb-4">
            <div className="flex justify-between items-center">
              <h1 className="text-lg font-semibold text-gray-900">اضافه کردن عضو جدید</h1>
              <button
                onClick={() => router.push('/admin')}
                className="px-3 py-1 bg-gray-500 text-white rounded text-sm hover:bg-gray-600 transition-colors"
              >
                ← بازگشت
              </button>
            </div>
          </div>

          {/* Form */}
          <div className="bg-white border border-gray-200 p-3">
            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  نام عضو <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="نام کامل عضو"
                  className="w-full p-2 border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent text-sm"
                  dir="rtl"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  نام خانوادگی <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.family_name}
                  onChange={(e) => handleInputChange('family_name', e.target.value)}
                  placeholder="نام خانوادگی عضو"
                  className="w-full p-2 border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent text-sm"
                  dir="rtl"
                  required
                />
              </div>

              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  پدر (اختیاری)
                </label>
                
                {selectedFather ? (
                  <div className="flex items-center justify-between p-2 border border-gray-300 rounded bg-gray-50">
                    <div>
                      <div className="font-medium text-sm">{selectedFather.name}</div>
                      <div className="text-xs text-gray-500">ID: {selectedFather.id}</div>
                    </div>
                    <button
                      type="button"
                      onClick={removeFather}
                      className="text-red-500 hover:text-red-700 text-xs"
                    >
                      حذف
                    </button>
                  </div>
                ) : (
                  <div>
                    <button
                      type="button"
                      onClick={() => setShowMembersList(!showMembersList)}
                      className="w-full p-2 border border-gray-300 rounded text-right hover:bg-gray-50 transition-colors text-sm"
                    >
                      {showMembersList ? 'بستن لیست' : 'انتخاب پدر از اعضای موجود'}
                    </button>
                    
                    {showMembersList && (
                      <div className="mt-1 border border-gray-300 rounded bg-white max-h-48 overflow-y-auto">
                        {availableMembers.map((member) => (
                          <button
                            key={member.id}
                            type="button"
                            onClick={() => selectFather(member)}
                            className="w-full text-right p-2 hover:bg-gray-50 border-b border-gray-100 last:border-b-0 text-sm"
                          >
                            <div className="font-medium">{member.name}</div>
                            <div className="text-xs text-gray-500">
                              ID: {member.id} | پدر: {member.father_name || 'ندارد'}
                            </div>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => router.push('/admin')}
                  className="flex-1 py-2 bg-gray-500 text-white rounded text-sm hover:bg-gray-600 transition-colors"
                >
                  انصراف
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 py-2 bg-green-600 text-white rounded text-sm hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white mr-1"></div>
                      در حال اضافه کردن...
                    </div>
                  ) : (
                    'اضافه کردن عضو'
                  )}
                </button>
              </div>
            </form>

            {/* Error Message */}
            {error && (
              <div className="mt-3 p-2 bg-red-50 border border-red-200 rounded">
                <div className="flex items-center">
                  <span className="text-red-500 text-sm mr-1">❌</span>
                  <span className="text-red-700 text-sm">{error}</span>
                </div>
              </div>
            )}

            {/* Success Message */}
            {success && (
              <div className="mt-3 p-2 bg-green-50 border border-green-200 rounded">
                <div className="flex items-center">
                  <span className="text-green-500 text-sm mr-1">✅</span>
                  <span className="text-green-700 text-sm">{success}</span>
                </div>
              </div>
            )}
          </div>

          {/* Instructions */}
          <div className="mt-3 bg-blue-50 p-2 rounded">
            <h4 className="text-xs font-medium text-blue-800 mb-1">راهنما</h4>
            <div className="text-xs text-blue-700 space-y-0.5">
              <div>• نام و نام خانوادگی اجباری است</div>
              <div>• پدر از اعضای موجود انتخاب می‌شود</div>
              <div>• رابطه پدر-فرزندی خودکار ایجاد می‌شود</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddMemberPage;
