"use client";

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';

export default function NavBar() {
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    try {
      const raw = typeof window !== 'undefined' ? window.localStorage.getItem('app_user') : null;
      if (raw) setUser(JSON.parse(raw));
    } catch {}
  }, []);

  // react to login/logout events
  useEffect(() => {
    function refresh() {
      try {
        const raw = typeof window !== 'undefined' ? window.localStorage.getItem('app_user') : null;
        setUser(raw ? JSON.parse(raw) : null);
      } catch {
        setUser(null);
      }
    }
    window.addEventListener('app_user:update', refresh);
    return () => window.removeEventListener('app_user:update', refresh);
  }, []);

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (!menuRef.current) return;
      if (!menuRef.current.contains(e.target as Node)) setMenuOpen(false);
    }
    if (menuOpen) document.addEventListener('mousedown', onDocClick);
    return () => document.removeEventListener('mousedown', onDocClick);
  }, [menuOpen]);

  async function logout() {
    try {
      if (typeof window !== 'undefined') {
        window.localStorage.removeItem('app_user');
      }
      const apiBase = process.env.NEXT_PUBLIC_API_URL || '';
      if (apiBase) {
        await fetch(`${apiBase.replace(/\/$/, '')}/auth/logout`, { method: 'POST', credentials: 'include' }).catch(() => {});
      }
    } finally {
      setUser(null);
      setMenuOpen(false);
    }
  }

  return (
    <header className="sticky top-0 z-20 border-b bg-white/70 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex h-14 items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-md bg-indigo-600" />
            <span className="text-base font-semibold">محمدیار</span>
          </Link>
      
          <nav className="hidden items-center gap-6 sm:flex">
            <Link href="/" className="text-sm text-gray-700 hover:text-gray-900">لندینگ</Link>
            <Link href="/dashboard" className="text-sm text-gray-700 hover:text-gray-900">داشبورد</Link>
            <Link href={{ pathname: '/', hash: 'features' }} className="text-sm text-gray-700 hover:text-gray-900">ویژگی‌ها</Link>
            <Link href={{ pathname: '/', hash: 'get-started' }} className="text-sm text-gray-700 hover:text-gray-900">شروع</Link>
            <Link href="#" className="text-sm text-gray-700 hover:text-gray-900">مستندات</Link>
          </nav>

          <div className="hidden items-center gap-2 sm:flex">
            {user ? (
              <div className="relative" ref={menuRef}>
                <button onClick={() => setMenuOpen((v) => !v)} className="inline-flex h-9 items-center justify-center gap-2 rounded-md border bg-white px-3 text-sm shadow-sm">
                  <div className="h-6 w-6 rounded-full bg-indigo-600/80" />
                  <span className="max-w-[120px] truncate">{user?.email || 'پروفایل'}</span>
                  {user?.role && (
                    <span className="hidden rounded-full bg-indigo-50 px-2 py-0.5 text-[10px] text-indigo-700 sm:inline">{(user.role || '').toLowerCase() === 'admin' ? 'ادمین' : 'کاربر'}</span>
                  )}
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
                </button>
                {menuOpen && (
                  <div className="absolute left-0 mt-2 w-56 rounded-md border bg-white p-2 text-sm shadow-lg">
                    <div className="mb-2 flex items-center gap-2 rounded-md bg-gray-50 p-2">
                      <div className="h-8 w-8 rounded-full bg-indigo-600/80" />
                      <div className="min-w-0">
                        <div className="truncate font-medium">{user?.email || 'کاربر'}</div>
                        <div className="truncate text-xs text-gray-600">دسترسی: {(user?.role || 'user').toLowerCase() === 'admin' ? 'ادمین' : 'کاربر'}</div>
                      </div>
                    </div>
                    <Link href="/dashboard" className="block rounded-md px-2 py-2 hover:bg-gray-50" onClick={() => setMenuOpen(false)}>داشبورد</Link>
                    {user?.role?.toLowerCase?.() === 'admin' && (
                      <Link href="/admin" className="block rounded-md px-2 py-2 hover:bg-gray-50" onClick={() => setMenuOpen(false)}>مدیریت</Link>
                    )}
                    <Link href="#" className="block rounded-md px-2 py-2 hover:bg-gray-50" onClick={() => setMenuOpen(false)}>تنظیمات</Link>
                    <div className="my-2 h-px bg-gray-200" />
                    <button onClick={logout} className="flex w-full items-center justify-center rounded-md bg-red-50 px-3 py-2 text-red-700 hover:bg-red-100">خروج</button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link href="/auth/login" className="inline-flex h-9 items-center justify-center rounded-md border px-4 text-sm font-medium hover:bg-gray-50">ورود</Link>
                <Link href="/auth/register" className="inline-flex h-9 items-center justify-center rounded-md bg-indigo-600 px-4 text-sm font-medium text-white hover:bg-indigo-700">ثبت‌نام</Link>
                <Link href="/auth/request-invite" className="inline-flex h-9 items-center justify-center rounded-md  px-3 text-sm hover:bg-gray-50">درخواست کد ثبت نام</Link>
              </>
            )}
          </div>

          <button aria-label="باز کردن منو" className="sm:hidden inline-flex h-9 w-9 items-center justify-center rounded-md border" onClick={() => setOpen((v) => !v)}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
          </button>
        </div>
      </div>

      {open && (
        <div className="sm:hidden border-t">
          <div className="mx-auto max-w-6xl px-4 py-3">
            <nav className="flex flex-col gap-3">
              <Link href="/" onClick={() => setOpen(false)} className="text-sm text-gray-700">لندینگ</Link>
              <Link href="/dashboard" onClick={() => setOpen(false)} className="text-sm text-gray-700">داشبورد</Link>
              <Link href={{ pathname: '/', hash: 'features' }} onClick={() => setOpen(false)} className="text-sm text-gray-700">ویژگی‌ها</Link>
              <Link href={{ pathname: '/', hash: 'get-started' }} onClick={() => setOpen(false)} className="text-sm text-gray-700">شروع</Link>
              <Link href="#" onClick={() => setOpen(false)} className="text-sm text-gray-700">مستندات</Link>
              <div className="mt-2 flex items-center gap-2">
                {user ? (
                  <>
                    <Link href="/dashboard" onClick={() => setOpen(false)} className="inline-flex h-9 flex-1 items-center justify-center gap-2 rounded-md  bg-white px-4 text-sm font-medium">
                      <div className="h-6 w-6 rounded-full bg-indigo-600/80" />
                      <span className="truncate">{user?.email || 'پروفایل'}</span>
                    </Link>
                    <div className="text-center text-xs text-gray-600">دسترسی: {(user?.role || 'user').toLowerCase() === 'admin' ? 'ادمین' : 'کاربر'}</div>
                    <button onClick={() => { logout(); setOpen(false); }} className="inline-flex h-9 flex-1 items-center justify-center rounded-md bg-red-50 px-4 text-sm font-medium text-red-700">خروج</button>
                  </>
                ) : (
                  <>
                    <Link href="/auth/login" className="inline-flex h-9 flex-1 items-center justify-center rounded-md border px-4 text-sm font-medium">ورود</Link>
                    <Link href="/auth/register" className="inline-flex h-9 flex-1 items-center justify-center rounded-md bg-indigo-600 px-4 text-sm font-medium text-white">ثبت‌نام</Link>
                    <Link href="/auth/request-invite" onClick={() => setOpen(false)} className="inline-flex h-9 flex-1 items-center justify-center rounded-md border px-4 text-sm">درخواست کد</Link>
                  </>
                )}
              </div>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}


