'use client';

import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { BarChart3, Download, Calendar, ArrowUpRight, TrendingUp } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

export default function AdminReportsPage() {
  const [liability, setLiability] = useState<any>({ total_unredeemed_points: 0, financial_liability: 0 });
  const [chartData, setChartData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const liabRes = await api.get('/admin/reports/liability');
        setLiability(liabRes.data);
        
        const chartRes = await api.get('/admin/reports/chart-data');
        setChartData(chartRes.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchReports();
  }, []);

  const COLORS = ['#e2e8f0', '#fcd34d', '#0f172a'];
  const pieData = [
    { name: 'Silver', value: 60 },
    { name: 'Gold', value: 25 },
    { name: 'Platinum', value: 15 },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Analytics & Reports</h1>
          <p className="text-sm text-slate-500 mt-1">Deep dive into program performance, ROI, and buyer engagement.</p>
        </div>
        <div className="flex gap-2">
          <button className="bg-white border border-slate-200 text-slate-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-50 flex items-center gap-2 shadow-sm">
            <Calendar className="w-4 h-4" /> Last 30 Days
          </button>
          <button className="bg-slate-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-800 flex items-center gap-2 shadow-sm">
            <Download className="w-4 h-4" /> Export Report
          </button>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
          <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-2">Program ROI</h3>
          <div className="flex items-end gap-3 mb-4">
            <p className="text-3xl font-bold text-slate-900">4.2x</p>
            <span className="flex items-center text-sm font-medium text-emerald-600 mb-1">
              <ArrowUpRight className="w-4 h-4" /> 12%
            </span>
          </div>
          <p className="text-sm text-slate-600">Revenue generated per rupee spent on rewards.</p>
        </div>
        
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm border-l-4 border-l-rose-500">
          <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-2">Reward Liability</h3>
          <div className="flex items-end gap-3 mb-4">
            <p className="text-3xl font-bold text-slate-900">₹{liability.financial_liability.toLocaleString()}</p>
          </div>
          <p className="text-sm text-slate-600">Representing {liability.total_unredeemed_points.toLocaleString()} unredeemed points in the ecosystem.</p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
          <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-2">Redemption Rate</h3>
          <div className="flex items-end gap-3 mb-4">
            <p className="text-3xl font-bold text-slate-900">42%</p>
            <span className="flex items-center text-sm font-medium text-emerald-600 mb-1">
              <TrendingUp className="w-4 h-4" /> 2%
            </span>
          </div>
          <p className="text-sm text-slate-600">Percentage of issued points that have been redeemed.</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <h2 className="font-bold text-slate-900">Points Issuance vs Redemption</h2>
          <button className="text-sm font-medium text-blue-600">View Data Table</button>
        </div>
        <div className="p-8 h-80 border-b border-slate-100">
          {loading ? (
            <div className="h-full flex items-center justify-center text-slate-400">Loading chart...</div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorIssued" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorRedeemed" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <Tooltip 
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Area type="monotone" dataKey="issued" stroke="#3b82f6" fillOpacity={1} fill="url(#colorIssued)" name="Points Issued" />
                <Area type="monotone" dataKey="redeemed" stroke="#10b981" fillOpacity={1} fill="url(#colorRedeemed)" name="Points Redeemed" />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
      
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <h3 className="font-bold text-slate-900 mb-6">Popular Rewards</h3>
          <div className="space-y-4">
            {[
              { name: '₹500 Cashback', count: 142, percent: 85 },
              { name: '10% Off Next Order', count: 86, percent: 50 },
              { name: 'Premium Dealer Kit', count: 24, percent: 15 },
            ].map((item, i) => (
              <div key={i}>
                <div className="flex justify-between text-sm font-medium mb-1.5">
                  <span className="text-slate-700">{item.name}</span>
                  <span className="text-slate-900">{item.count} redeems</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-blue-500 h-full rounded-full" style={{ width: `${item.percent}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <h3 className="font-bold text-slate-900 mb-6">Tier Distribution</h3>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-6 mt-4">
            <div className="flex items-center gap-2 text-sm"><span className="w-3 h-3 rounded-full bg-slate-200"></span> Silver (60%)</div>
            <div className="flex items-center gap-2 text-sm"><span className="w-3 h-3 rounded-full bg-amber-200"></span> Gold (25%)</div>
            <div className="flex items-center gap-2 text-sm"><span className="w-3 h-3 rounded-full bg-slate-900"></span> Platinum (15%)</div>
          </div>
        </div>
      </div>
    </div>
  );
}
