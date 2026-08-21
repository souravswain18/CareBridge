import React, { useState, useRef, useEffect } from 'react';
import { 
  Bot, 
  X, 
  Send, 
  Sparkles, 
  MessageSquare, 
  ShieldAlert, 
  HelpCircle, 
  Activity,
  HeartPulse,
  RefreshCw
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { APP_CONFIG } from '../config';

export const CareBot = () => {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  
  const [messages, setMessages] = useState(() => [
    {
      id: 1,
      sender: 'bot',
      text: `Namaste ${user?.name || ''}! 🙏 I am CareBot, your AI Recovery & Medication Companion.\n\nAap mujhse English, Hindi ya Hinglish me apni dawaiyon, surgery ke baad recovery, parhez ya diet ke baare me kuch bhi pooch sakte hain. How can I help you today?`,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  // Suggested Quick Chips (Bilingual English & Hinglish)
  const SUGGESTIONS = [
    "BP ki dawai khali pet leni chahiye?",
    "Can I take Paracetamol with other meds?",
    "Operation ke baad nahana kab safe hai?",
    "Foods to avoid during recovery?"
  ];

  const handleSendMessage = async (textToSend) => {
    const query = textToSend || input;
    if (!query.trim() || loading) return;

    const userMsg = {
      id: Date.now(),
      sender: 'user',
      text: query.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      // Collect Patient Context (Medications & Profile)
      const userEmail = user?.email || 'patient';
      const savedMeds = JSON.parse(localStorage.getItem(`carebridge_reminders_${userEmail}`) || '[]');
      const savedProfile = JSON.parse(localStorage.getItem(`carebridge_profile_${userEmail}`) || '{}');
      
      const contextString = `Patient Name: ${user?.name}, Blood Group: ${savedProfile.bloodGroup || 'N/A'}, Allergies: ${savedProfile.allergies || 'None'}, Condition: ${savedProfile.condition || 'Post-Hospital Recovery'}, Active Medicines: ${savedMeds.map(m => m.name).join(', ')}`;

      const response = await fetch(`${APP_CONFIG.apiUrl}/ai/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          message: query.trim(),
          context: contextString
        })
      });

      if (response.ok) {
        const data = await response.json();
        const botMsg = {
          id: Date.now() + 1,
          sender: 'bot',
          text: data.reply,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setMessages(prev => [...prev, botMsg]);
      } else {
        throw new Error('API request failed');
      }
    } catch (err) {
      // Smart Multi-lingual Clinical Fallback
      const qLower = query.toLowerCase();
      let replyHinglish = '';

      if (qLower.includes('bp') || qLower.includes('blood pressure') || qLower.includes('khali pet')) {
        replyHinglish = "BP ki zyadatar dawaiyan (jaise Telmisartan ya Amlodipine) subah nashte se pehle ya baad me ek nishchit samay par plain paani ke sath leni chahiye. Dawai ka samay daily same rakhein taaki BP stable rahe.";
      } else if (qLower.includes('nahana') || qLower.includes('shower') || qLower.includes('stitch') || qLower.includes('tanke') || qLower.includes('wound')) {
        replyHinglish = "Surgery ke baad jab tak stitches (taanke) dry aur clean na ho jayein, direct paani dalne se bachein. Doctor ke kehne par hi sponge bath ya waterproof dressing ke sath nahayein.";
      } else if (qLower.includes('paracetamol') || qLower.includes('dolo') || qLower.includes('dard') || qLower.includes('pain')) {
        replyHinglish = "Paracetamol (Dolo 650) dard ya bukhar ke liye safe hai, lekin din me 3 se zyada tablets na lein aur do doses ke beech kam se kam 6 ghante ka gap rakhein.";
      } else if (qLower.includes('parhez') || qLower.includes('food') || qLower.includes('diet') || qLower.includes('khana')) {
        replyHinglish = "Recovery ke dauran halka, taaza aur poshtik khana lein (jaise khichdi, daal, hari sabziyan). Zyada namak, refined sugar, oily aur bahar ke khane se bachein taaki healing tezi se ho.";
      } else if (qLower.includes('chest') || qLower.includes('dard') || qLower.includes('seene') || qLower.includes('saans') || qLower.includes('breath')) {
        replyHinglish = "⚠️ Dhyan dein: Agar seene me tezz dard ya saans lene me takleef ho rahi hai, toh turant upar 'Emergency Pass' open karein aur doctor ya hospital se sampark karein!";
      } else {
        replyHinglish = `Aapke sawal "${query.trim()}" ke baare me: Apni prescribed dawaiyan samay par lein, khoob paani piyein aur aaram karein. Kisi bhi vishesh dikkat par turant apne attending doctor se consult karein.`;
      }

      const botMsg = {
        id: Date.now() + 1,
        sender: 'bot',
        text: replyHinglish,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, botMsg]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating Bottom-Right Chat Bubble */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-40 p-4 rounded-3xl bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-2xl shadow-slate-900/30 hover:scale-105 active:scale-95 transition-all flex items-center space-x-2.5 group border border-slate-700/50"
        >
          <div className="relative">
            <Bot className="w-6 h-6 text-indigo-400 dark:text-indigo-600 group-hover:rotate-12 transition-transform" />
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 absolute -top-1 -right-1 border-2 border-slate-900 dark:border-white animate-pulse" />
          </div>
          <span className="text-xs font-bold font-mono tracking-wider pr-1">CareBot AI</span>
        </button>
      )}

      {/* Slide-Up Interactive AI Chat Drawer */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 w-full max-w-sm sm:max-w-md h-[560px] max-h-[85vh] bg-white/95 dark:bg-slate-900/95 backdrop-blur-2xl border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-200">
          
          {/* Header */}
          <div className="p-4 sm:p-5 bg-slate-900 text-white dark:bg-slate-950 flex items-center justify-between border-b border-slate-800">
            <div className="flex items-center space-x-3">
              <div className="p-2.5 bg-indigo-600/30 rounded-2xl border border-indigo-500/40 text-indigo-400">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <h3 className="text-sm font-bold text-white font-sans">CareBot</h3>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-emerald-500/20 text-emerald-300 font-semibold border border-emerald-500/30">
                    Clinical AI
                  </span>
                </div>
                <p className="text-[11px] text-slate-400">Recovery &amp; Medication Q&amp;A</p>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Chat Messages List */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 text-xs">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[82%] p-3.5 rounded-2xl space-y-1 ${
                    m.sender === 'user'
                      ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 rounded-tr-sm'
                      : 'bg-slate-100 dark:bg-slate-800/90 text-slate-800 dark:text-slate-200 rounded-tl-sm border border-slate-200/60 dark:border-slate-700/60'
                  }`}
                >
                  <p className="leading-relaxed whitespace-pre-wrap">{m.text}</p>
                  <span
                    className={`block text-[10px] text-right font-mono ${
                      m.sender === 'user' ? 'opacity-60' : 'text-slate-400'
                    }`}
                  >
                    {m.time}
                  </span>
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex justify-start">
                <div className="p-3 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-500 flex items-center space-x-2">
                  <RefreshCw className="w-3.5 h-3.5 animate-spin text-indigo-500" />
                  <span className="text-[11px]">CareBot is formulating clinical response...</span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Suggestions Chips */}
          {messages.length <= 2 && (
            <div className="px-4 py-2 border-t border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/50">
              <span className="text-[10px] font-mono uppercase text-slate-400 font-bold block mb-1.5">
                Suggested Questions:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {SUGGESTIONS.map((s, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSendMessage(s)}
                    className="text-[11px] px-2.5 py-1 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-indigo-400 transition-colors text-left"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input Box */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="p-3 sm:p-4 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex items-center space-x-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask CareBot about medicines, diet, symptoms..."
              disabled={loading}
              className="flex-1 px-3.5 py-2.5 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-slate-800"
            />

            <button
              type="submit"
              disabled={!input.trim() || loading}
              className="p-2.5 rounded-2xl bg-slate-900 text-white dark:bg-white dark:text-slate-900 disabled:opacity-40 hover:scale-105 active:scale-95 transition-all shadow-md"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>

        </div>
      )}
    </>
  );
};
