import { useSelector } from 'react-redux';
import { Bell, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ROLE_LABELS, ROLE_COLORS } from '../../lib/roles';
import { Badge } from '../ui/Badge';

export default function Topbar() {
  const { user } = useSelector((s) => s.auth);
  const { unread } = useSelector((s) => s.notifications);
  const navigate = useNavigate();

  return (
    <header className="h-16 border-b border-border bg-surface px-6 flex items-center justify-between gap-4">
      <div className="relative flex-1 max-w-md">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-3" />
        <input
          placeholder="Search…"
          className="h-10 w-full rounded-lg border border-border bg-bg pl-9 pr-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
        />
      </div>
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate('/notifications')}
          className="relative h-10 w-10 rounded-lg border border-border bg-surface hover:bg-surface-2 flex items-center justify-center text-ink-2"
        >
          <Bell size={18} />
          {unread > 0 && (
            <span className="absolute -top-1 -right-1 h-5 min-w-5 px-1 rounded-full bg-primary text-white text-[10px] flex items-center justify-center">
              {unread}
            </span>
          )}
        </button>
        <div className="flex items-center gap-3 pl-3 border-l border-border">
          <div className="h-9 w-9 rounded-full bg-primary-soft text-primary flex items-center justify-center text-sm font-semibold">
            {user?.fullName?.[0]?.toUpperCase() || 'U'}
          </div>
          <div className="text-right">
            <p className="text-sm font-medium text-ink leading-none">{user?.fullName}</p>
            <p className="mt-1">
              <Badge className={ROLE_COLORS[user?.role]}>{ROLE_LABELS[user?.role]}</Badge>
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}
