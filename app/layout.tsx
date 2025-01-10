'use client';
import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.scss";
import { ConfigProvider } from "antd-mobile";
import useLocale from "@/utils/useLocale";
import enUS from 'antd-mobile/es/locales/en-US'
import zhCN from 'antd-mobile/es/locales/zh-CN';
import BottomNav from "@/components/Tabbar";
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// export const viewport: Viewport = {
//   width: 'device-width',
//   initialScale: 1,
//   maximumScale: 1,
//   minimumScale: 1,
//   userScalable: false,
// };

const metadata: Metadata = {
  title: "首页",
  description: "首页精选",
};

export default function RootLayout ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { locale } = useLocale();
  const locales = {
    'zh-CN': zhCN,
    'en-US': enUS,
  } as any;
  console.log('Current locale:', locale);
  return (
    <html lang={locale === 'zh-CN' ? 'zh' : 'en'}>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <ConfigProvider locale={enUS}>
          {children}
          <BottomNav />
        </ConfigProvider>
      </body>
    </html>
  );
}
