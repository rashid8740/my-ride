// src/app/login/page.js
import AuthPage from "@/components/auth/AuthPage";

export const metadata = {
  title: "Login | AutoDecar",
  description: "Sign in to your AutoDecar account or create a new one",
};

export default function LoginPage() {
  return <AuthPage />;
}