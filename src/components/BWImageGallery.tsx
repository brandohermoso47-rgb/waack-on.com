import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Camera, Eye, Sparkles, Filter, Download, Check, RefreshCw, ZoomIn, X, Image as ImageIcon, Upload, Plus, Trash2, User as UserIcon } from 'lucide-react';
import Logo from './Logo';
import { User } from '../types';

export interface BWImageItem {
  id: string;
  title: string;
  category: 'emblema' | 'poses' | 'batallas' | 'anatomia' | 'estudio' | 'mis_fotos' | 'eventos' | 'entrenamiento' | 'comunidad';
  url: string;
  caption: string;
  photographer: string;
  bpmStyle?: string;
  isMonochromeNative?: boolean;
  isUserUploaded?: boolean;
}

export const BW_IMAGES_CATALOG: BWImageItem[] = [
  {
    id: 'bw-logo-light',
    title: 'Emblema 3D Waack On - Versión Fondo Blanco',
    category: 'emblema',
    url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=800&sat=-100',
    caption: 'Isotipo escultural 3D "WAACK ON" con silueta de bailarina en acabado dorado metálico sobre tarjeta minimalista blanca.',
    photographer: 'Waack On Brand Lab 2026',
    bpmStyle: 'Branding Oficial',
    isMonochromeNative: true
  },
  {
    id: 'bw-logo-dark',
    title: 'Emblema 3D Waack On - Versión Fondo Negro',
    category: 'emblema',
    url: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&q=80&w=800&sat=-100',
    caption: 'Isotipo escultural 3D "WAACK ON" con contraste extremo sobre fondo mate negro de alta densidad visual.',
    photographer: 'Waack On Brand Lab 2026',
    bpmStyle: 'Branding Oficial',
    isMonochromeNative: true
  },
  {
    id: 'bw-1',
    title: 'Postura de Poses & Bisagras de Muñeca',
    category: 'poses',
    url: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&q=80&w=800&sat=-100',
    caption: 'Fotografía dramática de alto contraste que captura la extensión lineal de brazos y el bloqueo simétrico de codos.',
    photographer: 'Cátedra Fotográfica Waack On',
    bpmStyle: '128 BPM Freestyle',
    isMonochromeNative: true
  },
  {
    id: 'bw-7',
    title: 'Waack On Jam 2026 - Fotograma de Eventos',
    category: 'eventos',
    url: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&q=80&w=800&sat=-100',
    caption: 'Momento cúspide de la gala anual con iluminación direccional y público en penumbra.',
    photographer: 'Waack On Events Team',
    bpmStyle: '128 BPM Main Stage',
    isMonochromeNative: true
  },
  {
    id: 'bw-8',
    title: 'Drills de Velocidad en Sala de Entrenamiento',
    category: 'entrenamiento',
    url: 'https://images.unsplash.com/photo-1524594152303-9fd13543fe6e?auto=format&fit=crop&q=80&w=800&sat=-100',
    caption: 'Fotografía de alta velocidad registrando la simetría muscular en ejercicios continuos.',
    photographer: 'Laboratorio de Somática',
    bpmStyle: '130 BPM Drills',
    isMonochromeNative: true
  },
  {
    id: 'bw-9',
    title: 'Cypher Colectivo & Encuentro de Comunidad',
    category: 'comunidad',
    url: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&q=80&w=800&sat=-100',
    caption: 'Intercambio cultural entre bailarines de distintas cátedras al finalizar la jornada.',
    photographer: 'Comunidad Waack On',
    bpmStyle: 'Cypher Jam',
    isMonochromeNative: true
  },
  {
    id: 'bw-2',
    title: 'Aislamiento de Cuerdas & Rotación Escapular',
    category: 'anatomia',
    url: 'https://images.unsplash.com/photo-1547153760-18fc86324498?auto=format&fit=crop&q=80&w=800&sat=-100',
    caption: 'Detalle anatómico en blanco y negro del plano posterior muscular en plena aceleración de rolls.',
    photographer: 'Estudio Biomecánico Dance',
    bpmStyle: 'Técnica de Brazos',
    isMonochromeNative: true
  },
  {
    id: 'bw-3',
    title: 'Batalla 1v1 - Climax en Acento Rítmico',
    category: 'batallas',
    url: 'https://images.unsplash.com/photo-1518834107812-67b0b7c58434?auto=format&fit=crop&q=80&w=800&sat=-100',
    caption: 'Captura de movimiento a alta velocidad congelando la silueta del bailarín bajo foco cenital en escenario.',
    photographer: 'Waack On Battles 2026',
    bpmStyle: '132 BPM Battle Track',
    isMonochromeNative: true
  },
  {
    id: 'bw-4',
    title: 'Retrato Fotogénico - Expresión y Drama',
    category: 'estudio',
    url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=800&sat=-100',
    caption: 'Luz de estudio en blanco y negro resaltando las miradas, gestos e intención escénica de Waacking.',
    photographer: 'Portrait Sessions B&W',
    bpmStyle: 'Disco Waack Drama',
    isMonochromeNative: true
  },
  {
    id: 'bw-5',
    title: 'Pasarela Disco 70s - Port de Bras',
    category: 'poses',
    url: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&q=80&w=800&sat=-100',
    caption: 'Simetría geométrica y porte de brazos retro evocando la elegancia de los clubes disco de Los Ángeles.',
    photographer: 'Retro Collection',
    bpmStyle: '125 BPM Retro Disco',
    isMonochromeNative: true
  },
  {
    id: 'bw-6',
    title: 'Sombra y Silueta - Giro de Brazos Inverso',
    category: 'anatomia',
    url: 'https://images.unsplash.com/photo-1535525133417-24112ac9cf4a?auto=format&fit=crop&q=80&w=800&sat=-100',
    caption: 'Silueta pura en contraluz mostrando la trayectoria circular de las manos sobre la cabeza.',
    photographer: 'Somatic Lab Photo',
    bpmStyle: 'Fast Overheads',
    isMonochromeNative: true
  }
];

