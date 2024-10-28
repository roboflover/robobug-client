'use client';
import "./../globals.css";
import { ThemeProvider } from "next-themes";
import { Header } from '@/app/(site)/components/header';
import { Footer } from '@/app/(site)/components/footer';
import { useState } from "react";
import { AuthProvider } from "../context/AuthContext";

// Удалена строка импорта шрифтов
// const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode; }>) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="light"
      enableSystem
      disableTransitionOnChange
    >
      <AuthProvider>
        <div className="w-full max-w-5xl mx-auto" style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}>
          <Header toggleMenu={toggleMenu} />
          <div className="">
            <main className="shadow-md flex-1 p-4 bg-gray-200 dark:bg-gray-900">{children}</main>
            {/* <div className="w-64 bg-gray-100 dark:bg-gray-800 p-4">
              <SidebarMenu isOpen={isMenuOpen} toggleMenu={toggleMenu} />
              <Banner isOpen={isMenuOpen} toggleMenu={toggleMenu} />
            </div> */}
          </div>
          <Footer />
        </div>
      </AuthProvider>
    </ThemeProvider>
  );
}