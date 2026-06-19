import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Check, X, Search, Download, FileDown, ClipboardList } from 'lucide-react';
import toast from 'react-hot-toast';
import { useSelector } from 'react-redux';
import { useDataTable } from '../../hooks/useDataTable';
import api from '../../app/axios';
import { PageHeader } from '../../components/ui/PageHeader';
import { Card, CardBody } from '../../components/ui/Card';
import { Table, Pagination } from '../../components/ui/Table';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { Input, Select, FormField, Textarea } from '../../components/ui/Input';
import { Badge } from '../../components/ui/Badge';
import { formatDate, toInputDate } from '../../lib/format';
import { ROLES } from '../../lib/roles';
import { exportCSV, exportPDF } from '../../lib/exporters';

const statusVariant = {
  PENDING: 'warning', APPROVED: 'info', REJECTED: 'danger', FULFILLED: 'success',
};

const empty = { requestedQuantity: '', requestDate: '', priority: 'MEDIUM', remarks: '' };

export default function ProductionRequests() {
  const { user } = useSelector((s) => s.auth);
  const t = useDataTable('/production-requests');
  const [modal, setModal] = useState({ open: false });
  const [form, setForm] = useState({ ...empty, requestDate: toInputDate(new Date()) });

  const canCreate = [ROLES.SUPER_ADMIN, ROLES.PRODUCTION].includes(user?.role);
  const canApprove = [ROLES.SUPER_ADMIN, ROLES.COTTON_ISSUE].includes(user?.role);

  async function save() {
    try {
      await api.post('/production-requests', { ...form, requestedQuantity: Number(form.requestedQuantity) });
      toast.success('Request submitted');
      setModal({ open: false });
      setForm({ ...empty, requestDate: toInputDate(new Date()) });
      t.refresh();
    } catch (e) { toast.error(e.response?.data?.message || 'Failed'); }
  }

  async function setStatus(id, status) {
    try { await api.patch(`/production-requests/${id}/status`, { status }); toast.success('Updated'); t.refresh(); }
    catch (e) { toast.error(e.response?.data?.message || 'Failed'); }
  }

  const columns = [
    { key: 'requestCode', label: 'Code', render: (r) => <span className="font-medium">{r.requestCode}</span> },
    { key: 'requestedQuantity', label: 'Quantity (KG)' },
    { key: 'requestDate', label: 'Date', render: (r) => formatDate(r.requestDate) },
    { key: 'priority', label: 'Priority', render: (r) => <Badge variant={r.priority === 'HIGH' ? 'danger' : r.priority === 'LOW' ? 'info' : 'warning'}>{r.priority}</Badge> },
    { key: 'status', label: 'Status', render: (r) => <Badge variant={statusVariant[r.status]}>{r.status}</Badge> },
    { key: 'requestedByName', label: 'Requested By' },
    { key: 'remarks', label: 'Remarks' },
    {
      key: 'actions', label: '', render: (r) => (
        canApprove && r.status === 'PENDING' ? (
          <div className="flex items-center justify-end gap-1">
            <button onClick={() => setStatus(r._id, 'APPROVED')} className="h-8 px-3 rounded-md bg-success-soft text-success text-xs font-medium inline-flex items-center gap-1 transition hover:bg-success hover:text-white"><Check size={12} /> Approve</button>
            <button onClick={() => setStatus(r._id, 'REJECTED')} className="h-8 px-3 rounded-md bg-danger-soft text-danger text-xs font-medium inline-flex items-center gap-1 transition hover:bg-danger hover:text-white"><X size={12} /> Reject</button>
          </div>
        ) : <span />
      ),
    },
  ];

  const flat = (t.data || []).map((r) => ({
    Code: r.requestCode, Quantity: r.requestedQuantity, Date: formatDate(r.requestDate),
    Priority: r.priority, Status: r.status, RequestedBy: r.requestedByName, Remarks: r.remarks,
  }));

  return (
    <div className="space-y-6">
      <PageHeader
        icon={ClipboardList}
        title="Production Requests"
        subtitle="Submit and track cotton requests for production"
        action={
          <div className="flex items-center gap-2">
            <Button variant="secondary" onClick={() => exportCSV('production-requests.csv', flat)}><Download size={16} /> Excel</Button>
            <Button variant="secondary" onClick={() => exportPDF('Production Requests Report', columns, t.data)}><FileDown size={16} /> PDF</Button>
            {canCreate && <Button onClick={() => setModal({ open: true })}><Plus size={16} /> New Request</Button>}
          </div>
        }
      />
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
        <Card>
          <CardBody>
            <div className="relative max-w-md">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-3" />
              <Input placeholder="Search by code, status, requester…" className="pl-9" value={t.search} onChange={(e) => t.setSearch(e.target.value)} />
            </div>
          </CardBody>
        </Card>
      </motion.div>
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.12 }}>
        <Card>
          <CardBody className="p-0">
            <Table columns={columns} data={t.data} loading={t.loading} empty="No requests" />
            <Pagination page={t.page} pages={t.pages} total={t.total} onPageChange={t.setPage} />
          </CardBody>
        </Card>
      </motion.div>

      <Modal
        open={modal.open}
        onClose={() => setModal({ open: false })}
        title="New Production Request"
        footer={<><Button variant="secondary" onClick={() => setModal({ open: false })}>Cancel</Button><Button onClick={save}>Submit</Button></>}
      >
        <div className="space-y-3">
          <FormField label="Requested Quantity (KG)" required><Input type="number" min="0" step="0.01" value={form.requestedQuantity} onChange={(e) => setForm({ ...form, requestedQuantity: e.target.value })} /></FormField>
          <FormField label="Request Date" required><Input type="date" value={form.requestDate} onChange={(e) => setForm({ ...form, requestDate: e.target.value })} /></FormField>
          <FormField label="Priority" required>
            <Select value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value })}>
              <option>LOW</option><option>MEDIUM</option><option>HIGH</option>
            </Select>
          </FormField>
          <FormField label="Remarks"><Textarea rows={3} value={form.remarks} onChange={(e) => setForm({ ...form, remarks: e.target.value })} /></FormField>
        </div>
      </Modal>
    </div>
  );
}
