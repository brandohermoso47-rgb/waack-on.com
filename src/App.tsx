import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Bell, 
  Settings, 
  ShieldAlert, 
  Sparkles, 
  GraduationCap, 
  Users, 
  Radio, 
  Timer,
  BookOpen,
  Menu,
  X,
  LayoutDashboard,
  User as UserIcon,
  HelpCircle,
  Eye,
  EyeOff,
  Mail,
  HardDrive,
  Sun,
  Moon,
  Camera
} from 'lucide-react';
import BWImageGallery from './components/BWImageGallery';
import { GmailWidget } from './components/GmailWidget';
import { GooglePickerModal } from './components/GooglePickerModal';
import { Language, translations, languageNames } from './lib/translations';
import { 
  createBackendAnnouncement, 
  postCommunityMessage, 
  updateProfileBackend 
} from './lib/api';

// Import Types
import { 
  User, 
  Announcement, 
  Presentation, 
  ChatMessage, 
  Lesson, 
  PlaylistItem, 
  FeedbackItem, 
  NotificationItem,
  CalendarEvent,
  PracticeLog,
  InstructorCatedra
} from './types';
import { 
  notifyStudentFeedbackReviewed, 
  triggerLocalWebPushNotification, 
  registerServiceWorker, 
  requestWebPushPermission, 
  playWebPushSound 
} from './lib/webPush';

// Import Initial Data
import { 
  INITIAL_USER, 
  INITIAL_ANNOUNCEMENTS, 
  INITIAL_PRESENTATIONS, 
  INITIAL_CHAT_MESSAGES, 
  INITIAL_LESSONS, 
  INITIAL_PLAYLISTS, 
  INITIAL_FEEDBACK_ITEMS, 
  INITIAL_CALENDAR_EVENTS,
  INITIAL_PRACTICE_LOGS,
  INITIAL_INSTRUCTORS
} from './data';

// Import Shell Components
import Sidebar from './components/Sidebar';
import DashboardView from './components/DashboardView';
import OnboardingTour from './components/OnboardingTour';
import LoginView from './components/LoginView';
import ProtectedRoute from './components/ProtectedRoute';
import PremiumGate from './components/PremiumGate';
import ViewSkeleton from './components/ViewSkeleton';
import { SubscriptionPlansModal } from './components/SubscriptionPlansModal';
import { LessonCelebration } from './components/LessonCelebration';

// Code Splitting (React.lazy) for Heavy Academic & Somatic Modules
const ComunidadView = React.lazy(() => import('./components/ComunidadView'));
const CursosView = React.lazy(() => import('./components/CursosView'));
const EntrenamientoView = React.lazy(() => import('./components/EntrenamientoView'));
const LiveView = React.lazy(() => import('./components/LiveView'));
const FisicoView = React.lazy(() => import('./components/FisicoView'));
const ProfileView = React.lazy(() => import('./components/ProfileView'));
const EbooksView = React.lazy(() => import('./components/EbooksView'));
const RankingView = React.lazy(() => import('./components/RankingView'));
const ReelsView = React.lazy(() => import('./components/ReelsView'));
const PrivacyView = React.lazy(() => import('./components/PrivacyView'));
const InstructorView = React.lazy(() => import('./components/InstructorView'));
const ClassroomView = React.lazy(() => import('./components/ClassroomView'));
const TasksView = React.lazy(() => import('./components/TasksView'));
const GoogleSlidesView = React.lazy(() => import('./components/GoogleSlidesView'));
const AiStudioView = React.lazy(() => import('./components/AiStudioView'));
const PlansView = React.lazy(() => import('./components/PlansView'));
const PodcastsView = React.lazy(() => import('./components/PodcastsView'));

// Import Firebase
import { auth, db, OperationType, handleFirestoreError } from './firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { collection, doc, onSnapshot, setDoc, deleteDoc, query, orderBy, limit, getDoc } from 'firebase/firestore';

// Friends & Battles integration
import { FriendsModal } from './components/FriendsModal';
import { BattleInvitationModal } from './components/BattleInvitationModal';
import { upsertUserProfile, updateUserStatus } from './lib/friendsAndBattles';

// Helper function to play a subtle notification sound using Web Audio API
function playNotificationSound() {
  try {
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
    osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.15); // A5
    gain.gain.setValueAtTime(0.15, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.3);
  } catch (e) {
    // Ignore audio context restrictions
  }
}

// Custom hook for detecting new assigned tasks and notifications
function useNotifications(currentUser: User) {
  const [tasks, setTasks] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [isBouncing, setIsBouncing] = useState<boolean>(false);
  const prevCountRef = useRef<number>(-1);

  useEffect(() => {
    const fetchTasks = () => {
      fetch('/api/student/tasks')
        .then(res => {
          if (!res || !res.ok) return null;
          const contentType = res.headers.get('content-type');
          if (!contentType || !contentType.includes('application/json')) return null;
          return res.json().catch(() => null);
        })
        .then(data => {
          if (data && data.success && Array.isArray(data.tasks)) {
            const pendingTasks = data.tasks.filter((t: any) => (!t.studentUid || t.studentUid === currentUser.id) && t.status === 'pending');
            const newCount = pendingTasks.length;

            if (prevCountRef.current !== -1 && newCount > prevCountRef.current) {
              playNotificationSound();
              setIsBouncing(true);
              setTimeout(() => setIsBouncing(false), 2500);
            }
            prevCountRef.current = newCount;
            setTasks(pendingTasks);
            setUnreadCount(newCount);
          }
        })
        .catch(() => {
          // Ignore network errors on background poll
        });
    };

    fetchTasks();
    const interval = setInterval(fetchTasks, 15000);
    return () => clearInterval(interval);
  }, [currentUser.id]);

  return { tasks, unreadCount, isBouncing };
}

