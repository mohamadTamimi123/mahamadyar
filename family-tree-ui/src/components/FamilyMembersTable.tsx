'use client';

import React, { useState, useEffect } from 'react';
import api from '@/lib/api';

interface FamilyMember {
  id: number;
  name: string;
  family_name: string;
  father_name: string | null;
  father_id: number | null;
  invite_code: string | null;
  created_at: string;
}

const FamilyMembersTable: React.FC = () => {
  const [familyData, setFamilyData] = useState<FamilyMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<keyof FamilyMember>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  useEffect(() => {
    fetchFamilyData();
  }, []);

  const fetchFamilyData = async () => {
    try {
      setLoading(true);
      const response = await api.get('/family-members');
      setFamilyData(response.data);
    } catch (err) {
      setError('خطا در بارگذاری داده‌های خانواده');
      console.error('Error fetching family data:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredData = familyData.filter(member =>
    member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.family_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (member.father_name && member.father_name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const sortedData = [...filteredData].sort((a, b) => {
    const aValue = a[sortField];
    const bValue = b[sortField];
    
    if (aValue === null || aValue === undefined) return 1;
    if (bValue === null || bValue === undefined) return -1;
    
    const comparison = aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
    return sortDirection === 'asc' ? comparison : -comparison;
  });

  const handleSort = (field: keyof FamilyMember) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const getGeneration = (member: FamilyMember): number => {
    let generation = 1;
    let current = member;
    while (current.father_id) {
      const father = familyData.find(f => f.id === current.father_id);
      if (father) {
        current = father;
        generation++;
      } else break;
    }
    return generation;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        <span className="mr-3 text-gray-600">در حال بارگذاری...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-500 text-4xl mb-4">❌</div>
        <p className="text-red-600 mb-4">{error}</p>
        <button 
          onClick={fetchFamilyData}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
        >
          تلاش مجدد
        </button>
      </div>
    );
  }

  if (familyData.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">👥</div>
        <p className="text-gray-600 mb-4">هنوز هیچ عضو خانواده‌ای ثبت نشده است</p>
        <p className="text-sm text-gray-500">از کد دعوت خود برای اضافه کردن اعضای خانواده استفاده کنید</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Search and Stats */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex-1 max-w-md">
          <input
            type="text"
            placeholder="جستجو در اعضای خانواده..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div className="bg-gray-100 rounded-lg px-4 py-2">
          <span className="text-sm font-medium text-gray-700">
            {filteredData.length} عضو از {familyData.length} کل
          </span>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b-2 border-gray-100">
              <th 
                className="text-right py-4 px-6 font-semibold text-gray-700 cursor-pointer hover:bg-gray-50"
                onClick={() => handleSort('name')}
              >
                نام {sortField === 'name' && (sortDirection === 'asc' ? '↑' : '↓')}
              </th>
              <th 
                className="text-right py-4 px-6 font-semibold text-gray-700 cursor-pointer hover:bg-gray-50"
                onClick={() => handleSort('family_name')}
              >
                نام خانوادگی {sortField === 'family_name' && (sortDirection === 'asc' ? '↑' : '↓')}
              </th>
              <th className="text-right py-4 px-6 font-semibold text-gray-700">نام پدر</th>
              <th className="text-right py-4 px-6 font-semibold text-gray-700">نسل</th>
              <th className="text-right py-4 px-6 font-semibold text-gray-700">کد دعوت</th>
              <th className="text-right py-4 px-6 font-semibold text-gray-700">تاریخ عضویت</th>
            </tr>
          </thead>
          <tbody>
            {sortedData.map((member) => (
              <tr key={member.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                <td className="py-4 px-6 font-semibold text-gray-900">{member.name}</td>
                <td className="py-4 px-6 text-gray-700">{member.family_name}</td>
                <td className="py-4 px-6 text-gray-700">{member.father_name || 'ندارد'}</td>
                <td className="py-4 px-6">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    getGeneration(member) === 1 ? 'bg-purple-100 text-purple-700' :
                    getGeneration(member) === 2 ? 'bg-blue-100 text-blue-700' :
                    getGeneration(member) === 3 ? 'bg-green-100 text-green-700' :
                    'bg-gray-100 text-gray-700'
                  }`}>
                    نسل {getGeneration(member)}
                  </span>
                </td>
                <td className="py-4 px-6">
                  {member.invite_code ? (
                    <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">
                      {member.invite_code}
                    </span>
                  ) : (
                    <span className="text-gray-400">ندارد</span>
                  )}
                </td>
                <td className="py-4 px-6 text-gray-700 text-sm">
                  {new Date(member.created_at).toLocaleDateString('fa-IR')}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-6 border-t border-gray-100">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-blue-600 mb-1">
            {familyData.filter(m => getGeneration(m) === 1).length}
          </div>
          <div className="text-sm font-semibold text-blue-700">نسل اول</div>
        </div>
        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-green-600 mb-1">
            {familyData.filter(m => getGeneration(m) === 2).length}
          </div>
          <div className="text-sm font-semibold text-green-700">نسل دوم</div>
        </div>
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-purple-600 mb-1">
            {familyData.filter(m => getGeneration(m) >= 3).length}
          </div>
          <div className="text-sm font-semibold text-purple-700">نسل سوم+</div>
        </div>
        <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-gray-600 mb-1">
            {familyData.filter(m => m.invite_code).length}
          </div>
          <div className="text-sm font-semibold text-gray-700">دارای کد دعوت</div>
        </div>
      </div>
    </div>
  );
};

export default FamilyMembersTable;
