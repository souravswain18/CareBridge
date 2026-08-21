import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { APP_CONFIG } from '../config';
import { Lock, Mail, ArrowRight, User, Users } from 'lucide-react';

export const Login = () => {
  const [role, setRole] = useState('PATIENT');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password, role);
      if (role === 'PATIENT') {
        navigate('/patient-dashboard');
      } else {
        navigate('/caregiver-dashboard');
      }
    } catch (err) {
      setError('Invalid email or password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-6rem)] flex items-center justify-center px-6 py-12">
      <div className="max-w-md w-full space-y-7 bg-white/75 dark:bg-slate-900/75 backdrop-blur-xl p-10 rounded-2xl border border-white/70 dark:border-slate-800 shadow-2xl shadow-slate-900/5">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold tracking-tight text-slate-800 dark:text-white">
            Sign In
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Access your {APP_CONFIG.appName} health portal
          </p>
        </div>

        {/* Role Toggle Selector */}
        <div className="grid grid-cols-2 gap-3 p-1.5 bg-slate-200/50 dark:bg-slate-800/60 rounded-xl border border-slate-200/70 dark:border-slate-700/60">
          <button
            type="button"
            onClick={() => setRole('PATIENT')}
            className={`py-2.5 px-3 rounded-lg text-xs font-semibold flex items-center justify-center space-x-2 transition-all ${
              role === 'PATIENT'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>As Patient</span>
          </button>

          <button
            type="button"
            onClick={() => setRole('CAREGIVER')}
            className={`py-2.5 px-3 rounded-lg text-xs font-semibold flex items-center justify-center space-x-2 transition-all ${
              role === 'CAREGIVER'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>As Caregiver</span>
          </button>
        </div>

        {/* Single Clean Error Alert */}
        {error && (
          <div className="p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-xs font-semibold text-rose-700 dark:text-rose-300 text-center">
            ⚠️ {error}
          </div>
        )}

        {/* Form */}
        <form className="space-y-4" onSubmit={handleSubmit}>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 pl-1">
              Email address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Mail className="w-4 h-4" />
              </div>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={role === 'PATIENT' ? 'patient@example.com' : 'caregiver@example.com'}
                className="block w-full pl-10 pr-4 py-3 bg-white/90 dark:bg-slate-800/90 border border-slate-200/90 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-800 dark:focus:ring-white text-sm shadow-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 pl-1">
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="block w-full pl-10 pr-4 py-3 bg-white/90 dark:bg-slate-800/90 border border-slate-200/90 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-800 dark:focus:ring-white text-sm shadow-sm"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-3 flex items-center justify-center py-3.5 px-4 rounded-xl text-sm font-semibold text-white bg-slate-900 hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100 transition-all shadow-md"
          >
            {loading ? 'Authenticating...' : `Sign In as ${role === 'PATIENT' ? 'Patient' : 'Caregiver'}`}
            <ArrowRight className="ml-2 w-4 h-4" />
          </button>
        </form>

        <div className="text-center pt-2">
          <p className="text-xs text-slate-600 dark:text-slate-400">
            Don't have an account?{' '}
            <Link to="/register" className="font-semibold text-slate-900 dark:text-white hover:underline">
              Create an account
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
};
