import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  LayoutDashboard, 
  GraduationCap, 
  Sparkles, 
  Users, 
  Radio, 
  HelpCircle, 
  User as UserIcon, 
  ShieldCheck,
  UserCheck,
  Dumbbell,
  BookOpen,
  Trophy,
  Briefcase,
  Lock,
  Compass,
  ListTodo,
  Mail,
  HardDrive,
  Presentation,
  ChevronDown,
  Film,
  Camera,
  Crown,
  Headphones
} from 'lucide-react';
import { User } from '../types';
import { Language, translations } from '../lib/translations';
import Logo from './Logo';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  currentUser: User;
  onUserChange: (user: User) => void;
  language: Language;
  onStartOnboarding?: () => void;
}

export default function Sidebar({ activeTab, setActiveTab, currentUser, onUserChange, language, onStartOnboarding }: SidebarProps) {
  // Check active instructor subscriptions from localStorage or user state
  const hasActiveSub = React.useMemo(() => {
    if (currentUser.billingStatus === 'active') return true;
    try {
      const saved = localStorage.getItem('waack_subscribed_instructors');
      const list = saved ? JSON.parse(saved) : [];
      return Array.isArray(list) && list.length > 0;
    } catch (e) {
      return false;
    }
  }, [currentUser.billingStatus]);

  const allSections = [
    {
      id: 'principal',
      title: 'PRINCIPAL',
      items: [
        { id: 'dashboard', label: 'DASHBOARD', icon: LayoutDashboard, requiresSub: false },
        { id: 'planes', label: 'PLANES & BENEFICIOS', icon: Crown, requiresSub: false, badge: 'NUEVO' },
        { id: 'reels', label: 'WAACK REELS', icon: Film, requiresSub: false, badge: 'HOT' },
        { id: 'live', label: 'LIVES', icon: Radio, requiresSub: false, badge: 'EN VIVO' },
        { id: 'ai_studio', label: 'ENTRENAMIENTO CON IA', icon: Sparkles, requiresSub: false, badge: 'PRO' },
        { id: 'instructor', label: 'PANEL DE INSTRUCTOR', icon: Briefcase, requiresSub: false, badge: 'VIP' }
      ]
    },
    {
      id: 'contenido',
      title: 'CONTENIDO EXCLUSIVO',
      items: [
        { id: 'cursos', label: 'CLASES & CURSOS', icon: GraduationCap, requiresSub: true },
        { id: 'podcasts', label: 'PODCASTS', icon: Headphones, requiresSub: false, badge: 'AUDIO' },
        { id: 'ebooks', label: 'MANUALES & EBOOKS', icon: BookOpen, requiresSub: true },
        { id: 'entrenamiento', label: 'FREESTYLE LAB (ENTRENAMIENTO)', icon: Sparkles, requiresSub: true }
      ]
    },
    {
      id: 'comunidad',
      title: 'COMUNIDAD & PROGRESO',
      items: [
        { id: 'fisico', label: 'SOMATIC DIARY', icon: Dumbbell, requiresSub: false },
        { id: 'comunidad', label: 'COMUNIDAD', icon: Users, requiresSub: false },
        { id: 'ranking', label: 'RANKING & BADGES', icon: Trophy, requiresSub: false }
      ]
    }
  ];

  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    principal: true,
    contenido: true,
    comunidad: true
  });

  const toggleAccordionSection = (sectionId: string) => {
    setOpenSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }));
  };

  useEffect(() => {
    const activeSec = allSections.find(sec => sec.items.some(item => item.id === activeTab));
    if (activeSec) {
      setOpenSections(prev => ({
        ...prev,
        [activeSec.id]: true
      }));
    }
  }, [activeTab]);

  const toggleRole = () => {
    const newRole = currentUser.role === 'instructor' ? 'student' : 'instructor';
    onUserChange({
      ...currentUser,
      role: newRole
    });
  };

  return (
    <aside id="sidebar-panel" className="w-64 bg-[#090a14]/95 border-r border-white/10 flex flex-col justify-between h-full shrink-0 select-none shadow-2xl relative z-20 overflow-y-auto custom-scrollbar backdrop-blur-xl">
      <div className="flex flex-col min-h-full">
        {/* Logo / Brand Header */}
        <div className="p-4 border-b border-white/10 bg-[#0c0d1e]/80 flex flex-col items-center justify-center relative overflow-hidden group shrink-0">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(233,195,73,0.12)_0%,transparent_70%)] pointer-events-none" />
          
          <Logo variant="full" className="w-40 h-auto relative z-10 transition-transform group-hover:scale-105 duration-300" />
          
          <span className="text-[8px] font-mono tracking-[0.25em] text-[#E9C349] font-black mt-1 relative z-10 uppercase text-center">
            PLATAFORMA DE ENTRENAMIENTO
          </span>
        </div>

        {/* User Role Card Box */}
        <div className="mx-3 my-3 p-3 bg-[#1e1e1e] border border-white/10 rounded-2xl flex items-center justify-between shadow-inner shrink-0">
          <div className="flex items-center gap-2.5 min-w-0">
            <img 
              src={currentUser.avatar} 
              alt={currentUser.name} 
              className="w-9 h-9 rounded-xl border border-[#E9C349]/50 object-cover shrink-0"
              referrerPolicy="no-referrer"
            />
            <div className="min-w-0">
              <p className="text-[11px] font-extrabold text-white truncate uppercase leading-tight">
                USUARIO: {(currentUser?.name || 'Bailarín').split(' ')[0]}
              </p>
              <p className="text-[9px] font-mono text-slate-400 font-semibold flex items-center gap-1 mt-0.5">
                {currentUser.role === 'instructor' ? (
                  <ShieldCheck className="w-2.5 h-2.5 text-[#E9C349] inline" />
                ) : (
                  <UserCheck className="w-2.5 h-2.5 inline text-slate-400" />
                )}
                <span className="capitalize">{currentUser.role}</span>
              </p>
            </div>
          </div>
          <button 
            id="role-switch-btn"
            onClick={toggleRole}
            className="text-[9px] bg-[#9A1B42] hover:bg-[#b01e4c] text-white px-2 py-1 rounded-lg font-black tracking-wider uppercase transition-all shadow-md active:scale-95 shrink-0"
            title="Cambiar rol para simulación"
          >
            ROLE
          </button>
        </div>

        {/* Subscription Status Pill */}
        <div className="mx-3 mb-3 px-3 py-2 bg-[#141022] border border-white/10 rounded-xl flex items-center justify-between text-[10px] font-mono">
          <span className="text-slate-400 font-bold uppercase">Suscripción:</span>
          {hasActiveSub ? (
            <span className="text-emerald-400 font-black flex items-center gap-1 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              ACTIVA
            </span>
          ) : (
            <span className="text-pink-400 font-bold flex items-center gap-1 bg-pink-500/10 px-2 py-0.5 rounded border border-pink-500/20">
              <Lock className="w-2.5 h-2.5 text-pink-400" />
              SIN PROFESOR
            </span>
          )}
        </div>

        {/* Navigation Menu Accordion */}
        <nav className="px-3 py-1 space-y-3 flex-1">
          {allSections.map((section) => {
            const isOpen = !!openSections[section.id];
            const hasActiveItem = section.items.some((item) => item.id === activeTab);

            return (
              <div key={section.id} className="space-y-1">
                {/* Accordion Header */}
                <button
                  type="button"
                  onClick={() => toggleAccordionSection(section.id)}
                  className="w-full px-3 py-1.5 flex items-center justify-between group text-left cursor-pointer hover:bg-white/5 rounded-xl transition-colors"
                >
                  <div className="flex items-center gap-1.5 min-w-0">
                    <p className="text-[9px] font-black text-[#E9C349] tracking-widest uppercase truncate group-hover:text-white transition-colors">
                      {section.title}
                    </p>
                    {hasActiveItem && (
                      <span className="w-1.5 h-1.5 rounded-full bg-[#E9C349] animate-pulse shrink-0" />
                    )}
                  </div>
                  <ChevronDown
                    className={`w-3.5 h-3.5 text-[#E9C349] transition-transform duration-200 shrink-0 ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {/* Accordion Content */}
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2, ease: "easeInOut" }}
                      className="space-y-1 overflow-hidden"
                    >
                      {section.items.map((item) => {
                        const Icon = item.icon;
                        const isActive = activeTab === item.id;
                        const isLocked = item.requiresSub && !hasActiveSub;

                        return (
                          <motion.button
                            id={`nav-${item.id}`}
                            key={item.id}
                            onClick={() => setActiveTab(item.id)}
                            whileHover={{ x: 3 }}
                            whileTap={{ scale: 0.98 }}
                            transition={{ type: "spring", stiffness: 400, damping: 25 }}
                            className={`relative w-full flex items-center justify-between px-3.5 py-2 rounded-xl transition-colors text-left border ${
                              isActive 
                                ? 'bg-[#1e1735] border-white/20 text-white font-extrabold shadow-lg shadow-black/40' 
                                : 'text-slate-400 hover:text-white hover:bg-white/5 border-transparent font-bold'
                            }`}
                          >
                            {isActive && (
                              <motion.div 
                                layoutId="activeNavBackground"
                                className="absolute inset-0 bg-[#1e1735] border border-[#E9C349]/40 rounded-xl pointer-events-none"
                                transition={{ type: "spring", stiffness: 500, damping: 35 }}
                              />
                            )}

                            <div className="flex items-center gap-2.5 min-w-0 relative z-10">
                              {item.id === 'dashboard' ? (
                                <motion.div
                                  animate={{
                                    scale: [1, 1.18, 1],
                                    rotate: [0, 4, -4, 0],
                                    filter: [
                                      'drop-shadow(0 0 0px rgba(233, 195, 73, 0))',
                                      'drop-shadow(0 0 6px rgba(233, 195, 73, 0.8))',
                                      'drop-shadow(0 0 0px rgba(233, 195, 73, 0))'
                                    ]
                                  }}
                                  transition={{
                                    duration: 2.2,
                                    repeat: Infinity,
                                    ease: 'easeInOut'
                                  }}
                                  className="shrink-0"
                                >
                                  <Icon className={`w-4 h-4 ${isActive ? 'text-[#E9C349]' : 'text-slate-400'}`} />
                                </motion.div>
                              ) : (
                                <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-[#E9C349]' : 'text-slate-400'}`} />
                              )}
                              <span className="text-[11px] tracking-wider uppercase truncate">
                                {item.label}
                              </span>
                            </div>

                            <div className="flex items-center gap-1.5 shrink-0 ml-1 relative z-10">
                              {item.badge && (
                                <span className="text-[8px] font-mono font-black text-[#E9C349] bg-[#E9C349]/15 border border-[#E9C349]/30 px-1.5 py-0.2 rounded">
                                  {item.badge}
                                </span>
                              )}

                              {isLocked ? (
                                <span className="flex items-center gap-1 bg-pink-500/10 border border-pink-500/20 px-1.5 py-0.5 rounded text-[8px] font-mono font-bold text-pink-400" title="Requiere membresía activa con un profesor">
                                  <Lock className="w-3 h-3 text-pink-400 shrink-0" />
                                  <span className="hidden group-hover:inline">LOCKED</span>
                                </span>
                              ) : null}
                            </div>
                          </motion.button>
                        );
                      })}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </nav>
      </div>

      {/* Footer Links from Screenshot */}
      <div className="p-4 border-t border-white/10 bg-[#000000] space-y-2">
        {onStartOnboarding && (
          <button 
            id="sidebar-tour-btn"
            onClick={onStartOnboarding}
            className="w-full flex items-center gap-2.5 px-3 py-1.5 text-xs font-bold text-slate-300 hover:text-white hover:bg-white/5 rounded-xl transition-all"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#E9C349]" />
            <span>Interactive Tour</span>
          </button>
        )}
        <button 
          id="support-btn"
          onClick={() => setActiveTab('support')}
          className={`w-full flex items-center gap-2.5 px-3 py-1.5 text-xs font-bold text-slate-300 hover:text-white hover:bg-white/5 rounded-xl transition-all ${
            activeTab === 'support' ? 'bg-white/10 text-white' : ''
          }`}
        >
          <HelpCircle className="w-3.5 h-3.5 text-slate-400" />
          <span>Help & Support</span>
        </button>
        <button 
          id="privacy-btn"
          onClick={() => setActiveTab('privacy')}
          className={`w-full flex items-center gap-2.5 px-3 py-1.5 text-xs font-bold text-slate-300 hover:text-white hover:bg-white/5 rounded-xl transition-all ${
            activeTab === 'privacy' ? 'bg-white/10 text-white' : ''
          }`}
        >
          <ShieldCheck className="w-3.5 h-3.5 text-[#E9C349]" />
          <span>{translations[language]?.privacy || 'Políticas & Términos'}</span>
        </button>
      </div>
    </aside>
  );
}

