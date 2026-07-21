'use client';

import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { 
  BarChart3, Download, Calendar, ArrowUpRight, TrendingUp, 
  AlertCircle, Award, Landmark, RefreshCw, Layers, ShieldAlert,
  Zap, Info, Users, Clock, Gift
} from 'lucide-react';
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
    if (typeof window !== 'undefined' && !localStorage.getItem('token')) {
      return;
    }
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
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white border border-slate-200 p-6 rounded-2xl shadow-sm">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-indigo-600 animate-pulse" />
            <span>Analytics &amp; Reports</span>
          </h1>
          <p className="text-sm text-slate-500 mt-1">Deep dive into loyalty points liability, spend thresholds, and sales partner commissions.</p>
        </div>
        <button 
          onClick={fetchAnalytics}
          className="bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 px-4 py-2.5 rounded-xl text-xs font-bold transition-all shadow-sm flex items-center gap-2 shrink-0 self-stretch sm:self-auto text-center justify-center"
        >
          <RefreshCw className="w-3.5 h-3.5" /> Refresh Reports
        </button>
      </div>

      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-sm font-semibold text-rose-800">{error}</div>
      )}

      {/* KPI row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* ROI Card */}
        <div className="group bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1.5 font-semibold">Program ROI</p>
              <h3 className="text-3xl font-black text-slate-950 tracking-tight">4.5x</h3>
            </div>
            <div className="p-2.5 rounded-xl bg-blue-50 border border-blue-100 text-blue-600 transition-transform group-hover:scale-110 duration-200">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-2">
            <span className="inline-flex items-center gap-0.5 text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">
              <ArrowUpRight className="w-3 h-3" /> +14% YoY
            </span>
            <p className="text-[11px] text-slate-500 font-medium">Revenue generated per Rupee paid.</p>
          </div>
        </div>
        
        {/* Liability Card */}
        <div className="group bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all border-l-4 border-l-purple-500 flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1.5 font-semibold">Reward Liability</p>
              <h3 className="text-3xl font-black text-slate-950 tracking-tight">
                ₹{liability.financial_liability.toLocaleString()}
              </h3>
            </div>
            <div className="p-2.5 rounded-xl bg-purple-50 border border-purple-100 text-purple-600 transition-transform group-hover:scale-110 duration-200">
              <Landmark className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <p className="text-xs text-purple-700 bg-purple-50/50 px-2 py-1 rounded border border-purple-100 font-semibold inline-block">
              {liability.total_unredeemed_points.toLocaleString()} unredeemed pts in system
            </p>
          </div>
        </div>

        {/* Redemption Rate Card */}
        <div className="group bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1.5 font-semibold">Redemption Rate</p>
              <h3 className="text-3xl font-black text-slate-950 tracking-tight">45%</h3>
            </div>
            <div className="p-2.5 rounded-xl bg-indigo-50 border border-indigo-100 text-indigo-600 transition-transform group-hover:scale-110 duration-200">
              <Gift className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-2">
            <span className="inline-flex items-center gap-0.5 text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">
              <ArrowUpRight className="w-3 h-3" /> +3%
            </span>
            <p className="text-[11px] text-slate-500 font-medium">Percentage of total rewards claimed.</p>
          </div>
        </div>
      </div>

      {/* Main Charts & Top Buyers Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Recharts Area Chart Card */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col justify-between">
          <div className="p-5 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Reward Issuance vs. Redemption Trends</h3>
              <p className="text-xs text-slate-400 font-medium mt-0.5">Historical monthly trends of credits versus cash claims.</p>
            </div>
            <div className="flex gap-3 text-[11px] font-bold">
              <span className="flex items-center gap-1 text-blue-600">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-500 inline-block" /> Issued
              </span>
              <span className="flex items-center gap-1 text-emerald-600">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" /> Redeemed
              </span>
            </div>
          </div>
          
          <div className="p-6 h-80">
            {loading ? (
              <div className="h-full flex items-center justify-center text-slate-400">
                <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorIssued" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorRedeemed" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="name" stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} tickMargin={8} />
                  <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} tickMargin={8} />
                  <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="#e2e8f0" />
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.05)', fontFamily: 'sans-serif', fontSize: '12px' }}
                    labelClassName="font-bold text-slate-800"
                  />
                  <Area type="monotone" dataKey="issued" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#colorIssued)" name="Issued" />
                  <Area type="monotone" dataKey="redeemed" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#colorRedeemed)" name="Redeemed" />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Top Buyers Leaderboard */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-slate-900 text-sm mb-1 flex items-center gap-1.5">
              <Award className="w-5 h-5 text-indigo-600 animate-bounce" /> 
              <span>Top Buyer Leaderboard</span>
            </h3>
            <p className="text-xs text-slate-400 font-medium mb-4">Top reward accumulators in the portal.</p>
          </div>

          <div className="space-y-3.5 flex-1 flex flex-col justify-center">
            {loading ? (
              <p className="text-xs text-slate-400 italic text-center py-8">Loading top buyers...</p>
            ) : topBuyers.length === 0 ? (
              <p className="text-xs text-slate-400 italic text-center py-8">No buyers found.</p>
            ) : (
              topBuyers.map((buyer: any, i: number) => {
                const medals = ['bg-amber-400 text-white font-black', 'bg-slate-300 text-white font-black', 'bg-orange-400 text-white font-black'];
                return (
                  <div key={buyer.id} className="flex items-center justify-between border-b border-slate-50 pb-3 last:border-0 last:pb-0 hover:bg-slate-50/50 p-1.5 rounded-xl transition-all">
                    <div className="flex items-center gap-3">
                      <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs shrink-0 ${
                        i < 3 ? medals[i] : 'bg-slate-100 text-slate-500 font-semibold'
                      }`}>
                        {i + 1}
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-900 leading-none">{buyer.name}</p>
                        <span className={`inline-block text-[9px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider mt-1.5 ${
                          buyer.tier === 'Platinum' ? 'bg-slate-900 text-slate-100' :
                          buyer.tier === 'Gold' ? 'bg-amber-100 text-amber-800' :
                          'bg-slate-100 text-slate-600'
                        }`}>
                          {buyer.tier}
                        </span>
                      </div>
                    </div>
                    <div className="font-black text-xs text-slate-950 font-mono">{buyer.total_points.toLocaleString()} pts</div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* Spend thresholds and Rep Payouts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* High-Purchase Spend Thresholds */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col">
          <div className="mb-4">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
              <AlertCircle className="w-5 h-5 text-indigo-600" /> 
              <span>High-Purchase Spend Thresholds</span>
            </h3>
            <p className="text-xs text-slate-400 font-medium mt-0.5">Spend tracked relative to the ₹200k monthly spend threshold limit.</p>
          </div>

          <div className="space-y-4 max-h-[350px] overflow-y-auto pr-1 flex-1 custom-scrollbar">
            {loading ? (
              <p className="text-xs text-slate-400 italic text-center py-8">Loading threshold monitoring...</p>
            ) : approaching.length === 0 ? (
              <p className="text-xs text-slate-400 italic text-center py-8">No spend entries logged for this month.</p>
            ) : (
              approaching.map((cust: any) => (
                <div key={cust.id} className="space-y-2 border border-slate-100 p-3 rounded-2xl bg-slate-50/30">
                  <div className="flex justify-between items-center text-xs font-semibold">
                    <div>
                      <span className="text-slate-900 font-bold block">{cust.name}</span>
                      <span className="text-[10px] text-slate-400 font-medium">{cust.email}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-slate-950 font-black font-mono">₹{cust.monthly_spend.toLocaleString()}</span>
                      <span className="text-slate-400 text-[10px]"> / ₹{cust.threshold.toLocaleString()}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="flex-1 bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full transition-all duration-500 ${
                          cust.percentage >= 100 ? 'bg-emerald-500' : cust.percentage >= 75 ? 'bg-amber-500' : 'bg-blue-500'
                        }`}
                        style={{ width: `${cust.percentage}%` }}
                      ></div>
                    </div>
                    <span className={`text-[10px] font-black w-8 text-right font-mono ${
                      cust.percentage >= 100 ? 'text-emerald-600' : 'text-slate-500'
                    }`}>
                      {cust.percentage.toFixed(0)}%
                    </span>
                  </div>

                  <div className="flex justify-between items-center text-[10px] font-bold mt-1">
                    {cust.percentage >= 100 ? (
                      <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">
                        🎉 Qualifies for Bonus! (+500 pts)
                      </span>
                    ) : (
                      <span className="text-slate-400 font-medium">
                        Progress toward spend multiplier bonus
                      </span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Rep Monthly payouts summaries */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col">
          <div className="mb-4">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
              <Landmark className="w-5 h-5 text-purple-600 animate-pulse" /> 
              <span>Sales Partner Payouts by Month</span>
            </h3>
            <p className="text-xs text-slate-400 font-medium mt-0.5">Commissions credited to sales partners by calendar period.</p>
          </div>

          <div className="space-y-3.5 max-h-[350px] overflow-y-auto pr-1 flex-1 custom-scrollbar">
            {loading ? (
              <p className="text-xs text-slate-400 italic text-center py-8">Loading payout summaries...</p>
            ) : payouts.length === 0 ? (
              <div className="border border-slate-200 border-dashed rounded-2xl p-6 text-center text-slate-400 flex flex-col items-center justify-center gap-2">
                <Landmark className="w-8 h-8 opacity-45" />
                <p className="text-xs font-semibold">No sales partner commission log recorded</p>
              </div>
            ) : (
              payouts.map((pay: any, i: number) => (
                <div key={i} className="flex justify-between items-center border border-slate-100 p-3.5 rounded-2xl hover:bg-slate-50/50 transition-colors">
                  <div>
                    <p className="text-xs font-bold text-slate-950">{pay.rep_name}</p>
                    <p className="text-[10px] text-slate-400 font-normal mt-1 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>Commission Month: </span>
                      <strong className="text-purple-600 font-bold font-mono">{pay.month}</strong>
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-black text-emerald-600 font-mono">+{pay.commission_points.toLocaleString()} pts</p>
                    <p className="text-[10px] text-slate-400 font-bold font-mono mt-0.5">₹{pay.amount_rupees.toLocaleString()}</p>
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
