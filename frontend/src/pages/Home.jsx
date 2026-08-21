import React from 'react';
import { Link } from 'react-router-dom';
import { 
  HeartPulse, 
  ShieldCheck, 
  Clock, 
  QrCode, 
  ArrowRight, 
  Users, 
  Activity, 
  Sparkles,
  Zap
} from 'lucide-react';

export const Home = () => {
  return (
    <div className="space-y-24 py-12 px-6 sm:px-10 lg:px-16 max-w-7xl mx-auto">
      
      {/* 🌟 HERO SECTION */}
      <section className="text-center space-y-8 max-w-4xl mx-auto pt-6">
        
        <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-2xl bg-white/80 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 shadow-sm backdrop-blur-md">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
          <span className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider font-mono">
            Continuous Post-Hospital Recovery &amp; Elderly Care
          </span>
        </div>

        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-slate-900 dark:text-white tracking-tight leading-[1.1]">
          Bridging the gap between <br className="hidden sm:block" />
          <span className="bg-gradient-to-r from-teal-600 via-indigo-600 to-rose-600 bg-clip-text text-transparent">
            Discharge &amp; Full Recovery.
          </span>
        </h1>

        <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
          The collaborative companion for elderly patients and remote family caregivers. Zero wearable hardware required — pure software intelligence with real-time 20-minute safety escalation.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <Link
            to="/register"
            className="w-full sm:w-auto px-8 py-4 rounded-2xl font-bold text-sm bg-slate-900 text-white hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100 shadow-xl shadow-slate-900/10 transition-all flex items-center justify-center space-x-2 group"
          >
            <span>Get Started with CareBridge</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>

          <Link
            to="/emergency"
            className="w-full sm:w-auto px-8 py-4 rounded-2xl font-bold text-sm bg-rose-50 text-rose-600 hover:bg-rose-100 dark:bg-rose-950/40 dark:text-rose-300 border border-rose-200 dark:border-rose-800/80 transition-all flex items-center justify-center space-x-2"
          >
            <QrCode className="w-4 h-4" />
            <span>View Emergency Health Pass</span>
          </Link>
        </div>

      </section>

      {/* 3 CORE PILLARS */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        <div className="p-8 rounded-3xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-white/80 dark:border-slate-800 shadow-xl shadow-slate-900/5 space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 flex items-center justify-center">
            <Clock className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">20-Minute Safety Grace</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            Medication reminders grant a 20-min grace window. If unacknowledged, automated multi-channel escalation immediately notifies family guardians.
          </p>
        </div>

        <div className="p-8 rounded-3xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-white/80 dark:border-slate-800 shadow-xl shadow-slate-900/5 space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-teal-50 dark:bg-teal-950/50 text-teal-600 dark:text-teal-400 flex items-center justify-center">
            <Activity className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">Remote Telemetry Feed</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            Live Recharts curves for Blood Pressure &amp; Blood Sugar with automatic clinical spike reference lines visible to remote caregivers.
          </p>
        </div>

        <div className="p-8 rounded-3xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-white/80 dark:border-slate-800 shadow-xl shadow-slate-900/5 space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 flex items-center justify-center">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">Zero-Auth Emergency Pass</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            Scannable QR pass giving emergency responders instantaneous access to blood group, severe allergies, and nearby hospital ICU triage.
          </p>
        </div>

      </section>

      {/* 🧭 HOW IT WORKS SECTION */}
      <section id="how-it-works" className="space-y-12 pt-8">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
            Care Protocol
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
            How CareBridge Protects Recovery
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Simple 3-step continuous cycle designed specifically for post-op mobility and elderly independence.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          <div className="p-6 rounded-3xl bg-white/60 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 space-y-3">
            <div className="text-xs font-mono font-bold text-indigo-600 dark:text-indigo-400">STEP 01</div>
            <h4 className="text-base font-bold text-slate-900 dark:text-white">Profile &amp; Doc Ingestion</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Patient or Caregiver creates profile. Upload discharge summaries or prescriptions to extract clinical AI summaries.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-white/60 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 space-y-3">
            <div className="text-xs font-mono font-bold text-indigo-600 dark:text-indigo-400">STEP 02</div>
            <h4 className="text-base font-bold text-slate-900 dark:text-white">Shared Routine Adherence</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              100+ Medicine master catalog search. Patient marks single-tap checkmarks. Caregiver monitors telemetry remotely.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-white/60 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 space-y-3">
            <div className="text-xs font-mono font-bold text-indigo-600 dark:text-indigo-400">STEP 03</div>
            <h4 className="text-base font-bold text-slate-900 dark:text-white">20-Min Auto Escalation</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              If a dose is missed past 20 minutes, Crimson escalation triggers with 1-click WhatsApp Web, Phone Link, and loud audio alerts.
            </p>
          </div>

        </div>
      </section>

      {/* FOOTER */}
      <footer className="pt-12 border-t border-slate-200/60 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
        <p>© 2026 CareBridge • Post-Hospital Recovery &amp; Active Elderly Care Companion</p>
        <div className="flex items-center space-x-6">
          <Link to="/login" className="hover:text-slate-900 dark:hover:text-white">Sign In</Link>
          <Link to="/register" className="hover:text-slate-900 dark:hover:text-white">Register</Link>
          <Link to="/emergency/CB-7821" className="text-rose-600 dark:text-rose-400 font-semibold hover:underline">Emergency Health Pass</Link>
        </div>
      </footer>

    </div>
  );
};
