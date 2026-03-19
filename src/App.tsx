import React from 'react';
import { motion } from 'motion/react';
import SnakeGame from './components/SnakeGame';
import MusicPlayer from './components/MusicPlayer';
import { Music, Gamepad2, Zap, LayoutGrid, Terminal, Cpu, Activity } from 'lucide-react';

export default function App() {
  return (
    <div className="min-h-screen bg-black text-cyan selection:bg-magenta selection:text-black font-terminal overflow-hidden relative">
      {/* Scanline Overlay */}
      <div className="scanlines" />
      {/* Static Noise Overlay */}
      <div className="static-noise" />

      {/* Header */}
      <header className="relative z-10 border-b-4 border-magenta bg-black p-4 screen-tear">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="w-14 h-14 bg-magenta flex items-center justify-center shadow-[4px_4px_0px_#00ffff]">
              <Terminal size={32} className="text-black" />
            </div>
            <div>
              <h1 className="text-4xl md:text-6xl font-pixel tracking-tighter text-jarring glitch-text" data-text="NEON_CRASH">
                NEON_CRASH
              </h1>
              <div className="text-xs font-mono text-magenta mt-1 uppercase tracking-[0.3em]">
                SYSTEM_OVERRIDE_V1.0.4
              </div>
            </div>
          </div>
          
          <div className="hidden lg:flex items-center gap-8 text-sm uppercase font-pixel">
            <div className="flex items-center gap-2 text-magenta animate-pulse">
              <Activity size={16} />
              <span>CORE_ACTIVE</span>
            </div>
            <div className="flex items-center gap-2 text-cyan">
              <Cpu size={16} />
              <span>MEM_LOAD: 84%</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 max-w-7xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-12 gap-8 mt-8">
        
        {/* Left Sidebar - System Logs */}
        <div className="lg:col-span-3 space-y-8 order-2 lg:order-1">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            className="border-2 border-cyan p-4 bg-black/80 shadow-[8px_8px_0px_#ff00ff]"
          >
            <h2 className="font-pixel text-xs text-magenta mb-4 border-b border-magenta pb-2 uppercase">System_Logs</h2>
            <div className="space-y-2 text-xs font-mono">
              <p className="text-neon-green">[OK] BOOT_SEQUENCE_COMPLETE</p>
              <p className="text-cyan">[INFO] ARCADE_CORE_INITIALIZED</p>
              <p className="text-magenta">[WARN] GLITCH_LEVEL_CRITICAL</p>
              <p className="text-cyan">[INFO] USER_CONNECTED: {Math.random().toString(36).substring(7).toUpperCase()}</p>
              <p className="text-neon-green">[OK] SNAKE.EXE_READY</p>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="border-2 border-magenta p-4 bg-black/80 shadow-[8px_8px_0px_#00ffff]"
          >
            <h2 className="font-pixel text-xs text-cyan mb-4 border-b border-cyan pb-2 uppercase">Global_Nodes</h2>
            <div className="space-y-4">
              {[
                { node: 'NODE_01', status: 'ONLINE', load: '12%' },
                { node: 'NODE_02', status: 'ONLINE', load: '45%' },
                { node: 'NODE_03', status: 'OFFLINE', load: '0%' },
              ].map((node) => (
                <div key={node.node} className="flex justify-between items-center text-xs">
                  <span className="text-zinc-500">{node.node}</span>
                  <span className={node.status === 'ONLINE' ? 'text-neon-green' : 'text-magenta'}>{node.status}</span>
                  <span className="text-cyan">{node.load}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Center - Snake Terminal */}
        <div className="lg:col-span-6 order-1 lg:order-2">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center border-4 border-cyan p-8 bg-black shadow-[12px_12px_0px_#ff00ff] relative"
          >
            <div className="absolute top-0 left-0 w-full h-1 bg-magenta animate-pulse" />
            <div className="mb-10 text-center">
              <h2 className="text-4xl md:text-6xl font-pixel tracking-tighter mb-4 text-jarring glitch-text" data-text="RUN_SNAKE">
                RUN_SNAKE
              </h2>
              <div className="flex items-center justify-center gap-4 text-xs font-mono text-zinc-500">
                <span>[INPUT: WASD]</span>
                <span className="w-1 h-1 bg-zinc-800 rounded-full" />
                <span>[MODE: UNLIMITED]</span>
              </div>
            </div>
            
            <SnakeGame />
          </motion.div>
        </div>

        {/* Right Sidebar - Audio Terminal */}
        <div className="lg:col-span-3 order-3">
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="border-2 border-cyan p-4 bg-black/80 shadow-[8px_8px_0px_#ff00ff] lg:sticky lg:top-8"
          >
            <div className="flex items-center justify-between mb-6 border-b border-magenta pb-2">
              <h2 className="font-pixel text-xs text-magenta uppercase">Audio_Stream</h2>
              <div className="flex gap-1">
                {[1, 2, 3].map(i => (
                  <div key={i} className="w-1 h-3 bg-cyan animate-bounce" style={{ animationDelay: `${i * 0.1}s` }} />
                ))}
              </div>
            </div>
            
            <MusicPlayer />
          </motion.div>
        </div>

      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t-4 border-magenta bg-black p-6 mt-12">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-mono text-zinc-500 uppercase tracking-widest">
          <p className="glitch-text" data-text="TERMINAL_ID: 0x7F2A9B4C">TERMINAL_ID: 0x7F2A9B4C // CONNECTION: STABLE</p>
          <div className="flex gap-8">
            <a href="#" className="hover:text-magenta transition-colors">[ENCRYPT]</a>
            <a href="#" className="hover:text-cyan transition-colors">[DECRYPT]</a>
            <a href="#" className="hover:text-neon-green transition-colors">[EXIT]</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
