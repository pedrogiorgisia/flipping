
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface AuthContextType {
  userId: string | null;
  login: (userId: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [userId, setUserId] = useState<string | null>(() => {
    return sessionStorage.getItem('userId');
  });
  const navigate = useNavigate();

  useEffect(() => {
    const checkSession = () => {
      const lastActivity = sessionStorage.getItem('lastActivity');
      if (lastActivity && Date.now() - parseInt(lastActivity) > 3600000) { // 1 hour
        logout();
      }
    };

    const interval = setInterval(checkSession, 60000); // Check every minute
    window.addEventListener('mousemove', updateLastActivity);
    window.addEventListener('keypress', updateLastActivity);

    return () => {
      clearInterval(interval);
      window.removeEventListener('mousemove', updateLastActivity);
      window.removeEventListener('keypress', updateLastActivity);
    };
  }, []);

  const updateLastActivity = () => {
    sessionStorage.setItem('lastActivity', Date.now().toString());
  };

  const login = (newUserId: string) => {
    setUserId(newUserId);
    sessionStorage.setItem('userId', newUserId);
    updateLastActivity();
  };

  const logout = () => {
    setUserId(null);
    sessionStorage.removeItem('userId');
    sessionStorage.removeItem('lastActivity');
    navigate('/login');
  };

  return (
    <AuthContext.Provider value={{ userId, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
