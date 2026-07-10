'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { Users, QrCode, ShoppingCart, Award, Gift, Clock, TrendingUp, BarChart3, Star } from 'lucide-react';
import Link from 'next/link';

export default function AdminDashboard() {
  const [buyers, setBuyers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBuyers = async () => {
      try {
        const res = await api.get('/admin/buyers');
        setBuyers(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchBuyers();
  }, []);

  if (loading) {
    return <div className="flex justify-center items-center h-full"><div className="animate-pulse text-lg font-medium text-slate-400">Loading Dashboard Data...</div></div>;
  }

  const totalPoints = buyers.reduce((acc, b) => acc + (b.total_points || 0), 0);
  const activeBuyers = buyers.length; // Placeholder

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Dashboard Overview</h1>
          <p className="text-sm text-slate-500 mt-1">Real-time metrics for your wholesale loyalty program.</p>
        </div>
        <div className="flex gap-2 text-sm">
          <span className="text-slate-500">Last updated: Just now</span>
        </div>
      </div>

      {/* Top Stats Row (6 Cards) */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {[
          { title: 'Total Buyers', value: buyers.length, icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
          { title: 'Active (30d)', value: activeBuyers, icon: TrendingUp, color: 'text-emerald-600', bg: 'bg-emerald-50' },
          { title: 'Points Issued', value: totalPoints.toLocaleString(), icon: QrCode, color: 'text-purple-600', bg: 'bg-purple-50' },
          { title: 'Points Redeemed', value: '4,500', icon: Gift, color: 'text-amber-600', bg: 'bg-amber-50' },
          { title: 'QR Scans', value: '24', icon: ShoppingCart, color: 'text-indigo-600', bg: 'bg-indigo-50' },
          { title: 'Trip Qualified', value: '0', icon: Star, color: 'text-rose-600', bg: 'bg-rose-50' },
        ].map((stat, i) => (
          <div key={i} className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm flex flex-col justify-between">
            <div className="flex items-start justify-between mb-2">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{stat.title}</span>
              <div className={`${stat.bg} p-1.5 rounded-lg`}>
                <stat.icon className={`w-4 h-4 ${stat.color}`} />
              </div>
            </div>
            <div className="text-2xl font-bold text-slate-900">{stat.value}</div>
          </div>
        ))}
      </div>

      {/* Charts Row Placeholder */}
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-semibold text-slate-900">QR Scans & Points Issued</h3>
            <button className="text-xs font-medium text-blue-600">This Month</button>
          </div>
          <div className="h-64 bg-slate-50 rounded-lg border border-slate-100 flex items-center justify-center flex-col gap-2 text-slate-400">
            <BarChart3 className="w-8 h-8" />
            <span className="text-sm">Chart Data Visualization</span>
          </div>
        </div>
        
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-semibold text-slate-900">Top Buyers (Points)</h3>
            <Link href="/admin/buyers" className="text-xs font-medium text-blue-600 hover:underline">View All</Link>
          </div>
          <div className="space-y-4">
            {buyers.sort((a, b) => b.total_points - a.total_points).slice(0, 5).map((buyer, i) => (
              <div key={buyer.id} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-600">
                    {i + 1}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{buyer.business_name || buyer.name}</p>
                    <p className="text-xs text-slate-500">{buyer.tier}</p>
                  </div>
                </div>
                <div className="font-bold text-slate-900">{buyer.total_points.toLocaleString()} pts</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Third Row: Activity Feed & Campaigns */}
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
          <div className="p-6 border-b border-slate-100 flex justify-between items-center">
            <h3 className="font-semibold text-slate-900">Recent Buyer Activity</h3>
            <button className="text-xs font-medium text-slate-500 hover:text-slate-700">Filter</button>
          </div>
          <div className="divide-y divide-slate-100 flex-1">
            {[
              { buyer: 'Wholesale Traders Ltd', action: 'scanned QR', detail: 'and earned 300 points', time: '10 mins ago', icon: QrCode, color: 'text-emerald-500' },
              { buyer: 'Apex Distributors', action: 'redeemed', detail: '₹500 Cashback Reward', time: '2 hours ago', icon: Gift, color: 'text-purple-500' },
              { buyer: 'Global Imports', action: 'qualified', detail: 'for Goa Trip Milestone', time: '5 hours ago', icon: Star, color: 'text-amber-500' },
              { buyer: 'Ramesh Agencies', action: 'scanned QR', detail: 'and earned 150 points', time: '1 day ago', icon: QrCode, color: 'text-emerald-500' },
            ].map((activity, i) => (
              <div key={i} className="p-4 flex gap-4 hover:bg-slate-50 transition-colors items-start">
                <div className="mt-1 bg-slate-100 p-2 rounded-full"><activity.icon className={`w-4 h-4 ${activity.color}`} /></div>
                <div>
                  <p className="text-sm text-slate-800">
                    <span className="font-semibold text-slate-900">{activity.buyer}</span> {activity.action} <span className="font-medium text-slate-600">{activity.detail}</span>
                  </p>
                  <p className="text-xs text-slate-500 mt-1 flex items-center gap-1"><Clock className="w-3 h-3" /> {activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
          <div className="p-6 border-b border-slate-100">
            <h3 className="font-semibold text-slate-900">Active Campaigns</h3>
          </div>
          <div className="p-6 space-y-4 flex-1">
            <div className="border border-slate-100 bg-slate-50 rounded-lg p-4">
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-semibold text-slate-900 text-sm">Monsoon Bonus</h4>
                <span className="bg-emerald-100 text-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">Active</span>
              </div>
              <p className="text-xs text-slate-500 mb-3">Double points on all orders over ₹50,000.</p>
              <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                <div className="bg-emerald-500 h-full rounded-full" style={{ width: '60%' }}></div>
              </div>
              <p className="text-[10px] text-slate-400 mt-1 text-right">Ends in 12 days</p>
            </div>
            
            <div className="border border-slate-100 bg-slate-50 rounded-lg p-4">
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-semibold text-slate-900 text-sm">Dubai Dealer Trip</h4>
                <span className="bg-blue-100 text-blue-700 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">Long Term</span>
              </div>
              <p className="text-xs text-slate-500 mb-3">Annual trip for top tier buyers.</p>
              <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                <div className="bg-blue-500 h-full rounded-full" style={{ width: '35%' }}></div>
              </div>
              <p className="text-[10px] text-slate-400 mt-1 text-right">0 Qualified</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
