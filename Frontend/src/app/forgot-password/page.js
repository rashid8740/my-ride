// src/app/forgot-password/page.js
"use client";
import ForgotPassword from '@/components/auth/ForgotPassword';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
// Metadata is defined in layout.js


export default function ForgotPasswordPage() {
  return (
    <main>
      <Navbar />
      <ForgotPassword />
      <Footer />
    </main>
  );
}