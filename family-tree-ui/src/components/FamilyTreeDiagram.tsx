'use client';

import React, { useState, useEffect } from 'react';
import api from '@/lib/api';

interface FamilyMember {
  id: number;
  name: string;
  family_name: string;
  father_name: string | null;
  father_id: number | null;
  children?: FamilyMember[];
}

const FamilyTreeDiagram: React.FC = () => {
  const [familyData, setFamilyData] = useState<FamilyMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
        <div className="text-6xl mb-4">🌳</div>
        <p className="text-gray-600 mb-4">هنوز هیچ عضو خانواده‌ای ثبت نشده است</p>
        <p className="text-sm text-gray-500">از کد دعوت خود برای اضافه کردن اعضای خانواده استفاده کنید</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Tree Visualization */}
      <div className="bg-gradient-to-br from-green-50 to-emerald-100 rounded-2xl p-8 min-h-[400px] flex items-center justify-center">
        <div className="text-center">
          <div className="text-8xl mb-6">🌲</div>
          <p className="text-gray-600 text-lg font-medium mb-2">نمودار درختی خانواده</p>
          <p className="text-sm text-gray-500 mb-4">
            {familyData.length} عضو خانواده شناسایی شده
          </p>
          <div className="flex justify-center space-x-4 space-x-reverse">
            <div className="bg-white rounded-lg p-3 shadow-sm">
              <div className="text-2xl font-bold text-blue-600">
                {familyData.filter(m => !m.father_id).length}
              </div>
              <div className="text-xs text-gray-600">نسل اول</div>
            </div>
            <div className="bg-white rounded-lg p-3 shadow-sm">
              <div className="text-2xl font-bold text-green-600">
                {familyData.filter(m => m.father_id).length}
              </div>
              <div className="text-xs text-gray-600">نسل‌های بعدی</div>
            </div>
          </div>
        </div>
      </div>

      {/* Family Structure Info */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-blue-50 rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-blue-600 mb-1">
            {familyData.length}
          </div>
          <div className="text-sm text-blue-700">کل اعضا</div>
        </div>
        <div className="bg-green-50 rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-green-600 mb-1">
            {familyData.filter(m => !m.father_id).length}
          </div>
          <div className="text-sm text-green-700">ریشه خانواده</div>
        </div>
        <div className="bg-purple-50 rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-purple-600 mb-1">
            {Math.max(...familyData.map(m => {
              let generation = 1;
              let current = m;
              while (current.father_id) {
                const father = familyData.find(f => f.id === current.father_id);
                if (father) {
                  current = father;
                  generation++;
                } else break;
              }
              return generation;
            }), 1)}
          </div>
          <div className="text-sm text-purple-700">عمق نسل</div>
        </div>
      </div>
    </div>
  );
};

export default FamilyTreeDiagram;
