import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { ROLES } from '../lib/roles';

export default function ProtectedRoute({ children, roles }) {
  const { user } = useSelector((s) => s.auth);
  const loc = useLocation();
  if (!user) return <Navigate to="/login" state={{ from: loc }} replace />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/" replace />;
  return children;
}

export function AdminOnly({ children }) {
  return <ProtectedRoute roles={[ROLES.SUPER_ADMIN]}>{children}</ProtectedRoute>;
}