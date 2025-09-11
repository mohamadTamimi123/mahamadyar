'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
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
      className={`flex items-center px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
        isActive
          ? 'bg-white text-gray-900 shadow-lg shadow-gray-200/50'
          : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'
      }`}
    >
      <span className="text-xl mr-3">{icon}</span>
      <span className="text-sm font-semibold">{label}</span>
    </button>
  );
};

const DashboardTabs: React.FC = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'profile' | 'family'>('profile');

  // Listen for hash changes
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash === '#profile') {
        setActiveTab('profile');
      } else if (hash === '#family') {
        setActiveTab('family');
      }
    };

    // Set initial tab based on hash
    handleHashChange();

    // Listen for hash changes
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const handleTabChange = (tab: 'profile' | 'family') => {
    setActiveTab(tab);
    router.push(`/dashboard#${tab}`);
  };

  return (
    <div className="space-y-8">
      {/* Tab Navigation */}
      <div className="flex justify-center">
        <div className="bg-gray-100 rounded-2xl p-2 inline-flex">
          <Tab
            isActive={activeTab === 'profile'}
            onClick={() => handleTabChange('profile')}
            icon="👤"
            label="پروفایل"
          />
          <Tab
            isActive={activeTab === 'family'}
            onClick={() => handleTabChange('family')}
            icon="🌳"
            label="شجره‌نامه"
          />
        </div>
      </div>

      {/* Tab Content */}
      <div className="min-h-[500px]">
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
  const router = useRouter();
  const [viewMode, setViewMode] = useState<'tree' | 'table'>('tree');

  // Listen for hash changes
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash === '#table') {
        setViewMode('table');
      } else if (hash === '#family' || hash === '#tree') {
        setViewMode('tree');
      }
    };

    // Set initial mode based on hash
    handleHashChange();

    // Listen for hash changes
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const handleViewModeChange = (mode: 'tree' | 'table') => {
    setViewMode(mode);
    if (mode === 'table') {
      router.push('/dashboard#table');
    } else {
      router.push('/dashboard#family');
    }
  };

  return (
    <div className="space-y-8">
      {/* View Mode Toggle */}
      <div className="flex justify-center">
        <div className="bg-gray-100 rounded-2xl p-2 inline-flex">
          <button
            onClick={() => handleViewModeChange('tree')}
            className={`px-6 py-3 rounded-xl font-medium transition-all ${
              viewMode === 'tree'
                ? 'bg-white text-gray-900 shadow-lg shadow-gray-200/50'
                : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'
            }`}
          >
            <span className="text-xl mr-3">🌳</span>
            <span className="text-sm font-semibold">نمودار درختی</span>
          </button>
          <button
            onClick={() => handleViewModeChange('table')}
            className={`px-6 py-3 rounded-xl font-medium transition-all ${
              viewMode === 'table'
                ? 'bg-white text-gray-900 shadow-lg shadow-gray-200/50'
                : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'
            }`}
          >
            <span className="text-xl mr-3">📊</span>
            <span className="text-sm font-semibold">جدول روابط</span>
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
    <div className="bg-white rounded-3xl border border-gray-200/50 p-8 shadow-sm">
      <div className="text-center">
        <div className="w-20 h-20 bg-gradient-to-br from-green-100 to-emerald-200 rounded-3xl flex items-center justify-center mx-auto mb-6">
          <span className="text-green-600 text-4xl">🌳</span>
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-3">نمودار درختی شجره‌نامه</h3>
        <p className="text-gray-600 mb-8 max-w-md mx-auto">در اینجا نمودار درختی خانواده شما نمایش داده می‌شود</p>
        
        {/* Placeholder for actual tree diagram */}
        <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-12 min-h-[300px] flex items-center justify-center">
          <div className="text-center">
            <div className="text-8xl mb-6">🌲</div>
            <p className="text-gray-500 text-lg font-medium">نمودار درختی در حال توسعه...</p>
            <p className="text-sm text-gray-400 mt-3">به زودی نمودار تعاملی خانواده شما اینجا نمایش داده خواهد شد</p>
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
    <div className="bg-white rounded-3xl border border-gray-200/50 p-8 shadow-sm">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-indigo-200 rounded-2xl flex items-center justify-center mr-4">
            <span className="text-blue-600 text-2xl">📊</span>
          </div>
          <div>
            <h3 className="text-2xl font-bold text-gray-900">جدول روابط خانوادگی</h3>
            <p className="text-gray-600">لیست کامل اعضای خانواده</p>
          </div>
        </div>
        <div className="bg-gray-100 rounded-xl px-4 py-2">
          <span className="text-sm font-semibold text-gray-700">مجموع: {familyMembers.length} نفر</span>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b-2 border-gray-100">
              <th className="text-right py-4 px-6 font-semibold text-gray-700">نام</th>
              <th className="text-right py-4 px-6 font-semibold text-gray-700">نام خانوادگی</th>
              <th className="text-right py-4 px-6 font-semibold text-gray-700">نام پدر</th>
              <th className="text-right py-4 px-6 font-semibold text-gray-700">نسل</th>
              <th className="text-right py-4 px-6 font-semibold text-gray-700">فرزندان</th>
            </tr>
          </thead>
          <tbody>
            {familyMembers.map((member) => (
              <tr key={member.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                <td className="py-4 px-6 font-semibold text-gray-900">{member.name}</td>
                <td className="py-4 px-6 text-gray-700">{member.family_name}</td>
                <td className="py-4 px-6 text-gray-700">{member.father_name || 'ندارد'}</td>
                <td className="py-4 px-6">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    member.generation === 1 ? 'bg-purple-100 text-purple-700' :
                    member.generation === 2 ? 'bg-blue-100 text-blue-700' :
                    'bg-green-100 text-green-700'
                  }`}>
                    نسل {member.generation}
                  </span>
                </td>
                <td className="py-4 px-6 text-gray-700">{member.children_count}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-4 mt-8 pt-8 border-t border-gray-100">
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-6 text-center">
          <div className="text-3xl font-bold text-purple-600 mb-2">
            {familyMembers.filter(m => m.generation === 1).length}
          </div>
          <div className="text-sm font-semibold text-purple-700">نسل اول</div>
        </div>
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6 text-center">
          <div className="text-3xl font-bold text-blue-600 mb-2">
            {familyMembers.filter(m => m.generation === 2).length}
          </div>
          <div className="text-sm font-semibold text-blue-700">نسل دوم</div>
        </div>
        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-6 text-center">
          <div className="text-3xl font-bold text-green-600 mb-2">
            {familyMembers.filter(m => m.generation === 3).length}
          </div>
          <div className="text-sm font-semibold text-green-700">نسل سوم</div>
        </div>
      </div>
    </div>
  );
};

export default DashboardTabs;
