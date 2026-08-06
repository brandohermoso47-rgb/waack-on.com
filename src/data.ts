import { Announcement, Presentation, ChatMessage, Lesson, PlaylistItem, FeedbackItem, CalendarEvent, User, PracticeLog, InstructorCatedra, PodcastShow } from './types';

export const INITIAL_USER: User = {
  id: 'u-1',
  name: 'Zoe "Flow" Jackson',
  nickname: 'Master of Rhythm',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=600',
  role: 'student',
  completedLessons: ['l-101', 'l-103', 'l-105'],
  points: 950,
  bio: 'Specializing in expressive, high-energy Waacking. A passionate performer focused on rhythm, technique, and soulful expression.',
  level: 'advanced',
  instagram: '@zoeflow_waack',
  billingStatus: 'active',
  subscriptionTier: 'instructor_pass',
  targetMinutes: 45
};

export const INITIAL_ANNOUNCEMENTS: Announcement[] = [
  {
    id: 'a-1',
    title: '🏆 Gran Batalla Waack On 2026 - Convocatoria de Competencia',
    content: '¡Instructores y estudiantes! Abrimos las inscripciones para la Batalla Oficial Waack On 2026. Categorías: 1v1 Open Style Waacking y 1v1 Fast Rolls. ¡Habrá premios en efectivo y trofeos físicos para los finalistas!',
    date: '2026-07-20',
    author: 'Brando Hermoso',
    authorAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=120',
    authorRole: 'instructor',
    category: 'competencias',
    important: true,
    actionUrl: 'https://meet.google.com/waack-on-battle',
    imageUrl: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'a-2',
    title: '⚡ Jam & Sesión de Práctica Rítmica en Vivo',
    content: 'Este viernes a las 18:00 (hora central) tendremos una Sesión Rítmica intensiva para pulir el contratiempo y acentos en caja torácica. Conéctate con tu cámara lista para recibir correcciones en tiempo real.',
    date: '2026-07-18',
    author: 'Kumari "WaackQueen"',
    authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=120',
    authorRole: 'instructor',
    category: 'sesiones',
    important: false,
    actionUrl: 'https://meet.google.com/waack-session-jam',
    imageUrl: 'https://images.unsplash.com/photo-1547153760-18fc86324498?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'a-3',
    title: '💃 Masterclass de Aislamiento de Codos & Poses 70s',
    content: 'Nueva clase especial con YoonJi Kim. Exploraremos la estética retro de los años 70, port de bras y la simetría de la pasarela disco. ¡Disponible para todos los niveles de la academia!',
    date: '2026-07-15',
    author: 'YoonJi Kim',
    authorAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=120',
    authorRole: 'instructor',
    category: 'clases',
    important: true,
    imageUrl: 'https://images.unsplash.com/photo-1518834107812-67b0b7c58434?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'a-4',
    title: '📢 Lanzamiento del Cuaderno de Práctica Biomecánica v2.2',
    content: 'Comunidad: Hemos subido la guía actualizada con ejercicios diarios para reducir la tensión en hombros al ejecutar rolls a más de 125 BPM. Descárgalo de forma 100% libre.',
    date: '2026-07-10',
    author: 'Brando Hermoso',
    authorAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=120',
    authorRole: 'instructor',
    category: 'comunicados',
    important: false,
  }
];

export const INITIAL_PRESENTATIONS: Presentation[] = [
  {
    id: 'p-1',
    studentName: 'Marilyn',
    studentAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=120',
    text: '¡Hola a todos! Soy Marilyn de Madrid. Llevo unos 6 meses bailando Waacking de forma autodidacta y mi meta este año es mejorar mi velocidad de brazos (los "rolls") y aprender a contar la música disco de forma orgánica. ¡Encantada de estar aquí!',
    videoUrl: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&q=80&w=500', // image placeholder representing a video preview
    date: 'Hace 2 horas',
    likes: 12,
    comments: [
      {
        id: 'c-1',
        author: 'Brando Hermoso',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=120',
        text: '¡Bienvenida Marilyn! Estás en el lugar correcto. El Nivel 1 te va a ayudar muchísimo con la base de los brazos.',
        date: 'Hace 1 hora'
      }
    ]
  },
  {
    id: 'p-2',
    studentName: 'Pedro',
    studentAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=120',
    text: 'Buenas a todos, soy Pedro. Bailo House y Hip Hop, y vengo a perfeccionar el Waacking para integrarlo a mi Freestyle. ¡Nos vemos en los Lives!',
    date: 'Ayer',
    likes: 8,
    comments: []
  }
];