export default function App() {
  // Language Selector State
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem('waacking_language') as Language;
    return (saved === 'es' || saved === 'en' || saved === 'ko' || saved === 'ja' || saved === 'pt') ? saved : 'es';
  });

  // Onboarding Tour state
  const [showOnboarding, setShowOnboarding] = useState<boolean>(() => {
    return localStorage.getItem('waacking_onboarding_completed') !== 'true';
  });

  // Global Black and White (Monochrome) Image Mode
  const [isGrayscaleGlobal, setIsGrayscaleGlobal] = useState<boolean>(() => {
    return localStorage.getItem('waackon_grayscale_mode') === 'true';
  });

  const handleToggleGrayscaleGlobal = () => {
    setIsGrayscaleGlobal(prev => {
      const nextVal = !prev;
      localStorage.setItem('waackon_grayscale_mode', String(nextVal));
      return nextVal;
    });
  };

  // Focus Mode State and Texts
  const [isFocusMode, setIsFocusMode] = useState<boolean>(() => {
    return localStorage.getItem('waacking_focus_mode') === 'true';
  });

  const focusModeText: Record<Language, { enable: string; disable: string; activeLabel: string }> = {
    es: {
      enable: "Modo Enfoque",
      disable: "Salir Enfoque",
      activeLabel: "MODO ENFOQUE"
    },
    en: {
      enable: "Focus Mode",
      disable: "Exit Focus",
      activeLabel: "FOCUS MODE"
    },
    ko: {
      enable: "집중 모드",
      disable: "집중 모드 종료",
      activeLabel: "집중 모드"
    },
    ja: {
      enable: "集中モード",
      disable: "集中モード終了",
      activeLabel: "集中モード"
    },
    pt: {
      enable: "Modo Foco",
      disable: "Sair do Foco",
      activeLabel: "MODO FOCO"
    }
  };

  const handleToggleFocusMode = () => {
    setIsFocusMode(prev => {
      const newVal = !prev;
      localStorage.setItem('waacking_focus_mode', String(newVal));
      return newVal;
    });
  };

  useEffect(() => {
    localStorage.setItem('waacking_language', language);
  }, [language]);

  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    return (localStorage.getItem('waacking_theme') as 'dark' | 'light') || 'dark';
  });

  useEffect(() => {
    localStorage.setItem('waacking_theme', theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  // Mobile drawer state
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Subscription Plans Modal state
  const [isPlansModalOpen, setIsPlansModalOpen] = useState<boolean>(false);

  // Workspace integration modals state
  const [showGmailModal, setShowGmailModal] = useState<boolean>(false);
  const [showPickerModal, setShowPickerModal] = useState<boolean>(false);

  // Course Level Select lifted state
  const [selectedCourseLevel, setSelectedCourseLevel] = useState<1 | 2>(1);

  // Lesson Celebration state
  const [celebratedLesson, setCelebratedLesson] = useState<Lesson | null>(null);

  // Navigation active tab
  const [activeTab, setActiveTab] = useState<string>(() => {
    return localStorage.getItem('waacking_active_tab') || 'dashboard';
  });

  // Training session duration timer state
  const [trainingSeconds, setTrainingSeconds] = useState<number>(0);
  const [isTrainingRunning, setIsTrainingRunning] = useState<boolean>(false);

  useEffect(() => {
    if (activeTab === 'entrenamiento') {
      setIsTrainingRunning(true);
      const interval = setInterval(() => {
        setTrainingSeconds(prev => prev + 1);
      }, 1000);
      return () => clearInterval(interval);
    } else {
      setIsTrainingRunning(false);
    }
  }, [activeTab]);

  const formatTrainingTime = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    const hours = Math.floor(mins / 60);
    const remMins = mins % 60;
    if (hours > 0) {
      return `${hours}:${remMins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Firebase Auth states
  const [firebaseUser, setFirebaseUser] = useState<any>(null);
  const [isGuestMode, setIsGuestMode] = useState<boolean>(() => {
    return localStorage.getItem('waacking_guest_mode') === 'true';
  });
  const [authChecked, setAuthChecked] = useState<boolean>(false);

  // State with LocalStorage loaders
  const [currentUser, setCurrentUser] = useState<User>(() => {
    const saved = localStorage.getItem('waacking_user');
    return saved ? JSON.parse(saved) : INITIAL_USER;
  });

  const { tasks: assignedTasksNotifications, unreadCount, isBouncing } = useNotifications(currentUser);

  // Presence & Firestore Profile synchronization
  useEffect(() => {
    if (currentUser.id) {
      upsertUserProfile(currentUser);
      updateUserStatus(currentUser.id, activeTab === 'live' ? 'in_battle' : 'online');
    }
  }, [currentUser.id, currentUser.name, activeTab]);

  // central user update and Firestore sync helper
  const updateUserAndPersist = (arg: User | ((prev: User) => User)) => {
    setCurrentUser(prev => {
      const updated = typeof arg === 'function' ? (arg as any)(prev) : arg;
      localStorage.setItem('waacking_user', JSON.stringify(updated));

      // Sync with Backend API (Zod Schema Validated)
      updateProfileBackend(updated, {
        name: updated.name,
        role: updated.role,
        bio: updated.bio,
        avatar: updated.avatar,
        instagram: updated.instagram
      }).catch(err => {
        console.warn("[Backend Profile Sync Notice]:", err);
      });

      // Persist to Firestore if logged in
      if (auth.currentUser) {
        const docRef = doc(db, 'users', auth.currentUser.uid);
        setDoc(docRef, {
          id: updated.id,
          name: updated.name,
          avatar: updated.avatar,
          role: updated.role,
          completedLessons: updated.completedLessons,
          points: updated.points,
          email: updated.email || auth.currentUser.email || '',
          nickname: updated.nickname || '',
          bio: updated.bio || '',
          level: updated.level || 'intermediate',
          instagram: updated.instagram || '',
          targetMinutes: updated.targetMinutes || 30,
          customAchievements: updated.customAchievements || [],
          billingStatus: updated.billingStatus || 'cancelled'
        }).catch(err => {
          console.error("Error saving updated profile to Firestore:", err);
        });
      }
      return updated;
    });
  };

  // Sync auth state changes with Firebase
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setFirebaseUser(user);
        setIsGuestMode(false);
        localStorage.setItem('waacking_guest_mode', 'false');

        try {
          const docRef = doc(db, 'users', user.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            const data = docSnap.data();
            setCurrentUser({
              id: user.uid,
              name: data.name || user.displayName || 'Bailarín',
              firstName: data.firstName || (data.name ? data.name.split(' ')[0] : undefined),
              lastName: data.lastName || (data.name ? data.name.split(' ').slice(1).join(' ') : undefined),
              avatar: user.photoURL || data.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=120',
              role: (data.role || 'student') as any,
              completedLessons: data.completedLessons || [],
              points: data.points || 0,
              email: user.email || data.email || undefined,
              nickname: data.nickname || (data.name ? `@${data.name.toLowerCase().replace(/\s+/g, '')}` : undefined),
              bio: data.bio,
              level: data.level,
              instagram: data.instagram,
              targetMinutes: data.targetMinutes,
              customAchievements: data.customAchievements || [],
              billingStatus: data.billingStatus || 'cancelled'
            });
          } else {
            // Document does not exist, create a clean profile in Firestore
            const nameParts = (user.displayName || '').trim().split(' ');
            const inferredFirstName = nameParts[0] || 'Bailarín';
            const inferredLastName = nameParts.slice(1).join(' ') || '';
            const defaultName = user.displayName || 'Bailarín Waack On';
            const defaultNickname = `@${inferredFirstName.toLowerCase()}${inferredLastName ? '_' + inferredLastName.toLowerCase() : ''}`.replace(/\s+/g, '');

            const newUserProfile: User = {
              id: user.uid,
              name: defaultName,
              firstName: inferredFirstName,
              lastName: inferredLastName,
              avatar: user.photoURL || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=120',
              role: 'student',
              completedLessons: [],
              points: 0,
              email: user.email || undefined,
              nickname: defaultNickname,
              billingStatus: 'cancelled'
            };
            await setDoc(docRef, newUserProfile, { merge: true });
            setCurrentUser(newUserProfile);
          }
        } catch (error) {
          const errMessage = error instanceof Error ? error.message : String(error);
          if (!errMessage.includes('client is offline')) {
            console.error("Error syncing profile with Firestore:", error);
          }
          // Fallback to minimal user info
          setCurrentUser({
            id: user.uid,
            name: user.displayName || 'Bailarín',
            avatar: user.photoURL || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=120',
            role: 'student',
            completedLessons: [],
            points: 0,
            email: user.email || undefined
          });
        }
      } else {
        setFirebaseUser(null);
      }
      setAuthChecked(true);
    });

    return () => unsubscribe();
  }, []);

  const [announcements, setAnnouncements] = useState<Announcement[]>(INITIAL_ANNOUNCEMENTS);
  const [presentations, setPresentations] = useState<Presentation[]>(INITIAL_PRESENTATIONS);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(INITIAL_CHAT_MESSAGES);

  const [instructors, setInstructors] = useState<InstructorCatedra[]>(INITIAL_INSTRUCTORS);

  const [lessons, setLessons] = useState<Lesson[]>(() => {
    try {
      const saved = localStorage.getItem('waacking_lessons');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (e) { console.error(e); }
    return INITIAL_LESSONS;
  });

  const [playlists] = useState<PlaylistItem[]>(INITIAL_PLAYLISTS); // Static track definitions

  const [feedbackItems, setFeedbackItems] = useState<FeedbackItem[]>(INITIAL_FEEDBACK_ITEMS);
  const [notificationsList, setNotificationsList] = useState<NotificationItem[]>([]);
  const [pushToast, setPushToast] = useState<{ id: string; title: string; body: string; feedbackId?: string } | null>(null);

  const [events, setEvents] = useState<CalendarEvent[]>(() => {
    try {
      const saved = localStorage.getItem('waacking_events');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (e) { console.error(e); }
    return INITIAL_CALENDAR_EVENTS;
  });

  const [practiceLogs, setPracticeLogs] = useState<PracticeLog[]>(() => {
    try {
      const saved = localStorage.getItem('waacking_practice_logs');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (e) { console.error(e); }
    return INITIAL_PRACTICE_LOGS;
  });

  // Real-time Firestore Listeners for Community & Academy Collections
  useEffect(() => {
    const unsub = onSnapshot(
      collection(db, 'chat_messages'),
      (snapshot) => {
        if (!snapshot.empty) {
          const msgs = snapshot.docs.map(docSnap => ({ id: docSnap.id, ...docSnap.data() } as ChatMessage));
          setChatMessages(msgs);
        } else {
          INITIAL_CHAT_MESSAGES.forEach(msg => {
            setDoc(doc(db, 'chat_messages', msg.id), msg).catch(err =>
              handleFirestoreError(err, OperationType.WRITE, `chat_messages/${msg.id}`)
            );
          });
          setChatMessages(INITIAL_CHAT_MESSAGES);
        }
      },
      (error) => {
        handleFirestoreError(error, OperationType.GET, 'chat_messages');
      }
    );
    return () => unsub();
  }, []);

  useEffect(() => {
    const unsub = onSnapshot(
      collection(db, 'presentations'),
      (snapshot) => {
        if (!snapshot.empty) {
          const items = snapshot.docs.map(docSnap => ({ id: docSnap.id, ...docSnap.data() } as Presentation));
          setPresentations(items);
        } else {
          INITIAL_PRESENTATIONS.forEach(p => {
            setDoc(doc(db, 'presentations', p.id), p).catch(err =>
              handleFirestoreError(err, OperationType.WRITE, `presentations/${p.id}`)
            );
          });
          setPresentations(INITIAL_PRESENTATIONS);
        }
      },
      (error) => {
        handleFirestoreError(error, OperationType.GET, 'presentations');
      }
    );
    return () => unsub();
  }, []);

  useEffect(() => {
    const unsub = onSnapshot(
      collection(db, 'announcements'),
      (snapshot) => {
        if (!snapshot.empty) {
          const items = snapshot.docs.map(docSnap => ({ id: docSnap.id, ...docSnap.data() } as Announcement));
          setAnnouncements(items);
        } else {
          INITIAL_ANNOUNCEMENTS.forEach(a => {
            setDoc(doc(db, 'announcements', a.id), a).catch(err =>
              handleFirestoreError(err, OperationType.WRITE, `announcements/${a.id}`)
            );
          });
          setAnnouncements(INITIAL_ANNOUNCEMENTS);
        }
      },
      (error) => {
        handleFirestoreError(error, OperationType.GET, 'announcements');
      }
    );
    return () => unsub();
  }, []);

  useEffect(() => {
    const unsub = onSnapshot(
      collection(db, 'feedback_items'),
      (snapshot) => {
        if (!snapshot.empty) {
          const items = snapshot.docs.map(docSnap => ({ id: docSnap.id, ...docSnap.data() } as FeedbackItem));
          setFeedbackItems(items);
        } else {
          INITIAL_FEEDBACK_ITEMS.forEach(f => {
            setDoc(doc(db, 'feedback_items', f.id), f).catch(err =>
              handleFirestoreError(err, OperationType.WRITE, `feedback_items/${f.id}`)
            );
          });
          setFeedbackItems(INITIAL_FEEDBACK_ITEMS);
        }
      },
      (error) => {
        handleFirestoreError(error, OperationType.GET, 'feedback_items');
      }
    );
    return () => unsub();
  }, []);

  // Register Service Worker and listen for notification click events
  useEffect(() => {
    registerServiceWorker();

    const handleOpenFeedback = () => {
      setActiveTab('entrenamiento');
      setPushToast(null);
    };
    window.addEventListener('OPEN_FEEDBACK_ITEM', handleOpenFeedback);
    return () => window.removeEventListener('OPEN_FEEDBACK_ITEM', handleOpenFeedback);
  }, []);

  // Real-time Firestore Listener for Notifications (/notifications)
  useEffect(() => {
    const unsub = onSnapshot(
      collection(db, 'notifications'),
      (snapshot) => {
        if (!snapshot.empty) {
          const items = snapshot.docs.map(docSnap => ({ id: docSnap.id, ...docSnap.data() } as NotificationItem));
          items.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
          setNotificationsList(items);

          // Check if there's a new unread feedback notification for current user
          const latest = items[0];
          if (latest && !latest.read) {
            const isForMe = latest.userId === currentUser.id || latest.userId === currentUser.name || latest.studentName === currentUser.name;
            if (isForMe) {
              setPushToast({
                id: latest.id,
                title: latest.title,
                body: latest.body,
                feedbackId: latest.feedbackId
              });
              triggerLocalWebPushNotification({
                title: latest.title,
                body: latest.body,
                tag: `notif-${latest.id}`,
                feedbackId: latest.feedbackId,
                onClick: () => setActiveTab('entrenamiento')
              });
            }
          }
        }
      },
      (error) => {
        handleFirestoreError(error, OperationType.GET, 'notifications');
      }
    );
    return () => unsub();
  }, [currentUser.id, currentUser.name]);

  // Real-time Firestore Listener for Lessons (/lessons)
  useEffect(() => {
    const unsub = onSnapshot(
      collection(db, 'lessons'),
      (snapshot) => {
        if (!snapshot.empty) {
          const items = snapshot.docs.map(docSnap => ({ id: docSnap.id, ...docSnap.data() } as Lesson));
          items.sort((a, b) => a.level - b.level || a.id.localeCompare(b.id));
          setLessons(items);
        } else {
          INITIAL_LESSONS.forEach(l => {
            setDoc(doc(db, 'lessons', l.id), l).catch(err =>
              handleFirestoreError(err, OperationType.WRITE, `lessons/${l.id}`)
            );
          });
          setLessons(INITIAL_LESSONS);
        }
      },
      (error) => {
        handleFirestoreError(error, OperationType.GET, 'lessons');
      }
    );
    return () => unsub();
  }, []);

  // Real-time Firestore Listener for User Practice Logs (/users/{uid}/practice_logs)
  useEffect(() => {
    const activeUid = firebaseUser?.uid || currentUser.id;
    if (!activeUid) return;

    const unsub = onSnapshot(
      collection(db, 'users', activeUid, 'practice_logs'),
      (snapshot) => {
        if (!snapshot.empty) {
          const logs = snapshot.docs.map(docSnap => ({ id: docSnap.id, ...docSnap.data() } as PracticeLog));
          logs.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
          setPracticeLogs(logs);
        } else {
          INITIAL_PRACTICE_LOGS.forEach(log => {
            setDoc(doc(db, 'users', activeUid, 'practice_logs', log.id), log).catch(err =>
              handleFirestoreError(err, OperationType.WRITE, `users/${activeUid}/practice_logs/${log.id}`)
            );
          });
          setPracticeLogs(INITIAL_PRACTICE_LOGS);
        }
      },
      (error) => {
        handleFirestoreError(error, OperationType.GET, `users/${activeUid}/practice_logs`);
      }
    );
    return () => unsub();
  }, [firebaseUser?.uid, currentUser.id]);

  // Save to LocalStorage when remaining non-Firestore states change
  useEffect(() => {
    localStorage.setItem('waacking_active_tab', activeTab);
    setIsMobileMenuOpen(false);
  }, [activeTab]);

  useEffect(() => {
    localStorage.setItem('waacking_practice_logs', JSON.stringify(practiceLogs));
  }, [practiceLogs]);

  useEffect(() => {
    localStorage.setItem('waacking_user', JSON.stringify(currentUser));
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('waacking_lessons', JSON.stringify(lessons));
  }, [lessons]);

  useEffect(() => {
    localStorage.setItem('waacking_events', JSON.stringify(events));
  }, [events]);

  // ACTIONS

  // 1. Mark lesson completed
  const handleMarkLessonComplete = (lessonId: string, completed: boolean) => {
    const lesson = lessons.find(l => l.id === lessonId);
    const level = lesson?.level || 1;
    const pointsAwarded = level === 1 ? 50 : 80;

    updateUserAndPersist(prev => {
      let updatedCompleted = [...prev.completedLessons];
      let newPoints = prev.points;

      if (completed) {
        if (!updatedCompleted.includes(lessonId)) {
          updatedCompleted.push(lessonId);
          newPoints += pointsAwarded;
          if (lesson) {
            setCelebratedLesson(lesson);
          }
        }
      } else {
        if (updatedCompleted.includes(lessonId)) {
          updatedCompleted = updatedCompleted.filter(id => id !== lessonId);
          newPoints = Math.max(0, newPoints - pointsAwarded);
        }
      }
      return { ...prev, completedLessons: updatedCompleted, points: newPoints };
    });

    if (lesson) {
      const updatedLesson = { ...lesson, completed };
      setDoc(doc(db, 'lessons', lessonId), updatedLesson, { merge: true }).catch(err => {
        handleFirestoreError(err, OperationType.WRITE, `lessons/${lessonId}`);
      });
    }

    setLessons(prev => 
      prev.map(l => l.id === lessonId ? { ...l, completed } : l)
    );
  };

  // 2. Add announcement (Backend RBAC Protected & Zod Validated)
  const handleAddAnnouncement = async (
    title: string, 
    content: string, 
    important: boolean = false,
    category: string = 'comunicados',
    actionUrl?: string,
    imageUrl?: string
  ) => {
    try {
      const backendAnn = await createBackendAnnouncement(currentUser, {
        title,
        content,
        category,
        isImportant: important,
        actionUrl,
        imageUrl
      });

      const newAnn: Announcement = {
        id: backendAnn.id || `a-${Date.now()}`,
        title: backendAnn.title || title,
        content: backendAnn.content || content,
        date: new Date().toISOString().split('T')[0],
        author: currentUser.nickname || currentUser.name,
        authorAvatar: currentUser.avatar,
        authorRole: currentUser.role,
        category: category as any,
        important,
        actionUrl,
        imageUrl
      };
      setDoc(doc(db, 'announcements', newAnn.id), newAnn).catch(err => {
        handleFirestoreError(err, OperationType.WRITE, `announcements/${newAnn.id}`);
      });
    } catch (err: any) {
      console.error("[Backend Announcement RBAC / Zod Error]:", err);
      alert(err.message || 'Error de permisos RBAC o validación en el servidor');
    }
  };

  const handleDeleteAnnouncement = (id: string) => {
    deleteDoc(doc(db, 'announcements', id)).catch(err => {
      handleFirestoreError(err, OperationType.DELETE, `announcements/${id}`);
    });
  };

  // 3. Add presentation
  const handleAddPresentation = (text: string, videoUrl?: string) => {
    const newPres: Presentation = {
      id: `p-${Date.now()}`,
      studentName: currentUser.name,
      studentAvatar: currentUser.avatar,
      text,
      videoUrl: videoUrl || '',
      date: 'Hace un momento',
      likes: 0,
      comments: []
    };
    setDoc(doc(db, 'presentations', newPres.id), newPres).catch(err => {
      handleFirestoreError(err, OperationType.WRITE, `presentations/${newPres.id}`);
    });
  };

  // 4. Like presentation
  const handleLikePresentation = (id: string) => {
    const p = presentations.find(item => item.id === id);
    if (!p) return;
    const isLiked = p.isLikedByMe;
    const updated = {
      ...p,
      likes: isLiked ? Math.max(0, p.likes - 1) : p.likes + 1,
      isLikedByMe: !isLiked
    };
    setDoc(doc(db, 'presentations', id), updated).catch(err => {
      handleFirestoreError(err, OperationType.WRITE, `presentations/${id}`);
    });
  };

  // 5. Add comment to presentation
  const handleAddCommentToPresentation = (presId: string, text: string) => {
    const p = presentations.find(item => item.id === presId);
    if (!p) return;
    const updated = {
      ...p,
      comments: [
        ...(p.comments || []),
        {
          id: `c-${Date.now()}`,
          author: currentUser.name,
          avatar: currentUser.avatar,
          text,
          date: 'Hace un momento'
        }
      ]
    };
    setDoc(doc(db, 'presentations', presId), updated).catch(err => {
      handleFirestoreError(err, OperationType.WRITE, `presentations/${presId}`);
    });
  };

  // 6. Add Chat Lobby message (Backend Zod Validated)
  const handleAddChatMessage = async (text: string) => {
    try {
      await postCommunityMessage(currentUser, {
        content: text,
        channel: 'lobby'
      });

      const newMsg: ChatMessage = {
        id: `m-${Date.now()}`,
        user: currentUser.name,
        avatar: currentUser.avatar,
        text,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        role: currentUser.role
      };
      setDoc(doc(db, 'chat_messages', newMsg.id), newMsg).catch(err => {
        handleFirestoreError(err, OperationType.WRITE, `chat_messages/${newMsg.id}`);
      });
      
      updateUserAndPersist(prev => ({
        ...prev,
        points: prev.points + 10
      }));
    } catch (err: any) {
      console.error("[Backend Chat Zod Error]:", err);
      alert(err.message || 'Error de sanitización o validación de mensaje en el servidor');
    }
  };

  // 7. Add Feedback / practice video
  const handleAddFeedbackItem = (title: string, description: string, videoUrl: string) => {
    const newFeedback: FeedbackItem = {
      id: `fb-${Date.now()}`,
      studentId: currentUser.id,
      studentName: currentUser.name,
      studentAvatar: currentUser.avatar,
      videoTitle: title,
      videoUrl,
      description,
      date: new Date().toISOString().split('T')[0],
      corrections: [],
      completed: false
    };
    setDoc(doc(db, 'feedback_items', newFeedback.id), newFeedback).catch(err => {
      handleFirestoreError(err, OperationType.WRITE, `feedback_items/${newFeedback.id}`);
    });

    updateUserAndPersist(prev => ({
      ...prev,
      points: prev.points + 100
    }));
  };

  // 7b. Add bonus points (Gamification administrator / simulator)
  const handleAddBonusPoints = (amount: number) => {
    updateUserAndPersist(prev => ({
      ...prev,
      points: Math.max(0, prev.points + amount)
    }));
  };

  // 7c. Log practice time in minutes
  const handleLogPractice = (
    minutes: number, 
    activityType: 'drill' | 'battle' | 'combo' | 'playlist' | 'sensorial', 
    description: string,
    extra?: { category?: Lesson['category']; bpm?: number }
  ) => {
    const activeUid = firebaseUser?.uid || currentUser.id;
    const newLog: PracticeLog = {
      id: `log-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      minutes,
      activityType,
      description,
      category: extra?.category,
      bpm: extra?.bpm
    };

    if (activeUid) {
      setDoc(doc(db, 'users', activeUid, 'practice_logs', newLog.id), newLog).catch(err => {
        handleFirestoreError(err, OperationType.WRITE, `users/${activeUid}/practice_logs/${newLog.id}`);
      });
    }

    setPracticeLogs(prev => [newLog, ...prev]);

    // Reward points for consistency: 5 points per minute practiced
    const pointsAwarded = Math.round(minutes * 5);
    if (pointsAwarded > 0) {
      updateUserAndPersist(prev => ({
        ...prev,
        points: prev.points + pointsAwarded
      }));
    }
  };

  // 8. Add Instructor Correction
  const handleAddCorrection = (itemId: string, time: string, text: string) => {
    const item = feedbackItems.find(i => i.id === itemId);
    if (!item) return;
    const updated = {
      ...item,
      completed: true,
      corrections: [
        ...(item.corrections || []),
        {
          id: `cor-${Date.now()}`,
          time,
          text,
          author: currentUser.name,
          role: currentUser.role
        }
      ]
    };
    setDoc(doc(db, 'feedback_items', itemId), updated).catch(err => {
      handleFirestoreError(err, OperationType.WRITE, `feedback_items/${itemId}`);
    });

    // Send Web Push Notification and persist notification to Firebase
    notifyStudentFeedbackReviewed({
      studentId: item.studentId,
      studentName: item.studentName,
      videoTitle: item.videoTitle,
      instructorName: currentUser.name || 'Brando Hermoso',
      feedbackId: itemId,
      correctionText: text
    });
  };

  // 9. RSVP toggle for events
  const handleToggleRsvp = (eventId: string) => {
    setEvents(prev => 
      prev.map(evt => {
        if (evt.id === eventId) {
          const isRsvped = evt.rsvpByMe;
          return {
            ...evt,
            rsvpCount: isRsvped ? evt.rsvpCount - 1 : evt.rsvpCount + 1,
            rsvpByMe: !isRsvped
          };
        }
        return evt;
      })
    );
  };

  // 10. Add calendar event (Instructor function)
  const handleInstructorAddEvent = (newEventData: Omit<CalendarEvent, 'id' | 'rsvpCount'>) => {
    const newEvent: CalendarEvent = {
      ...newEventData,
      id: `e-inst-${Date.now()}`,
      rsvpCount: 0
    };
    setEvents(prev => [newEvent, ...prev]);
  };

  // Switch tab render router
  const renderContent = () => {
    switch (activeTab) {
      case 'planes':
        return (
          <PlansView
            currentUser={currentUser}
            onUserChange={updateUserAndPersist}
            language={language}
            onOpenPlansModal={() => setIsPlansModalOpen(true)}
          />
        );
      case 'galeria_bw':
        return (
          <ProfileView
            currentUser={currentUser}
            onUserChange={updateUserAndPersist}
            language={language}
            onOpenPlansModal={() => setIsPlansModalOpen(true)}
            initialTab="galeria_bw"
            onNavigateTab={setActiveTab}
            isGrayscaleGlobal={isGrayscaleGlobal}
            onToggleGrayscaleGlobal={handleToggleGrayscaleGlobal}
          />
        );
      case 'dashboard':
        return (
          <DashboardView
            currentUser={currentUser}
            lessons={lessons}
            playlists={playlists}
            feedbackItems={feedbackItems}
            events={events}
            chatMessages={chatMessages}
            announcements={announcements}
            onAddAnnouncement={handleAddAnnouncement}
            onDeleteAnnouncement={handleDeleteAnnouncement}
            setActiveTab={setActiveTab}
            onMarkLessonComplete={handleMarkLessonComplete}
            selectedCourseLevel={selectedCourseLevel}
            setSelectedCourseLevel={setSelectedCourseLevel}
            onAddChatMessage={handleAddChatMessage}
            practiceLogs={practiceLogs}
            onLogPractice={handleLogPractice}
            onUserChange={updateUserAndPersist}
            language={language}
          />
        );
      case 'cursos':
        if (currentUser.billingStatus !== 'active' && currentUser.subscriptionTier !== 'instructor_pass') {
          return (
            <PremiumGate
              language={language}
              sectionName="classes"
              onSubscribe={() => updateUserAndPersist({ ...currentUser, billingStatus: 'active' })}
              onOpenPlansModal={() => setIsPlansModalOpen(true)}
            />
          );
        }
        return (
          <CursosView
            currentUser={currentUser}
            lessons={lessons}
            instructors={instructors}
            onMarkLessonComplete={handleMarkLessonComplete}
            setActiveTab={setActiveTab}
            selectedCourseLevel={selectedCourseLevel}
            setSelectedCourseLevel={setSelectedCourseLevel}
            language={language}
            feedbackItems={feedbackItems}
            onAddFeedbackItem={handleAddFeedbackItem}
            onAddCorrection={handleAddCorrection}
          />
        );
      case 'podcasts':
        return (
          <PodcastsView
            currentUser={currentUser}
            onUserChange={updateUserAndPersist}
            instructors={instructors}
          />
        );
      case 'classroom':
        return (
          <ClassroomView
            currentUser={currentUser}
            language={language}
            lessons={lessons}
          />
        );
      case 'tasks':
        return (
          <TasksView
            currentUser={currentUser}
            language={language}
            lessons={lessons}
            onAddBonusPoints={handleAddBonusPoints}
          />
        );
      case 'google_slides':
        return (
          <GoogleSlidesView
            currentUser={currentUser}
            language={language}
          />
        );
      case 'ai_studio':
        return <AiStudioView />;
      case 'ebooks':
        if (currentUser.billingStatus !== 'active' && currentUser.subscriptionTier !== 'instructor_pass') {
          return (
            <PremiumGate
              language={language}
              sectionName="resources"
              onSubscribe={() => updateUserAndPersist({ ...currentUser, billingStatus: 'active' })}
              onOpenPlansModal={() => setIsPlansModalOpen(true)}
            />
          );
        }
        return (
          <EbooksView
            currentUser={currentUser}
            language={language}
          />
        );
      case 'entrenamiento':
        if (currentUser.billingStatus !== 'active' && !currentUser.subscriptionTier) {
          return (
            <PremiumGate
              language={language}
              sectionName="lab"
              onSubscribe={() => updateUserAndPersist({ ...currentUser, billingStatus: 'active' })}
              onOpenPlansModal={() => setIsPlansModalOpen(true)}
            />
          );
        }
        return (
          <EntrenamientoView
            currentUser={currentUser}
            playlists={playlists}
            feedbackItems={feedbackItems}
            onAddFeedbackItem={handleAddFeedbackItem}
            onAddCorrection={handleAddCorrection}
            onAddBonusPoints={handleAddBonusPoints}
            onLogPractice={handleLogPractice}
            language={language}
            onUserChange={updateUserAndPersist}
          />
        );
      case 'fisico':
        return (
          <FisicoView
            currentUser={currentUser}
            language={language}
            onAddBonusPoints={handleAddBonusPoints}
          />
        );
      case 'comunidad':
        return (
          <ComunidadView
            currentUser={currentUser}
            announcements={announcements}
            presentations={presentations}
            chatMessages={chatMessages}
            onAddAnnouncement={handleAddAnnouncement}
            onAddPresentation={handleAddPresentation}
            onAddChatMessage={handleAddChatMessage}
            onLikePresentation={handleLikePresentation}
            onAddCommentToPresentation={handleAddCommentToPresentation}
            language={language}
          />
        );
      case 'friends':
        return (
          <ProfileView
            currentUser={currentUser}
            onUserChange={updateUserAndPersist}
            language={language}
            onOpenPlansModal={() => setIsPlansModalOpen(true)}
            initialTab="amigos"
            onNavigateTab={setActiveTab}
          />
        );
      case 'ranking':
        return (
          <RankingView
            currentUser={currentUser}
            lessons={lessons}
            feedbackItems={feedbackItems}
            chatMessagesCount={(chatMessages || []).filter(msg => msg && msg.user === currentUser.name).length}
            onAddBonusPoints={handleAddBonusPoints}
            setActiveTab={setActiveTab}
            onUserChange={updateUserAndPersist}
            language={language}
          />
        );
      case 'reels':
        return (
          <ReelsView
            currentUser={currentUser}
            onNavigateTab={setActiveTab}
            language={language}
          />
        );
      case 'live':
        return (
          <LiveView
            currentUser={currentUser}
            events={events}
            onToggleRsvp={handleToggleRsvp}
            language={language}
          />
        );
      case 'profile':
        return (
          <ProfileView
            currentUser={currentUser}
            onUserChange={updateUserAndPersist}
            language={language}
            onOpenPlansModal={() => setIsPlansModalOpen(true)}
            initialTab="expediente"
            onNavigateTab={setActiveTab}
            isGrayscaleGlobal={isGrayscaleGlobal}
            onToggleGrayscaleGlobal={handleToggleGrayscaleGlobal}
          />
        );
      case 'privacy':
        return (
          <PrivacyView
            currentUser={currentUser}
            language={language}
          />
        );
      case 'instructor':
        return (
          <InstructorView
            currentUser={currentUser}
            onUserChange={updateUserAndPersist}
            events={events}
            onAddEvent={handleInstructorAddEvent}
            language={language}
            setActiveTab={setActiveTab}
            lessons={lessons}
          />
        );
      case 'gmail':
        return (
          <div className="flex-1 overflow-y-auto p-6 bg-[#0A0A0A] flex flex-col items-center justify-center text-center max-w-2xl mx-auto space-y-6">
            <div className="p-4 bg-red-500/20 text-red-400 rounded-full border border-red-500/40 shadow-xl">
              <Mail className="w-10 h-10" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-white uppercase tracking-tight">Integración Oficial con Gmail</h2>
              <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                Conecta tu cuenta de Gmail para enviar reportes de evaluación, comunicados de cátedra y recibir notificaciones académicas de Waack On.
              </p>
            </div>
            <button
              onClick={() => setShowGmailModal(true)}
              className="px-6 py-3 bg-[#E9C349] text-black text-xs font-black rounded-2xl shadow-xl hover:bg-yellow-300 transition-all uppercase flex items-center gap-2"
            >
              <Mail className="w-4 h-4" /> Abrir Gestor de Gmail
            </button>
          </div>
        );
      case 'google_picker':
        return (
          <div className="flex-1 overflow-y-auto p-6 bg-[#0A0A0A] flex flex-col items-center justify-center text-center max-w-2xl mx-auto space-y-6">
            <div className="p-4 bg-blue-500/20 text-blue-400 rounded-full border border-blue-500/40 shadow-xl">
              <HardDrive className="w-10 h-10" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-white uppercase tracking-tight">Google Drive Picker</h2>
              <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                Examina y selecciona videos de tus drilings de Waacking, pistas de música Disco o documentos de cátedra guardados en tu Google Drive.
              </p>
            </div>
            <button
              onClick={() => setShowPickerModal(true)}
              className="px-6 py-3 bg-[#E9C349] text-black text-xs font-black rounded-2xl shadow-xl hover:bg-yellow-300 transition-all uppercase flex items-center gap-2"
            >
              <HardDrive className="w-4 h-4" /> Abrir Selector de Drive
            </button>
          </div>
        );
      case 'support':
        return (
          <div className="flex-1 overflow-y-auto p-6 bg-brand-bg flex flex-col items-center justify-center text-center max-w-2xl mx-auto space-y-6">
            <div className="p-4 bg-brand-orange-light text-brand-orange rounded-full border-4 border-brand-orange shadow-[4px_4px_0px_0px_#FF9F1C]">
              <ShieldAlert className="w-10 h-10" />
            </div>
            <div>
              <h2 className="text-2xl font-display font-black text-brand-dark uppercase tracking-tight">¿NECESITAS AYUDA TÉCNICA?</h2>
              <p className="text-xs text-gray-600 mt-2 leading-relaxed font-medium">
                Nuestra plataforma está optimizada para el aprendizaje sincrónico de baile. Si tienes inconvenientes con el metrónomo de sonido en vivo, los reproductores BPM o la carga de video, ponte en contacto con soporte técnico.
              </p>
            </div>
            <div className="w-full p-5 bg-white border-4 border-brand-dark rounded-2xl shadow-[6px_6px_0px_0px_rgba(29,29,31,1)] text-left space-y-2 text-brand-dark">
              <p className="text-xs font-bold"><strong>Email:</strong> soporte@academiadewaacking.com</p>
              <p className="text-xs font-black text-brand-cyan"><strong>Atención:</strong> Lunes a Viernes (09:00 - 18:00)</p>
            </div>
            <button 
              onClick={() => setActiveTab('dashboard')} 
              className="px-6 py-3 bg-brand-pink text-white text-xs font-black rounded-xl border-2 border-brand-dark shadow-[4px_4px_0px_0px_rgba(29,29,31,1)] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[2px_2px_0px_0px_rgba(29,29,31,1)] transition-all uppercase"
            >
              Volver al Dashboard
            </button>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <ProtectedRoute
      authChecked={authChecked}
      firebaseUser={firebaseUser}
      isGuestMode={isGuestMode}
      fallback={
        <LoginView
          onGuestMode={() => {
            setIsGuestMode(true);
            localStorage.setItem('waacking_guest_mode', 'true');
          }}
          onSuccess={(user) => {
            setFirebaseUser(user);
            setIsGuestMode(false);
            localStorage.setItem('waacking_guest_mode', 'false');
          }}
          language={language}
          onLanguageChange={setLanguage}
        />
      }
    >
      <div id="app-container" className={`flex h-screen font-sans overflow-hidden selection:bg-[#9A2B3C] selection:text-[#EDEFF4] flex-col lg:flex-row relative transition-all duration-300 ${
        isGrayscaleGlobal ? 'grayscale contrast-125' : ''
      } ${theme === 'light' ? 'bg-[#f4f5f7] text-[#1a1a1a]' : 'bg-[#0A0A0A] text-[#EDEFF4]'}`}>
      {/* Mobile Sidebar Drawer (Sliding menu) */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <div className="fixed inset-0 z-50 lg:hidden flex">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="absolute inset-0 bg-[#0A0A0A]/80 backdrop-blur-sm"
            />
            {/* Drawer Content */}
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              className="relative z-10"
            >
              {/* Close Button overlay inside the sliding drawer */}
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="absolute top-4 right-4 p-2 rounded-lg bg-[#121212] border border-[#262626] text-[#EDEFF4] hover:bg-[#9A2B3C] transition-all z-20 focus:outline-none"
                title="Cerrar menú"
              >
                <X className="w-4 h-4" />
              </button>
              <Sidebar 
                activeTab={activeTab} 
                setActiveTab={setActiveTab} 
                currentUser={currentUser}
                onUserChange={updateUserAndPersist}
                language={language}
                onStartOnboarding={() => setShowOnboarding(true)}
              />
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Desktop Sidebar (Permanent sidebar) */}
      {!isFocusMode && (
        <div className="hidden lg:flex shrink-0 h-full">
          <Sidebar 
            activeTab={activeTab} 
            setActiveTab={setActiveTab} 
            currentUser={currentUser}
            onUserChange={updateUserAndPersist}
            language={language}
            onStartOnboarding={() => setShowOnboarding(true)}
          />
        </div>
      )}

      {/* Main Content Area */}
      <div className={`flex-1 flex flex-col min-w-0 overflow-hidden h-full ${theme === 'light' ? 'bg-[#f8f9fa] text-[#1a1a1a]' : 'bg-[#0A0A0A] text-[#EDEFF4]'}`}>
        
        {/* Top Header Navigation */}
        <header id="top-header" className={`h-16 border-b px-4 sm:px-6 flex items-center justify-between shrink-0 select-none ${theme === 'light' ? 'bg-white border-slate-300 text-slate-900 shadow-sm' : 'border-[#2A2A2A] bg-[#0A0A0A]'}`}>
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            {/* Hamburger button for mobile menu */}
            {!isFocusMode && (
              <button
                onClick={() => setIsMobileMenuOpen(true)}
                className={`lg:hidden p-2 rounded-xl transition-all focus:outline-none shrink-0 border ${
                  theme === 'light' 
                    ? 'bg-slate-100 hover:bg-slate-200 border-slate-300 text-slate-900' 
                    : 'bg-[#141414] hover:bg-[#9A2B3C] border-[#333333] text-white'
                }`}
                aria-label="Abrir menú de navegación"
                title="Abrir menú de navegación"
              >
                <Menu className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            )}

            <div className="flex items-center gap-1 sm:gap-2 truncate">
              {isFocusMode ? (
                <div className="flex items-center gap-2">
                  <span className="flex h-2.5 w-2.5 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#9A2B3C] opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#9A2B3C]"></span>
                  </span>
                  <span className="text-[10px] sm:text-[11px] font-mono tracking-widest text-[#9A2B3C] font-black uppercase">
                    {focusModeText[language]?.activeLabel || 'MODO ENFOQUE'}
                  </span>
                  <span className="text-slate-400 font-mono font-bold">/</span>
                  <span className={`text-[10px] sm:text-[11px] font-mono tracking-wider uppercase font-extrabold truncate ${theme === 'light' ? 'text-slate-800' : 'text-[#EDEFF4]'}`}>{activeTab}</span>
                </div>
              ) : (
                <>
                  <span className="text-[10px] sm:text-[11px] font-mono tracking-widest text-[#E9C349] font-black uppercase hidden sm:inline shrink-0">WAACK ON PORTAL</span>
                  <span className="text-slate-400 font-mono font-bold hidden sm:inline shrink-0">/</span>
                  <span className={`text-[10px] sm:text-[11px] font-mono tracking-wider uppercase font-extrabold truncate ${theme === 'light' ? 'text-slate-800' : 'text-[#EDEFF4]'}`}>{activeTab}</span>
                </>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Training Intensity Duration Timer */}
            {(trainingSeconds > 0 || activeTab === 'entrenamiento') && (
              <div className={`hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl border font-mono text-xs transition-all duration-300 ${
                activeTab === 'entrenamiento'
                  ? 'bg-[#9A2B3C]/35 border-[#E9C349]/80 text-[#E9C349] font-black shadow-[0_0_22px_rgba(233,195,73,0.35),0_0_10px_rgba(154,43,60,0.5)] animate-pulse'
                  : theme === 'dark'
                    ? 'bg-[#141414] border-[#333333] text-white font-bold shadow-sm'
                    : 'bg-slate-100 border-slate-300 text-slate-900 font-bold shadow-sm'
              }`} title="Tiempo de sesión de entrenamiento">
                <Timer className="w-3.5 h-3.5 text-[#E9C349]" />
                <span className="tracking-wider">{formatTrainingTime(trainingSeconds)}</span>
                {activeTab === 'entrenamiento' && (
                  <span className="text-[9px] uppercase tracking-widest text-[#E9C349] font-black hidden md:inline">INTENSIVO</span>
                )}
              </div>
            )}

            {/* Theme Toggle Button */}
            <button
              onClick={() => setTheme(prev => prev === 'dark' ? 'light' : 'dark')}
              className={`p-1.5 sm:p-2 rounded-xl transition-all border focus:outline-none flex items-center gap-1.5 ${
                theme === 'light'
                  ? 'bg-slate-100 hover:bg-slate-200 border-slate-300 text-slate-900 font-bold'
                  : 'bg-[#141414] hover:bg-[#202020] border-[#333333] text-white font-bold'
              }`}
              aria-label={theme === 'dark' ? 'Cambiar a Modo Claro' : 'Cambiar a Modo Oscuro'}
              title={theme === 'dark' ? 'Cambiar a Modo Claro' : 'Cambiar a Modo Oscuro'}
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-[#E9C349]" />
              ) : (
                <Moon className="w-4 h-4 text-amber-600" />
              )}
              <span className="text-[10px] font-mono font-bold tracking-wider hidden xl:inline">
                {theme === 'dark' ? 'CLARO' : 'OSCURO'}
              </span>
            </button>

            {/* Language Dropdown Selector */}
            {!isFocusMode && (
              <div className={`flex items-center gap-1.5 border px-2.5 py-1.5 rounded-xl text-xs font-bold ${
                theme === 'light' ? 'border-slate-300 bg-slate-100 text-slate-900' : 'border-[#333333] bg-[#141414] text-white'
              }`}>
                <span className={`text-[10px] font-mono font-bold uppercase tracking-wider hidden sm:inline ${
                  theme === 'light' ? 'text-slate-600' : 'text-slate-300'
                }`}>{translations[language].languageLabel}:</span>
                <select
                  id="language-selector"
                  value={language}
                  onChange={(e) => setLanguage(e.target.value as Language)}
                  className="bg-transparent font-bold text-xs border-none outline-none cursor-pointer focus:ring-0 py-0 pr-5 pl-0"
                  aria-label="Seleccionar idioma de la plataforma"
                  title="Seleccionar idioma de la plataforma"
                >
                  {Object.entries(languageNames).map(([code, name]) => (
                    <option key={code} value={code} className={theme === 'light' ? 'bg-white text-slate-900' : 'bg-[#141414] text-white'}>
                      {name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Quick stats mini badge */}
            {!isFocusMode && (
              <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-[#9A2B3C]/25 rounded-full border border-[#9A2B3C] text-white">
                <Sparkles className="w-3.5 h-3.5 text-[#E9C349]" />
                <span className="text-[10px] font-mono font-bold tracking-wider">
                  {(currentUser.completedLessons || []).length} CLASES COMPLETADAS
                </span>
              </div>
            )}

            {/* Notification trigger */}
            {!isFocusMode && (
              <button 
                id="top-bell"
                className={`relative p-1.5 sm:p-2 rounded-xl transition-all border focus:outline-none ${
                  theme === 'light' 
                    ? 'bg-slate-100 hover:bg-slate-200 border-slate-300 text-slate-900' 
                    : 'bg-[#141414] hover:bg-[#202020] border-[#333333] text-white'
                } ${isBouncing ? 'animate-bounce ring-2 ring-[#E9C349] bg-[#E9C349]/20' : ''}`}
                onClick={() => {
                  if ((assignedTasksNotifications || []).length > 0) {
                    setActiveTab('tasks');
                  } else {
                    alert("🔔 Próximo Live: Martes 19:30 - Técnicas de Postura Base con Brando.");
                  }
                }}
                aria-label={(assignedTasksNotifications || []).length > 0 ? `${assignedTasksNotifications.length} tareas pendientes asignadas` : "Abrir notificaciones"}
                title={(assignedTasksNotifications || []).length > 0 ? `${assignedTasksNotifications.length} tareas pendientes asignadas` : "Notificaciones y novedades"}
              >
                <Bell className={`w-4 h-4 ${theme === 'light' ? 'text-slate-800' : 'text-[#EDEFF4]'}`} />
                {unreadCount > 0 ? (
                  <span className="absolute -top-1 -right-1 px-1.5 py-0.5 rounded-full bg-[#9A2B3C] text-[9px] font-mono font-black text-white border border-[#0A0A0A] animate-pulse shadow-[0_0_15px_rgba(154,43,60,0.9)] ring-2 ring-[#E9C349]/50">
                    {unreadCount}
                  </span>
                ) : (
                  <span className="absolute top-1 right-1 w-2.5 h-2.5 rounded-full bg-[#9A2B3C] border border-[#0A0A0A]" />
                )}
              </button>
            )}

            {/* Global Black & White Mode Toggle */}
            {!isFocusMode && (
              <button
                onClick={handleToggleGrayscaleGlobal}
                className={`p-1.5 sm:p-2 rounded-xl transition-all border focus:outline-none flex items-center gap-1.5 cursor-pointer ${
                  isGrayscaleGlobal
                    ? 'bg-white text-black border-white font-bold shadow-md'
                    : theme === 'light'
                      ? 'bg-slate-100 hover:bg-slate-200 border-slate-300 text-slate-900'
                      : 'bg-[#141414] hover:bg-[#202020] border-[#333333] text-white'
                }`}
                aria-label={isGrayscaleGlobal ? "Desactivar Modo Blanco y Negro" : "Activar Modo Blanco y Negro"}
                title={isGrayscaleGlobal ? "Desactivar Modo Blanco y Negro" : "Activar Modo Blanco y Negro"}
              >
                <Camera className={`w-4 h-4 ${isGrayscaleGlobal ? 'text-black' : 'text-[#E9C349]'}`} />
                <span className="text-[10px] font-mono font-bold tracking-wider hidden lg:inline">
                  {isGrayscaleGlobal ? 'MODO B&W: ON' : 'BLANCO Y NEGRO'}
                </span>
              </button>
            )}

            {/* Help/Tour trigger */}
            {!isFocusMode && (
              <button
                id="top-tour-btn"
                className={`relative p-1.5 sm:p-2 rounded-xl transition-all border focus:outline-none ${
                  theme === 'light' 
                    ? 'bg-slate-100 hover:bg-slate-200 border-slate-300 text-slate-900' 
                    : 'bg-[#141414] hover:bg-[#202020] border-[#333333] text-white'
                }`}
                onClick={() => setShowOnboarding(true)}
                aria-label="Iniciar tour académico guiado"
                title="Iniciar tour académico guiado"
              >
                <HelpCircle className="w-4 h-4 text-[#E9C349]" />
              </button>
            )}

            {/* Focus Mode Toggle Button */}
            <button
              onClick={handleToggleFocusMode}
              className={`p-1.5 sm:p-2 rounded-xl transition-all border focus:outline-none flex items-center gap-1.5 ${
                isFocusMode
                  ? 'bg-[#9A2B3C]/30 border-[#9A2B3C] text-[#E9C349] hover:bg-[#9A2B3C]/40 font-bold'
                  : theme === 'light' 
                    ? 'text-slate-900 bg-slate-100 hover:bg-slate-200 border-slate-300 font-bold'
                    : 'text-white bg-[#141414] hover:bg-[#202020] border-[#333333] font-bold'
              }`}
              aria-label={isFocusMode ? (focusModeText[language]?.disable || 'Desactivar Modo Enfoque') : (focusModeText[language]?.enable || 'Activar Modo Enfoque')}
              title={isFocusMode ? (focusModeText[language]?.disable || 'Desactivar Modo Enfoque') : (focusModeText[language]?.enable || 'Activar Modo Enfoque')}
            >
              {isFocusMode ? (
                <>
                  <EyeOff className="w-4 h-4 text-[#E9C349]" />
                  <span className="text-[10px] font-mono font-bold tracking-wider hidden md:inline">
                    {focusModeText[language]?.disable || 'SALIR ENFOQUE'}
                  </span>
                </>
              ) : (
                <>
                  <Eye className="w-4 h-4 text-[#E9C349]" />
                  <span className="text-[10px] font-mono font-bold tracking-wider hidden md:inline">
                    {focusModeText[language]?.enable || 'MODO ENFOQUE'}
                  </span>
                </>
              )}
            </button>

            {/* Profile trigger */}
            <button 
              onClick={() => setActiveTab('profile')}
              className={`flex items-center gap-2 border-l pl-2 sm:pl-3 hover:opacity-90 transition-opacity text-left cursor-pointer focus:outline-none ${theme === 'light' ? 'border-slate-300' : 'border-[#333333]'}`}
              aria-label={`Ver perfil de ${currentUser.name}`}
              title={`Ver perfil de ${currentUser.name}`}
            >
              <img 
                src={currentUser.avatar} 
                alt={currentUser.name} 
                className="w-7 h-7 sm:w-8 sm:h-8 rounded-full border-2 border-[#9A2B3C] object-cover shrink-0" 
                referrerPolicy="no-referrer"
              />
              <span className={`text-xs font-black hidden sm:inline uppercase tracking-wide ${theme === 'light' ? 'text-slate-900' : 'text-white'}`}>{currentUser.name}</span>
            </button>
          </div>
        </header>

        {/* Dynamic Inner Router view */}
        <main className={`flex-1 flex flex-col overflow-hidden relative ${theme === 'light' ? 'bg-[#f4f5f7] text-[#1a1a1a]' : 'bg-[#0A0A0A] text-[#EDEFF4]'}`}>
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 12, scale: 0.99 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -12, scale: 0.99 }}
              transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
              className={`flex-1 flex flex-col overflow-hidden ${isFocusMode ? '' : 'pb-16 lg:pb-0'}`}
            >
              <React.Suspense fallback={<ViewSkeleton title={activeTab} />}>
                {renderContent()}
              </React.Suspense>
            </motion.div>
          </AnimatePresence>
        </main>

        {/* Tactile Bottom Navigation for Mobile Devices */}
        {!isFocusMode && (
          <div id="mobile-bottom-nav" className="lg:hidden fixed bottom-0 left-0 right-0 h-16 bg-white border-t-4 border-brand-dark flex items-center justify-around px-2 shrink-0 select-none z-40 pb-safe shadow-[0_-4px_10px_rgba(0,0,0,0.05)]">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`flex flex-col items-center justify-center flex-1 h-full py-1 text-[9px] sm:text-[10px] font-black transition-all focus:outline-none ${
                activeTab === 'dashboard' ? 'text-brand-pink' : 'text-gray-500 hover:text-brand-dark'
              }`}
            >
              <LayoutDashboard className="w-5 h-5 mb-0.5" />
              <span>INICIO</span>
            </button>
            <button
              onClick={() => setActiveTab('cursos')}
              className={`flex flex-col items-center justify-center flex-1 h-full py-1 text-[9px] sm:text-[10px] font-black transition-all focus:outline-none ${
                activeTab === 'cursos' ? 'text-brand-pink' : 'text-gray-500 hover:text-brand-dark'
              }`}
            >
              <GraduationCap className="w-5 h-5 mb-0.5" />
              <span>CLASES</span>
            </button>
            <button
              onClick={() => setActiveTab('ebooks')}
              className={`flex flex-col items-center justify-center flex-1 h-full py-1 text-[9px] sm:text-[10px] font-black transition-all focus:outline-none ${
                activeTab === 'ebooks' ? 'text-[#9A2B3C]' : 'text-gray-500 hover:text-[#121212]'
              }`}
            >
              <BookOpen className="w-5 h-5 mb-0.5" />
              <span>RECURSOS</span>
            </button>
            <button
              onClick={() => setActiveTab('entrenamiento')}
              className={`flex flex-col items-center justify-center flex-1 h-full py-1 text-[9px] sm:text-[10px] font-black transition-all focus:outline-none ${
                activeTab === 'entrenamiento' ? 'text-brand-pink' : 'text-gray-500 hover:text-brand-dark'
              }`}
            >
              <Sparkles className="w-5 h-5 mb-0.5" />
              <span>ZONA</span>
            </button>
            <button
              onClick={() => setActiveTab('profile')}
              className={`flex flex-col items-center justify-center flex-1 h-full py-1 text-[9px] sm:text-[10px] font-black transition-all focus:outline-none ${
                activeTab === 'profile' ? 'text-brand-pink' : 'text-gray-500 hover:text-brand-dark'
              }`}
            >
              <img 
                src={currentUser.avatar} 
                alt={currentUser.name} 
                className={`w-5 h-5 rounded-full object-cover border-2 shrink-0 ${
                  activeTab === 'profile' ? 'border-brand-pink' : 'border-gray-400'
                }`}
                referrerPolicy="no-referrer"
              />
              <span className="mt-0.5 uppercase">CUENTA</span>
            </button>
          </div>
        )}

      </div>

      <AnimatePresence>
        {showOnboarding && (
          <OnboardingTour
            currentUser={currentUser}
            language={language}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            onAddBonusPoints={handleAddBonusPoints}
            onUpdateUser={updateUserAndPersist}
            onClose={() => {
              setShowOnboarding(false);
              localStorage.setItem('waacking_onboarding_completed', 'true');
            }}
          />
        )}
      </AnimatePresence>

      <SubscriptionPlansModal
        isOpen={isPlansModalOpen}
        onClose={() => setIsPlansModalOpen(false)}
        currentUser={currentUser}
        language={language}
        onUpdateUser={updateUserAndPersist}
      />

      {/* Gmail Integration Widget */}
      <GmailWidget
        isOpen={showGmailModal}
        onClose={() => setShowGmailModal(false)}
      />

      {/* Google Drive Picker Modal */}
      <GooglePickerModal
        isOpen={showPickerModal}
        onClose={() => setShowPickerModal(false)}
        onSelectFile={(file) => {
          alert(`¡Archivo de Google Drive seleccionado con éxito!\nNombre: ${file.name}\nEnlace: ${file.webViewLink || 'Disponible'}`);
        }}
      />

      {/* Real-time Live Battle Invitation Popup */}
      <BattleInvitationModal 
        currentUser={currentUser}
        onAcceptBattle={(battle) => {
          setActiveTab('live');
        }}
      />

      {/* Lesson Completion Celebration Modal */}
      <AnimatePresence>
        {celebratedLesson && (
          <LessonCelebration
            lesson={celebratedLesson}
            currentUser={currentUser}
            onClose={() => setCelebratedLesson(null)}
          />
        )}
      </AnimatePresence>

      {/* Real-time Web Push Feedback Toast Alert */}
      <AnimatePresence>
        {pushToast && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            className="fixed bottom-6 right-6 z-[9999] max-w-md bg-[#121212] border-2 border-[#E9C349] p-4 rounded-2xl shadow-[0_10px_35px_rgba(233,195,73,0.3)] text-white flex flex-col gap-3"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#E9C349]/20 border border-[#E9C349]/50 flex items-center justify-center text-[#E9C349] shrink-0">
                  <Bell className="w-5 h-5 animate-bounce" />
                </div>
                <div>
                  <h4 className="font-mono font-bold text-xs uppercase text-[#E9C349] tracking-wider">
                    {pushToast.title}
                  </h4>
                  <p className="text-[11px] text-gray-300 font-medium leading-tight mt-0.5">
                    {pushToast.body}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setPushToast(null)}
                className="text-gray-400 hover:text-white p-1 rounded-lg shrink-0"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="flex items-center justify-end gap-2 pt-1 border-t border-[#262626]">
              <button
                onClick={() => {
                  setPushToast(null);
                  setActiveTab('entrenamiento');
                }}
                className="px-3 py-1.5 bg-[#E9C349] hover:bg-[#d4ae36] text-black font-mono text-[11px] font-bold uppercase rounded-xl transition-all shadow-md cursor-pointer flex items-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5" /> Ver Retroalimentación
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
    </ProtectedRoute>
  );
}
