import { NavLink } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, Package, Truck, Scissors, Send, Users, Boxes,
  Bell, History, FileBarChart2, LogOut, Moon, Sun, Menu, ChevronLeft,
} from 'lucide-react';
import { ROLES } from '../../lib/roles';
import { toggleSidebar, toggleTheme } from '../../features/ui/uiSlice';
import { logout } from '../../features/auth/authSlice';
import { cn } from '../../app/cn';
import { Logo } from '../brand/Logo';

function navItemFor(user) {
  const items = [
    { to: '/', label: 'Dashboard', icon: LayoutDashboard, roles: Object.values(ROLES) },
    { to: '/cotton-arrivals', label: 'Cotton Arrivals', icon: Truck, roles: [ROLES.SUPER_ADMIN, ROLES.COTTON_ARRIVAL, ROLES.COTTON_ISSUE] },
    { to: '/cotton-inventory', label: 'Cotton Inventory', icon: Boxes, roles: [ROLES.SUPER_ADMIN, ROLES.COTTON_ARRIVAL, ROLES.COTTON_ISSUE] },
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
    <motion.aside
      initial={false}
      animate={{ width: sidebarOpen ? 256 : 64 }}
      transition={{ type: 'spring', stiffness: 260, damping: 30 }}
      className="flex flex-col border-r border-border bg-sidebar overflow-hidden shrink-0"
    >
      <div className="h-16 flex items-center justify-between px-3 border-b border-border shrink-0">
        <AnimatePresence mode="wait" initial={false}>
          {sidebarOpen ? (
            <motion.div
              key="logo-full"
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -8 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <Logo size="sm" />
            </motion.div>
          ) : (
            <motion.div
              key="logo-mini"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <Logo size="sm" withText={false} />
            </motion.div>
          )}
        </AnimatePresence>
        <button
          onClick={() => dispatch(toggleSidebar())}
          className="rounded-md p-1.5 text-ink-2 hover:bg-surface-2 hover:text-ink transition shrink-0"
          aria-label="Toggle sidebar"
        >
          {sidebarOpen ? <ChevronLeft size={18} /> : <Menu size={18} />}
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto p-2 space-y-0.5">
        {items.map((it, idx) => (
          <motion.div
            key={it.to}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.25, delay: idx * 0.03 }}
          >
            <NavLink
              to={it.to}
              end={it.to === '/'}
              className={({ isActive }) =>
                cn(
                  'group flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200',
                  isActive
                    ? 'bg-gradient-to-r from-primary-soft to-transparent text-primary shadow-sm'
                    : 'text-ink-2 hover:bg-surface-2 hover:text-ink'
                )
              }
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <motion.span
                      layoutId="sidebar-active"
                      className="absolute left-0 w-1 h-6 bg-primary rounded-r-full"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                  <span className={cn(
                    'inline-flex h-7 w-7 items-center justify-center rounded-md transition',
                    isActive ? 'bg-primary text-white' : 'text-ink-2 group-hover:text-ink'
                  )}>
                    <it.icon size={16} />
                  </span>
                  {sidebarOpen && (
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="truncate"
                    >
                      {it.label}
                    </motion.span>
                  )}
                </>
              )}
            </NavLink>
          </motion.div>
        ))}
      </nav>

      <div className="border-t border-border p-2 space-y-1 shrink-0">
        <button
          onClick={() => dispatch(toggleTheme())}
          className="w-full flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-ink-2 hover:bg-surface-2 hover:text-ink transition"
        >
          <span className="inline-flex h-7 w-7 items-center justify-center rounded-md">
            {darkMode ? <Sun size={16} /> : <Moon size={16} />}
          </span>
          {sidebarOpen && <span>{darkMode ? 'Light mode' : 'Dark mode'}</span>}
        </button>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-danger hover:bg-danger-soft transition"
        >
          <span className="inline-flex h-7 w-7 items-center justify-center rounded-md">
            <LogOut size={16} />
          </span>
          {sidebarOpen && <span>Logout</span>}
        </button>
      </div>
    </motion.aside>
  );
}
