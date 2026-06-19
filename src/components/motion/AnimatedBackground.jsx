import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

export function AnimatedBackground({ variant = 'mesh' }) {
  if (variant === 'orbs') return <OrbsBackground />;
  return <MeshBackground />;
}

function MeshBackground() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-[#F7F7F8] via-[#F2EBFF] to-[#E9F8F1] dark:from-[#0F1115] dark:via-[#15101F] dark:to-[#0F1A14]" />
      <motion.div
        className="absolute -top-32 -left-32 h-[420px] w-[420px] rounded-full bg-primary/30 blur-3xl"
        animate={{ x: [0, 60, 0], y: [0, 40, 0] }}
        transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute top-1/3 -right-40 h-[480px] w-[480px] rounded-full bg-info/25 blur-3xl"
        animate={{ x: [0, -50, 0], y: [0, 30, 0] }}
        transition={{ duration: 16, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute -bottom-40 left-1/3 h-[500px] w-[500px] rounded-full bg-success/20 blur-3xl"
        animate={{ x: [0, 40, 0], y: [0, -30, 0] }}
        transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
      />
    </div>
  );
}

function OrbsBackground() {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let raf = 0;
    let t = 0;
    const render = () => {
      t += 0.012;
      const orbs = el.querySelectorAll('[data-orb]');
      orbs.forEach((node, i) => {
        const k = t + i * 1.3;
        node.style.transform = `translate3d(${Math.cos(k) * 30}px, ${Math.sin(k) * 24}px, 0)`;
      });
      raf = requestAnimationFrame(render);
    };
    render();
    return () => cancelAnimationFrame(raf);
  }, []);
  return (
    <div ref={ref} aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-info/10" />
      <div data-orb className="absolute top-10 left-10 h-32 w-32 rounded-full bg-primary/30 blur-2xl" />
      <div data-orb className="absolute top-1/2 left-1/3 h-24 w-24 rounded-full bg-info/30 blur-2xl" />
      <div data-orb className="absolute bottom-20 right-1/4 h-28 w-28 rounded-full bg-success/30 blur-2xl" />
      <div data-orb className="absolute top-1/4 right-10 h-20 w-20 rounded-full bg-warning/30 blur-2xl" />
    </div>
  );
}
