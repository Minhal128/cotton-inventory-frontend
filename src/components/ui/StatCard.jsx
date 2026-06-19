import { motion } from 'framer-motion';
import { ArrowDown, ArrowUp } from 'lucide-react';
import { cn } from '../../app/cn';
import { CountUp } from '../motion/CountUp';

const accents = {
  primary: { ring: 'from-primary/20 to-transparent', icon: 'bg-primary-soft text-primary' },
  success: { ring: 'from-success/20 to-transparent', icon: 'bg-success-soft text-success' },
  warning: { ring: 'from-warning/20 to-transparent', icon: 'bg-warning-soft text-warning' },
  danger: { ring: 'from-danger/20 to-transparent', icon: 'bg-danger-soft text-danger' },
  info: { ring: 'from-info/20 to-transparent', icon: 'bg-info-soft text-info' },
};

export function StatCard({ title, value, icon: Icon, trend, accent = 'primary', suffix, decimals = 0, delay = 0 }) {
  const a = accents[accent] || accents.primary;
  const numericValue = typeof value === 'number'
    ? value
    : Number(String(value).replace(/[^0-9.-]/g, '')) || 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 14, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -4, boxShadow: '0 14px 32px -16px rgba(124,77,255,0.22)' }}
      className="relative overflow-hidden rounded-xl border border-border bg-surface shadow-card p-5"
    >
      <div className={cn('pointer-events-none absolute -top-12 -right-12 h-32 w-32 rounded-full bg-gradient-to-br opacity-60 blur-2xl', a.ring)} />
      <div className="relative flex items-start justify-between">
        <div className="min-w-0 flex-1">
          <p className="text-xs font-medium text-ink-2 uppercase tracking-wider">{title}</p>
          <p className="mt-2 text-2xl font-bold text-ink">
            <CountUp value={numericValue} decimals={decimals} suffix={suffix} />
          </p>
          {trend && (
            <p className={cn(
              'text-xs mt-2 inline-flex items-center gap-1 font-medium',
              trend.direction === 'down' ? 'text-danger' : 'text-success'
            )}>
              {trend.direction === 'down' ? <ArrowDown size={12} /> : <ArrowUp size={12} />}
              {trend.label}
            </p>
          )}
        </div>
        {Icon && (
          <motion.div
            whileHover={{ rotate: 8, scale: 1.06 }}
            className={cn('h-11 w-11 rounded-xl flex items-center justify-center shrink-0', a.icon)}
          >
            <Icon size={20} />
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
