'use client';

import React, { useState, useEffect } from 'react';
import api from '@/lib/api';
import { useRouter } from 'next/navigation';

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

const FamilyTable: React.FC = () => {
  const router = useRouter();
  const [familyData, setFamilyData] = useState<FamilyMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<keyof FamilyMember>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(50);
  const [selectedMember, setSelectedMember] = useState<FamilyMember | null>(null);
  const [editingMember, setEditingMember] = useState<FamilyMember | null>(null);
  const [selectedFatherId, setSelectedFatherId] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);
  const [generatingInviteCode, setGeneratingInviteCode] = useState<number | null>(null);

  useEffect(() => {
    fetchFamilyData();
  }, []);

  const fetchFamilyData = async () => {
    try {
      setLoading(true);
      const response = await api.get('/family-members', {
        timeout: 10000,
      });
      console.log('API Response:', response.data.slice(0, 3)); // Debug log
      setFamilyData(response.data);
    } catch (err) {
      setError('خطا در بارگذاری داده‌ها');
      console.error('Error fetching family data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSort = (field: keyof FamilyMember) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
    setCurrentPage(1); // Reset to first page when sorting
  };

  const filteredAndSortedData = familyData
    .filter(member =>
      member.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];
      
      if (aValue === null || aValue === undefined) return 1;
      if (bValue === null || bValue === undefined) return -1;
      
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortDirection === 'asc' 
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }
      
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
      }
      
      return 0;
    });

  // Pagination
  const totalPages = Math.ceil(filteredAndSortedData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = filteredAndSortedData.slice(startIndex, endIndex);

  const goToPage = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  const handleEditFatherName = (member: FamilyMember) => {
    setEditingMember(member);
    setSelectedFatherId(member.father_id || null);
  };

  const handleSaveFatherName = async () => {
    if (!editingMember) return;

    try {
      setSaving(true);
      
      if (selectedFatherId) {
        // ایجاد رابطه پدر-فرزندی
        const response = await axios.post(
          `http://localhost:5000/family-members/${editingMember.id}/set-parent/${selectedFatherId}`,
          {},
          {
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );

        // بروزرسانی داده‌های محلی
        const selectedFather = familyData.find(m => m.id === selectedFatherId);
        setFamilyData(prevData =>
          prevData.map(member =>
            member.id === editingMember.id
              ? { 
                  ...member, 
                  father_id: selectedFatherId, 
                  father_name: selectedFather?.name || null,
                  father: selectedFather 
                }
              : member
          )
        );

        // بروزرسانی عضو انتخاب شده اگر همان عضو در حال ویرایش است
        if (selectedMember?.id === editingMember.id) {
          setSelectedMember({ 
            ...selectedMember, 
            father_id: selectedFatherId, 
            father_name: selectedFather?.name || null,
            father: selectedFather 
          });
        }
      } else {
        // حذف رابطه پدر-فرزندی
        await axios.delete(`http://localhost:5000/family-members/${editingMember.id}/parent`);

        // بروزرسانی داده‌های محلی
        setFamilyData(prevData =>
          prevData.map(member =>
            member.id === editingMember.id
              ? { ...member, father_name: null, father_id: null, father: undefined }
              : member
          )
        );

        // بروزرسانی عضو انتخاب شده اگر همان عضو در حال ویرایش است
        if (selectedMember?.id === editingMember.id) {
          setSelectedMember({ 
            ...selectedMember, 
            father_name: null, 
            father_id: null, 
            father: undefined 
          });
        }
      }

      setEditingMember(null);
      setSelectedFatherId(null);
    } catch (err) {
      console.error('Error updating father relationship:', err);
      setError('خطا در ذخیره تغییرات');
    } finally {
      setSaving(false);
    }
  };

  const handleCancelEdit = () => {
    setEditingMember(null);
    setSelectedFatherId(null);
  };

  const handleGenerateInviteCode = async (memberId: number) => {
    try {
      setGeneratingInviteCode(memberId);
      
      const response = await axios.post(
        `http://localhost:5000/family-members/${memberId}/generate-invite-code`,
        {},
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.data) {
        // بروزرسانی داده‌های محلی
        setFamilyData(prevData =>
          prevData.map(member =>
            member.id === memberId
              ? { ...member, invite_code: response.data.invite_code }
              : member
          )
        );

        // بروزرسانی عضو انتخاب شده اگر همان عضو است
        if (selectedMember?.id === memberId) {
          setSelectedMember({ 
            ...selectedMember, 
            invite_code: response.data.invite_code 
          });
        }

        alert(`کد دعوت جدید تولید شد: ${response.data.invite_code}`);
      }
    } catch (error) {
      console.error('Error generating invite code:', error);
      alert('خطا در تولید کد دعوت');
    } finally {
      setGeneratingInviteCode(null);
    }
  };

  const copyInviteCode = (inviteCode: string) => {
    navigator.clipboard.writeText(inviteCode).then(() => {
      alert('کد دعوت کپی شد!');
    }).catch(() => {
      alert('خطا در کپی کردن کد دعوت');
    });
  };

  const handleEditMember = (member: FamilyMember) => {
    router.push(`/edit/${member.id}`);
  };

  const handleRemoveParent = async (member: FamilyMember) => {
    if (!confirm(`آیا مطمئن هستید که می‌خواهید رابطه پدر-فرزندی ${member.name} را حذف کنید؟`)) {
      return;
    }

    try {
      setSaving(true);
      await axios.delete(`http://localhost:5000/family-members/${member.id}/parent`);

      // بروزرسانی داده‌های محلی
      setFamilyData(prevData =>
        prevData.map(m =>
          m.id === member.id
            ? { ...m, father_name: null, father_id: null }
            : m
        )
      );

      // بروزرسانی عضو انتخاب شده اگر همان عضو است
      if (selectedMember?.id === member.id) {
        setSelectedMember({ ...selectedMember, father_name: null, father_id: null });
      }
    } catch (err) {
      console.error('Error removing parent:', err);
      setError('خطا در حذف رابطه پدر-فرزندی');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-lg text-gray-600">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          در حال بارگذاری جدول...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen text-lg text-red-500">
        <div className="text-center">
          <div className="text-6xl mb-4">❌</div>
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="p-5 font-sans">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-lg mb-5 text-center shadow-lg">
        <h1 className="text-4xl font-bold mb-2">
          📊 جدول اعضای خانواده
        </h1>
        <p className="text-lg opacity-90">
          نمایش تمام اعضای خانواده در قالب جدول تعاملی
        </p>
      </div>

      {/* Controls */}
      <div className="bg-white p-6 rounded-lg shadow-lg mb-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block mb-2 font-bold text-slate-800">
              🔍 جستجو در نام‌ها:
            </label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="نام شخص را وارد کنید..."
              className="w-full p-3 border border-gray-300 rounded-lg text-base focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              dir="rtl"
            />
          </div>
          
          <div className="flex items-end">
            <div className="bg-gray-50 p-3 rounded-lg w-full">
              <div className="text-sm text-gray-600 space-y-1">
                <div>📊 تعداد کل اعضا: <span className="font-bold text-blue-600">{familyData.length}</span></div>
                <div>🔍 نتایج جستجو: <span className="font-bold text-green-600">{filteredAndSortedData.length}</span></div>
                <div>📄 صفحه {currentPage} از {totalPages}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-5">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="bg-gradient-to-r from-slate-700 to-slate-800">
                <th 
                  className="text-white p-4 text-center cursor-pointer border-r border-slate-600 font-bold hover:bg-slate-600 transition-colors"
                  onClick={() => handleSort('id')}
                >
                  <div className="flex items-center justify-center gap-2">
                    شناسه
                    {sortField === 'id' && (
                      <span className="text-lg">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                    )}
                  </div>
                </th>
                <th 
                  className="text-white p-4 text-center cursor-pointer border-r border-slate-600 font-bold hover:bg-slate-600 transition-colors"
                  onClick={() => handleSort('name')}
                >
                  <div className="flex items-center justify-center gap-2">
                    نام
                    {sortField === 'name' && (
                      <span className="text-lg">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                    )}
                  </div>
                </th>
                <th 
                  className="text-white p-4 text-center cursor-pointer border-r border-slate-600 font-bold hover:bg-slate-600 transition-colors"
                  onClick={() => handleSort('father_name')}
                >
                  <div className="flex items-center justify-center gap-2">
                    نام پدر
                    {sortField === 'father_name' && (
                      <span className="text-lg">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                    )}
                  </div>
                </th>
                <th 
                  className="text-white p-4 text-center cursor-pointer border-r border-slate-600 font-bold hover:bg-slate-600 transition-colors"
                  onClick={() => handleSort('invite_code')}
                >
                  <div className="flex items-center justify-center gap-2">
                    کد دعوت
                    {sortField === 'invite_code' && (
                      <span className="text-lg">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                    )}
                  </div>
                </th>
                <th 
                  className="text-white p-4 text-center cursor-pointer font-bold hover:bg-slate-600 transition-colors"
                  onClick={() => handleSort('created_at')}
                >
                  <div className="flex items-center justify-center gap-2">
                    تاریخ ایجاد
                    {sortField === 'created_at' && (
                      <span className="text-lg">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                    )}
                  </div>
                </th>
                <th className="text-white p-4 text-center font-bold">
                  عملیات
                </th>
              </tr>
            </thead>
            <tbody>
              {currentData.map((member, index) => (
                <tr 
                  key={member.id} 
                  className={`transition-colors hover:bg-blue-50 cursor-pointer ${
                    index % 2 === 0 ? 'bg-gray-50' : 'bg-white'
                  } ${selectedMember?.id === member.id ? 'bg-blue-100 border-l-4 border-blue-500' : ''}`}
                  onClick={() => setSelectedMember(member)}
                >
                  <td className="p-4 border-r border-gray-300 text-center font-mono text-xs">
                    {member.id}
                  </td>
                  <td className="p-4 border-r border-gray-300 text-center font-bold text-slate-800">
                    {member.name}
                  </td>
                  <td className="p-4 border-r border-gray-300 text-center text-gray-600">
                    {editingMember?.id === member.id ? (
                      <select
                        value={selectedFatherId || ''}
                        onChange={(e) => setSelectedFatherId(e.target.value ? parseInt(e.target.value) : null)}
                        className="w-full p-2 border border-gray-300 rounded text-center"
                        dir="rtl"
                        autoFocus
                      >
                        <option value="">بدون پدر</option>
                        {familyData
                          .filter(m => m.id !== member.id) // جلوگیری از انتخاب خود شخص به عنوان پدر
                          .map(father => (
                            <option key={father.id} value={father.id}>
                              {father.name}
                            </option>
                          ))}
                      </select>
                    ) : (
                      member.father_name || 'نامشخص'
                    )}
                  </td>
                  <td className="p-4 border-r border-gray-300 text-center text-gray-600">
                    <div className="flex items-center justify-center gap-2">
                      <span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded">
                        {member.invite_code || 'ندارد'}
                      </span>
                      {member.invite_code && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            copyInviteCode(member.invite_code!);
                          }}
                          className="px-2 py-1 bg-blue-500 text-white rounded text-xs hover:bg-blue-600"
                          title="کپی کد دعوت"
                        >
                          📋
                        </button>
                      )}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleGenerateInviteCode(member.id);
                        }}
                        disabled={generatingInviteCode === member.id}
                        className="px-2 py-1 bg-green-500 text-white rounded text-xs hover:bg-green-600 disabled:opacity-50"
                        title="تولید کد دعوت جدید"
                      >
                        {generatingInviteCode === member.id ? '...' : '🔄'}
                      </button>
                    </div>
                  </td>
                  <td className="p-4 border-r border-gray-300 text-center text-gray-600">
                    {new Date(member.created_at).toLocaleDateString('fa-IR')}
                  </td>
                  <td className="p-4 text-center">
                    {editingMember?.id === member.id ? (
                      <div className="flex gap-2 justify-center">
                        <button
                          onClick={handleSaveFatherName}
                          disabled={saving}
                          className="px-3 py-1 bg-green-500 text-white rounded text-sm hover:bg-green-600 disabled:opacity-50"
                        >
                          {saving ? '...' : '💾'}
                        </button>
                        <button
                          onClick={handleCancelEdit}
                          disabled={saving}
                          className="px-3 py-1 bg-gray-500 text-white rounded text-sm hover:bg-gray-600 disabled:opacity-50"
                        >
                          ❌
                        </button>
                      </div>
                    ) : (
                      <div className="flex gap-2 justify-center">
                        <button
                          onClick={() => handleEditMember(member)}
                          className="px-3 py-1 bg-purple-500 text-white rounded text-sm hover:bg-purple-600"
                          title="ویرایش کامل اطلاعات"
                        >
                          ✏️ ویرایش
                        </button>
                        <button
                          onClick={() => handleEditFatherName(member)}
                          className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
                          title="ویرایش نام پدر"
                        >
                          👨‍👦
                        </button>
                        {member.father_name && (
                          <button
                            onClick={() => handleRemoveParent(member)}
                            className="px-3 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600"
                            title="حذف رابطه پدر-فرزندی"
                          >
                            🗑️
                          </button>
                        )}
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredAndSortedData.length === 0 && (
          <div className="text-center text-gray-600 text-lg py-10">
            <div className="text-6xl mb-4">🔍</div>
            {searchTerm ? 'نتیجه‌ای یافت نشد' : 'داده‌ای موجود نیست'}
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="bg-white p-4 rounded-lg shadow-lg mb-5">
          <div className="flex justify-center items-center gap-2">
            <button
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-3 py-2 bg-gray-200 text-gray-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-300 transition-colors"
            >
              قبلی
            </button>
            
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              const page = i + 1;
              return (
                <button
                  key={page}
                  onClick={() => goToPage(page)}
                  className={`px-3 py-2 rounded-lg transition-colors ${
                    currentPage === page
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {page}
                </button>
              );
            })}
            
            <button
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-3 py-2 bg-gray-200 text-gray-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-300 transition-colors"
            >
              بعدی
            </button>
          </div>
        </div>
      )}

      {/* Selected Member Details */}
      {selectedMember && (
        <div className="bg-white p-6 rounded-lg shadow-lg mb-5">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold text-slate-800">
              📋 جزئیات انتخاب شده
            </h3>
            <button
              onClick={() => handleEditMember(selectedMember)}
              className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
              title="ویرایش کامل اطلاعات"
            >
              ✏️ ویرایش کامل
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div><strong>شناسه:</strong> {selectedMember.id}</div>
              <div><strong>نام:</strong> {selectedMember.name}</div>
              <div><strong>نام پدر:</strong> {selectedMember.father_name || 'نامشخص'}</div>
              <div><strong>شناسه پدر:</strong> {selectedMember.father_id || 'ندارد'}</div>
            </div>
            <div className="space-y-2">
              <div><strong>کد دعوت:</strong> 
                <span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded ml-2">
                  {selectedMember.invite_code || 'ندارد'}
                </span>
                {selectedMember.invite_code && (
                  <button
                    onClick={() => copyInviteCode(selectedMember.invite_code!)}
                    className="px-2 py-1 bg-blue-500 text-white rounded text-xs hover:bg-blue-600 ml-2"
                    title="کپی کد دعوت"
                  >
                    📋 کپی
                  </button>
                )}
                <button
                  onClick={() => handleGenerateInviteCode(selectedMember.id)}
                  disabled={generatingInviteCode === selectedMember.id}
                  className="px-2 py-1 bg-green-500 text-white rounded text-xs hover:bg-green-600 disabled:opacity-50 ml-2"
                  title="تولید کد دعوت جدید"
                >
                  {generatingInviteCode === selectedMember.id ? '...' : '🔄 جدید'}
                </button>
              </div>
              <div><strong>تاریخ ایجاد:</strong> {new Date(selectedMember.created_at).toLocaleDateString('fa-IR')}</div>
              <div><strong>تعداد فرزندان:</strong> {selectedMember.children?.length || 0}</div>
              <div><strong>وضعیت:</strong> 
                <span className={`ml-2 px-2 py-1 rounded text-xs ${
                  (selectedMember.children?.length || 0) > 0 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-blue-100 text-blue-800'
                }`}>
                  {(selectedMember.children?.length || 0) > 0 ? 'دارای فرزند' : 'بدون فرزند'}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Instructions */}
      <div className="bg-blue-50 p-6 rounded-lg text-center">
        <h4 className="text-lg font-bold text-blue-800 mb-2">💡 راهنمای استفاده</h4>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm text-blue-700">
          <div>🔍 برای جستجو در نام‌ها از کادر بالا استفاده کنید</div>
          <div>📊 برای مرتب‌سازی روی هدر ستون‌ها کلیک کنید</div>
          <div>🖱️ برای مشاهده جزئیات روی هر ردیف کلیک کنید</div>
          <div>✏️ برای ویرایش کامل اطلاعات روی دکمه "ویرایش" کلیک کنید</div>
          <div>👨‍👦 برای ویرایش سریع نام پدر روی دکمه مربوطه کلیک کنید</div>
          <div>📋 برای کپی کردن کد دعوت روی دکمه کپی کلیک کنید</div>
          <div>🔄 برای تولید کد دعوت جدید روی دکمه تولید کلیک کنید</div>
          <div>🎫 هر عضو دارای کد دعوت منحصر به فرد برای ثبت‌نام اعضای جدید است</div>
        </div>
      </div>
    </div>
  );
};

export default FamilyTable;