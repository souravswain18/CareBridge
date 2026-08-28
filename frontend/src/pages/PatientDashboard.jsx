import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { MedicationChecklist } from '../components/MedicationChecklist';
import { VitalsTelemetry } from '../components/VitalsTelemetry';
import { RecoveryTimeline } from '../components/RecoveryTimeline';
import { MedicalLocker } from '../components/MedicalLocker';
import { CareBot } from '../components/CareBot';
import { 
  User, 
  QrCode, 
  X,
  ShieldAlert
} from 'lucide-react';
import { APP_CONFIG } from '../config';

export const PatientDashboard = () => {
  const { user } = useAuth();
  const [showQrModal, setShowQrModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  
  // Dynamic Clinical Profile State
  const [profile, setProfile] = useState(() => {
    const saved = localStorage.getItem(`carebridge_profile_${user?.email}`);
    return saved ? JSON.parse(saved) : {
      bloodGroup: 'Not Specified',
      allergies: 'None Reported',
      condition: 'Post-Discharge Recovery',
      caregiverName: 'Not Linked Yet',
      caregiverPhone: 'No Phone Linked'
    };
  });

  const [editBloodGroup, setEditBloodGroup] = useState(profile.bloodGroup || 'Not Specified');
  const [editAllergies, setEditAllergies] = useState(profile.allergies === 'None Reported' ? '' : profile.allergies);
  const [editCondition, setEditCondition] = useState(profile.condition === 'Post-Discharge Recovery' ? '' : profile.condition);
  const [editGuardianName, setEditGuardianName] = useState(profile.caregiverName === 'Not Linked Yet' ? '' : profile.caregiverName);
  const [editGuardianPhone, setEditGuardianPhone] = useState(profile.caregiverPhone === 'No Phone Linked' ? '' : profile.caregiverPhone);

  const handleSaveProfile = (e) => {
    e.preventDefault();
    const updated = {
      ...profile,
      bloodGroup: editBloodGroup || 'Not Specified',
      allergies: editAllergies.trim() || 'None Reported',
      condition: editCondition.trim() || 'Post-Discharge Recovery',
      caregiverName: editGuardianName.trim() || profile.caregiverName || 'Primary Guardian',
      caregiverPhone: editGuardianPhone.trim() || profile.caregiverPhone || '+91 98765 43210'
    };
    setProfile(updated);
    if (user?.email) {
      localStorage.setItem(`carebridge_profile_${user.email}`, JSON.stringify(updated));
    }
    setShowProfileModal(false);
  };

  // Dynamic Reminders State (Saved in LocalStorage per user)
  const [reminders, setReminders] = useState(() => {
    const saved = localStorage.getItem(`carebridge_reminders_${user?.email}`);
    return saved ? JSON.parse(saved) : [];
  });

  // Dynamic Vitals Telemetry History
  const [vitalsData, setVitalsData] = useState(() => {
    const saved = localStorage.getItem(`carebridge_vitals_${user?.email}`);
    return saved ? JSON.parse(saved) : [];
  });

  // Dynamic Recovery Milestones
  const [milestones, setMilestones] = useState(() => {
    const saved = localStorage.getItem(`carebridge_milestones_${user?.email}`);
    return saved ? JSON.parse(saved) : [
      {
        id: 1,
        dayTag: 'DAY 0',
        title: 'Hospital Discharge & Home Recovery Start',
        description: 'Initial recovery profile created. Follow your prescribed medication schedule.',
        completed: true
      }
    ];
  });

  // Initial fetch from cloud backend on mount
  useEffect(() => {
    if (user?.email) {
      const linkCode = `CB-${user?.id ? String(user.id).slice(-4) : '7821'}`;
      fetch(`${APP_CONFIG.apiUrl}/caregiver/patient/${linkCode}/telemetry`)
        .then(res => res.json())
        .then(data => {
          if (data.reminders && Array.isArray(data.reminders) && data.reminders.length > 0) {
            setReminders(data.reminders);
          }
          if (data.vitals && Array.isArray(data.vitals) && data.vitals.length > 0) {
            setVitalsData(data.vitals);
          }
          if (data.milestones && Array.isArray(data.milestones) && data.milestones.length > 0) {
            setMilestones(data.milestones);
          }
        })
        .catch(e => console.log('Initial cloud load note:', e));
    }
  }, [user?.email]);

  // Real-Time Continuous Cloud Sync Heartbeat: Push patient state to cloud backend continuously
  useEffect(() => {
    if (!user?.email) return;

    localStorage.setItem(`carebridge_reminders_${user.email}`, JSON.stringify(reminders));
    localStorage.setItem(`carebridge_vitals_${user.email}`, JSON.stringify(vitalsData));
    
    const linkCode = `CB-${user?.id ? String(user.id).slice(-4) : '7821'}`;
    const pushSync = () => {
      fetch(`${APP_CONFIG.apiUrl}/caregiver/sync`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          linkCode,
          email: user.email,
          name: user.name,
          bloodGroup: profile.bloodGroup,
          allergies: profile.allergies,
          condition: profile.condition,
          caregiverPhone: profile.caregiverPhone,
          reminders,
          vitals: vitalsData,
          milestones
        })
      }).catch(err => console.log('Live cloud sync heartbeat active.'));
    };

    pushSync();
    const heartbeat = setInterval(pushSync, 2000); // Continuous 2s heartbeat
    return () => clearInterval(heartbeat);
  }, [reminders, vitalsData, profile, milestones, user]);

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

        {/* Emergency Pass Quick Actions */}
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setShowProfileModal(true)}
            className="px-4 py-2.5 rounded-2xl bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all shadow-sm flex items-center space-x-2"
          >
            <ShieldAlert className="w-4 h-4 text-indigo-500" />
            <span>Edit Medical Profile</span>
          </button>

          <button
            onClick={() => setShowQrModal(true)}
            className="px-4 py-2.5 rounded-2xl bg-white/80 dark:bg-slate-900/80 hover:bg-slate-50 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-800 dark:text-slate-200 transition-all shadow-sm flex items-center space-x-2"
          >
            <QrCode className="w-4 h-4 text-slate-600 dark:text-slate-400" />
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

      {/* ⚙️ Edit Medical Profile Modal (Blood Group, Allergies, Diagnosis) */}
      {showProfileModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl max-w-md w-full border border-slate-200 dark:border-slate-800 shadow-2xl space-y-6">
            <div className="flex justify-between items-center pb-2 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center space-x-2">
                <div className="p-2 bg-indigo-100 dark:bg-indigo-950 text-indigo-600 rounded-xl">
                  <ShieldAlert className="w-4 h-4" />
                </div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Emergency Medical Profile
                </h3>
              </div>
              <button onClick={() => setShowProfileModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-4 text-left">
              {/* Blood Group */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Blood Group
                </label>
                <select
                  value={editBloodGroup}
                  onChange={(e) => setEditBloodGroup(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-slate-800"
                >
                  <option value="Not Specified">Not Specified</option>
                  <option value="A+ Positive">A+ Positive</option>
                  <option value="A- Negative">A- Negative</option>
                  <option value="B+ Positive">B+ Positive</option>
                  <option value="B- Negative">B- Negative</option>
                  <option value="O+ Positive">O+ Positive</option>
                  <option value="O- Negative">O- Negative</option>
                  <option value="AB+ Positive">AB+ Positive</option>
                  <option value="AB- Negative">AB- Negative</option>
                </select>
              </div>

              {/* Severe Allergies */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Severe Drug / Food Allergies
                </label>
                <input
                  type="text"
                  value={editAllergies}
                  onChange={(e) => setEditAllergies(e.target.value)}
                  placeholder="e.g. Penicillin, Sulfa, Peanuts"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-slate-800"
                />
                <span className="text-[10px] text-slate-400">Displayed in high-priority red on Emergency Pass</span>
              </div>

              {/* Diagnosis / Surgery */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Post-Hospital Diagnosis / Procedure
                </label>
                <input
                  type="text"
                  value={editCondition}
                  onChange={(e) => setEditCondition(e.target.value)}
                  placeholder="e.g. Post-Op Knee Replacement, Hypertension"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-slate-800"
                />
              </div>

              {/* Emergency Guardian Contact */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Guardian Name
                  </label>
                  <input
                    type="text"
                    value={editGuardianName}
                    onChange={(e) => setEditGuardianName(e.target.value)}
                    placeholder="e.g. Priya Sharma"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-slate-800"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Guardian Phone (SOS)
                  </label>
                  <input
                    type="tel"
                    value={editGuardianPhone}
                    onChange={(e) => setEditGuardianPhone(e.target.value)}
                    placeholder="e.g. +91 98765 43210"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-slate-800"
                  />
                </div>
              </div>

              <div className="flex space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowProfileModal(false)}
                  className="flex-1 py-2.5 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl text-xs font-bold text-white bg-slate-900 dark:bg-white dark:text-slate-900 shadow-sm"
                >
                  Save Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Emergency QR Modal */}
      {showQrModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl max-w-sm w-full border border-slate-200 dark:border-slate-800 shadow-2xl space-y-6 text-center">
            
            <div className="flex justify-between items-center pb-2 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Emergency QR Pass</h3>
              <button onClick={() => setShowQrModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scannable Live QR Code with Dynamic Payload Encoding */}
            {(() => {
              const qrPayload = {
                n: user?.name || profile.name,
                bg: profile.bloodGroup || 'Not Specified',
                al: profile.allergies || 'None Reported',
                cd: profile.condition || 'Post-Hospital Recovery',
                cn: profile.caregiverName || 'Primary Guardian',
                cp: profile.caregiverPhone || '+91 98765 43210',
                m: (reminders || []).slice(0, 6).map(r => ({ n: r.name, t: r.time, d: r.dosage, tk: r.taken }))
              };
              const encodedData = encodeURIComponent(btoa(unescape(encodeURIComponent(JSON.stringify(qrPayload)))));
              const targetUrl = `${window.location.origin}/emergency/CB-${user?.id ? String(user.id).slice(-4) : '7821'}?p=${encodedData}`;
              const qrApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(targetUrl)}&color=0f172a`;

              return (
                <div className="flex flex-col items-center justify-center p-5 bg-slate-50 dark:bg-slate-800/80 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-3">
                  <div className="p-3 bg-white rounded-2xl shadow-md border border-slate-200">
                    <img 
                      src={qrApiUrl} 
                      alt="Emergency Medical QR Pass" 
                      className="w-44 h-44 object-contain rounded-lg"
                    />
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                    Scan with any smartphone camera to open your real emergency snapshot
                  </p>
                </div>
              );
            })()}

            <div className="space-y-1.5 text-left bg-slate-50 dark:bg-slate-800/60 p-4 rounded-xl text-xs text-slate-700 dark:text-slate-300">
              <p><strong>Patient:</strong> {user?.name}</p>
              <p><strong>Emergency Ref:</strong> CB-{user?.id ? String(user.id).slice(-4) : '7821'}</p>
              <p><strong>Direct Link:</strong> <a href={`/emergency/CB-${user?.id ? String(user.id).slice(-4) : '7821'}`} target="_blank" rel="noreferrer" className="text-indigo-600 dark:text-indigo-400 underline font-mono">Open Pass Page ↗</a></p>
            </div>

            <button
              onClick={() => setShowQrModal(false)}
              className="w-full py-3 rounded-xl text-xs font-semibold bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-sm hover:opacity-90 transition-opacity"
            >
              Done
            </button>
          </div>
        </div>
      )}

      {/* 🤖 Floating CareBot AI Clinical Assistant */}
      <CareBot />

    </div>
  );
};
