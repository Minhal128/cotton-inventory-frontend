import { useState, useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, Search, LogOut, KeyRound, User as UserIcon, ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../../app/axios';
import { ROLE_LABELS, ROLE_COLORS } from '../../lib/roles';
import { Badge } from '../ui/Badge';
import { cn } from '../../app/cn';
import { Modal } from '../ui/Modal';
import { Input, FormField } from '../ui/Input';
import { Button } from '../ui/Button';
import { logout } from '../../features/auth/authSlice';

export default function Topbar() {
  const { user } = useSelector((s) => s.auth);
  const { unread } = useSelector((s) => s.notifications);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchFocused, setSearchFocused] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [pwOpen, setPwOpen] = useState(false);
  const [pw, setPw] = useState({ oldPassword: '', newPassword: '', confirm: '' });
  const [pwSaving, setPwSaving] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    function onClick(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false);
    }
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  async function handleLogout() {
    await dispatch(logout());
    navigate('/login', { replace: true });
  }

  async function changePassword() {
    if (pw.newPassword !== pw.confirm) return toast.error('Passwords do not match');
    setPwSaving(true);
    try {
      await api.post('/auth/change-password', { oldPassword: pw.oldPassword, newPassword: pw.newPassword });
      toast.success('Password updated. Please sign in again.');
      setPwOpen(false);
      setPw({ oldPassword: '', newPassword: '', confirm: '' });
      await dispatch(logout());
      navigate('/login', { replace: true });
    } catch (e) {
      toast.error(e.response?.data?.message || 'Failed to update password');
    } finally {
      setPwSaving(false);
    }
  }

  return (
    <header className="h-16 border-b border-border bg-surface/80 backdrop-blur-md px-6 flex items-center justify-between gap-4 sticky top-0 z-30">
      <motion.div
        className="relative flex-1 max-w-md"
        animate={{ scale: searchFocused ? 1.01 : 1 }}
        transition={{ type: 'spring', stiffness: 300, damping: 24 }}
      >
        <Search size={16} className={cn(
          'absolute left-3 top-1/2 -translate-y-1/2 transition',
          searchFocused ? 'text-primary' : 'text-ink-3'
        )} />
        <input
          placeholder="Search arrivals, batches, customers…"
          onFocus={() => setSearchFocused(true)}
          onBlur={() => setSearchFocused(false)}
          className={cn(
            'h-10 w-full rounded-lg border bg-bg pl-9 pr-3 text-sm outline-none transition',
            searchFocused
              ? 'border-primary ring-2 ring-primary/20'
              : 'border-border'
          )}
        />
      </motion.div>

      <div className="flex items-center gap-3">
        <motion.button
          onClick={() => navigate('/notifications')}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="relative h-10 w-10 rounded-lg border border-border bg-surface hover:bg-surface-2 flex items-center justify-center text-ink-2 transition"
        >
          <Bell size={18} />
          {unread > 0 && (
            <motion.span
              key={unread}
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="absolute -top-1 -right-1 h-5 min-w-5 px-1 rounded-full bg-gradient-to-br from-primary to-[#5B2EE6] text-white text-[10px] font-semibold flex items-center justify-center shadow-md shadow-primary/30"
            >
              {unread > 99 ? '99+' : unread}
            </motion.span>
          )}
        </motion.button>

        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setMenuOpen((v) => !v)}
            className="flex items-center gap-3 pl-3 pr-2 py-1.5 rounded-lg border-l border-border hover:bg-surface-2 transition"
          >
            <motion.div
              whileHover={{ scale: 1.06 }}
              className="h-9 w-9 rounded-full bg-gradient-to-br from-primary to-[#5B2EE6] text-white flex items-center justify-center text-sm font-semibold shadow-md shadow-primary/20"
            >
              {user?.fullName?.[0]?.toUpperCase() || 'U'}
            </motion.div>
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium text-ink leading-none">{user?.fullName}</p>
              <div className="mt-1.5 flex justify-end">
                <Badge className={ROLE_COLORS[user?.role]}>{ROLE_LABELS[user?.role]}</Badge>
              </div>
            </div>
            <ChevronDown size={14} className={cn('text-ink-2 transition', menuOpen && 'rotate-180')} />
          </button>

          <AnimatePresence>
            {menuOpen && (
              <motion.div
                initial={{ opacity: 0, y: -6, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -6, scale: 0.98 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 mt-2 w-56 rounded-xl border border-border bg-surface shadow-xl p-1.5 z-40"
              >
                <div className="px-3 py-2 sm:hidden">
                  <p className="text-sm font-medium text-ink">{user?.fullName}</p>
                  <div className="mt-1.5"><Badge className={ROLE_COLORS[user?.role]}>{ROLE_LABELS[user?.role]}</Badge></div>
                </div>
                <button
                  onClick={() => { setMenuOpen(false); setPwOpen(true); }}
                  className="w-full flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-ink-2 hover:bg-surface-2 hover:text-ink transition"
                >
                  <KeyRound size={15} /> Change password
                </button>
                <button
                  onClick={() => { setMenuOpen(false); }}
                  className="w-full flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-ink-2 hover:bg-surface-2 hover:text-ink transition"
                >
                  <UserIcon size={15} /> Signed in as <span className="font-medium text-ink ml-auto">{user?.username}</span>
                </button>
                <div className="my-1 border-t border-border" />
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-danger hover:bg-danger-soft transition"
                >
                  <LogOut size={15} /> Logout
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <Modal
        open={pwOpen}
        onClose={() => setPwOpen(false)}
        title="Change password"
        footer={
          <>
            <Button variant="secondary" onClick={() => setPwOpen(false)}>Cancel</Button>
            <Button onClick={changePassword} disabled={pwSaving}>
              {pwSaving ? 'Updating…' : 'Update password'}
            </Button>
          </>
        }
      >
        <div className="space-y-3">
          <FormField label="Current password" required>
            <Input type="password" value={pw.oldPassword} onChange={(e) => setPw({ ...pw, oldPassword: e.target.value })} />
          </FormField>
          <FormField label="New password" required>
            <Input type="password" value={pw.newPassword} onChange={(e) => setPw({ ...pw, newPassword: e.target.value })} placeholder="Min 10 chars, upper/lower/digit/special" />
          </FormField>
          <FormField label="Confirm new password" required>
            <Input type="password" value={pw.confirm} onChange={(e) => setPw({ ...pw, confirm: e.target.value })} />
          </FormField>
        </div>
      </Modal>
    </header>
  );
}
