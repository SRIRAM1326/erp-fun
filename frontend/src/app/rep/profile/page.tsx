'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { User, Copy, Check, BarChart2, ShieldCheck, Mail } from 'lucide-react';

export default function RepProfile() {
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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#8b5cf6]"></div>
      </div>
    );
  }

  const verfiedBuyersCount = data?.referred_buyers?.filter((b: any) => b.is_verified).length || 0;
  const conversionRate = data?.referred_buyers?.length > 0 
    ? Math.round((verfiedBuyersCount / data.referred_buyers.length) * 100) 
    : 100;

  return (
    <div className="space-y-8 max-w-2xl mx-auto">
      {/* Title */}
      <div>
        <span className="text-xs font-bold text-[#8b5cf6] uppercase tracking-wider">Account</span>
        <h1 className="text-3xl font-extrabold text-white tracking-tight mt-1">My Profile</h1>
        <p className="text-[#8f8bb3] text-sm mt-1">Manage your credentials, view metrics, and copy your referral code.</p>
      </div>

      {/* Profile Header */}
      <div className="bg-[#14122d] border border-[#242247] rounded-3xl p-6 shadow-xl flex flex-col sm:flex-row gap-6 items-center">
        <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-[#8b5cf6] to-[#ec4899] flex items-center justify-center text-3xl font-black text-white shadow-xl shadow-[#8b5cf6]/10 shrink-0">
          {(() => {
            const name = data?.name || 'Representative';
            const parts = name.split(' ');
            if (parts.length >= 2) {
              return (parts[0][0] + parts[1][0]).toUpperCase();
            }
            return name.slice(0, 2).toUpperCase();
          })()}
        </div>
        <div className="text-center sm:text-left space-y-1">
          <h2 className="text-xl font-extrabold text-white">{data?.name || 'Representative'}</h2>
          <p className="text-xs font-bold text-[#8b5cf6] uppercase tracking-wider">Marketing Representative</p>
          <div className="flex items-center gap-1.5 text-xs text-[#8f8bb3] justify-center sm:justify-start">
            <Mail className="w-3.5 h-3.5" />
            <span>{data?.email || 'rep@sales.com'}</span>
          </div>
        </div>
      </div>

      {/* Referral Code Box */}
      <div className="bg-gradient-to-r from-[#1e1b4b] to-[#14122d] border border-[#242247] rounded-3xl p-6 shadow-xl space-y-4">
        <div>
          <h3 className="font-bold text-white text-base">Your Representative Referral Code</h3>
          <p className="text-xs text-[#8f8bb3] mt-1">Provide this code to store owners when onboarding them. You will receive 1,000 points upon their verification and 1% of all invoices paid.</p>
        </div>
        <div className="flex gap-2">
          <div className="flex-1 bg-[#0c0a1f] px-4 py-3 rounded-xl border border-[#242247] font-mono text-[#ffd700] font-bold text-base flex items-center justify-between">
            <span>{data?.referral_code || 'REF-PENDING'}</span>
          </div>
          <button 
            onClick={handleCopyCode}
            className="bg-[#8b5cf6] hover:bg-[#8b5cf6]/80 text-white p-3 rounded-xl transition-all shadow-md shadow-[#8b5cf6]/20 flex items-center justify-center"
          >
            {copied ? <Check className="w-5 h-5 text-emerald-400" /> : <Copy className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Performance Analytics */}
      <div className="bg-[#14122d] border border-[#242247] rounded-3xl p-6 shadow-xl space-y-6">
        <h3 className="font-bold text-white text-base flex items-center gap-2">
          <BarChart2 className="w-5 h-5 text-[#8b5cf6]" /> Performance Analytics
        </h3>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 bg-[#0c0a1f] border border-[#242247] rounded-2xl">
            <p className="text-[10px] uppercase font-bold text-[#8f8bb3] tracking-wider">Store Conversion Rate</p>
            <p className="text-2xl font-black text-white mt-1">{conversionRate}%</p>
            <p className="text-[10px] text-[#8f8bb3] mt-1">{verfiedBuyersCount} verified of {data?.referred_buyers?.length || 0} referred</p>
          </div>
          <div className="p-4 bg-[#0c0a1f] border border-[#242247] rounded-2xl">
            <p className="text-[10px] uppercase font-bold text-[#8f8bb3] tracking-wider">Average Invoice Value</p>
            <p className="text-2xl font-black text-white mt-1">
              ₹{data?.total_invoices > 0 ? Math.round(data.total_value / data.total_invoices).toLocaleString() : '0'}
            </p>
            <p className="text-[10px] text-[#8f8bb3] mt-1">Based on {data?.total_invoices || 0} invoices</p>
          </div>
        </div>
      </div>

      {/* Security Chip */}
      <div className="flex items-center gap-3 justify-center p-4 bg-[#14122d]/40 border border-[#242247] rounded-2xl max-w-xs mx-auto">
        <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
        <p className="text-xs font-semibold text-[#8f8bb3]">Authorized Sales Rep Profile.</p>
      </div>
    </div>
  );
}
