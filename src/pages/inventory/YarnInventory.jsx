import { motion } from 'framer-motion';
import { Search, Download, FileDown, Boxes } from 'lucide-react';
import { useDataTable } from '../../hooks/useDataTable';
import { PageHeader } from '../../components/ui/PageHeader';
import { Card, CardBody } from '../../components/ui/Card';
import { Table, Pagination } from '../../components/ui/Table';
import { Badge } from '../../components/ui/Badge';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { formatNumber, formatDate } from '../../lib/format';
import { exportCSV, exportPDF } from '../../lib/exporters';

export default function YarnInventory() {
  const t = useDataTable('/inventory/yarn');

  const columns = [
    { key: 'yarnType', label: 'Type', render: (r) => <span className="font-medium">{r.yarnType}</span> },
    { key: 'yarnCount', label: 'Count' },
    { key: 'totalProduced', label: 'Produced', render: (r) => `${formatNumber(r.totalProduced)} KG` },
    { key: 'totalDispatched', label: 'Dispatched', render: (r) => `${formatNumber(r.totalDispatched)} KG` },
    { key: 'availableStock', label: 'Available', render: (r) => <Badge variant={r.availableStock > 0 ? 'success' : 'danger'}>{formatNumber(r.availableStock)} KG</Badge> },
    { key: 'lastProductionDate', label: 'Last Production', render: (r) => r.lastProductionDate ? formatDate(r.lastProductionDate) : '—' },
    { key: 'lastDispatchDate', label: 'Last Dispatch', render: (r) => r.lastDispatchDate ? formatDate(r.lastDispatchDate) : '—' },
  ];

  const flat = (t.data || []).map((r) => ({
    Type: r.yarnType, Count: r.yarnCount, Produced: r.totalProduced, Dispatched: r.totalDispatched,
    Available: r.availableStock, LastProduction: r.lastProductionDate, LastDispatch: r.lastDispatchDate,
  }));

  return (
    <div className="space-y-6">
      <PageHeader
        icon={Boxes}
        title="Yarn Inventory"
        subtitle="Real-time stock of produced yarn"
        action={
          <div className="flex items-center gap-2">
            <Button variant="secondary" onClick={() => exportCSV('yarn-inventory.csv', flat)}><Download size={16} /> Excel</Button>
            <Button variant="secondary" onClick={() => exportPDF('Yarn Inventory Report', columns, t.data)}><FileDown size={16} /> PDF</Button>
          </div>
        }
      />
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
        <Card>
          <CardBody>
            <div className="relative max-w-md">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-3" />
              <Input placeholder="Search by type or count…" className="pl-9" value={t.search} onChange={(e) => t.setSearch(e.target.value)} />
            </div>
          </CardBody>
        </Card>
      </motion.div>
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.12 }}>
        <Card>
          <CardBody className="p-0">
            <Table columns={columns} data={t.data} loading={t.loading} />
            <Pagination page={t.page} pages={t.pages} total={t.total} onPageChange={t.setPage} />
          </CardBody>
        </Card>
      </motion.div>
    </div>
  );
}
