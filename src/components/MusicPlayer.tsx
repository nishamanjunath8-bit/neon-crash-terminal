import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, Music2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Track } from '../types';

const DUMMY_TRACKS: Track[] = [
  {
    id: '1',
    title: 'SYNTH_PULSE_01',
    artist: 'NEON_WAVE',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    cover: 'https://picsum.photos/seed/cyberpunk/400/400',
  },
  {
    id: '2',
    title: 'GLITCH_HORIZON',
    artist: 'DIGITAL_GHOST',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    cover: 'https://picsum.photos/seed/synth/400/400',
  },
  {
    id: '3',
    title: 'RETRO_GRID_X',
    artist: '8-BIT_HERO',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
    cover: 'https://picsum.photos/seed/retro/400/400',
  },
];

export default function MusicPlayer() {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);

  const currentTrack = DUMMY_TRACKS[currentTrackIndex];

  const togglePlay = () => {
    if (isPlaying) {
      audioRef.current?.pause();
    } else {
      audioRef.current?.play();
    }
    setIsPlaying(!isPlaying);
  };

  const nextTrack = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % DUMMY_TRACKS.length);
    setIsPlaying(true);
  };

  const prevTrack = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + DUMMY_TRACKS.length) % DUMMY_TRACKS.length);
    setIsPlaying(true);
  };

  useEffect(() => {
    if (isPlaying) {
      audioRef.current?.play();
    }
  }, [currentTrackIndex]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateProgress = () => {
      const current = audio.currentTime;
      const duration = audio.duration;
      if (duration) {
        setProgress((current / duration) * 100);
      }
    };

    audio.addEventListener('timeupdate', updateProgress);
    audio.addEventListener('ended', nextTrack);
    return () => {
      audio.removeEventListener('timeupdate', updateProgress);
      audio.removeEventListener('ended', nextTrack);
    };
  }, []);

  return (
    <div className="w-full flex flex-col gap-8 font-terminal">
      <audio ref={audioRef} src={currentTrack.url} />
      
      <div className="relative aspect-square bg-black border-2 border-cyan overflow-hidden group">
        <AnimatePresence mode="wait">
          <motion.img
            key={currentTrack.id}
            initial={{ opacity: 0, filter: 'blur(20px) brightness(2)' }}
            animate={{ opacity: 1, filter: 'blur(0px) brightness(1)' }}
            exit={{ opacity: 0, filter: 'blur(20px) brightness(2)' }}
            src={currentTrack.cover}
            alt={currentTrack.title}
            className="w-full h-full object-cover opacity-50 grayscale"
            referrerPolicy="no-referrer"
          />
        </AnimatePresence>
        
        <div className="absolute inset-0 flex items-center justify-center">
          <Music2 size={80} className={`text-magenta transition-all duration-500 ${isPlaying ? 'scale-125 blur-sm animate-pulse' : 'opacity-20'}`} />
        </div>

        {/* Animated bars */}
        <div className="absolute bottom-0 left-0 right-0 h-24 flex items-end justify-between px-4 pb-4 gap-1">
          {[...Array(12)].map((_, i) => (
            <motion.div
              key={i}
              animate={isPlaying ? {
                height: [20, Math.random() * 60 + 20, 20],
              } : { height: 10 }}
              transition={{
                duration: 0.5,
                repeat: Infinity,
                delay: i * 0.05,
              }}
              className="w-full bg-cyan shadow-[0_0_10px_#00ffff]"
            />
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <div className="space-y-1">
          <h3 className="text-xl font-pixel text-magenta glitch-text truncate" data-text={currentTrack.title}>
            {currentTrack.title}
          </h3>
          <p className="text-cyan text-sm opacity-70">{currentTrack.artist}</p>
        </div>

        <div className="space-y-2">
          <div className="h-1 w-full bg-zinc-900 relative overflow-hidden">
            <motion.div
              className="absolute top-0 left-0 h-full bg-jarring"
              animate={{ width: `${progress}%` }}
              transition={{ type: 'spring', bounce: 0, duration: 0.2 }}
            />
          </div>
          <div className="flex justify-between text-[10px] text-zinc-500">
            <span>{Math.floor((audioRef.current?.currentTime || 0) / 60)}:{String(Math.floor((audioRef.current?.currentTime || 0) % 60)).padStart(2, '0')}</span>
            <span>{Math.floor((audioRef.current?.duration || 0) / 60)}:{String(Math.floor((audioRef.current?.duration || 0) % 60)).padStart(2, '0')}</span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <button onClick={prevTrack} className="text-zinc-500 hover:text-cyan transition-colors">
            <SkipBack size={24} />
          </button>
          
          <button 
            onClick={togglePlay}
            className="w-16 h-16 flex items-center justify-center bg-magenta text-black shadow-[4px_4px_0px_#00ffff] active:translate-x-1 active:translate-y-1 active:shadow-none transition-all"
          >
            {isPlaying ? <Pause size={32} fill="currentColor" /> : <Play size={32} fill="currentColor" className="ml-1" />}
          </button>

          <button onClick={nextTrack} className="text-zinc-500 hover:text-cyan transition-colors">
            <SkipForward size={24} />
          </button>
        </div>
      </div>

      <div className="border-t border-zinc-800 pt-6 space-y-3">
        <span className="text-[10px] text-zinc-600 uppercase">QUEUE_BUFFER</span>
        {DUMMY_TRACKS.map((track, index) => (
          <button
            key={track.id}
            onClick={() => {
              setCurrentTrackIndex(index);
              setIsPlaying(true);
            }}
            className={`w-full flex items-center gap-3 p-2 transition-colors text-left ${
              currentTrackIndex === index ? 'bg-magenta text-black' : 'hover:bg-zinc-900 text-zinc-400'
            }`}
          >
            <span className="font-mono text-xs w-4">{String(index + 1).padStart(2, '0')}</span>
            <div className="flex-1 overflow-hidden">
              <p className="text-sm font-medium truncate">{track.title}</p>
              <p className="text-[10px] opacity-60 truncate">{track.artist}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
