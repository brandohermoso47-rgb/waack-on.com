import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Activity,
  Mic,
  MicOff,
  Play,
  Square,
  Volume2,
  VolumeX,
  Upload,
  BarChart2,
  Disc,
  Radio,
  Sparkles,
  Zap,
  Maximize2,
  Minimize2,
  Sliders,
  Flame,
  Music,
  Info
} from 'lucide-react';

export type AudioSourceType = 'mic' | 'synth' | 'file';
export type VisualizerMode = 'bars' | 'radial' | 'waveform' | 'meter';
export type ColorTheme = 'waack-gold' | 'cyber-neon' | 'fire-ruby' | 'matrix-green';

export interface AudioSpectrumVisualizerProps {
  className?: string;
  autoStartMic?: boolean;
}

export const AudioSpectrumVisualizer: React.FC<AudioSpectrumVisualizerProps> = ({
  className = '',
  autoStartMic = false
}) => {
  // Source & Mode States
  const [sourceType, setSourceType] = useState<AudioSourceType>('mic');
  const [visualMode, setVisualMode] = useState<VisualizerMode>('bars');
  const [colorTheme, setColorTheme] = useState<ColorTheme>('waack-gold');
  const [isLive, setIsLive] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  // Audio Controls
  const [sensitivity, setSensitivity] = useState<number>(1.2); // Gain multiplier
  const [smoothing, setSmoothing] = useState<number>(0.8); // FFT smoothing
  const [bpmTrack, setBpmTrack] = useState<number>(128);
  const [synthPlaying, setSynthPlaying] = useState<boolean>(false);

  // Audio File Track
  const [audioFileName, setAudioFileName] = useState<string | null>(null);

  // Real-time Energy Metrics
  const [bassEnergy, setBassEnergy] = useState<number>(0);
  const [midEnergy, setMidEnergy] = useState<number>(0);
  const [highEnergy, setHighEnergy] = useState<number>(0);
  const [peakDb, setPeakDb] = useState<number>(0);

  // Refs
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const sourceNodeRef = useRef<MediaStreamAudioSourceNode | MediaElementAudioSourceNode | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const audioElementRef = useRef<HTMLAudioElement | null>(null);
  const synthIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const peaksRef = useRef<number[]>(new Array(64).fill(0));

  // Initialize Web Audio Context
  const getAudioContext = useCallback(() => {
    if (!audioCtxRef.current || audioCtxRef.current.state === 'closed') {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      audioCtxRef.current = new AudioCtx();
    }
    if (audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume();
    }
    return audioCtxRef.current;
  }, []);

  // Setup Analyser Node
  const setupAnalyser = useCallback(() => {
    const ctx = getAudioContext();
    if (!analyserRef.current) {
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 256; // 128 frequency bins
      analyser.smoothingTimeConstant = smoothing;
      analyserRef.current = analyser;
    } else {
      analyserRef.current.smoothingTimeConstant = smoothing;
    }
    return analyserRef.current;
  }, [getAudioContext, smoothing]);

  // Update smoothing when changed
  useEffect(() => {
    if (analyserRef.current) {
      analyserRef.current.smoothingTimeConstant = smoothing;
    }
  }, [smoothing]);

  // Stop All Audio Sources
  const stopAudio = useCallback(() => {
    setIsLive(false);
    setSynthPlaying(false);

    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = null;
    }

    if (synthIntervalRef.current) {
      clearInterval(synthIntervalRef.current);
      synthIntervalRef.current = null;
    }

    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach(track => track.stop());
      mediaStreamRef.current = null;
    }

    if (audioElementRef.current) {
      audioElementRef.current.pause();
    }

    if (sourceNodeRef.current) {
      try {
        sourceNodeRef.current.disconnect();
      } catch (e) {
        // ignore disconnect errors
      }
      sourceNodeRef.current = null;
    }

    // Reset energy bars
    setBassEnergy(0);
    setMidEnergy(0);
    setHighEnergy(0);
    setPeakDb(-60);
  }, []);

  // Start Microphone Stream
  const startMic = useCallback(async () => {
    stopAudio();
    try {
      const ctx = getAudioContext();
      const analyser = setupAnalyser();

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: false,
          noiseSuppression: false,
          autoGainControl: false
        }
      });
      mediaStreamRef.current = stream;

      const source = ctx.createMediaStreamSource(stream);
      source.connect(analyser);
      sourceNodeRef.current = source;

      setIsLive(true);
      setSourceType('mic');
    } catch (err) {
      console.error('Microphone access denied or error:', err);
      alert('No se pudo acceder al micrófono. Asegúrate de otorgar permisos en el navegador.');
    }
  }, [getAudioContext, setupAnalyser, stopAudio]);

  // Start Synth Beat Loop (Disco-Funk Beat)
  const startSynthLoop = useCallback(() => {
    stopAudio();
    const ctx = getAudioContext();
    const analyser = setupAnalyser();

    // Synth gain node connected to analyser & destination
    const masterGain = ctx.createGain();
    masterGain.gain.value = 0.5;
    masterGain.connect(analyser);
    analyser.connect(ctx.destination);

    let step = 0;
    const secondsPerBeat = 60 / bpmTrack;

    const playBeatStep = () => {
      const t = ctx.currentTime;
      const barStep = step % 8;

      // Kick (1, 5)
      if (barStep === 0 || barStep === 4) {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(150, t);
        osc.frequency.exponentialRampToValueAtTime(35, t + 0.12);
        gain.gain.setValueAtTime(0.9, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.15);
        osc.connect(gain);
        gain.connect(masterGain);
        osc.start(t);
        osc.stop(t + 0.15);
      }

      // Snare (3, 7)
      if (barStep === 2 || barStep === 6) {
        const bufferSize = ctx.sampleRate * 0.1;
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;

        const noise = ctx.createBufferSource();
        noise.buffer = buffer;
        const filter = ctx.createBiquadFilter();
        filter.type = 'highpass';
        filter.frequency.value = 1000;
        const gain = ctx.createGain();
        gain.gain.setValueAtTime(0.7, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.12);

        noise.connect(filter);
        filter.connect(gain);
        gain.connect(masterGain);
        noise.start(t);
        noise.stop(t + 0.12);
      }

      // Funk Synth Bass Note
      const bassNotes = [110, 110, 146.8, 130.8, 164.8, 146.8, 123.4, 110];
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(bassNotes[barStep], t);
      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(800, t);
      filter.frequency.exponentialRampToValueAtTime(200, t + 0.14);
      gain.gain.setValueAtTime(0.4, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.15);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(masterGain);
      osc.start(t);
      osc.stop(t + 0.15);

      step++;
    };

    playBeatStep();
    synthIntervalRef.current = setInterval(playBeatStep, (secondsPerBeat / 2) * 1000);

    setIsLive(true);
    setSynthPlaying(true);
    setSourceType('synth');
  }, [bpmTrack, getAudioContext, setupAnalyser, stopAudio]);

  // Handle Local File Upload
  const handleFileUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    stopAudio();
    const ctx = getAudioContext();
    const analyser = setupAnalyser();

    const url = URL.createObjectURL(file);
    const audio = new Audio(url);
    audio.loop = true;
    audioElementRef.current = audio;

    const source = ctx.createMediaElementSource(audio);
    source.connect(analyser);
    analyser.connect(ctx.destination);
    sourceNodeRef.current = source;

    audio.play().then(() => {
      setIsLive(true);
      setSourceType('file');
      setAudioFileName(file.name);
    }).catch(err => {
      console.error('Error playing audio file:', err);
    });
  }, [getAudioContext, setupAnalyser, stopAudio]);

  // Color Palette Theme Generator
  const getThemeColors = useCallback(() => {
    switch (colorTheme) {
      case 'cyber-neon':
        return {
          barStart: '#00F0FF',
          barMid: '#7000FF',
          barEnd: '#FF007A',
          bgGlow: 'rgba(0,240,255,0.15)',
          text: '#00F0FF'
        };
      case 'fire-ruby':
        return {
          barStart: '#FF4500',
          barMid: '#9A2B3C',
          barEnd: '#FFD700',
          bgGlow: 'rgba(154,43,60,0.2)',
          text: '#FF4500'
        };
      case 'matrix-green':
        return {
          barStart: '#00FF66',
          barMid: '#009933',
          barEnd: '#CCFF00',
          bgGlow: 'rgba(0,255,102,0.15)',
          text: '#00FF66'
        };
      case 'waack-gold':
      default:
        return {
          barStart: '#9A2B3C',
          barMid: '#E9C349',
          barEnd: '#FFF5C0',
          bgGlow: 'rgba(233,195,73,0.15)',
          text: '#E9C349'
        };
    }
  }, [colorTheme]);

  // Main Canvas Render Loop
  useEffect(() => {
    if (!isLive) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const analyser = analyserRef.current;
    if (!analyser) return;

    const bufferLength = analyser.frequencyBinCount; // 128
    const freqData = new Uint8Array(bufferLength);
    const waveData = new Uint8Array(bufferLength);

    const render = () => {
      analyser.getByteFrequencyData(freqData);
      analyser.getByteTimeDomainData(waveData);

      // Resize canvas crispness
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;
      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
      }

      ctx.clearRect(0, 0, width, height);

      // Background subtle grid
      ctx.strokeStyle = 'rgba(255,255,255,0.03)';
      ctx.lineWidth = 1;
      const gridGap = 20;
      for (let x = 0; x < width; x += gridGap) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += gridGap) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Energy Metrics Calculation
      let bassSum = 0;
      let midSum = 0;
      let highSum = 0;
      let totalSum = 0;

      for (let i = 0; i < bufferLength; i++) {
        const val = freqData[i] * sensitivity;
        totalSum += val;
        if (i < 8) bassSum += val; // Low frequencies (Bass)
        else if (i < 48) midSum += val; // Mids
        else highSum += val; // Highs
      }

      const bassAvg = Math.min(100, Math.round((bassSum / 8 / 255) * 100));
      const midAvg = Math.min(100, Math.round((midSum / 40 / 255) * 100));
      const highAvg = Math.min(100, Math.round((highSum / 80 / 255) * 100));
      const dbVal = Math.max(-60, Math.round(20 * Math.log10((totalSum / bufferLength / 255) || 0.001)));

      setBassEnergy(bassAvg);
      setMidEnergy(midAvg);
      setHighEnergy(highAvg);
      setPeakDb(dbVal);

      const colors = getThemeColors();

      // RENDER MODE 1: FREQUENCY BARS
      if (visualMode === 'bars') {
        const barCount = 48;
        const barWidth = (width / barCount) - 3;
        const gradient = ctx.createLinearGradient(0, height, 0, 0);
        gradient.addColorStop(0, colors.barStart);
        gradient.addColorStop(0.6, colors.barMid);
        gradient.addColorStop(1, colors.barEnd);

        ctx.fillStyle = gradient;

        for (let i = 0; i < barCount; i++) {
          const index = Math.floor(i * (bufferLength / barCount));
          const val = Math.min(height, (freqData[index] / 255) * height * sensitivity);
          const x = i * (barWidth + 3) + 2;
          const y = height - val;

          // Peak holding
          if (val > (peaksRef.current[i] || 0)) {
            peaksRef.current[i] = val;
          } else {
            peaksRef.current[i] = Math.max(0, (peaksRef.current[i] || 0) - 2.5);
          }

          // Bar body
          ctx.beginPath();
          ctx.roundRect(x, y, barWidth, val, [4, 4, 0, 0]);
          ctx.fill();

          // Peak cap line
          const peakY = height - peaksRef.current[i];
          ctx.fillStyle = colors.text;
          ctx.fillRect(x, peakY - 3, barWidth, 2);
          ctx.fillStyle = gradient;
        }
      }

      // RENDER MODE 2: RADIAL SPECTRUM (WAACKING RADAR)
      else if (visualMode === 'radial') {
        const centerX = width / 2;
        const centerY = height / 2;
        const radius = Math.min(width, height) * 0.22;
        const numRays = 64;

        // Inner glowing core
        const coreGradient = ctx.createRadialGradient(centerX, centerY, 5, centerX, centerY, radius);
        coreGradient.addColorStop(0, colors.barMid);
        coreGradient.addColorStop(1, 'transparent');
        ctx.fillStyle = coreGradient;
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius + (bassAvg * 0.3), 0, Math.PI * 2);
        ctx.fill();

        for (let i = 0; i < numRays; i++) {
          const index = Math.floor(i * (bufferLength / numRays));
          const val = (freqData[index] / 255) * (radius * 1.4) * sensitivity;
          const angle = (i / numRays) * Math.PI * 2;

          const x1 = centerX + Math.cos(angle) * radius;
          const y1 = centerY + Math.sin(angle) * radius;
          const x2 = centerX + Math.cos(angle) * (radius + val);
          const y2 = centerY + Math.sin(angle) * (radius + val);

          ctx.strokeStyle = i % 2 === 0 ? colors.barMid : colors.barStart;
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.moveTo(x1, y1);
          ctx.lineTo(x2, y2);
          ctx.stroke();
        }
      }

      // RENDER MODE 3: WAVEFORM OSCILLOSCOPE
      else if (visualMode === 'waveform') {
        ctx.lineWidth = 3;
        ctx.strokeStyle = colors.barMid;
        ctx.shadowColor = colors.text;
        ctx.shadowBlur = 12;

        ctx.beginPath();
        const sliceWidth = width / bufferLength;
        let x = 0;

        for (let i = 0; i < bufferLength; i++) {
          const v = waveData[i] / 128.0; // 0..2
          const y = (v * height) / 2;

          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);

          x += sliceWidth;
        }
        ctx.lineTo(width, height / 2);
        ctx.stroke();
        ctx.shadowBlur = 0;
      }

      // RENDER MODE 4: VU METERS & INTENSITY BARS
      else if (visualMode === 'meter') {
        const meterHeight = 24;
        const padding = 20;

        // Bass Bar
        ctx.fillStyle = '#FF4500';
        ctx.font = '10px monospace';
        ctx.fillText(`GRAVES (BASS / ACENTO PUNCH) - ${bassAvg}%`, padding, 35);
        ctx.fillRect(padding, 42, (width - padding * 2) * (bassAvg / 100), meterHeight);

        // Mid Bar
        ctx.fillStyle = '#E9C349';
        ctx.fillText(`MEDIOS (MIDS / MELODÍA Y VOZ) - ${midAvg}%`, padding, 95);
        ctx.fillRect(padding, 102, (width - padding * 2) * (midAvg / 100), meterHeight);

        // High Bar
        ctx.fillStyle = '#00F0FF';
        ctx.fillText(`AGUDOS (HIGHS / HI-HATS Y BRAZOS) - ${highAvg}%`, padding, 155);
        ctx.fillRect(padding, 162, (width - padding * 2) * (highAvg / 100), meterHeight);
      }

      animFrameRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [isLive, visualMode, sensitivity, getThemeColors]);

  return (
    <div className={`space-y-6 ${className} ${isFullscreen ? 'fixed inset-0 z-[9999] bg-[#0A0A0A] p-6 overflow-y-auto' : ''}`}>
      {/* HEADER: PANEL DEL ESPECTRO RÍTMICO */}
      <div className="bg-[#121212] border border-[#E9C349]/40 rounded-2xl p-6 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-[#262626] pb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[#E9C349]/20 border border-[#E9C349]/50 flex items-center justify-center text-[#E9C349] shrink-0 shadow-lg">
              <Activity className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-display-lg font-bold text-white uppercase tracking-wider">
                  Visualizador de Espectro de Audio en Tiempo Real
                </h2>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#E9C349]/20 text-[#E9C349] border border-[#E9C349]/40">
                  WEB AUDIO API 🎶
                </span>
              </div>
              <p className="text-xs text-[#8A8A8A] font-medium mt-0.5">
                Visualiza la intensidad, graves (punches) y agudos de la música en tiempo real para sincronizar tus giros y poses de Waacking.
              </p>
            </div>
          </div>

          {/* Quick Controls */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              id="fullscreen-spectrum-toggle"
              type="button"
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="px-3 py-1.5 bg-[#0A0A0A] hover:bg-[#1f1f1f] text-[#8A8A8A] hover:text-white border border-[#262626] font-mono text-[11px] font-bold rounded-xl transition-all flex items-center gap-1.5 cursor-pointer"
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              {isFullscreen ? 'Salir' : 'Pantalla Completa'}
            </button>
          </div>
        </div>

        {/* SELECTOR DE FUENTE DE AUDIO */}
        <div className="mt-5 grid grid-cols-1 md:grid-cols-3 gap-3">
          {/* Opción 1: Micrófono del entorno */}
          <button
            id="audio-source-mic-btn"
            type="button"
            onClick={startMic}
            className={`p-4 rounded-xl border text-left transition-all flex items-center justify-between cursor-pointer ${
              sourceType === 'mic' && isLive
                ? 'bg-[#E9C349]/10 border-[#E9C349] text-white shadow-[0_0_20px_rgba(233,195,73,0.2)]'
                : 'bg-[#0A0A0A] border-[#262626] text-[#8A8A8A] hover:border-[#E9C349]/40 hover:text-white'
            }`}
          >
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Mic className={`w-4 h-4 ${sourceType === 'mic' && isLive ? 'text-[#E9C349] animate-pulse' : ''}`} />
                <span className="text-xs font-mono font-bold uppercase">Micrófono en Vivo</span>
              </div>
              <p className="text-[10px] leading-tight opacity-75">
                Captura la música que suena en tus bocinas mientras entrenas en la sala.
              </p>
            </div>
            {sourceType === 'mic' && isLive && (
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
            )}
          </button>

          {/* Opción 2: Generador Groove Synth (Waacking Funk Beat) */}
          <button
            id="audio-source-synth-btn"
            type="button"
            onClick={startSynthLoop}
            className={`p-4 rounded-xl border text-left transition-all flex items-center justify-between cursor-pointer ${
              sourceType === 'synth' && isLive
                ? 'bg-[#9A2B3C]/20 border-[#9A2B3C] text-white shadow-[0_0_20px_rgba(154,43,60,0.3)]'
                : 'bg-[#0A0A0A] border-[#262626] text-[#8A8A8A] hover:border-[#9A2B3C]/40 hover:text-white'
            }`}
          >
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Radio className={`w-4 h-4 ${sourceType === 'synth' && isLive ? 'text-[#E9C349] animate-spin' : ''}`} />
                <span className="text-xs font-mono font-bold uppercase">Beat Sintetizado Funk</span>
              </div>
              <p className="text-[10px] leading-tight opacity-75">
                Pista disco-funk de 128 BPM generada directamente con sintetizador de audio.
              </p>
            </div>
            {sourceType === 'synth' && isLive && (
              <span className="w-2.5 h-2.5 rounded-full bg-[#E9C349] animate-ping" />
            )}
          </button>

          {/* Opción 3: Cargar Archivo MP3 / WAV Local */}
          <label
            htmlFor="audio-file-input"
            className={`p-4 rounded-xl border text-left transition-all flex items-center justify-between cursor-pointer ${
              sourceType === 'file' && isLive
                ? 'bg-sky-500/10 border-sky-400 text-white shadow-[0_0_20px_rgba(56,189,248,0.2)]'
                : 'bg-[#0A0A0A] border-[#262626] text-[#8A8A8A] hover:border-sky-400/40 hover:text-white'
            }`}
          >
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Upload className="w-4 h-4 text-sky-400" />
                <span className="text-xs font-mono font-bold uppercase">
                  {audioFileName ? audioFileName.slice(0, 16) + '...' : 'Cargar Canción Local'}
                </span>
              </div>
              <p className="text-[10px] leading-tight opacity-75">
                Selecciona cualquier archivo MP3 / WAV de tu dispositivo para analizarlo.
              </p>
            </div>
            <input
              id="audio-file-input"
              type="file"
              accept="audio/*"
              onChange={handleFileUpload}
              className="hidden"
            />
          </label>
        </div>

        {/* CONTROLES DE MODO VISUAL & PALETA */}
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-[#262626]">
          {/* Selector de Modo Visual */}
          <div className="flex items-center gap-1.5 bg-[#0A0A0A] p-1 rounded-xl border border-[#262626] text-[11px] font-mono font-bold">
            <span className="px-2 text-[#8A8A8A] text-[9px] uppercase">Modo:</span>
            {[
              { id: 'bars', label: '📊 Barras', icon: BarChart2 },
              { id: 'radial', label: '🌀 Radar Waacking', icon: Disc },
              { id: 'waveform', label: '🌊 Osciloscopio', icon: Activity },
              { id: 'meter', label: '⚡ Medidores VU', icon: Zap }
            ].map(mode => (
              <button
                key={`mode-${mode.id}`}
                id={`visual-mode-${mode.id}`}
                type="button"
                onClick={() => setVisualMode(mode.id as VisualizerMode)}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  visualMode === mode.id
                    ? 'bg-[#E9C349] text-black font-bold shadow-md'
                    : 'text-[#8A8A8A] hover:text-white'
                }`}
              >
                {mode.label}
              </button>
            ))}
          </div>

          {/* Temas de Color */}
          <div className="flex items-center gap-1.5 bg-[#0A0A0A] p-1 rounded-xl border border-[#262626] text-[11px] font-mono">
            <span className="px-2 text-[#8A8A8A] text-[9px] uppercase font-bold">Tema:</span>
            {[
              { id: 'waack-gold', label: '🏆 Oro Disco' },
              { id: 'fire-ruby', label: '🔥 Rubí Fuego' },
              { id: 'cyber-neon', label: '⚡ Neón Ciber' },
              { id: 'matrix-green', label: '🍏 Matrix' }
            ].map(theme => (
              <button
                key={`theme-${theme.id}`}
                id={`color-theme-${theme.id}`}
                type="button"
                onClick={() => setColorTheme(theme.id as ColorTheme)}
                className={`px-2.5 py-1.5 rounded-lg text-[10px] font-bold uppercase transition-all cursor-pointer ${
                  colorTheme === theme.id
                    ? 'bg-[#121212] text-white border border-[#E9C349]'
                    : 'text-[#8A8A8A] hover:text-white'
                }`}
              >
                {theme.label}
              </button>
            ))}
          </div>

          {/* Detener Audio */}
          {isLive && (
            <button
              id="stop-spectrum-audio-btn"
              type="button"
              onClick={stopAudio}
              className="px-4 py-1.5 bg-red-600/20 hover:bg-red-600/40 text-red-300 border border-red-500/40 text-xs font-mono font-bold uppercase rounded-xl transition-all cursor-pointer flex items-center gap-1.5"
            >
              <Square className="w-3.5 h-3.5 fill-current" /> Detener Captura
            </button>
          )}
        </div>
      </div>

      {/* ÁREA PRINCIPAL CANVAS DEL VISUALIZADOR */}
      <div className="bg-[#0A0A0A] border-2 border-[#E9C349]/40 rounded-2xl p-4 shadow-[0_0_40px_rgba(233,195,73,0.1)] relative overflow-hidden space-y-4">
        {/* Canvas Element */}
        <div className="relative h-64 sm:h-80 w-full bg-[#121212] border border-[#262626] rounded-xl overflow-hidden shadow-inner flex items-center justify-center">
          <canvas
            ref={canvasRef}
            className="w-full h-full block"
          />

          {/* Mensaje cuando no está activo */}
          {!isLive && (
            <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center bg-black/70 backdrop-blur-sm space-y-3">
              <div className="w-14 h-14 rounded-2xl bg-[#121212] border border-[#E9C349]/40 flex items-center justify-center text-[#E9C349] animate-bounce">
                <Music className="w-7 h-7" />
              </div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                El Espectro de Audio está en Pausa
              </h3>
              <p className="text-xs text-[#8A8A8A] max-w-sm">
                Activa el <strong>Micrófono en vivo</strong>, reproduce el <strong>Beat Sintetizado</strong> o carga una canción para visualizar las ondas sonoras.
              </p>
              <button
                id="quick-start-mic-btn"
                type="button"
                onClick={startMic}
                className="px-5 py-2.5 bg-[#E9C349] hover:bg-[#d4ae36] text-black font-mono font-bold text-xs uppercase rounded-xl transition-all shadow-lg cursor-pointer flex items-center gap-2 active:scale-95"
              >
                <Mic className="w-4 h-4" /> Activar Micrófono
              </button>
            </div>
          )}
        </div>

        {/* METRICAS DE FRECUENCIA Y SENSIBILIDAD EN TIEMPO REAL */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 bg-[#121212] p-4 rounded-xl border border-[#262626]">
          {/* Graves / Bass Punch */}
          <div className="space-y-1">
            <div className="flex justify-between items-center text-[10px] font-mono font-bold">
              <span className="text-[#8A8A8A] uppercase flex items-center gap-1">
                <Flame className="w-3.5 h-3.5 text-rose-500" /> BASS (Graves/Locks)
              </span>
              <span className="text-rose-400 font-bold">{bassEnergy}%</span>
            </div>
            <div className="w-full bg-[#0A0A0A] h-2 rounded-full overflow-hidden border border-[#262626]">
              <div
                className="h-full bg-gradient-to-r from-rose-700 to-rose-400 transition-all duration-75"
                style={{ width: `${bassEnergy}%` }}
              />
            </div>
          </div>

          {/* Medios / Melody */}
          <div className="space-y-1">
            <div className="flex justify-between items-center text-[10px] font-mono font-bold">
              <span className="text-[#8A8A8A] uppercase flex items-center gap-1">
                <Zap className="w-3.5 h-3.5 text-[#E9C349]" /> MIDS (Medios/Dramatismo)
              </span>
              <span className="text-[#E9C349] font-bold">{midEnergy}%</span>
            </div>
            <div className="w-full bg-[#0A0A0A] h-2 rounded-full overflow-hidden border border-[#262626]">
              <div
                className="h-full bg-gradient-to-r from-amber-600 to-[#E9C349] transition-all duration-75"
                style={{ width: `${midEnergy}%` }}
              />
            </div>
          </div>

          {/* Agudos / Highs */}
          <div className="space-y-1">
            <div className="flex justify-between items-center text-[10px] font-mono font-bold">
              <span className="text-[#8A8A8A] uppercase flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-sky-400" /> HIGHS (Agudos/Brazos)
              </span>
              <span className="text-sky-400 font-bold">{highEnergy}%</span>
            </div>
            <div className="w-full bg-[#0A0A0A] h-2 rounded-full overflow-hidden border border-[#262626]">
              <div
                className="h-full bg-gradient-to-r from-sky-600 to-sky-400 transition-all duration-75"
                style={{ width: `${highEnergy}%` }}
              />
            </div>
          </div>

          {/* Sensibilidad Slider */}
          <div className="space-y-1">
            <div className="flex justify-between items-center text-[10px] font-mono font-bold">
              <span className="text-[#8A8A8A] uppercase flex items-center gap-1">
                <Sliders className="w-3.5 h-3.5 text-white" /> SENSIBILIDAD
              </span>
              <span className="text-white font-bold">{sensitivity.toFixed(1)}x</span>
            </div>
            <input
              id="spectrum-sensitivity-range"
              type="range"
              min="0.5"
              max="3.0"
              step="0.1"
              value={sensitivity}
              onChange={(e) => setSensitivity(parseFloat(e.target.value))}
              className="w-full accent-[#E9C349] h-2 bg-[#0A0A0A] rounded-lg cursor-pointer"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
