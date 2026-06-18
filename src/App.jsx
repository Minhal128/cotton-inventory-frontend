import { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMe } from './features/auth/authSlice';
import { fetchUnreadCount } from './features/notifications/notificationSlice';
import ProtectedRoute, { AdminOnly } from './routes/ProtectedRoute';
import { ROLES } from './lib/roles';

import AppLayout from './components/layout/AppLayout';
import Login from './pages/auth/Login';
import Dashboard from './pages/dashboard/Dashboard';
import Users from './pages/users/Users';
import Arrivals from './pages/arrivals/Arrivals';
import CottonInventory from './pages/inventory/CottonInventory';
import Issues from './pages/issues/Issues';
import ProductionRequests from './pages/production/ProductionRequests';
import Productions from './pages/production/Productions';
import YarnInventory from './pages/inventory/YarnInventory';
import Dispatches from './pages/dispatches/Dispatches';
import Reports from './pages/reports/Reports';
import AuditLogs from './pages/audit/AuditLogs';
import Notifications from './pages/notifications/Notifications';

export default function App() {
  const dispatch = useDispatch();
  const { user } = useSelector((s) => s.auth);

  useEffect(() => {
    dispatch(fetchMe());
  }, [dispatch]);

  useEffect(() => {
    if (user) {
      dispatch(fetchUnreadCount());
      const id = setInterval(() => dispatch(fetchUnreadCount()), 30000);
      return () => clearInterval(id);
    }
  }, [user, dispatch]);

  return (
    <Routes>
      <Route path="/login" element={user ? <Navigate to="/" replace /> : <Login />} />
      <Route
        element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/" element={<Dashboard />} />
        <Route path="/users" element={<AdminOnly><Users /></AdminOnly>} />
        <Route path="/cotton-arrivals" element={<Arrivals />} />
        <Route path="/cotton-inventory" element={<CottonInventory />} />
        <Route path="/cotton-issues" element={<Issues />} />
        <Route path="/production-requests" element={<ProductionRequests />} />
        <Route path="/productions" element={<Productions />} />
        <Route path="/yarn-inventory" element={<YarnInventory />} />
        <Route path="/dispatches" element={<Dispatches />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/audit" element={<AdminOnly><AuditLogs /></AdminOnly>} />
        <Route path="/notifications" element={<Notifications />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
