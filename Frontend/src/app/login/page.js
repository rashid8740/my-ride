// src/app/login/page.js
"use client";
import AuthPage from '@/components/auth/AuthPage';
import AdminInfo from '@/components/auth/AdminInfo';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

export default function LoginPage() {
  return (
    <main>
      <Navbar />
      <AuthPage initialMode="login" />
      <AdminInfo />
      <Footer />
    </main>
  );
}