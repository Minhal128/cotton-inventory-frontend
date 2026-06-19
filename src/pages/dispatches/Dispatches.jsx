import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Search, Download, FileDown, Send } from 'lucide-react';
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

const empty = {
  customerName: '', customerCompany: '', customerContact: '', customerAddress: '',
  yarnType: '', yarnCount: '', quantityDispatched: '', dispatchDate: '',
  vehicleNumber: '', invoiceNumber: '', remarks: '',
};

export default function Dispatches() {
  const { user } = useSelector((s) => s.auth);
  const t = useDataTable('/dispatches');
  const [modal, setModal] = useState({ open: false });
  const [form, setForm] = useState({ ...empty, dispatchDate: toInputDate(new Date()) });

  const canCreate = [ROLES.SUPER_ADMIN, ROLES.DISPATCH].includes(user?.role);

  async function save() {
    try {
      await api.post('/dispatches', { ...form, quantityDispatched: Number(form.quantityDispatched) });
      toast.success('Dispatch recorded');
      setModal({ open: false });
      setForm({ ...empty, dispatchDate: toInputDate(new Date()) });
      t.refresh();
    } catch (e) { toast.error(e.response?.data?.message || 'Failed'); }
  }

  const columns = [
    { key: 'dispatchCode', label: 'Code', render: (r) => <span className="font-medium">{r.dispatchCode}</span> },
    { key: 'customerCompany', label: 'Company' },
    { key: 'customerName', label: 'Contact' },
    { key: 'yarnType', label: 'Type' },
    { key: 'yarnCount', label: 'Count' },
    { key: 'quantityDispatched', label: 'Qty (KG)', render: (r) => formatNumber(r.quantityDispatched) },
    { key: 'dispatchDate', label: 'Date', render: (r) => formatDate(r.dispatchDate) },
    { key: 'vehicleNumber', label: 'Vehicle' },
    { key: 'invoiceNumber', label: 'Invoice' },
    { key: 'dispatchedByName', label: 'By' },
  ];

  const flat = (t.data || []).map((r) => ({
    Code: r.dispatchCode, Company: r.customerCompany, Contact: r.customerName, Type: r.yarnType,
    Count: r.yarnCount, Quantity: r.quantityDispatched, Date: formatDate(r.dispatchDate),
    Vehicle: r.vehicleNumber, Invoice: r.invoiceNumber, By: r.dispatchedByName,
  }));

  return (
    <div className="space-y-6">
      <PageHeader
        icon={Send}
        title="Customer Dispatches"
        subtitle="Dispatch yarn to customers and track deliveries"
        action={
          <div className="flex items-center gap-2">
            <Button variant="secondary" onClick={() => exportCSV('dispatches.csv', flat)}><Download size={16} /> Excel</Button>
            <Button variant="secondary" onClick={() => exportPDF('Dispatch Report', columns, t.data)}><FileDown size={16} /> PDF</Button>
            {canCreate && <Button onClick={() => setModal({ open: true })}><Plus size={16} /> New Dispatch</Button>}
          </div>
        }
      />
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
        <Card>
          <CardBody>
            <div className="relative max-w-md">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-3" />
              <Input placeholder="Search by code, customer, vehicle…" className="pl-9" value={t.search} onChange={(e) => t.setSearch(e.target.value)} />
            </div>
          </CardBody>
        </Card>
      </motion.div>
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.12 }}>
        <Card>
          <CardBody className="p-0">
            <Table columns={columns} data={t.data} loading={t.loading} empty="No dispatches yet" />
            <Pagination page={t.page} pages={t.pages} total={t.total} onPageChange={t.setPage} />
          </CardBody>
        </Card>
      </motion.div>

      <Modal
        open={modal.open}
        onClose={() => setModal({ open: false })}
        title="New Dispatch"
        size="xl"
        footer={<><Button variant="secondary" onClick={() => setModal({ open: false })}>Cancel</Button><Button onClick={save}>Dispatch</Button></>}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <FormField label="Customer Company" required><Input value={form.customerCompany} onChange={(e) => setForm({ ...form, customerCompany: e.target.value })} /></FormField>
          <FormField label="Customer Name" required><Input value={form.customerName} onChange={(e) => setForm({ ...form, customerName: e.target.value })} /></FormField>
          <FormField label="Customer Contact" required><Input value={form.customerContact} onChange={(e) => setForm({ ...form, customerContact: e.target.value })} /></FormField>
          <FormField label="Customer Address" required className="sm:col-span-2"><Input value={form.customerAddress} onChange={(e) => setForm({ ...form, customerAddress: e.target.value })} /></FormField>
          <FormField label="Yarn Type" required><Input value={form.yarnType} onChange={(e) => setForm({ ...form, yarnType: e.target.value })} /></FormField>
          <FormField label="Yarn Count" required><Input value={form.yarnCount} onChange={(e) => setForm({ ...form, yarnCount: e.target.value })} /></FormField>
          <FormField label="Quantity (KG)" required><Input type="number" min="0" step="0.01" value={form.quantityDispatched} onChange={(e) => setForm({ ...form, quantityDispatched: e.target.value })} /></FormField>
          <FormField label="Dispatch Date" required><Input type="date" value={form.dispatchDate} onChange={(e) => setForm({ ...form, dispatchDate: e.target.value })} /></FormField>
          <FormField label="Vehicle Number" required><Input value={form.vehicleNumber} onChange={(e) => setForm({ ...form, vehicleNumber: e.target.value })} /></FormField>
          <FormField label="Invoice Number" required><Input value={form.invoiceNumber} onChange={(e) => setForm({ ...form, invoiceNumber: e.target.value })} /></FormField>
          <FormField label="Remarks" className="sm:col-span-2"><Textarea rows={2} value={form.remarks} onChange={(e) => setForm({ ...form, remarks: e.target.value })} /></FormField>
        </div>
      </Modal>
    </div>
  );
}
