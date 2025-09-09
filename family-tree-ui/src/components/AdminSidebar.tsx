'use client';

import React from 'react';
import { useRouter, usePathname } from 'next/navigation';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const AdminSidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const router = useRouter();
  const pathname = usePathname();

  const menuItems = [
    {
      name: 'داشبورد',
      href: '/admin',
      icon: '🎯',
      description: 'نمای کلی سیستم'
    },
    {
      name: 'اضافه کردن عضو',
      href: '/admin/add-member',
      icon: '➕',
      description: 'افزودن عضو جدید'
    },
    {
      name: 'درخواست‌ها',
      href: '/admin/requests',
      icon: '📋',
      description: 'درخواست‌های کد دعوت'
    },
    {
      name: 'کاربران',
      href: '/admin/users',
      icon: '👥',
      description: 'مدیریت کاربران'
    },
    {
      name: 'گزارش‌ها',
      href: '/admin/reports',
      icon: '📈',
      description: 'آمار و گزارش‌ها'
    },
    {
      name: 'تنظیمات',
      href: '/admin/settings',
      icon: '⚙️',
      description: 'تنظیمات سیستم'
    }
  ];

  const isActive = (href: string) => {
    if (href === '/admin' && pathname === '/admin') return true;
    return pathname.startsWith(href);
  };

  const handleNavigation = (href: string) => {
    router.push(href);
    onClose();
  };

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed top-16 right-0 h-[calc(100vh-4rem)] w-72 bg-white border-l border-gray-200
        shadow-lg z-40 transform transition-all duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : 'translate-x-full'}
        lg:translate-x-0 lg:static lg:z-auto lg:h-screen lg:top-0
        overflow-hidden flex flex-col
      `}>
        {/* Header */}
        <div className="p-4 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3 rtl:space-x-reverse">
              <div className="w-8 h-8 bg-gray-800 rounded-lg flex items-center justify-center">
                <span className="text-white text-sm">👑</span>
              </div>
              <div>
                <h2 className="text-sm font-semibold text-gray-900">داشبورد ادمین</h2>
                <p className="text-xs text-gray-500">مدیریت سیستم</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="lg:hidden p-1 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="p-3 space-y-1">
          {menuItems.map((item) => (
            <button
              key={item.href}
              onClick={() => handleNavigation(item.href)}
              className={`
                w-full flex items-center p-3 rounded-lg transition-colors group
                ${isActive(item.href)
                  ? 'bg-gray-900 text-white'
                  : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
                }
              `}
            >
              <span className="text-lg mr-3">
                {item.icon}
              </span>
              <div className="text-right flex-1">
                <div className="font-medium text-sm">
                  {item.name}
                </div>
                <div className="text-xs text-gray-500">
                  {item.description}
                </div>
              </div>
            </button>
          ))}
        </nav>

        {/* Quick Stats */}
        <div className="p-3 border-t border-gray-200 bg-gray-50">
          <h3 className="text-xs font-semibold text-gray-700 mb-3">
            آمار سریع
          </h3>
          <div className="space-y-2">
            <div className="bg-white rounded-lg p-2 border border-gray-200">
              <div className="flex items-center justify-between">
                <span className="text-gray-600 text-xs">کل اعضا</span>
                <span className="text-gray-900 font-semibold text-sm">1,796</span>
              </div>
            </div>
            <div className="bg-white rounded-lg p-2 border border-gray-200">
              <div className="flex items-center justify-between">
                <span className="text-gray-600 text-xs">درخواست‌های جدید</span>
                <span className="text-orange-600 font-semibold text-sm">3</span>
              </div>
            </div>
            <div className="bg-white rounded-lg p-2 border border-gray-200">
              <div className="flex items-center justify-between">
                <span className="text-gray-600 text-xs">کدهای فعال</span>
                <span className="text-green-600 font-semibold text-sm">1,795</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex-shrink-0 p-3 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between">
            <button
              onClick={() => router.push('/index')}
              className="flex items-center text-gray-600 hover:text-gray-800 px-2 py-1 rounded text-xs transition-colors"
            >
              <span className="text-sm mr-1">🏠</span>
              <span className="text-xs">بازگشت به سایت</span>
            </button>
            <div className="text-xs text-gray-400 bg-gray-200 px-2 py-1 rounded">
              v1.0.0
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminSidebar;
