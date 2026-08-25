import React, { useState, useEffect } from 'react';
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
  User,
  MoreVertical,
  LayoutDashboard,
  Settings,
  ShieldCheck,
  Check
} from 'lucide-react';

export const Navbar = () => {
  const { theme, toggleTheme } = useTheme();
  const { user, logout, updateUserProfile, isAuthenticated } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showEditAccountModal, setShowEditAccountModal] = useState(false);
  
  // Edit Account Form States
  const [editName, setEditName] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editPassword, setEditPassword] = useState('');
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    if (user) {
      setEditName(user.name || '');
      setEditPhone(user.phone || '');
    }
  }, [user]);

  const handleSaveAccount = (e) => {
    e.preventDefault();
    if (!editName.trim()) return;

    const updates = {
      name: editName.trim(),
      phone: editPhone.trim()
    };
    if (editPassword.trim()) {
      updates.password = editPassword.trim();
    }

    updateUserProfile(updates);
    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
      setShowEditAccountModal(false);
      setEditPassword('');
    }, 1200);
  };

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
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 rounded-2xl overflow-hidden shadow-md group-hover:scale-105 transition-transform flex items-center justify-center bg-slate-900 border border-slate-700/50">
              <img src="/logo.png" alt="Nivaan Logo" className="w-full h-full object-cover" />
            </div>
            <span className="text-2xl font-black tracking-tight text-slate-900 dark:text-white font-sans">
              {APP_CONFIG.appName}
            </span>
          </Link>

          {/* Center Clean Links (Bigger & Clearer) */}
          <div className="hidden md:flex items-center space-x-10">
            <Link 
              to="/" 
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="text-sm font-bold text-slate-800 hover:text-slate-950 dark:text-slate-200 dark:hover:text-white transition-colors"
            >
              Home
            </Link>
            <a 
              href="/#how-it-works" 
              className="text-sm font-bold text-slate-800 hover:text-slate-950 dark:text-slate-200 dark:hover:text-white transition-colors"
            >
              How it works
            </a>
            <Link 
              to="/emergency/CB-7821" 
              className="text-sm font-bold text-slate-800 hover:text-rose-600 dark:text-slate-200 dark:hover:text-rose-400 transition-colors"
            >
              Emergency Pass
            </Link>
          </div>

          {/* Desktop Right Actions: Sleek 3-Dots Menu */}
          <div className="hidden md:flex items-center space-x-3 relative">
            {isAuthenticated ? (
              <div className="relative">
                {/* 3-Dots Trigger Button */}
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center space-x-2 px-3.5 py-2 rounded-2xl bg-white/80 dark:bg-slate-800/80 hover:bg-white dark:hover:bg-slate-800 border border-slate-200/80 dark:border-slate-700 shadow-sm transition-all text-slate-800 dark:text-slate-200"
                  aria-label="User Options Menu"
                >
                  <div className="w-6 h-6 rounded-full bg-slate-900 text-white dark:bg-white dark:text-slate-900 flex items-center justify-center text-xs font-bold uppercase">
                    {user?.name ? user.name[0] : 'U'}
                  </div>
                  <span className="text-xs font-bold text-slate-900 dark:text-white max-w-[100px] truncate">
                    {user.name}
                  </span>
                  <MoreVertical className="w-4 h-4 text-slate-500" />
                </button>

                {/* Dropdown Menu Modal */}
                {dropdownOpen && (
                  <>
                    <div 
                      className="fixed inset-0 z-40" 
                      onClick={() => setDropdownOpen(false)} 
                    />
                    <div className="absolute right-0 mt-2 w-56 p-2 rounded-2xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-2xl border border-slate-200/80 dark:border-slate-800 shadow-2xl z-50 space-y-1 animate-in fade-in slide-in-from-top-2 duration-150">
                      
                      {/* User Info Header */}
                      <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-800/80">
                        <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                          {user.name}
                        </p>
                        <span className="text-[10px] font-mono text-indigo-600 dark:text-indigo-400 font-semibold uppercase">
                          Role: {user.role || 'Patient'}
                        </span>
                      </div>

                      {/* Go to Dashboard */}
                      <Link
                        to={user.role === 'PATIENT' ? '/patient-dashboard' : '/caregiver-dashboard'}
                        onClick={() => setDropdownOpen(false)}
                        className="w-full flex items-center space-x-2 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                      >
                        <LayoutDashboard className="w-4 h-4 text-slate-500" />
                        <span>Go to Dashboard</span>
                      </Link>

                      {/* ⚙️ Edit Account */}
                      <button
                        onClick={() => {
                          setDropdownOpen(false);
                          setShowEditAccountModal(true);
                        }}
                        className="w-full flex items-center space-x-2 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-left"
                      >
                        <Settings className="w-4 h-4 text-slate-500" />
                        <span>Edit Account</span>
                      </button>

                      {/* Dark / Light Mode Toggle */}
                      <button
                        onClick={() => {
                          toggleTheme();
                        }}
                        className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                      >
                        <div className="flex items-center space-x-2">
                          {theme === 'dark' ? (
                            <Sun className="w-4 h-4 text-amber-400" />
                          ) : (
                            <Moon className="w-4 h-4 text-slate-500" />
                          )}
                          <span>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
                        </div>
                        <span className="text-[10px] font-mono text-slate-400 uppercase">{theme}</span>
                      </button>

                      {/* Logout */}
                      <button
                        onClick={() => {
                          setDropdownOpen(false);
                          handleLogout();
                        }}
                        className="w-full flex items-center space-x-2 px-3 py-2 rounded-xl text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Logout</span>
                      </button>

                    </div>
                  </>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  to="/login"
                  className="text-xs font-bold px-5 py-2.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100 transition-all shadow-sm"
                >
                  Sign In
                </Link>

                <button
                  onClick={toggleTheme}
                  className="p-2.5 text-slate-700 dark:text-slate-300 bg-white/70 dark:bg-slate-800/70 hover:bg-white dark:hover:bg-slate-800 rounded-2xl border border-slate-200/80 dark:border-slate-700 transition-colors shadow-sm"
                  aria-label="Toggle theme"
                >
                  {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
                </button>
              </div>
            )}
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

      {/* ⚙️ Edit Account / User Profile Modal */}
      {showEditAccountModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl max-w-md w-full border border-slate-200 dark:border-slate-800 shadow-2xl space-y-6">
            
            <div className="flex justify-between items-center pb-2 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center space-x-2">
                <div className="p-2 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 rounded-xl">
                  <Settings className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    Account Settings
                  </h3>
                  <p className="text-[11px] text-slate-500">Update your credentials &amp; contact info</p>
                </div>
              </div>

              <button 
                onClick={() => setShowEditAccountModal(false)} 
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {saveSuccess ? (
              <div className="p-6 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-center space-y-2">
                <div className="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center mx-auto shadow-sm">
                  <Check className="w-5 h-5" />
                </div>
                <h4 className="text-sm font-bold text-emerald-900 dark:text-emerald-200">
                  Profile Updated Successfully!
                </h4>
                <p className="text-xs text-emerald-700 dark:text-emerald-400">
                  Your new account details have been saved.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSaveAccount} className="space-y-4 text-left">
                
                {/* Full Name */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    placeholder="Enter your full name"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-slate-800"
                  />
                </div>

                {/* Registered Email (Read-Only) */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Email Address <span className="text-[10px] text-slate-400">(Account ID)</span>
                  </label>
                  <input
                    type="email"
                    disabled
                    value={user?.email || ''}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-xs text-slate-500 dark:text-slate-400 cursor-not-allowed"
                  />
                </div>

                {/* Phone Number */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Phone Number <span className="text-[10px] text-slate-400">(For WhatsApp &amp; Emergency)</span>
                  </label>
                  <input
                    type="tel"
                    value={editPhone}
                    onChange={(e) => setEditPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-slate-800"
                  />
                </div>

                {/* Change Password (Optional) */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    New Password <span className="text-[10px] text-slate-400">(Leave blank to keep unchanged)</span>
                  </label>
                  <input
                    type="password"
                    value={editPassword}
                    onChange={(e) => setEditPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-slate-800"
                  />
                </div>

                <div className="flex space-x-3 pt-3">
                  <button
                    type="button"
                    onClick={() => setShowEditAccountModal(false)}
                    className="flex-1 py-2.5 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2.5 rounded-xl text-xs font-bold text-white bg-slate-900 dark:bg-white dark:text-slate-900 shadow-md hover:bg-slate-800 transition-all"
                  >
                    Save Changes
                  </button>
                </div>

              </form>
            )}

          </div>
        </div>
      )}

    </nav>
  );
};
