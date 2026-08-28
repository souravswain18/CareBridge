import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  Users, 
  User, 
  HeartPulse, 
  Clock, 
  AlertTriangle, 
  Phone, 
  MessageSquare, 
  BellRing, 
  Plus, 
  Calendar, 
  Pill, 
  CheckCircle2, 
  ChevronDown, 
  Activity, 
  ShieldCheck, 
  ExternalLink,
  Trash2,
  Inbox,
  Flag,
  Check,
  X,
  RefreshCw
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid, 
  ReferenceLine 
} from 'recharts';
import { MASTER_MEDICINES } from '../data/medicinesData';
import { APP_CONFIG } from '../config';

export const CaregiverDashboard = () => {
  const { user } = useAuth();
  const [showConnectModal, setShowConnectModal] = useState(false);
  const [showAddTaskModal, setShowAddTaskModal] = useState(false);
  const [showAddMilestoneModal, setShowAddMilestoneModal] = useState(false);
  const [showCallModal, setShowCallModal] = useState(false);
  const [pingSent, setPingSent] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [patientNameInput, setPatientNameInput] = useState('');
  const [linkCodeInput, setLinkCodeInput] = useState('');
  const [activeTab, setActiveTab] = useState('BP'); // 'BP' or 'SUGAR'

  // Dynamic Connected Patients List (Cleaned of legacy mock keys)
  const [patients, setPatients] = useState(() => {
    const saved = localStorage.getItem(`carebridge_caregiver_patients_${user?.email}`);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Filter out any previous hardcoded Ramesh Kumar mock entry
        return parsed.filter(p => p.email !== 'ramesh.patient@carebridge.com');
      } catch (e) {
        return [];
      }
    }
    return [];
  });

  const [selectedPatientId, setSelectedPatientId] = useState(() => {
    return patients.length > 0 ? patients[0].id : '';
  });

  useEffect(() => {
    if (patients.length > 0 && (!selectedPatientId || !patients.some(p => p.id === selectedPatientId))) {
      setSelectedPatientId(patients[0].id);
    } else if (patients.length === 0) {
      setSelectedPatientId('');
    }
    localStorage.setItem(`carebridge_caregiver_patients_${user?.email}`, JSON.stringify(patients));
  }, [patients, selectedPatientId, user]);

  const currentPatient = patients.find(p => p.id === selectedPatientId) || null;

  // Live Patient Reminders, Vitals & Milestones
  const [patientReminders, setPatientReminders] = useState([]);
  const [patientVitals, setPatientVitals] = useState([]);
  const [patientMilestones, setPatientMilestones] = useState([]);
  const [newDayTag, setNewDayTag] = useState('DAY 7');
  const [newMilestoneTitle, setNewMilestoneTitle] = useState('');
  const [newMilestoneDesc, setNewMilestoneDesc] = useState('');

  const [syncStatusText, setSyncStatusText] = useState('Connecting...');

  useEffect(() => {
    if (!currentPatient) return;
    const code = currentPatient.linkCode || 'CB-7821';

    let isMounted = true;

    const fetchLiveTelemetry = async () => {
      try {
        const url = `${APP_CONFIG.apiUrl}/caregiver/patient/${code}/telemetry`;
        const res = await fetch(url);
        if (res.ok && isMounted) {
          const data = await res.json();
          setSyncStatusText(`HTTP 200 OK (${data.reminders?.length || 0} Meds, ${data.vitals?.length || 0} Vitals)`);
          
          if (Array.isArray(data.reminders)) {
            setPatientReminders(data.reminders);
          }
          
          if (Array.isArray(data.vitals)) {
            const formattedVitals = data.vitals.map(v => ({
              ...v,
              systolic: Number(v.systolic) || 120,
              diastolic: Number(v.diastolic) || 80,
              sugar: Number(v.sugar) || 110
            }));
            setPatientVitals(formattedVitals);
          }
          
          if (Array.isArray(data.milestones)) {
            setPatientMilestones(data.milestones);
          }
        } else {
          setSyncStatusText(`HTTP ${res.status} Error`);
        }
      } catch (e) {
        setSyncStatusText(`Network Error: ${e.message}`);
      }
    };

    fetchLiveTelemetry();
    const interval = setInterval(fetchLiveTelemetry, 1500);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [currentPatient?.linkCode, currentPatient?.id, selectedPatientId]);

  const handleAddMilestone = (e) => {
    e.preventDefault();
    if (!newMilestoneTitle.trim() || !currentPatient) return;

    const newM = {
      id: Date.now(),
      dayTag: newDayTag.toUpperCase(),
      title: newMilestoneTitle,
      description: newMilestoneDesc || 'Post-discharge clinical progress target.',
      completed: false
    };

    const updated = [...patientMilestones, newM];
    setPatientMilestones(updated);
    localStorage.setItem(`carebridge_milestones_${currentPatient.email}`, JSON.stringify(updated));

    setNewMilestoneTitle('');
    setNewMilestoneDesc('');
    setShowAddMilestoneModal(false);
  };

  const handleToggleMilestone = (id) => {
    if (!currentPatient) return;
    const updated = patientMilestones.map(m =>
      m.id === id ? { ...m, completed: !m.completed } : m
    );
    setPatientMilestones(updated);
    localStorage.setItem(`carebridge_milestones_${currentPatient.email}`, JSON.stringify(updated));
  };

  const handleDeleteMilestone = (id) => {
    if (!currentPatient) return;
    const updated = patientMilestones.filter(m => m.id !== id);
    setPatientMilestones(updated);
    localStorage.setItem(`carebridge_milestones_${currentPatient.email}`, JSON.stringify(updated));
  };

  // New Task State
  const [newTitle, setNewTitle] = useState('');
  const [newDosage, setNewDosage] = useState('');
  const [newHour, setNewHour] = useState('08');
  const [newMinute, setNewMinute] = useState('00');
  const [newAmPm, setNewAmPm] = useState('AM');
  const [newType, setNewType] = useState('MEDICINE');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  useEffect(() => {
    if (newTitle.trim().length > 0) {
      const query = newTitle.toLowerCase();
      const filtered = MASTER_MEDICINES.filter(m =>
        m.name.toLowerCase().includes(query) || m.dosage.toLowerCase().includes(query)
      );
      setSuggestions(filtered.slice(0, 8));
      setShowSuggestions(filtered.length > 0);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [newTitle]);

  const handleSelectSuggestion = (item) => {
    setNewTitle(item.name);
    setNewDosage(item.dosage);
    setNewType(item.type);
    setShowSuggestions(false);
  };

  const handleAddPatientTask = (e) => {
    e.preventDefault();
    if (!newTitle.trim() || !currentPatient) return;

    const formattedTime = `${newHour}:${newMinute} ${newAmPm}`;
    const newTask = {
      id: Date.now(),
      title: newTitle,
      dosageNotes: newDosage,
      time: formattedTime,
      type: newType,
      isCompleted: false,
      scheduledTime: new Date().toISOString()
    };

    const updated = [newTask, ...patientReminders];
    setPatientReminders(updated);
    localStorage.setItem(`carebridge_reminders_${currentPatient.email}`, JSON.stringify(updated));

    setNewTitle('');
    setNewDosage('');
    setShowAddTaskModal(false);
  };

  const handleConnectNewPatient = async (e) => {
    e.preventDefault();
    if (!linkCodeInput.trim()) return;

    let code = linkCodeInput.trim().toUpperCase();
    if (!code.startsWith('CB-')) {
      code = `CB-${code.replace(/[^0-9A-Z]/g, '')}`;
    }

    const displayName = patientNameInput.trim() || `Patient (${code})`;
    const targetEmail = `patient.${code.toLowerCase()}@carebridge.com`;
    
    const newLinked = {
      id: String(Date.now()),
      name: displayName,
      email: targetEmail,
      linkCode: code,
      status: 'Connected'
    };

    const updated = [...patients, newLinked];
    setPatients(updated);
    setSelectedPatientId(newLinked.id);

    // Immediate Direct Fetch from Live Cloud Backend
    try {
      const res = await fetch(`${APP_CONFIG.apiUrl}/caregiver/patient/${code}/telemetry`);
      if (res.ok) {
        const data = await res.json();
        if (data.reminders && Array.isArray(data.reminders)) {
          setPatientReminders(data.reminders);
          localStorage.setItem(`carebridge_reminders_${targetEmail}`, JSON.stringify(data.reminders));
        }
        if (data.vitals && Array.isArray(data.vitals)) {
          setPatientVitals(data.vitals);
          localStorage.setItem(`carebridge_vitals_${targetEmail}`, JSON.stringify(data.vitals));
        }
        if (data.milestones && Array.isArray(data.milestones)) {
          setPatientMilestones(data.milestones);
          localStorage.setItem(`carebridge_milestones_${targetEmail}`, JSON.stringify(data.milestones));
        }
      }
    } catch (err) {
      console.log('Instant sync fallback note:', err);
    }

    setPatientNameInput('');
    setLinkCodeInput('');
    setShowConnectModal(false);
  };

  const handleDisconnectPatient = (id) => {
    const updated = patients.filter(p => p.id !== id);
    setPatients(updated);
  };

  const handleWhatsAppAlert = () => {
    const text = encodeURIComponent(`Hi ${currentPatient?.name}, CareBridge alert: Please check and confirm your scheduled care routine on the app.`);
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  return (
    <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 py-10 space-y-8">
      
      {/* Caregiver Header & Patient Switcher */}
      <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl p-6 sm:p-8 rounded-3xl border border-white/80 dark:border-slate-800 shadow-xl shadow-slate-900/5 flex flex-col md:flex-row md:items-center justify-between gap-6">
        
        <div className="flex items-center space-x-4">
          <div className="w-14 h-14 rounded-2xl bg-slate-900 text-white dark:bg-white dark:text-slate-900 flex items-center justify-center font-bold text-xl shadow-md">
            <Users className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                Caregiver Guardian Portal
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300">
                Guardian Mode
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-mono flex items-center gap-2">
              <span>Caregiver: {user?.name}</span>
              {currentPatient && (
                <span className="px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-[10px] font-bold border border-indigo-500/20">
                  ● Status: {syncStatusText}
                </span>
              )}
            </p>
          </div>
        </div>

        {/* Patient Switcher Dropdown & Add Button (Mobile-friendly flex wrap) */}
        <div className="flex flex-wrap items-center gap-2.5">
          {patients.length > 0 && (
            <div className="flex items-center space-x-2">
              <div className="relative">
                <select
                  value={selectedPatientId}
                  onChange={(e) => setSelectedPatientId(e.target.value)}
                  className="appearance-none pl-3 pr-8 py-2.5 rounded-xl text-xs font-bold text-slate-800 dark:text-slate-200 bg-white/90 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-slate-800 cursor-pointer max-w-[200px] truncate"
                >
                  {patients.map(p => (
                    <option key={p.id} value={p.id}>
                      👤 {p.name}
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-4 h-4 text-slate-400 absolute right-2.5 top-3 pointer-events-none" />
              </div>

              {currentPatient && (
                <>
                  <button
                    onClick={async () => {
                      if (!currentPatient) return;
                      const code = currentPatient.linkCode || 'CB-7821';
                      setIsRefreshing(true);
                      try {
                        const res = await fetch(`${APP_CONFIG.apiUrl}/caregiver/patient/${code}/telemetry`);
                        if (res.ok) {
                          const data = await res.json();
                          if (data.reminders && Array.isArray(data.reminders)) {
                            setPatientReminders([...data.reminders]);
                          }
                          if (data.vitals && Array.isArray(data.vitals)) {
                            setPatientVitals([...data.vitals]);
                          }
                          if (data.milestones && Array.isArray(data.milestones)) {
                            setPatientMilestones([...data.milestones]);
                          }
                        }
                      } catch(e) {
                        console.log('Refresh error:', e);
                      } finally {
                        setTimeout(() => setIsRefreshing(false), 500);
                      }
                    }}
                    className={`p-2.5 rounded-xl transition-all border border-slate-200 dark:border-slate-700 shrink-0 ${
                      isRefreshing 
                        ? 'bg-indigo-100 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-300' 
                        : 'text-slate-600 dark:text-slate-300 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-950/40'
                    }`}
                    title="Live Refresh Cloud Telemetry"
                  >
                    <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-indigo-600' : ''}`} />
                  </button>

                  <button
                    onClick={() => handleDisconnectPatient(currentPatient.id)}
                    className="p-2.5 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl transition-colors border border-slate-200 dark:border-slate-700 shrink-0"
                    title="Unlink this patient"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </>
              )}
            </div>
          )}

          <button
            onClick={() => setShowConnectModal(true)}
            className="px-3.5 py-2.5 rounded-xl text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 dark:bg-white dark:text-slate-900 transition-all shadow-sm flex items-center space-x-1.5 shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Connect Patient</span>
          </button>
        </div>

      </div>

      {/* When NO Patient is Connected */}
      {patients.length === 0 ? (
        <div className="py-16 px-6 text-center space-y-4 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-3xl border border-white/80 dark:border-slate-800 shadow-xl shadow-slate-900/5">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400">
            <User className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">No Dependent Patients Connected</h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              You are not currently monitoring any patient profile. Click below and enter the Link Code from your family member's CareBridge screen.
            </p>
          </div>
          <button
            onClick={() => setShowConnectModal(true)}
            className="px-6 py-3 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 dark:bg-white dark:text-slate-900 rounded-xl transition-all shadow-sm inline-flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>Connect Family Member</span>
          </button>
        </div>
      ) : (
        /* Main Caregiver Grid */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column (7 Cols): Remote Vitals Telemetry */}
          <div className="lg:col-span-7 space-y-8">
            <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl p-6 sm:p-8 rounded-3xl border border-white/80 dark:border-slate-800 shadow-xl shadow-slate-900/5 space-y-6">

              {/* Clean Mobile-Responsive Telemetry Header */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-slate-100 dark:border-slate-800/80">
                <div>
                  <span className="text-xs font-semibold uppercase tracking-wider text-rose-600 dark:text-rose-400">
                    Remote Telemetry Feed
                  </span>
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                    {currentPatient?.name}'s Health Curves
                  </h2>
                </div>

                {/* Actions & Graph Controls (Wrapped & Stacked cleanly for mobile) */}
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={handleWhatsAppAlert}
                    className="px-3.5 py-2 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 transition-colors shadow-sm flex items-center space-x-1.5"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>WhatsApp Alert</span>
                  </button>

                  <button
                    onClick={() => setShowCallModal(true)}
                    className="px-3.5 py-2 rounded-xl text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 transition-colors shadow-sm flex items-center space-x-1.5"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>Call Patient</span>
                  </button>

                  {/* BP / Sugar Toggle Tabs */}
                  <div className="p-1 bg-slate-200/60 dark:bg-slate-800/80 rounded-xl flex space-x-1 border border-slate-200/60">
                    <button
                      onClick={() => setActiveTab('BP')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                        activeTab === 'BP'
                          ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm'
                          : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                      }`}
                    >
                      BP
                    </button>
                    <button
                      onClick={() => setActiveTab('SUGAR')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                        activeTab === 'SUGAR'
                          ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm'
                          : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                      }`}
                    >
                      Sugar
                    </button>
                  </div>
                </div>
              </div>

              {/* Recharts Curve / Empty State */}
              <div className="h-64 w-full pt-2">
                {patientVitals.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center border border-dashed border-slate-200 dark:border-slate-700 rounded-2xl text-xs text-slate-400 p-6 text-center space-y-2">
                    <Activity className="w-8 h-8 text-slate-300 dark:text-slate-600" />
                    <span>No telemetry vitals recorded yet by {currentPatient?.name}.</span>
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={patientVitals} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#cbd5e1" opacity={0.4} />
                      <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} domain={['auto', 'auto']} />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                          borderRadius: '16px', 
                          border: '1px solid #e2e8f0',
                          boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)' 
                        }} 
                      />
                      {activeTab === 'BP' ? (
                        <>
                          <ReferenceLine y={140} stroke="#ef4444" strokeDasharray="3 3" label={{ value: 'Spike (140)', fill: '#ef4444', fontSize: 10 }} />
                          <Line type="monotone" dataKey="systolic" name="Systolic (mmHg)" stroke="#dc2626" strokeWidth={2.5} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                          <Line type="monotone" dataKey="diastolic" name="Diastolic (mmHg)" stroke="#f59e0b" strokeWidth={2} dot={{ r: 3 }} />
                        </>
                      ) : (
                        <>
                          <ReferenceLine y={140} stroke="#ef4444" strokeDasharray="3 3" label={{ value: 'Elevated (140)', fill: '#ef4444', fontSize: 10 }} />
                          <Line type="monotone" dataKey="sugar" name="Sugar (mg/dL)" stroke="#3b82f6" strokeWidth={2.5} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                        </>
                      )}
                    </LineChart>
                  </ResponsiveContainer>
                )}
              </div>
            </div>

            {/* 🗺️ Post-Discharge Recovery Roadmap Controller */}
            <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl p-6 sm:p-8 rounded-3xl border border-white/80 dark:border-slate-800 shadow-xl shadow-slate-900/5 space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 flex items-center space-x-1">
                    <Flag className="w-3.5 h-3.5 mr-1" />
                    Recovery Roadmap Controller
                  </span>
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                    {currentPatient?.name}'s Milestones
                  </h2>
                </div>

                <button
                  onClick={() => setShowAddMilestoneModal(true)}
                  className="px-3.5 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 dark:bg-white dark:text-slate-900 rounded-xl transition-all shadow-sm flex items-center space-x-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Milestone</span>
                </button>
              </div>

              <div className="space-y-3">
                {patientMilestones.map((m) => (
                  <div
                    key={m.id}
                    className={`p-4 rounded-2xl border transition-all flex items-start justify-between ${
                      m.completed 
                        ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-900/60'
                        : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 shadow-sm'
                    }`}
                  >
                    <div className="space-y-1 pr-3">
                      <div className="flex items-center space-x-2">
                        <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
                          {m.dayTag}
                        </span>
                        <h4 className={`text-xs font-bold ${m.completed ? 'line-through text-slate-500' : 'text-slate-900 dark:text-white'}`}>
                          {m.title}
                        </h4>
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">
                        {m.description}
                      </p>
                    </div>

                    <div className="flex items-center space-x-2 shrink-0">
                      <button
                        onClick={() => handleToggleMilestone(m.id)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center space-x-1 ${
                          m.completed
                            ? 'bg-emerald-600 text-white'
                            : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200'
                        }`}
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>{m.completed ? 'Done' : 'Mark Done'}</span>
                      </button>

                      <button
                        onClick={() => handleDeleteMilestone(m.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg transition-colors"
                        title="Delete Milestone"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Right Column (5 Cols): Shared Caregiver Scheduler */}
          <div className="lg:col-span-5 space-y-8">
            <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl p-6 sm:p-8 rounded-3xl border border-white/80 dark:border-slate-800 shadow-xl shadow-slate-900/5 space-y-6">
              
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-semibold uppercase tracking-wider text-amber-700 dark:text-amber-400">
                    Shared Adherence
                  </span>
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                    {currentPatient?.name}'s Schedule
                  </h2>
                </div>

                <button
                  onClick={() => setShowAddTaskModal(true)}
                  className="px-3.5 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 dark:bg-white dark:text-slate-900 rounded-xl transition-all shadow-sm flex items-center space-x-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Assign Task</span>
                </button>
              </div>

              {/* List of Tasks / Empty State */}
              {patientReminders.length === 0 ? (
                <div className="py-10 text-center space-y-2 bg-slate-50/60 dark:bg-slate-800/40 rounded-2xl border border-dashed border-slate-200 dark:border-slate-700">
                  <Inbox className="w-8 h-8 mx-auto text-slate-400" />
                  <p className="text-xs text-slate-500">No scheduled tasks for this patient yet.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {patientReminders.map(item => (
                    <div
                      key={item.id}
                      className={`p-4 rounded-2xl border transition-all flex items-center justify-between ${
                        item.isCompleted
                          ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-200 opacity-75'
                          : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 shadow-sm'
                      }`}
                    >
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <h4 className={`text-xs font-bold ${
                            item.isCompleted ? 'line-through text-slate-400' : 'text-slate-900 dark:text-white'
                          }`}>
                            {item.title}
                          </h4>
                          <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                            {item.time}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400">
                          {item.dosageNotes}
                        </p>
                      </div>

                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md uppercase ${
                        item.isCompleted
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                          : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                      }`}>
                        {item.isCompleted ? 'Completed' : 'Scheduled'}
                      </span>
                    </div>
                  ))}
                </div>
              )}

            </div>
          </div>

        </div>
      )}

      {/* Connect Patient Modal */}
      {showConnectModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl max-w-sm w-full border border-slate-200 dark:border-slate-800 shadow-2xl space-y-5">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Connect Dependent Patient</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Enter the patient's name and their 6-character Link Code found on their Patient Dashboard header.
            </p>

            <form onSubmit={handleConnectNewPatient} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Relationship / Name (e.g. Papa, Mother)
                </label>
                <input
                  type="text"
                  required
                  value={patientNameInput}
                  onChange={(e) => setPatientNameInput(e.target.value)}
                  placeholder="e.g. Papa / Ramesh"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-slate-800"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Link Code
                </label>
                <input
                  type="text"
                  required
                  value={linkCodeInput}
                  onChange={(e) => setLinkCodeInput(e.target.value)}
                  placeholder="e.g. CB-7821"
                  className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-center font-mono font-bold text-base uppercase tracking-wider text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-slate-800"
                />
              </div>

              <div className="flex space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowConnectModal(false)}
                  className="flex-1 py-2.5 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl text-xs font-semibold text-white bg-slate-900 dark:bg-white dark:text-slate-900 shadow-sm"
                >
                  Link Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Milestone Modal */}
      {showAddMilestoneModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl max-w-md w-full border border-slate-200 dark:border-slate-800 shadow-2xl space-y-5">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Add Recovery Milestone</h3>
            
            <form onSubmit={handleAddMilestone} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Timeline Tag (e.g. DAY 7, DAY 14, DAY 30)
                </label>
                <input
                  type="text"
                  required
                  value={newDayTag}
                  onChange={(e) => setNewDayTag(e.target.value)}
                  placeholder="e.g. DAY 14"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm uppercase text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Milestone Goal / Action
                </label>
                <input
                  type="text"
                  required
                  value={newMilestoneTitle}
                  onChange={(e) => setNewMilestoneTitle(e.target.value)}
                  placeholder="e.g. Suture Removal & Ortho Follow-up"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Clinical Details / Instructions
                </label>
                <input
                  type="text"
                  value={newMilestoneDesc}
                  onChange={(e) => setNewMilestoneDesc(e.target.value)}
                  placeholder="e.g. Hospital OPD Room 4 with Dr. Verma"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white"
                />
              </div>

              <div className="flex space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddMilestoneModal(false)}
                  className="flex-1 py-2.5 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl text-xs font-semibold text-white bg-slate-900 dark:bg-white dark:text-slate-900 shadow-sm"
                >
                  Save Milestone
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Smart Contact & Calling Modal (Optimized for PC & Mobile) */}
      {showCallModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl max-w-md w-full border border-slate-200 dark:border-slate-800 shadow-2xl space-y-6">
            <div className="flex justify-between items-center pb-2 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center space-x-2">
                <div className="p-2 bg-rose-100 dark:bg-rose-950 text-rose-600 rounded-xl">
                  <Phone className="w-4 h-4" />
                </div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Contact {currentPatient?.name}
                </h3>
              </div>
              <button onClick={() => setShowCallModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300">
              Choose an instant channel to reach your patient from PC or Phone:
            </p>

            <div className="space-y-3">
              {/* Option 1: WhatsApp Web / App */}
              <button
                onClick={() => {
                  const text = encodeURIComponent(`Hi ${currentPatient?.name}, CareBridge Alert: 20-minute medicine grace period ho gaya hai. Please apni dose le lijiye!`);
                  window.open(`https://wa.me/?text=${text}`, '_blank');
                  setShowCallModal(false);
                }}
                className="w-full p-4 rounded-2xl bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/40 dark:hover:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 transition-all text-left flex items-center justify-between group"
              >
                <div className="flex items-center space-x-3">
                  <div className="p-2.5 bg-emerald-600 text-white rounded-xl">
                    <MessageSquare className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-emerald-950 dark:text-emerald-200">
                      WhatsApp Web / Direct Message
                    </h4>
                    <p className="text-[11px] text-emerald-700 dark:text-emerald-400">
                      Opens WhatsApp with pre-filled urgent medicine reminder
                    </p>
                  </div>
                </div>
                <ExternalLink className="w-4 h-4 text-emerald-600 group-hover:translate-x-0.5 transition-transform" />
              </button>

              {/* Option 2: Windows Phone Link / Cellular Dialer */}
              <a
                href="tel:+919876543210"
                onClick={() => setShowCallModal(false)}
                className="w-full p-4 rounded-2xl bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700/80 border border-slate-200 dark:border-slate-700 transition-all text-left flex items-center justify-between group"
              >
                <div className="flex items-center space-x-3">
                  <div className="p-2.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                      Direct Voice Call / Phone Link
                    </h4>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      Triggers Windows Phone Link, Skype, or Mobile Dialer
                    </p>
                  </div>
                </div>
                <ExternalLink className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
              </a>

              {/* Option 3: Loud Audio Chime Ping */}
              <button
                onClick={() => {
                  setPingSent(true);
                  setTimeout(() => setPingSent(false), 3000);
                }}
                className="w-full p-4 rounded-2xl bg-amber-50 hover:bg-amber-100 dark:bg-amber-950/40 dark:hover:bg-amber-950/60 border border-amber-200 dark:border-amber-800 transition-all text-left flex items-center justify-between"
              >
                <div className="flex items-center space-x-3">
                  <div className="p-2.5 bg-amber-600 text-white rounded-xl">
                    <BellRing className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-amber-950 dark:text-amber-200">
                      {pingSent ? '✓ High-Priority Chime Sent!' : 'Send Loud Reminder Chime'}
                    </h4>
                    <p className="text-[11px] text-amber-700 dark:text-amber-400">
                      Pings patient's device screen with alert tone
                    </p>
                  </div>
                </div>
              </button>
            </div>

            <button
              onClick={() => setShowCallModal(false)}
              className="w-full py-2.5 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Assign Task Modal */}
      {showAddTaskModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl max-w-md w-full border border-slate-200 dark:border-slate-800 shadow-2xl space-y-5">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Assign Task to {currentPatient?.name}</h3>
            
            <form onSubmit={handleAddPatientTask} className="space-y-4">
              <div className="relative">
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Medicine / Care Task
                </label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="Search medicine catalog..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-slate-800 text-slate-900 dark:text-white"
                />

                {showSuggestions && suggestions.length > 0 && (
                  <div className="absolute left-0 right-0 top-full mt-1.5 z-50 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-2xl max-h-48 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-700/60">
                    {suggestions.map((item, idx) => (
                      <div
                        key={idx}
                        onClick={() => handleSelectSuggestion(item)}
                        className="p-2.5 hover:bg-slate-100 dark:hover:bg-slate-700/80 cursor-pointer transition-colors text-xs font-semibold text-slate-900 dark:text-white"
                      >
                        {item.name}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Time Picker */}
              <div className="grid grid-cols-12 gap-2 items-center">
                <div className="col-span-4">
                  <select
                    value={newHour}
                    onChange={(e) => setNewHour(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-semibold text-slate-900 dark:text-white"
                  >
                    {['01','02','03','04','05','06','07','08','09','10','11','12'].map(h => (
                      <option key={h} value={h}>{h} Hr</option>
                    ))}
                  </select>
                </div>

                <div className="col-span-4">
                  <select
                    value={newMinute}
                    onChange={(e) => setNewMinute(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-semibold text-slate-900 dark:text-white"
                  >
                    {['00','05','10','15','20','25','30','35','40','45','50','55'].map(m => (
                      <option key={m} value={m}>{m} Min</option>
                    ))}
                  </select>
                </div>

                <div className="col-span-4 flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700">
                  <button
                    type="button"
                    onClick={() => setNewAmPm('AM')}
                    className={`flex-1 py-1 text-xs font-bold rounded-lg ${newAmPm === 'AM' ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900' : 'text-slate-600'}`}
                  >
                    AM
                  </button>
                  <button
                    type="button"
                    onClick={() => setNewAmPm('PM')}
                    className={`flex-1 py-1 text-xs font-bold rounded-lg ${newAmPm === 'PM' ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900' : 'text-slate-600'}`}
                  >
                    PM
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Instructions for Patient
                </label>
                <input
                  type="text"
                  value={newDosage}
                  onChange={(e) => setNewDosage(e.target.value)}
                  placeholder="e.g. Take with warm water after breakfast"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div className="flex space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddTaskModal(false)}
                  className="flex-1 py-2.5 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl text-xs font-semibold text-white bg-slate-900 dark:bg-white dark:text-slate-900 shadow-sm"
                >
                  Assign to Patient
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
