"use client";

import { useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { getMongoDBUri } from '@/utils/apiConfig';

export default function MongoTestPage() {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);

  const testMongoConnection = async () => {
    setLoading(true);
    setError(null);
    setResults(null);
    
    try {
      const response = await fetch('/api/check-mongo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'testConnection'
        }),
      });
      
      const data = await response.json();
      setResults(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-24 pb-16 px-4">
        <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
          <div className="bg-gray-800 px-6 py-4">
            <h1 className="text-2xl font-bold text-white">MongoDB Direct Connection Test</h1>
          </div>
          
          <div className="p-6">
            <p className="mb-6 text-gray-700">
              This page tests the direct MongoDB connection without going through the backend.
              Use this to verify that your MongoDB connection string is correct and accessible from Vercel.
            </p>
            
            <div className="mb-6 p-4 bg-amber-50 border-l-4 border-amber-500 text-amber-700">
              <p className="font-bold">Connection String</p>
              <p className="font-mono text-sm break-all">{getMongoDBUri()}</p>
            </div>
            
            <div className="flex justify-center mb-8">
              <button
                onClick={testMongoConnection}
                disabled={loading}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                {loading ? 'Testing...' : 'Test MongoDB Connection'}
              </button>
            </div>
            
            {error && (
              <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6">
                <p className="font-bold">Error</p>
                <p>{error}</p>
              </div>
            )}
            
            {results && (
              <div>
                <div className={`mb-6 p-4 border-l-4 ${
                  results.status === 'success' 
                    ? 'bg-green-100 border-green-500 text-green-700' 
                    : 'bg-red-100 border-red-500 text-red-700'
                }`}>
                  <p className="font-bold">{
                    results.status === 'success' 
                      ? 'MongoDB Connection Successful!' 
                      : 'MongoDB Connection Failed'
                  }</p>
                  <p>{results.message}</p>
                </div>
                
                {results.data && (
                  <div className="mb-6">
                    <h2 className="text-xl font-semibold mb-2">Database Information</h2>
                    <pre className="bg-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
                      {JSON.stringify(results.data, null, 2)}
                    </pre>
                  </div>
                )}
              </div>
            )}
            
            <div className="mt-8 p-4 bg-gray-100 rounded-lg">
              <h2 className="text-xl font-semibold mb-4">Troubleshooting</h2>
              <ul className="list-disc pl-5 space-y-2">
                <li>Make sure your MongoDB Atlas cluster is running and accessible</li>
                <li>Check that your IP whitelist in MongoDB Atlas includes 0.0.0.0/0 (Allow All IPs)</li>
                <li>Verify the username and password in your connection string</li>
                <li>Ensure your MongoDB Atlas database is not paused or in maintenance mode</li>
              </ul>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
} 