export const INITIAL_CHAT_MESSAGES: ChatMessage[] = [
  {
    id: 'm-1',
    user: 'Marilyn',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=120',
    text: '¿Alguien probó el drill de 110 BPM de hoy? ¡Qué duro mantener los rolls arriba por 3 minutos!',
    time: '14:20',
    role: 'student'
  },
  {
    id: 'm-2',
    user: 'Pedro',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=120',
    text: '¡Sí! Al final los hombros te queman, pero se siente la mejora en el control.',
    time: '14:22',
    role: 'student'
  },
  {
    id: 'm-3',
    user: 'Brando Hermoso',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=120',
    text: 'Eso es clave, Pedro. Recuerden relajar el trapecio y activar el core para no cargar la espalda alta. ¡Sigan así!',
    time: '14:30',
    role: 'instructor'
  }
];

export const INITIAL_INSTRUCTORS: InstructorCatedra[] = [
  {
    id: 'inst-brando',
    name: 'Brando Hermoso',
    role: 'Director de Cátedra • Técnica Base & Expresión',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=250',
    bio: 'Pionero de la docencia metódica en Waacking. Su cátedra se enfoca en el control biomecánico de brazos, alineación postural y la dramática escénica de Los Ángeles 1970s.',
    specialty: 'Técnica Fundamental, Rolls & Expresión Dramática',
    isSubscribed: true,
    monthlyPrice: '$45 USD/mes',
    featuredColor: 'from-amber-500/20 to-purple-950/40',
    lessonsCount: 4,
    courses: [
      {
        id: 'course-b1',
        title: 'Master Program: Arsenal de Waacking & Rotación Articular',
        subtitle: 'Cátedra Brando Hermoso',
        durationWeeks: 4,
        modulesCount: 8,
        level: 'Nivel 1 & 2',
        description: 'Inmersión sistemática paso a paso para dominar la técnica de codos y proyección postural sin lesionar los hombros.',
        coverImage: 'https://images.unsplash.com/photo-1518834107812-67b0b7c58434?auto=format&fit=crop&q=80&w=600',
        status: 'active'
      },
      {
        id: 'course-b2',
        title: 'Curso Intensivo: Drama & Carácter Cinematográfico 70s',
        subtitle: 'Cátedra Brando Hermoso',
        durationWeeks: 3,
        modulesCount: 6,
        level: 'Avanzado',
        description: 'Desarrolla el magnetismo actoral y la presencia magnética en el escenario inspirándote en las divas del cine clásico.',
        coverImage: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&q=80&w=600',
        status: 'active'
      }
    ],
    materials: [
      {
        id: 'mat-b1',
        title: 'Waacking Workbook v2.1: Orígenes de Los Ángeles',
        type: 'PDF',
        pages: 24,
        fileSize: '4.2 MB',
        description: 'Guía histórica de los pioneros de LA, métrica Disco 4/4 y desglose de los 5 pilares del Waacking.'
      },
      {
        id: 'mat-b2',
        title: 'Manual Biomecánico de Codo y Hombro',
        type: 'Guía Teórica',
        pages: 12,
        fileSize: '2.8 MB',
        description: 'Anatomía funcional aplicada para ejecutar los Rolls sin tensión cervical ni sobrecarga.'
      }
    ]
  },
  {
    id: 'inst-elena',
    name: 'Elena Rostova',
    role: 'Directora de Cátedra • Speed-Waack & Síncopas',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=250',
    bio: 'Reconocida competidora internacional de Waacking y Funk Battles. Su cátedra impulsa la velocidad extrema de ejecución, la precisión geométrica de líneas y el dominio del contratiempo.',
    specialty: 'Síncopas Avanzadas, Speed Drills & Geometría Espacial',
    isSubscribed: true,
    monthlyPrice: '$35 USD/mes',
    featuredColor: 'from-pink-500/20 to-indigo-950/40',
    lessonsCount: 3,
    courses: [
      {
        id: 'course-e1',
        title: 'Intensivo: Speed-Waack & Síncopas a +128 BPM',
        subtitle: 'Cátedra Elena Rostova',
        durationWeeks: 3,
        modulesCount: 6,
        level: 'Nivel 2',
        description: 'Acelera la velocidad articular y la precisión para marcar los platillos y síncopas más complejas sobre música rápida.',
        coverImage: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&q=80&w=600',
        status: 'active'
      },
      {
        id: 'course-e2',
        title: 'Programa de Geometría Escénica & Proyección Espacial',
        subtitle: 'Cátedra Elena Rostova',
        durationWeeks: 4,
        modulesCount: 8,
        level: 'Todos los niveles',
        description: 'Aprende a llenar el espacio físico trazando ángulos limpios y utilizando los tres niveles de profundidad.',
        coverImage: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&q=80&w=600',
        status: 'active'
      }
    ],
    materials: [
      {
        id: 'mat-e1',
        title: 'Guía de Aceleración y Control Articular - Elena Rostova',
        type: 'Guía Teórica',
        pages: 18,
        fileSize: '3.5 MB',
        description: 'Ejercicios progresivos de resistencia física para aumentar los BPM de tus codos de forma limpia.'
      },
      {
        id: 'mat-e2',
        title: 'Mapa Geométrico de Posición de Brazos & Ángulos',
        type: 'Mapa Mental',
        pages: 8,
        fileSize: '1.9 MB',
        description: 'Diagramas visuales para corregir líneas diagonales, paralelas y simetrías durante el freestyle.'
      }
    ]
  }
];

