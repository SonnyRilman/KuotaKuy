import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  username: string;
  role: 'customer' | 'admin';
}

interface AuthContextType {
  user: User | null;
  admin: User | null;
  loginCustomer: (userData: User) => void;
  loginAdmin: (adminData: User) => void;
  logoutCustomer: () => void;
  logoutAdmin: () => void;
  isCustomerAuthenticated: boolean;
  isAdminAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('kuotakuy_customer');
    return saved ? JSON.parse(saved) : null;
  });

  const [admin, setAdmin] = useState<User | null>(() => {
    const saved = localStorage.getItem('kuotakuy_admin');
    return saved ? JSON.parse(saved) : null;
  });

  const loginCustomer = (userData: User) => {
    setUser(userData);
    localStorage.setItem('kuotakuy_customer', JSON.stringify(userData));
  };

  const loginAdmin = (adminData: User) => {
    setAdmin(adminData);
    localStorage.setItem('kuotakuy_admin', JSON.stringify(adminData));
  };

  const logoutCustomer = () => {
    setUser(null);
    localStorage.removeItem('kuotakuy_customer');
  };

  const logoutAdmin = () => {
    setAdmin(null);
    localStorage.removeItem('kuotakuy_admin');
  };

  return (
    <AuthContext.Provider value={{
      user,
      admin,
      loginCustomer,
      loginAdmin,
      logoutCustomer,
      logoutAdmin,
      isCustomerAuthenticated: !!user,
      isAdminAuthenticated: !!admin,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
