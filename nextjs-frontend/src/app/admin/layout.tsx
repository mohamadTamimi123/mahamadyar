"use client";

import { ReactNode, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function AdminLayout({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(true);
  const pathname = usePathname();

  const links = [
    { href: '/admin', label: 'داشبورد', exact: true },
    { href: '/admin/users', label: 'کاربران' },
    { href: '/admin/groups', label: 'گروه‌ها' },
    { href: '/admin/notifications', label: 'اعلان‌ها' },
    { href: '/admin/events', label: 'رویدادها' },
    { href: '/admin/requests', label: 'درخواست‌ها' },
  ];

  return (
    <div className="flex min-h-[calc(100vh-56px)] w-full gap-0 bg-gradient-to-b from-indigo-50/40 via-white to-white px-2 py-2 sm:px-4">
      <aside className={`transition-all duration-200 ${open ? 'w-64' : 'w-16'} hidden rounded-xl border bg-white p-3 shadow-sm sm:block`}>
        <button aria-label="toggle" onClick={() => setOpen(!open)} className="mb-3 inline-flex h-8 w-full items-center justify-center rounded-md border bg-white text-sm hover:bg-gray-50">
          {open ? 'بستن' : 'باز کردن'}
        </button>
        <nav className="space-y-1">
          {links.map((l) => {
            const active = l.exact ? pathname === l.href : pathname.startsWith(l.href);
            return (
              <Link key={l.href} href={l.href} className={`block rounded-md px-3 py-2 text-sm transition-colors ${active ? 'bg-indigo-600/10 text-indigo-700 ring-1 ring-indigo-200' : 'hover:bg-gray-50'}`}>
                {l.label}
              </Link>
            );
          })}
        </nav>
      </aside>

      <div className="flex-1 mr-3">
        <div className="mb-3 flex items-center justify-between sm:hidden">
          <button aria-label="toggle" onClick={() => setOpen(!open)} className="inline-flex h-9 items-center justify-center rounded-md border bg-white px-3 text-sm shadow-sm">منو</button>
        </div>
        <div className="rounded-xl border bg-white p-4 shadow-sm">{children}</div>
      </div>
    </div>
  );
}


