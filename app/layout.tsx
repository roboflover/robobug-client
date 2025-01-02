import type { Metadata } from "next";
import "./globals.css";
import { useEffect, useState } from "react";
import Script from "next/script";
// import Head from "next/head";
import { OrderProvider } from '@/app/context/OrderContext';
import { AuthProvider } from "./context/AuthContext";
import { YandexMetricaProvider } from 'next-yandex-metrica';

// export const metadata: Metadata = {
//   title: 'Робожук сервис 3D печати с доставкой',
//   description: 'Сервис 3D печати с доставкой',
// };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode; }>) {

  return (
    <html lang="en" suppressHydrationWarning={true}>

      <body className="font-sans" id="root" suppressHydrationWarning={true} style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}>



        <OrderProvider>
          <AuthProvider>

          {children}

          </AuthProvider>
        </OrderProvider>
      </body>
    </html>
  );
}
