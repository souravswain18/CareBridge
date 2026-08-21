import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  ShieldAlert, 
  HeartPulse, 
  Phone, 
  AlertTriangle, 
  Pill, 
  MapPin, 
  Hospital, 
  Clock, 
  CheckCircle2, 
  ChevronRight, 
  FileText,
  Ambulance,
  Building2,
  ExternalLink
} from 'lucide-react';

export const EmergencyHealthCard = () => {
  const { qrToken } = useParams();
  const [activeTab, setActiveTab] = useState('SNAPSHOT'); // 'SNAPSHOT' or 'HOSPITALS'

  // Nearby Verified Emergency Trauma Centers
  const NEARBY_HOSPITALS = [
    {
      name: 'Apollo Hospital & Trauma Emergency',
      distance: '1.8 km (6 mins away)',
      type: 'Level 1 Trauma & Cardiac ICU',
      phone: '+91 99991 12233',
      address: 'Plot 15, Health City Road, Sector 4',
      icuBedsAvailable: '4 Critical Beds Free',
      emergencyReady: true
    },
    {
      name: 'Max Super Speciality Hospital',
      distance: '3.4 km (11 mins away)',
      type: 'Multi-Speciality Emergency & Stroke Unit',
      phone: '+91 99994 45566',
      address: 'Ring Road Junction, Near Metro Pillar 142',
      icuBedsAvailable: '2 Critical Beds Free',
      emergencyReady: true
    },
    {
      name: 'Fortis Escorts Heart & Trauma Institute',
      distance: '5.2 km (16 mins away)',
      type: '24/7 Cardiac Catheterization & Resuscitation',
      phone: '+91 99997 78899',
      address: 'Okhla Road Complex, Phase 2',
      icuBedsAvailable: 'Available on triage',
      emergencyReady: true
    }
  ];

  const handleCallSOS = () => {
    window.location.href = 'tel:+919876543210';
  };

  const handleCallHospital = (phone) => {
    window.location.href = `tel:${phone}`;
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      
      {/* 🚨 Emergency Top Banner */}
      <div className="p-5 sm:p-6 rounded-3xl bg-rose-600 text-white shadow-xl shadow-rose-600/20 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start space-x-3.5">
            <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-md shrink-0">
              <ShieldAlert className="w-8 h-8 text-white" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-[11px] font-mono font-black uppercase px-2 py-0.5 rounded-full bg-white/20 tracking-wider">
                  OFFICIAL EMERGENCY HEALTH PASS
                </span>
                <span className="text-xs font-mono opacity-80">TOKEN: {qrToken || 'CB-7821'}</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight mt-1">
                Medical Bystander &amp; Responder Pass
              </h1>
              <p className="text-xs text-rose-100 mt-0.5">
                No authentication required. Verified post-hospital recovery clinical profile.
              </p>
            </div>
          </div>

          <button
            onClick={handleCallSOS}
            className="px-6 py-3.5 rounded-2xl text-xs font-black uppercase tracking-wider bg-white text-rose-600 hover:bg-rose-50 transition-all shadow-lg flex items-center justify-center space-x-2 shrink-0 animate-bounce"
          >
            <Phone className="w-4 h-4 text-rose-600 fill-rose-600" />
            <span>Call Family Guardian (SOS)</span>
          </button>
        </div>
      </div>

      {/* Mode Switcher: Health Snapshot vs Nearby Hospital Triage */}
      <div className="flex bg-slate-200/60 dark:bg-slate-800/80 p-1.5 rounded-2xl max-w-sm mx-auto border border-slate-200/60">
        <button
          onClick={() => setActiveTab('SNAPSHOT')}
          className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-1.5 ${
            activeTab === 'SNAPSHOT'
              ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-md'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
          }`}
        >
          <HeartPulse className="w-4 h-4" />
          <span>Patient Snapshot</span>
        </button>
        <button
          onClick={() => setActiveTab('HOSPITALS')}
          className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-1.5 ${
            activeTab === 'HOSPITALS'
              ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-md'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
          }`}
        >
          <Hospital className="w-4 h-4" />
          <span>Nearby Hospital Triage</span>
        </button>
      </div>

      {activeTab === 'SNAPSHOT' ? (
        /* Patient Clinical Snapshot */
        <div className="space-y-6">
          
          {/* Critical Highlights (Blood Group, Allergies, Guardian) */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            
            {/* Blood Group */}
            <div className="p-5 rounded-3xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-white/80 dark:border-slate-800 shadow-xl shadow-slate-900/5 text-center space-y-1">
              <span className="text-[11px] font-mono font-bold uppercase text-slate-400">Blood Group</span>
              <p className="text-3xl font-black text-rose-600 dark:text-rose-400">O+ Positive</p>
              <span className="text-[10px] text-slate-500">Universal Compatible Donor Ready</span>
            </div>

            {/* Critical Allergies */}
            <div className="p-5 rounded-3xl bg-amber-500/10 dark:bg-amber-950/30 backdrop-blur-xl border border-amber-300 dark:border-amber-800 shadow-xl shadow-amber-500/5 space-y-1 text-center">
              <span className="text-[11px] font-mono font-bold uppercase text-amber-700 dark:text-amber-400 flex items-center justify-center space-x-1">
                <AlertTriangle className="w-3.5 h-3.5 mr-1" />
                Severe Allergies
              </span>
              <p className="text-lg font-black text-amber-900 dark:text-amber-200">PENICILLIN &amp; SULFA</p>
              <span className="text-[10px] text-amber-800/80 dark:text-amber-300">Avoid Beta-lactam antibiotics</span>
            </div>

            {/* Guardian Contact */}
            <div className="p-5 rounded-3xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-white/80 dark:border-slate-800 shadow-xl shadow-slate-900/5 space-y-1 text-center">
              <span className="text-[11px] font-mono font-bold uppercase text-slate-400">Primary Caregiver</span>
              <p className="text-base font-bold text-slate-900 dark:text-white">Sourav (Son)</p>
              <p className="text-xs font-mono text-emerald-600 dark:text-emerald-400 font-semibold">+91 98765 43210</p>
            </div>

          </div>

          {/* Active Post-Hospital Medical Conditions & Regimen */}
          <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl p-6 sm:p-8 rounded-3xl border border-white/80 dark:border-slate-800 shadow-xl shadow-slate-900/5 space-y-6">
            
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-rose-600 dark:text-rose-400">
                Clinical Context
              </span>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                Active Post-Hospital Diagnoses
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-1">
                <h4 className="text-xs font-bold text-slate-900 dark:text-white">Post-Op Knee Arthroplasty (Right)</h4>
                <p className="text-[11px] text-slate-500">Day 12 of 30 recovery window. Wound dressing active.</p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-1">
                <h4 className="text-xs font-bold text-slate-900 dark:text-white">Hypertension &amp; Type-2 Diabetes</h4>
                <p className="text-[11px] text-slate-500">Maintained on daily morning ARB &amp; Metformin therapy.</p>
              </div>
            </div>

            {/* Prescribed Active Medicines */}
            <div className="space-y-3 pt-2">
              <h4 className="text-xs font-mono font-bold uppercase text-slate-500 flex items-center space-x-1">
                <Pill className="w-3.5 h-3.5 mr-1" />
                Current Prescribed Regimen
              </h4>

              <div className="space-y-2">
                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-center justify-between">
                  <div>
                    <h5 className="text-xs font-bold text-slate-900 dark:text-white">Telmisartan 40mg (Telma)</h5>
                    <span className="text-[10px] text-slate-500">1 Tablet daily before breakfast • Blood Pressure</span>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-semibold">
                    ACTIVE
                  </span>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-center justify-between">
                  <div>
                    <h5 className="text-xs font-bold text-slate-900 dark:text-white">Ecosprin 75mg (Aspirin)</h5>
                    <span className="text-[10px] text-slate-500">1 Tablet with dinner • Blood Thinner</span>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 font-semibold">
                    CAUTION: BLOOD THINNER
                  </span>
                </div>
              </div>
            </div>

          </div>

        </div>
      ) : (
        /* Nearby Hospital Triage Navigator */
        <div className="space-y-4">
          <div className="p-4 bg-indigo-50/80 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 rounded-2xl text-xs text-indigo-900 dark:text-indigo-200 flex items-center space-x-2">
            <Ambulance className="w-4 h-4 text-indigo-600 shrink-0" />
            <span>
              <strong>Emergency Dispatch:</strong> Sorted by distance and 24/7 Critical Cardiac/Trauma ICU readiness.
            </span>
          </div>

          <div className="space-y-4">
            {NEARBY_HOSPITALS.map((h, i) => (
              <div
                key={i}
                className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl p-6 rounded-3xl border border-white/80 dark:border-slate-800 shadow-xl shadow-slate-900/5 space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center space-x-2">
                      <h3 className="text-base font-bold text-slate-900 dark:text-white">
                        {h.name}
                      </h3>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                        {h.icuBedsAvailable}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5 flex items-center space-x-2">
                      <span className="font-semibold text-indigo-600 dark:text-indigo-400">{h.distance}</span>
                      <span>•</span>
                      <span>{h.type}</span>
                    </p>
                    <p className="text-[11px] text-slate-400 mt-1 flex items-center">
                      <MapPin className="w-3 h-3 mr-1 text-slate-400" />
                      {h.address}
                    </p>
                  </div>

                  <div className="flex items-center space-x-2 shrink-0">
                    <button
                      onClick={() => handleCallHospital(h.phone)}
                      className="px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 dark:bg-white dark:text-slate-900 transition-all shadow-sm flex items-center space-x-1.5"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      <span>Call ER: {h.phone}</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Footer Return Navigation */}
      <div className="text-center pt-4">
        <Link 
          to="/"
          className="text-xs font-semibold text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"
        >
          ← Return to CareBridge Home
        </Link>
      </div>

    </div>
  );
};

export default EmergencyHealthCard;
