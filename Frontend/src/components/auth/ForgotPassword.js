// src/components/auth/ForgotPassword.jsx
"use client";
import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Mail } from "lucide-react";
import { useAuth } from "@/utils/AuthContext";

// Input Field Component - Similar to the one in AuthPage
const InputField = ({ 
  id, 
  label, 
  type = "text", 
  placeholder, 
  value, 
  onChange, 
  required = false,
  icon,
  error
}) => {
  return (
    <div className="mb-4">
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
          {icon}
        </div>
        <input
          id={id}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          required={required}
          className={`w-full pl-10 pr-3 py-2.5 border ${error ? 'border-red-500' : 'border-gray-300'} rounded-lg bg-gray-50 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500 shadow-sm transition-colors`}
        />
      </div>
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
};

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  
  const { forgotPassword } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email) {
      setError("Please enter your email address");
      return;
    }
    
    try {
      setIsSubmitting(true);
      setError("");
      setSuccessMessage("");
      
      await forgotPassword(email);
      
      // Show success message
      setSuccessMessage("Password reset instructions have been sent to your email");
      setEmail("");
    } catch (err) {
      setError(err.message || "Failed to send reset email. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

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

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-md text-sm">
              {error}
            </div>
          )}

          {successMessage && (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-700 rounded-md text-sm">
              {successMessage}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <InputField
              id="email"
              label="Email"
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              icon={<Mail size={18} />}
            />

            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full bg-orange-500 hover:bg-orange-600 text-white font-medium py-3 px-4 rounded-lg transition-colors shadow-md mt-6 ${
                isSubmitting ? "opacity-70 cursor-wait" : ""
              }`}
            >
              {isSubmitting ? "Sending Reset Link..." : "Send Reset Link"}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Remember your password?{" "}
              <Link
                href="/login"
                className="text-orange-500 hover:text-orange-600 font-medium transition-colors"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}