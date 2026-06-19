import { useEffect, useRef, useState } from 'react';
import { useInView, useMotionValue, useSpring, useTransform } from 'framer-motion';

export function CountUp({ value, duration = 1.4, decimals = 0, className, prefix = '', suffix = '' }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-40px' });
  const motion = useMotionValue(0);
  const spring = useSpring(motion, { duration: duration * 1000, bounce: 0 });
  const display = useTransform(spring, (v) => {
    const n = Number(v);
    const formatted = decimals > 0
      ? n.toFixed(decimals)
      : Math.round(n).toLocaleString('en-IN');
    return `${prefix}${formatted}${suffix}`;
  });
  const [text, setText] = useState(`${prefix}${(0).toFixed(decimals)}${suffix}`);

  useEffect(() => {
    if (inView) motion.set(value);
  }, [inView, value, motion]);

  useEffect(() => {
    return display.on('change', (v) => setText(v));
  }, [display]);

  return <span ref={ref} className={className}>{text}</span>;
}
