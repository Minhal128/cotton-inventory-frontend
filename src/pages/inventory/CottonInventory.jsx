import { useDataTable } from '../../hooks/useDataTable';
import { PageHeader } from '../../components/ui/PageHeader';
import { Card, CardBody } from '../../components/ui/Card';
import { Table, Pagination } from '../../components/ui/Table';
import { Badge } from '../../components/ui/Badge';
import { Search, Download, FileDown } from 'lucide-react';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { formatNumber, formatCurrency, formatDate } from '../../lib/format';
import { exportCSV, exportPDF } from '../../lib/exporters';

export default function CottonInventory() {
  const t = useDataTable('/inventory/cotton');

  const columns = [
    { key: 'batchNumber', label: 'Batch', render: (r) => <span className="font-medium">{r.batchNumber}</span> },
    { key: 'cottonType', label: 'Type' },
    { key: 'grade', label: 'Grade' },
    { key: 'warehouseLocation', label: 'Warehouse' },
    { key: 'supplierName', label: 'Supplier' },
    { key: 'totalArrived', label: 'Total Arrived', render: (r) => `${formatNumber(r.totalArrived)} KG` },
    { key: 'totalIssued', label: 'Total Issued', render: (r) => `${formatNumber(r.totalIssued)} KG` },
    { key: 'remainingStock', label: 'Remaining', render: (r) => (
      <Badge variant={r.remainingStock > 0 ? 'success' : 'danger'}>{formatNumber(r.remainingStock)} KG</Badge>
    ) },
    { key: 'averageRate', label: 'Avg Rate', render: (r) => formatCurrency(r.averageRate) },
    { key: 'lastArrivalDate', label: 'Last Arrival', render: (r) => r.lastArrivalDate ? formatDate(r.lastArrivalDate) : '—' },
  ];

  const flat = (t.data || []).map((r) => ({
    Batch: r.batchNumber, Type: r.cottonType, Grade: r.grade, Warehouse: r.warehouseLocation,
    Supplier: r.supplierName, TotalArrived: r.totalArrived, TotalIssued: r.totalIssued,
    Remaining: r.remainingStock, AvgRate: r.averageRate, LastArrival: r.lastArrivalDate,
  }));

  return (
    <div className="space-y-6">
      <PageHeader
        title="Cotton Inventory"
        subtitle="Real-time stock of every cotton batch"
        action={
          <div className="flex items-center gap-2">
            <Button variant="secondary" onClick={() => exportCSV('cotton-inventory.csv', flat)}><Download size={16} /> Excel</Button>
            <Button variant="secondary" onClick={() => exportPDF('Cotton Inventory Report', columns, t.data)}><FileDown size={16} /> PDF</Button>
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
          <Table columns={columns} data={t.data} loading={t.loading} />
          <Pagination page={t.page} pages={t.pages} total={t.total} onPageChange={t.setPage} />
        </CardBody>
      </Card>
    </div>
  );
}