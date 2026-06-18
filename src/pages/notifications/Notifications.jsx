import { useEffect, useState } from 'react';
import { Bell, CheckCheck } from 'lucide-react';
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

  return (
    <div className="space-y-6">
      <PageHeader
        title="Notifications"
        subtitle="System events, alerts and updates"
        action={<Button variant="secondary" onClick={markAll}><CheckCheck size={16} /> Mark all read</Button>}
      />
      <Card>
        <CardBody className="p-0">
          {loading && <div className="p-8 text-center text-ink-2">Loading…</div>}
          {!loading && items.length === 0 && (
            <EmptyState icon={Bell} title="No notifications yet" message="You'll see system events appear here." />
          )}
          {!loading && items.length > 0 && (
            <ul className="divide-y divide-border">
              {items.map((n) => (
                <li key={n._id} className={`px-5 py-4 ${!n.read ? 'bg-primary-soft/30' : ''}`}>
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <Badge variant={severityVariant[n.severity]}>{n.severity}</Badge>
                        <span className="text-sm font-semibold text-ink">{n.title}</span>
                        {!n.read && <span className="h-2 w-2 rounded-full bg-primary" />}
                      </div>
                      <p className="text-sm text-ink-2 mt-1">{n.message}</p>
                    </div>
                    <span className="text-xs text-ink-2 whitespace-nowrap">{formatDateTime(n.createdAt)}</span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </CardBody>
      </Card>
    </div>
  );
}