export const INITIAL_LESSONS: Lesson[] = [
  // Nivel 1
  {
    id: 'l-101',
    level: 1,
    title: '1. Postura Base y Centro de Gravedad',
    description: 'Aprende la colocación correcta de la columna, la alineación de hombros y cómo activar tu torso para sostener el peso de los brazos.',
    duration: '12:45',
    category: 'postura',
    videoUrl: 'https://images.unsplash.com/photo-1518834107812-67b0b7c58434?auto=format&fit=crop&q=80&w=600',
    completed: true,
    instructorId: 'inst-brando',
    instructorName: 'Brando Hermoso'
  },
  {
    id: 'l-102',
    level: 1,
    title: '2. Drills de Brazos: El Roll Básico (Waack)',
    description: 'La técnica fundamental del Waacking. Rotación interna y externa de codo pasando por detrás de la cabeza de forma segura.',
    duration: '18:20',
    category: 'brazos',
    videoUrl: 'https://images.unsplash.com/photo-1547153760-18fc86324498?auto=format&fit=crop&q=80&w=600',
    completed: false,
    instructorId: 'inst-brando',
    instructorName: 'Brando Hermoso'
  },
  {
    id: 'l-103',
    level: 1,
    title: '3. Musicalidad Disco y Conteo en 8s',
    description: 'Entiende el beat disco, las síncopas, la caja y el charles para poder acentuar de forma precisa tus golpes y poses.',
    duration: '14:15',
    category: 'musicalidad',
    videoUrl: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&q=80&w=600',
    completed: true,
    instructorId: 'inst-brando',
    instructorName: 'Brando Hermoso'
  },
  {
    id: 'l-104',
    level: 1,
    title: '4. Transiciones y Líneas Simétricas',
    description: 'Cómo pasar de un roll a una pose estática manteniendo la simetría espacial y la proyección escénica.',
    duration: '15:50',
    category: 'fundamentos',
    videoUrl: 'https://images.unsplash.com/photo-1504609773096-104ff2c73ba4?auto=format&fit=crop&q=80&w=600',
    completed: false,
    instructorId: 'inst-elena',
    instructorName: 'Elena Rostova'
  },

  // Nivel 2
  {
    id: 'l-201',
    level: 2,
    title: '1. Introducción al Freestyle: Habitar el Espacio',
    description: 'Técnicas de improvisación para salir del plano bidimensional. Niveles altos, medios y bajos combinando desplazamientos.',
    duration: '22:10',
    category: 'improvisacion',
    videoUrl: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&q=80&w=600',
    completed: false,
    instructorId: 'inst-elena',
    instructorName: 'Elena Rostova'
  },
  {
    id: 'l-202',
    level: 2,
    title: '2. Carácter y Expresividad Genuina',
    description: 'El Waacking nació del drama y el cine mudo. Trabajamos la mirada, la intención escénica y personificar la música disco.',
    duration: '19:40',
    category: 'caracter',
    videoUrl: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&q=80&w=600',
    completed: false,
    instructorId: 'inst-brando',
    instructorName: 'Brando Hermoso'
  },
  {
    id: 'l-203',
    level: 2,
    title: '3. Laboratorio de Velocidad y Síncopa',
    description: 'Entrenamiento de alta intensidad para acelerar los rolls y clavar los acentos en doble tiempo sobre música rápida (+125 BPM).',
    duration: '25:15',
    category: 'velocidad',
    videoUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&q=80&w=600',
    completed: false,
    instructorId: 'inst-elena',
    instructorName: 'Elena Rostova'
  }
];

