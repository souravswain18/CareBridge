import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { MedicationChecklist } from '../components/MedicationChecklist';
import { VitalsTelemetry } from '../components/VitalsTelemetry';
import { RecoveryTimeline } from '../components/RecoveryTimeline';
import { MedicalLocker } from '../components/MedicalLocker';
import { 
  User, 
  QrCode, 
  X
} from 'lucide-react';

export const PatientDashboard = () => {
  const { user } = useAuth();
  const [showQrModal, setShowQrModal] = useState(false);

  // Dynamic Reminders State (Saved in LocalStorage per user)
  const [reminders, setReminders] = useState(() => {
    const saved = localStorage.getItem(`carebridge_reminders_${user?.email}`);
    return saved ? JSON.parse(saved) : [];
  });

  // Dynamic Vitals Data (Saved in LocalStorage per user)
  const [vitalsData, setVitalsData] = useState(() => {
    const saved = localStorage.getItem(`carebridge_vitals_${user?.email}`);
    return saved ? JSON.parse(saved) : [];
  });

  // Dynamic Milestones Data
  const [milestones, setMilestones] = useState(() => {
    const saved = localStorage.getItem(`carebridge_milestones_${user?.email}`);
    return saved ? JSON.parse(saved) : [
      {
        dayTag: 'DAY 0',
        title: 'Discharge & Home Recovery Start',
        description: 'Initial recovery profile created. Start your daily prescribed routine.',
        completed: true
      }
    ];
  });

  useEffect(() => {
    if (user?.email) {
      localStorage.setItem(`carebridge_reminders_${user.email}`, JSON.stringify(reminders));
    }
  }, [reminders, user]);

  useEffect(() => {
    if (user?.email) {
      localStorage.setItem(`carebridge_vitals_${user.email}`, JSON.stringify(vitalsData));
    }
  }, [vitalsData, user]);

  const handleToggleComplete = (id) => {
    setReminders(prev =>
      prev.map(r => (r.id === id ? { ...r, isCompleted: !r.isCompleted } : r))
    );
  };

  const handleAddReminder = (newReminder) => {
    setReminders(prev => [newReminder, ...prev]);
  };

  const handleDeleteReminder = (id) => {
    setReminders(prev => prev.filter(r => r.id !== id));
  };

  const handleLogVital = (newVital) => {
    setVitalsData(prev => [...prev, newVital]);
  };

  return (
    <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 py-10 space-y-8">
      
      {/* Patient Header & Quick Snapshot */}
      <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl p-6 sm:p-8 rounded-3xl border border-white/80 dark:border-slate-800 shadow-xl shadow-slate-900/5 flex flex-col md:flex-row md:items-center justify-between gap-6">
        
        <div className="flex items-center space-x-4">
          <div className="w-14 h-14 rounded-2xl bg-slate-900 text-white dark:bg-white dark:text-slate-900 flex items-center justify-center font-bold text-xl shadow-md">
            {user?.name?.charAt(0).toUpperCase() || 'P'}
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                {user?.name}
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                Active Profile
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-mono">
              Patient Email: {user?.email} • Link Code: CB-{user?.id ? String(user.id).slice(-4) : '7821'}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => setShowQrModal(true)}
            className="px-5 py-2.5 rounded-xl text-xs font-semibold text-slate-800 dark:text-slate-200 bg-white/90 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-white transition-all shadow-sm flex items-center space-x-2"
          >
            <QrCode className="w-4 h-4 text-slate-700 dark:text-slate-300" />
            <span>Emergency QR Pass</span>
          </button>
        </div>

      </div>

      {/* Main Grid: 2-Column Responsive Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column (7 Cols): Active Tasks & Vitals Telemetry */}
        <div className="lg:col-span-7 space-y-8">
          <MedicationChecklist
            reminders={reminders}
            onToggleComplete={handleToggleComplete}
            onAddReminder={handleAddReminder}
            onDeleteReminder={handleDeleteReminder}
          />

          <VitalsTelemetry
            vitalsData={vitalsData}
            onLogVital={handleLogVital}
          />
        </div>

        {/* Right Column (5 Cols): Recovery Milestones & Medical Locker */}
        <div className="lg:col-span-5 space-y-8">
          <RecoveryTimeline milestones={milestones} />
          <MedicalLocker />
        </div>

      </div>

      {/* Emergency QR Modal */}
      {showQrModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl max-w-sm w-full border border-slate-200 dark:border-slate-800 shadow-2xl space-y-6 text-center">
            <div className="flex justify-between items-center pb-2 border-b border-slate-100 dark:border-slate-800">
              <span className="text-xs font-bold uppercase text-rose-600">CareBridge Emergency Pass</span>
              <button onClick={() => setShowQrModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 flex justify-center">
              <img 
                src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=https://carebridge.app/emergency/CB-${user?.id || '9821'}`} 
                alt="Emergency QR" 
                className="w-44 h-44 rounded-xl"
              />
            </div>

            <div className="space-y-1 text-left bg-slate-50 dark:bg-slate-800/60 p-4 rounded-xl text-xs text-slate-700 dark:text-slate-300">
              <p><strong>Patient:</strong> {user?.name}</p>
              <p><strong>Emergency Ref:</strong> CB-{user?.id ? String(user.id).slice(-4) : '9821'}</p>
              <p><strong>Profile Type:</strong> Continuous Care Member</p>
            </div>

            <button
              onClick={() => setShowQrModal(false)}
              className="w-full py-3 rounded-xl text-xs font-semibold bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-sm"
            >
              Close
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
