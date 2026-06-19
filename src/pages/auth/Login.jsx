import { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import { gsap } from 'gsap';
import {
  Eye, EyeOff, LogIn, User, Lock, ShieldCheck,
  Boxes, Truck, Scissors, Send, Activity, Sparkles, CheckCircle2, AlertCircle,
} from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../app/axios';
import { login } from '../../features/auth/authSlice';
import { Input, FormField } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Logo } from '../../components/brand/Logo';
import { AnimatedBackground } from '../../components/motion/AnimatedBackground';
import { cn } from '../../app/cn';

const heroLines = [
  { text: 'Cotton arrives.', icon: Truck, color: 'text-info' },
  { text: 'Yarn is produced.', icon: Scissors, color: 'text-success' },
  { text: 'Stock is tracked.', icon: Boxes, color: 'text-primary' },
  { text: 'Dispatches ship.', icon: Send, color: 'text-warning' },
  { text: 'Every gram accounted.', icon: Activity, color: 'text-ink' },
];

const features = [
  { icon: ShieldCheck, label: 'Role-based access', desc: 'Five distinct roles, granular permissions' },
  { icon: Boxes, label: 'Live inventory', desc: 'Cotton & yarn stock in real time' },
  { icon: Activity, label: 'Audit trail', desc: 'Every action logged & searchable' },
  { icon: Sparkles, label: 'Modern reports', desc: 'Excel & PDF exports in one click' },
];

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [health, setHealth] = useState({ state: 'checking', detail: '' });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, status, error } = useSelector((s) => s.auth);

  const heroRef = useRef(null);
  const formRef = useRef(null);
  const heroInView = useInView(heroRef, { once: true, margin: '-80px' });

  useEffect(() => {
    if (user) navigate('/', { replace: true });
  }, [user, navigate]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const { data } = await api.get('/health');
        if (!cancelled) setHealth({ state: 'ok', detail: data?.env || 'online' });
      } catch (e) {
        if (!cancelled) {
          const offline = !e.response;
          setHealth({
            state: offline ? 'offline' : 'error',
            detail: offline ? 'backend not reachable' : `HTTP ${e.response?.status}`,
          });
        }
      }
    })();
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    if (!heroInView) return;
    const ctx = gsap.context(() => {
      gsap.from('.hero-line', {
        y: 24,
        opacity: 0,
        stagger: 0.12,
        duration: 0.7,
        ease: 'power3.out',
        delay: 0.2,
      });
      gsap.from('.hero-line .icon-pop', {
        scale: 0.5,
        rotation: -25,
        opacity: 0,
        stagger: 0.12,
        duration: 0.6,
        ease: 'back.out(2)',
        delay: 0.3,
      });
    }, heroRef);
    return () => ctx.revert();
  }, [heroInView]);

  useEffect(() => {
    if (!formRef.current) return;
    const ctx = gsap.context(() => {
      gsap.from('.form-field', {
        y: 18,
        opacity: 0,
        stagger: 0.08,
        duration: 0.5,
        ease: 'power2.out',
        delay: 0.4,
      });
    }, formRef);
    return () => ctx.revert();
  }, []);

  async function onSubmit(e) {
    e.preventDefault();
    const res = await dispatch(login({ username, password }));
    if (login.fulfilled.match(res)) {
      toast.success('Welcome back');
      navigate('/', { replace: true });
    } else {
      toast.error(res.payload || 'Login failed');
    }
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-bg">
      <AnimatedBackground variant="mesh" />

      <div className="relative z-10 grid min-h-screen grid-cols-1 lg:grid-cols-2">
        {/* Hero panel */}
        <div
          ref={heroRef}
          className="relative hidden lg:flex flex-col justify-between p-12 xl:p-16"
        >
          <div className="flex items-center justify-between">
            <Logo size="md" />
            <HealthPill health={health} />
          </div>

          <div className="max-w-xl">
            <motion.span
              className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.05 }}
            >
              <Sparkles size={12} /> PSA Inventory Suite
            </motion.span>
            <motion.h1
              className="mt-5 text-4xl xl:text-5xl font-bold text-ink leading-[1.1] tracking-tight"
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              Run your cotton & yarn
              <span className="block bg-gradient-to-r from-primary to-info bg-clip-text text-transparent">
                operation in one place.
              </span>
            </motion.h1>
            <motion.p
              className="mt-4 text-base text-ink-2 max-w-md"
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.18 }}
            >
              From arrival to dispatch — track every kilogram, every batch, every customer with a system designed for modern manufacturing floors.
            </motion.p>

            <div className="mt-10 space-y-3">
              {heroLines.map((l, i) => (
                <div key={i} className="hero-line flex items-center gap-3 text-lg font-semibold text-ink">
                  <span className={cn('icon-pop inline-flex h-9 w-9 items-center justify-center rounded-xl bg-surface shadow-sm', l.color)}>
                    <l.icon size={18} />
                  </span>
                  {l.text}
                </div>
              ))}
            </div>
          </div>

          <motion.div
            className="grid grid-cols-2 gap-3 max-w-xl"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.9 }}
          >
            {features.map((f, i) => (
              <div key={i} className="rounded-xl border border-border/60 bg-surface/70 backdrop-blur-sm p-3.5">
                <div className="flex items-center gap-2">
                  <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-primary-soft text-primary">
                    <f.icon size={14} />
                  </span>
                  <span className="text-sm font-semibold text-ink">{f.label}</span>
                </div>
                <p className="text-xs text-ink-2 mt-1.5 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Form panel */}
        <div className="flex items-center justify-center p-6 sm:p-10">
          <motion.div
            ref={formRef}
            className="w-full max-w-md"
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="lg:hidden mb-8 flex flex-col items-center text-center">
              <Logo size="lg" />
            </div>

            <div className="rounded-2xl border border-border bg-surface/90 backdrop-blur-md p-7 shadow-card">
              <div className="form-field mb-6">
                <h2 className="text-2xl font-bold text-ink">Sign in</h2>
                <p className="text-sm text-ink-2 mt-1">Use the credentials issued by your administrator.</p>
              </div>

              <form onSubmit={onSubmit} className="space-y-4">
                <div className="form-field">
                  <FormField label="Username" required>
                    <div className="relative">
                      <User size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-3" />
                      <Input
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="admin"
                        autoFocus
                        required
                        className="pl-9"
                      />
                    </div>
                  </FormField>
                </div>

                <div className="form-field">
                  <FormField label="Password" required>
                    <div className="relative">
                      <Lock size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-3" />
                      <Input
                        type={showPw ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="pl-9 pr-10"
                        placeholder="••••••••"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPw((v) => !v)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-3 hover:text-ink transition"
                        aria-label={showPw ? 'Hide password' : 'Show password'}
                      >
                        {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </FormField>
                </div>

                {error && (
                  <motion.p
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-sm text-danger flex items-center gap-1.5"
                  >
                    <AlertCircle size={14} /> {error}
                  </motion.p>
                )}

                <div className="form-field pt-1">
                  <Button type="submit" disabled={status === 'loading'} className="w-full group">
                    <LogIn size={16} />
                    {status === 'loading' ? 'Signing in…' : 'Sign in'}
                  </Button>
                </div>

                <p className="form-field text-center text-xs text-ink-2">
                  Access is by admin-issued credentials only.
                </p>
              </form>
            </div>

            <div className="lg:hidden mt-4 flex justify-center">
              <HealthPill health={health} />
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

function HealthPill({ health }) {
  const map = {
    checking: { icon: Activity, color: 'bg-warning-soft text-warning', text: 'Checking backend…' },
    ok: { icon: CheckCircle2, color: 'bg-success-soft text-success', text: 'Backend online' },
    error: { icon: AlertCircle, color: 'bg-danger-soft text-danger', text: 'Backend error' },
    offline: { icon: AlertCircle, color: 'bg-danger-soft text-danger', text: 'Backend offline' },
  };
  const s = map[health.state] || map.checking;
  return (
    <span className={cn('inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium', s.color)}>
      <s.icon size={12} />
      {s.text}
    </span>
  );
}
