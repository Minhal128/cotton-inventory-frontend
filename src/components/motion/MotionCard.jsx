import { motion } from 'framer-motion';
import { cn } from '../../app/cn';

export function MotionCard({ children, className, hoverable = true, delay = 0, ...props }) {
  return (
    <motion.div
      className={cn('rounded-xl border border-border bg-surface shadow-card', className)}
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1], delay }}
      whileHover={hoverable ? { y: -3, boxShadow: '0 12px 32px -12px rgba(124,77,255,0.18)' } : undefined}
      {...props}
    >
      {children}
    </motion.div>
  );
}

export function MotionButton({ children, className, ...props }) {
  return (
    <motion.button
      className={className}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: 'spring', stiffness: 400, damping: 22 }}
      {...props}
    >
      {children}
    </motion.button>
  );
}
