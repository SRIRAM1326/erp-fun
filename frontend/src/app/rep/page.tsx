'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { FileText, Plus, ShieldCheck, Award, TrendingUp, Users, CheckCircle2, Gift, Coins, Wallet, Sparkles, ArrowRight, Zap, Check } from 'lucide-react';
import Link from 'next/link';

export default function RepDashboard() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [claimedDaily, setClaimedDaily] = useState(false);

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

  const handleDailyClaim = () => {
    setClaimedDaily(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-[#0d7a75]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-md mx-auto mt-10 p-6 bg-white border border-rose-200 rounded-3xl text-center shadow-lg">
        <p className="text-rose-600 font-bold mb-4">{error}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="px-6 py-2 bg-[#0d7a75] text-white rounded-xl font-bold shadow hover:bg-[#0b6a65] transition-all"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-10">
      
      {/* 1. Daily Check-in Card (Matching Center Screen Top Banner in Screenshot) */}
      <div className="bg-[#0d7a75] text-white p-5 rounded-3xl shadow-md flex items-center justify-between relative overflow-hidden">
        <div className="flex items-center gap-4 relative z-10">
          <div className="w-12 h-12 rounded-2xl bg-white/20 border border-white/30 flex items-center justify-center shrink-0">
            <Gift className="w-7 h-7 text-amber-300 animate-bounce" />
          </div>
          <div>
            <h2 className="font-extrabold text-white text-base">Collect points everyday!</h2>
            <p className="text-xs text-teal-100 mt-0.5 font-medium flex items-center gap-1.5">
              <span>Streak: Day 4</span>
              <span>&bull;</span>
              <span className="text-amber-300 font-bold flex items-center gap-1">
                <Coins className="w-3.5 h-3.5" /> +15 coins bonus
              </span>
            </p>
          </div>
        </div>

        <button 
          onClick={handleDailyClaim}
          disabled={claimedDaily}
          className={`shrink-0 px-5 py-2 rounded-full font-black text-xs transition-all shadow-sm ${
            claimedDaily 
              ? 'bg-teal-900 text-teal-200 cursor-default flex items-center gap-1' 
              : 'bg-white text-[#0d7a75] hover:bg-amber-300 hover:text-slate-900'
          }`}
        >
          {claimedDaily ? (
            <>
              <Check className="w-3.5 h-3.5" /> Claimed
            </>
          ) : (
            'Claim'
          )}
        </button>
      </div>

      {/* 2. Earning Field (2x2 Vibrant Feature Grid Cards matching Screenshot center view) */}
      <div>
        <h3 className="text-base font-extrabold text-slate-800 mb-3 px-1">Earning Field</h3>
        
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Card 1: Coral Red Pink (Offerwalls / Link Invoices) */}
          <Link href="/rep/invoices" className="bg-[#ff5b5b] hover:bg-[#f84c4c] text-white p-5 rounded-3xl shadow-md flex flex-col justify-between h-36 transition-transform hover:-translate-y-1">
            <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center">
              <FileText className="w-5 h-5 text-white" />
            </div>
            <div>
              <h4 className="font-black text-white text-base">Link Invoices</h4>
              <p className="text-[11px] text-white/90 font-medium leading-tight mt-0.5">Recommended way to earn 1% sales points</p>
            </div>
          </Link>

          {/* Card 2: Warm Peach Orange (Surveys / Redeem Cash) */}
          <Link href="/rep/earnings" className="bg-[#ff9f43] hover:bg-[#f79333] text-white p-5 rounded-3xl shadow-md flex flex-col justify-between h-36 transition-transform hover:-translate-y-1">
            <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center">
              <Wallet className="w-5 h-5 text-white" />
            </div>
            <div>
              <h4 className="font-black text-white text-base">Redeem Payout</h4>
              <p className="text-[11px] text-white/90 font-medium leading-tight mt-0.5">Convert points to direct bank deposits</p>
            </div>
          </Link>

          {/* Card 3: Bright Emerald Green (Watch Video / Leaderboard) */}
          <Link href="/rep/earnings" className="bg-[#22c55e] hover:bg-[#1bb853] text-white p-5 rounded-3xl shadow-md flex flex-col justify-between h-36 transition-transform hover:-translate-y-1">
            <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center">
              <Award className="w-5 h-5 text-white" />
            </div>
            <div>
              <h4 className="font-black text-white text-base">Leaderboard</h4>
              <p className="text-[11px] text-white/90 font-medium leading-tight mt-0.5">Regional ranks & monthly bonus pool</p>
            </div>
          </Link>

          {/* Card 4: Vivid Purple (Refer A Friend) */}
          <Link href="/rep/profile" className="bg-[#6366f1] hover:bg-[#5457e5] text-white p-5 rounded-3xl shadow-md flex flex-col justify-between h-36 transition-transform hover:-translate-y-1">
            <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center">
              <Users className="w-5 h-5 text-white" />
            </div>
            <div>
              <h4 className="font-black text-white text-base">Refer A Store</h4>
              <p className="text-[11px] text-white/90 font-medium leading-tight mt-0.5">Share your code to earn 1,000 points</p>
            </div>
          </Link>

        </div>
      </div>

      {/* 3. Featured Offers / Referred Shops Cards (matching Screenshot cards section) */}
      <div>
        <div className="flex justify-between items-center mb-3 px-1">
          <h3 className="text-base font-extrabold text-slate-800">Featured Referred Shops</h3>
          <span className="text-xs text-[#0d7a75] font-bold">{data?.referred_buyers?.length || 0} Stores</span>
        </div>

        <div className="grid sm:grid-cols-3 gap-4">
          {data?.referred_buyers?.length === 0 ? (
            <div className="sm:col-span-3 bg-white p-6 rounded-2xl border border-slate-200 text-center">
              <p className="text-xs text-slate-500 font-medium">No referred stores registered yet.</p>
              <p className="text-xs font-bold text-[#0d7a75] mt-1">Share referral code <span className="bg-[#f0f7f5] px-2 py-0.5 rounded text-slate-900 border border-[#0d7a75]/30 font-mono">{data?.referral_code}</span></p>
            </div>
          ) : (
            data?.referred_buyers?.slice(0, 3).map((buyer: any, idx: number) => (
              <div key={buyer.id || idx} className="bg-white border border-slate-200 p-4 rounded-2xl shadow-sm flex flex-col justify-between space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center font-extrabold text-sm shrink-0">
                    🏆
                  </div>
                  <div className="min-w-0 flex-1">
                    <h4 className="font-extrabold text-slate-900 text-sm truncate">{buyer.business_name || buyer.name}</h4>
                    <p className="text-[11px] text-slate-500 truncate">{buyer.email}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    buyer.is_verified ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                  }`}>
                    {buyer.is_verified ? 'Verified' : 'Pending'}
                  </span>

                  <Link 
                    href="/rep/invoices" 
                    className="bg-[#0d7a75] hover:bg-[#0b6a65] text-white text-[11px] font-bold px-3 py-1 rounded-lg flex items-center gap-1 transition-all"
                  >
                    Check Now <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* 4. Scratch Cards Banner (Matching Center Screen Scratch Cards box in Screenshot) */}
      <div className="bg-[#075955] text-white p-5 rounded-3xl shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-amber-300 bg-amber-400/20 px-2.5 py-0.5 rounded-full border border-amber-300/30">
            Scratch Cards
          </span>
          <h4 className="font-extrabold text-white text-base mt-1.5">Scratch card and test your luck to earn coins</h4>
          <p className="text-xs text-teal-100 mt-0.5">Bonus scratch tickets awarded for every 5 linked invoices.</p>
        </div>

        <Link 
          href="/rep/earnings" 
          className="shrink-0 bg-white text-[#075955] hover:bg-amber-300 hover:text-slate-950 font-black text-xs px-5 py-2.5 rounded-xl transition-all shadow text-center"
        >
          Check Now
        </Link>
      </div>

      {/* 5. Points Summary / Recent Ledger List (Matching Bottom Screen Transactions view) */}
      <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="font-extrabold text-slate-800 text-base">Recent Transactions</h3>
          <Link href="/rep/earnings" className="text-xs font-bold text-[#0d7a75] hover:underline">
            View All
          </Link>
        </div>

        <div className="space-y-2.5">
          {data?.recent_transactions?.length === 0 ? (
            <p className="text-xs text-slate-500 py-6 text-center">No transaction history recorded yet.</p>
          ) : (
            data?.recent_transactions?.slice(0, 4).map((txn: any) => (
              <div key={txn.id} className="flex items-center justify-between p-3 rounded-2xl bg-[#f8faf9] border border-slate-100">
                <div className="flex items-center gap-3">
                  {/* Arrow badge matching Screenshot: green down arrow for credit, red up arrow for debit */}
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0 ${
                    txn.type === 'credit' ? 'bg-emerald-500' : 'bg-rose-500'
                  }`}>
                    {txn.type === 'credit' ? '↓' : '↑'}
                  </div>
                  <div>
                    <span className="text-xs font-extrabold text-slate-900 capitalize block">
                      {txn.source.replace('_', ' ')}
                    </span>
                    <span className="text-[10px] text-slate-500 block">
                      {new Date(txn.date).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <div className="bg-amber-500/15 text-slate-900 border border-amber-400/40 text-xs font-black px-2.5 py-1 rounded-full flex items-center gap-1">
                  <Coins className="w-3.5 h-3.5 text-amber-600" />
                  <span>{txn.type === 'credit' ? '+' : '-'}{txn.points.toLocaleString()}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

    </div>
  );
}


