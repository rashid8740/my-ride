"use client";
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function HybridCategoryPage() {
  const router = useRouter();
  
  useEffect(() => {
    // Redirect to the main inventory page with Hybrid filter applied
    router.replace('/inventory?category=hybrid');
  }, [router]);
  
  // Show loading state while redirecting
  return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-gray-500">Redirecting to Hybrid inventory...</p>
    </div>
  );
} 