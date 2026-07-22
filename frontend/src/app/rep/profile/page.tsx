'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { User, Copy, Check, BarChart2, ShieldCheck, Mail, Coins, Share2, HelpCircle, MessageSquare, Star, FileText, Lock, LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function RepProfile() {
  const router = useRouter();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
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
    fetchDashboard();
  }, []);

  const handleCopyCode = () => {
    if (data?.referral_code) {
      navigator.clipboard.writeText(data.referral_code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/login');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-[#0d7a75]"></div>
      </div>
    );
  }

  const verfiedBuyersCount = data?.referred_buyers?.filter((b: any) => b.is_verified).length || 0;
  const conversionRate = data?.referred_buyers?.length > 0 
    ? Math.round((verfiedBuyersCount / data.referred_buyers.length) * 100) 
    : 100;

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-10">
      
      {/* 1. Header Banner (Matching My Account / Refer & Earn Top Teal Header in Screenshot) */}
      <div className="bg-[#0d7a75] text-white p-6 pb-16 rounded-b-3xl md:rounded-3xl shadow-md text-center relative overflow-hidden">
        <span className="text-xs font-bold uppercase tracking-wider text-teal-100 bg-white/10 px-3 py-1 rounded-full border border-white/20">
          Account Settings
        </span>
        <h1 className="text-2xl font-black mt-2">My Account</h1>
      </div>

      {/* 2. Overlapping Centered Profile Card (Matching My Account Screen in Screenshot) */}
      <div className="-mt-14 max-w-2xl mx-auto px-4">
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-md text-center space-y-3 relative z-10">
          
          {/* Centered Avatar Image/Circle */}
          <div className="w-20 h-20 rounded-full bg-[#0d7a75] text-white font-black text-2xl flex items-center justify-center mx-auto shadow-md border-4 border-white -mt-12">
            {(() => {
              const name = data?.name || 'Representative';
              const parts = name.split(' ');
              if (parts.length >= 2) {
                return (parts[0][0] + parts[1][0]).toUpperCase();
              }
              return name.slice(0, 2).toUpperCase();
            })()}
          </div>

          <div>
            <h2 className="text-xl font-black text-slate-900">{data?.name || 'Representative Name'}</h2>
            <p className="text-xs text-slate-500 font-medium">{data?.email || 'rep@partner.com'}</p>
          </div>

          {/* Total Coins Pill matching Screenshot */}
          <div className="inline-flex items-center justify-between gap-3 bg-[#0d7a75] text-white px-5 py-2 rounded-2xl shadow-sm">
            <span className="text-xs font-bold text-teal-100 uppercase">Total Coins</span>
            <div className="flex items-center gap-1.5 bg-[#f59e0b] text-slate-950 font-black text-xs px-3 py-1 rounded-full shadow">
              <Coins className="w-4 h-4 text-slate-950" />
              <span>{(data?.points || 5879).toLocaleString()} Coins</span>
            </div>
          </div>

        </div>
      </div>

      {/* 3. Refer & Earn Card (Matching Refer & Earn Screen in Screenshot) */}
      <div className="max-w-2xl mx-auto px-4">
        <div className="bg-gradient-to-br from-[#0d7a75] to-[#085a56] text-white rounded-3xl p-6 shadow-md space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center text-amber-300 shrink-0">
              <Share2 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-extrabold text-white text-base">Spread the word &amp; Refer Stores!</h3>
              <p className="text-xs text-teal-100 font-medium">Share your referral code with store owners. You earn 1,000 coins + 1% invoice commissions for life!</p>
            </div>
          </div>

          {/* Referral Code Box with Copy Button matching Screenshot */}
          <div className="bg-white p-3 rounded-2xl flex items-center justify-between gap-3 shadow-inner">
            <span className="font-mono text-slate-900 font-black text-lg px-2 tracking-wider">
              {data?.referral_code || '1D235DA'}
            </span>

            <button 
              onClick={handleCopyCode}
              className="bg-[#2563eb] hover:bg-blue-700 text-white font-extrabold text-xs px-5 py-2.5 rounded-xl transition-all shadow flex items-center gap-1.5 shrink-0"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-300" /> Copied!
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" /> COPY CODE
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* 4. Menu List Items (Matching My Account List Items in Screenshot) */}
      <div className="max-w-2xl mx-auto px-4 space-y-3">
        
        {/* Support */}
        <div className="bg-white border border-slate-200 rounded-2xl p-3.5 shadow-sm flex items-center justify-between hover:bg-slate-50 transition-all">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center shrink-0">
              <HelpCircle className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-slate-900 text-sm">Support</h4>
              <p className="text-[11px] text-slate-400">Need help? Email us or call</p>
            </div>
          </div>
        </div>

        {/* Suggestions */}
        <div className="bg-white border border-slate-200 rounded-2xl p-3.5 shadow-sm flex items-center justify-between hover:bg-slate-50 transition-all">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-slate-900 text-sm">Suggestions</h4>
              <p className="text-[11px] text-slate-400">Give opinion about the app</p>
            </div>
          </div>
        </div>

        {/* FAQs */}
        <div className="bg-white border border-slate-200 rounded-2xl p-3.5 shadow-sm flex items-center justify-between hover:bg-slate-50 transition-all">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
              <HelpCircle className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-slate-900 text-sm">FAQs Description</h4>
              <p className="text-[11px] text-slate-400">Check the FAQs</p>
            </div>
          </div>
        </div>

        {/* Rate Us */}
        <div className="bg-white border border-slate-200 rounded-2xl p-3.5 shadow-sm flex items-center justify-between hover:bg-slate-50 transition-all">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center shrink-0">
              <Star className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-slate-900 text-sm">Rate Us</h4>
              <p className="text-[11px] text-slate-400">Enjoying the app? Share your opinion</p>
            </div>
          </div>
        </div>

        {/* Logout */}
        <button 
          onClick={handleLogout}
          className="w-full bg-white border border-rose-200 rounded-2xl p-3.5 shadow-sm flex items-center justify-between hover:bg-rose-50 transition-all text-left"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center shrink-0">
              <LogOut className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-rose-600 text-sm">Logout</h4>
              <p className="text-[11px] text-rose-400">Sign out of account</p>
            </div>
          </div>
        </button>

      </div>

    </div>
  );
}


