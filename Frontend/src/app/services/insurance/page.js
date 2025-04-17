"use client";
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function InsuranceServicePage() {
  const router = useRouter();
  
  useEffect(() => {
    // Redirect to the main services page and scroll to insurance section
    router.replace('/services#insurance');
  }, [router]);
  
  // Show loading state while redirecting
  return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-gray-500">Redirecting to Insurance services...</p>
    </div>
  );
} 