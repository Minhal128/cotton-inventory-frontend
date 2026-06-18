import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Truck, Package, Scissors, Send, Boxes, Users as UsersIcon, Activity } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import api from '../../app/axios';
import { StatCard } from '../../components/ui/StatCard';
import { Card, CardHeader, CardBody } from '../../components/ui/Card';
import { PageHeader } from '../../components/ui/PageHeader';
import { formatNumber, formatDateTime } from '../../lib/format';
import { ROLES } from '../../lib/roles';
import { Badge } from '../../components/ui/Badge';

function Chart({ data, color = '#7C4DFF' }) {
  return (
    <ResponsiveContainer width="100%" height={240}>
      <LineChart data={data}>
        <CartesianGrid stroke="#E5E7EB" strokeDasharray="3 3" />
        <XAxis dataKey="label" tick={{ fontSize: 11, fill: '#6B7280' }} />
        <YAxis tick={{ fontSize: 11, fill: '#6B7280' }} />
        <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid #E5E7EB' }} />
        <Line type="monotone" dataKey="value" stroke={color} strokeWidth={2} dot={{ r: 3 }} />
      </LineChart>
    </ResponsiveContainer>
  );
}

function Bar({ data, color = '#7C4DFF' }) {
  return (
    <ResponsiveContainer width="100%" height={240}>
      <BarChart data={data}>
        <CartesianGrid stroke="#E5E7EB" strokeDasharray="3 3" />
        <XAxis dataKey="label" tick={{ fontSize: 11, fill: '#6B7280' }} />
        <YAxis tick={{ fontSize: 11, fill: '#6B7280' }} />
        <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid #E5E7EB' }} />
        <Bar dataKey="value" fill={color} radius={[6, 6, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}

export default function Dashboard() {
  const { user } = useSelector((s) => s.auth);
  const [data, setData] = useState(null);

  useEffect(() => {
    let key = 'admin';
    if (user?.role === ROLES.PRODUCTION) key = 'production';
    else if (user?.role === ROLES.DISPATCH) key = 'dispatch';
    else if (user?.role === ROLES.COTTON_ARRIVAL) key = 'arrival';
    else if (user?.role === ROLES.COTTON_ISSUE) key = 'issue';
    api.get(`/dashboard/${key}`).then((r) => setData(r.data));
  }, [user]);

  if (!data) return <div className="text-ink-2">Loading…</div>;
  const c = data.cards || {};
  const isAdmin = user?.role === ROLES.SUPER_ADMIN;

  return (
    <div className="space-y-6">
      <PageHeader title={`${isAdmin ? 'Admin' : 'Operational'} Dashboard`} subtitle={`Welcome back, ${user?.fullName}`} />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {c.cottonArrived !== undefined && <StatCard title="Cotton Arrived" value={formatNumber(c.cottonArrived)} suffix="KG" icon={Truck} accent="info" />}
        {c.cottonIssued !== undefined && <StatCard title="Cotton Issued" value={formatNumber(c.cottonIssued)} suffix="KG" icon={Package} accent="warning" />}
        {c.cottonStock !== undefined && <StatCard title="Cotton Stock" value={formatNumber(c.cottonStock)} suffix="KG" icon={Boxes} accent="primary" />}
        {c.yarnProduced !== undefined && <StatCard title="Yarn Produced" value={formatNumber(c.yarnProduced)} suffix="KG" icon={Scissors} accent="success" />}
        {c.yarnStock !== undefined && <StatCard title="Yarn Stock" value={formatNumber(c.yarnStock)} suffix="KG" icon={Boxes} accent="primary" />}
        {c.yarnDispatched !== undefined && <StatCard title="Yarn Dispatched" value={formatNumber(c.yarnDispatched)} suffix="KG" icon={Send} accent="info" />}
        {c.totalUsers !== undefined && <StatCard title="Total Users" value={formatNumber(c.totalUsers, 0)} icon={UsersIcon} accent="primary" />}
        {c.pending !== undefined && <StatCard title="Pending Requests" value={formatNumber(c.pending, 0)} icon={Activity} accent="warning" />}
        {c.fulfilled !== undefined && <StatCard title="Fulfilled" value={formatNumber(c.fulfilled, 0)} icon={Activity} accent="success" />}
        {c.approved !== undefined && <StatCard title="Approved" value={formatNumber(c.approved, 0)} icon={Activity} accent="info" />}
        {c.rejected !== undefined && <StatCard title="Rejected" value={formatNumber(c.rejected, 0)} icon={Activity} accent="danger" />}
        {c.availableStock !== undefined && <StatCard title="Available Yarn" value={formatNumber(c.availableStock)} suffix="KG" icon={Boxes} accent="primary" />}
        {c.totalDispatched !== undefined && <StatCard title="Total Dispatched" value={formatNumber(c.totalDispatched)} suffix="KG" icon={Send} accent="info" />}
        {c.totalIssues !== undefined && <StatCard title="Total Issues" value={formatNumber(c.totalIssues, 0)} icon={Package} accent="warning" />}
        {c.totalArrivals !== undefined && <StatCard title="Total Arrivals" value={formatNumber(c.totalArrivals, 0)} icon={Truck} accent="info" />}
        {c.totalArrived !== undefined && <StatCard title="Total Arrived" value={formatNumber(c.totalArrived)} suffix="KG" icon={Truck} accent="info" />}
        {c.totalIssued !== undefined && <StatCard title="Total Issued" value={formatNumber(c.totalIssued)} suffix="KG" icon={Package} accent="warning" />}
        {c.remainingStock !== undefined && <StatCard title="Remaining Stock" value={formatNumber(c.remainingStock)} suffix="KG" icon={Boxes} accent="primary" />}
      </div>

      {data.charts && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {data.charts.monthlyArrivals && (
            <Card>
              <CardHeader title="Monthly Cotton Arrivals" subtitle="Last 12 months" />
              <CardBody><Bar data={data.charts.monthlyArrivals} color="#3B82F6" /></CardBody>
            </Card>
          )}
          {data.charts.monthlyProduction && (
            <Card>
              <CardHeader title="Monthly Yarn Production" subtitle="Last 12 months" />
              <CardBody><Bar data={data.charts.monthlyProduction} color="#22C55E" /></CardBody>
            </Card>
          )}
          {data.charts.monthlyDispatches && (
            <Card>
              <CardHeader title="Monthly Dispatches" subtitle="Last 12 months" />
              <CardBody><Bar data={data.charts.monthlyDispatches} color="#7C4DFF" /></CardBody>
            </Card>
          )}
          {data.charts.monthlyIssues && (
            <Card>
              <CardHeader title="Monthly Issues" subtitle="Last 12 months" />
              <CardBody><Bar data={data.charts.monthlyIssues} color="#F59E0B" /></CardBody>
            </Card>
          )}
          {data.charts.efficiencyTrend && (
            <Card>
              <CardHeader title="Efficiency Trend" subtitle="Last 12 months" />
              <CardBody><Chart data={data.charts.efficiencyTrend} color="#22C55E" /></CardBody>
            </Card>
          )}
        </div>
      )}

      {data.summary && (
        <Card>
          <CardHeader title="Production Summary" />
          <CardBody>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div><p className="text-xs text-ink-2">Total Produced</p><p className="text-lg font-semibold text-ink mt-1">{formatNumber(data.summary.totalProduced || 0)} KG</p></div>
              <div><p className="text-xs text-ink-2">Total Consumed</p><p className="text-lg font-semibold text-ink mt-1">{formatNumber(data.summary.totalConsumed || 0)} KG</p></div>
              <div><p className="text-xs text-ink-2">Total Waste</p><p className="text-lg font-semibold text-ink mt-1">{formatNumber(data.summary.totalWaste || 0)} KG</p></div>
              <div><p className="text-xs text-ink-2">Avg Efficiency</p><p className="text-lg font-semibold text-ink mt-1">{formatNumber(data.summary.avgEfficiency || 0)}%</p></div>
            </div>
          </CardBody>
        </Card>
      )}

      {data.recentActivities && (
        <Card>
          <CardHeader title="Recent Activities" subtitle="Across all modules" />
          <CardBody className="p-0">
            <ul className="divide-y divide-border">
              {data.recentActivities.map((a, i) => (
                <li key={i} className="px-5 py-3 flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <Badge variant={a.type === 'ARRIVAL' ? 'info' : a.type === 'PRODUCTION' ? 'success' : 'primary'}>{a.type}</Badge>
                      <span className="text-sm font-medium text-ink">{a.label}</span>
                    </div>
                    <p className="text-xs text-ink-2 mt-1">{a.meta} · by {a.by || '—'}</p>
                  </div>
                  <span className="text-xs text-ink-2">{formatDateTime(a.at)}</span>
                </li>
              ))}
              {data.recentActivities.length === 0 && <li className="px-5 py-8 text-center text-ink-2 text-sm">No activities yet.</li>}
            </ul>
          </CardBody>
        </Card>
      )}

      {data.recentProductions && (
        <Card>
          <CardHeader title="Recent Productions" />
          <CardBody className="p-0">
            <ul className="divide-y divide-border">
              {data.recentProductions.map((p) => (
                <li key={p._id} className="px-5 py-3 flex items-center justify-between">
                  <div>
                    <span className="text-sm font-medium text-ink">{p.productionCode}</span>
                    <p className="text-xs text-ink-2 mt-1">{p.yarnType} {p.yarnCount} · {formatNumber(p.quantityProduced)} KG · by {p.producedByName}</p>
                  </div>
                  <span className="text-xs text-ink-2">{formatDateTime(p.createdAt)}</span>
                </li>
              ))}
            </ul>
          </CardBody>
        </Card>
      )}

      {data.recent && (
        <Card>
          <CardHeader title="Recent Dispatches" />
          <CardBody className="p-0">
            <ul className="divide-y divide-border">
              {data.recent.map((d) => (
                <li key={d._id} className="px-5 py-3 flex items-center justify-between">
                  <div>
                    <span className="text-sm font-medium text-ink">{d.dispatchCode}</span>
                    <p className="text-xs text-ink-2 mt-1">{d.customerCompany} · {formatNumber(d.quantityDispatched)} KG</p>
                  </div>
                  <span className="text-xs text-ink-2">{formatDateTime(d.createdAt)}</span>
                </li>
              ))}
            </ul>
          </CardBody>
        </Card>
      )}
    </div>
  );
}
