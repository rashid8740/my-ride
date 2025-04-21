"use client";
import { useState, useEffect } from 'react';

export default function DebugInfo() {
  const [showInfo, setShowInfo] = useState(false);
  const [envInfo, setEnvInfo] = useState(null);
  const [backendHealth, setBackendHealth] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Only show in production environments
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    // Check if we're in production and if debug param is present
    const isProduction = process.env.NODE_ENV === 'production';
    const hasDebugParam = new URLSearchParams(window.location.search).has('debug');
    
    // Only render in production OR when specifically requested
    setShouldRender(isProduction || hasDebugParam);
    
    // Show the info immediately if debug param is present
    setShowInfo(hasDebugParam);
    
    // Only fetch data if we should render
    if (isProduction || hasDebugParam) {
      fetchDebugData();
    }
  }, []);
  
  async function fetchDebugData() {
    try {
      // Get environment variables
      const envResponse = await fetch('/api/environment');
      const envData = await envResponse.json();
      setEnvInfo(envData);
      
      // Check backend health
      const healthResponse = await fetch('/api/backend-check');
      const healthData = await healthResponse.json();
      setBackendHealth(healthData);
    } catch (error) {
      console.error('Error fetching debug info:', error);
    } finally {
      setIsLoading(false);
    }
  }
  
  // Don't render anything if not needed
  if (!shouldRender) {
    return null;
  }

  if (!showInfo) {
    return (
      <button 
        onClick={() => setShowInfo(true)}
        className="bg-gray-800 text-white text-xs p-2 fixed bottom-4 right-4 rounded-md opacity-50 hover:opacity-100 z-50"
      >
        Show Debug Info
      </button>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 bg-white shadow-lg border border-gray-200 rounded-lg p-4 max-w-md max-h-[80vh] overflow-auto z-50 text-xs">
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-bold text-sm">Debug Information</h3>
        <button 
          onClick={() => setShowInfo(false)}
          className="text-gray-500 hover:text-gray-700"
        >
          Close
        </button>
      </div>
      
      {isLoading ? (
        <p>Loading debug info...</p>
      ) : (
        <div className="space-y-4">
          <div>
            <h4 className="font-semibold mb-1">Environment:</h4>
            <pre className="bg-gray-100 p-2 rounded overflow-auto">
              {JSON.stringify(envInfo, null, 2)}
            </pre>
          </div>
          
          <div>
            <h4 className="font-semibold mb-1">Backend Health:</h4>
            <pre className="bg-gray-100 p-2 rounded overflow-auto">
              {JSON.stringify(backendHealth, null, 2)}
            </pre>
          </div>
          
          <div className="pt-2 border-t border-gray-200">
            <p className="text-xs text-gray-500">
              If backend URL is incorrect, try adding NEXT_PUBLIC_API_URL=https://my-ride-backend-tau.vercel.app
              to your Vercel environment variables.
            </p>
          </div>
        </div>
      )}
    </div>
  );
} 