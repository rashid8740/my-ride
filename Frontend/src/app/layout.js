// src/app/layout.js
import "./globals.css";
import { AuthProvider } from "@/utils/AuthContext";
import { FavoritesProvider } from "@/utils/FavoritesContext";
import { Toaster } from "react-hot-toast";
import { Inter } from 'next/font/google';
import dynamic from 'next/dynamic';

const inter = Inter({ subsets: ['latin'] });

// Dynamically import the debug component to avoid SSR issues
// Pass false as default for showInitially since we can't use client hooks in layout
const DebugInfo = dynamic(() => import('./debug-info'), { ssr: false });

export const metadata = {
  title: "My Ride - Premium Car Marketplace",
  description: "Find your perfect car at My Ride, Kenya's premier car dealership marketplace. Browse our luxury, sedan, SUV, electric, and hybrid vehicles.",
  keywords: "cars, dealership, automotive, vehicles, buy cars, sell cars, Kenya",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="font-sans">
      <body suppressHydrationWarning>
        <AuthProvider>
          <FavoritesProvider>
            <div className="min-w-full overflow-x-hidden">{children}</div>
            <Toaster position="top-right" />
            {/* No conditional is needed - the component will handle it internally */}
            <DebugInfo />
          </FavoritesProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
