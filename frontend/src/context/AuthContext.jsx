import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('carebridge_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [isAuthenticated, setIsAuthenticated] = useState(!!user);

  const login = async (email, password, role) => {
    const trimmedEmail = email.trim().toLowerCase();
    const registeredUsers = JSON.parse(localStorage.getItem('carebridge_registered_users') || '[]');
    const existingIndex = registeredUsers.findIndex(u => u.email.toLowerCase() === trimmedEmail);

    if (existingIndex !== -1) {
      const existingUser = registeredUsers[existingIndex];
      // If password does not match
      if (existingUser.password && existingUser.password !== password) {
        throw new Error('Incorrect password. Please enter the correct password.');
      }
      
      const loggedUser = {
        ...existingUser,
        role: role || existingUser.role
      };
      
      setUser(loggedUser);
      setIsAuthenticated(true);
      localStorage.setItem('carebridge_user', JSON.stringify(loggedUser));
      return loggedUser;
    }

    // New User First-Time: Auto-save password and create session
    const newUser = {
      id: Date.now(),
      name: trimmedEmail.split('@')[0],
      email: trimmedEmail,
      password: password,
      role: role || 'PATIENT'
    };

    registeredUsers.push(newUser);
    localStorage.setItem('carebridge_registered_users', JSON.stringify(registeredUsers));

    setUser(newUser);
    setIsAuthenticated(true);
    localStorage.setItem('carebridge_user', JSON.stringify(newUser));
    return newUser;
  };

  const register = async (userData) => {
    const registeredUsers = JSON.parse(localStorage.getItem('carebridge_registered_users') || '[]');
    const alreadyExists = registeredUsers.some(u => u.email.toLowerCase() === userData.email.toLowerCase());

    if (alreadyExists) {
      throw new Error('An account with this email already exists. Please Sign In.');
    }

    const newUser = {
      ...userData,
      id: Date.now()
    };

    registeredUsers.push(newUser);
    localStorage.setItem('carebridge_registered_users', JSON.stringify(registeredUsers));

    setUser(newUser);
    setIsAuthenticated(true);
    localStorage.setItem('carebridge_user', JSON.stringify(newUser));
    return newUser;
  };

  const updateUserProfile = (updatedFields) => {
    const updatedUser = {
      ...user,
      ...updatedFields
    };

    setUser(updatedUser);
    localStorage.setItem('carebridge_user', JSON.stringify(updatedUser));

    // Also update in registered users database
    const registeredUsers = JSON.parse(localStorage.getItem('carebridge_registered_users') || '[]');
    const userIndex = registeredUsers.findIndex(u => u.email.toLowerCase() === user.email.toLowerCase());
    if (userIndex !== -1) {
      registeredUsers[userIndex] = {
        ...registeredUsers[userIndex],
        ...updatedFields
      };
      localStorage.setItem('carebridge_registered_users', JSON.stringify(registeredUsers));
    }

    return updatedUser;
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('carebridge_user');
    localStorage.removeItem('carebridge_token');
  };

  return (
    <AuthContext.Provider value={{ user, login, register, updateUserProfile, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
