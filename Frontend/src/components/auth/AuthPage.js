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
      let foundWorkingBackend = false;
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
            foundWorkingBackend = true;
            try {
              const healthData = await healthResponse.json();
              const dbStatus = healthData.database === 'connected' ? '(Database connected)' : '(Database disconnected)';
              setConnectionStatus(`✅ Backend server is accessible at ${url} ${dbStatus}`);
            } catch (parseError) {
              setConnectionStatus(`✅ Backend server is accessible at ${url}`);
            }
            return true;
          }
        } catch (healthErr) {
          console.log(`Health check failed for ${url}:`, healthErr);
        }
        
        // If health check failed, try root endpoint
        if (!foundWorkingBackend) {
          try {
            console.log("Trying root endpoint at:", url);
            const rootResponse = await fetch(url, { 
              method: 'GET',
              // Abort after 5 seconds
              signal: AbortSignal.timeout(5000)
            });
            
            if (rootResponse.ok) {
              setConnectionStatus(`✅ Backend server is accessible at ${url}`);
              return true;
            }
          } catch (rootErr) {
            console.log(`Root endpoint check failed for ${url}:`, rootErr);
          }
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
      const isConnected = await checkBackendStatus();
      if (!isConnected) {
        console.warn("Login proceeding despite connectivity warning");
      }
      
      // Attempt login
      console.log("Attempting login with:", email);
      const result = await login({ email, password });
      console.log("Login result:", result);
      
      if (!result.success) {
        throw new Error(result.message || "Login failed.");
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
      
      if (err.message?.includes("Invalid response from server")) {
        setError("We're having trouble connecting to the server. Please try again later.");
      } else if (err.message?.includes("Network error") || err.message?.includes("timed out")) {
        setError("Can't reach the server. Please check your internet connection and try again.");
        await checkBackendStatus();
      } else {
        setError(err.message || "Login failed. Please check your credentials.");
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
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    agreeTerms: false
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  // Define errors with the same structure as formData for TypeScript
  const [errors, setErrors] = useState({
    firstName: null,
    lastName: null,
    email: null,
    password: null,
    confirmPassword: null,
    agreeTerms: null
  });
  
  const { register } = useAuth();
  const router = useRouter();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.firstName) newErrors.firstName = "First name is required";
    if (!formData.lastName) newErrors.lastName = "Last name is required";
    if (!formData.email) newErrors.email = "Email is required";
    if (formData.email && !/^\S+@\S+\.\S+$/.test(formData.email)) newErrors.email = "Invalid email format";
    if (!formData.password) newErrors.password = "Password is required";
    if (formData.password && formData.password.length < 8) newErrors.password = "Password must be at least 8 characters";
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = "Passwords do not match";
    if (!formData.agreeTerms) newErrors.agreeTerms = "You must agree to the terms";
    
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
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
        phone: formData.phone
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
            value={formData.firstName}
            onChange={(e) => handleChange({
              target: { name: 'firstName', value: e.target.value }
            })}
            required
            icon={<User size={18} />}
            error={errors.firstName}
          />

          <InputField
            id="lastName"
            label="Last Name"
            placeholder="Doe"
            value={formData.lastName}
            onChange={(e) => handleChange({
              target: { name: 'lastName', value: e.target.value }
            })}
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
          value={formData.email}
          onChange={(e) => handleChange({
            target: { name: 'email', value: e.target.value }
          })}
          required
          icon={<Mail size={18} />}
          error={errors.email}
        />

        <InputField
          id="phone"
          label="Phone Number"
          type="tel"
          placeholder="(123) 456-7890"
          value={formData.phone}
          onChange={(e) => handleChange({
            target: { name: 'phone', value: e.target.value }
          })}
          icon={<Phone size={18} />}
        />

        <InputField
          id="reg-password"
          label="Password"
          type="password"
          placeholder="Create a password"
          value={formData.password}
          onChange={(e) => handleChange({
            target: { name: 'password', value: e.target.value }
          })}
          required
          icon={<Lock size={18} />}
          error={errors.password}
        />
        
        <InputField
          id="confirm-password"
          label="Confirm Password"
          type="password"
          placeholder="Confirm your password"
          value={formData.confirmPassword}
          onChange={(e) => handleChange({
            target: { name: 'confirmPassword', value: e.target.value }
          })}
          required
          icon={<Lock size={18} />}
          error={errors.confirmPassword}
        />

        <div className="mb-6">
          <label className="flex items-start">
            <input
              type="checkbox"
              name="agreeTerms"
              checked={formData.agreeTerms}
              onChange={(e) => handleChange({
                target: { name: 'agreeTerms', type: 'checkbox', checked: e.target.checked }
              })}
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
  const [mode, setMode] = useState(initialMode);
  
  // Toggle between login and register modes
  const toggleMode = () => {
    setMode(mode === "login" ? "register" : "login");
  };
  
  // Get scroll position for animated elements
  const [scrollY, setScrollY] = useState(0);
  
  // Update scroll position
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="py-12 md:py-20 px-4">
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
        {/* Left: Auth Form */}
        <div className="md:order-1 order-2">
          <div className="max-w-md mx-auto">
            <h1 className="text-3xl font-bold text-gray-900 mb-2 text-center">
              {mode === "login" ? "Sign In" : "Create Account"}
            </h1>
            <p className="text-gray-600 text-center mb-8">
              {mode === "login"
                ? "Sign in to access your My Ride account"
                : "Register to start browsing premium vehicles"}
            </p>

            {mode === "login" ? (
              <LoginForm onToggle={toggleMode} />
            ) : (
              <RegisterForm onToggle={toggleMode} />
            )}
          </div>
        </div>

        {/* Right: Image and Text */}
        <div className="md:order-2 order-1 relative overflow-hidden rounded-xl shadow-xl">
          <div className="absolute inset-0 bg-gradient-to-br from-orange-500/90 to-orange-700/90 z-10"></div>
          <img
            src="/images/auth-bg.jpg"
            alt="Luxury car interior"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div
            className="relative z-20 p-8 md:p-12 text-white"
            style={{
              transform: `translateY(${scrollY * 0.1}px)`,
              transition: "transform 0.1s ease-out",
            }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              {mode === "login"
                ? "Welcome Back to My Ride"
                : "Join the My Ride Community"}
            </h2>
            <p className="text-lg mb-6 text-white/90">
              {mode === "login"
                ? "Sign in to access your profile, saved vehicles, and custom preferences."
                : "Create an account to save your favorite cars, get updates on new listings, and more."}
            </p>
            <div className="space-y-4">
              <div className="flex items-center">
                <div className="h-8 w-8 rounded-full bg-white/20 flex items-center justify-center mr-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <span>Premium vehicle selection</span>
              </div>
              <div className="flex items-center">
                <div className="h-8 w-8 rounded-full bg-white/20 flex items-center justify-center mr-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <span>Personalized recommendations</span>
              </div>
              <div className="flex items-center">
                <div className="h-8 w-8 rounded-full bg-white/20 flex items-center justify-center mr-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <span>Save favorite vehicles</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}