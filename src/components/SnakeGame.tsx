import React, { useEffect, useRef, useState, useCallback } from 'react';
import { motion } from 'motion/react';
import { Play, RotateCcw, Pause } from 'lucide-react';

const GRID_SIZE = 20;
const CANVAS_SIZE = 400;
const INITIAL_SNAKE = [
  { x: 10, y: 10 },
  { x: 10, y: 11 },
  { x: 10, y: 12 },
];
const INITIAL_DIRECTION = { x: 0, y: -1 };

export default function SnakeGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [snake, setSnake] = useState(INITIAL_SNAKE);
  const [food, setFood] = useState({ x: 5, y: 5 });
  const [direction, setDirection] = useState(INITIAL_DIRECTION);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(true);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);

  const generateFood = useCallback(() => {
    const newFood = {
      x: Math.floor(Math.random() * (CANVAS_SIZE / GRID_SIZE)),
      y: Math.floor(Math.random() * (CANVAS_SIZE / GRID_SIZE)),
    };
    setFood(newFood);
  }, []);

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    setIsGameOver(false);
    setIsPaused(false);
    setScore(0);
    generateFood();
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp':
          if (direction.y === 0) setDirection({ x: 0, y: -1 });
          break;
        case 'ArrowDown':
          if (direction.y === 0) setDirection({ x: 0, y: 1 });
          break;
        case 'ArrowLeft':
          if (direction.x === 0) setDirection({ x: -1, y: 0 });
          break;
        case 'ArrowRight':
          if (direction.x === 0) setDirection({ x: 1, y: 0 });
          break;
        case ' ':
          setIsPaused((prev) => !prev);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [direction]);

  useEffect(() => {
    if (isPaused || isGameOver) return;

    const moveSnake = () => {
      const newHead = {
        x: snake[0].x + direction.x,
        y: snake[0].y + direction.y,
      };

      // Wall collision
      if (
        newHead.x < 0 ||
        newHead.x >= CANVAS_SIZE / GRID_SIZE ||
        newHead.y < 0 ||
        newHead.y >= CANVAS_SIZE / GRID_SIZE
      ) {
        setIsGameOver(true);
        return;
      }

      // Self collision
      if (snake.some((segment) => segment.x === newHead.x && segment.y === newHead.y)) {
        setIsGameOver(true);
        return;
      }

      const newSnake = [newHead, ...snake];

      // Food collision
      if (newHead.x === food.x && newHead.y === food.y) {
        setScore((prev) => prev + 10);
        generateFood();
      } else {
        newSnake.pop();
      }

      setSnake(newSnake);
    };

    const gameLoop = setInterval(moveSnake, 100);
    return () => clearInterval(gameLoop);
  }, [snake, direction, food, isPaused, isGameOver, generateFood]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

    // Draw grid lines (subtle)
    ctx.strokeStyle = '#111';
    ctx.lineWidth = 1;
    for (let i = 0; i <= CANVAS_SIZE; i += GRID_SIZE) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i, CANVAS_SIZE);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, i);
      ctx.lineTo(CANVAS_SIZE, i);
      ctx.stroke();
    }

    // Draw food - Cyan
    ctx.fillStyle = '#00ffff';
    ctx.shadowBlur = 20;
    ctx.shadowColor = '#00ffff';
    ctx.fillRect(food.x * GRID_SIZE, food.y * GRID_SIZE, GRID_SIZE, GRID_SIZE);

    // Draw snake - Magenta
    ctx.shadowBlur = 15;
    ctx.shadowColor = '#ff00ff';
    snake.forEach((segment, index) => {
      ctx.fillStyle = index === 0 ? '#ff00ff' : '#aa00aa';
      ctx.fillRect(segment.x * GRID_SIZE, segment.y * GRID_SIZE, GRID_SIZE, GRID_SIZE);
      
      // Add a small glitch effect to the snake head occasionally
      if (index === 0 && Math.random() > 0.95) {
        ctx.fillStyle = '#00ffff';
        ctx.fillRect(segment.x * GRID_SIZE - 2, segment.y * GRID_SIZE, 4, GRID_SIZE);
      }
    });

    // Reset shadow for other drawings
    ctx.shadowBlur = 0;
  }, [snake, food]);

  useEffect(() => {
    if (score > highScore) {
      setHighScore(score);
    }
  }, [score, highScore]);

  return (
    <div className="flex flex-col items-center gap-10 font-terminal">
      <div className="flex justify-between w-full max-w-[400px] uppercase">
        <div className="flex flex-col gap-2">
          <span className="text-zinc-600 text-xs">DATA_SCORE</span>
          <span className="text-magenta text-4xl font-pixel glitch-text" data-text={score}>{score}</span>
        </div>
        <div className="flex flex-col gap-2 items-end">
          <span className="text-zinc-600 text-xs">PEAK_RECORD</span>
          <span className="text-cyan text-4xl font-pixel">{highScore}</span>
        </div>
      </div>

      <div className="relative group border-4 border-magenta shadow-[0_0_30px_rgba(255,0,255,0.2)]">
        <canvas
          ref={canvasRef}
          width={CANVAS_SIZE}
          height={CANVAS_SIZE}
          className="bg-black cursor-none"
        />
        
        {(isPaused || isGameOver) && (
          <div className="absolute inset-0 bg-black/95 flex flex-col items-center justify-center p-8 border-2 border-cyan animate-pulse">
            {isGameOver ? (
              <motion.div 
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-center space-y-6"
              >
                <h2 className="text-5xl font-pixel text-magenta glitch-text" data-text="CRITICAL_FAILURE">CRITICAL_FAILURE</h2>
                <div className="text-sm text-zinc-400 space-y-2 font-mono">
                  <p className="text-cyan">ERROR_CODE: 0xDEADBEEF</p>
                  <p>SEGMENT_OVERLAP_DETECTED</p>
                  <p className="text-magenta">FINAL_DATA_YIELD: {score}</p>
                </div>
                <button
                  onClick={resetGame}
                  className="w-full py-4 bg-magenta text-black font-pixel text-xs hover:bg-cyan transition-colors shadow-[4px_4px_0px_#00ffff] active:translate-x-1 active:translate-y-1 active:shadow-none"
                >
                  REBOOT_CORE
                </button>
              </motion.div>
            ) : (
              <motion.div 
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-center space-y-8"
              >
                <h2 className="text-5xl font-pixel text-cyan glitch-text" data-text="HALT_EXECUTION">HALT_EXECUTION</h2>
                <button
                  onClick={() => setIsPaused(false)}
                  className="w-full py-4 bg-cyan text-black font-pixel text-xs hover:bg-magenta transition-colors shadow-[4px_4px_0px_#ff00ff] active:translate-x-1 active:translate-y-1 active:shadow-none"
                >
                  RESUME_PROCESS
                </button>
              </motion.div>
            )}
          </div>
        )}
      </div>

      <div className="flex gap-8 text-xs text-zinc-500 uppercase">
        <div className="flex items-center gap-2">
          <span className="text-magenta">[WASD]</span>
          <span>NAV_CONTROL</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-cyan">[SPACE]</span>
          <span>HALT_SIGNAL</span>
        </div>
      </div>
    </div>
  );
}
