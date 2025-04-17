"use client";
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function MaintenanceServicePage() {
  const router = useRouter();
  
  useEffect(() => {
    // Redirect to the main services page and scroll to maintenance section
    router.replace('/services#maintenance');
  }, [router]);
  
  // Show loading state while redirecting
  return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-gray-500">Redirecting to Maintenance services...</p>
    </div>
  );
} 