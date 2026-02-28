/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Droplets, 
  Plus, 
  Settings, 
  History as HistoryIcon, 
  Bell, 
  BellOff, 
  User, 
  ChevronLeft,
  CheckCircle2,
  Trophy,
  Moon,
  Sun
} from 'lucide-react';
import { format, subDays, startOfDay } from 'date-fns';
import { ptBR, es, enUS } from 'date-fns/locale';
import { 
  cn, 
  UserProfile, 
  WaterEntry, 
  DailyHistory, 
  STORAGE_KEYS, 
  MOTIVATIONAL_MESSAGES,
  TRANSLATIONS,
  Language
} from './types';

// --- Components ---

const ProgressBar = ({ progress }: { progress: number }) => {
  const clampedProgress = Math.min(100, Math.max(0, progress));
  
  return (
    <div className="relative w-full h-64 flex items-center justify-center">
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-56 h-56 rounded-full border-4 border-blue-100 dark:border-blue-900/30 flex items-center justify-center relative overflow-hidden bg-white dark:bg-black shadow-xl">
          {/* Wave effect */}
          <motion.div 
            className="absolute bottom-0 left-0 right-0 bg-blue-400/40 dark:bg-blue-500/50"
            initial={{ height: 0 }}
            animate={{ height: `${clampedProgress}%` }}
            transition={{ type: 'spring', damping: 20, stiffness: 50 }}
          />
          <div className="z-10 text-center">
            <span className="text-5xl font-bold text-blue-600 dark:text-blue-400">
              {Math.round(clampedProgress)}%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function App() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [entries, setEntries] = useState<WaterEntry[]>([]);
  const [history, setHistory] = useState<DailyHistory[]>([]);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [activeTab, setActiveTab] = useState<'home' | 'history' | 'settings'>('home');
  const [showOnboarding, setShowOnboarding] = useState(true);

  // Translation helper
  const t = useCallback((key: keyof typeof TRANSLATIONS['pt']) => {
    const lang = profile?.language || 'pt';
    return TRANSLATIONS[lang][key] || TRANSLATIONS['pt'][key];
  }, [profile?.language]);

  // Locale helper for date-fns
  const getLocale = useCallback(() => {
    const lang = profile?.language || 'pt';
    switch (lang) {
      case 'es': return es;
      case 'en': return enUS;
      default: return ptBR;
    }
  }, [profile?.language]);

  // Load data
  useEffect(() => {
    const savedProfile = localStorage.getItem(STORAGE_KEYS.PROFILE);
    const savedEntries = localStorage.getItem(STORAGE_KEYS.ENTRIES);
    const savedHistory = localStorage.getItem(STORAGE_KEYS.HISTORY);
    const savedTheme = localStorage.getItem(STORAGE_KEYS.THEME);

    if (savedProfile) {
      const p = JSON.parse(savedProfile);
      setProfile(p);
      setShowOnboarding(!p.onboarded);
    }
    
    if (savedEntries) {
      const e = JSON.parse(savedEntries);
      // Filter entries for today only
      const today = startOfDay(new Date());
      const todayEntries = e.filter((entry: WaterEntry) => entry.timestamp >= today.getTime());
      setEntries(todayEntries);
    }

    if (savedHistory) {
      setHistory(JSON.parse(savedHistory));
    }

    if (savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      setIsDarkMode(true);
    }
  }, []);

  // Save data
  useEffect(() => {
    if (profile) localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(profile));
  }, [profile]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ENTRIES, JSON.stringify(entries));
  }, [entries]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(history));
  }, [history]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.THEME, isDarkMode ? 'dark' : 'light');
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Handle Reminders
  useEffect(() => {
    if (!profile?.remindersEnabled) return;

    const requestPermission = async () => {
      if (Notification.permission === 'default') {
        await Notification.requestPermission();
      }
    };
    requestPermission();

    const interval = setInterval(() => {
      if (Notification.permission === 'granted') {
        const message = MOTIVATIONAL_MESSAGES[Math.floor(Math.random() * MOTIVATIONAL_MESSAGES.length)];
        new Notification('AquaHora', {
          body: message,
          icon: '/favicon.ico'
        });
      }
    }, 3600000); // 1 hour

    return () => clearInterval(interval);
  }, [profile?.remindersEnabled]);

  const addWater = (amount: number) => {
    const newEntry: WaterEntry = {
      id: Math.random().toString(36).substr(2, 9),
      amount,
      timestamp: Date.now(),
    };
    setEntries(prev => [...prev, newEntry]);

    // Update history
    const todayStr = format(new Date(), 'yyyy-MM-dd');
    setHistory(prev => {
      const existing = prev.find(h => h.date === todayStr);
      if (existing) {
        return prev.map(h => h.date === todayStr ? { ...h, total: h.total + amount } : h);
      }
      return [...prev, { date: todayStr, total: amount }];
    });
  };

  const totalToday = entries.reduce((acc, curr) => acc + curr.amount, 0);
  const progress = profile ? (totalToday / profile.dailyGoal) * 100 : 0;

  const handleOnboarding = (name: string, weight: number, language: Language) => {
    const dailyGoal = weight * 35;
    const newProfile: UserProfile = {
      name,
      weight,
      dailyGoal,
      remindersEnabled: true,
      onboarded: true,
      language,
    };
    setProfile(newProfile);
    setShowOnboarding(false);
  };

  if (showOnboarding) {
    return <Onboarding onComplete={handleOnboarding} isDarkMode={isDarkMode} />;
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-black text-slate-900 dark:text-white font-sans transition-colors duration-300">
      <div className="max-w-md mx-auto h-screen flex flex-col relative overflow-hidden shadow-2xl bg-white dark:bg-black">
        
        {/* Header */}
        <header className="p-6 flex justify-between items-center bg-white/80 dark:bg-black/80 backdrop-blur-md sticky top-0 z-20 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h1 className="text-2xl font-bold text-blue-600 dark:text-blue-400 flex items-center gap-2">
              <Droplets className="w-6 h-6" />
              AquaHora
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-300 font-medium uppercase tracking-wider">
              {t('hello')}, {profile?.name}
            </p>
          </div>
          <button 
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="p-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-100 hover:scale-110 transition-transform"
          >
            {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-6 pb-24">
          <AnimatePresence mode="wait">
            {activeTab === 'home' && (
              <motion.div
                key="home"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-8"
              >
                <div className="text-center space-y-2">
                  <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">{t('today_consumption')}</p>
                  <h2 className="text-4xl font-bold">{totalToday} <span className="text-xl font-normal text-slate-400">ml</span></h2>
                  <p className="text-sm text-blue-500 font-semibold">{t('goal')}: {profile?.dailyGoal} ml</p>
                </div>

                <ProgressBar progress={progress} />

                <div className="grid grid-cols-1 gap-4">
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={() => addWater(250)}
                    className="w-full py-6 bg-blue-600 hover:bg-blue-700 text-white rounded-3xl shadow-lg shadow-blue-200 dark:shadow-none flex items-center justify-center gap-3 text-xl font-bold transition-all"
                  >
                    <Plus className="w-6 h-6" />
                    {t('drink_250')}
                  </motion.button>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      onClick={() => addWater(150)}
                      className="py-4 bg-blue-50 dark:bg-blue-900/40 text-blue-600 dark:text-blue-300 rounded-2xl font-semibold hover:bg-blue-100 dark:hover:bg-blue-900/60 transition-colors"
                    >
                      + 150ml
                    </button>
                    <button
                      onClick={() => addWater(500)}
                      className="py-4 bg-blue-50 dark:bg-blue-900/40 text-blue-600 dark:text-blue-300 rounded-2xl font-semibold hover:bg-blue-100 dark:hover:bg-blue-900/60 transition-colors"
                    >
                      + 500ml
                    </button>
                  </div>
                </div>

                {progress >= 100 && (
                  <motion.div 
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-800 p-4 rounded-2xl flex items-center gap-4"
                  >
                    <div className="bg-emerald-500 p-2 rounded-full text-white">
                      <Trophy className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-bold text-emerald-800 dark:text-emerald-400">{t('goal_reached')}</h3>
                      <p className="text-sm text-emerald-600 dark:text-emerald-500">{t('congrats')}</p>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            )}

            {activeTab === 'history' && (
              <motion.div
                key="history"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <HistoryIcon className="w-5 h-5 text-blue-500" />
                  {t('last_7_days')}
                </h2>
                
                <div className="space-y-3">
                  {Array.from({ length: 7 }).map((_, i) => {
                    const date = subDays(new Date(), i);
                    const dateStr = format(date, 'yyyy-MM-dd');
                    const dayData = history.find(h => h.date === dateStr);
                    const isToday = i === 0;
                    const dayProgress = profile ? ((dayData?.total || 0) / profile.dailyGoal) * 100 : 0;

                    return (
                      <div key={dateStr} className="bg-slate-50 dark:bg-zinc-900 p-4 rounded-2xl border border-slate-100 dark:border-zinc-800">
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-semibold text-sm">
                            {isToday ? t('today') : format(date, 'EEEE, d MMM', { locale: getLocale() })}
                          </span>
                          <span className="text-sm font-bold text-blue-600 dark:text-blue-400">
                            {dayData?.total || 0} ml
                          </span>
                        </div>
                        <div className="w-full bg-slate-200 dark:bg-zinc-800 h-2 rounded-full overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${Math.min(100, dayProgress)}%` }}
                            className={cn(
                              "h-full rounded-full",
                              dayProgress >= 100 ? "bg-emerald-500" : "bg-blue-500"
                            )}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {activeTab === 'settings' && (
              <motion.div
                key="settings"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="space-y-8"
              >
                <div className="space-y-6">
                  <h2 className="text-xl font-bold flex items-center gap-2">
                    <Settings className="w-5 h-5 text-blue-500" />
                    {t('settings')}
                  </h2>

                  <div className="space-y-4">
                    {/* Dark Mode Toggle in Settings */}
                    <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-zinc-900 rounded-2xl border border-transparent dark:border-zinc-800">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-xl bg-slate-200 dark:bg-zinc-800 text-slate-600 dark:text-slate-100">
                          {isDarkMode ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
                        </div>
                        <div>
                          <p className="font-semibold">{isDarkMode ? 'Modo Escuro' : 'Modo Claro'}</p>
                          <p className="text-xs text-slate-500 dark:text-slate-400">Alterar tema visual</p>
                        </div>
                      </div>
                      <button
                        onClick={() => setIsDarkMode(!isDarkMode)}
                        className={cn(
                          "w-12 h-6 rounded-full relative transition-colors",
                          isDarkMode ? "bg-blue-600" : "bg-slate-300 dark:bg-zinc-700"
                        )}
                      >
                        <motion.div 
                          animate={{ x: isDarkMode ? 24 : 4 }}
                          className="w-4 h-4 bg-white rounded-full absolute top-1"
                        />
                      </button>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-zinc-900 rounded-2xl border border-transparent dark:border-zinc-800">
                      <div className="flex items-center gap-3">
                        <div className={cn(
                          "p-2 rounded-xl",
                          profile?.remindersEnabled ? "bg-blue-100 text-blue-600" : "bg-slate-200 text-slate-500"
                        )}>
                          {profile?.remindersEnabled ? <Bell className="w-5 h-5" /> : <BellOff className="w-5 h-5" />}
                        </div>
                        <div>
                          <p className="font-semibold">{t('reminders')}</p>
                          <p className="text-xs text-slate-500 dark:text-slate-400">{t('reminders_desc')}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => setProfile(prev => prev ? { ...prev, remindersEnabled: !prev.remindersEnabled } : null)}
                        className={cn(
                          "w-12 h-6 rounded-full relative transition-colors",
                          profile?.remindersEnabled ? "bg-blue-600" : "bg-slate-300 dark:bg-zinc-700"
                        )}
                      >
                        <motion.div 
                          animate={{ x: profile?.remindersEnabled ? 24 : 4 }}
                          className="w-4 h-4 bg-white rounded-full absolute top-1"
                        />
                      </button>
                    </div>

                    {/* Language Selector */}
                    <div className="p-4 bg-slate-50 dark:bg-zinc-900 rounded-2xl space-y-4 border border-transparent dark:border-zinc-800">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-orange-100 text-orange-600 rounded-xl">
                          <Droplets className="w-5 h-5" />
                        </div>
                        <p className="font-semibold">{t('language')}</p>
                      </div>
                      <div className="grid grid-cols-3 gap-2">
                        {(['pt', 'en', 'es'] as Language[]).map((lang) => (
                          <button
                            key={lang}
                            onClick={() => setProfile(prev => prev ? { ...prev, language: lang } : null)}
                            className={cn(
                              "py-2 rounded-xl text-sm font-bold transition-all",
                              profile?.language === lang 
                                ? "bg-blue-600 text-white shadow-md" 
                                : "bg-white dark:bg-black text-slate-500 border border-slate-200 dark:border-zinc-800"
                            )}
                          >
                            {lang.toUpperCase()}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="p-4 bg-slate-50 dark:bg-zinc-900 rounded-2xl space-y-4 border border-transparent dark:border-zinc-800">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-purple-100 text-purple-600 rounded-xl">
                          <User className="w-5 h-5" />
                        </div>
                        <p className="font-semibold">{t('profile')}</p>
                      </div>
                      <div className="space-y-3">
                        <div>
                          <label className="text-xs text-slate-500 font-bold uppercase ml-1">{t('weight')}</label>
                          <input 
                            type="number"
                            value={profile?.weight || ''}
                            onChange={(e) => {
                              const w = Number(e.target.value);
                              setProfile(prev => prev ? { ...prev, weight: w, dailyGoal: w * 35 } : null);
                            }}
                            className="w-full mt-1 bg-white dark:bg-black border border-slate-200 dark:border-zinc-800 rounded-xl px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                          />
                        </div>
                        <p className="text-xs text-slate-400 italic">{t('weight_desc')}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
                  <button 
                    onClick={() => {
                      if (confirm(t('reset_confirm'))) {
                        localStorage.clear();
                        window.location.reload();
                      }
                    }}
                    className="w-full py-3 text-red-500 font-semibold text-sm hover:bg-red-50 dark:hover:bg-red-900/10 rounded-xl transition-colors"
                  >
                    {t('reset_app')}
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </main>

        {/* Navigation Bar */}
        <nav className="absolute bottom-0 left-0 right-0 bg-white/90 dark:bg-black/90 backdrop-blur-lg border-t border-slate-100 dark:border-slate-800 flex justify-around items-center py-4 px-6 z-20">
          <NavButton 
            active={activeTab === 'history'} 
            onClick={() => setActiveTab('history')}
            icon={<HistoryIcon className="w-6 h-6" />}
            label={t('history')}
          />
          <NavButton 
            active={activeTab === 'home'} 
            onClick={() => setActiveTab('home')}
            icon={<Droplets className="w-6 h-6" />}
            label={t('home')}
            isMain
          />
          <NavButton 
            active={activeTab === 'settings'} 
            onClick={() => setActiveTab('settings')}
            icon={<Settings className="w-6 h-6" />}
            label={t('adjustments')}
          />
        </nav>
      </div>
    </div>
  );
}

function NavButton({ active, onClick, icon, label, isMain }: { active: boolean, onClick: () => void, icon: React.ReactNode, label: string, isMain?: boolean }) {
  return (
    <button 
      onClick={onClick}
      className={cn(
        "flex flex-col items-center gap-1 transition-all",
        active ? "text-blue-600 dark:text-blue-400" : "text-slate-400",
        isMain && "relative -top-4"
      )}
    >
      <div className={cn(
        "p-2 rounded-2xl transition-all",
        isMain && (active ? "bg-blue-600 text-white shadow-lg shadow-blue-200" : "bg-slate-100 dark:bg-slate-800 text-slate-400"),
        !isMain && active && "bg-blue-50 dark:bg-blue-900/20"
      )}>
        {icon}
      </div>
      {!isMain && <span className="text-[10px] font-bold uppercase tracking-tighter">{label}</span>}
    </button>
  );
}

function Onboarding({ onComplete, isDarkMode }: { onComplete: (name: string, weight: number, language: Language) => void, isDarkMode: boolean }) {
  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [weight, setWeight] = useState<number>(70);
  const [language, setLanguage] = useState<Language>('pt');

  const t_onboarding = (key: keyof typeof TRANSLATIONS['pt']) => {
    return TRANSLATIONS[language][key] || TRANSLATIONS['pt'][key];
  };

  return (
    <div className={cn(
      "min-h-screen flex items-center justify-center p-6 transition-colors duration-300",
      isDarkMode ? "bg-black text-white" : "bg-slate-50 text-slate-900"
    )}>
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md bg-white dark:bg-black rounded-[40px] p-8 shadow-2xl space-y-8"
      >
        <div className="text-center space-y-4">
          <div className="w-20 h-20 bg-blue-600 rounded-3xl flex items-center justify-center mx-auto shadow-xl shadow-blue-200 dark:shadow-none">
            <Droplets className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-black text-blue-600 dark:text-blue-400">AquaHora</h1>
          <p className="text-slate-500 dark:text-slate-300 font-medium">{t_onboarding('setup_profile')}</p>
        </div>

        <AnimatePresence mode="wait">
          {step === 1 ? (
            <motion.div 
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-400 uppercase tracking-widest ml-1">{t_onboarding('language')}</label>
                  <div className="grid grid-cols-3 gap-2">
                    {(['pt', 'en', 'es'] as Language[]).map((lang) => (
                      <button
                        key={lang}
                        onClick={() => setLanguage(lang)}
                        className={cn(
                          "py-3 rounded-2xl text-sm font-bold transition-all",
                          language === lang 
                            ? "bg-blue-600 text-white shadow-md" 
                            : "bg-slate-50 dark:bg-slate-800 text-slate-500"
                        )}
                      >
                        {lang.toUpperCase()}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-400 uppercase tracking-widest ml-1">{t_onboarding('how_call')}</label>
                  <input 
                    type="text"
                    placeholder={t_onboarding('your_name')}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl px-6 py-4 text-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
              </div>
              <button 
                disabled={!name}
                onClick={() => setStep(2)}
                className="w-full py-5 bg-blue-600 disabled:opacity-50 text-white rounded-2xl font-bold text-lg shadow-lg shadow-blue-100 dark:shadow-none transition-all"
              >
                {t_onboarding('next')}
              </button>
            </motion.div>
          ) : (
            <motion.div 
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-400 uppercase tracking-widest ml-1">{t_onboarding('what_weight')}</label>
                <div className="flex items-center gap-4">
                  <input 
                    type="range"
                    min="30"
                    max="150"
                    value={weight}
                    onChange={(e) => setWeight(Number(e.target.value))}
                    className="flex-1 accent-blue-600"
                  />
                  <span className="text-2xl font-bold w-20 text-center">{weight}kg</span>
                </div>
                <p className="text-xs text-slate-400 italic mt-2">{t_onboarding('weight_calc_desc')}</p>
              </div>
              <div className="flex gap-4">
                <button 
                  onClick={() => setStep(1)}
                  className="flex-1 py-5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-2xl font-bold"
                >
                  {t_onboarding('back')}
                </button>
                <button 
                  onClick={() => onComplete(name, weight, language)}
                  className="flex-[2] py-5 bg-blue-600 text-white rounded-2xl font-bold text-lg shadow-lg shadow-blue-100 dark:shadow-none"
                >
                  {t_onboarding('start')}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
