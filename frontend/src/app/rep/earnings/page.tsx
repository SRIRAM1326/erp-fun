'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { Wallet, Landmark, Gift, Award, CheckCircle2, AlertTriangle, Coins, Smartphone, CreditCard, ChevronRight, Check } from 'lucide-react';

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
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-[#0d7a75]"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-10">
      
      {/* 1. Top Payout Header Banner (Matching Payout List Screen in Screenshot) */}
      <div className="bg-[#0d7a75] text-white p-6 rounded-3xl shadow-md text-center relative overflow-hidden flex flex-col items-center justify-center">
        <span className="text-xs font-bold uppercase tracking-wider text-teal-100 bg-white/10 px-3 py-1 rounded-full border border-white/20">
          Payout Vault
        </span>
        <h1 className="text-2xl font-black mt-2">Payout List &amp; Cash Out</h1>
        
        {/* Coin Stack Illustration Circle matching screenshot */}
        <div className="my-4 w-20 h-20 rounded-full bg-white/15 border-2 border-amber-300 flex flex-col items-center justify-center shadow-inner">
          <Coins className="w-9 h-9 text-amber-300 animate-pulse" />
        </div>

        <div className="text-center">
          <p className="text-xs text-teal-100 font-bold uppercase tracking-wider">Total Coins Balance</p>
          <p className="text-4xl font-black text-white mt-0.5">{(data?.points || 5879).toLocaleString()}</p>
        </div>
      </div>

      {/* 2. Payout Channels Grid (Matching 4 Vibrant Rounded Payout Buttons in Screenshot) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        
        {/* Blue: Bank Transfer */}
        <div className="bg-[#2563eb] text-white p-4 rounded-3xl shadow-md flex flex-col justify-between h-28">
          <div className="flex justify-between items-start">
            <Landmark className="w-6 h-6 text-white" />
            <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded-full font-bold">Instant</span>
          </div>
          <div>
            <h4 className="font-extrabold text-sm">Direct Bank</h4>
            <p className="text-[10px] text-white/80 font-semibold">1 Point = ₹1 Cash</p>
          </div>
        </div>

        {/* Magenta/Pink: UPI / Paytm */}
        <div className="bg-[#ec4899] text-white p-4 rounded-3xl shadow-md flex flex-col justify-between h-28">
          <div className="flex justify-between items-start">
            <CreditCard className="w-6 h-6 text-white" />
            <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded-full font-bold">Popular</span>
          </div>
          <div>
            <h4 className="font-extrabold text-sm">UPI Transfer</h4>
            <p className="text-[10px] text-white/80 font-semibold">Fast Verification</p>
          </div>
        </div>

        {/* Purple: Recharge */}
        <div className="bg-[#7c3aed] text-white p-4 rounded-3xl shadow-md flex flex-col justify-between h-28">
          <div className="flex justify-between items-start">
            <Smartphone className="w-6 h-6 text-white" />
            <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded-full font-bold">24/7</span>
          </div>
          <div>
            <h4 className="font-extrabold text-sm">Mobile Refill</h4>
            <p className="text-[10px] text-white/80 font-semibold">Top Up Account</p>
          </div>
        </div>

        {/* Emerald: Gift Cards */}
        <div className="bg-[#10b981] text-white p-4 rounded-3xl shadow-md flex flex-col justify-between h-28">
          <div className="flex justify-between items-start">
            <Gift className="w-6 h-6 text-white" />
            <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded-full font-bold">Catalog</span>
          </div>
          <div>
            <h4 className="font-extrabold text-sm">Reward Catalog</h4>
            <p className="text-[10px] text-white/80 font-semibold">High Value Products</p>
          </div>
        </div>

      </div>

      <div className="grid md:grid-cols-3 gap-6 items-start">
        
        {/* Cash Payout Form Column */}
        <div className="md:col-span-2 space-y-6">
          
          {/* Direct Bank Cash Out Form */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-5">
            <div className="border-b border-slate-100 pb-3">
              <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
                <Landmark className="w-5 h-5 text-[#0d7a75]" /> Direct Bank Payout Request
              </h3>
              <p className="text-xs text-slate-500 mt-0.5 font-medium">Redeem points for real-time bank deposits at ₹1 per point.</p>
            </div>

            {cashError && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl">
                <p className="text-xs font-bold text-rose-600">{cashError}</p>
              </div>
            )}
            {cashSuccess && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <p className="text-xs font-bold text-emerald-700">{cashSuccess}</p>
              </div>
            )}

            <form onSubmit={handleCashRedeem} className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-extrabold text-slate-600 tracking-wider">Points to Redeem</label>
                  <input 
                    type="number" 
                    placeholder="e.g. 5000" 
                    value={cashAmount}
                    onChange={(e) => setCashAmount(e.target.value)}
                    min="1"
                    max={data?.points}
                    className="w-full px-4 py-2.5 bg-[#f8faf9] border border-slate-200 rounded-xl text-sm font-bold text-slate-900 focus:outline-none focus:border-[#0d7a75] transition-all"
                    required
                  />
                  {cashAmount && (
                    <span className="text-[11px] text-emerald-600 font-bold block mt-1">Equals ₹{(parseInt(cashAmount) || 0).toLocaleString()} Bank Transfer</span>
                  )}
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-extrabold text-slate-600 tracking-wider">Bank Name</label>
                  <input 
                    type="text" 
                    placeholder="e.g. HDFC Bank" 
                    value={bankName}
                    onChange={(e) => setBankName(e.target.value)}
                    className="w-full px-4 py-2.5 bg-[#f8faf9] border border-slate-200 rounded-xl text-sm font-bold text-slate-900 focus:outline-none focus:border-[#0d7a75] transition-all"
                    required
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-extrabold text-slate-600 tracking-wider">Account Number</label>
                  <input 
                    type="text" 
                    placeholder="e.g. 501002345678" 
                    value={accountNumber}
                    onChange={(e) => setAccountNumber(e.target.value)}
                    className="w-full px-4 py-2.5 bg-[#f8faf9] border border-slate-200 rounded-xl text-sm font-bold text-slate-900 focus:outline-none focus:border-[#0d7a75] transition-all"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-extrabold text-slate-600 tracking-wider">IFSC Code</label>
                  <input 
                    type="text" 
                    placeholder="e.g. HDFC0000240" 
                    value={ifscCode}
                    onChange={(e) => setIfscCode(e.target.value)}
                    className="w-full px-4 py-2.5 bg-[#f8faf9] border border-slate-200 rounded-xl text-sm font-bold text-slate-900 focus:outline-none focus:border-[#0d7a75] transition-all"
                    required
                  />
                </div>
              </div>

              <button 
                type="submit" 
                disabled={cashLoading}
                className="w-full bg-[#0d7a75] hover:bg-[#0b6a65] disabled:opacity-50 text-white font-extrabold py-3.5 rounded-xl transition-all shadow-md flex items-center justify-center gap-2 text-sm"
              >
                {cashLoading ? 'Submitting Request...' : 'Submit Bank Payout Request'}
              </button>
            </form>
          </div>

          {/* Premium Catalog Rewards Store */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4">
            <div>
              <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
                <Gift className="w-5 h-5 text-[#0d7a75]" /> Premium Catalog Rewards
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">Claim top-tier electronics once you cross point milestones.</p>
            </div>

            {productError && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl">
                <p className="text-xs font-bold text-rose-600">{productError}</p>
              </div>
            )}
            {productSuccess && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <p className="text-xs font-bold text-emerald-700">{productSuccess}</p>
              </div>
            )}

            <div className="grid sm:grid-cols-2 gap-4">
              {catalogProducts.map((p) => {
                const canAfford = (data?.points || 0) >= p.points;
                return (
                  <div key={p.name} className="p-4 bg-[#f8faf9] border border-slate-200 rounded-2xl flex flex-col justify-between hover:border-[#0d7a75]/40 transition-all">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-3xl">{p.icon}</span>
                        <span className={`text-[10px] font-black px-2.5 py-0.5 rounded-full ${
                          canAfford ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-900'
                        }`}>
                          {p.points.toLocaleString()} pts
                        </span>
                      </div>
                      <h4 className="font-extrabold text-slate-900 text-sm">{p.name}</h4>
                      <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">{p.description}</p>
                    </div>

                    <button
                      onClick={() => handleProductRedeem(p.name, p.points)}
                      disabled={productLoading}
                      className={`w-full text-xs font-extrabold py-2.5 px-3 mt-4 rounded-xl transition-all ${
                        canAfford 
                          ? 'bg-[#0d7a75] text-white hover:bg-[#0b6a65] shadow-sm' 
                          : 'bg-slate-200 text-slate-500 cursor-not-allowed'
                      }`}
                    >
                      {canAfford ? 'Redeem Product' : 'Points Required'}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

        {/* Regional Leaderboard Column */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-5">
          <div>
            <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-500" /> Regional Leaderboard
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">Top performing sales representatives this month.</p>
          </div>

          <div className="space-y-2.5">
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
                    ? 'bg-[#f0f7f5] border-l-4 border-[#0d7a75] font-extrabold text-[#0d7a75]' 
                    : 'bg-[#f8faf9] border border-slate-100 text-slate-700'
                }`}
              >
                <div className="flex items-center gap-2 text-xs">
                  <span className="font-black text-amber-600 w-6 shrink-0">{item.rank}</span>
                  <span>{item.name}</span>
                </div>
                <span className="text-xs font-bold text-slate-600">{item.points}</span>
              </div>
            ))}
          </div>

          <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-2xl flex gap-2.5 items-start">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <p className="text-[11px] font-bold text-amber-800 leading-relaxed">
              Top 3 representatives receive a bonus 5,000 pts payout at the end of the month.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}


