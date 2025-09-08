import Providers from './providers'
import type { Metadata } from "next";
import { Inter, Vazirmatn } from "next/font/google";
import "./globals.css";
import Navigation from "@/components/Navigation";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const vazirmatn = Vazirmatn({
  variable: "--font-vazirmatn",
  subsets: ["arabic"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "سیستم مدیریت اعضای خانواده",
  description: "مدیریت کامل شجره‌نامه خانوادگی با قابلیت‌های پیشرفته",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fa" dir="rtl">
      <body suppressHydrationWarning
        className={`${inter.variable} ${vazirmatn.variable} font-vazirmatn antialiased`}
      >
        <Navigation />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
