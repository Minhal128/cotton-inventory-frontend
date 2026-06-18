import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, LogIn } from 'lucide-react';
import { login } from '../../features/auth/authSlice';
import { Input, FormField } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import toast from 'react-hot-toast';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, status, error } = useSelector((s) => s.auth);

  useEffect(() => {
    if (user) navigate('/', { replace: true });
  }, [user, navigate]);

  async function onSubmit(e) {
    e.preventDefault();
    const res = await dispatch(login({ username, password }));
    if (login.fulfilled.match(res)) navigate('/', { replace: true });
    else toast.error(res.payload || 'Login failed');
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg p-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex h-12 w-12 rounded-xl bg-primary text-white items-center justify-center text-xl font-bold mb-3">P</div>
          <h1 className="text-2xl font-semibold text-ink">Welcome to PSA</h1>
          <p className="text-sm text-ink-2 mt-1">Cotton & Yarn Inventory Management</p>
        </div>
        <form onSubmit={onSubmit} className="rounded-2xl border border-border bg-surface p-6 shadow-card space-y-4">
          <FormField label="Username" required>
            <Input value={username} onChange={(e) => setUsername(e.target.value)} placeholder="admin" autoFocus required />
          </FormField>
          <FormField label="Password" required>
            <div className="relative">
              <Input type={showPw ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} required className="pr-10" />
              <button type="button" onClick={() => setShowPw((v) => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-3">
                {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </FormField>
          {error && <p className="text-sm text-danger">{error}</p>}
          <Button type="submit" disabled={status === 'loading'} className="w-full">
            <LogIn size={16} /> {status === 'loading' ? 'Signing in…' : 'Sign in'}
          </Button>
          <p className="text-center text-xs text-ink-2">Access is by admin-issued credentials only.</p>
        </form>
      </div>
    </div>
  );
}
