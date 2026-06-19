import { useState } from 'react';
import { motion } from 'framer-motion';
import { FileDown, Download, FileBarChart2, Sparkles } from 'lucide-react';
import api from '../../app/axios';
import { PageHeader } from '../../components/ui/PageHeader';
import { Card, CardBody, CardHeader } from '../../components/ui/Card';
import { Input, FormField } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Table, Pagination } from '../../components/ui/Table';
import { exportCSV, exportPDF } from '../../lib/exporters';
import { formatDate, formatNumber, formatCurrency, toInputDate } from '../../lib/format';
import toast from 'react-hot-toast';

const REPORTS = [
  { key: 'cotton-arrival', label: 'Cotton Arrival' },
  { key: 'cotton-stock', label: 'Cotton Stock' },
  { key: 'cotton-issue', label: 'Cotton Issue' },
  { key: 'production', label: 'Production' },
  { key: 'yarn-inventory', label: 'Yarn Inventory' },
  { key: 'dispatch', label: 'Dispatch' },
  { key: 'customer-dispatch', label: 'Customer Dispatch' },
];

export default function Reports() {
  const [active, setActive] = useState('cotton-arrival');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [data, setData] = useState({ items: [], totals: null, count: 0 });
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(false);

  async function load(p = 1) {
    setLoading(true);
    try {
      const { data: res } = await api.get(`/reports/${active}`, {
        params: { from: from || undefined, to: to || undefined, page: p, limit: 20 },
      });
      setData(res);
      setPage(p);
      setPages(res.pages || 1);
    } catch (e) { toast.error('Failed to load'); }
    finally { setLoading(false); }
  }

  function columnsFor(key) {
    switch (key) {
      case 'cotton-arrival':
        return [
          { key: 'arrivalCode', label: 'Code' },
          { key: 'batchNumber', label: 'Batch' },
          { key: 'supplierName', label: 'Supplier' },
          { key: 'arrivalDate', label: 'Date', render: (r) => formatDate(r.arrivalDate) },
          { key: 'cottonType', label: 'Type' },
          { key: 'grade', label: 'Grade' },
          { key: 'weightKg', label: 'Weight (KG)', render: (r) => formatNumber(r.weightKg) },
          { key: 'ratePerKg', label: 'Rate/KG', render: (r) => formatCurrency(r.ratePerKg) },
          { key: 'totalValue', label: 'Value', render: (r) => formatCurrency(r.totalValue) },
        ];
      case 'cotton-stock':
        return [
          { key: 'batchNumber', label: 'Batch' },
          { key: 'cottonType', label: 'Type' },
          { key: 'grade', label: 'Grade' },
          { key: 'warehouseLocation', label: 'Warehouse' },
          { key: 'totalArrived', label: 'Arrived', render: (r) => formatNumber(r.totalArrived) },
          { key: 'totalIssued', label: 'Issued', render: (r) => formatNumber(r.totalIssued) },
          { key: 'remainingStock', label: 'Remaining', render: (r) => formatNumber(r.remainingStock) },
        ];
      case 'cotton-issue':
        return [
          { key: 'issueCode', label: 'Code' },
          { key: 'batchNumber', label: 'Batch' },
          { key: 'quantityIssued', label: 'Qty (KG)', render: (r) => formatNumber(r.quantityIssued) },
          { key: 'issueDate', label: 'Date', render: (r) => formatDate(r.issueDate) },
          { key: 'productionDepartment', label: 'Department' },
          { key: 'issuedByName', label: 'Issued By' },
        ];
      case 'production':
        return [
          { key: 'productionCode', label: 'Code' },
          { key: 'cottonBatchUsed', label: 'Batch' },
          { key: 'yarnType', label: 'Type' },
          { key: 'yarnCount', label: 'Count' },
          { key: 'productionDate', label: 'Date', render: (r) => formatDate(r.productionDate) },
          { key: 'quantityCottonConsumed', label: 'Consumed', render: (r) => formatNumber(r.quantityCottonConsumed) },
          { key: 'quantityProduced', label: 'Produced', render: (r) => formatNumber(r.quantityProduced) },
          { key: 'efficiencyPercentage', label: 'Efficiency', render: (r) => `${formatNumber(r.efficiencyPercentage)}%` },
        ];
      case 'yarn-inventory':
        return [
          { key: 'yarnType', label: 'Type' },
          { key: 'yarnCount', label: 'Count' },
          { key: 'totalProduced', label: 'Produced', render: (r) => formatNumber(r.totalProduced) },
          { key: 'totalDispatched', label: 'Dispatched', render: (r) => formatNumber(r.totalDispatched) },
          { key: 'availableStock', label: 'Available', render: (r) => formatNumber(r.availableStock) },
        ];
      case 'dispatch':
        return [
          { key: 'dispatchCode', label: 'Code' },
          { key: 'customerCompany', label: 'Company' },
          { key: 'yarnType', label: 'Type' },
          { key: 'yarnCount', label: 'Count' },
          { key: 'quantityDispatched', label: 'Qty (KG)', render: (r) => formatNumber(r.quantityDispatched) },
          { key: 'dispatchDate', label: 'Date', render: (r) => formatDate(r.dispatchDate) },
          { key: 'invoiceNumber', label: 'Invoice' },
        ];
      case 'customer-dispatch':
        return [
          { key: '_id', label: 'Customer', render: (r) => `${r._id.name} (${r._id.customer})` },
          { key: 'dispatches', label: 'Dispatches' },
          { key: 'totalQuantity', label: 'Total Qty (KG)', render: (r) => formatNumber(r.totalQuantity) },
          { key: 'lastDispatch', label: 'Last', render: (r) => formatDate(r.lastDispatch) },
        ];
      default: return [];
    }
  }

  const cols = columnsFor(active);
  const flat = (data.items || []).map((r) => {
    const row = {};
    cols.forEach((c) => { row[c.label] = c.render ? (typeof c.render(r) === 'string' ? c.render(r) : '') : r[c.key]; });
    return row;
  });

  return (
    <div className="space-y-6">
      <PageHeader
        icon={FileBarChart2}
        title="Reports"
        subtitle="Generate detailed reports across all modules"
        action={
          <div className="hidden sm:flex items-center gap-2 text-xs text-ink-2">
            <Sparkles size={14} className="text-primary" />
            Export to Excel or PDF in one click
          </div>
        }
      />

      <motion.div
        className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2"
        initial="hidden"
        animate="show"
        variants={{ hidden: {}, show: { transition: { staggerChildren: 0.04 } } }}
      >
        {REPORTS.map((r) => (
          <motion.button
            key={r.key}
            variants={{ hidden: { opacity: 0, y: 6 }, show: { opacity: 1, y: 0 } }}
            onClick={() => { setActive(r.key); setFrom(''); setTo(''); }}
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.97 }}
            className={`rounded-lg border px-3 py-2 text-sm font-medium transition ${
              active === r.key
                ? 'bg-gradient-to-br from-primary to-[#5B2EE6] text-white border-transparent shadow-md shadow-primary/20'
                : 'bg-surface border-border text-ink-2 hover:bg-surface-2'
            }`}
          >
            {r.label}
          </motion.button>
        ))}
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <Card>
          <CardBody className="flex flex-wrap items-end gap-3">
            <FormField label="From"><Input type="date" value={from} onChange={(e) => setFrom(e.target.value)} /></FormField>
            <FormField label="To"><Input type="date" value={to} onChange={(e) => setTo(e.target.value)} /></FormField>
            <Button onClick={() => load(1)}>Generate</Button>
            <div className="ml-auto flex items-center gap-2">
              <Button variant="secondary" onClick={() => exportCSV(`${active}-report.csv`, flat)}><Download size={16} /> Excel</Button>
              <Button variant="secondary" onClick={() => exportPDF(`${active}-report`, cols, data.items || [])}><FileDown size={16} /> PDF</Button>
            </div>
          </CardBody>
        </Card>
      </motion.div>

      {data.totals && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
          <Card>
            <CardHeader title="Totals" />
            <CardBody>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
                {Object.entries(data.totals).map(([k, v]) => (
                  <div key={k} className="rounded-lg bg-surface-2/60 p-3">
                    <p className="text-xs text-ink-2 capitalize">{k.replace(/([A-Z])/g, ' $1')}</p>
                    <p className="text-base font-semibold text-ink mt-1">{typeof v === 'number' ? formatNumber(v) : String(v)}</p>
                  </div>
                ))}
              </div>
            </CardBody>
          </Card>
        </motion.div>
      )}

      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <Card>
          <CardBody className="p-0">
            <Table columns={cols} data={data.items || []} loading={loading} />
            <Pagination page={page} pages={pages} total={data.count || (data.items || []).length} onPageChange={load} />
          </CardBody>
        </Card>
      </motion.div>
    </div>
  );
}
