import './globals.css';
import { ReactNode } from 'react';
import localFont from 'next/font/local';
import NavBar from '@/components/NavBar';

export const metadata = {
  title: 'محمدیار',
  description: 'فرانت‌اند با نکست‌جی‌اس',
};

const iranSans = localFont({
  src: [
    { path: '../public/fonts/woff2/IRANSansX-Regular.woff2', weight: '400', style: 'normal' },
    { path: '../public/fonts/woff2/IRANSansX-Medium.woff2', weight: '500', style: 'normal' },
    { path: '../public/fonts/woff2/IRANSansX-Bold.woff2', weight: '700', style: 'normal' },
  ],
  variable: '--font-iran-sans',
  display: 'swap',
});

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="fa" dir="rtl">
      <body className={`${iranSans.className} ${iranSans.variable} `}>
        <NavBar />
        {children}
      </body>
    </html>
  );
}


