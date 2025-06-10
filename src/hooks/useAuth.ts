import { useState, useContext } from 'react';
import { AuthContext } from '@/App';

type User = {
  type: 'teacher' | 'parent' | 'student';
  name: string;
};

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  const [user, setUser] = useState<User | null>(null);

  const login = (userData: User) => {
    setUser(userData);
    context.setIsAuthenticated(true);
  };

  const logout = () => {
    setUser(null);
    context.setIsAuthenticated(false);
  };

  return {
    isAuthenticated: context.isAuthenticated,
    user,
    login,
    logout
  };
}