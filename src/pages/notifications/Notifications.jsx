import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, CheckCheck, Check } from 'lucide-react';
import { useDispatch } from 'react-redux';
import toast from 'react-hot-toast';
import api from '../../app/axios';
import { PageHeader } from '../../components/ui/PageHeader';
import { Card, CardBody } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { EmptyState } from '../../components/ui/EmptyState';
import { formatDateTime } from '../../lib/format';
import { setUnread } from '../../features/notifications/notificationSlice';

const severityVariant = {
  INFO: 'info', SUCCESS: 'success', WARNING: 'warning', DANGER: 'danger',
};

export default function Notifications() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  async function load() {
    setLoading(true);
    try {
      const { data } = await api.get('/notifications');
      setItems(data.items);
    } finally { setLoading(false); }
  }
  useEffect(() => { load(); }, []);

  async function markAll() {
    await api.post('/notifications/mark-all-read');
    toast.success('Marked all as read');
    dispatch(setUnread(0));
    load();
  }

  async function markOne(id) {
    try {
      await api.post('/notifications/mark-read', { ids: [id] });
      dispatch(setUnread(Math.max(0, items.filter((n) => !n.read && n._id !== id).length)));
      setItems((prev) => prev.map((n) => n._id === id ? { ...n, read: true } : n));
    } catch (e) {
      toast.error('Failed to mark read');
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        icon={Bell}
        title="Notifications"
        subtitle="System events, alerts and updates"
        action={
          <Button variant="secondary" onClick={markAll}>
            <CheckCheck size={16} /> Mark all read
          </Button>
        }
      />
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
        <Card>
          <CardBody className="p-0">
            {loading && (
              <div className="p-8 text-center text-ink-2">
                <div className="inline-block h-5 w-5 rounded-full border-2 border-border border-t-primary animate-spin" />
              </div>
            )}
            {!loading && items.length === 0 && (
              <EmptyState icon={Bell} title="No notifications yet" message="You'll see system events appear here." />
            )}
            <AnimatePresence initial={false}>
              {!loading && items.map((n, i) => (
                <motion.div
                  key={n._id}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ delay: Math.min(i * 0.02, 0.3) }}
                  className={`px-5 py-4 border-b border-border last:border-b-0 flex items-start justify-between gap-3 ${!n.read ? 'bg-primary-soft/30' : ''}`}
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge variant={severityVariant[n.severity]}>{n.severity}</Badge>
                      <span className="text-sm font-semibold text-ink">{n.title}</span>
                      {!n.read && <span className="h-2 w-2 rounded-full bg-primary" />}
                    </div>
                    <p className="text-sm text-ink-2 mt-1">{n.message}</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-xs text-ink-2 whitespace-nowrap">{formatDateTime(n.createdAt)}</span>
                    {!n.read && (
                      <button
                        onClick={() => markOne(n._id)}
                        title="Mark as read"
                        className="h-8 w-8 rounded-md hover:bg-surface-2 text-ink-2 hover:text-ink flex items-center justify-center transition"
                      >
                        <Check size={14} />
                      </button>
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </CardBody>
        </Card>
      </motion.div>
    </div>
  );
}
