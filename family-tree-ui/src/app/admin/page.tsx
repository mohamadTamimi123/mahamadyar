'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import api from '@/lib/api';
import AdminSidebar from '@/components/AdminSidebar';

interface FamilyMember {
  id: number;
  name: string;
  family_name: string;
  father_name: string | null;
  father_id: number | null;
  father?: FamilyMember;
  children?: FamilyMember[];
  invite_code: string | null;
  created_at: string;
}

const AdminDashboard: React.FC = () => {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [familyData, setFamilyData] = useState<FamilyMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<keyof FamilyMember>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(50);
  const [selectedMember, setSelectedMember] = useState<FamilyMember | null>(null);
  const [stats, setStats] = useState({
    totalMembers: 0,
    membersWithFather: 0,
    membersWithoutFather: 0,
    totalInviteCodes: 0,
  });

  const calculateStats = (data: FamilyMember[]) => {
    const totalMembers = data.length;
    const membersWithFather = data.filter(m => m.father_id).length;
    const membersWithoutFather = totalMembers - membersWithFather;
    const totalInviteCodes = data.filter(m => m.invite_code).length;
    
    setStats({
      totalMembers,
      membersWithFather,
      membersWithoutFather,
      totalInviteCodes,
    });
  };

  const fetchFamilyData = useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.get('/family-members', {
        timeout: 10000,
      });
      
      setFamilyData(response.data);
      calculateStats(response.data);
    } catch (err: unknown) {
      setError('خطا در بارگذاری داده‌ها');
      console.error('Error fetching family data:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFamilyData();
  }, [fetchFamilyData]);

  const handleSort = (field: keyof FamilyMember) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
    setCurrentPage(1);
  };

  const filteredAndSortedData = familyData
    .filter(member =>
      member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (member.father_name && member.father_name.toLowerCase().includes(searchTerm.toLowerCase()))
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

  const handleEditMember = (member: FamilyMember) => {
    router.push(`/admin/edit-member/${member.id}`);
  };

  const handleDeleteMember = async (member: FamilyMember) => {
    if (!confirm(`آیا مطمئن هستید که می‌خواهید ${member.name} را حذف کنید؟`)) {
      return;
    }

    try {
      await axios.delete(`http://localhost:5000/family-members/${member.id}`);
      setFamilyData(prevData => prevData.filter(m => m.id !== member.id));
      calculateStats(familyData.filter(m => m.id !== member.id));
      
      if (selectedMember?.id === member.id) {
        setSelectedMember(null);
      }
      
      alert('عضو با موفقیت حذف شد!');
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      console.error('Error deleting member:', error);
      alert('خطا در حذف عضو');
    }
  };

  // const handleGenerateInviteCode = async (memberId: number) => {
  //   try {
  //     const response = await axios.post(
  //       `http://localhost:5000/family-members/${memberId}/generate-invite-code`,
  //       {},
  //       {
  //         headers: {
  //           'Content-Type': 'application/json',
  //         },
  //       }
  //     );

  //     if (response.data) {
  //       setFamilyData(prevData =>
  //         prevData.map(member =>
  //           member.id === memberId
  //             ? { ...member, invite_code: response.data.invite_code }
  //             : member
  //         )
  //       );

  //       if (selectedMember?.id === memberId) {
  //         setSelectedMember({ 
  //           ...selectedMember, 
  //           invite_code: response.data.invite_code 
  //         });
  //       }

  //       alert(`کد دعوت جدید تولید شد: ${response.data.invite_code}`);
  //     }
  //   } catch (error) {
  //     console.error('Error generating invite code:', error);
  //     alert('خطا در تولید کد دعوت');
  //   }
  // };

  // const copyInviteCode = (inviteCode: string) => {
  //   navigator.clipboard.writeText(inviteCode).then(() => {
  //     alert('کد دعوت کپی شد!');
  //   });
  // };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex">
        <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <div className="flex-1 lg:mr-80 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto mb-4"></div>
            در حال بارگذاری داشبورد ادمین...
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex">
        <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <div className="flex-1 lg:mr-80 flex items-center justify-center">
          <div className="text-center">
            <div className="text-6xl mb-4">❌</div>
            {error}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      <div className="flex-1 ">
        <div className="p-6">
          {/* Mobile Header */}
          <div className="lg:hidden bg-white rounded-lg shadow-lg p-4 mb-6">
            <div className="flex items-center justify-between">
              <button
                onClick={() => setSidebarOpen(true)}
                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              <h1 className="text-xl font-bold text-gray-900">داشبورد ادمین</h1>
              <div className="w-10"></div>
            </div>
          </div>

          {/* Desktop Header */}
          <div className="hidden lg:block bg-white border border-gray-200 p-4 rounded-lg mb-4">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-xl font-semibold text-gray-900">
                  داشبورد ادمین
                </h1>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => router.push('/admin/add-member')}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
                >
                  ➕ عضو جدید
                </button>
                <button
                  onClick={() => router.push('/index')}
                  className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors text-sm"
                >
                  ← بازگشت
                </button>
              </div>
            </div>
          </div>

          {/* Statistics Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
            <div className="bg-white p-3 rounded-lg border border-gray-200">
              <div className="text-center">
                <p className="text-xs text-gray-600">کل اعضا</p>
                <p className="text-lg font-semibold text-gray-900">{stats.totalMembers}</p>
              </div>
            </div>
            <div className="bg-white p-3 rounded-lg border border-gray-200">
              <div className="text-center">
                <p className="text-xs text-gray-600">دارای پدر</p>
                <p className="text-lg font-semibold text-gray-900">{stats.membersWithFather}</p>
              </div>
            </div>
            <div className="bg-white p-3 rounded-lg border border-gray-200">
              <div className="text-center">
                <p className="text-xs text-gray-600">ریشه‌ها</p>
                <p className="text-lg font-semibold text-gray-900">{stats.membersWithoutFather}</p>
              </div>
            </div>
            <div className="bg-white p-3 rounded-lg border border-gray-200">
              <div className="text-center">
                <p className="text-xs text-gray-600">کدهای دعوت</p>
                <p className="text-lg font-semibold text-gray-900">{stats.totalInviteCodes}</p>
              </div>
            </div>
          </div>

          {/* Search */}
          <div className="bg-white p-3 rounded-lg border border-gray-200 mb-4">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="جستجو در نام‌ها..."
              className="w-full p-2 border border-gray-300 rounded text-sm focus:ring-1 focus:ring-blue-500 focus:border-transparent"
              dir="rtl"
            />
          </div>

          {/* Members Table */}
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden mb-4">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr className="bg-gray-50">
                    <th 
                      className="text-gray-700 p-3 text-center cursor-pointer border-r border-gray-200 font-medium hover:bg-gray-100 transition-colors"
                      onClick={() => handleSort('id')}
                    >
                      ID
                    </th>
                    <th 
                      className="text-gray-700 p-3 text-center cursor-pointer border-r border-gray-200 font-medium hover:bg-gray-100 transition-colors"
                      onClick={() => handleSort('name')}
                    >
                      نام
                    </th>
                    <th 
                      className="text-gray-700 p-3 text-center cursor-pointer border-r border-gray-200 font-medium hover:bg-gray-100 transition-colors"
                      onClick={() => handleSort('family_name')}
                    >
                      نام خانوادگی
                    </th>
                    <th 
                      className="text-gray-700 p-3 text-center cursor-pointer border-r border-gray-200 font-medium hover:bg-gray-100 transition-colors"
                      onClick={() => handleSort('father_name')}
                    >
                      نام پدر
                    </th>
                    <th 
                      className="text-gray-700 p-3 text-center cursor-pointer border-r border-gray-200 font-medium hover:bg-gray-100 transition-colors"
                      onClick={() => handleSort('invite_code')}
                    >
                      کد دعوت
                    </th>
                    <th className="text-gray-700 p-3 text-center font-medium">
                      عملیات
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {currentData.map((member) => (
                    <tr 
                      key={member.id} 
                      className={`hover:bg-gray-50 cursor-pointer ${
                        selectedMember?.id === member.id ? 'bg-blue-50' : ''
                      }`}
                      onClick={() => setSelectedMember(member)}
                    >
                      <td className="p-3 border-r border-gray-200 text-center text-xs text-gray-600">
                        {member.id}
                      </td>
                      <td className="p-3 border-r border-gray-200 text-center font-medium text-gray-900">
                        {member.name}
                      </td>
                      <td className="p-3 border-r border-gray-200 text-center text-gray-600">
                        {member.family_name || '-'}
                      </td>
                      <td className="p-3 border-r border-gray-200 text-center text-gray-600">
                        {member.father_name || '-'}
                      </td>
                      <td className="p-3 border-r border-gray-200 text-center text-gray-600">
                        <span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded">
                          {member.invite_code || '-'}
                        </span>
                      </td>
                      <td className="p-3 text-center">
                        <div className="flex gap-1 justify-center">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEditMember(member);
                            }}
                            className="px-2 py-1 bg-blue-500 text-white rounded text-xs hover:bg-blue-600"
                            title="ویرایش"
                          >
                            ✏️
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteMember(member);
                            }}
                            className="px-2 py-1 bg-red-500 text-white rounded text-xs hover:bg-red-600"
                            title="حذف"
                          >
                            🗑️
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filteredAndSortedData.length === 0 && (
              <div className="text-center text-gray-500 py-8">
                {searchTerm ? 'نتیجه‌ای یافت نشد' : 'داده‌ای موجود نیست'}
              </div>
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="bg-white p-3 rounded-lg border border-gray-200 mb-4">
              <div className="flex justify-center items-center gap-1">
                <button
                  onClick={() => goToPage(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-2 py-1 bg-gray-200 text-gray-700 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-300 transition-colors"
                >
                  قبلی
                </button>
                
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const page = i + 1;
                  return (
                    <button
                      key={page}
                      onClick={() => goToPage(page)}
                      className={`px-2 py-1 rounded text-sm transition-colors ${
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
                  className="px-2 py-1 bg-gray-200 text-gray-700 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-300 transition-colors"
                >
                  بعدی
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;