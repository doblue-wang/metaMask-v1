'use client';
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.scss";
import { ConfigProvider } from "antd-mobile";
import useLocale from "@/utils/useLocale";
import enUS from 'antd-mobile/es/locales/en-US'
import '../i18n';
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});



export default function RootLayout ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { locale } = useLocale();
  return (
    <html lang={locale === 'zh-CN' ? 'zh' : 'en'}>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <ConfigProvider locale={enUS}>
          {children}
        </ConfigProvider>
      </body>
    </html>
  );
}
