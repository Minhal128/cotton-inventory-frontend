import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { cn } from '../../app/cn';

const sizes = {
  sm: 'max-w-md',
  md: 'max-w-lg',
  lg: 'max-w-2xl',
  xl: 'max-w-4xl',
};

export function Modal({ open, onClose, title, subtitle, children, footer, size = 'md' }) {
  useEffect(() => {
    if (!open) return;
    const onEsc = (e) => e.key === 'Escape' && onClose?.();
    document.addEventListener('keydown', onEsc);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onEsc);
      document.body.style.overflow = prevOverflow;
    };
  }, [open, onClose]);

  if (typeof document === 'undefined') return null;

  return createPortal(
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[100] flex items-start sm:items-center justify-center overflow-y-auto p-3 sm:p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            style={{ height: '100dvh', width: '100vw' }}
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.97 }}
            transition={{ type: 'spring', stiffness: 320, damping: 28 }}
            className={cn(
              'relative w-full my-auto rounded-2xl bg-surface border border-border shadow-2xl flex flex-col',
              'max-h-[calc(100dvh-2rem)]',
              sizes[size]
            )}
          >
            <div className="relative px-6 py-4 border-b border-border">
              <div className="text-center pr-10">
                <h2 className="text-base font-semibold text-ink">{title}</h2>
                {subtitle && <p className="text-xs text-ink-2 mt-0.5">{subtitle}</p>}
              </div>
              <button
                onClick={onClose}
                aria-label="Close"
                className="absolute right-3 top-1/2 -translate-y-1/2 h-8 w-8 rounded-md text-ink-2 hover:bg-surface-2 hover:text-ink inline-flex items-center justify-center transition"
              >
                <X size={18} />
              </button>
            </div>

            <div className="px-6 py-5 overflow-y-auto flex-1">{children}</div>

            {footer && (
              <div className="px-6 py-4 border-t border-border flex flex-col-reverse sm:flex-row sm:items-center sm:justify-end gap-2 bg-surface-2/40">
                {footer}
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
}
