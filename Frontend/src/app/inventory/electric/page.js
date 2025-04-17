"use client";
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function ElectricCategoryPage() {
  const router = useRouter();
  
  useEffect(() => {
    // Redirect to the main inventory page with Electric filter applied
    router.replace('/inventory?category=electric');
  }, [router]);
  
  // Show loading state while redirecting
  return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-gray-500">Redirecting to Electric inventory...</p>
    </div>
  );
} 