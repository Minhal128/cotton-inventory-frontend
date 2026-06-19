import { motion } from 'framer-motion';

export function PageHeader({ title, subtitle, action, icon: Icon }) {
  return (
    <motion.div
      className="flex items-center justify-between mb-6 gap-4"
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="flex items-center gap-3 min-w-0">
        {Icon && (
          <motion.div
            initial={{ scale: 0.7, rotate: -10, opacity: 0 }}
            animate={{ scale: 1, rotate: 0, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 220, damping: 18, delay: 0.05 }}
            className="h-11 w-11 rounded-xl bg-gradient-to-br from-primary-soft to-info-soft text-primary flex items-center justify-center shrink-0"
          >
            <Icon size={20} />
          </motion.div>
        )}
        <div className="min-w-0">
          <h1 className="text-2xl font-bold text-ink tracking-tight truncate">{title}</h1>
          {subtitle && <p className="text-sm text-ink-2 mt-0.5">{subtitle}</p>}
        </div>
      </div>
      {action && <motion.div initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15 }}>{action}</motion.div>}
    </motion.div>
  );
}
