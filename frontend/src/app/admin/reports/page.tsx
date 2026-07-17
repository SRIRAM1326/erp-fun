'use client';

import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { BarChart3, Download, Calendar, ArrowUpRight, TrendingUp, AlertCircle, Award, Landmark, RefreshCw } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function AdminReportsPage() {
  const [liability, setLiability] = useState<any>({ total_unredeemed_points: 0, financial_liability: 0 });
  const [chartData, setChartData] = useState<any[]>([]);
  const [topBuyers, setTopBuyers] = useState<any[]>([]);
  const [approaching, setApproaching] = useState<any[]>([]);
  const [payouts, setPayouts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchAnalytics = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await api.get('/admin/reports/analytics');
      setLiability(res.data.liability);
      setChartData(res.data.chart_data);
      setTopBuyers(res.data.top_buyers);
      setApproaching(res.data.approaching_customers);
      setPayouts(res.data.payout_summaries);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch analytics report data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Analytics &amp; Reports</h1>
          <p className="text-sm text-slate-500 mt-1">Deep dive into loyalty points liability, spend thresholds, and representative commissions.</p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={fetchAnalytics}
            className="bg-white border border-slate-200 text-slate-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-50 flex items-center gap-2 shadow-sm"
          >
            <RefreshCw className="w-4 h-4" /> Refresh Data
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-sm font-semibold text-rose-800">{error}</div>
      )}

      {/* KPI row */}
      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
          <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-2">Program ROI</h3>
          <div className="flex items-end gap-3 mb-4">
            <p className="text-3xl font-bold text-slate-900">4.5x</p>
            <span className="flex items-center text-sm font-medium text-emerald-600 mb-1">
              <ArrowUpRight className="w-4 h-4" /> 14%
            </span>
          </div>
          <p className="text-sm text-slate-600">Revenue generated per rupee spent on reward payouts.</p>
        </div>
        
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm border-l-4 border-l-purple-500">
          <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-2">Reward Liability</h3>
          <div className="flex items-end gap-3 mb-4">
            <p className="text-3xl font-bold text-slate-900">₹{liability.financial_liability.toLocaleString()}</p>
          </div>
          <p className="text-sm text-slate-600">Representing {liability.total_unredeemed_points.toLocaleString()} unredeemed points in the ecosystem.</p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
          <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-2">Redemption Rate</h3>
          <div className="flex items-end gap-3 mb-4">
            <p className="text-3xl font-bold text-slate-900">45%</p>
            <span className="flex items-center text-sm font-medium text-emerald-600 mb-1">
              <TrendingUp className="w-4 h-4" /> 3%
            </span>
          </div>
          <p className="text-sm text-slate-600">Percentage of issued points successfully claimed.</p>
        </div>
      </div>

      {/* Main Charts area */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* area Chart */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden lg:col-span-2">
          <div className="p-5 border-b border-slate-100 bg-slate-50/50">
            <h3 className="font-bold text-slate-900">Points Issuance vs Redemption</h3>
            <p className="text-xs text-slate-500 mt-0.5">Historical trend showing points credits versus claimed cash transfers.</p>
          </div>
          <div className="p-6 h-80">
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
                  <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
                  <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
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

        {/* Top Buyers */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
          <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-1.5"><Award className="w-5 h-5 text-blue-600" /> Top Buyers (Points)</h3>
          <div className="space-y-4">
            {loading ? (
              <p className="text-xs text-slate-400 italic text-center py-8">Loading top buyers...</p>
            ) : topBuyers.length === 0 ? (
              <p className="text-xs text-slate-400 italic text-center py-8">No buyers found.</p>
            ) : (
              topBuyers.map((buyer, i) => (
                <div key={buyer.id} className="flex items-center justify-between border-b border-slate-50 pb-3 last:border-0 last:pb-0">
                  <div className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-600">
                      {i + 1}
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-slate-900">{buyer.name}</p>
                      <p className="text-[10px] text-slate-500 font-medium">Tier: {buyer.tier}</p>
                    </div>
                  </div>
                  <div className="font-black text-xs text-slate-900">{buyer.total_points.toLocaleString()} pts</div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Spend thresholds and Rep Payouts */}
      <div className="grid lg:grid-cols-2 gap-6">
        
        {/* Approaches Spend thresholds */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-4">
          <h3 className="font-bold text-slate-900 flex items-center gap-1.5"><AlertCircle className="w-5 h-5 text-indigo-600" /> High-Purchase Spend Thresholds</h3>
          <p className="text-xs text-slate-500">Monitor buyer spend totals during the current month relative to the high spend bonus limit.</p>

          <div className="space-y-4 max-h-[300px] overflow-y-auto pr-1">
            {loading ? (
              <p className="text-xs text-slate-400 italic text-center py-6">Loading threshold monitoring...</p>
            ) : approaching.length === 0 ? (
              <p className="text-xs text-slate-400 italic text-center py-6">No spend entries logged for this month.</p>
            ) : (
              approaching.map((cust) => (
                <div key={cust.id} className="space-y-1.5 border border-slate-50 p-3 rounded-lg bg-slate-50/20">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-slate-900">{cust.name}</span>
                    <span className="text-slate-500">₹{cust.monthly_spend.toLocaleString()} / ₹{cust.threshold.toLocaleString()}</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all ${
                        cust.percentage >= 100 ? 'bg-indigo-600' : cust.percentage >= 75 ? 'bg-amber-500' : 'bg-blue-500'
                      }`}
                      style={{ width: `${cust.percentage}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-[10px] text-slate-400 font-semibold">
                    <span>{cust.email}</span>
                    <span className={cust.percentage >= 100 ? 'text-indigo-600 font-bold' : cust.percentage >= 75 ? 'text-amber-600 font-bold' : ''}>
                      {cust.percentage >= 100 ? 'Qualifies for Bonus!' : `${cust.percentage.toFixed(0)}% reached`}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Rep Monthly payouts summaries */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-4">
          <h3 className="font-bold text-slate-900 flex items-center gap-1.5"><Landmark className="w-5 h-5 text-purple-600" /> Representative Payouts by Month</h3>
          <p className="text-xs text-slate-500">Summary of 1.0% commissions issued to marketing representatives by month.</p>

          <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
            {loading ? (
              <p className="text-xs text-slate-400 italic text-center py-6">Loading payout summaries...</p>
            ) : payouts.length === 0 ? (
              <p className="text-xs text-slate-400 italic text-center py-6 font-medium">No sales commissions issued yet.</p>
            ) : (
              payouts.map((pay, i) => (
                <div key={i} className="flex justify-between items-center border border-slate-100 p-3 rounded-lg hover:bg-slate-50/50 transition-colors">
                  <div>
                    <p className="text-xs font-bold text-slate-950">{pay.rep_name}</p>
                    <p className="text-[10px] text-slate-500 font-normal mt-0.5">Month: <span className="font-semibold text-purple-600 font-mono">{pay.month}</span></p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-black text-emerald-600">+{pay.commission_points.toLocaleString()} pts</p>
                    <p className="text-[10px] text-slate-400 font-semibold mt-0.5">₹{pay.amount_rupees.toLocaleString()}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
