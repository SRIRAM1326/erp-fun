'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { Wallet, Landmark, Gift, Award, CheckCircle2, AlertTriangle } from 'lucide-react';

export default function RepEarnings() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  // Cash Payout Form State
  const [cashAmount, setCashAmount] = useState('');
  const [bankName, setBankName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [ifscCode, setIfscCode] = useState('');
  const [cashError, setCashError] = useState('');
  const [cashSuccess, setCashSuccess] = useState('');
  const [cashLoading, setCashLoading] = useState(false);

  // Product Selection State
  const [productError, setProductError] = useState('');
  const [productSuccess, setProductSuccess] = useState('');
  const [productLoading, setProductLoading] = useState(false);

  const fetchDashboard = async () => {
    try {
      const res = await api.get('/rep/dashboard');
      setData(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  const handleCashRedeem = async (e: React.FormEvent) => {
    e.preventDefault();
    setCashError('');
    setCashSuccess('');
    
    const pts = parseInt(cashAmount);
    if (isNaN(pts) || pts <= 0) {
      setCashError('Please enter a valid points amount.');
      return;
    }

    if (pts > (data?.points || 0)) {
      setCashError('Insufficient points balance.');
      return;
    }

    setCashLoading(true);
    try {
      const details = `Bank Transfer to ${bankName} A/C ${accountNumber}, IFSC ${ifscCode.toUpperCase()}`;
      await api.post('/rep/redeem', {
        points: pts,
        redemption_type: 'cash',
        details: details
      });
      setCashSuccess(`Cash redemption request for ₹${pts.toLocaleString()} submitted successfully!`);
      setCashAmount('');
      setBankName('');
      setAccountNumber('');
      setIfscCode('');
      fetchDashboard();
    } catch (err: any) {
      console.error(err);
      setCashError(err.response?.data?.message || 'Failed to submit redemption request.');
    } finally {
      setCashLoading(false);
    }
  };

  const handleProductRedeem = async (productName: string, pointsRequired: number) => {
    setProductError('');
    setProductSuccess('');

    if (pointsRequired > (data?.points || 0)) {
      setProductError(`Insufficient points. You need ${pointsRequired.toLocaleString()} points for the ${productName}.`);
      return;
    }

    if (!confirm(`Are you sure you want to redeem ${pointsRequired.toLocaleString()} points for a ${productName}?`)) {
      return;
    }

    setProductLoading(true);
    try {
      await api.post('/rep/redeem', {
        points: pointsRequired,
        redemption_type: 'product',
        details: productName
      });
      setProductSuccess(`Redemption request for a ${productName} submitted successfully!`);
      fetchDashboard();
    } catch (err: any) {
      console.error(err);
      setProductError(err.response?.data?.message || 'Failed to redeem product.');
    } finally {
      setProductLoading(false);
    }
  };

  const catalogProducts = [
    { name: 'Sports Bike', icon: '🏍️', points: 60000, description: 'Premium 150cc commuter sports motorcycle.' },
    { name: 'Laptop (Pro)', icon: '💻', points: 35000, description: '16GB RAM, 512GB SSD high performance work laptop.' },
    { name: 'Smart TV 4K', icon: '📺', points: 25000, description: '55-inch Ultra HD LED Smart Android TV.' },
    { name: 'Smart Phone', icon: '📱', points: 15000, description: 'Latest octa-core processor smartphone with OLED display.' },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#8b5cf6]"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Title */}
      <div>
        <span className="text-xs font-bold text-[#8b5cf6] uppercase tracking-wider">Redemption Hub</span>
        <h1 className="text-3xl font-extrabold text-white tracking-tight mt-1">Earnings &amp; Payouts</h1>
        <p className="text-[#8f8bb3] text-sm mt-1">Redeem your credited points directly for bank transfers or premium catalog products.</p>
      </div>

      <div className="grid md:grid-cols-3 gap-8 items-start">
        
        {/* Points & Cash Payout column */}
        <div className="md:col-span-2 space-y-8">
          
          {/* Balance Summary Card */}
          <div className="bg-[#14122d] border border-[#242247] rounded-3xl p-6 shadow-xl flex items-center gap-4">
            <div className="p-4 bg-[#8b5cf6]/10 text-[#ffd700] rounded-2xl border border-[#8b5cf6]/20">
              <Wallet className="w-8 h-8" />
            </div>
            <div>
              <p className="text-xs font-bold text-[#8f8bb3] uppercase tracking-wider">Redeemable Points Balance</p>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-4xl font-black text-white">{(data?.points || 0).toLocaleString()}</span>
                <span className="text-sm font-semibold text-[#ffd700]">points</span>
              </div>
              <p className="text-xs text-[#8f8bb3] mt-1 font-medium">1 point = ₹1 direct bank transfer</p>
            </div>
          </div>

          {/* Cash Transfer Form */}
          <div className="bg-[#14122d] border border-[#242247] rounded-3xl p-6 shadow-xl space-y-6">
            <div>
              <h3 className="font-extrabold text-white text-lg flex items-center gap-2">
                <Landmark className="w-5 h-5 text-[#8b5cf6]" /> Cash Bank Transfer
              </h3>
              <p className="text-xs text-[#8f8bb3] mt-1">Redeem points for real-time bank deposits at ₹1 per point.</p>
            </div>

            {cashError && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl">
                <p className="text-xs font-bold text-red-400">{cashError}</p>
              </div>
            )}
            {cashSuccess && (
              <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <p className="text-xs font-bold text-emerald-400">{cashSuccess}</p>
              </div>
            )}

            <form onSubmit={handleCashRedeem} className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase font-bold text-[#8f8bb3] tracking-wider">Points to Redeem</label>
                  <input 
                    type="number" 
                    placeholder="e.g. 5000" 
                    value={cashAmount}
                    onChange={(e) => setCashAmount(e.target.value)}
                    min="1"
                    max={data?.points}
                    className="w-full px-4 py-3 bg-[#0c0a1f] border border-[#242247] rounded-xl text-sm font-semibold text-white focus:outline-none focus:border-[#8b5cf6] transition-all"
                    required
                  />
                  {cashAmount && (
                    <span className="text-[10px] text-emerald-400 font-bold block mt-1">Equals ₹{(parseInt(cashAmount) || 0).toLocaleString()} Bank Transfer</span>
                  )}
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase font-bold text-[#8f8bb3] tracking-wider">Bank Name</label>
                  <input 
                    type="text" 
                    placeholder="e.g. HDFC Bank" 
                    value={bankName}
                    onChange={(e) => setBankName(e.target.value)}
                    className="w-full px-4 py-3 bg-[#0c0a1f] border border-[#242247] rounded-xl text-sm font-semibold text-white focus:outline-none focus:border-[#8b5cf6] transition-all"
                    required
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase font-bold text-[#8f8bb3] tracking-wider">Account Number</label>
                  <input 
                    type="text" 
                    placeholder="e.g. 501002345678" 
                    value={accountNumber}
                    onChange={(e) => setAccountNumber(e.target.value)}
                    className="w-full px-4 py-3 bg-[#0c0a1f] border border-[#242247] rounded-xl text-sm font-semibold text-white focus:outline-none focus:border-[#8b5cf6] transition-all"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase font-bold text-[#8f8bb3] tracking-wider">IFSC Code</label>
                  <input 
                    type="text" 
                    placeholder="e.g. HDFC0000240" 
                    value={ifscCode}
                    onChange={(e) => setIfscCode(e.target.value)}
                    className="w-full px-4 py-3 bg-[#0c0a1f] border border-[#242247] rounded-xl text-sm font-semibold text-white focus:outline-none focus:border-[#8b5cf6] transition-all"
                    required
                  />
                </div>
              </div>

              <button 
                type="submit" 
                disabled={cashLoading}
                className="w-full bg-[#8b5cf6] hover:bg-[#8b5cf6]/80 disabled:bg-[#8b5cf6]/40 text-white font-bold py-3.5 rounded-xl transition-all shadow-md shadow-[#8b5cf6]/20 flex items-center justify-center gap-1.5"
              >
                Submit Bank Payout Request
              </button>
            </form>
          </div>

          {/* Catalog Store */}
          <div className="bg-[#14122d] border border-[#242247] rounded-3xl p-6 shadow-xl space-y-6">
            <div>
              <h3 className="font-extrabold text-white text-lg flex items-center gap-2">
                <Gift className="w-5 h-5 text-[#8b5cf6]" /> Premium Catalog Rewards
              </h3>
              <p className="text-xs text-[#8f8bb3] mt-1">Claim top tier electronics and bikes once you cross point milestones.</p>
            </div>

            {productError && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl">
                <p className="text-xs font-bold text-red-400">{productError}</p>
              </div>
            )}
            {productSuccess && (
              <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <p className="text-xs font-bold text-emerald-400">{productSuccess}</p>
              </div>
            )}

            <div className="grid sm:grid-cols-2 gap-4">
              {catalogProducts.map((p) => {
                const canAfford = (data?.points || 0) >= p.points;
                return (
                  <div key={p.name} className="p-4 bg-[#0c0a1f] border border-[#242247] rounded-2xl flex flex-col justify-between hover:border-[#8b5cf6]/50 transition-all">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-3xl">{p.icon}</span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          canAfford ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/15 text-[#ffd700]'
                        }`}>
                          {p.points.toLocaleString()} pts
                        </span>
                      </div>
                      <h4 className="font-bold text-white text-sm">{p.name}</h4>
                      <p className="text-[11px] text-[#8f8bb3] mt-1 leading-relaxed">{p.description}</p>
                    </div>

                    <button
                      onClick={() => handleProductRedeem(p.name, p.points)}
                      disabled={productLoading}
                      className={`w-full text-xs font-bold py-2 px-3 mt-4 rounded-xl transition-all ${
                        canAfford 
                          ? 'bg-[#8b5cf6] text-white hover:bg-[#8b5cf6]/80' 
                          : 'bg-[#242247] text-[#8f8bb3] cursor-not-allowed'
                      }`}
                    >
                      Redeem Product
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

        {/* Region Leaderboard column */}
        <div className="bg-[#14122d] border border-[#242247] rounded-3xl p-6 shadow-xl space-y-6">
          <div>
            <h3 className="font-extrabold text-white text-lg flex items-center gap-2">
              <Award className="w-5 h-5 text-[#8b5cf6]" /> Regional Leaderboard
            </h3>
            <p className="text-xs text-[#8f8bb3] mt-1">July performance rankings of regional sales representatives.</p>
          </div>

          <div className="space-y-3">
            {[
              { rank: '🥇 1', name: 'Rohan Mehta', points: '58,400 pts', isYou: false },
              { rank: '🥈 2', name: 'Sneha Sharma', points: '49,200 pts', isYou: false },
              { rank: '🥉 3', name: 'Vikram Sen', points: '45,800 pts', isYou: false },
              { rank: '👉 4', name: `${data?.name ? `${data.name} (You)` : 'You'}`, points: `${(data?.points || 0).toLocaleString()} pts`, isYou: true },
              { rank: '5', name: 'Alok Gupta', points: '14,200 pts', isYou: false },
            ].map((item, idx) => (
              <div 
                key={idx}
                className={`p-3 rounded-2xl flex items-center justify-between transition-all ${
                  item.isYou 
                    ? 'bg-[#8b5cf6]/20 border-l-4 border-[#8b5cf6] font-bold text-[#f1f0fb]' 
                    : 'bg-[#0c0a1f] border border-[#242247] text-slate-300'
                }`}
              >
                <div className="flex items-center gap-2 text-xs">
                  <span className="font-bold text-[#ffd700] w-6 shrink-0">{item.rank}</span>
                  <span>{item.name}</span>
                </div>
                <span className="text-xs font-semibold text-slate-400">{item.points}</span>
              </div>
            ))}
          </div>

          <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-2xl flex gap-2">
            <AlertTriangle className="w-5 h-5 text-[#ffd700] shrink-0" />
            <p className="text-[10px] text-[#ffd700] leading-relaxed">Top 3 representatives receive a bonus 5,000 pts payout at the end of the calendar month.</p>
          </div>
        </div>

      </div>
    </div>
  );
}
