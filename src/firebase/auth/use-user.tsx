'use client';

import { useEffect, useState } from 'react';
import { User, onAuthStateChanged, signInAnonymously } from 'firebase/auth';
import { useAuth } from '../provider';

export function useUser() {
  const auth = useAuth();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    return onAuthStateChanged(auth, (user) => {
      if (!user) {
        signInAnonymously(auth);
      }
      setUser(user);
      setLoading(false);
    });
  }, [auth]);

  return { user, loading };
}
