// src/components/auth/AuthPage.jsx
"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Mail, Lock, User, Phone, Eye, EyeOff } from "lucide-react";
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
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === "password";
  
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  
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
          type={isPassword ? (showPassword ? "text" : "password") : type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          required={required}
          className={`w-full pl-10 ${isPassword ? 'pr-10' : 'pr-3'} py-2.5 border ${error ? 'border-red-500' : 'border-gray-300'} rounded-lg bg-gray-50 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500 shadow-sm transition-colors`}
        />
        {isPassword && (
          <button
            type="button"
            onClick={togglePasswordVisibility}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700 focus:outline-none"
            tabIndex={-1}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}
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
            try {
              const healthData = await healthResponse.json();
              setConnectionStatus(`✅ Backend server is accessible at ${url} (${healthData.status || 'ok'})`);
              // If this isn't the primary URL, suggest updating the environment variable
              if (url !== backendUrl) {
                console.log(`Found working backend at ${url}. Consider updating your NEXT_PUBLIC_API_URL.`);
              }
              return true;
            } catch (parseError) {
              console.log("Health endpoint returned non-JSON response:", parseError);
              setConnectionStatus(`✅ Backend server is accessible at ${url}`);
              return true;
            }
          }
        } catch (healthErr) {
          console.log(`Health check failed for ${url}:`, healthErr);
        }
        
        // If health check failed, try root endpoint
        try {
          console.log("Trying root endpoint at:", url);
          const rootResponse = await fetch(url, { 
            method: 'GET',
            // Abort after 5 seconds
            signal: AbortSignal.timeout(5000)
          });
          
          if (rootResponse.ok) {
            setConnectionStatus(`✅ Backend server is accessible at ${url}`);
            if (url !== backendUrl) {
              console.log(`Found working backend at ${url}. Consider updating your NEXT_PUBLIC_API_URL.`);
            }
            return true;
          }
        } catch (rootErr) {
          console.log(`Root endpoint check failed for ${url}:`, rootErr);
        }
      }
      
      // If we got here, no backends worked
      setConnectionStatus(`❌ Cannot connect to any backend servers. Please check if the backend is deployed.`);
      return false;
    } catch (err) {
      console.error("Backend check error:", err);
      if (err.name === 'TimeoutError' || err.name === 'AbortError') {
        setConnectionStatus("❌ Connection to backend timed out");
      } else {
        setConnectionStatus("❌ Cannot connect to backend server. Is it running?");
      }
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email || !password) {
      setError("Please enter both email and password");
      return;
    }
    
    try {
      setIsSubmitting(true);
      setError("");
      
      // Check backend connectivity
      await checkBackendStatus();
      
      console.log("Attempting login with:", email);
      const result = await login({ email, password });
      console.log("Login result:", result);
      
      if (!result.success) {
        throw new Error(result.message || "Login failed. Please try again.");
      }
      
      // Save to local storage if remember me is checked
      if (rememberMe) {
        localStorage.setItem("rememberedEmail", email);
      } else {
        localStorage.removeItem("rememberedEmail");
      }
      
      console.log("Login successful, redirecting to home page");
      // Redirect to home page
      router.push("/");
    } catch (err) {
      console.error("Login error in form:", err);
      
      // Customize error message based on type of error
      if (err.message?.includes("Network error") || err.message?.includes("Failed to fetch") || err.message?.includes("fetch failed")) {
        setError("Cannot connect to the server. Please check your internet connection or try again later.");
        // Try to show more diagnostic info in dev mode
        if (process.env.NODE_ENV === 'development') {
          setConnectionStatus(`❌ Connection error: ${err.message}`);
        }
      } else if (err.message?.includes("Invalid credentials") || err.message?.includes("Invalid email or password")) {
        setError("Invalid email or password. Please try again.");
      } else if (err.message?.includes("verify your email")) {
        setError("Please verify your email before logging in.");
      } else {
        setError(err.message || "Login failed. Please try again.");
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
          error={null}
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
          error={null}
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
  const [errors, setErrors] = useState({
    firstName: undefined,
    lastName: undefined,
    email: undefined,
    password: undefined,
    confirmPassword: undefined,
    agreeTerms: undefined
  });
  
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
          error={null}
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