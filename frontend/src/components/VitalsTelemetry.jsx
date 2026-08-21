import React, { useState } from 'react';
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
import { HeartPulse, Plus, Clock, Activity } from 'lucide-react';

export const VitalsTelemetry = ({ vitalsData, onLogVital }) => {
  const [activeTab, setActiveTab] = useState('BP'); // 'BP' or 'SUGAR'
  const [showLogModal, setShowLogModal] = useState(false);
  const [systolic, setSystolic] = useState(120);
  const [diastolic, setDiastolic] = useState(80);
  const [sugar, setSugar] = useState(110);
  const [lastUpdated, setLastUpdated] = useState('Just now');

  const handleSaveVital = (e) => {
    e.preventDefault();
    const timeLabel = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    if (activeTab === 'BP') {
      onLogVital({
        date: timeLabel,
        systolic: Number(systolic),
        diastolic: Number(diastolic),
        sugar: sugar
      });
    } else {
      onLogVital({
        date: timeLabel,
        systolic: systolic,
        diastolic: diastolic,
        sugar: Number(sugar)
      });
    }
    setLastUpdated('Just now');
    setShowLogModal(false);
  };

  return (
    <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl p-6 sm:p-8 rounded-3xl border border-white/80 dark:border-slate-800 shadow-xl shadow-slate-900/5 space-y-6">
      
      {/* Header & Mode Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-rose-600 dark:text-rose-400">
              Health Telemetry
            </span>
            <span className="text-slate-400">•</span>
            <span className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center">
              <Clock className="w-3 h-3 mr-1" />
              Last updated: {lastUpdated}
            </span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            Recovery Trend Curves
          </h2>
        </div>

        <div className="flex items-center space-x-2">
          {/* Tab Switcher */}
          <div className="p-1 bg-slate-200/60 dark:bg-slate-800/80 rounded-xl flex space-x-1 border border-slate-200/60">
            <button
              onClick={() => setActiveTab('BP')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'BP'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              Blood Pressure
            </button>
            <button
              onClick={() => setActiveTab('SUGAR')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'SUGAR'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              Blood Sugar
            </button>
          </div>

          <button
            onClick={() => setShowLogModal(true)}
            className="p-2 bg-slate-900 hover:bg-slate-800 dark:bg-white dark:text-slate-900 text-white rounded-xl transition-all shadow-sm"
            title="Log New Reading"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Recharts Trend Graph */}
      <div className="h-64 w-full pt-2">
        {vitalsData.length === 0 ? (
          <div className="h-full flex items-center justify-center border border-dashed border-slate-200 dark:border-slate-700 rounded-2xl text-xs text-slate-400">
            No vitals logged today. Click '+' to record your first reading.
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={vitalsData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
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

      {/* Log Modal with Direct Numeric Typing Input + Synchronized Sliders */}
      {showLogModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl max-w-sm w-full border border-slate-200 dark:border-slate-800 shadow-2xl space-y-5">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Log Today's Vital</h3>
            
            <form onSubmit={handleSaveVital} className="space-y-4">
              {activeTab === 'BP' ? (
                <>
                  {/* Systolic */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center">
                      <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                        Systolic (Upper) mmHg
                      </label>
                      <input
                        type="number"
                        min="70"
                        max="220"
                        value={systolic}
                        onChange={(e) => setSystolic(e.target.value)}
                        className="w-16 px-2 py-1 text-center font-bold text-sm text-red-600 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                      />
                    </div>
                    <input 
                      type="range" 
                      min="80" 
                      max="200" 
                      value={systolic} 
                      onChange={(e) => setSystolic(e.target.value)} 
                      className="w-full accent-red-600 cursor-pointer"
                    />
                  </div>

                  {/* Diastolic */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center">
                      <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                        Diastolic (Lower) mmHg
                      </label>
                      <input
                        type="number"
                        min="40"
                        max="140"
                        value={diastolic}
                        onChange={(e) => setDiastolic(e.target.value)}
                        className="w-16 px-2 py-1 text-center font-bold text-sm text-amber-600 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                      />
                    </div>
                    <input 
                      type="range" 
                      min="50" 
                      max="130" 
                      value={diastolic} 
                      onChange={(e) => setDiastolic(e.target.value)} 
                      className="w-full accent-amber-600 cursor-pointer"
                    />
                  </div>
                </>
              ) : (
                /* Blood Sugar */
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                      Blood Sugar (mg/dL)
                    </label>
                    <input
                      type="number"
                      min="50"
                      max="400"
                      value={sugar}
                      onChange={(e) => setSugar(e.target.value)}
                      className="w-20 px-2 py-1 text-center font-bold text-sm text-blue-600 bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <input 
                    type="range" 
                    min="60" 
                    max="300" 
                    value={sugar} 
                    onChange={(e) => setSugar(e.target.value)} 
                    className="w-full accent-blue-600 cursor-pointer"
                  />
                </div>
              )}

              <div className="flex space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowLogModal(false)}
                  className="flex-1 py-2.5 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 dark:bg-white dark:text-slate-900 transition-colors shadow-sm"
                >
                  Save Reading
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