export const INITIAL_PLAYLISTS: PlaylistItem[] = [
  // Lentas (Slow BPM)
  {
    id: 'pl-1',
    title: 'Rock Your Baby',
    artist: 'George McCrae',
    bpm: 104,
    duration: '3:20',
    type: 'slow',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3'
  },
  {
    id: 'pl-2',
    title: 'Love to Love You Baby',
    artist: 'Donna Summer',
    bpm: 110,
    duration: '4:58',
    type: 'slow',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3'
  },
  {
    id: 'pl-3',
    title: 'Good Times',
    artist: 'Chic',
    bpm: 115,
    duration: '3:45',
    type: 'slow',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3'
  },
  // Rápidas (Fast BPM)
  {
    id: 'pl-4',
    title: 'I Feel Love',
    artist: 'Donna Summer',
    bpm: 126,
    duration: '5:45',
    type: 'fast',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3'
  },
  {
    id: 'pl-5',
    title: 'Disco Inferno',
    artist: 'The Trammps',
    bpm: 129,
    duration: '3:35',
    type: 'fast',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3'
  },
  {
    id: 'pl-6',
    title: 'Don\'t Leave Me This Way',
    artist: 'Harold Melvin & the Blue Notes',
    bpm: 132,
    duration: '4:12',
    type: 'fast',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3'
  }
];

export const INITIAL_FEEDBACK_ITEMS: FeedbackItem[] = [
  {
    id: 'fb-1',
    studentName: 'Marilyn',
    studentAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=120',
    videoTitle: 'Practicando el Roll cruzado a 115 BPM',
    videoUrl: 'https://images.unsplash.com/photo-1547153760-18fc86324498?auto=format&fit=crop&q=80&w=600',
    description: 'Siento que el brazo izquierdo se me queda un poco descolgado de la música en el roll de vuelta. ¿Alguien tiene algún tip para empujar el codo hacia atrás?',
    date: '2026-07-09',
    completed: true,
    corrections: [
      {
        id: 'cor-1',
        time: '0:14',
        text: 'Marilyn, fíjate cómo dejas caer el codo izquierdo. Intenta mantenerlo paralelo al suelo, imagina que tienes un estante debajo.',
        author: 'Brando Hermoso',
        role: 'instructor'
      },
      {
        id: 'cor-2',
        time: '0:28',
        text: '¡La pose estática aquí es excelente! Muy buena extensión de las líneas.',
        author: 'Brando Hermoso',
        role: 'instructor'
      }
    ]
  },
  {
    id: 'fb-2',
    studentName: 'Pedro',
    studentAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=120',
    videoTitle: 'Primer intento Freestyle - House + Waacking',
    videoUrl: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&q=80&w=600',
    description: 'Tratando de fusionar los pasos rápidos del house con golpes y líneas de waacking. Agradezco correcciones.',
    date: '2026-07-07',
    completed: false,
    corrections: []
  }
];

