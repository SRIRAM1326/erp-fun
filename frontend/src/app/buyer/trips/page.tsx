'use client';

import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { Calendar, Info, Trophy, MapPin, CheckCircle2, Award } from 'lucide-react';

export default function TripProgressPage() {
  const currentPoints = 12450;
  const targetPoints = 20000;
  const progressPercent = Math.min((currentPoints / targetPoints) * 100, 100);

  const milestones = [
    { points: 2000, title: 'Bronze Gift', reward: 'Exclusive Merch Kit', achieved: currentPoints >= 2000 },
    { points: 5000, title: 'Silver Voucher', reward: '₹2,000 Travel Voucher', achieved: currentPoints >= 5000 },
    { points: 10000, title: 'Gold Reward', reward: 'Premium Luggage Set', achieved: currentPoints >= 10000 },
    { points: 20000, title: 'Platinum Trip', reward: 'Ooty Dealer Meet 2026', achieved: currentPoints >= 20000 },
  ];

  interface LeaderboardEntry {
    rank: number;
    name: string;
    points: number;
  }

  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const res = await api.get('/buyer/leaderboard');
        setLeaderboard(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchLeaderboard();
  }, []);

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">Dealer Rewards Trip Program</h1>
        <p className="text-slate-500 mt-1">Track your progress towards our legendary annual dealer trip.</p>
      </div>

      {/* Hero Progress Card */}
      <div className="bg-slate-900 rounded-2xl overflow-hidden shadow-xl border border-slate-800">
        <div className="relative h-64">
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent z-10"></div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="https://images.unsplash.com/photo-1588631168050-705bfb4260d5?q=80&w=1200&auto=format&fit=crop" alt="Ooty" className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute top-6 left-6 z-20 bg-amber-500 text-slate-900 text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wider">
            Featured Campaign
          </div>
        </div>
        
        <div className="p-8 relative z-20 -mt-16">
          <h2 className="text-4xl font-black text-white mb-4 drop-shadow-md">Ooty Dealer Meet 2026</h2>
          
          <div className="flex flex-wrap gap-6 mb-8 text-sm font-medium text-slate-300">
            <span className="flex items-center gap-2"><MapPin className="w-5 h-5 text-amber-400" /> Ooty, Tamil Nadu</span>
            <span className="flex items-center gap-2"><Calendar className="w-5 h-5 text-amber-400" /> Qualify by Dec 31, 2026</span>
            <span className="flex items-center gap-2"><Trophy className="w-5 h-5 text-amber-400" /> Requires 20,000 pts</span>
          </div>

          <div className="bg-white/10 backdrop-blur-md p-6 rounded-xl border border-white/10">
            <div className="flex justify-between items-end mb-3">
              <div>
                <p className="text-slate-400 text-sm font-semibold uppercase tracking-wider mb-1">Your Progress</p>
                <p className="text-2xl font-bold text-white">{currentPoints.toLocaleString()} <span className="text-lg font-normal text-slate-400">/ {targetPoints.toLocaleString()} pts</span></p>
              </div>
              <div className="text-right">
                <p className="text-amber-400 text-xl font-bold">{Math.floor(progressPercent)}%</p>
              </div>
            </div>
            
            <div className="w-full bg-slate-800 h-3 rounded-full overflow-hidden">
              <div className="bg-gradient-to-r from-amber-500 to-amber-300 h-full rounded-full" style={{ width: `${progressPercent}%` }}></div>
            </div>
            
            <p className="text-slate-400 text-sm mt-3">
              Earn <span className="text-white font-semibold">{(targetPoints - currentPoints).toLocaleString()} more points</span> to secure your ticket!
            </p>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {/* Milestone Tracker */}
        <div className="md:col-span-2 space-y-6">
          <h3 className="text-xl font-bold text-slate-900">Journey Milestones</h3>
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <div className="relative border-l-2 border-slate-100 ml-4 space-y-8">
              {milestones.map((m, i) => (
                <div key={i} className="relative pl-8">
                  <div className={`absolute -left-[9px] top-1 w-4 h-4 rounded-full border-2 ${
                    m.achieved ? 'bg-emerald-500 border-emerald-500' : 'bg-white border-slate-300'
                  }`}>
                    {m.achieved && <CheckCircle2 className="absolute -top-1 -left-1 w-5 h-5 text-emerald-500 bg-white rounded-full" />}
                  </div>
                  
                  <div>
                    <div className="flex justify-between items-start mb-1">
                      <h4 className={`font-bold text-lg ${m.achieved ? 'text-slate-900' : 'text-slate-500'}`}>{m.title}</h4>
                      <span className={`text-sm font-semibold px-2 py-0.5 rounded ${m.achieved ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
                        {m.points.toLocaleString()} pts
                      </span>
                    </div>
                    <p className={`text-sm ${m.achieved ? 'text-slate-600' : 'text-slate-400'}`}>Reward: {m.reward}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar: Leaderboard & Terms */}
        <div className="space-y-6">
          {/* Leaderboard */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-[400px]">
            <div className="p-4 border-b border-slate-100 bg-slate-50 flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-500" />
              <h3 className="font-bold text-slate-900">Top Dealers</h3>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {leaderboard.length === 0 ? (
                <p className="text-sm text-slate-500 text-center">Loading leaderboard...</p>
              ) : (
                leaderboard.map((lb) => (
                  <div key={lb.rank} className="flex items-center gap-3">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                      lb.rank === 1 ? 'bg-amber-100 text-amber-700' :
                      lb.rank === 2 ? 'bg-slate-200 text-slate-700' :
                      lb.rank === 3 ? 'bg-orange-100 text-orange-700' :
                      'bg-slate-50 text-slate-500'
                    }`}>
                      {lb.rank}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-slate-900 truncate">{lb.name}</p>
                    </div>
                    <div className="text-xs font-bold text-slate-700">
                      {(lb.points / 1000).toFixed(1)}k
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <h3 className="text-xl font-bold text-slate-900 pt-2">Campaign Rules</h3>
          <div className="bg-slate-50 rounded-2xl border border-slate-200 p-6 shadow-sm">
            <ul className="space-y-4 text-sm text-slate-600">
              <li className="flex gap-3">
                <Info className="w-5 h-5 text-blue-500 flex-shrink-0" />
                <span>Points earned between Jan 1, 2026 and Dec 31, 2026 are counted towards this campaign.</span>
              </li>
              <li className="flex gap-3">
                <Info className="w-5 h-5 text-blue-500 flex-shrink-0" />
                <span>Redeeming points for cash/coupons does NOT reduce your trip milestone progress.</span>
              </li>
              <li className="flex gap-3">
                <Info className="w-5 h-5 text-blue-500 flex-shrink-0" />
                <span>Trip is non-transferable and subject to final management approval.</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
