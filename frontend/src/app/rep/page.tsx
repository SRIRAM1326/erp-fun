'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { FileText, Plus, ShieldCheck, Award, TrendingUp, Users, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function RepDashboard() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await api.get('/rep/dashboard');
        setData(res.data);
      } catch (err) {
        console.error(err);
        setError('Failed to fetch dashboard data. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#8b5cf6]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-md mx-auto mt-10 p-6 bg-[#14122d] border border-[#242247] rounded-2xl text-center">
        <p className="text-red-400 font-semibold mb-4">{error}</p>
        <button onClick={() => window.location.reload()} className="px-4 py-2 bg-[#8b5cf6] text-white rounded-xl font-bold hover:bg-[#8b5cf6]/80 transition-all">Retry</button>
      </div>
    );
  }

  // Calculate XP progress (gamified)
  // Let's assume 1 point = 1 XP. Gold is 5000 XP. Next tier is Platinum at 15000 XP.
  const currentPoints = data?.points || 0;
  const nextTierPoints = 15000;
  const prevTierPoints = 5000;
  const progressPercent = Math.min(100, Math.max(10, ((currentPoints - prevTierPoints) / (nextTierPoints - prevTierPoints)) * 100));

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Welcome Header */}
      <div>
        <span className="text-xs font-bold text-[#8b5cf6] uppercase tracking-wider">Overview</span>
        <h1 className="text-3xl font-extrabold text-white tracking-tight mt-1">Welcome back, Representative</h1>
        <p className="text-[#8f8bb3] text-sm mt-1">Monitor your referred stores, sales commissions, and claim your rewards.</p>
      </div>

      {/* Grid of Main Cards */}
      <div className="grid md:grid-cols-3 gap-6">
        
        {/* Neon Points Balance Card */}
        <div className="md:col-span-2 bg-gradient-to-br from-[#1e1b4b] via-[#311042] to-[#1e1b4b] border border-[#4a1d6d] rounded-3xl p-6 relative overflow-hidden shadow-2xl shadow-[#8b5cf6]/5 flex flex-col justify-between">
          <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-[#8b5cf6] rounded-full blur-3xl opacity-20"></div>
          <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-40 h-40 bg-[#ec4899] rounded-full blur-3xl opacity-20"></div>
          
          <div className="relative z-10">
            <span className="text-xs font-bold text-[#ffd700] uppercase tracking-wider block mb-1">Your Rewards Pool</span>
            <div className="flex items-baseline gap-2">
              <span className="text-5xl font-black text-white">{(data?.points || 0).toLocaleString()}</span>
              <span className="text-lg font-bold text-[#ffd700]">PTS</span>
            </div>
            <p className="text-xs text-[#8f8bb3] mt-2 font-medium">Pending points credit immediately after referred invoice payments complete.</p>
          </div>

          <div className="grid grid-cols-2 gap-4 mt-8 pt-6 border-t border-[#242247] relative z-10">
            <div>
              <p className="text-[10px] uppercase font-bold text-[#8f8bb3] tracking-wider">Pending points</p>
              <p className="text-lg font-extrabold text-[#3b82f6]">+{ (data?.pending_points || 0).toLocaleString() } pts</p>
            </div>
            <div>
              <p className="text-[10px] uppercase font-bold text-[#8f8bb3] tracking-wider">Credited Commission</p>
              <p className="text-lg font-extrabold text-emerald-400">+{ (data?.credited_points || 0).toLocaleString() } pts</p>
            </div>
          </div>
        </div>

        {/* Gamified Level Tracker Card */}
        <div className="bg-[#14122d] border border-[#242247] rounded-3xl p-6 flex flex-col justify-between shadow-xl">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold text-[#ffd700] uppercase tracking-wider">Rank Status</span>
              <span className="bg-[#ffd700]/15 text-[#ffd700] text-[10px] font-bold px-2 py-0.5 rounded-full">Rank #4</span>
            </div>
            
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-[#ffd700]/10 flex items-center justify-center text-[#ffd700] border border-[#ffd700]/20">
                <Award className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-extrabold text-white text-lg">Gold Representative</h3>
                <p className="text-xs text-[#8f8bb3]">Commission multiplier: 1.0x</p>
              </div>
            </div>

            <div className="space-y-2 mt-6">
              <div className="flex justify-between text-xs font-semibold text-[#8f8bb3]">
                <span>Progress to Platinum</span>
                <span className="text-white">{(data?.points || 0).toLocaleString()} / 15,000 pts</span>
              </div>
              <div className="w-full bg-[#0c0a1f] h-2.5 rounded-full overflow-hidden border border-[#242247]">
                <div 
                  className="bg-gradient-to-r from-[#8b5cf6] to-[#ec4899] h-full rounded-full transition-all duration-1000"
                  style={{ width: `${progressPercent}%` }}
                ></div>
              </div>
            </div>
          </div>

          <div className="flex gap-1.5 mt-6 flex-wrap">
            <span className="text-[9px] font-bold px-2 py-1 rounded bg-[#ec4899]/10 text-[#f472b6] border border-[#ec4899]/20">⚡ Streak x3</span>
            <span className="text-[9px] font-bold px-2 py-1 rounded bg-[#3b82f6]/10 text-[#60a5fa] border border-[#3b82f6]/20">🎯 Target Master</span>
            <span className="text-[9px] font-bold px-2 py-1 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">👑 Kingmaker</span>
          </div>
        </div>
      </div>

      {/* Action CTA Row */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between p-6 bg-[#14122d] border border-[#242247] rounded-3xl shadow-lg">
        <div className="flex items-center gap-3 text-left">
          <div className="p-3 rounded-2xl bg-[#8b5cf6]/10 text-[#8b5cf6]">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-white">Linked Invoices & Sales Value</h3>
            <p className="text-xs text-[#8f8bb3] mt-0.5">
              You have <span className="text-white font-bold">{data?.total_invoices || 0}</span> linked invoices valued at <span className="text-white font-bold">₹{(data?.total_value || 0).toLocaleString()}</span>.
            </p>
          </div>
        </div>
        <Link href="/rep/invoices" className="w-full sm:w-auto bg-[#8b5cf6] hover:bg-[#8b5cf6]/80 text-white font-bold px-6 py-3 rounded-2xl transition-all shadow-lg shadow-[#8b5cf6]/20 flex items-center justify-center gap-2">
          <Plus className="w-5 h-5" /> Link New Invoice
        </Link>
      </div>

      {/* Bottom Section: Referred Stores & Recent Ledgers */}
      <div className="grid md:grid-cols-2 gap-8">
        
        {/* Referred Stores */}
        <div className="bg-[#14122d] border border-[#242247] rounded-3xl p-6 space-y-6 shadow-xl">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-white text-lg flex items-center gap-2">
              <Users className="w-5 h-5 text-[#8b5cf6]" /> Referred Shops
            </h3>
            <span className="text-xs text-[#8f8bb3] font-semibold">{data?.referred_buyers?.length || 0} stores</span>
          </div>
          
          <div className="space-y-4 max-h-[300px] overflow-y-auto pr-1">
            {data?.referred_buyers?.length === 0 ? (
              <p className="text-xs text-[#8f8bb3] py-8 text-center">No referred stores yet. Share your referral code <span className="text-white font-bold">{data?.referral_code}</span> to onboard shops!</p>
            ) : (
              data?.referred_buyers?.map((buyer: any) => (
                <div key={buyer.id} className="p-4 bg-[#0c0a1f] border border-[#242247] rounded-2xl flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-white text-sm">{buyer.business_name || buyer.name}</h4>
                    <p className="text-[11px] text-[#8f8bb3] mt-0.5">{buyer.email}</p>
                  </div>
                  <div>
                    {buyer.is_verified ? (
                      <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> Verified
                      </span>
                    ) : (
                      <span className="bg-amber-500/10 text-amber-400 border border-amber-500/20 text-[10px] font-bold px-2 py-0.5 rounded-full">
                        Pending Admin Verification
                      </span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="bg-[#14122d] border border-[#242247] rounded-3xl p-6 space-y-6 shadow-xl">
          <h3 className="font-bold text-white text-lg flex items-center gap-2">
            <FileText className="w-5 h-5 text-[#8b5cf6]" /> Points Ledger
          </h3>

          <div className="space-y-4">
            {data?.recent_transactions?.length === 0 ? (
              <p className="text-xs text-[#8f8bb3] py-8 text-center">No transaction logs available.</p>
            ) : (
              data?.recent_transactions?.map((txn: any) => (
                <div key={txn.id} className="flex items-center justify-between p-3.5 bg-[#0c0a1f] border border-[#242247] rounded-2xl">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-[#8f8bb3] tracking-wider block">{txn.source.replace('_', ' ')}</span>
                    <span className="text-xs text-slate-400 mt-1 block">{new Date(txn.date).toLocaleDateString()}</span>
                  </div>
                  <div className={`font-black text-sm ${txn.type === 'credit' ? 'text-emerald-400' : 'text-[#ec4899]'}`}>
                    {txn.type === 'credit' ? '+' : '-'}{txn.points.toLocaleString()} pts
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Security Chip */}
      <div className="flex items-center gap-3 justify-center p-4 bg-[#14122d]/40 border border-[#242247] rounded-2xl max-w-xs mx-auto">
        <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
        <p className="text-xs font-semibold text-[#8f8bb3]">Authorized Sales Rep Portal.</p>
      </div>
    </div>
  );
}