interface BWImageGalleryProps {
  isGrayscaleGlobal?: boolean;
  onToggleGrayscaleGlobal?: () => void;
  currentUser?: User;
}

export default function BWImageGallery({ isGrayscaleGlobal = false, onToggleGrayscaleGlobal, currentUser }: BWImageGalleryProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('todos');
  const [selectedImage, setSelectedImage] = useState<BWImageItem | null>(null);
  const [activeTabLogoMode, setActiveTabLogoMode] = useState<'both' | 'light' | 'dark'>('both');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // User uploaded photos state persisted in localStorage
  const storageKey = currentUser ? `waackon_bw_photos_${currentUser.id}` : 'waackon_bw_photos_guest';
  const [userImages, setUserImages] = useState<BWImageItem[]>(() => {
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return [];
  });

  // Modal upload state
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadTitle, setUploadTitle] = useState('');
  const [uploadCategory, setUploadCategory] = useState<'mis_fotos' | 'poses' | 'batallas' | 'anatomia' | 'estudio' | 'eventos' | 'entrenamiento' | 'comunidad'>('mis_fotos');
  const [uploadCaption, setUploadCaption] = useState('');
  const [uploadBpm, setUploadBpm] = useState('');
  const [uploadImageUrl, setUploadImageUrl] = useState('');
  const [uploadPreview, setUploadPreview] = useState<string | null>(null);

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(userImages));
  }, [userImages, storageKey]);

  const allImages = [...(userImages || []), ...(BW_IMAGES_CATALOG || [])];

  const filteredImages = selectedCategory === 'todos' 
    ? allImages 
    : (allImages || []).filter(img => img && img.category === selectedCategory);

  const handleCopyLink = (item: BWImageItem) => {
    navigator.clipboard.writeText(item.url);
    setCopiedId(item.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setUploadPreview(result);
        setUploadImageUrl(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSavePhoto = (e: React.FormEvent) => {
    e.preventDefault();
    const photoUrl = uploadPreview || uploadImageUrl;
    if (!photoUrl) return;

    const newPhoto: BWImageItem = {
      id: `bw-user-${Date.now()}`,
      title: uploadTitle.trim() || 'Mi Foto Blanco y Negro',
      category: uploadCategory,
      url: photoUrl,
      caption: uploadCaption.trim() || 'Fotografía de práctica guardada en mi expediente de Waacking.',
      photographer: currentUser?.name || 'Pro-Waacker',
      bpmStyle: uploadBpm.trim() || 'Freestyle Waacking',
      isMonochromeNative: true,
      isUserUploaded: true
    };

    setUserImages(prev => [newPhoto, ...prev]);
    setShowUploadModal(false);
    setUploadTitle('');
    setUploadCaption('');
    setUploadBpm('');
    setUploadImageUrl('');
    setUploadPreview(null);
    setSelectedCategory('mis_fotos');
  };

  const handleDeleteUserPhoto = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setUserImages(prev => (prev || []).filter(img => img && img.id !== id));
    if (selectedImage?.id === id) {
      setSelectedImage(null);
    }
  };

  return (
    <div className="bg-[#121212] border border-[#262626] rounded-3xl p-6 md:p-8 space-y-6 shadow-2xl relative overflow-hidden text-white">
      {/* Background Subtle Gradient */}
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-white/5 rounded-full blur-3xl pointer-events-none" />

      {/* Header Section */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-[#262626] pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-3 py-1 bg-white text-black font-mono font-bold text-[10px] rounded-full uppercase tracking-wider flex items-center gap-1.5">
              <Camera className="w-3.5 h-3.5 text-black" /> GALERÍA B&W DEL PERFIL
            </span>
            <span className="text-xs font-mono text-[#8A8A8A]">Expediente Fotográfico</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight flex items-center gap-3">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-100 to-[#E9C349]">
              Galería Fotográfica en Blanco y Negro
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-[#E9C349]/10 border border-[#E9C349]/30 text-[#E9C349] text-[10px] font-mono font-extrabold uppercase tracking-widest hidden sm:inline-block">
              HD Contrast
            </span>
          </h2>
          <p className="text-xs text-[#8A8A8A] max-w-2xl mt-1">
            Sube tus propias fotos de práctica, analiza tus líneas corporales en alto contraste y explora la colección oficial y emblemas 3D de WAACK ON.
          </p>
        </div>

        {/* Header Actions */}
        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <button
            onClick={() => setShowUploadModal(true)}
            className="px-4 py-2.5 bg-[#E9C349] hover:bg-yellow-300 text-black text-xs font-mono font-black rounded-2xl transition-all shadow-xl flex items-center gap-2 cursor-pointer active:scale-95"
          >
            <Upload className="w-4 h-4 stroke-[2.5]" />
            <span>SUBIR FOTO B&W</span>
          </button>

          {onToggleGrayscaleGlobal && (
            <div className="flex items-center gap-3 bg-[#0A0A0A] p-2.5 rounded-2xl border border-[#262626] shrink-0">
              <div className="text-right">
                <span className="text-xs font-bold text-white block">Modo B&W Global</span>
                <span className="text-[10px] font-mono text-[#8A8A8A]">
                  {isGrayscaleGlobal ? 'Activado' : 'Desactivado'}
                </span>
              </div>
              <button
                onClick={onToggleGrayscaleGlobal}
                className={`w-14 h-8 rounded-full transition-all relative p-1 cursor-pointer border ${
                  isGrayscaleGlobal ? 'bg-white border-white' : 'bg-[#262626] border-[#383838]'
                }`}
                aria-label="Alternar modo blanco y negro global"
              >
                <motion.div
                  layout
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  className={`w-6 h-6 rounded-full flex items-center justify-center font-black text-[10px] ${
                    isGrayscaleGlobal ? 'bg-black text-white translate-x-6' : 'bg-white text-black'
                  }`}
                >
                  {isGrayscaleGlobal ? 'BW' : 'CLR'}
                </motion.div>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Official 3D Emblem Logos Banner */}
      <div className="bg-[#0a0a0a] border border-[#262626] rounded-2xl p-5 md:p-6 space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-white" />
            <h3 className="text-sm font-black font-mono text-white uppercase tracking-wider">
              Logotipos & Emblemas 3D Oficiales (Versión Blanco & Negro)
            </h3>
          </div>
          <div className="flex gap-1.5 bg-[#171717] p-1 rounded-xl border border-[#262626]">
            {(['both', 'light', 'dark'] as const).map(mode => (
              <button
                key={mode}
                onClick={() => setActiveTabLogoMode(mode)}
                className={`px-3 py-1 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer capitalize ${
                  activeTabLogoMode === mode 
                    ? 'bg-white text-black shadow' 
                    : 'text-[#8A8A8A] hover:text-white'
                }`}
              >
                {mode === 'both' ? 'Ambos' : mode === 'light' ? 'Fondo Blanco' : 'Fondo Negro'}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {(activeTabLogoMode === 'both' || activeTabLogoMode === 'light') && (
            <div className="bg-white text-black p-6 rounded-3xl border-2 border-neutral-300 shadow-2xl flex flex-col items-center text-center space-y-4 group relative overflow-hidden transition-all hover:scale-[1.01]">
              <span className="absolute top-3 left-3 bg-neutral-900 text-white text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                Light Card Version
              </span>
              <div className="w-44 h-44 my-2">
                <Logo variant="full" mode="bw-light" />
              </div>
              <div>
                <h4 className="font-black text-lg text-neutral-900 tracking-tight">
                  WAACK ON® 3D Emblem (White Canvas)
                </h4>
                <p className="text-xs text-neutral-600 max-w-xs mt-1">
                  Versión escultural clara con relieve metálico dorado, silueta anatómica y fondo blanco pulido.
                </p>
              </div>
            </div>
          )}

          {(activeTabLogoMode === 'both' || activeTabLogoMode === 'dark') && (
            <div className="bg-[#050505] text-white p-6 rounded-3xl border-2 border-neutral-800 shadow-2xl flex flex-col items-center text-center space-y-4 group relative overflow-hidden transition-all hover:scale-[1.01]">
              <span className="absolute top-3 left-3 bg-neutral-800 text-neutral-300 text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider border border-neutral-700">
                Dark Card Version
              </span>
              <div className="w-44 h-44 my-2">
                <Logo variant="full" mode="bw-dark" />
              </div>
              <div>
                <h4 className="font-black text-lg text-white tracking-tight">
                  WAACK ON® 3D Emblem (Dark Canvas)
                </h4>
                <p className="text-xs text-neutral-400 max-w-xs mt-1">
                  Versión escultural sobre fondo mate nocturno para contraste extremo en modo oscuro.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Gallery Container with ID galeria-contenedor for element selector */}
      <div id="galeria-contenedor" className="space-y-6">
        {/* Filter Buttons */}
        <div className="flex items-center gap-2 overflow-x-auto pb-3 scrollbar-none border-b border-[#262626]">
          {[
            { id: 'todos', label: 'Todas', count: allImages.length },
            { id: 'eventos', label: 'Eventos', count: allImages.filter(i => i.category === 'eventos').length },
            { id: 'entrenamiento', label: 'Entrenamiento', count: allImages.filter(i => i.category === 'entrenamiento').length },
            { id: 'comunidad', label: 'Comunidad', count: allImages.filter(i => i.category === 'comunidad').length },
            { id: 'mis_fotos', label: 'Mis Fotos', count: userImages.length },
            { id: 'emblema', label: 'Emblemas 3D', count: allImages.filter(i => i.category === 'emblema').length },
            { id: 'poses', label: 'Poses y Líneas', count: allImages.filter(i => i.category === 'poses').length },
            { id: 'batallas', label: 'Batallas', count: allImages.filter(i => i.category === 'batallas').length },
            { id: 'anatomia', label: 'Anatomía', count: allImages.filter(i => i.category === 'anatomia').length },
            { id: 'estudio', label: 'Retratos', count: allImages.filter(i => i.category === 'estudio').length },
          ].map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all shrink-0 cursor-pointer flex items-center gap-2 border ${
                selectedCategory === cat.id
                  ? 'bg-white text-black border-white shadow-lg scale-105 font-black'
                  : 'bg-[#0A0A0A] text-[#8A8A8A] hover:text-white border-[#262626] hover:border-[#404040]'
              }`}
            >
              <span>{cat.label}</span>
              <span className={`px-2 py-0.5 rounded-full text-[10px] ${
                selectedCategory === cat.id ? 'bg-black text-white font-black' : 'bg-[#1F1F1F] text-[#A0A0A0]'
              }`}>
                {cat.count}
              </span>
            </button>
          ))}
        </div>

      {/* Grid of Black & White Images */}
      {filteredImages.length === 0 ? (
        <div className="bg-[#0A0A0A] border border-dashed border-[#262626] rounded-3xl p-12 text-center space-y-4">
          <Camera className="w-12 h-12 text-[#8A8A8A] mx-auto animate-pulse" />
          <p className="text-sm font-bold text-white uppercase">Aún no has subido fotos a tu galería</p>
          <p className="text-xs text-[#8A8A8A] max-w-md mx-auto">
            Sube tus imágenes de entrenamiento o fotogramas de Waacking para analizarlos en blanco y negro de alto contraste.
          </p>
          <button
            onClick={() => setShowUploadModal(true)}
            className="px-5 py-2.5 bg-[#E9C349] text-black text-xs font-black rounded-xl uppercase shadow-lg hover:bg-yellow-300 transition-all"
          >
            Subir Mi Primera Foto
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {filteredImages.map(item => (
            <div
              key={item.id}
              onClick={() => setSelectedImage(item)}
              className="group bg-[#0A0A0A] border border-[#262626] rounded-2xl overflow-hidden cursor-pointer hover:border-white transition-all duration-300 hover:shadow-[0_0_25px_rgba(255,255,255,0.15)] flex flex-col justify-between relative"
            >
              <div className="relative aspect-square overflow-hidden bg-black">
                <img
                  src={item.url}
                  alt={item.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-115 grayscale contrast-125"
                />
                {/* Smooth Gradient Overlay with Image Title on Hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 p-4 flex flex-col justify-end backdrop-blur-[1px]">
                  <span className="text-[10px] font-mono font-bold text-[#E9C349] uppercase tracking-wider mb-0.5">
                    {item.bpmStyle || item.category}
                  </span>
                  <h3 className="text-xs sm:text-sm font-black text-white leading-tight drop-shadow-lg mb-2">
                    {item.title}
                  </h3>
                  <span className="text-[10px] font-bold text-white flex items-center gap-1.5 bg-white/20 backdrop-blur-md px-2.5 py-1 rounded-lg w-fit border border-white/30 shadow-md">
                    <ZoomIn className="w-3.5 h-3.5 text-white" /> Ampliar Fotograma
                  </span>
                </div>

                {item.isUserUploaded && (
                  <span className="absolute top-2.5 left-2.5 px-2 py-0.5 bg-[#E9C349] text-black text-[9px] font-mono font-black rounded-md shadow-md uppercase">
                    Mi Foto
                  </span>
                )}

                <span className="absolute top-2.5 right-2.5 px-2 py-0.5 bg-black/80 backdrop-blur-md text-white text-[9px] font-mono font-bold rounded-md border border-white/20">
                  B&W HD
                </span>

                {item.isUserUploaded && (
                  <button
                    onClick={(e) => handleDeleteUserPhoto(item.id, e)}
                    className="absolute bottom-2.5 right-2.5 p-1.5 bg-rose-950/80 hover:bg-rose-600 text-rose-200 hover:text-white rounded-lg transition-all z-10 border border-rose-500/30"
                    title="Eliminar foto"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              <div className="p-3.5 space-y-1.5">
                <h4 className="text-xs font-bold text-white line-clamp-1 group-hover:text-white">
                  {item.title}
                </h4>
                <p className="text-[11px] text-[#8A8A8A] line-clamp-2 leading-relaxed">
                  {item.caption}
                </p>
                <div className="pt-2 flex items-center justify-between border-t border-[#1C1C1C] text-[10px] font-mono text-[#666]">
                  <span className="truncate max-w-[120px]">{item.photographer}</span>
                  <span className="text-white font-semibold">B&W 100%</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      </div>

      {/* Modal Upload Photo Form */}
      <AnimatePresence>
        {showUploadModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowUploadModal(false)}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md p-4 flex items-center justify-center cursor-pointer"
          >
            <motion.div
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              onClick={e => e.stopPropagation()}
              className="bg-[#121212] border border-[#333] rounded-3xl max-w-lg w-full p-6 shadow-2xl relative space-y-5 cursor-default text-white max-h-[90vh] overflow-y-auto"
            >
              <div className="flex justify-between items-center border-b border-[#262626] pb-3">
                <div className="flex items-center gap-2">
                  <Camera className="w-5 h-5 text-[#E9C349]" />
                  <h3 className="text-base font-black text-white uppercase tracking-tight">
                    Subir Foto a Mi Galería B&W
                  </h3>
                </div>
                <button
                  onClick={() => setShowUploadModal(false)}
                  className="p-1 text-[#8A8A8A] hover:text-white rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSavePhoto} className="space-y-4">
                {/* Image Upload Input or URL */}
                <div className="space-y-2">
                  <label className="text-xs font-mono font-bold text-[#8A8A8A] uppercase block">
                    Seleccionar Imagen
                  </label>

                  <div className="border-2 border-dashed border-[#333] hover:border-[#E9C349]/50 rounded-2xl p-4 text-center bg-[#0A0A0A] transition-all relative">
                    {uploadPreview ? (
                      <div className="relative group">
                        <img
                          src={uploadPreview}
                          alt="Vista previa B&W"
                          className="max-h-48 mx-auto rounded-xl grayscale contrast-125 border border-white/20 shadow-lg object-contain"
                        />
                        <button
                          type="button"
                          onClick={() => { setUploadPreview(null); setUploadImageUrl(''); }}
                          className="absolute top-2 right-2 p-1.5 bg-black/80 text-white rounded-full hover:bg-rose-600 transition-all"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-3 py-2">
                        <Upload className="w-10 h-10 text-[#E9C349] mx-auto animate-bounce" />
                        <div className="text-xs text-[#8A8A8A]">
                          <span className="text-white font-bold block">Haz clic para buscar un archivo</span>
                          JPG, PNG, WebP
                        </div>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleFileChange}
                          className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                        />
                      </div>
                    )}
                  </div>

                  <div className="text-center text-[10px] text-[#666] font-mono">O pega un enlace web (URL):</div>
                  <input
                    type="url"
                    placeholder="https://ejemplo.com/mi-foto.jpg"
                    value={uploadImageUrl}
                    onChange={(e) => {
                      setUploadImageUrl(e.target.value);
                      if (e.target.value) setUploadPreview(e.target.value);
                    }}
                    className="w-full bg-[#0A0A0A] border border-[#262626] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#E9C349]"
                  />
                </div>

                {/* Title */}
                <div className="space-y-1">
                  <label className="text-xs font-mono font-bold text-[#8A8A8A] uppercase block">
                    Título de la Foto
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ej: Ensayo de Port de Bras & Pose"
                    value={uploadTitle}
                    onChange={(e) => setUploadTitle(e.target.value)}
                    className="w-full bg-[#0A0A0A] border border-[#262626] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#E9C349]"
                  />
                </div>

                {/* Category */}
                <div className="space-y-1">
                  <label className="text-xs font-mono font-bold text-[#8A8A8A] uppercase block">
                    Categoría
                  </label>
                  <select
                    value={uploadCategory}
                    onChange={(e) => setUploadCategory(e.target.value as any)}
                    className="w-full bg-[#0A0A0A] border border-[#262626] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#E9C349]"
                  >
                    <option value="mis_fotos">Mis Fotos de Práctica</option>
                    <option value="eventos">Eventos</option>
                    <option value="entrenamiento">Entrenamiento</option>
                    <option value="comunidad">Comunidad</option>
                    <option value="poses">Poses & Líneas</option>
                    <option value="batallas">Batallas & Escenario</option>
                    <option value="anatomia">Anatomía & Rolls</option>
                    <option value="estudio">Retratos de Estudio</option>
                  </select>
                </div>

                {/* Caption */}
                <div className="space-y-1">
                  <label className="text-xs font-mono font-bold text-[#8A8A8A] uppercase block">
                    Descripción / Nota de Entrenamiento
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Ej: Análisis del ángulo de los brazos en el acento rítmico..."
                    value={uploadCaption}
                    onChange={(e) => setUploadCaption(e.target.value)}
                    className="w-full bg-[#0A0A0A] border border-[#262626] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#E9C349]"
                  />
                </div>

                {/* Style / BPM */}
                <div className="space-y-1">
                  <label className="text-xs font-mono font-bold text-[#8A8A8A] uppercase block">
                    Estilo / Tempo (BPM)
                  </label>
                  <input
                    type="text"
                    placeholder="Ej: 128 BPM Waacking"
                    value={uploadBpm}
                    onChange={(e) => setUploadBpm(e.target.value)}
                    className="w-full bg-[#0A0A0A] border border-[#262626] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#E9C349]"
                  />
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowUploadModal(false)}
                    className="px-4 py-2 bg-[#222] text-xs font-bold rounded-xl text-white hover:bg-[#333]"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={!uploadPreview && !uploadImageUrl}
                    className="px-5 py-2 bg-[#E9C349] text-black text-xs font-black rounded-xl hover:bg-yellow-300 transition-all uppercase disabled:opacity-50"
                  >
                    Guardar Foto en B&W
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal Lightbox Viewer */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedImage(null)}
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md p-4 md:p-8 flex items-center justify-center cursor-pointer"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={e => e.stopPropagation()}
              className="bg-[#121212] border border-[#333] rounded-3xl max-w-3xl w-full overflow-hidden shadow-2xl relative flex flex-col md:flex-row cursor-default"
            >
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-black/70 hover:bg-white hover:text-black text-white flex items-center justify-center transition-all cursor-pointer border border-white/20"
                aria-label="Cerrar vista previa"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Image Preview Container */}
              <div className="w-full md:w-1/2 bg-black flex items-center justify-center p-4 relative min-h-[300px]">
                <img
                  src={selectedImage.url}
                  alt={selectedImage.title}
                  referrerPolicy="no-referrer"
                  className="max-h-[450px] w-auto object-contain rounded-xl grayscale contrast-125 shadow-2xl"
                />
              </div>

              {/* Image Information Side Panel */}
              <div className="w-full md:w-1/2 p-6 flex flex-col justify-between space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 bg-white text-black font-mono font-bold text-[10px] rounded-full uppercase">
                      {selectedImage.category}
                    </span>
                    <span className="text-xs font-mono text-[#8A8A8A]">Fotografía B&W</span>
                  </div>

                  <h3 className="text-xl font-black text-white leading-tight">
                    {selectedImage.title}
                  </h3>

                  <p className="text-xs text-[#A0A0A0] leading-relaxed">
                    {selectedImage.caption}
                  </p>

                  <div className="bg-[#0A0A0A] p-3 rounded-xl border border-[#222] space-y-1 font-mono text-xs">
                    <div className="flex justify-between text-[#8A8A8A]">
                      <span>Crédito / Autor:</span>
                      <span className="text-white font-bold">{selectedImage.photographer}</span>
                    </div>
                    <div className="flex justify-between text-[#8A8A8A]">
                      <span>Formato Visual:</span>
                      <span className="text-white font-bold">Monocromo de Alto Contraste</span>
                    </div>
                    {selectedImage.bpmStyle && (
                      <div className="flex justify-between text-[#8A8A8A]">
                        <span>Estilo / BPM:</span>
                        <span className="text-white font-bold">{selectedImage.bpmStyle}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="pt-3 border-t border-[#222] flex items-center gap-3">
                  <button
                    onClick={() => handleCopyLink(selectedImage)}
                    className="flex-1 px-4 py-2.5 bg-white text-black hover:bg-neutral-200 text-xs font-bold font-mono rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow"
                  >
                    {copiedId === selectedImage.id ? (
                      <>
                        <Check className="w-4 h-4 text-emerald-600" /> ¡Enlace Copiado!
                      </>
                    ) : (
                      <>
                        <ImageIcon className="w-4 h-4" /> Copiar URL Imagen
                      </>
                    )}
                  </button>

                  <a
                    href={selectedImage.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2.5 bg-[#222] hover:bg-[#333] text-white text-xs font-bold font-mono rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer border border-[#444]"
                  >
                    Abrir HD
                  </a>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

