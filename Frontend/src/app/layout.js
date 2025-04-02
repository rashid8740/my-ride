// src/app/layout.js
import "./globals.css";
import { AuthProvider } from "@/utils/AuthContext";
import { FavoritesProvider } from "@/utils/FavoritesContext";
import { Toaster } from "react-hot-toast";

export const metadata = {
  title: "My Ride - Car Dealership",
  description: "Find your perfect car at My Ride, the premier car dealership",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="font-sans">
      <body suppressHydrationWarning>
        <AuthProvider>
          <FavoritesProvider>
            <div className="min-w-full overflow-x-hidden">{children}</div>
            <Toaster position="top-right" />
          </FavoritesProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
