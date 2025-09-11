'use client';

import React, { useState } from 'react';
import CompleteProfile from '@/components/CompleteProfile';

interface TabProps {
  children: React.ReactNode;
  isActive: boolean;
  onClick: () => void;
  icon: string;
  label: string;
}

const Tab: React.FC<TabProps> = ({ children, isActive, onClick, icon, label }) => {
  return (
    <button
      onClick={onClick}
      className={`flex items-center px-4 py-3 rounded-lg font-medium transition-all duration-300 ${
        isActive
          ? 'bg-blue-500 text-white shadow-md'
          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
      }`}
    >
      <span className="text-lg mr-2">{icon}</span>
      {label}
    </button>
  );
};

const DashboardTabs: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'profile' | 'family'>('profile');

  return (
    <div className="space-y-6">
      {/* Tab Navigation */}
      <div className="flex space-x-3">
        <Tab
          isActive={activeTab === 'profile'}
          onClick={() => setActiveTab('profile')}
          icon="📝"
          label="تکمیل حساب کاربری"
        />
        <Tab
          isActive={activeTab === 'family'}
          onClick={() => setActiveTab('family')}
          icon="🌳"
          label="شجره‌نامه خانوادگی"
        />
      </div>

      {/* Tab Content */}
      <div className="min-h-[400px]">
        {activeTab === 'profile' && (
          <div className="animate-fadeIn">
            <CompleteProfile />
          </div>
        )}
        
        {activeTab === 'family' && (
          <div className="animate-fadeIn">
            <FamilyTreeView />
          </div>
        )}
      </div>
    </div>
  );
};

// Family Tree View Component
const FamilyTreeView: React.FC = () => {
  const [viewMode, setViewMode] = useState<'tree' | 'table'>('tree');

  return (
    <div className="space-y-6">
      {/* View Mode Toggle */}
      <div className="flex justify-center">
        <div className="bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => setViewMode('tree')}
            className={`px-4 py-2 rounded-md font-medium transition-all ${
              viewMode === 'tree'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            🌳 نمودار درختی
          </button>
          <button
            onClick={() => setViewMode('table')}
            className={`px-4 py-2 rounded-md font-medium transition-all ${
              viewMode === 'table'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            📊 جدول روابط
          </button>
        </div>
      </div>

      {/* Content */}
      {viewMode === 'tree' ? <TreeDiagram /> : <FamilyTable />}
    </div>
  );
};

// Tree Diagram Component
const TreeDiagram: React.FC = () => {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6">
      <div className="text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-green-600 text-2xl">🌳</span>
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">نمودار درختی شجره‌نامه</h3>
        <p className="text-gray-600 mb-6">در اینجا نمودار درختی خانواده شما نمایش داده می‌شود</p>
        
        {/* Placeholder for actual tree diagram */}
        <div className="bg-gray-50 rounded-xl p-8 min-h-[300px] flex items-center justify-center">
          <div className="text-center">
            <div className="text-6xl mb-4">🌲</div>
            <p className="text-gray-500">نمودار درختی در حال توسعه...</p>
            <p className="text-sm text-gray-400 mt-2">به زودی نمودار تعاملی خانواده شما اینجا نمایش داده خواهد شد</p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Family Table Component
const FamilyTable: React.FC = () => {
  // Mock data - replace with actual API call
  const familyMembers = [
    { id: 1, name: 'علی', family_name: 'احمدی', father_name: null, children_count: 2, generation: 1 },
    { id: 2, name: 'محمد', family_name: 'احمدی', father_name: 'علی', children_count: 1, generation: 2 },
    { id: 3, name: 'فاطمه', family_name: 'احمدی', father_name: 'علی', children_count: 0, generation: 2 },
    { id: 4, name: 'حسن', family_name: 'احمدی', father_name: 'محمد', children_count: 0, generation: 3 },
  ];

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mr-3">
            <span className="text-blue-600 text-xl">📊</span>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">جدول روابط خانوادگی</h3>
            <p className="text-sm text-gray-500">لیست کامل اعضای خانواده</p>
          </div>
        </div>
        <div className="text-sm text-gray-600">
          مجموع: {familyMembers.length} نفر
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-right py-3 px-4 font-medium text-gray-700">نام</th>
              <th className="text-right py-3 px-4 font-medium text-gray-700">نام خانوادگی</th>
              <th className="text-right py-3 px-4 font-medium text-gray-700">نام پدر</th>
              <th className="text-right py-3 px-4 font-medium text-gray-700">نسل</th>
              <th className="text-right py-3 px-4 font-medium text-gray-700">تعداد فرزندان</th>
              <th className="text-right py-3 px-4 font-medium text-gray-700">عملیات</th>
            </tr>
          </thead>
          <tbody>
            {familyMembers.map((member) => (
              <tr key={member.id} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="py-3 px-4 font-medium text-gray-900">{member.name}</td>
                <td className="py-3 px-4 text-gray-700">{member.family_name}</td>
                <td className="py-3 px-4 text-gray-700">{member.father_name || 'ندارد'}</td>
                <td className="py-3 px-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    member.generation === 1 ? 'bg-purple-100 text-purple-700' :
                    member.generation === 2 ? 'bg-blue-100 text-blue-700' :
                    'bg-green-100 text-green-700'
                  }`}>
                    نسل {member.generation}
                  </span>
                </td>
                <td className="py-3 px-4 text-gray-700">{member.children_count}</td>
                <td className="py-3 px-4">
                  <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                    مشاهده جزئیات
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6 pt-6 border-t border-gray-200">
        <div className="bg-purple-50 rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-purple-600">
            {familyMembers.filter(m => m.generation === 1).length}
          </div>
          <div className="text-sm text-purple-700">نسل اول</div>
        </div>
        <div className="bg-blue-50 rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-blue-600">
            {familyMembers.filter(m => m.generation === 2).length}
          </div>
          <div className="text-sm text-blue-700">نسل دوم</div>
        </div>
        <div className="bg-green-50 rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-green-600">
            {familyMembers.filter(m => m.generation === 3).length}
          </div>
          <div className="text-sm text-green-700">نسل سوم</div>
        </div>
      </div>
    </div>
  );
};

export default DashboardTabs;
