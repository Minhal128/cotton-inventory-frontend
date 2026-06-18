import { useState } from 'react';
import { Plus, KeyRound, Power, Trash2, Pencil, Users as UsersIcon } from 'lucide-react';
import toast from 'react-hot-toast';
import { useDataTable } from '../../hooks/useDataTable';
import api from '../../app/axios';
import { PageHeader } from '../../components/ui/PageHeader';
import { Card, CardBody } from '../../components/ui/Card';
import { Table, Pagination } from '../../components/ui/Table';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { Input, Select, FormField } from '../../components/ui/Input';
import { Badge } from '../../components/ui/Badge';
import { ROLES, ROLE_LABELS, ROLE_COLORS } from '../../lib/roles';
import { formatDateTime } from '../../lib/format';

export default function Users() {
  const t = useDataTable('/users');
  const [modal, setModal] = useState({ open: false, user: null });
  const [pwModal, setPwModal] = useState({ open: false, user: null });
  const [form, setForm] = useState({ username: '', password: '', fullName: '', email: '', role: ROLES.COTTON_ARRIVAL });

  function openCreate() {
    setForm({ username: '', password: '', fullName: '', email: '', role: ROLES.COTTON_ARRIVAL });
    setModal({ open: true, user: null });
  }
  function openEdit(u) {
    setForm({ username: u.username, fullName: u.fullName, email: u.email || '', role: u.role, password: '' });
    setModal({ open: true, user: u });
  }

  async function save() {
    try {
      if (modal.user) {
        await api.put(`/users/${modal.user._id}`, { fullName: form.fullName, email: form.email, role: form.role });
        toast.success('User updated');
      } else {
        await api.post('/users', form);
        toast.success('User created');
      }
      setModal({ open: false, user: null });
      t.refresh();
    } catch (e) {
      toast.error(e.response?.data?.message || 'Save failed');
    }
  }

  async function toggleActive(u) {
    try {
      await api.patch(`/users/${u._id}/status`, { isActive: !u.isActive });
      toast.success(u.isActive ? 'Deactivated' : 'Activated');
      t.refresh();
    } catch (e) { toast.error(e.response?.data?.message || 'Failed'); }
  }

  async function remove(u) {
    if (!confirm(`Delete user ${u.username}?`)) return;
    try { await api.delete(`/users/${u._id}`); toast.success('Deleted'); t.refresh(); }
    catch (e) { toast.error(e.response?.data?.message || 'Failed'); }
  }

  async function resetPassword() {
    try {
      await api.post(`/users/${pwModal.user._id}/reset-password`, { newPassword: pwModal.password });
      toast.success('Password reset. User must change on next login.');
      setPwModal({ open: false, user: null });
    } catch (e) { toast.error(e.response?.data?.message || 'Failed'); }
  }

  const columns = [
    { key: 'username', label: 'Username', render: (r) => <span className="font-medium">{r.username}</span> },
    { key: 'fullName', label: 'Full Name' },
    { key: 'email', label: 'Email', render: (r) => r.email || '—' },
    { key: 'role', label: 'Role', render: (r) => <Badge className={ROLE_COLORS[r.role]}>{ROLE_LABELS[r.role]}</Badge> },
    { key: 'isActive', label: 'Status', render: (r) => <Badge variant={r.isActive ? 'success' : 'danger'}>{r.isActive ? 'Active' : 'Inactive'}</Badge> },
    { key: 'lastLoginAt', label: 'Last Login', render: (r) => r.lastLoginAt ? formatDateTime(r.lastLoginAt) : 'Never' },
    {
      key: 'actions', label: '', render: (r) => (
        <div className="flex items-center justify-end gap-1">
          <button onClick={() => openEdit(r)} className="h-8 w-8 rounded-md hover:bg-surface-2 text-ink-2 hover:text-ink flex items-center justify-center"><Pencil size={15} /></button>
          <button onClick={() => setPwModal({ open: true, user: r, password: '' })} className="h-8 w-8 rounded-md hover:bg-surface-2 text-ink-2 hover:text-ink flex items-center justify-center"><KeyRound size={15} /></button>
          <button onClick={() => toggleActive(r)} className="h-8 w-8 rounded-md hover:bg-surface-2 text-ink-2 hover:text-ink flex items-center justify-center"><Power size={15} /></button>
          <button onClick={() => remove(r)} className="h-8 w-8 rounded-md hover:bg-danger-soft text-danger flex items-center justify-center"><Trash2 size={15} /></button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="User Management"
        subtitle="Create, edit and manage system users"
        action={<Button onClick={openCreate}><Plus size={16} /> New User</Button>}
      />
      <Card>
        <CardBody className="p-0">
          <Table columns={columns} data={t.data} loading={t.loading} empty="No users yet" />
          <Pagination page={t.page} pages={t.pages} total={t.total} onPageChange={t.setPage} />
        </CardBody>
      </Card>

      <Modal
        open={modal.open}
        onClose={() => setModal({ open: false, user: null })}
        title={modal.user ? 'Edit User' : 'New User'}
        footer={
          <>
            <Button variant="secondary" onClick={() => setModal({ open: false, user: null })}>Cancel</Button>
            <Button onClick={save}>{modal.user ? 'Update' : 'Create'}</Button>
          </>
        }
      >
        <div className="space-y-3">
          {!modal.user && (
            <FormField label="Username" required>
              <Input value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} />
            </FormField>
          )}
          <FormField label="Full Name" required>
            <Input value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} />
          </FormField>
          <FormField label="Email">
            <Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          </FormField>
          <FormField label="Role" required>
            <Select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
              {Object.values(ROLES).map((r) => <option key={r} value={r}>{ROLE_LABELS[r]}</option>)}
            </Select>
          </FormField>
          {!modal.user && (
            <FormField label="Password" required>
              <Input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="Min 10 chars, upper/lower/digit/special" />
            </FormField>
          )}
        </div>
      </Modal>

      <Modal
        open={pwModal.open}
        onClose={() => setPwModal({ open: false, user: null })}
        title={`Reset Password — ${pwModal.user?.username}`}
        footer={
          <>
            <Button variant="secondary" onClick={() => setPwModal({ open: false, user: null })}>Cancel</Button>
            <Button onClick={resetPassword}>Reset</Button>
          </>
        }
      >
        <FormField label="New Password" required>
          <Input type="password" value={pwModal.password || ''} onChange={(e) => setPwModal({ ...pwModal, password: e.target.value })} placeholder="Min 10 chars, upper/lower/digit/special" />
        </FormField>
      </Modal>
    </div>
  );
}