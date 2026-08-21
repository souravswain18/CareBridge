import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { APP_CONFIG } from '../config';
import { 
  Sun, 
  Moon, 
  Menu, 
  X, 
  LogOut, 
  User
} from 'lucide-react';

export const Navbar = () => {
  const { theme, toggleTheme } = useTheme();
  const { user, logout, isAuthenticated } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="w-full bg-transparent">
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16">
        <div className="flex items-center justify-between h-24">
          
          {/* Brand Logo & Name */}
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white font-sans">
              {APP_CONFIG.appName}
            </span>
          </Link>

          {/* Center Clean Links */}
          <div className="hidden md:flex items-center space-x-8">
            <Link 
              to="/" 
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="text-xs font-semibold text-slate-700 hover:text-slate-950 dark:text-slate-200 dark:hover:text-white transition-colors"
            >
              Home
            </Link>
            <a 
              href="/#how-it-works" 
              className="text-xs font-semibold text-slate-700 hover:text-slate-950 dark:text-slate-200 dark:hover:text-white transition-colors"
            >
              How it works
            </a>
            <Link 
              to="/emergency/CB-7821" 
              className="text-xs font-bold text-rose-600 dark:text-rose-400 hover:underline transition-colors"
            >
              Emergency Pass
            </Link>
          </div>

          {/* Desktop Right Actions */}
          <div className="hidden md:flex items-center space-x-3">
            {isAuthenticated ? (
              <>
                <Link 
                  to={user.role === 'PATIENT' ? '/patient-dashboard' : '/caregiver-dashboard'} 
                  className="text-sm font-medium px-4 py-2 rounded-xl bg-white/80 dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200/80 dark:border-slate-700 hover:bg-white transition-colors shadow-sm"
                >
                  Dashboard
                </Link>

                <div className="flex items-center space-x-2 text-sm text-slate-700 dark:text-slate-300 px-3 py-1.5 bg-white/60 dark:bg-slate-800/60 rounded-xl border border-slate-200/60 dark:border-slate-700">
                  <User className="w-4 h-4 text-slate-500" />
                  <span className="font-semibold text-slate-900 dark:text-slate-100">{user.name}</span>
                </div>

                <button
                  onClick={handleLogout}
                  className="p-2 text-slate-500 hover:text-red-500 bg-white/60 dark:bg-slate-800/60 rounded-xl border border-slate-200/60 dark:border-slate-700 transition-colors"
                  title="Logout"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-sm font-semibold px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100 transition-all shadow-sm"
                >
                  Login
                </Link>
              </>
            )}

            {/* Dark Mode Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2.5 text-slate-700 dark:text-slate-300 bg-white/70 dark:bg-slate-800/70 hover:bg-white dark:hover:bg-slate-800 rounded-xl border border-slate-200/80 dark:border-slate-700 transition-colors"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center space-x-2">
            <button
              onClick={toggleTheme}
              className="p-2 text-slate-700 dark:text-slate-300 bg-white/70 dark:bg-slate-800/70 rounded-xl border border-slate-200 dark:border-slate-700"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-700 dark:text-slate-300 bg-white/70 dark:bg-slate-800/70 rounded-xl border border-slate-200 dark:border-slate-700"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white/95 dark:bg-slate-900/95 backdrop-blur-md px-6 pt-3 pb-6 space-y-3 border-b border-slate-200 dark:border-slate-800">
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm font-medium text-slate-800 dark:text-slate-200 py-1"
          >
            Home
          </Link>
          <a
            href="#how-it-works"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm font-medium text-slate-800 dark:text-slate-200 py-1"
          >
            How it works
          </a>
          <Link
            to="/emergency/demo-qr-token-123"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm font-medium text-slate-800 dark:text-slate-200 py-1"
          >
            Emergency Pass
          </Link>
          {isAuthenticated ? (
            <>
              <Link
                to={user.role === 'PATIENT' ? '/patient-dashboard' : '/caregiver-dashboard'}
                onClick={() => setMobileMenuOpen(false)}
                className="block text-sm font-semibold text-slate-900 dark:text-white py-1"
              >
                Dashboard
              </Link>
              <button
                onClick={() => {
                  handleLogout();
                  setMobileMenuOpen(false);
                }}
                className="w-full text-left text-sm font-medium text-red-600 dark:text-red-400 py-1"
              >
                Log Out
              </button>
            </>
          ) : (
            <div className="pt-2">
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="block w-full text-center py-2.5 text-sm font-semibold text-white bg-slate-900 dark:bg-white dark:text-slate-900 rounded-xl"
              >
                Login
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};
