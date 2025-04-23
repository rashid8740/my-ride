import '@/styles/globals.css';
import { AuthProvider } from '@/utils/AuthContext';
import { FavoritesProvider } from '@/utils/FavoritesContext';
import { Toaster } from 'react-hot-toast';

export default function MyApp({ Component, pageProps }) {
  return (
    <AuthProvider>
      <FavoritesProvider>
        <Component {...pageProps} />
        <Toaster position="bottom-right" />
      </FavoritesProvider>
    </AuthProvider>
  );
} 