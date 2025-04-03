// src/app/forgot-password/page.js
// No "use client" here - this is now a Server Component
import ForgotPassword from "@/components/auth/ForgotPassword";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

// Export metadata for SEO (valid in Server Components)
export const metadata = {
  title: "Forgot Password | AutoDecar",
  description: "Reset your AutoDecar account password",
};

export default function ForgotPasswordPage() {
  return (
    <main>
      <Navbar />
      <ForgotPassword />
      <Footer />
    </main>
  );
}
