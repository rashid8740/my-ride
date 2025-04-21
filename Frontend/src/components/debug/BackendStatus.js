"use client";
import { useState, useEffect } from 'react';
import { getApiUrl } from '@/utils/api';

export default function BackendStatus() {
  const [status, setStatus] = useState({
    loading: true,
    error: null,
    connected: false,
    backendUrl: null,
    details: null
  });

  useEffect(() => {
    async function checkBackend() {
      try {
        setStatus(prev => ({ ...prev, loading: true }));
        
        const response = await fetch('/api/health-check');
        const data = await response.json();
        
        setStatus({
          loading: false,
          error: data.status === 'error' ? data.message : null,
          connected: data.connected,
          backendUrl: data.backendUrl,
          details: data
        });
      } catch (error) {
        setStatus({
          loading: false,
          error: error.message || 'Unknown error checking backend',
          connected: false,
          backendUrl: getApiUrl(),
          details: { error: error.toString() }
        });
      }
    }
    
    checkBackend();
  }, []);

  return (
    <div className="mt-4 p-4 bg-gray-100 rounded-lg border border-gray-300">
      <h3 className="text-lg font-semibold mb-2">Backend Connectivity Status:</h3>
      
      {status.loading ? (
        <p className="text-gray-600">Checking backend connectivity...</p>
      ) : status.error ? (
        <div>
          <p className="text-red-600 font-semibold">Backend connection failed: {status.error}</p>
          <p className="text-gray-600 mt-2">Backend URL: {status.backendUrl}</p>
          <pre className="mt-2 p-2 bg-gray-200 rounded text-xs overflow-auto">
            {JSON.stringify(status.details, null, 2)}
          </pre>
        </div>
      ) : (
        <div>
          <p className="text-green-600 font-semibold">
            Backend connected successfully at: {status.backendUrl}
          </p>
          <pre className="mt-2 p-2 bg-gray-200 rounded text-xs overflow-auto">
            {JSON.stringify(status.details, null, 2)}
          </pre>
        </div>
      )}
      
      <button
        onClick={() => window.location.reload()}
        className="mt-3 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
      >
        Reload Page
      </button>
    </div>
  );
} 