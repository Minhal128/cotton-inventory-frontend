import { motion } from 'framer-motion';

const sizes = {
  sm: { box: 'h-8 w-8', mark: 20, text: 'text-base' },
  md: { box: 'h-10 w-10', mark: 24, text: 'text-lg' },
  lg: { box: 'h-14 w-14', mark: 32, text: 'text-2xl' },
  xl: { box: 'h-20 w-20', mark: 48, text: 'text-3xl' },
};

export function Logo({ size = 'md', withText = true, animated = false, className = '' }) {
  const s = sizes[size] || sizes.md;
  const Mark = (
    <svg
      width={s.mark}
      height={s.mark}
      viewBox="0 0 64 64"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={`lg-grad-${size}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#A78BFA" />
          <stop offset="100%" stopColor="#5B2EE6" />
        </linearGradient>
        <linearGradient id={`lg-leaf-${size}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#86EFAC" />
          <stop offset="100%" stopColor="#22C55E" />
        </linearGradient>
      </defs>
      <g transform="translate(32,30)">
        <circle cx="-7" cy="-2" r="6.5" fill="#FFFFFF" opacity="0.96" />
        <circle cx="7" cy="-2" r="6.5" fill="#FFFFFF" opacity="0.96" />
        <circle cx="0" cy="-8.5" r="6.5" fill="#FFFFFF" opacity="0.96" />
        <circle cx="0" cy="3" r="6.5" fill="#FFFFFF" opacity="0.96" />
        <circle cx="0" cy="-2" r="2.5" fill={`url(#lg-grad-${size})`} />
      </g>
      <path d="M13 44 Q22 40 26 48 Q19 50 13 44 Z" fill={`url(#lg-leaf-${size})`} />
      <path d="M51 44 Q42 40 38 48 Q45 50 51 44 Z" fill={`url(#lg-leaf-${size})`} />
      <rect x="31" y="44" width="2" height="10" rx="1" fill="#22C55E" />
    </svg>
  );

  const Box = animated ? (
    <motion.div
      className={`${s.box} rounded-2xl bg-gradient-to-br from-primary to-[#5B2EE6] flex items-center justify-center shadow-lg shadow-primary/20`}
      initial={{ rotate: -8, scale: 0.8, opacity: 0 }}
      animate={{ rotate: 0, scale: 1, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 220, damping: 18 }}
      whileHover={{ rotate: 6, scale: 1.04 }}
    >
      {Mark}
    </motion.div>
  ) : (
    <div className={`${s.box} rounded-2xl bg-gradient-to-br from-primary to-[#5B2EE6] flex items-center justify-center shadow-lg shadow-primary/20`}>
      {Mark}
    </div>
  );

  if (!withText) return <div className={className}>{Box}</div>;

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      {Box}
      <div className="flex flex-col leading-none">
        <span className={`${s.text} font-bold text-ink tracking-tight`}>PSA</span>
        <span className="text-[10px] uppercase tracking-[0.18em] text-ink-2 mt-0.5">
          Inventory Suite
        </span>
      </div>
    </div>
  );
}

export default Logo;
