'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';

const DashboardSidebar: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(true);
  const [forceUpdate, setForceUpdate] = useState(0);

  // Listen for hash changes to update active state
  useEffect(() => {
    const handleHashChange = () => {
      setForceUpdate(prev => prev + 1);
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const items = [
    { label: 'داشبورد', href: '/dashboard', icon: '🏠' },
    { label: 'پروفایل', href: '/dashboard#profile', icon: '👤' },
    { label: 'شجره‌نامه', href: '/dashboard#family', icon: '🌳' },
  ];

  const isActive = (href: string) => {
    if (href === '/dashboard') {
      return pathname === '/dashboard' && !window.location.hash;
    }
    if (href.startsWith('/dashboard#')) {
      return pathname === '/dashboard' && window.location.hash === href.split('#')[1];
    }
    return pathname === href || (href !== '/dashboard' && pathname.startsWith(href));
  };

  return (
    <aside
      className={`hidden lg:flex flex-col transition-all duration-300 ${open ? 'w-64' : 'w-20'}
        fixed right-0 top-16 h-[calc(100vh-4rem)] bg-white/70 backdrop-blur border-l border-gray-200/60 overflow-hidden z-40`}
    >
      <div className="p-4 border-b border-gray-200/60">
        <button
          onClick={() => setOpen(!open)}
          className="w-full text-right text-gray-600 hover:text-gray-900"
          title={open ? 'جمع کردن' : 'باز کردن'}
        >
          {open ? 'پنل کاربر' : '📋'}
        </button>
      </div>

      <nav className="p-3 space-y-1">
        {items.map((it) => (
          <button
            key={it.href}
            onClick={() => {
              if (it.href.startsWith('/dashboard#')) {
                window.location.hash = it.href.split('#')[1];
              } else {
                router.push(it.href);
              }
            }}
            className={`w-full flex items-center gap-3 p-3 rounded-xl text-sm transition-colors
              ${isActive(it.href) ? 'bg-gray-900 text-white' : 'text-gray-700 hover:bg-gray-100'}`}
          >
            <span className="text-lg">{it.icon}</span>
            {open && <span className="flex-1 text-right">{it.label}</span>}
          </button>
        ))}
      </nav>

      <div className="mt-auto p-3 border-t border-gray-200/60">
        <button
          onClick={() => {
            localStorage.removeItem('token');
            router.push('/index');
          }}
          className="w-full p-3 rounded-xl text-sm bg-red-50 text-red-700 hover:bg-red-100"
        >
          خروج
        </button>
      </div>
    </aside>
  );
};

export default DashboardSidebar;


