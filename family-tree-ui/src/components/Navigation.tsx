'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenu,
  NavbarMenuItem,
  NavbarMenuToggle,
  Link as HeroLink,
  Button,
  Avatar,
} from '@heroui/react';

const Navigation: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const check = () => setIsLoggedIn(!!localStorage.getItem('token'));
    check();
    const onStorage = (e: StorageEvent) => {
      if (e.key === 'token') check();
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const items = [
    { label: 'صفحه اصلی', href: '/index' },
    { label: 'مشاهده اعضا', href: '/family' },
    { label: 'داشبورد', href: '/dashboard' },
    { label: 'درخواست کد دعوت', href: '/request-invite' },
    { label: 'ثبت‌نام', href: '/register' },
    { label: 'داشبورد ادمین', href: '/admin' },
  ];

  const isActive = (href: string) => (href === '/index' && pathname === '/') || pathname === href;

  return (
    <Navbar
      maxWidth="xl"
      className="sticky h-16 top-0 z-50 backdrop-blur bg-white/70 supports-[backdrop-filter]:bg-white/50 border-b border-gray-200/60"
      isBordered
    >
      <NavbarBrand className="cursor-pointer" onClick={() => router.push('/index')}>
        <div className="w-8 h-8 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center ml-2 shadow-sm">
          <span className="text-white">🏠</span>
        </div>
        <div className="hidden sm:block text-right">
          <p className="font-bold text-gray-900">سیستم مدیریت خانواده</p>
          <p className="text-xs text-gray-500">شجره‌نامه هوشمند</p>
        </div>
      </NavbarBrand>

      <NavbarContent className="hidden md:flex" justify="center">
        {items.map((it) => (
          <NavbarItem key={it.href} isActive={isActive(it.href)}>
            <HeroLink
              href={it.href}
              onClick={(e) => {
                e.preventDefault();
                router.push(it.href);
              }}
              className={`transition-colors ${
                isActive(it.href)
                  ? 'text-blue-600 font-semibold'
                  : 'text-gray-700 hover:text-gray-900'
              }`}
            >
              {it.label}
            </HeroLink>
          </NavbarItem>
        ))}
      </NavbarContent>

      <NavbarContent justify="end">
        {isLoggedIn ? (
          <>
            <NavbarItem className="hidden sm:flex">
              <Button
                variant="flat"
                onClick={() => router.push('/dashboard')}
              >
                <span className="ml-1">حساب من</span>
              </Button>
            </NavbarItem>
            <NavbarItem>
              <Button
                color="danger"
                variant="flat"
                onClick={() => {
                  localStorage.removeItem('token');
                  setIsLoggedIn(false);
                  if (pathname.startsWith('/dashboard')) router.push('/index');
                }}
              >
                خروج
              </Button>
            </NavbarItem>
            <NavbarItem className="hidden sm:flex">
              <Avatar name="U" color="primary" size="sm" className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white" />
            </NavbarItem>
          </>
        ) : (
          <>
            <NavbarItem className="hidden sm:flex">
              <Button
                color="primary"
                variant="flat"
                onClick={() => router.push('/login')}
              >
                ورود
              </Button>
            </NavbarItem>
            <NavbarItem>
              <Button
                className="bg-gray-900 text-white"
                onClick={() => router.push('/register')}
              >
                ثبت‌نام
              </Button>
            </NavbarItem>
          </>
        )}
      </NavbarContent>

      {/* Mobile Menu */}
      <NavbarContent className="md:hidden" justify="end">
        <NavbarMenuToggle aria-label="toggle menu" />
      </NavbarContent>
      <NavbarMenu>
        {items.map((it) => (
          <NavbarMenuItem key={it.href} isActive={isActive(it.href)}>
            <HeroLink
              href={it.href}
              onClick={(e) => {
                e.preventDefault();
                router.push(it.href);
              }}
              className={isActive(it.href) ? 'text-blue-600 font-semibold' : 'text-gray-700'}
            >
              {it.label}
            </HeroLink>
          </NavbarMenuItem>
        ))}
        <div className="mt-2 flex gap-2">
          {isLoggedIn ? (
            <>
              <Button fullWidth variant="flat" onClick={() => router.push('/dashboard')}>حساب من</Button>
              <Button fullWidth color="danger" variant="flat" onClick={() => { localStorage.removeItem('token'); setIsLoggedIn(false); router.push('/index'); }}>خروج</Button>
            </>
          ) : (
            <>
              <Button fullWidth variant="flat" onClick={() => router.push('/login')}>ورود</Button>
              <Button fullWidth className="bg-gray-900 text-white" onClick={() => router.push('/register')}>ثبت‌نام</Button>
            </>
          )}
        </div>
      </NavbarMenu>
    </Navbar>
  );
};

export default Navigation;
