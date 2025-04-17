"use client";
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function LuxuryCategoryPage() {
  const router = useRouter();
  
  useEffect(() => {
    // Redirect to the main inventory page with Luxury filter applied
    router.replace('/inventory?category=luxury');
  }, [router]);
  
  // Show loading state while redirecting
  return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-gray-500">Redirecting to Luxury inventory...</p>
    </div>
  );
} 