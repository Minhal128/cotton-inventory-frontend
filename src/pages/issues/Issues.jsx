import { useState } from 'react';
import { Plus, Search, Download, FileDown } from 'lucide-react';
import toast from 'react-hot-toast';
import { useSelector } from 'react-redux';
import { useDataTable } from '../../hooks/useDataTable';
import api from '../../app/axios';
import { PageHeader } from '../../components/ui/PageHeader';
import { Card, CardBody } from '../../components/ui/Card';
import { Table, Pagination } from '../../components/ui/Table';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { Input, FormField, Textarea } from '../../components/ui/Input';
import { formatDate, formatNumber, toInputDate } from '../../lib/format';
import { ROLES } from '../../lib/roles';
import { exportCSV, exportPDF } from '../../lib/exporters';

const empty = { batchNumber: '', quantityIssued: '', issueDate: '', productionDepartment: '', remarks: '' };

export default function Issues() {
  const { user } = useSelector((s) => s.auth);
  const t = useDataTable('/issues');
  const [modal, setModal] = useState({ open: false });
  const [form, setForm] = useState({ ...empty, issueDate: toInputDate(new Date()) });

  const canCreate = [ROLES.SUPER_ADMIN, ROLES.COTTON_ISSUE].includes(user?.role);

  async function save() {
    try {
      await api.post('/issues', { ...form, quantityIssued: Number(form.quantityIssued) });
      toast.success('Issued to production');
      setModal({ open: false });
      setForm({ ...empty, issueDate: toInputDate(new Date()) });
      t.refresh();
    } catch (e) { toast.error(e.response?.data?.message || 'Failed'); }
  }

  const columns = [
    { key: 'issueCode', label: 'Code', render: (r) => <span className="font-medium">{r.issueCode}</span> },
    { key: 'batchNumber', label: 'Batch' },
    { key: 'quantityIssued', label: 'Quantity (KG)', render: (r) => formatNumber(r.quantityIssued) },
    { key: 'issueDate', label: 'Issue Date', render: (r) => formatDate(r.issueDate) },
    { key: 'productionDepartment', label: 'Department' },
    { key: 'issuedByName', label: 'Issued By' },
    { key: 'remainingAfterIssue', label: 'Remaining', render: (r) => formatNumber(r.remainingAfterIssue) },
    { key: 'remarks', label: 'Remarks' },
  ];

  const flat = (t.data || []).map((r) => ({
    Code: r.issueCode, Batch: r.batchNumber, Quantity: r.quantityIssued, Date: formatDate(r.issueDate),
    Department: r.productionDepartment, IssuedBy: r.issuedByName, Remaining: r.remainingAfterIssue, Remarks: r.remarks,
  }));

  return (
    <div className="space-y-6">
      <PageHeader
        title="Cotton Issues"
        subtitle="Issue cotton to production departments"
        action={
          <div className="flex items-center gap-2">
            <Button variant="secondary" onClick={() => exportCSV('cotton-issues.csv', flat)}><Download size={16} /> Excel</Button>
            <Button variant="secondary" onClick={() => exportPDF('Cotton Issue Report', columns, t.data)}><FileDown size={16} /> PDF</Button>
            {canCreate && <Button onClick={() => setModal({ open: true })}><Plus size={16} /> New Issue</Button>}
          </div>
        }
      />
      <Card>
        <CardBody className="space-y-3">
          <div className="relative max-w-md">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-3" />
            <Input placeholder="Search…" className="pl-9" value={t.search} onChange={(e) => t.setSearch(e.target.value)} />
          </div>
        </CardBody>
      </Card>
      <Card>
        <CardBody className="p-0">
          <Table columns={columns} data={t.data} loading={t.loading} empty="No issues recorded" />
          <Pagination page={t.page} pages={t.pages} total={t.total} onPageChange={t.setPage} />
        </CardBody>
      </Card>

      <Modal
        open={modal.open}
        onClose={() => setModal({ open: false })}
        title="Issue Cotton"
        footer={<><Button variant="secondary" onClick={() => setModal({ open: false })}>Cancel</Button><Button onClick={save}>Issue</Button></>}
      >
        <div className="space-y-3">
          <FormField label="Batch Number" required><Input value={form.batchNumber} onChange={(e) => setForm({ ...form, batchNumber: e.target.value })} placeholder="e.g. BATCH-001" /></FormField>
          <FormField label="Quantity Issued (KG)" required><Input type="number" min="0" step="0.01" value={form.quantityIssued} onChange={(e) => setForm({ ...form, quantityIssued: e.target.value })} /></FormField>
          <FormField label="Issue Date" required><Input type="date" value={form.issueDate} onChange={(e) => setForm({ ...form, issueDate: e.target.value })} /></FormField>
          <FormField label="Production Department" required><Input value={form.productionDepartment} onChange={(e) => setForm({ ...form, productionDepartment: e.target.value })} /></FormField>
          <FormField label="Remarks"><Textarea rows={2} value={form.remarks} onChange={(e) => setForm({ ...form, remarks: e.target.value })} /></FormField>
        </div>
      </Modal>
    </div>
  );
}