'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import FamilyTable from '@/components/FamilyTable';
import FamilyTree from '@/components/FamilyTree';
import axios from 'axios';

export default function FamilyView() {
  // const router = useRouter();
  const [totalMembers, setTotalMembers] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'table' | 'tree'>('table');

  useEffect(() => {
    fetchTotalMembers();
  }, []);

  const fetchTotalMembers = async () => {
    try {
      const response = await axios.get('http://localhost:5000/family-members');
      setTotalMembers(response.data.length);
    } catch (error) {
      console.error('Error fetching total members:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto p-5">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            📊 مدیریت اعضای خانواده
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-6">
            نمایش کامل اعضای خانواده با روابط خانوادگی در قالب جدول و نمودار درختی
          </p>
        </div>

        {/* View Mode Toggle */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-5">
          <div className="flex justify-center gap-4">
            <button
              onClick={() => setViewMode('table')}
              className={`px-6 py-3 rounded-lg font-bold transition-all ${
                viewMode === 'table'
                  ? 'bg-blue-500 text-white shadow-lg'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              📊 نمایش جدولی
            </button>
            <button
              onClick={() => setViewMode('tree')}
              className={`px-6 py-3 rounded-lg font-bold transition-all ${
                viewMode === 'tree'
                  ? 'bg-green-500 text-white shadow-lg'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              🌳 نمایش درختی
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {viewMode === 'table' ? <FamilyTable /> : <FamilyTree />}
        </div>

        {/* Footer */}
        <footer className="mt-8 p-6 bg-gradient-to-r from-slate-800 to-slate-900 text-white rounded-xl text-center shadow-lg">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
            <div className="flex items-center justify-center gap-2">
              <span className="text-2xl">🏠</span>
              <span className="font-bold">سیستم مدیریت اعضای خانواده</span>
            </div>
            
            <div className="flex items-center justify-center gap-2">
              <span className="text-2xl">📊</span>
              <span>
                تعداد کل اعضا: 
                <span className="font-bold text-blue-300 ml-1">
                  {loading ? 'در حال بارگذاری...' : totalMembers.toLocaleString()}
                </span>
              </span>
            </div>
            
            <div className="flex items-center justify-center gap-2">
              <span className="text-2xl">🔗</span>
              <span className="font-mono text-sm bg-gray-700 px-2 py-1 rounded">
                API: localhost:5000
              </span>
            </div>
          </div>
          
          <div className="mt-4 pt-4 border-t border-gray-600">
            <p className="text-sm text-gray-400">
              💡 برای بهترین تجربه کاربری، از مرورگرهای مدرن استفاده کنید
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}