export const INITIAL_CALENDAR_EVENTS: CalendarEvent[] = [
  {
    id: 'ev-1',
    title: 'Clase de Técnica Base (Nivel 1)',
    date: '2026-07-14', // Tuesday
    time: '19:00',
    duration: '60 min',
    instructor: 'Brando Hermoso',
    description: 'Trabajaremos drills de brazos intensivos para mejorar la rotación del codo y evitar la rigidez en las muñecas.',
    rsvpCount: 14,
    rsvpByMe: true,
    meetUrl: 'https://meet.google.com/hgo-qpzk-byy'
  },
  {
    id: 'ev-2',
    title: 'Live Session: Feedback en Vivo',
    date: '2026-07-16', // Thursday
    time: '20:30',
    duration: '75 min',
    instructor: 'Brando Hermoso',
    description: 'Conéctate y enciende tu cámara. Analizaremos en directo los videos subidos a la sección de Feedback y daremos pautas de corrección personalizadas.',
    rsvpCount: 22,
    rsvpByMe: false,
    meetUrl: 'https://meet.google.com/qny-pwnm-vxf'
  },
  {
    id: 'ev-3',
    title: 'Masterclass: Expresividad de los 70s',
    date: '2026-07-18', // Saturday
    time: '11:00',
    duration: '90 min',
    instructor: 'Brando Hermoso',
    description: 'Clase de carácter escénico, inspirada en las películas dramáticas clásicas y la pasarela de moda. ¡Aprende a contar una historia con tu mirada!',
    rsvpCount: 35,
    rsvpByMe: false,
    meetUrl: 'https://meet.google.com/fjr-yvyj-shk'
  },
  {
    id: 'ev-battle-spain',
    title: '🏆 Waack On Battle Spain 2026 (Madrid, España)',
    date: '2026-07-25',
    time: '16:00',
    duration: 'Todo el día',
    instructor: 'Waack On Academy & Comunidad de Madrid',
    description: 'La batalla nacional de waacking más esperada en España. Categorías: 1vs1 Waacking y 7-to-smoke. Con jurado internacional, ciphers de práctica abierta y DJs de vinilo tocando el mejor funk de los 70.',
    rsvpCount: 112,
    rsvpByMe: false,
    meetUrl: 'https://meet.google.com/spain-waack-2026'
  },
  {
    id: 'ev-battle-colombia',
    title: '🌴 Cali Waack Festival 2026 (Cali, Colombia)',
    date: '2026-08-02',
    time: '14:00',
    duration: '3 días',
    instructor: 'Waack Colombia Alliance',
    description: 'Festival sudamericano integral de Waacking. Incluye talleres intensivos con Brando Hermoso y pioneros globales, batallas oficiales 1vs1, mesas de discusión histórica sobre el nacimiento del estilo y fiestas disco oficiales.',
    rsvpCount: 185,
    rsvpByMe: false,
    meetUrl: 'https://meet.google.com/cali-waack-2026'
  },
  {
    id: 'ev-battle-world',
    title: '⚡ Waacking World Championship 2026 (Seúl, Corea del Sur)',
    date: '2026-08-15',
    time: '10:00',
    duration: 'Todo el día',
    instructor: 'Global Waack Federation',
    description: 'El evento competitivo definitivo del Waacking internacional. Los mejores exponentes calificados de cada país se enfrentarán en una batalla campal ante miles de espectadores y jueces legendarios.',
    rsvpCount: 540,
    rsvpByMe: false,
    meetUrl: 'https://meet.google.com/seoul-waack-2026'
  },
  {
    id: 'ev-battle-online',
    title: '🌐 Summer Disco Clash (Online Virtual Battle)',
    date: '2026-07-29',
    time: '18:00',
    duration: '120 min',
    instructor: 'Brando Hermoso',
    description: 'Batalla interactiva en línea exclusiva para miembros registrados de Waack On Academy a nivel mundial. Sube tu vídeo o baila directo en vivo, y deja que el voto conjunto de la comunidad decida quién pasa de ronda.',
    rsvpCount: 45,
    rsvpByMe: true,
    meetUrl: 'https://meet.google.com/waacking-summer-clash'
  }
];

export const INITIAL_PRACTICE_LOGS: PracticeLog[] = [
  {
    id: 'log-1',
    date: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    minutes: 15,
    activityType: 'drill',
    description: 'Drill de muñecas rápidas a 115 BPM'
  },
  {
    id: 'log-2',
    date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    minutes: 25,
    activityType: 'playlist',
    description: 'Práctica libre de líneas con George McCrae'
  },
  {
    id: 'log-3',
    date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    minutes: 10,
    activityType: 'battle',
    description: 'Duelo rítmico contra Pedro Freestyle'
  },
  {
    id: 'log-4',
    date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    minutes: 35,
    activityType: 'combo',
    description: 'Draft de coreografía y transiciones de brazo'
  },
  {
    id: 'log-5',
    date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    minutes: 20,
    activityType: 'sensorial',
    description: 'Entrenamiento sensorial con El Blind Groove'
  }
];

