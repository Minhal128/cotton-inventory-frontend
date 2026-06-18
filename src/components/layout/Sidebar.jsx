import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  LayoutDashboard, Package, Truck, Scissors, Send, Users, Boxes,
  Bell, History, FileBarChart2, LogOut, Moon, Sun, Menu, ChevronLeft,
} from 'lucide-react';
import { ROLES } from '../../lib/roles';
import { useDispatch } from 'react-redux';
import { toggleSidebar, toggleTheme } from '../../features/ui/uiSlice';
import { logout } from '../../features/auth/authSlice';
import { useNavigate } from 'react-router-dom';
import { cn } from '../../app/cn';

function hasRole(user, ...roles) {
  return user && roles.includes(user.role);
}

function navItemFor(user) {
  const items = [
    { to: '/', label: 'Dashboard', icon: LayoutDashboard, roles: Object.values(ROLES) },
    { to: '/cotton-arrivals', label: 'Cotton Arrivals', icon: Truck, roles: [ROLES.SUPER_ADMIN, ROLES.COTTON_ARRIVAL, ROLES.COTTON_ISSUE] },
    { to: '/cotton-inventory', label: 'Cotton Inventory', icon: Boxes, roles: [ROLES.SUPER_ADMIN, ROLES.COTTON_ARRIVAL, ROLES.COTTON_ISSUE] },
    { to: '/cotton-issues', label: 'Cotton Issues', icon: Package, roles: [ROLES.SUPER_ADMIN, ROLES.COTTON_ISSUE, ROLES.PRODUCTION] },
    { to: '/production-requests', label: 'Production Requests', icon: Scissors, roles: [ROLES.SUPER_ADMIN, ROLES.PRODUCTION, ROLES.COTTON_ISSUE] },
    { to: '/productions', label: 'Productions', icon: Scissors, roles: [ROLES.SUPER_ADMIN, ROLES.PRODUCTION, ROLES.DISPATCH] },
    { to: '/yarn-inventory', label: 'Yarn Inventory', icon: Boxes, roles: [ROLES.SUPER_ADMIN, ROLES.PRODUCTION, ROLES.DISPATCH] },
    { to: '/dispatches', label: 'Dispatches', icon: Send, roles: [ROLES.SUPER_ADMIN, ROLES.DISPATCH] },
    { to: '/users', label: 'User Management', icon: Users, roles: [ROLES.SUPER_ADMIN] },
    { to: '/audit', label: 'Audit Logs', icon: History, roles: [ROLES.SUPER_ADMIN] },
    { to: '/reports', label: 'Reports', icon: FileBarChart2, roles: Object.values(ROLES) },
    { to: '/notifications', label: 'Notifications', icon: Bell, roles: Object.values(ROLES) },
  ];
  return items.filter((i) => i.roles.includes(user?.role));
}

export default function Sidebar() {
  const { user } = useSelector((s) => s.auth);
  const { sidebarOpen, darkMode } = useSelector((s) => s.ui);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const items = navItemFor(user);

  async function handleLogout() {
    await dispatch(logout());
    navigate('/login', { replace: true });
  }

  return (
    <aside
      className={cn(
        'flex flex-col border-r border-border bg-sidebar transition-all duration-200',
        sidebarOpen ? 'w-64' : 'w-16'
      )}
    >
      <div className="h-16 flex items-center justify-between px-4 border-b border-border">
        {sidebarOpen && (
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center text-white font-bold">P</div>
            <div>
              <p className="text-sm font-semibold text-ink leading-none">PSA</p>
              <p className="text-[10px] text-ink-2 mt-0.5">Inventory Suite</p>
            </div>
          </div>
        )}
        <button onClick={() => dispatch(toggleSidebar())} className="rounded-md p-1.5 text-ink-2 hover:bg-surface-2">
          {sidebarOpen ? <ChevronLeft size={18} /> : <Menu size={18} />}
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto p-2 space-y-0.5">
        {items.map((it) => (
          <NavLink
            key={it.to}
            to={it.to}
            end={it.to === '/'}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition',
                isActive ? 'bg-primary-soft text-primary' : 'text-ink-2 hover:bg-surface-2 hover:text-ink'
              )
            }
          >
            <it.icon size={18} className="shrink-0" />
            {sidebarOpen && <span className="truncate">{it.label}</span>}
          </NavLink>
        ))}
      </nav>

      <div className="border-t border-border p-2 space-y-1">
        <button
          onClick={() => dispatch(toggleTheme())}
          className="w-full flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-ink-2 hover:bg-surface-2 hover:text-ink"
        >
          {darkMode ? <Sun size={18} /> : <Moon size={18} />}
          {sidebarOpen && <span>{darkMode ? 'Light mode' : 'Dark mode'}</span>}
        </button>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-danger hover:bg-danger-soft"
        >
          <LogOut size={18} />
          {sidebarOpen && <span>Logout</span>}
        </button>
      </div>
    </aside>
  );
}