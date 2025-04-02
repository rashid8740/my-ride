export function getAuthToken(req) {
  // For API Routes, get token from cookie or authorization header
  if (req) {
    // Check cookies first
    const cookies = req.cookies || {};
    if (cookies.token) {
      return cookies.token;
    }
    
    // Then check authorization header
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      return authHeader.substring(7);
    }
    
    return null;
  }
  
  // For client-side, get token from localStorage
  if (typeof window !== 'undefined') {
    return localStorage.getItem('token');
  }
  
  return null;
} 