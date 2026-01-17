
import React, { useEffect, useRef } from 'react';

const Celebration: React.FC<{ active: boolean }> = ({ active }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!active || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d')!;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let particles: any[] = [];
    const colors = ['#8f5bff', '#FFD700', '#22c55e', '#ef4444', '#3b82f6'];

    class Particle {
      x: number; y: number; color: string; velocity: { x: number; y: number }; alpha: number;
      constructor(x: number, y: number, color: string) {
        this.x = x;
        this.y = y;
        this.color = color;
        this.velocity = {
          x: (Math.random() - 0.5) * 12,
          y: (Math.random() - 0.5) * 12
        };
        this.alpha = 1;
      }
      draw() {
        ctx.save();
        ctx.globalAlpha = this.alpha;
        ctx.beginPath();
        ctx.arc(this.x, this.y, 3, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.restore();
      }
      update() {
        this.velocity.y += 0.1; // gravity
        this.x += this.velocity.x;
        this.y += this.velocity.y;
        this.alpha -= 0.01;
      }
    }

    const createFirework = (x: number, y: number) => {
      const color = colors[Math.floor(Math.random() * colors.length)];
      for (let i = 0; i < 40; i++) {
        particles.push(new Particle(x, y, color));
      }
    };

    let animationFrame: number;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles = particles.filter(p => p.alpha > 0);
      particles.forEach(p => {
        p.update();
        p.draw();
      });
      animationFrame = requestAnimationFrame(animate);
    };

    const interval = setInterval(() => {
      createFirework(Math.random() * canvas.width, Math.random() * canvas.height * 0.5);
    }, 500);

    animate();

    return () => {
      cancelAnimationFrame(animationFrame);
      clearInterval(interval);
    };
  }, [active]);

  if (!active) return null;

  return (
    <canvas 
      ref={canvasRef} 
      className="fixed inset-0 z-[300] pointer-events-none"
      style={{ background: 'transparent' }}
    />
  );
};

export default Celebration;
