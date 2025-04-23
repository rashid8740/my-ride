import '@/styles/globals.css';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { Toaster } from 'react-hot-toast';

// Loading indicator for page transitions
function LoadingIndicator() {
  return (
    <div className="fixed top-0 left-0 right-0 z-50 h-1 bg-gradient-to-r from-orange-500 to-red-500 animate-pulse"></div>
  );
}

export default function App({ Component, pageProps }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  // Set up routing change handlers
  useEffect(() => {
    const handleStart = () => setLoading(true);
    const handleComplete = () => setLoading(false);

    router.events.on('routeChangeStart', handleStart);
    router.events.on('routeChangeComplete', handleComplete);
    router.events.on('routeChangeError', handleComplete);

    return () => {
      router.events.off('routeChangeStart', handleStart);
      router.events.off('routeChangeComplete', handleComplete);
      router.events.off('routeChangeError', handleComplete);
    };
  }, [router]);

  return (
    <>
      {loading && <LoadingIndicator />}
      <Toaster position="top-center" />
      <Component {...pageProps} />
    </>
  );
} 