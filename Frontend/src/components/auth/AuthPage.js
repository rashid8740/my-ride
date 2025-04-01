// src/components/auth/AuthPage.jsx
"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Mail, Lock, User, Phone } from "lucide-react";
import { useAuth } from "@/utils/AuthContext";

// Input Field Component
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

// Login Form Component
const LoginForm = ({ onToggle }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [connectionStatus, setConnectionStatus] = useState(null);
  
  const { login } = useAuth();
  const router = useRouter();

  // Function to check backend connectivity
  const checkBackendStatus = async () => {
    try {
      setConnectionStatus("Checking connection to backend server...");
      const response = await fetch(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000');
      if (response.ok) {
        setConnectionStatus("✅ Backend server is accessible");
        return true;
      } else {
        setConnectionStatus("❌ Backend server returned an error");
        return false;
      }
    } catch (err) {
      setConnectionStatus("❌ Cannot connect to backend server. Is it running?");
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email || !password) {
      setError("Please enter both email and password");
      return;
    }
    
    // Show connection status when logging in as admin
    if (email.toLowerCase() === "admin@myride.com") {
      await checkBackendStatus();
    }
    
    try {
      setIsSubmitting(true);
      setError("");
      
      await login({ email, password });
      
      // Save to local storage if remember me is checked
      if (rememberMe) {
        localStorage.setItem("rememberedEmail", email);
      } else {
        localStorage.removeItem("rememberedEmail");
      }
      
      // Redirect to home page
      router.push("/");
    } catch (err) {
      setError(err.message || "Login failed. Please check your credentials.");
      
      // If it's admin login and we got a network error, check backend connectivity
      if (email.toLowerCase() === "admin@myride.com" && err.message?.includes("Network error")) {
        await checkBackendStatus();
      }
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Load remembered email if exists
  useEffect(() => {
    const rememberedEmail = localStorage.getItem("rememberedEmail");
    if (rememberedEmail) {
      setEmail(rememberedEmail);
      setRememberMe(true);
    }
  }, []);

  return (
    <div className="bg-white rounded-xl shadow-xl p-6 md:p-8">
      <div className="mb-8 text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h2>
        <p className="text-gray-600">Sign in to your account to continue</p>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-md text-sm">
          {error}
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

        <InputField
          id="password"
          label="Password"
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          icon={<Lock size={18} />}
        />

        <div className="flex items-center justify-between mb-6">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={() => setRememberMe(!rememberMe)}
              className="w-4 h-4 text-orange-500 border-gray-300 rounded focus:ring-orange-500"
            />
            <span className="ml-2 text-sm text-gray-600">Remember me</span>
          </label>
          <Link
            href="/forgot-password"
            className="text-sm text-orange-500 hover:text-orange-600 font-medium transition-colors"
          >
            Forgot password?
          </Link>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full bg-orange-500 hover:bg-orange-600 text-white font-medium py-3 px-4 rounded-lg transition-colors shadow-md ${
            isSubmitting ? "opacity-70 cursor-wait" : ""
          }`}
        >
          {isSubmitting ? "Signing In..." : "Sign In"}
        </button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-sm text-gray-600">
          Don&apos;t have an account?{" "}
          <button
            type="button"
            onClick={onToggle}
            className="text-orange-500 hover:text-orange-600 font-medium transition-colors"
          >
            Create an account
          </button>
        </p>
      </div>
    </div>
  );
};

// Register Form Component
const RegisterForm = ({ onToggle }) => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [errors, setErrors] = useState({});
  
  const { register } = useAuth();
  const router = useRouter();

  const validateForm = () => {
    const newErrors = {};
    
    if (!firstName) newErrors.firstName = "First name is required";
    if (!lastName) newErrors.lastName = "Last name is required";
    if (!email) newErrors.email = "Email is required";
    if (email && !/^\S+@\S+\.\S+$/.test(email)) newErrors.email = "Invalid email format";
    if (!password) newErrors.password = "Password is required";
    if (password && password.length < 8) newErrors.password = "Password must be at least 8 characters";
    if (password !== confirmPassword) newErrors.confirmPassword = "Passwords do not match";
    if (!agreeTerms) newErrors.agreeTerms = "You must agree to the terms";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    try {
      setIsSubmitting(true);
      setError("");
      
      await register({
        firstName,
        lastName,
        email,
        password,
        phone
      });
      
      // Redirect to home page or show success message
      router.push("/");
    } catch (err) {
      setError(err.message || "Registration failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-xl p-6 md:p-8">
      <div className="mb-8 text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Create an Account</h2>
        <p className="text-gray-600">Join our community today</p>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-md text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <InputField
            id="firstName"
            label="First Name"
            placeholder="John"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
            icon={<User size={18} />}
            error={errors.firstName}
          />

          <InputField
            id="lastName"
            label="Last Name"
            placeholder="Doe"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
            icon={<User size={18} />}
            error={errors.lastName}
          />
        </div>

        <InputField
          id="reg-email"
          label="Email"
          type="email"
          placeholder="your@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          icon={<Mail size={18} />}
          error={errors.email}
        />

        <InputField
          id="phone"
          label="Phone Number"
          type="tel"
          placeholder="(123) 456-7890"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          icon={<Phone size={18} />}
        />

        <InputField
          id="reg-password"
          label="Password"
          type="password"
          placeholder="Create a password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          icon={<Lock size={18} />}
          error={errors.password}
        />
        
        <InputField
          id="confirm-password"
          label="Confirm Password"
          type="password"
          placeholder="Confirm your password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          icon={<Lock size={18} />}
          error={errors.confirmPassword}
        />

        <div className="mb-6">
          <label className="flex items-start">
            <input
              type="checkbox"
              checked={agreeTerms}
              onChange={() => setAgreeTerms(!agreeTerms)}
              className={`w-4 h-4 mt-0.5 text-orange-500 border-gray-300 rounded focus:ring-orange-500 ${
                errors.agreeTerms ? "border-red-500" : ""
              }`}
              required
            />
            <span className="ml-2 text-sm text-gray-600">
              I agree to the{" "}
              <Link href="/terms" className="text-orange-500 hover:text-orange-600">
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link href="/privacy" className="text-orange-500 hover:text-orange-600">
                Privacy Policy
              </Link>
            </span>
          </label>
          {errors.agreeTerms && (
            <p className="mt-1 text-xs text-red-500">{errors.agreeTerms}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full bg-orange-500 hover:bg-orange-600 text-white font-medium py-3 px-4 rounded-lg transition-colors shadow-md ${
            isSubmitting ? "opacity-70 cursor-wait" : ""
          }`}
        >
          {isSubmitting ? "Creating Account..." : "Create Account"}
        </button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-sm text-gray-600">
          Already have an account?{" "}
          <button
            type="button"
            onClick={onToggle}
            className="text-orange-500 hover:text-orange-600 font-medium transition-colors"
          >
            Sign in
          </button>
        </p>
      </div>
    </div>
  );
};

// Main Auth Page Component
export default function AuthPage({ initialMode = "login" }) {
  const [isLogin, setIsLogin] = useState(initialMode === "login");
  const [scrolled, setScrolled] = useState(false);
  const { isAuthenticated, user } = useAuth();
  const router = useRouter();

  // Redirect if already logged in
  useEffect(() => {
    if (isAuthenticated && user) {
      router.push("/");
    }
  }, [isAuthenticated, user, router]);

  // Handle scroll event for page appearance
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 pt-32">
      <div className="w-full max-w-md mx-auto px-4">
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center text-gray-700 hover:text-orange-500 transition-colors"
          >
            <ArrowLeft size={18} className="mr-2" />
            <span className="font-medium">Back to Home</span>
          </Link>
        </div>

        {isLogin ? (
          <LoginForm onToggle={() => setIsLogin(false)} />
        ) : (
          <RegisterForm onToggle={() => setIsLogin(true)} />
        )}
      </div>
    </div>
  );
}