"use client";
import { useState } from 'react';
import { Info } from 'lucide-react';

export default function AdminInfo() {
  const [showAdminInfo, setShowAdminInfo] = useState(false);
  
  return (
    <div className="w-full max-w-md mx-auto mt-4">
      <div className="bg-white rounded-xl shadow-xl p-4">
        <button 
          onClick={() => setShowAdminInfo(!showAdminInfo)}
          className="flex items-center gap-2 text-sm text-gray-600 hover:text-orange-500"
        >
          <Info size={16} />
          {showAdminInfo ? 'Hide Admin Info' : 'Show Admin Credentials'}
        </button>
        
        {showAdminInfo && (
          <div className="mt-3 p-3 bg-gray-50 rounded-md text-sm border border-gray-200">
            <p className="font-semibold text-gray-800">Admin Login Credentials:</p>
            <div className="mt-2 grid grid-cols-[80px_1fr] gap-1">
              <span className="text-gray-600">Email:</span>
              <code className="font-mono bg-gray-100 px-1 rounded">admin@myride.com</code>
              <span className="text-gray-600">Password:</span>
              <code className="font-mono bg-gray-100 px-1 rounded">Admin@123</code>
            </div>
            <p className="mt-3 text-xs text-gray-500">These credentials are for demonstration purposes only.</p>
          </div>
        )}
      </div>
    </div>
  );
} 