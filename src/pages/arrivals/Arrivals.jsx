import { useState } from 'react';
import { Plus, Pencil, Trash2, Search, Download, FileDown } from 'lucide-react';
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
import { ROLES } from '../../lib/roles';
import { formatDate, formatNumber, formatCurrency, toInputDate } from '../../lib/format';
import { exportCSV, exportPDF } from '../../lib/exporters';

const empty = {
  batchNumber: '', supplierName: '', vehicleNumber: '', arrivalDate: '',
  cottonType: '', grade: '', weightKg: '', moisturePercentage: '',
  ratePerKg: '', warehouseLocation: '', notes: '',
};

export default function Arrivals() {
  const { user } = useSelector((s) => s.auth);
  const t = useDataTable('/arrivals');
  const [modal, setModal] = useState({ open: false, item: null });
  const [form, setForm] = useState(empty);

  const canCreate = [ROLES.SUPER_ADMIN, ROLES.COTTON_ARRIVAL].includes(user?.role);
  const canEdit = canCreate;
  const canDelete = canCreate;

  function openCreate() { setForm({ ...empty, arrivalDate: toInputDate(new Date()) }); setModal({ open: true, item: null }); }
  function openEdit(it) {
    setForm({
      ...it,
      arrivalDate: toInputDate(it.arrivalDate),
      weightKg: it.weightKg, moisturePercentage: it.moisturePercentage, ratePerKg: it.ratePerKg,
    });
    setModal({ open: true, item: it });
  }

  async function save() {
    try {
      const payload = { ...form, weightKg: Number(form.weightKg), moisturePercentage: Number(form.moisturePercentage), ratePerKg: Number(form.ratePerKg) };
      if (modal.item) { await api.put(`/arrivals/${modal.item._id}`, payload); toast.success('Updated'); }
      else { await api.post('/arrivals', payload); toast.success('Arrival recorded'); }
      setModal({ open: false, item: null }); t.refresh();
    } catch (e) { toast.error(e.response?.data?.message || 'Save failed'); }
  }

  async function remove(it) {
    if (!confirm(`Delete arrival ${it.arrivalCode}?`)) return;
    try { await api.delete(`/arrivals/${it._id}`); toast.success('Deleted'); t.refresh(); }
    catch (e) { toast.error(e.response?.data?.message || 'Failed'); }
  }

  const columns = [
    { key: 'arrivalCode', label: 'Code', render: (r) => <span className="font-medium">{r.arrivalCode}</span> },
    { key: 'batchNumber', label: 'Batch' },
    { key: 'supplierName', label: 'Supplier' },
    { key: 'vehicleNumber', label: 'Vehicle' },
    { key: 'arrivalDate', label: 'Date', render: (r) => formatDate(r.arrivalDate) },
    { key: 'cottonType', label: 'Type' },
    { key: 'grade', label: 'Grade' },
    { key: 'weightKg', label: 'Weight (KG)', render: (r) => formatNumber(r.weightKg) },
    { key: 'moisturePercentage', label: 'Moisture', render: (r) => `${formatNumber(r.moisturePercentage)}%` },
    { key: 'ratePerKg', label: 'Rate/KG', render: (r) => formatCurrency(r.ratePerKg) },
    { key: 'totalValue', label: 'Value', render: (r) => formatCurrency(r.totalValue) },
    { key: 'warehouseLocation', label: 'Warehouse' },
    {
      key: 'actions', label: '', render: (r) => (
        <div className="flex items-center justify-end gap-1">
          {canEdit && <button onClick={() => openEdit(r)} className="h-8 w-8 rounded-md hover:bg-surface-2 text-ink-2 hover:text-ink flex items-center justify-center"><Pencil size={15} /></button>}
          {canDelete && <button onClick={() => remove(r)} className="h-8 w-8 rounded-md hover:bg-danger-soft text-danger flex items-center justify-center"><Trash2 size={15} /></button>}
        </div>
      ),
    },
  ];

  const flat = (t.data || []).map((r) => ({
    Code: r.arrivalCode, Batch: r.batchNumber, Supplier: r.supplierName, Vehicle: r.vehicleNumber,
    Date: formatDate(r.arrivalDate), Type: r.cottonType, Grade: r.grade, WeightKG: r.weightKg,
    Moisture: r.moisturePercentage, RatePerKG: r.ratePerKg, TotalValue: r.totalValue, Warehouse: r.warehouseLocation,
  }));

  return (
    <div className="space-y-6">
      <PageHeader
        title="Cotton Arrivals"
        subtitle="Record and manage incoming cotton batches"
        action={
          <div className="flex items-center gap-2">
            <Button variant="secondary" onClick={() => exportCSV('cotton-arrivals.csv', flat)}><Download size={16} /> Excel</Button>
            <Button variant="secondary" onClick={() => exportPDF('Cotton Arrivals Report', columns, t.data)}><FileDown size={16} /> PDF</Button>
            {canCreate && <Button onClick={openCreate}><Plus size={16} /> New Arrival</Button>}
          </div>
        }
      />

      <Card>
        <CardBody className="space-y-3">
          <div className="relative max-w-md">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-3" />
            <Input placeholder="Search by code, batch, supplier…" className="pl-9" value={t.search} onChange={(e) => t.setSearch(e.target.value)} />
          </div>
        </CardBody>
      </Card>

      <Card>
        <CardBody className="p-0">
          <Table columns={columns} data={t.data} loading={t.loading} empty="No arrivals yet" />
          <Pagination page={t.page} pages={t.pages} total={t.total} onPageChange={t.setPage} />
        </CardBody>
      </Card>

      <Modal
        open={modal.open}
        onClose={() => setModal({ open: false, item: null })}
        title={modal.item ? `Edit Arrival ${modal.item.arrivalCode}` : 'New Cotton Arrival'}
        size="xl"
        footer={
          <>
            <Button variant="secondary" onClick={() => setModal({ open: false, item: null })}>Cancel</Button>
            <Button onClick={save}>{modal.item ? 'Update' : 'Create'}</Button>
          </>
        }
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <FormField label="Batch Number" required><Input value={form.batchNumber} onChange={(e) => setForm({ ...form, batchNumber: e.target.value })} /></FormField>
          <FormField label="Supplier Name" required><Input value={form.supplierName} onChange={(e) => setForm({ ...form, supplierName: e.target.value })} /></FormField>
          <FormField label="Vehicle Number" required><Input value={form.vehicleNumber} onChange={(e) => setForm({ ...form, vehicleNumber: e.target.value })} /></FormField>
          <FormField label="Arrival Date" required><Input type="date" value={form.arrivalDate} onChange={(e) => setForm({ ...form, arrivalDate: e.target.value })} /></FormField>
          <FormField label="Cotton Type" required><Input value={form.cottonType} onChange={(e) => setForm({ ...form, cottonType: e.target.value })} placeholder="e.g. Pima, Upland" /></FormField>
          <FormField label="Grade" required>
            <Select value={form.grade} onChange={(e) => setForm({ ...form, grade: e.target.value })}>
              <option value="">Select…</option>
              {['A', 'B', 'C', 'D', 'Premium', 'Standard', 'Economy'].map((g) => <option key={g} value={g}>{g}</option>)}
            </Select>
          </FormField>
          <FormField label="Weight (KG)" required><Input type="number" min="0" step="0.01" value={form.weightKg} onChange={(e) => setForm({ ...form, weightKg: e.target.value })} /></FormField>
          <FormField label="Moisture %" required><Input type="number" min="0" max="100" step="0.01" value={form.moisturePercentage} onChange={(e) => setForm({ ...form, moisturePercentage: e.target.value })} /></FormField>
          <FormField label="Rate / KG" required><Input type="number" min="0" step="0.01" value={form.ratePerKg} onChange={(e) => setForm({ ...form, ratePerKg: e.target.value })} /></FormField>
          <FormField label="Warehouse Location" required><Input value={form.warehouseLocation} onChange={(e) => setForm({ ...form, warehouseLocation: e.target.value })} /></FormField>
          <FormField label="Notes" className="sm:col-span-2"><Textarea rows={2} value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} /></FormField>
        </div>
      </Modal>
    </div>
  );
}