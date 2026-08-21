import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('carebridge_user');
    return saved ? JSON.parse(saved) : null;
  });

  const login = (userData, token) => {
    setUser(userData);
    localStorage.setItem('carebridge_user', JSON.stringify(userData));
    localStorage.setItem('carebridge_token', token);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('carebridge_user');
    localStorage.removeItem('carebridge_token');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
