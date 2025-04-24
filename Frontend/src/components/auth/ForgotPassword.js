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
  error = null
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
  const [connectionStatus, setConnectionStatus] = useState(null);
  
  const { forgotPassword } = useAuth();

  // Function to check backend connectivity
  const checkBackendStatus = async () => {
    try {
      setConnectionStatus("Checking connection to backend server...");
      
      // Try the configured API URL first
      const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      console.log("Checking primary backend at:", backendUrl);
      
      // List of potential backend URLs to try in order
      const backendUrls = [
        backendUrl,
        'https://my-ride-backend.onrender.com',
        'https://my-ride-backend.vercel.app'
      ];
      
      // Try each backend URL
      for (const url of backendUrls) {
        try {
          // Try health endpoint first
          const healthUrl = `${url}/api/health`;
          console.log("Trying health endpoint at:", healthUrl);
          
          const healthResponse = await fetch(healthUrl, { 
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            // Abort after 5 seconds to try next quickly
            signal: AbortSignal.timeout(5000)
          });
          
          if (healthResponse.ok) {
            // Found a working backend!
            setConnectionStatus(`✅ Backend server is accessible at ${url}`);
            return true;
          }
        } catch (healthErr) {
          console.log(`Health check failed for ${url}:`, healthErr);
        }
      }
      
      // If we got here, no backends worked
      setConnectionStatus(`❌ Cannot connect to any backend servers. Please check if the backend is deployed.`);
      return false;
    } catch (err) {
      console.error("Backend check error:", err);
      setConnectionStatus("❌ Cannot connect to backend server. Is it running?");
      return false;
    }
  };

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
      
      // Check backend connectivity first
      await checkBackendStatus();
      
      // Call forgotPassword from AuthContext
      const result = await forgotPassword(email);
      
      if (result.success) {
        // Show success message
        setSuccessMessage(result.message || "Password reset instructions have been sent to your email");
        setEmail("");
      } else {
        // Show error message
        setError(result.message || "Failed to send reset email. Please try again.");
      }
    } catch (err) {
      console.error("Error in forgot password:", err);
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
          
          {connectionStatus && (
            <div className={`mb-4 p-3 ${connectionStatus.includes("✅") ? "bg-green-50 border-green-200 text-green-700" : "bg-yellow-50 border-yellow-200 text-yellow-700"} rounded-md text-sm`}>
              {connectionStatus}
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