"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Save, ArrowLeft, AlertTriangle, Loader } from 'lucide-react';
import apiService from '@/utils/api';

export default function AddUserPage() {
  const router = useRouter();
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    role: 'customer',
    isActive: true
  });
  
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);
  const [formErrors, setFormErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');
  
  // Handle form input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear specific field error when typing
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };
  
  // Validate form
  const validateForm = () => {
    const errors = {};
    
    if (!formData.firstName.trim()) {
      errors.firstName = 'First name is required';
    }
    
    if (!formData.lastName.trim()) {
      errors.lastName = 'Last name is required';
    }
    
    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Email is invalid';
    }
    
    if (!formData.password) {
      errors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }
    
    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    const isValid = validateForm();
    if (!isValid) return;
    
    try {
      setIsSaving(true);
      setError(null);
      setSuccessMessage('');
      
      // Create user data object
      const userData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
        role: formData.role,
        isActive: formData.isActive
      };
      
      console.log('Submit form - Creating user with data:', { ...userData, password: '****' });
      
      try {
        const response = await apiService.users.create(userData);
        console.log('User creation successful:', response);
        
        setSuccessMessage('User created successfully');
        
        // Redirect back to users list after a delay
        setTimeout(() => {
          router.push('/admin/users');
        }, 2000);
      } catch (apiError) {
        console.error('API error creating user:', apiError);
        setError(apiError.message || 'Failed to create user. Please try again.');
      }
      
    } catch (err) {
      console.error('Overall error creating user:', err);
      setError('Failed to create user. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };
  
  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center">
          <Link href="/admin/users" className="mr-4 text-gray-500 hover:text-orange-500">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">Add New User</h1>
        </div>
      </div>
      
      {/* Success Message */}
      {successMessage && (
        <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-6">
          <div className="flex">
            <div className="ml-3">
              <p className="text-sm text-green-700">{successMessage}</p>
            </div>
          </div>
        </div>
      )}
      
      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <AlertTriangle className="h-5 w-5 text-red-500" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}
      
      {/* User Form */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-6">
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                  First Name*
                </label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className={`mt-1 block w-full border ${formErrors.firstName ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm text-gray-900`}
                />
                {formErrors.firstName && (
                  <p className="mt-1 text-sm text-red-600">{formErrors.firstName}</p>
                )}
              </div>
              
              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                  Last Name*
                </label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  className={`mt-1 block w-full border ${formErrors.lastName ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm text-gray-900`}
                />
                {formErrors.lastName && (
                  <p className="mt-1 text-sm text-red-600">{formErrors.lastName}</p>
                )}
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email Address*
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`mt-1 block w-full border ${formErrors.email ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm text-gray-900`}
                />
                {formErrors.email && (
                  <p className="mt-1 text-sm text-red-600">{formErrors.email}</p>
                )}
              </div>
              
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm text-gray-900"
                />
              </div>
              
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Password*
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`mt-1 block w-full border ${formErrors.password ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm text-gray-900`}
                />
                {formErrors.password && (
                  <p className="mt-1 text-sm text-red-600">{formErrors.password}</p>
                )}
              </div>
              
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                  Confirm Password*
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={`mt-1 block w-full border ${formErrors.confirmPassword ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm text-gray-900`}
                />
                {formErrors.confirmPassword && (
                  <p className="mt-1 text-sm text-red-600">{formErrors.confirmPassword}</p>
                )}
              </div>
              
              <div>
                <label htmlFor="role" className="block text-sm font-medium text-gray-700">
                  Role*
                </label>
                <select
                  id="role"
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm text-gray-900"
                >
                  <option value="customer">Customer</option>
                  <option value="dealer">Dealer</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              
              <div className="flex items-center h-full pt-5">
                <div className="flex items-center">
                  <input
                    id="isActive"
                    name="isActive"
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={handleChange}
                    className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                  />
                  <label htmlFor="isActive" className="ml-2 block text-sm text-gray-900">
                    Active Account
                  </label>
                </div>
              </div>
            </div>
            
            <div className="mt-8 flex justify-end">
              <Link
                href="/admin/users"
                className="mr-3 inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={isSaving}
                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
              >
                {isSaving ? (
                  <>
                    <Loader className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" />
                    Creating...
                  </>
                ) : (
                  <>
                    <Save className="-ml-1 mr-2 h-4 w-4" />
                    Create User
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
} 