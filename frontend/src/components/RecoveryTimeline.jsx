import React from 'react';
import { CheckCircle2, Circle, Clock, Activity, Flag } from 'lucide-react';

export const RecoveryTimeline = ({ milestones }) => {
  return (
    <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl p-6 sm:p-8 rounded-3xl border border-white/80 dark:border-slate-800 shadow-xl shadow-slate-900/5 space-y-6">
      
      <div>
        <span className="text-xs font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
          Post-Discharge Path
        </span>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">
          Recovery Journey Milestones
        </h2>
      </div>

      {/* Vertical Timeline Track */}
      <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200 dark:before:bg-slate-700">
        {milestones.map((m, idx) => (
          <div key={idx} className="relative flex items-start space-x-3.5">
            {/* Timeline Dot */}
            <div className={`absolute -left-6 mt-1 w-5 h-5 rounded-full flex items-center justify-center ${
              m.completed 
                ? 'bg-emerald-500 text-white shadow-sm ring-4 ring-emerald-100 dark:ring-emerald-950' 
                : m.current
                  ? 'bg-amber-500 text-white ring-4 ring-amber-100 dark:ring-amber-950 animate-pulse'
                  : 'bg-slate-200 dark:bg-slate-700 text-slate-400'
            }`}>
              {m.completed ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Circle className="w-2.5 h-2.5" />}
            </div>

            <div className="flex-1 bg-white/90 dark:bg-slate-800/90 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 shadow-sm">
              <div className="flex justify-between items-center">
                <span className="text-xs font-mono font-bold text-slate-500 dark:text-slate-400">
                  {m.dayTag}
                </span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md uppercase ${
                  m.completed 
                    ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' 
                    : m.current 
                      ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300' 
                      : 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300'
                }`}>
                  {m.completed ? 'Completed' : m.current ? 'In Progress' : 'Upcoming'}
                </span>
              </div>

              <h4 className="text-sm font-bold text-slate-900 dark:text-white mt-1">
                {m.title}
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5 leading-relaxed">
                {m.description}
              </p>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
