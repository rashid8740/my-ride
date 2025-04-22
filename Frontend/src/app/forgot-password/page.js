// src/app/forgot-password/page.js
"use client";
import ForgotPassword from '@/components/auth/ForgotPassword';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

// Metadata should be in layout.js for client components

export default function ForgotPasswordPage() {
  return (
    <main>
      <Navbar />
      <ForgotPassword />
      <Footer />
    </main>
  );
}