// src/app/forgot-password/page.js
import ForgotPassword from "@/components/auth/ForgotPassword";

export const metadata = {
  title: "Forgot Password | AutoDecar",
  description: "Reset your AutoDecar account password",
};

export default function ForgotPasswordPage() {
  return <ForgotPassword />;
}