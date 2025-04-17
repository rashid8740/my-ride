"use client";
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function FinancingServicePage() {
  const router = useRouter();
  
  useEffect(() => {
    // Redirect to the main services page and scroll to financing section
    router.replace('/services#financing');
  }, [router]);
  
  // Show loading state while redirecting
  return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-gray-500">Redirecting to Financing services...</p>
    </div>
  );
} 