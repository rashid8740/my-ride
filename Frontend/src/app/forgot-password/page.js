"use client";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ForgotPassword from "@/components/auth/ForgotPassword";

export default function ForgotPasswordPage() {
  return (
    <>
      <Navbar />
      <main>
        <ForgotPassword />
      </main>
      <Footer />
    </>
  );
}
