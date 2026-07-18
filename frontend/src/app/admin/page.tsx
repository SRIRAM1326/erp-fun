'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { 
  Users, QrCode, ShoppingCart, Award, Gift, Clock, 
  TrendingUp, BarChart3, Star, ArrowUpRight, Zap, 
  AlertTriangle, Calendar, Activity, ChevronRight 
} from 'lucide-react';
import Link from 'next/link';

export default function AdminDashboard() {
  const [buyers, setBuyers] = useState<any[]>([]);
  const [analytics, setAnalytics] = useState<any>(null);
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Interactive Chart state
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const [greeting, setGreeting] = useState('Welcome back');

  useEffect(() => {
    // Dynamic greeting based on local time
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good morning');
    else if (hour < 18) setGreeting('Good afternoon');
    else setGreeting('Good evening');

    const fetchData = async () => {
      try {
        const [buyersRes, analyticsRes, campaignsRes] = await Promise.all([
          api.get('/admin/buyers'),
          api.get('/admin/reports/analytics'),
          api.get('/admin/campaigns'),
        ]);
        setBuyers(buyersRes.data);
        setAnalytics(analyticsRes.data);
        setCampaigns(campaignsRes.data);
      } catch (err) {
        console.error('Error fetching admin dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-[70vh] gap-3">
        <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-sm font-semibold text-slate-500 animate-pulse">Assembling dashboard analytics...</p>
      </div>
    );
  }

  // Calculate dynamic stats
  const totalPoints = buyers.reduce((acc, b) => acc + (b.total_points || 0), 0);
  const totalLiability = analytics?.liability?.financial_liability ?? totalPoints;
  const activeBuyers = buyers.length;
  
  const chartData = analytics?.chart_data || [
    { name: '2026-05', issued: 4000, redeemed: 1200 },
    { name: '2026-06', issued: 6500, redeemed: 2500 },
    { name: '2026-07', issued: 12000, redeemed: 4800 }
  ];

  const topBuyers = analytics?.top_buyers || buyers
    .map(b => ({
      id: b.id,
      name: b.business_name || b.name,
      total_points: b.total_points || 0,
      tier: b.tier || 'Silver'
    }))
    .sort((a, b) => b.total_points - a.total_points)
    .slice(0, 5);

  const approachingCustomers = analytics?.approaching_customers || [];
  const repPayouts = analytics?.payout_summaries || [];
  const activeCampaigns = campaigns.filter(c => c.status === 'active');

  // Chart setup configurations
  const chartWidth = 600;
  const chartHeight = 240;
  const chartPadding = { left: 45, right: 15, top: 15, bottom: 30 };
  
  const maxVal = Math.max(
    ...chartData.map((d: any) => Math.max(d.issued, d.redeemed, 1000))
  ) * 1.15; // 15% padding top

  const getX = (idx: number) => {
    const usableWidth = chartWidth - chartPadding.left - chartPadding.right;
    return chartPadding.left + (idx / (chartData.length - 1)) * usableWidth;
  };

  const getY = (val: number) => {
    const usableHeight = chartHeight - chartPadding.top - chartPadding.bottom;
    return chartHeight - chartPadding.bottom - (val / maxVal) * usableHeight;
  };

  // Build SVG Paths for Area Fill and Lines
  const issuedLinePoints = chartData.map((d: any, i: number) => `${getX(i)},${getY(d.issued)}`).join(' ');
  const redeemedLinePoints = chartData.map((d: any, i: number) => `${getX(i)},${getY(d.redeemed)}`).join(' ');

  const issuedAreaPoints = `${getX(0)},${getY(0)} ${issuedLinePoints} ${getX(chartData.length - 1)},${getY(0)}`;
  const redeemedAreaPoints = `${getX(0)},${getY(0)} ${redeemedLinePoints} ${getX(chartData.length - 1)},${getY(0)}`;

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      
      {/* Header section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white border border-slate-200 p-6 rounded-2xl shadow-sm">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <span>{greeting}, Admin User</span>
            <span className="animate-bounce">👋</span>
          </h1>
          <p className="text-sm text-slate-500 font-medium mt-1">Here is a real-time health check of your B2B loyalty network.</p>
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <Link href="/admin/config" className="flex-1 text-center md:flex-none bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 px-4 py-2.5 rounded-xl text-xs font-bold transition-all shadow-sm">
            Configure Rules
          </Link>
          <Link href="/admin/buyers" className="flex-1 text-center md:flex-none bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl text-xs font-bold transition-all shadow-sm">
            Manage Buyers
          </Link>
        </div>
      </div>

      {/* Stats KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { title: 'Total Buyers', value: buyers.length, subtitle: 'Registered shops', icon: Users, color: 'text-blue-600', bg: 'bg-blue-50 border-blue-100', textAccent: 'text-blue-700' },
          { title: 'Outstanding Liability', value: `₹${totalLiability.toLocaleString()}`, subtitle: '1 pt = ₹1 liability', icon: AlertTriangle, color: 'text-amber-600', bg: 'bg-amber-50 border-amber-100', textAccent: 'text-amber-700' },
          { title: 'All-Time Points Issued', value: totalPoints.toLocaleString(), subtitle: 'Credited commissions & scans', icon: QrCode, color: 'text-emerald-600', bg: 'bg-emerald-50 border-emerald-100', textAccent: 'text-emerald-700' },
          { title: 'Redemption Requests', value: analytics?.payout_summaries?.length || 0, subtitle: 'Pending rep & buyer claims', icon: Gift, color: 'text-purple-600', bg: 'bg-purple-50 border-purple-100', textAccent: 'text-purple-700' },
        ].map((card, i) => (
          <div key={i} className="group bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all flex items-start gap-4">
            <div className={`p-3 rounded-xl ${card.bg} border shrink-0 transition-transform group-hover:scale-110 duration-200`}>
              <card.icon className={`w-6 h-6 ${card.color}`} />
            </div>
            <div className="min-w-0">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1.5">{card.title}</p>
              <p className="text-2xl font-black text-slate-900 leading-tight">{card.value}</p>
              <p className="text-[11px] text-slate-500 font-medium mt-1 leading-none truncate">{card.subtitle}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Main Charts and Leaderboard Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* SVG Area Chart */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Reward Issuance vs. Redemption</h3>
              <p className="text-xs text-slate-400 font-medium mt-0.5">Aggregated monthly credit/debit activity comparison.</p>
            </div>
            
            <div className="flex gap-3 text-xs font-semibold">
              <span className="flex items-center gap-1.5 text-slate-500">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" /> Issued
              </span>
              <span className="flex items-center gap-1.5 text-slate-500">
                <span className="w-2.5 h-2.5 rounded-full bg-purple-500 inline-block" /> Redeemed
              </span>
            </div>
          </div>

          {/* SVG Chart Rendering */}
          <div className="relative flex-1 mt-2">
            <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="w-full h-auto overflow-visible select-none">
              <defs>
                <linearGradient id="issuedGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10b981" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
                </linearGradient>
                <linearGradient id="redeemedGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Horizontal Gridlines */}
              {[0, 0.25, 0.5, 0.75, 1].map((p, i) => {
                const val = maxVal * p;
                const y = getY(val);
                return (
                  <g key={i} className="opacity-40">
                    <line 
                      x1={chartPadding.left} 
                      y1={y} 
                      x2={chartWidth - chartPadding.right} 
                      y2={y} 
                      stroke="#cbd5e1" 
                      strokeWidth="1" 
                      strokeDasharray="4 4" 
                    />
                    <text 
                      x={chartPadding.left - 8} 
                      y={y + 3} 
                      textAnchor="end" 
                      className="text-[9px] font-bold fill-slate-400 font-mono"
                    >
                      {val >= 1000 ? `${(val / 1000).toFixed(0)}k` : val.toFixed(0)}
                    </text>
                  </g>
                );
              })}

              {/* Month X-axis labels */}
              {chartData.map((d: any, i: number) => (
                <text 
                  key={i} 
                  x={getX(i)} 
                  y={chartHeight - 10} 
                  textAnchor="middle" 
                  className="text-[9px] font-bold fill-slate-400"
                >
                  {d.name}
                </text>
              ))}

              {/* Filled Areas */}
              <polygon points={issuedAreaPoints} fill="url(#issuedGrad)" />
              <polygon points={redeemedAreaPoints} fill="url(#redeemedGrad)" />

              {/* Stroke Lines */}
              <polyline points={issuedLinePoints} fill="none" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" />
              <polyline points={redeemedLinePoints} fill="none" stroke="#8b5cf6" strokeWidth="2.5" strokeLinecap="round" />

              {/* Interactive Tooltip Columns */}
              {chartData.map((d: any, i: number) => {
                const x = getX(i);
                const usableWidth = chartWidth - chartPadding.left - chartPadding.right;
                const colWidth = usableWidth / chartData.length;
                return (
                  <rect
                    key={i}
                    x={x - colWidth / 2}
                    y={chartPadding.top}
                    width={colWidth}
                    height={chartHeight - chartPadding.top - chartPadding.bottom}
                    fill="transparent"
                    className="cursor-pointer"
                    onMouseEnter={() => setHoveredIdx(i)}
                    onMouseLeave={() => setHoveredIdx(null)}
                  />
                );
              })}

              {/* Hover Indicator Vertical Line & Circle Pins */}
              {hoveredIdx !== null && (
                <g pointerEvents="none">
                  <line 
                    x1={getX(hoveredIdx)} 
                    y1={chartPadding.top} 
                    x2={getX(hoveredIdx)} 
                    y2={chartHeight - chartPadding.bottom} 
                    stroke="#94a3b8" 
                    strokeWidth="1.5" 
                    strokeDasharray="3 3" 
                  />
                  <circle cx={getX(hoveredIdx)} cy={getY(chartData[hoveredIdx].issued)} r="5" fill="#10b981" stroke="#fff" strokeWidth="2" />
                  <circle cx={getX(hoveredIdx)} cy={getY(chartData[hoveredIdx].redeemed)} r="5" fill="#8b5cf6" stroke="#fff" strokeWidth="2" />
                </g>
              )}
            </svg>
          </div>

          {/* Interactive Tooltip Card */}
          <div className="h-12 bg-slate-50 border border-slate-100 rounded-xl px-4 flex items-center justify-between text-xs font-semibold text-slate-500 mt-2">
            {hoveredIdx !== null ? (
              <>
                <span>Month: <strong className="text-slate-800">{chartData[hoveredIdx].name}</strong></span>
                <span className="flex items-center gap-1">Issued: <strong className="text-emerald-600 text-sm">+{chartData[hoveredIdx].issued.toLocaleString()} pts</strong></span>
                <span className="flex items-center gap-1">Redeemed: <strong className="text-purple-600 text-sm">-{chartData[hoveredIdx].redeemed.toLocaleString()} pts</strong></span>
              </>
            ) : (
              <span className="text-slate-400 italic text-center w-full">Hover over the chart lines to view metrics</span>
            )}
          </div>
        </div>

        {/* Top Buyers Leaderboard */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-bold text-slate-900 text-sm">Top Buyer Leaderboard</h3>
              <Link href="/admin/buyers" className="text-xs font-bold text-blue-600 hover:underline">View All</Link>
            </div>
            <p className="text-xs text-slate-400 font-medium mb-4">Highest points accumulators in your network.</p>
          </div>

          <div className="space-y-3.5 flex-1 flex flex-col justify-center">
            {topBuyers.map((buyer: any, i: number) => {
              const rankMedals = ['bg-amber-400 text-white font-black', 'bg-slate-300 text-white font-black', 'bg-orange-400 text-white font-black'];
              return (
                <div key={buyer.id} className="flex items-center justify-between p-2 rounded-xl hover:bg-slate-50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs shrink-0 ${
                      i < 3 ? rankMedals[i] : 'bg-slate-100 text-slate-500 font-semibold'
                    }`}>
                      {i + 1}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-900 leading-tight">{buyer.name}</p>
                      <span className={`inline-block text-[9px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider mt-0.5 ${
                        buyer.tier === 'Platinum' ? 'bg-slate-900 text-slate-100' :
                        buyer.tier === 'Gold' ? 'bg-amber-100 text-amber-800' :
                        'bg-slate-100 text-slate-600'
                      }`}>
                        {buyer.tier}
                      </span>
                    </div>
                  </div>
                  <div className="text-xs font-black text-slate-900 font-mono">
                    {buyer.total_points.toLocaleString()} pts
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Milestones & Rep Payouts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Milestone Threshold Tracker */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col">
          <div className="mb-4">
            <h3 className="font-bold text-slate-900 text-sm">Monthly Threshold Milestones</h3>
            <p className="text-xs text-slate-400 font-medium mt-0.5">Buyers approaching the high-spend bonus tier (₹200,000 threshold).</p>
          </div>
          
          <div className="divide-y divide-slate-100 flex-1 overflow-y-auto max-h-72 custom-scrollbar pr-1">
            {approachingCustomers.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 text-slate-400">
                <Award className="w-8 h-8 opacity-45 mb-2" />
                <p className="text-xs italic">No buyers recorded transactions for this month yet.</p>
              </div>
            ) : (
              approachingCustomers.map((cust: any) => {
                const remaining = cust.threshold - cust.monthly_spend;
                return (
                  <div key={cust.id} className="py-3.5 space-y-2">
                    <div className="flex justify-between items-center text-xs">
                      <div>
                        <p className="font-bold text-slate-900">{cust.name}</p>
                        <p className="text-[10px] text-slate-400 font-medium">{cust.email}</p>
                      </div>
                      <div className="text-right">
                        <span className="font-black text-slate-900 font-mono">₹{cust.monthly_spend.toLocaleString()}</span>
                        <span className="text-slate-400 font-medium"> / ₹{(cust.threshold/1000).toFixed(0)}k</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <div className="flex-1 bg-slate-100 h-2 rounded-full overflow-hidden">
                        <div 
                          className="bg-blue-600 h-full rounded-full transition-all duration-500" 
                          style={{ width: `${cust.percentage}%` }}
                        />
                      </div>
                      <span className="text-[10px] font-black text-blue-700 font-mono shrink-0 w-8 text-right">
                        {cust.percentage.toFixed(0)}%
                      </span>
                    </div>

                    <div className="flex justify-between items-center text-[10px] font-semibold">
                      {remaining > 0 ? (
                        <span className="text-amber-600 bg-amber-50 px-2 py-0.5 rounded border border-amber-100">
                          ₹{remaining.toLocaleString()} remaining to unlock +500 pts
                        </span>
                      ) : (
                        <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100 font-bold">
                          🎉 Threshold met! +500 pts unlocked
                        </span>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Marketing Rep Commissions */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col">
          <div className="mb-4">
            <h3 className="font-bold text-slate-900 text-sm">Rep Commissions</h3>
            <p className="text-xs text-slate-400 font-medium mt-0.5">Marketing representative payouts for this month.</p>
          </div>

          <div className="divide-y divide-slate-100 flex-1 overflow-y-auto max-h-72 custom-scrollbar">
            {repPayouts.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 text-slate-400">
                <Award className="w-8 h-8 opacity-45 mb-2" />
                <p className="text-xs italic">No commissions calculated for this period.</p>
              </div>
            ) : (
              repPayouts.map((rep: any, i: number) => (
                <div key={i} className="py-3 flex justify-between items-center">
                  <div>
                    <p className="text-xs font-bold text-slate-900">{rep.rep_name}</p>
                    <p className="text-[9px] font-semibold text-slate-400 uppercase tracking-widest mt-0.5">{rep.month}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-black text-emerald-600 font-mono">+{rep.commission_points.toLocaleString()} pts</p>
                    <p className="text-[10px] text-slate-400 font-semibold font-mono">₹{rep.amount_rupees.toLocaleString()}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Third Row: Recent Activity Feed & Active Campaigns */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Activity Feed */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
          <div className="p-6 border-b border-slate-100 flex justify-between items-center">
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Recent Buyer Activity</h3>
              <p className="text-xs text-slate-400 font-medium mt-0.5">Audit log of system scans and redemptions.</p>
            </div>
            <Link href="/admin/audit" className="text-xs font-bold text-blue-600 hover:underline">Full Log</Link>
          </div>
          
          <div className="divide-y divide-slate-100 flex-1">
            {[
              { buyer: 'Wholesale Traders Ltd', action: 'scanned QR', detail: 'and earned 300 points', time: '10 mins ago', icon: QrCode, color: 'text-emerald-600', bg: 'bg-emerald-50' },
              { buyer: 'Apex Distributors', action: 'redeemed points', detail: 'for ₹500 Cashback Reward', time: '2 hours ago', icon: Gift, color: 'text-purple-600', bg: 'bg-purple-50' },
              { buyer: 'Global Imports', action: 'qualified', detail: 'for Goa Trip Milestone', time: '5 hours ago', icon: Star, color: 'text-amber-600', bg: 'bg-amber-50' },
              { buyer: 'Ramesh Agencies', action: 'scanned QR', detail: 'and earned 150 points', time: '1 day ago', icon: QrCode, color: 'text-emerald-600', bg: 'bg-emerald-50' },
            ].map((activity: any, i: number) => (
              <div key={i} className="p-4 flex gap-4 hover:bg-slate-50 transition-colors items-start">
                <div className={`mt-0.5 p-2 rounded-xl ${activity.bg} shrink-0`}>
                  <activity.icon className={`w-4 h-4 ${activity.color}`} />
                </div>
                <div className="min-w-0">
                  <p className="text-xs text-slate-700 leading-normal">
                    <span className="font-bold text-slate-900">{activity.buyer}</span> {activity.action} <span className="font-bold text-slate-900">{activity.detail}</span>
                  </p>
                  <p className="text-[10px] text-slate-400 font-semibold mt-1 flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {activity.time}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Active Campaigns */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
          <div className="p-6 border-b border-slate-100">
            <h3 className="font-bold text-slate-900 text-sm">Active Loyalty Campaigns</h3>
            <p className="text-xs text-slate-400 font-medium mt-0.5">Current point multipliers and target incentives.</p>
          </div>
          
          <div className="p-6 space-y-4 flex-1">
            {activeCampaigns.length === 0 ? (
              <div className="border border-slate-200 border-dashed rounded-2xl p-6 text-center text-slate-400 flex flex-col items-center justify-center gap-2">
                <Calendar className="w-8 h-8 opacity-45" />
                <p className="text-xs font-semibold">No active campaigns scheduled</p>
                <p className="text-[10px] text-slate-400">Manage campaign dates on the settings page.</p>
              </div>
            ) : (
              activeCampaigns.map((camp: any) => {
                const diffTime = Math.abs(new Date(camp.end_date).getTime() - new Date().getTime());
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                return (
                  <div key={camp.id} className="border border-slate-100 bg-slate-50 rounded-2xl p-4 space-y-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-bold text-slate-900 text-xs leading-none">{camp.name}</h4>
                        <span className="inline-flex items-center gap-0.5 text-[9px] font-black text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-100 uppercase tracking-wider mt-1.5">
                          <Zap className="w-2.5 h-2.5" /> {camp.multiplier}× Multiplier
                        </span>
                      </div>
                      <span className="bg-emerald-100 text-emerald-800 text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider border border-emerald-200">
                        Active
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 font-medium leading-relaxed">
                      All scans and linked invoices qualify for a {camp.multiplier}× reward point multiplier!
                    </p>
                    <div className="flex justify-between items-center text-[10px] text-slate-400 font-semibold border-t border-slate-100 pt-2 leading-none">
                      <span>Starts: {new Date(camp.start_date).toLocaleDateString()}</span>
                      <span className="text-blue-600">Ends in {diffDays} days</span>
                    </div>
                  </div>
                );
              })
            )}

            {/* Default dealer incentive indicator card */}
            <div className="border border-slate-100 bg-slate-50/50 rounded-2xl p-4 space-y-3">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-bold text-slate-900 text-xs leading-none">Annual Dealer Trip</h4>
                  <span className="inline-flex items-center gap-0.5 text-[9px] font-black text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded border border-indigo-100 uppercase tracking-wider mt-1.5">
                    Premium Tier
                  </span>
                </div>
                <span className="bg-blue-50 text-blue-700 text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider border border-blue-100">
                  Long Term
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium leading-relaxed">
                Qualified platinum dealers progress toward the annual premium dealership international retreat milestone.
              </p>
              <div className="flex justify-between items-center text-[10px] text-slate-400 font-semibold border-t border-slate-100 pt-2 leading-none">
                <span>Total qualified: {buyers.filter(b => b.total_points >= 10000).length} buyers</span>
                <span className="text-slate-400 font-bold">Ongoing</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
