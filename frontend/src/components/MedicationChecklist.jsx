import React, { useState, useRef, useEffect } from 'react';
import { 
  Check, 
  Clock, 
  Pill, 
  Calendar, 
  Plus, 
  Inbox, 
  Sparkles, 
  Search,
  Trash2,
  Bell,
  Volume2,
  VolumeX,
  AlertTriangle
} from 'lucide-react';
import { MASTER_MEDICINES } from '../data/medicinesData';

export const MedicationChecklist = ({ reminders, onToggleComplete, onAddReminder, onDeleteReminder }) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDosage, setNewDosage] = useState('');
  const [newHour, setNewHour] = useState('08');
  const [newMinute, setNewMinute] = useState('00');
  const [newAmPm, setNewAmPm] = useState('AM');
  const [newType, setNewType] = useState('MEDICINE');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [alarmActive, setAlarmActive] = useState(false);
  const [alarmDismissed, setAlarmDismissed] = useState(false);

  // Synthesized Web Audio API Beep Alarm (Works seamlessly on all browsers & phones without external audio files)
  const playAlarmSound = () => {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return;
      const ctx = new AudioContext();
      
      const playBeep = (freq, start, duration) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.value = freq;
        gain.gain.setValueAtTime(0.3, ctx.currentTime + start);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + start + duration);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + start);
        osc.stop(ctx.currentTime + start + duration);
      };

      // Medical pulse chime pattern (Beep-Beep-Beep)
      playBeep(880, 0, 0.2);
      playBeep(880, 0.25, 0.2);
      playBeep(1046.5, 0.5, 0.4);
    } catch (e) {
      console.log('Audio chime note:', e);
    }
  };

  // Check for missed / due reminders
  const overdueCount = reminders.filter(r => !r.isCompleted).length;

  useEffect(() => {
    // If there are pending uncompleted reminders, sound the alert gently
    if (overdueCount > 0 && !alarmDismissed) {
      setAlarmActive(true);
    } else {
      setAlarmActive(false);
    }
  }, [overdueCount, alarmDismissed]);

  useEffect(() => {
    if (newTitle.trim().length > 0) {
      const query = newTitle.toLowerCase();
      const filtered = MASTER_MEDICINES.filter(m =>
        m.name.toLowerCase().includes(query) || m.dosage.toLowerCase().includes(query)
      );
      setSuggestions(filtered.slice(0, 10)); // Top 10 matching results
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

  const handleAdd = (e) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const formattedTime = `${newHour}:${newMinute} ${newAmPm}`;

    onAddReminder({
      id: Date.now(),
      title: newTitle,
      dosageNotes: newDosage,
      time: formattedTime,
      type: newType,
      isCompleted: false,
      scheduledTime: new Date().toISOString()
    });

    setNewTitle('');
    setNewDosage('');
    setShowAddModal(false);
  };

  return (
    <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl p-6 sm:p-8 rounded-3xl border border-white/80 dark:border-slate-800 shadow-xl shadow-slate-900/5 space-y-6">
      
      {/* Card Header */}
      <div className="flex items-center justify-between">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-amber-700 dark:text-amber-400">
            Active Routine
          </span>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            Today's Care Schedule
          </h2>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100 rounded-xl transition-all shadow-sm flex items-center space-x-1.5"
        >
          <Plus className="w-4 h-4" />
          <span>Add Task</span>
        </button>
      </div>

      {/* Missed Medicine / Due Active Alarm Banner */}
      {alarmActive && (
        <div className="p-4 bg-rose-500/10 border-2 border-rose-500/80 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-pulse">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-rose-600 text-white rounded-xl shadow-md">
              <Bell className="w-5 h-5 animate-bounce" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-rose-700 dark:text-rose-300">
                🔔 Medication Alarm Due ({overdueCount} Pending Doses)
              </h4>
              <p className="text-xs text-rose-600/90 dark:text-rose-400">
                20-min grace active. Please mark your doses as taken to prevent automated caregiver escalation!
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={playAlarmSound}
              className="px-3.5 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl transition-all shadow-sm flex items-center space-x-1.5"
            >
              <Volume2 className="w-4 h-4" />
              <span>Play Alarm</span>
            </button>
            <button
              onClick={() => setAlarmDismissed(true)}
              className="px-3 py-2 text-xs font-semibold text-rose-700 dark:text-rose-300 hover:bg-rose-100 dark:hover:bg-rose-950/60 rounded-xl transition-all"
            >
              Snooze
            </button>
          </div>
        </div>
      )}

      {/* 20-Min Grace Explanation Pill */}
      <div className="p-3.5 bg-amber-50/80 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/80 rounded-2xl flex items-center space-x-3 text-xs text-amber-900 dark:text-amber-200">
        <Clock className="w-4 h-4 text-amber-600 shrink-0" />
        <span>
          <strong>20-Minute Safety Net:</strong> Reminders provide a 20-min grace period. Unmarked doses trigger an automated caregiver notice.
        </span>
      </div>

      {/* Empty State vs Task List */}
      {reminders.length === 0 ? (
        <div className="py-10 text-center space-y-3 bg-slate-50/60 dark:bg-slate-800/40 rounded-2xl border border-dashed border-slate-200 dark:border-slate-700">
          <div className="w-10 h-10 mx-auto rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400">
            <Inbox className="w-5 h-5" />
          </div>
          <div className="space-y-1">
            <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-200">No scheduled tasks yet</h4>
            <p className="text-xs text-slate-500 max-w-xs mx-auto">
              Click <strong className="text-slate-800 dark:text-slate-100">"+ Add Task"</strong> above to schedule your daily medicines or checkups.
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {reminders.map((item) => (
            <div
              key={item.id}
              className={`p-4 rounded-2xl border transition-all flex items-center justify-between ${
                item.isCompleted
                  ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-900/60 opacity-80'
                  : 'bg-white dark:bg-slate-800/90 border-slate-200/90 dark:border-slate-700/80 shadow-sm'
              }`}
            >
              <div className="flex items-start space-x-3.5 flex-1 pr-3">
                <div className={`p-2.5 rounded-xl ${
                  item.isCompleted 
                    ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300' 
                    : item.type === 'CHECKUP' 
                      ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300' 
                      : 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300'
                }`}>
                  {item.type === 'CHECKUP' ? <Calendar className="w-5 h-5" /> : <Pill className="w-5 h-5" />}
                </div>

                <div>
                  <div className="flex items-center space-x-2">
                    <h4 className={`text-sm font-bold ${
                      item.isCompleted ? 'line-through text-slate-500 dark:text-slate-400' : 'text-slate-900 dark:text-white'
                    }`}>
                      {item.title}
                    </h4>
                    <span className="text-[11px] font-mono font-semibold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200">
                      {item.time}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    {item.dosageNotes || 'Take as instructed'}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => onToggleComplete(item.id)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 ${
                    item.isCompleted
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-600'
                  }`}
                >
                  {item.isCompleted ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Taken</span>
                    </>
                  ) : (
                    <span>Mark Taken</span>
                  )}
                </button>

                <button
                  onClick={() => onDeleteReminder(item.id)}
                  className="p-2 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl transition-colors"
                  title="Delete Reminder"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Task Modal with 100+ Medicine Autocomplete Catalog */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl max-w-md w-full border border-slate-200 dark:border-slate-800 shadow-2xl space-y-5">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Add Care Task / Medicine</h3>
              <span className="text-[10px] font-semibold text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-950/60 px-2 py-0.5 rounded-full border border-teal-200 flex items-center">
                <Sparkles className="w-3 h-3 mr-1" /> 100+ Clinical Catalog
              </span>
            </div>
            
            <form onSubmit={handleAdd} className="space-y-4">
              
              {/* Medicine Name Input */}
              <div className="relative">
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Medicine / Task Name
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="Search e.g. Dolo, Pan-D, Glycomet, Shelcal, Foracort..."
                    className="w-full pl-3.5 pr-8 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-slate-800 text-slate-900 dark:text-white"
                  />
                  <Search className="w-4 h-4 text-slate-400 absolute right-3 top-3 pointer-events-none" />
                </div>

                {/* Suggestions List */}
                {showSuggestions && suggestions.length > 0 && (
                  <div className="absolute left-0 right-0 top-full mt-1.5 z-50 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-2xl max-h-52 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-700/60">
                    {suggestions.map((item, idx) => (
                      <div
                        key={idx}
                        onClick={() => handleSelectSuggestion(item)}
                        className="p-3 hover:bg-slate-100 dark:hover:bg-slate-700/80 cursor-pointer transition-colors space-y-0.5"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-slate-900 dark:text-white">
                            {item.name}
                          </span>
                          <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                            {item.type}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                          {item.dosage}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* 12-Hour AM / PM Time Selector */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Scheduled Time (12-Hour AM/PM)
                </label>
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
                      className={`flex-1 py-1 text-xs font-bold rounded-lg transition-all ${
                        newAmPm === 'AM' 
                          ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-sm' 
                          : 'text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      AM
                    </button>
                    <button
                      type="button"
                      onClick={() => setNewAmPm('PM')}
                      className={`flex-1 py-1 text-xs font-bold rounded-lg transition-all ${
                        newAmPm === 'PM' 
                          ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-sm' 
                          : 'text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      PM
                    </button>
                  </div>

                </div>
              </div>

              {/* Task Type */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Type
                </label>
                <select
                  value={newType}
                  onChange={(e) => setNewType(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white font-medium"
                >
                  <option value="MEDICINE">Medicine</option>
                  <option value="CHECKUP">Doctor Checkup</option>
                  <option value="LAB_TEST">Lab Test</option>
                </select>
              </div>

              {/* Instructions */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Dosage / Instructions
                </label>
                <input
                  type="text"
                  value={newDosage}
                  onChange={(e) => setNewDosage(e.target.value)}
                  placeholder="e.g. 1 Tablet after breakfast"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div className="flex space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-2.5 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 dark:bg-white dark:text-slate-900 transition-colors shadow-sm"
                >
                  Save Schedule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
