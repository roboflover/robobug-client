'use client';

import "./../globals.css";
import { ThemeProvider } from "next-themes";
import { Header } from '@/app/(site)/components/header';
import { Footer } from '@/app/(site)/components/footer';
import { useState } from "react";
import { AuthProvider } from "../context/AuthContext";
import { usePathname } from 'next/navigation';
// import { YandexMetricaProvider } from 'next-yandex-metrica';
import { OrderProvider } from '@/app/context/OrderContext';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Определяем, должна ли страница показывать Header
  const showHeader = pathname !== '/graffiti';

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="light"
      enableSystem
      disableTransitionOnChange
    >
      <OrderProvider>
      <AuthProvider>
        {/* <YandexMetricaProvider
          tagID={97622142}
          initParameters={{ clickmap: true, trackLinks: true, accurateTrackBounce: true }}
        > */}
        <div className="w-full max-w-5xl mx-auto" style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}>
          {showHeader && <Header toggleMenu={toggleMenu} />}
          <div className="">
            <main className="shadow-md flex-1 p-4 bg-gray-200 dark:bg-gray-900">{children}</main>
          </div>
          {showHeader && <Footer/>}
        </div>
        {/* </YandexMetricaProvider> */}
      </AuthProvider>
      </OrderProvider>
    </ThemeProvider>
  );
}
