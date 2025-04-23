import { useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';

export default function Custom404() {
  const router = useRouter();

  // Redirect to home page after 5 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      router.push('/');
    }, 5000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 text-center">
        <div>
          <h1 className="text-9xl font-extrabold text-gray-900">404</h1>
          <h2 className="mt-6 text-3xl font-bold text-gray-900">Page Not Found</h2>
          <p className="mt-2 text-base text-gray-500">
            The page you're looking for doesn't exist or has been moved.
          </p>
          <p className="mt-4 text-sm text-gray-500">
            Redirecting to home page in 5 seconds...
          </p>
        </div>
        <div className="mt-8">
          <Link href="/" className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500">
            Go to Home Page
          </Link>
        </div>
      </div>
    </div>
  );
} 