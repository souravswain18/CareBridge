import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { APP_CONFIG } from '../config';
import { Lock, Mail, User, Phone, ArrowRight } from 'lucide-react';

export const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState('PATIENT');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await register({
        name,
        email,
        password,
        phone,
        role
      });

      if (role === 'PATIENT') {
        navigate('/patient-dashboard');
      } else {
        navigate('/caregiver-dashboard');
      }
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-6rem)] flex items-center justify-center px-6 py-12">
      <div className="max-w-md w-full space-y-6 bg-white/75 dark:bg-slate-900/75 backdrop-blur-xl p-10 rounded-2xl border border-white/70 dark:border-slate-800 shadow-2xl shadow-slate-900/5">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold tracking-tight text-slate-800 dark:text-white">
            Create an account
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Join {APP_CONFIG.appName} to start your recovery plan
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="p-3.5 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/60 rounded-xl text-xs font-semibold text-rose-700 dark:text-rose-400">
            ⚠️ {error}
          </div>
        )}

        {/* Form */}
        <form className="space-y-4" onSubmit={handleSubmit}>
          
          {/* Role Selection */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2 pl-1">
              Select your role
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setRole('PATIENT')}
                className={`py-3 px-3 rounded-xl border text-center transition-all ${
                  role === 'PATIENT'
                    ? 'border-slate-800 bg-slate-800 text-white dark:border-white dark:bg-white dark:text-slate-900 font-semibold shadow-sm'
                    : 'border-slate-200/80 dark:border-slate-700 bg-white/60 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300'
                }`}
              >
                <div className="text-sm font-semibold">Patient</div>
                <div className={`text-xs mt-0.5 ${role === 'PATIENT' ? 'text-slate-300 dark:text-slate-600' : 'text-slate-500'}`}>Recovering</div>
              </button>

              <button
                type="button"
                onClick={() => setRole('CAREGIVER')}
                className={`py-3 px-3 rounded-xl border text-center transition-all ${
                  role === 'CAREGIVER'
                    ? 'border-slate-800 bg-slate-800 text-white dark:border-white dark:bg-white dark:text-slate-900 font-semibold shadow-sm'
                    : 'border-slate-200/80 dark:border-slate-700 bg-white/60 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300'
                }`}
              >
                <div className="text-sm font-semibold">Caregiver</div>
                <div className={`text-xs mt-0.5 ${role === 'CAREGIVER' ? 'text-slate-300 dark:text-slate-600' : 'text-slate-500'}`}>Family member</div>
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 pl-1">
              Full name
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <User className="w-4 h-4" />
              </div>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ramesh Kumar"
                className="block w-full pl-10 pr-4 py-2.5 bg-white/90 dark:bg-slate-800/90 border border-slate-200/90 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-800 dark:focus:ring-white text-sm shadow-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 pl-1">
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
                placeholder="name@example.com"
                className="block w-full pl-10 pr-4 py-2.5 bg-white/90 dark:bg-slate-800/90 border border-slate-200/90 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-800 dark:focus:ring-white text-sm shadow-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 pl-1">
              Phone number
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Phone className="w-4 h-4" />
              </div>
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 98765 43210"
                className="block w-full pl-10 pr-4 py-2.5 bg-white/90 dark:bg-slate-800/90 border border-slate-200/90 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-800 dark:focus:ring-white text-sm shadow-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 pl-1">
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
                className="block w-full pl-10 pr-4 py-2.5 bg-white/90 dark:bg-slate-800/90 border border-slate-200/90 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-800 dark:focus:ring-white text-sm shadow-sm"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 flex items-center justify-center py-3.5 px-4 text-sm font-semibold text-white bg-slate-800 hover:bg-slate-900 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100 rounded-xl transition-all shadow-md"
          >
            Create Account
            <ArrowRight className="ml-2 w-4 h-4" />
          </button>
        </form>

        <div className="text-center pt-1">
          <p className="text-xs text-slate-600 dark:text-slate-400">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-slate-900 dark:text-white hover:underline">
              Sign in
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
};
