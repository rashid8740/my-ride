"use client";
import AuthPage from '@/components/auth/AuthPage';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

export default function RegisterPage() {
  return (
    <main>
      <Navbar />
      <AuthPage initialMode="register" />
      <Footer />
    </main>
  );
} 
 
 