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
      text: `Namaste ${user?.name || ''}! 🙏 Main CareBot hoon — aapka All-Rounder AI Health & Recovery Companion.\n\nAap mujhse medicines, diet, surgery recovery, stress relief, exercise, ya casual conversations kuch bhi pooch sakte hain. How can I help you today?`,
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
    "Pan 40 ko kab lena chahiye?",
    "Surgery ke baad stitches ki care kaise karein?",
    "Recovery me best diet aur khana kya hai?",
    "Mood aur stress kam karne ke tips",
    "BP ki medicine kab leni chahiye?"
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
      // 🧠 High-Precision Priority Intent Parser (Bilingual English & Hinglish)
      const q = query.toLowerCase().trim();
      const isEnglish = q.includes('english') || q.includes('in english') || q.includes('speak english');
      const isHindi = q.includes('hindi') || q.includes('in hindi');

      let reply = '';

      // 1. Antacids / PPI & Painkillers (Pan 40, Pantop, Pantocid, Paracetamol, Dolo, etc.) -> Highest Priority!
      if (q.includes('pan 40') || q.includes('pantop') || q.includes('pantocid') || q.includes('pantoprazole') || q.includes('omee') || q.includes('rabeprazole') || q.includes('gas') || q.includes('acidity')) {
        if (q.includes('paracetamol') || q.includes('dolo') || q.includes('combiflam') || q.includes('crocin') || q.includes('with') || q.includes('sath') || q.includes('liya') || q.includes('take') || q.includes('rn')) {
          reply = "Haan bilkul, aap Paracetamol ke sath ya baad me Pan 40 (Pantop / Pantoprazole D) le sakte hain! In dono me koi harmful reaction nahi hota. Best yeh hota hai ki Pantop D ko khali pet ya khane se 30 min pehle liya jaye taaki pet me acidity aur jalan na ho, jabki Paracetamol khane ke baad li jati hai.";
        } else {
          reply = "Pan 40 / Pantop D acidity, pet ki gas aur ulcer se bachaane ke liye hoti hai. Isko subah khana khane se 30 minute pehle plain paani ke sath lena sabse accha hota hai.";
        }
      }
      // 2. Paracetamol / Fever / Pain Relief
      else if (q.includes('paracetamol') || q.includes('dolo') || q.includes('crocin') || q.includes('combiflam') || q.includes('pain') || q.includes('dard') || q.includes('fever') || q.includes('bukhar')) {
        reply = "Paracetamol (Dolo 650) bukhar aur dard ke liye safe hai. 24 ghante me 3 se 4 tablets se zyada na lein, do doses ke beech kam se kam 6 ghante ka gap rakhein aur hamesha khana khane ke baad lein.";
      }
      // 3. Blood Pressure
      else if (q.includes('bp') || q.includes('blood pressure') || q.includes('telma') || q.includes('amlodipine') || q.includes('hypertension')) {
        reply = "BP ki medicines (jaise Telmisartan ya Amlodipine) rozana ek hi fixed samay par subah lein taaki blood pressure stable rahe. Namak kam khayein aur readings regularly note karein.";
      }
      // 4. Diabetes & Blood Sugar
      else if (q.includes('sugar') || q.includes('diabetes') || q.includes('metformin') || q.includes('glycomet') || q.includes('insulin')) {
        reply = "Sugar ki dawaiyan (jaise Metformin) hamesha khane ke sath ya khane ke turant baad lein taaki pet kharab na ho. Glucose level check karte rahein aur meethi cheezon se parhez karein.";
      }
      // 5. Blood Thinners
      else if (q.includes('ecosprin') || q.includes('aspirin') || q.includes('blood thinner') || q.includes('clopidogrel')) {
        reply = "Ecosprin khoon patla karne ke liye hoti hai. Isko hamesha khana khane ke baad lein, khali pet bilkul na lein. Agar achanak gum bleeding ya bruising ho toh turant doctor ko consult karein.";
      }
      // 6. Post-Surgery Wounds & Stitches
      else if (q.includes('stitch') || q.includes('taanke') || q.includes('tanke') || q.includes('wound') || q.includes('bath') || q.includes('nahana') || q.includes('dressing')) {
        reply = "Surgery ke baad jab tak taanke (stitches) dry aur heal na ho jayein, unpar direct paani aur saabun lagane se bachein. Dressing ko dry rakhein aur doctor ke permission ke bina full bath na lein.";
      }
      // 7. Diet & Food
      else if (q.includes('diet') || q.includes('food') || q.includes('khana') || q.includes('parhez') || q.includes('fruit') || q.includes('kya khaye')) {
        reply = "Recovery ke dauran halka aur poshtik khana lein — jaise dalia, khichdi, moong daal soup, nariyal paani aur taaze fruits. Zyada tel-masala, fried aur bahar ka fast food avoid karein.";
      }
      // 8. Sleep & Rest Durations (15 hrs, sleeping too much, insomnia, naps)
      else if (q.includes('sleep') || q.includes('soye') || q.includes('sona') || q.includes('neend') || q.includes('hours') || q.includes('hrs') || q.includes('aaram') || q.includes('rest') || q.includes('fatigue') || q.includes('tired')) {
        if (q.includes('15') || q.includes('12') || q.includes('zyada') || q.includes('too much') || q.includes('long')) {
          reply = "Post-hospital ya surgery recovery ke dauran body tissue repair ke liye 9-11 ghante ka rest normal hai. Lekin lagataar 15 ghante bed par soye rehna blood clots (DVT) aur stiffness ka risk badha sakta hai. Isliye har 2-3 ghante me thodi der uthkar room me gentle walk karein aur hydrate rahein.";
        } else {
          reply = "Recovery ke dauran 8-9 ghante ki continuous raat ki neend aur din me 30-45 min ka power nap sabse best hota hai. Sone se pehle dim light aur comfortable posture rakhein.";
        }
      }
      // 9. Water Intake & Hydration
      else if (q.includes('water') || q.includes('paani') || q.includes('liquid') || q.includes('drink') || q.includes('hydration')) {
        reply = "Normal recovery me rozana kam se kam 2.5 se 3 litres (8-10 glass) paani peena chahiye. Yeh medicines ke toxins ko flush out karta hai aur constipation se bachata hai. (Note: Agar kidney ya heart patient hain toh doctor ki prescribed limit follow karein).";
      }
      // 10. Walking & Physical Mobility
      else if (q.includes('walk') || q.includes('chalna') || q.includes('exercise') || q.includes('stairs') || q.includes('seedhi') || q.includes('steps')) {
        reply = "Hospital discharge ke baad complete bed rest se bachein. Rozana din me 3-4 baar 10-15 minute ki gentle indoor room walking karein. Bhaari wazan uthane ya seedhi (stairs) chadhne me jaldbaazi na karein.";
      }
      // 11. Tea, Coffee & Beverages
      else if (q.includes('chai') || q.includes('tea') || q.includes('coffee') || q.includes('milk') || q.includes('doodh')) {
        reply = "Recovery me 1-2 cup light tea/milk safe hai, lekin dawai lene ke turant sath tea ya coffee na lein kyunki yeh medicine absorption ko kam kar deti hai. Dawai hamesha plain taaza paani ke sath lein.";
      }
      // 12. Emergency Symptoms
      else if (q.includes('chest') || q.includes('breath') || q.includes('seene') || q.includes('saans') || q.includes('faint') || q.includes('bleeding')) {
        reply = "⚠️ URGENT MEDICAL WARNING: Agar seene me tezz dard/dabav, saans lene me dikkat ya behoshi lag rahi hai, toh turant upar 'Emergency Pass' kholein aur emergency ambulance ya doctor se sampark karein!";
      }
      // 13. Language Switch Request
      else if (isEnglish) {
        reply = "Understood! I will now communicate in English. I'm CareBot, your AI recovery companion. How can I help you today?";
      } else if (isHindi) {
        reply = "जी बिल्कुल! अब से मैं आपसे हिंदी में बात करूँगा। बताइए आज मैं आपकी क्या सहायता कर सकता हूँ?";
      }
      // 14. Greetings
      else if (/\b(hello|hi|hey|namaste|wassup|bhai|bro|dost|good morning|good evening|good night)\b/i.test(q)) {
        reply = "Hello bhai! 🙏 Main CareBot hoon — aapka 24/7 AI health & recovery companion. Aap mujhse dawaiyon, recovery routine, sleep, diet ya koi bhi sawal pooch sakte hain. Boliye kya poochna chahte hain?";
      }
      // 15. Casual Chat / Boredom / Mood
      else if (q.includes('mood') || q.includes('bore') || q.includes('stress') || q.includes('tension') || q.includes('talk') || q.includes('baat')) {
        reply = "Main hamesha aapke sath hoon! 😊 Thoda deep breathing kijiye (4 sec saans andar, 7 sec hold, 8 sec bahar), calming music sunein aur paani piyein. Sehat aur recovery me khush rehna sabse zaroori hai!";
      }
      // 16. Universal Fallback
      else {
        reply = `Haanji, aapke sawal ke baare me: Main aapki recovery routine, sleep patterns, medicines timing, diet plans, aur daily wellness me poori madad kar sakta hoon. Aap thoda aur detail me pooch sakte hain!`;
      }

      const botMsg = {
        id: Date.now() + 1,
        sender: 'bot',
        text: reply,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, botMsg]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating Bottom-Right Chat Bubble (Bigger & Prominent) */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-7 right-7 z-40 px-6 py-4 rounded-full bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-2xl shadow-slate-900/40 hover:scale-105 active:scale-95 transition-all flex items-center space-x-3 group border border-slate-700/60 dark:border-slate-300"
        >
          <div className="relative">
            <Bot className="w-7 h-7 text-indigo-400 dark:text-indigo-600 group-hover:rotate-12 transition-transform" />
            <span className="w-3 h-3 rounded-full bg-emerald-500 absolute -top-1 -right-1 border-2 border-slate-900 dark:border-white animate-pulse" />
          </div>
          <span className="text-sm font-bold font-mono tracking-wider">CareBot AI</span>
        </button>
      )}

      {/* Slide-Up Interactive AI Chat Drawer */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 w-[calc(100vw-2rem)] sm:w-[480px] h-[660px] max-h-[88vh] bg-white/95 dark:bg-slate-900/95 backdrop-blur-2xl border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-200">
          
          {/* Header */}
          <div className="p-4 sm:p-5 bg-slate-900 text-white dark:bg-slate-950 flex items-center justify-between border-b border-slate-800">
            <div className="flex items-center space-x-3">
              <div className="p-2.5 bg-indigo-600/30 rounded-2xl border border-indigo-500/40 text-indigo-400">
                <Bot className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <h3 className="text-base font-bold text-white font-sans">CareBot AI</h3>
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono bg-indigo-500/30 text-indigo-300 font-semibold border border-indigo-500/40">
                    All-Rounder AI
                  </span>
                </div>
                <p className="text-xs text-slate-400">Health, Wellness &amp; Recovery Companion</p>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="p-2.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Chat Messages List */}
          <div className="flex-1 p-5 overflow-y-auto space-y-4 text-sm">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] p-4 rounded-2xl space-y-1.5 ${
                    m.sender === 'user'
                      ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 rounded-tr-sm shadow-md'
                      : 'bg-slate-100 dark:bg-slate-800/90 text-slate-800 dark:text-slate-200 rounded-tl-sm border border-slate-200/60 dark:border-slate-700/60 shadow-sm'
                  }`}
                >
                  <p className="leading-relaxed text-[13px] sm:text-sm whitespace-pre-wrap">{m.text}</p>
                  <span
                    className={`block text-[11px] text-right font-mono ${
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
                <div className="p-3.5 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-500 flex items-center space-x-2.5">
                  <RefreshCw className="w-4 h-4 animate-spin text-indigo-500" />
                  <span className="text-xs font-medium">CareBot is formulating clinical response...</span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Suggestions Chips */}
          {messages.length <= 2 && (
            <div className="px-5 py-2.5 border-t border-slate-100 dark:border-slate-800/80 bg-slate-50/60 dark:bg-slate-900/60">
              <span className="text-[11px] font-mono uppercase text-slate-400 font-bold block mb-2">
                Suggested Questions:
              </span>
              <div className="flex flex-wrap gap-2">
                {SUGGESTIONS.map((s, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSendMessage(s)}
                    className="text-xs px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-indigo-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors text-left font-medium"
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
            className="p-4 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 flex items-center space-x-2.5"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask CareBot about medicines, diet, precautions..."
              className="flex-1 px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-slate-100"
            />
            <button
              type="submit"
              disabled={!input.trim() || loading}
              className="p-3 rounded-2xl bg-slate-900 text-white dark:bg-white dark:text-slate-900 hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-md"
            >
              <Send className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </form>

        </div>
      )}
    </>
  );
};
