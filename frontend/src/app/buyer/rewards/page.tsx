'use client';

import { useState } from 'react';
import { Gift, Plane, Wallet, Ticket, Info, ExternalLink } from 'lucide-react';
import Link from 'next/link';

export default function RewardsPage() {
  const [filter, setFilter] = useState('all');
  
  // Dummy data for visual layout as per requirements
  const points = 12450;
  
  const rewards = [
    { id: 1, type: 'cashback', title: '₹500 Cashback', points: 3000, expiry: '30 Days', icon: Wallet, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { id: 2, type: 'coupon', title: '10% Off Next Order', points: 5000, expiry: '60 Days', icon: Ticket, color: 'text-purple-600', bg: 'bg-purple-50' },
    { id: 3, type: 'gift', title: 'Premium Dealer Kit', points: 8000, expiry: 'No Expiry', icon: Gift, color: 'text-blue-600', bg: 'bg-blue-50' },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">Rewards Marketplace</h1>
          <p className="text-slate-500 mt-1">Exchange your points for exclusive wholesale benefits.</p>
        </div>
        <div className="bg-slate-900 text-white px-6 py-3 rounded-xl flex items-center gap-4 shadow-sm">
          <div>
            <p className="text-xs text-slate-400 uppercase font-semibold">Available Balance</p>
            <p className="text-2xl font-bold text-amber-400">{points.toLocaleString()} pts</p>
          </div>
          <div className="h-8 w-px bg-slate-700"></div>
          <div>
            <p className="text-xs text-slate-400 uppercase font-semibold">Tier</p>
            <p className="text-lg font-bold">Silver</p>
          </div>
        </div>
      </div>

      {/* Special Trip Reward Card */}
      <div className="bg-amber-50 rounded-2xl border border-amber-200 overflow-hidden relative shadow-sm group">
        <div className="absolute top-0 right-0 p-8 opacity-10 transform translate-x-4 -translate-y-4">
          <Plane className="w-48 h-48 text-amber-600" />
        </div>
        <div className="p-8 md:p-10 relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div>
            <span className="bg-amber-500 text-slate-900 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-4 inline-block">Platinum Tier Exclusive</span>
            <h2 className="text-3xl font-bold text-slate-900 mb-2">Goa Dealer Meet Trip</h2>
            <p className="text-slate-700 max-w-xl text-lg">Join the top 50 dealers for an all-expenses-paid 3-day retreat in Goa. Flight and luxury accommodation included.</p>
            
            <div className="mt-6 flex flex-wrap gap-6 text-sm font-medium text-slate-600">
              <span className="flex items-center gap-2">
                <div className="bg-amber-200/50 p-1.5 rounded-md"><Wallet className="w-4 h-4 text-amber-700" /></div>
                Requires 20,000 pts
              </span>
              <span className="flex items-center gap-2">
                <div className="bg-amber-200/50 p-1.5 rounded-md"><Info className="w-4 h-4 text-amber-700" /></div>
                Qualify by Dec 31, 2026
              </span>
            </div>
          </div>
          
          <div className="flex-shrink-0">
            <Link href="/buyer/trips" className="bg-slate-900 hover:bg-slate-800 text-white font-semibold px-8 py-4 rounded-xl transition-colors inline-flex items-center gap-2 shadow-lg hover:shadow-xl">
              View Trip Details <ExternalLink className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex overflow-x-auto pb-2 gap-2 hide-scrollbar">
        {['all', 'cashback', 'coupons', 'gifts'].map((f) => (
          <button 
            key={f} 
            onClick={() => setFilter(f)}
            className={`px-5 py-2.5 rounded-lg text-sm font-semibold capitalize whitespace-nowrap transition-colors ${
              filter === f ? 'bg-slate-900 text-white' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Rewards Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {rewards.filter(r => filter === 'all' || r.type === filter).map((reward) => {
          const Icon = reward.icon;
          const canAfford = points >= reward.points;
          
          return (
            <div key={reward.id} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-6">
                <div className={`${reward.bg} p-4 rounded-xl`}>
                  <Icon className={`w-8 h-8 ${reward.color}`} />
                </div>
                <div className="bg-slate-50 border border-slate-100 px-3 py-1 rounded-lg text-sm font-bold text-slate-700">
                  {reward.points.toLocaleString()} pts
                </div>
              </div>
              
              <h3 className="text-xl font-bold text-slate-900 mb-2">{reward.title}</h3>
              <p className="text-slate-500 text-sm mb-6 flex-1">
                Redeem your points for a {reward.title.toLowerCase()}. Valid for {reward.expiry}.
              </p>
              
              <button 
                className={`w-full py-3 rounded-xl font-semibold transition-colors ${
                  canAfford 
                    ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-sm' 
                    : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                }`}
                disabled={!canAfford}
              >
                {canAfford ? 'Redeem Now' : 'Not Enough Points'}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