export const INITIAL_PODCASTS: PodcastShow[] = [
  {
    id: 'pod-brando-1',
    instructorId: 'inst-brando',
    instructorName: 'Brando Hermoso',
    instructorAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=250',
    title: 'Waack & Groove: Historias del Disco 1970s',
    description: 'Un viaje profundo a las raíces del Waacking en Los Ángeles, la era de Soul Train, Garbo, Underground Gay Clubs y la herencia de los pioneros.',
    coverImage: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&q=80&w=800',
    category: 'Historia & Cultura',
    status: 'active',
    createdAt: '2026-07-01',
    episodes: [
      {
        id: 'ep-b1-1',
        podcastId: 'pod-brando-1',
        title: 'Episodio 1: De Los Ángeles al Mundo: El Origen de Garbo & Punking',
        description: 'Exploramos cómo nació la cultura del Punking y Waacking en los clubes nocturnos de Los Ángeles durante la década de 1970. Hablamos de Tyrone Proctor, Viktor Manoel y Andrew Frank.',
        audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
        duration: '38:15',
        artworkUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&q=80&w=600',
        episodeNumber: 1,
        seasonNumber: 1,
        publishDate: '2026-07-10',
        status: 'published',
        playsCount: 245
      },
      {
        id: 'ep-b1-2',
        podcastId: 'pod-brando-1',
        title: 'Episodio 2: La Metodología de la Expresión: Postura y Teatralidad',
        description: 'Análisis minucioso del dramatismo escénico, la influencia del cine clásico de Hollywood y cómo construir una narrativa emotiva durante tus solos de Freestyle.',
        audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
        duration: '42:00',
        artworkUrl: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&q=80&w=600',
        episodeNumber: 2,
        seasonNumber: 1,
        publishDate: '2026-07-18',
        status: 'published',
        playsCount: 189
      },
      {
        id: 'ep-b1-3',
        podcastId: 'pod-brando-1',
        title: 'Episodio 3: La Batalla de la Mente: Freestyle bajo Presión',
        description: 'Estrategias psicológicas para afrontar batallas 1v1, gestionar la ansiedad escénica y mantener la conexión rítmica cuando la música cambia inesperadamente.',
        audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
        duration: '29:40',
        artworkUrl: 'https://images.unsplash.com/photo-1518834107812-67b0b7c58434?auto=format&fit=crop&q=80&w=600',
        episodeNumber: 3,
        seasonNumber: 1,
        publishDate: '2026-07-25',
        status: 'published',
        playsCount: 162
      }
    ]
  },
  {
    id: 'pod-kumari-1',
    instructorId: 'inst-kumari',
    instructorName: 'Kumari "WaackQueen"',
    instructorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
    title: 'WaackTalk: Biomecánica & Aceleración Rítmica',
    description: 'Análisis técnico de prevención de lesiones en hombros, aceleración de rolls a más de 125 BPM y disciplina de entrenamiento somático diario.',
    coverImage: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&q=80&w=800',
    category: 'Biomecánica & Técnica',
    status: 'active',
    createdAt: '2026-07-05',
    episodes: [
      {
        id: 'ep-k1-1',
        podcastId: 'pod-kumari-1',
        title: 'Episodio 1: Codos Aislados sin Tensión en Trapecio',
        description: 'Técnicas ergonómicas para evitar sobrecargar los hombros al ejecutar rolls a altas velocidades. Ejercicios de movilidad para la caja torácica.',
        audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3',
        duration: '25:30',
        artworkUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&q=80&w=600',
        episodeNumber: 1,
        seasonNumber: 1,
        publishDate: '2026-07-12',
        status: 'published',
        playsCount: 210
      },
      {
        id: 'ep-k1-2',
        podcastId: 'pod-kumari-1',
        title: 'Episodio 2: Velocidad Extrema: Contratiempos a 130 BPM',
        description: 'Cómo entrenar la respuesta neuromuscular para marcar acentos en contratiempo sin perder la estética limpia de brazos.',
        audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3',
        duration: '31:10',
        artworkUrl: 'https://images.unsplash.com/photo-1547153760-18fc86324498?auto=format&fit=crop&q=80&w=600',
        episodeNumber: 2,
        seasonNumber: 1,
        publishDate: '2026-07-22',
        status: 'published',
        playsCount: 145
      }
    ]
  }
];

