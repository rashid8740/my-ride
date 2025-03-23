// src/components/auth/ForgotPassword.jsx
"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Mail, CheckCircle } from "lucide-react";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Handle scroll event for page appearance
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Add password reset request logic here
    console.log({ email });
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-100 pt-32">
        <div className="w-full max-w-md mx-auto px-4">
          <div className="mb-8">
            <Link
              href="/login"
              className="inline-flex items-center text-gray-700 hover:text-orange-500 transition-colors"
            >
              <ArrowLeft size={18} className="mr-2" />
              <span className="font-medium">Back to Login</span>
            </Link>
          </div>

          <div className="bg-white rounded-xl shadow-xl p-6 md:p-8 text-center">
            <div className="bg-green-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle size={50} className="text-green-500" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Check Your Email</h2>
            <p className="text-gray-600 mb-6">
              We've sent a password reset link to <span className="font-medium">{email}</span>. 
              Please check your email and follow the instructions to reset your password.
            </p>
            <Link
              href="/login"
              className="block w-full bg-orange-500 hover:bg-orange-600 text-white font-medium py-3 px-4 rounded-lg transition-colors shadow-md text-center"
            >
              Return to Login
            </Link>
            <p className="mt-6 text-sm text-gray-600">
              Didn't receive the email?{" "}
              <button
                type="button"
                onClick={() => setSubmitted(false)}
                className="text-orange-500 hover:text-orange-600 font-medium transition-colors"
              >
                Try again
              </button>
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 pt-32">
      <div className="w-full max-w-md mx-auto px-4">
        <div className="mb-8">
          <Link
            href="/login"
            className="inline-flex items-center text-gray-700 hover:text-orange-500 transition-colors"
          >
            <ArrowLeft size={18} className="mr-2" />
            <span className="font-medium">Back to Login</span>
          </Link>
        </div>

        <div className="bg-white rounded-xl shadow-xl p-6 md:p-8">
          <div className="mb-8 text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Forgot Password</h2>
            <p className="text-gray-600">Enter your email to reset your password</p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label htmlFor="reset-email" className="block text-sm font-medium text-gray-700 mb-1">
                Email Address <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
                  <Mail size={18} />
                </div>
                <input
                  id="reset-email"
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg bg-gray-50 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500 shadow-sm transition-colors"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-orange-500 hover:bg-orange-600 text-white font-medium py-3 px-4 rounded-lg transition-colors shadow-md"
            >
              Reset Password
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}