'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { ArrowUpRight, ArrowDownRight, ChevronRight, X as CloseIcon } from 'lucide-react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

export default function BuyerDashboard() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showSpinModal, setShowSpinModal] = useState(false);
  const [spinning, setSpinning] = useState(false);
  const [spinResult, setSpinResult] = useState<number | null>(null);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await api.get('/buyer/dashboard');
        setData(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  if (loading) {
    return <div className="flex items-center justify-center h-full"><div className="animate-pulse text-lg font-medium text-slate-400">Loading Dashboard...</div></div>;
  }

  const points = data?.points || 0;
  const nextTierPoints = 15000;
  const progressPercent = Math.min((points / nextTierPoints) * 100, 100);

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } }
  };

  const handleSpin = () => {
    if (spinning || spinResult !== null) return;
    setSpinning(true);
    // Simulate spin duration
    setTimeout(() => {
      setSpinning(false);
      setSpinResult(500); // hardcoded result for prototype
    }, 3000);
  };

  return (
    <>
      <motion.div 
        className="max-w-6xl mx-auto space-y-6"
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <motion.div variants={itemVariants}>
            <h1 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">Dashboard</h1>
            <p className="text-slate-500 mt-1">Welcome back to your wholesale rewards portal.</p>
          </motion.div>
          <motion.div variants={itemVariants}>
             <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => { setShowSpinModal(true); setSpinResult(null); }}
                className="bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold px-6 py-2.5 rounded-xl shadow-lg flex items-center gap-2"
              >
                🎡 Daily Spin 
                <span className="bg-white/20 text-xs px-2 py-0.5 rounded-full">Available</span>
              </motion.button>
          </motion.div>
        </div>

        {/* Top 4 Stats Cards */}
        <motion.div variants={itemVariants} className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { title: 'Total Points', value: points.toLocaleString(), icon: '💎', color: 'from-blue-500 to-indigo-500' },
            { title: 'This Month', value: `+${Math.floor(points * 0.15).toLocaleString()}`, icon: '📈', color: 'from-emerald-400 to-emerald-600' },
            { title: 'Rewards', value: '2', icon: '🎁', color: 'from-purple-500 to-fuchsia-500' },
            { title: 'Trip Progress', value: `${Math.floor(progressPercent)}%`, icon: '✈️', color: 'from-amber-400 to-orange-500' },
          ].map((stat, idx) => (
            <motion.div 
              key={idx}
              whileHover={{ y: -5, scale: 1.02 }}
              className="bg-white rounded-2xl p-5 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 relative overflow-hidden group"
            >
              <div className={`absolute -right-6 -top-6 w-24 h-24 bg-gradient-to-br ${stat.color} rounded-full opacity-10 group-hover:scale-150 transition-transform duration-500 blur-2xl`}></div>
              <div className="flex items-center gap-3 mb-3 relative z-10">
                <motion.div 
                  animate={{ y: [0, -5, 0] }}
                  transition={{ repeat: Infinity, duration: 3 + idx, ease: "easeInOut" }}
                  className="text-3xl drop-shadow-md"
                >
                  {stat.icon}
                </motion.div>
                <span className="text-sm font-semibold text-slate-500 uppercase tracking-wider">{stat.title}</span>
              </div>
              <p className="text-3xl font-black text-slate-900 relative z-10">{stat.value}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Main Center Section */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Quick Scan Card */}
          <motion.div 
            variants={itemVariants}
            whileHover={{ scale: 1.01 }}
            className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white rounded-3xl p-8 relative overflow-hidden shadow-2xl flex flex-col justify-center items-start border border-slate-700/50"
          >
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
              className="absolute -right-10 -top-10 text-[180px] opacity-10 blur-sm pointer-events-none drop-shadow-2xl"
            >
              🎯
            </motion.div>
            <motion.div 
              animate={{ y: [0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
              className="text-5xl mb-4 drop-shadow-2xl"
            >
              📱
            </motion.div>
            <h2 className="text-2xl font-black mb-2 tracking-tight">Scan & Earn</h2>
            <p className="text-slate-300 mb-6 max-w-sm font-medium">Scan the QR code on your latest wholesale invoice to instantly credit points to your account.</p>
            <Link href="/buyer/scan">
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-gradient-to-r from-amber-400 to-amber-500 text-slate-900 font-bold px-6 py-3 rounded-xl shadow-[0_0_20px_rgba(251,191,36,0.4)] flex items-center gap-2"
              >
                Scan QR Now <ChevronRight className="w-5 h-5" />
              </motion.button>
            </Link>
          </motion.div>

          {/* Reward Progress Card */}
          <motion.div variants={itemVariants} className="bg-white rounded-3xl p-8 border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex flex-col justify-center relative overflow-hidden group">
            <div className="absolute right-0 bottom-0 w-64 h-64 bg-amber-400/5 rounded-full blur-3xl group-hover:bg-amber-400/10 transition-colors duration-500"></div>
            
            <div className="flex items-center justify-between mb-6 relative z-10">
              <h2 className="text-xl font-bold text-slate-900">Next Milestone</h2>
              <span className="bg-gradient-to-r from-amber-200 to-amber-300 text-amber-900 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-sm">Gold Tier 🏆</span>
            </div>
            
            <div className="mb-5 relative z-10">
              <div className="flex justify-between text-sm font-bold text-slate-600 mb-2">
                <span>{points.toLocaleString()} pts</span>
                <span>{nextTierPoints.toLocaleString()} pts</span>
              </div>
              <div className="w-full bg-slate-100 h-4 rounded-full overflow-hidden shadow-inner relative">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPercent}%` }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                  className="absolute top-0 left-0 h-full bg-gradient-to-r from-amber-400 to-orange-500 rounded-full"
                >
                  {/* Shine effect */}
                  <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-white/30 to-transparent"></div>
                </motion.div>
              </div>
            </div>
            
            <p className="text-slate-500 text-sm font-medium relative z-10">
              <span className="font-bold text-slate-900">{(nextTierPoints - points).toLocaleString()} more points</span> to unlock the Gold Trip Bonus & VIP Pricing.
            </p>
          </motion.div>
        </div>

        {/* Recent Activity & Campaigns */}
        <motion.div variants={itemVariants} className="grid lg:grid-cols-3 gap-6 pt-4">
          {/* Recent Scans Table */}
          <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden">
            <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h3 className="font-bold text-slate-900">Recent Transactions</h3>
              <Link href="/buyer/history" className="text-sm font-bold text-blue-600 hover:text-blue-700">View All</Link>
            </div>
            <div className="divide-y divide-slate-100">
              {data?.recent_transactions?.length === 0 ? (
                <div className="p-8 text-center text-sm font-medium text-slate-500">No recent transactions found.</div>
              ) : (
                data?.recent_transactions?.map((txn: any) => (
                  <motion.div 
                    key={txn.id} 
                    whileHover={{ backgroundColor: 'rgba(248,250,252,1)' }}
                    className="px-6 py-4 flex items-center justify-between transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className={`p-3 rounded-2xl shadow-sm ${txn.type === 'credit' ? 'bg-emerald-50' : 'bg-rose-50'}`}>
                        {txn.type === 'credit' ? <ArrowUpRight className="w-5 h-5 text-emerald-600" /> : <ArrowDownRight className="w-5 h-5 text-rose-600" />}
                      </div>
                      <div>
                        <p className="font-bold text-slate-900 capitalize">{txn.source.replace('_', ' ')}</p>
                        <p className="text-xs font-medium text-slate-500 mt-0.5">{new Date(txn.date).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <div className={`font-black ${txn.type === 'credit' ? 'text-emerald-600' : 'text-slate-900'}`}>
                      {txn.type === 'credit' ? '+' : '-'}{txn.points} pts
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </div>

          {/* Featured Trip Card */}
          <motion.div 
            whileHover={{ scale: 1.02 }}
            className="bg-slate-900 rounded-3xl overflow-hidden shadow-2xl relative group cursor-pointer"
          >
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent z-10"></div>
            <img src="https://images.unsplash.com/photo-1588631168050-705bfb4260d5?q=80&w=1000&auto=format&fit=crop" alt="Ooty" className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
            
            <div className="relative z-20 h-full p-8 flex flex-col justify-end">
              <motion.div 
                animate={{ y: [0, -5, 0] }}
                transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                className="bg-gradient-to-r from-amber-400 to-orange-500 text-slate-900 text-xs font-black px-3 py-1.5 rounded-lg inline-block w-max mb-3 shadow-lg"
              >
                FEATURED TRIP 🌟
              </motion.div>
              <h3 className="text-2xl font-black text-white mb-2 tracking-tight">Ooty Dealer Meet 2026</h3>
              <p className="text-sm font-medium text-slate-300 mb-5">4 Days / 3 Nights All-Expenses Paid</p>
              
              <div className="w-full bg-white/20 h-2 rounded-full mb-2 overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: '45%' }}
                  transition={{ duration: 1.5, delay: 0.5 }}
                  className="bg-gradient-to-r from-amber-400 to-amber-200 h-full rounded-full relative"
                >
                   <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-white/40 to-transparent"></div>
                </motion.div>
              </div>
              <p className="text-xs font-bold text-white text-right">45% Qualified</p>
            </div>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Spin Wheel Modal */}
      <AnimatePresence>
        {showSpinModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
              onClick={() => { if (!spinning) setShowSpinModal(false); }}
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative bg-white rounded-3xl shadow-2xl p-8 max-w-sm w-full overflow-hidden flex flex-col items-center text-center"
            >
              <button 
                onClick={() => { if (!spinning) setShowSpinModal(false); }}
                className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 bg-slate-100 rounded-full"
              >
                <CloseIcon className="w-5 h-5" />
              </button>

              <h2 className="text-2xl font-black text-slate-900 mb-2 mt-4">Daily Spin!</h2>
              <p className="text-slate-500 mb-8 font-medium">Test your luck to win bonus points.</p>

              <div className="relative w-64 h-64 mb-8">
                {/* Pointer */}
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10 text-4xl drop-shadow-lg">
                  ⬇️
                </div>
                {/* Wheel */}
                <motion.div 
                  animate={{ 
                    rotate: spinning ? 360 * 5 + 72 : 0 // Spin 5 times and land on a specific segment (72 degrees)
                  }}
                  transition={{ 
                    duration: spinning ? 3 : 0, 
                    ease: "circOut"
                  }}
                  className="w-full h-full rounded-full border-8 border-white shadow-2xl overflow-hidden relative bg-slate-100"
                  style={{
                    background: 'conic-gradient(from 0deg, #f43f5e 0 60deg, #3b82f6 60deg 120deg, #10b981 120deg 180deg, #f59e0b 180deg 240deg, #8b5cf6 240deg 300deg, #06b6d4 300deg 360deg)'
                  }}
                >
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-12 h-12 bg-white rounded-full shadow-inner z-20"></div>
                  </div>
                </motion.div>
              </div>

              <AnimatePresence>
                {spinResult ? (
                  <motion.div 
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1, type: 'spring' }}
                    className="text-center"
                  >
                    <p className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-1">You Won</p>
                    <p className="text-5xl font-black text-emerald-500 mb-6 drop-shadow-sm">{spinResult}</p>
                    <button 
                      onClick={() => setShowSpinModal(false)}
                      className="bg-slate-900 text-white font-bold px-8 py-3 rounded-xl shadow-lg hover:bg-slate-800 transition-colors w-full"
                    >
                      Collect Points
                    </button>
                  </motion.div>
                ) : (
                  <motion.button 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleSpin}
                    disabled={spinning}
                    className={`font-bold px-8 py-4 rounded-xl shadow-lg w-full text-lg transition-colors ${
                      spinning ? 'bg-slate-200 text-slate-400' : 'bg-gradient-to-r from-amber-400 to-orange-500 text-slate-900 hover:from-amber-300 hover:to-orange-400'
                    }`}
                  >
                    {spinning ? 'Spinning...' : 'SPIN NOW'}
                  </motion.button>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
