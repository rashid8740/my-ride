"use client";

import { useState, useEffect } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

export default function DiagnosticsPage() {
  const [loading, setLoading] = useState(true);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function checkBackendHealth() {
      try {
        setLoading(true);
        const response = await fetch('/api/check-backend');
        const data = await response.json();
        setResults(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    checkBackendHealth();
  }, []);

  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-24 pb-16 px-4">
        <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
          <div className="bg-gray-800 px-6 py-4">
            <h1 className="text-2xl font-bold text-white">Backend Connectivity Diagnostics</h1>
          </div>
          
          <div className="p-6">
            {loading ? (
              <div className="text-center py-8">
                <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-orange-500 border-r-transparent"></div>
                <p className="mt-4 text-gray-600">Checking backend connectivity...</p>
              </div>
            ) : error ? (
              <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6">
                <p className="font-bold">Error</p>
                <p>{error}</p>
              </div>
            ) : (
              <div>
                <div className={`mb-6 p-4 border-l-4 ${results.status === 'success' ? 'bg-green-100 border-green-500 text-green-700' : 'bg-red-100 border-red-500 text-red-700'}`}>
                  <p className="font-bold">{results.status === 'success' ? 'Backend Connection Successful!' : 'Backend Connection Failed'}</p>
                  <p>{results.message}</p>
                </div>
                
                <h2 className="text-xl font-semibold mb-4">Connection Details</h2>
                
                <div className="bg-gray-100 p-4 rounded-lg mb-6 overflow-x-auto">
                  <p><strong>Backend URL:</strong> {results.backendUrl}</p>
                  <p><strong>Environment:</strong> {results.environment.nodeEnv}</p>
                  <p><strong>NEXT_PUBLIC_API_URL configured:</strong> {results.environment.hasApiUrlConfig ? 'Yes' : 'No'}</p>
                </div>
                
                {results.details && (
                  <div className="mb-6">
                    <h2 className="text-xl font-semibold mb-2">Backend Response Details</h2>
                    <pre className="bg-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
                      {JSON.stringify(results.details, null, 2)}
                    </pre>
                  </div>
                )}
                
                <h2 className="text-xl font-semibold mb-4">Troubleshooting Steps</h2>
                
                <ul className="list-disc pl-5 mb-6 space-y-2">
                  <li>Ensure your backend server is running and publicly accessible</li>
                  <li>Check that the <code className="bg-gray-100 px-2 py-1 rounded">NEXT_PUBLIC_API_URL</code> environment variable is set correctly in Vercel</li>
                  <li>Verify that your backend has CORS configured to allow requests from your frontend domain</li>
                  <li>Check that your MongoDB connection is working on the backend</li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
} 