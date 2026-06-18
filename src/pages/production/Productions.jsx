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

const empty = {
  cottonBatchUsed: '', quantityCottonConsumed: '', yarnType: '', yarnCount: '',
  productionDate: '', quantityProduced: '', wasteGenerated: '', efficiencyPercentage: '', notes: '',
};

export default function Productions() {
  const { user } = useSelector((s) => s.auth);
  const t = useDataTable('/productions');
  const [modal, setModal] = useState({ open: false });
  const [form, setForm] = useState({ ...empty, productionDate: toInputDate(new Date()) });

  const canCreate = [ROLES.SUPER_ADMIN, ROLES.PRODUCTION].includes(user?.role);

  async function save() {
    try {
      const payload = { ...form };
      ['quantityCottonConsumed', 'quantityProduced', 'wasteGenerated', 'efficiencyPercentage'].forEach((k) => {
        if (payload[k] !== '') payload[k] = Number(payload[k]);
      });
      await api.post('/productions', payload);
      toast.success('Production recorded');
      setModal({ open: false });
      setForm({ ...empty, productionDate: toInputDate(new Date()) });
      t.refresh();
    } catch (e) { toast.error(e.response?.data?.message || 'Failed'); }
  }

  const columns = [
    { key: 'productionCode', label: 'Code', render: (r) => <span className="font-medium">{r.productionCode}</span> },
    { key: 'cottonBatchUsed', label: 'Batch' },
    { key: 'yarnType', label: 'Yarn Type' },
    { key: 'yarnCount', label: 'Count' },
    { key: 'productionDate', label: 'Date', render: (r) => formatDate(r.productionDate) },
    { key: 'quantityCottonConsumed', label: 'Consumed (KG)', render: (r) => formatNumber(r.quantityCottonConsumed) },
    { key: 'quantityProduced', label: 'Produced (KG)', render: (r) => formatNumber(r.quantityProduced) },
    { key: 'wasteGenerated', label: 'Waste (KG)', render: (r) => formatNumber(r.wasteGenerated) },
    { key: 'efficiencyPercentage', label: 'Efficiency', render: (r) => `${formatNumber(r.efficiencyPercentage)}%` },
    { key: 'producedByName', label: 'By' },
  ];

  const flat = (t.data || []).map((r) => ({
    Code: r.productionCode, Batch: r.cottonBatchUsed, YarnType: r.yarnType, YarnCount: r.yarnCount,
    Date: formatDate(r.productionDate), Consumed: r.quantityCottonConsumed, Produced: r.quantityProduced,
    Waste: r.wasteGenerated, Efficiency: r.efficiencyPercentage, By: r.producedByName,
  }));

  return (
    <div className="space-y-6">
      <PageHeader
        title="Yarn Productions"
        subtitle="Record production runs from issued cotton"
        action={
          <div className="flex items-center gap-2">
            <Button variant="secondary" onClick={() => exportCSV('productions.csv', flat)}><Download size={16} /> Excel</Button>
            <Button variant="secondary" onClick={() => exportPDF('Production Report', columns, t.data)}><FileDown size={16} /> PDF</Button>
            {canCreate && <Button onClick={() => setModal({ open: true })}><Plus size={16} /> Record Production</Button>}
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
          <Table columns={columns} data={t.data} loading={t.loading} empty="No productions yet" />
          <Pagination page={t.page} pages={t.pages} total={t.total} onPageChange={t.setPage} />
        </CardBody>
      </Card>

      <Modal
        open={modal.open}
        onClose={() => setModal({ open: false })}
        title="Record Yarn Production"
        size="xl"
        footer={<><Button variant="secondary" onClick={() => setModal({ open: false })}>Cancel</Button><Button onClick={save}>Record</Button></>}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <FormField label="Cotton Batch Used" required><Input value={form.cottonBatchUsed} onChange={(e) => setForm({ ...form, cottonBatchUsed: e.target.value })} /></FormField>
          <FormField label="Quantity Cotton Consumed (KG)" required><Input type="number" min="0" step="0.01" value={form.quantityCottonConsumed} onChange={(e) => setForm({ ...form, quantityCottonConsumed: e.target.value })} /></FormField>
          <FormField label="Yarn Type" required><Input value={form.yarnType} onChange={(e) => setForm({ ...form, yarnType: e.target.value })} placeholder="e.g. Combed, Carded" /></FormField>
          <FormField label="Yarn Count" required><Input value={form.yarnCount} onChange={(e) => setForm({ ...form, yarnCount: e.target.value })} placeholder="e.g. 30s, 40s" /></FormField>
          <FormField label="Production Date" required><Input type="date" value={form.productionDate} onChange={(e) => setForm({ ...form, productionDate: e.target.value })} /></FormField>
          <FormField label="Quantity Produced (KG)" required><Input type="number" min="0" step="0.01" value={form.quantityProduced} onChange={(e) => setForm({ ...form, quantityProduced: e.target.value })} /></FormField>
          <FormField label="Waste Generated (KG)"><Input type="number" min="0" step="0.01" value={form.wasteGenerated} onChange={(e) => setForm({ ...form, wasteGenerated: e.target.value })} /></FormField>
          <FormField label="Efficiency %"><Input type="number" min="0" max="100" step="0.01" value={form.efficiencyPercentage} onChange={(e) => setForm({ ...form, efficiencyPercentage: e.target.value })} placeholder="auto-calculated if empty" /></FormField>
          <FormField label="Notes" className="sm:col-span-2"><Textarea rows={2} value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} /></FormField>
        </div>
      </Modal>
    </div>
  );
}