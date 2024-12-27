import useTokenStore from '@/lib/store';
import { useState, useEffect } from 'react';

export function useAuth() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const {token} = useTokenStore()

  useEffect(() => {
    
    setIsLoggedIn(!!token);
  }, []);

  return { isLoggedIn };
}