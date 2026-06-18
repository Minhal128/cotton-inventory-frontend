import { useDataTable } from '../../hooks/useDataTable';
import { PageHeader } from '../../components/ui/PageHeader';
import { Card, CardBody } from '../../components/ui/Card';
import { Table, Pagination } from '../../components/ui/Table';
import { Input } from '../../components/ui/Input';
import { Search } from 'lucide-react';
import { Badge } from '../../components/ui/Badge';
import { formatDateTime } from '../../lib/format';

export default function AuditLogs() {
  const t = useDataTable('/audit');

  const columns = [
    { key: 'createdAt', label: 'Time', render: (r) => formatDateTime(r.createdAt) },
    { key: 'username', label: 'User' },
    { key: 'role', label: 'Role' },
    { key: 'action', label: 'Action', render: (r) => <Badge variant="primary">{r.action}</Badge> },
    { key: 'module', label: 'Module' },
    { key: 'ipAddress', label: 'IP' },
    { key: 'status', label: 'Status', render: (r) => <Badge variant={r.status === 'SUCCESS' ? 'success' : 'danger'}>{r.status}</Badge> },
    { key: 'description', label: 'Description' },
  ];

  return (
    <div className="space-y-6">
      <PageHeader title="Audit Logs" subtitle="All system activity and security events" />
      <Card>
        <CardBody>
          <div className="relative max-w-md">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-3" />
            <Input placeholder="Search action, module, user…" className="pl-9" value={t.search} onChange={(e) => t.setSearch(e.target.value)} />
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