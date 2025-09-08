'use client';

import React, { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';

const Navigation: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const menuItems = [
    {
      name: 'صفحه اصلی',
      href: '/index',
      icon: '🏠',
      description: 'خانه'
    },
    {
      name: 'مشاهده اعضا',
      href: '/family',
      icon: '👥',
      description: 'جدول و درخت'
    },
    {
      name: 'داشبورد',
      href: '/dashboard',
      icon: '📊',
      description: 'پنل کاربری'
    },
    {
      name: 'درخواست کد دعوت',
      href: '/request-invite',
      icon: '📝',
      description: 'درخواست عضویت'
    },
    {
      name: 'ثبت‌نام',
      href: '/register',
      icon: '🎫',
      description: 'کد دعوت'
    },
    {
      name: 'داشبورد ادمین',
      href: '/admin',
      icon: '🔐',
      description: 'مدیریت سیستم'
    }
  ];

  const isActive = (href: string) => {
    if (href === '/index' && pathname === '/') return true;
    return pathname === href;
  };

  return (
    <nav className="bg-white/90 backdrop-blur-md border-b border-gray-200/50 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <button
              onClick={() => router.push('/index')}
              className="flex items-center space-x-3 rtl:space-x-reverse group"
            >
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <span className="text-white text-xl">🏠</span>
              </div>
              <div className="hidden sm:block">
                <h1 className="text-xl font-bold text-gray-900">سیستم مدیریت خانواده</h1>
                <p className="text-xs text-gray-500">شجره‌نامه هوشمند</p>
              </div>
            </button>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-1 rtl:space-x-reverse">
            {menuItems.map((item) => (
              <button
                key={item.href}
                onClick={() => router.push(item.href)}
                className={`group flex items-center px-4 py-2 rounded-xl transition-all duration-300 ${
                  isActive(item.href)
                    ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <span className="text-lg mr-2 group-hover:scale-110 transition-transform duration-300">
                  {item.icon}
                </span>
                <div className="text-right">
                  <div className="font-medium text-sm">{item.name}</div>
                  <div className="text-xs opacity-75">{item.description}</div>
                </div>
              </button>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {isMobileMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200/50 bg-white/95 backdrop-blur-md">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {menuItems.map((item) => (
                <button
                  key={item.href}
                  onClick={() => {
                    router.push(item.href);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`group w-full flex items-center px-4 py-3 rounded-xl transition-all duration-300 ${
                    isActive(item.href)
                      ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  <span className="text-xl mr-3 group-hover:scale-110 transition-transform duration-300">
                    {item.icon}
                  </span>
                  <div className="text-right flex-1">
                    <div className="font-medium">{item.name}</div>
                    <div className="text-sm opacity-75">{item.description}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
