import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
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
        <Line type="monotone" dataKey="value" stroke={color} strokeWidth={2.5} dot={{ r: 3 }} />
      </LineChart>
    </ResponsiveContainer>
  );
}

function BarChartPanel({ data, color = '#7C4DFF' }) {
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

  if (!data) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-ink-2">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' }}
          className="h-10 w-10 rounded-full border-2 border-border border-t-primary"
        />
        <p className="mt-4 text-sm">Loading dashboard…</p>
      </div>
    );
  }

  const c = data.cards || {};
  const isAdmin = user?.role === ROLES.SUPER_ADMIN;

  return (
    <div className="space-y-6">
      <PageHeader title={`${isAdmin ? 'Admin' : 'Operational'} Dashboard`} subtitle={`Welcome back, ${user?.fullName}`} />

      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
        initial="hidden"
        animate="show"
        variants={{ hidden: {}, show: { transition: { staggerChildren: 0.05 } } }}
      >
        {c.cottonArrived !== undefined && <StatCard delay={0.00} title="Cotton Arrived" value={Number(c.cottonArrived)} suffix="KG" icon={Truck} accent="info" />}
        {c.cottonIssued !== undefined && <StatCard delay={0.04} title="Cotton Issued" value={Number(c.cottonIssued)} suffix="KG" icon={Package} accent="warning" />}
        {c.cottonStock !== undefined && <StatCard delay={0.08} title="Cotton Stock" value={Number(c.cottonStock)} suffix="KG" icon={Boxes} accent="primary" />}
        {c.yarnProduced !== undefined && <StatCard delay={0.12} title="Yarn Produced" value={Number(c.yarnProduced)} suffix="KG" icon={Scissors} accent="success" />}
        {c.yarnStock !== undefined && <StatCard delay={0.16} title="Yarn Stock" value={Number(c.yarnStock)} suffix="KG" icon={Boxes} accent="primary" />}
        {c.yarnDispatched !== undefined && <StatCard delay={0.20} title="Yarn Dispatched" value={Number(c.yarnDispatched)} suffix="KG" icon={Send} accent="info" />}
        {c.totalUsers !== undefined && <StatCard delay={0.24} title="Total Users" value={Number(c.totalUsers)} decimals={0} icon={UsersIcon} accent="primary" />}
        {c.pending !== undefined && <StatCard delay={0.28} title="Pending Requests" value={Number(c.pending)} decimals={0} icon={Activity} accent="warning" />}
        {c.fulfilled !== undefined && <StatCard delay={0.32} title="Fulfilled" value={Number(c.fulfilled)} decimals={0} icon={Activity} accent="success" />}
        {c.approved !== undefined && <StatCard delay={0.36} title="Approved" value={Number(c.approved)} decimals={0} icon={Activity} accent="info" />}
        {c.rejected !== undefined && <StatCard delay={0.40} title="Rejected" value={Number(c.rejected)} decimals={0} icon={Activity} accent="danger" />}
        {c.availableStock !== undefined && <StatCard delay={0.44} title="Available Yarn" value={Number(c.availableStock)} suffix="KG" icon={Boxes} accent="primary" />}
        {c.totalDispatched !== undefined && <StatCard delay={0.48} title="Total Dispatched" value={Number(c.totalDispatched)} suffix="KG" icon={Send} accent="info" />}
        {c.totalIssues !== undefined && <StatCard delay={0.52} title="Total Issues" value={Number(c.totalIssues)} decimals={0} icon={Package} accent="warning" />}
        {c.totalArrivals !== undefined && <StatCard delay={0.56} title="Total Arrivals" value={Number(c.totalArrivals)} decimals={0} icon={Truck} accent="info" />}
        {c.totalArrived !== undefined && <StatCard delay={0.60} title="Total Arrived" value={Number(c.totalArrived)} suffix="KG" icon={Truck} accent="info" />}
        {c.totalIssued !== undefined && <StatCard delay={0.64} title="Total Issued" value={Number(c.totalIssued)} suffix="KG" icon={Package} accent="warning" />}
        {c.remainingStock !== undefined && <StatCard delay={0.68} title="Remaining Stock" value={Number(c.remainingStock)} suffix="KG" icon={Boxes} accent="primary" />}
      </motion.div>

      {data.charts && (
        <motion.div
          className="grid grid-cols-1 lg:grid-cols-2 gap-4"
          initial="hidden"
          animate="show"
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.07, delayChildren: 0.1 } } }}
        >
          {data.charts.monthlyArrivals && (
            <MotionCardWrap>
              <CardHeader title="Monthly Cotton Arrivals" subtitle="Last 12 months" />
              <CardBody><BarChartPanel data={data.charts.monthlyArrivals} color="#3B82F6" /></CardBody>
            </MotionCardWrap>
          )}
          {data.charts.monthlyProduction && (
            <MotionCardWrap>
              <CardHeader title="Monthly Yarn Production" subtitle="Last 12 months" />
              <CardBody><BarChartPanel data={data.charts.monthlyProduction} color="#22C55E" /></CardBody>
            </MotionCardWrap>
          )}
          {data.charts.monthlyDispatches && (
            <MotionCardWrap>
              <CardHeader title="Monthly Dispatches" subtitle="Last 12 months" />
              <CardBody><BarChartPanel data={data.charts.monthlyDispatches} color="#7C4DFF" /></CardBody>
            </MotionCardWrap>
          )}
          {data.charts.monthlyIssues && (
            <MotionCardWrap>
              <CardHeader title="Monthly Issues" subtitle="Last 12 months" />
              <CardBody><BarChartPanel data={data.charts.monthlyIssues} color="#F59E0B" /></CardBody>
            </MotionCardWrap>
          )}
          {data.charts.efficiencyTrend && (
            <MotionCardWrap>
              <CardHeader title="Efficiency Trend" subtitle="Last 12 months" />
              <CardBody><Chart data={data.charts.efficiencyTrend} color="#22C55E" /></CardBody>
            </MotionCardWrap>
          )}
        </motion.div>
      )}

      {data.summary && (
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }}>
          <Card>
            <CardHeader title="Production Summary" />
            <CardBody>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <SummaryItem label="Total Produced" value={data.summary.totalProduced} suffix="KG" />
                <SummaryItem label="Total Consumed" value={data.summary.totalConsumed} suffix="KG" />
                <SummaryItem label="Total Waste" value={data.summary.totalWaste} suffix="KG" />
                <SummaryItem label="Avg Efficiency" value={data.summary.avgEfficiency} suffix="%" />
              </div>
            </CardBody>
          </Card>
        </motion.div>
      )}

      {data.recentActivities && (
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.4 }}>
          <Card>
            <CardHeader title="Recent Activities" subtitle="Across all modules" />
            <CardBody className="p-0">
              <ul className="divide-y divide-border">
                {data.recentActivities.map((a, i) => (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.04 * i, duration: 0.3 }}
                    className="px-5 py-3 flex items-center justify-between hover:bg-surface-2/60 transition"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <Badge variant={a.type === 'ARRIVAL' ? 'info' : a.type === 'PRODUCTION' ? 'success' : 'primary'}>{a.type}</Badge>
                        <span className="text-sm font-medium text-ink">{a.label}</span>
                      </div>
                      <p className="text-xs text-ink-2 mt-1">{a.meta} · by {a.by || '—'}</p>
                    </div>
                    <span className="text-xs text-ink-2">{formatDateTime(a.at)}</span>
                  </motion.li>
                ))}
                {data.recentActivities.length === 0 && <li className="px-5 py-8 text-center text-ink-2 text-sm">No activities yet.</li>}
              </ul>
            </CardBody>
          </Card>
        </motion.div>
      )}

      {data.recentProductions && (
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.45 }}>
          <Card>
            <CardHeader title="Recent Productions" />
            <CardBody className="p-0">
              <ul className="divide-y divide-border">
                {data.recentProductions.map((p) => (
                  <li key={p._id} className="px-5 py-3 flex items-center justify-between hover:bg-surface-2/60 transition">
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
        </motion.div>
      )}

      {data.recent && (
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.5 }}>
          <Card>
            <CardHeader title="Recent Dispatches" />
            <CardBody className="p-0">
              <ul className="divide-y divide-border">
                {data.recent.map((d) => (
                  <li key={d._id} className="px-5 py-3 flex items-center justify-between hover:bg-surface-2/60 transition">
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
        </motion.div>
      )}
    </div>
  );
}

function MotionCardWrap({ children }) {
  return (
    <motion.div
      variants={{ hidden: { opacity: 0, y: 14 }, show: { opacity: 1, y: 0 } }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
    >
      <Card className="hover:shadow-lg transition-shadow">{children}</Card>
    </motion.div>
  );
}

function SummaryItem({ label, value, suffix }) {
  return (
    <div className="rounded-lg bg-surface-2/60 p-3">
      <p className="text-xs text-ink-2">{label}</p>
      <p className="text-lg font-semibold text-ink mt-1">{formatNumber(value || 0)} {suffix}</p>
    </div>
  );
}
