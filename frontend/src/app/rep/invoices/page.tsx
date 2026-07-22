'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { FileText, Plus, Search, HelpCircle, CheckCircle2, Clock, Coins, ChevronRight } from 'lucide-react';

export default function RepInvoices() {
  const [invoices, setInvoices] = useState<any[]>([]);
  const [invoiceNumber, setInvoiceNumber] = useState('');
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const fetchInvoices = async () => {
    try {
      const res = await api.get('/rep/invoices');
      setInvoices(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, []);

  const handleLinkInvoice = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (!invoiceNumber.trim()) return;

    setActionLoading(true);
    try {
      const res = await api.post('/rep/invoices/link', { invoice_number: invoiceNumber });
      setSuccess(res.data.message || 'Invoice linked successfully!');
      setInvoiceNumber('');
      fetchInvoices();
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to link invoice. Please check the invoice number.');
    } finally {
      setActionLoading(false);
    }
  };

  // Filter & Search Invoices
  const filteredInvoices = invoices.filter(inv => {
    const matchesSearch = inv.invoice_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          inv.buyer_name.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (filter === 'all') return matchesSearch;
    if (filter === 'paid') return matchesSearch && inv.status === 'paid';
    if (filter === 'pending') return matchesSearch && inv.status === 'pending';
    return matchesSearch;
  });

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-10">
      
      {/* 1. Header Banner (Matching Offerwalls Top Header in Screenshot) */}
      <div className="bg-[#0d7a75] text-white p-6 rounded-3xl shadow-md flex justify-between items-center">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-teal-100 bg-white/10 px-3 py-1 rounded-full border border-white/20">
            Invoices &amp; Commissions
          </span>
          <h1 className="text-2xl font-black mt-1.5">Offerwalls &amp; Link Invoices</h1>
          <p className="text-xs text-teal-100 mt-0.5 font-medium">Link wholesale invoices to earn 1% commission coins on settlement.</p>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6 items-start">
        
        {/* Link Invoice Card */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-5">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
              <Plus className="w-5 h-5 text-[#0d7a75]" /> Link Wholesale Invoice
            </h3>
            <p className="text-xs text-slate-500 mt-0.5 font-medium">Enter customer invoice number to tie sales points.</p>
          </div>

          <form onSubmit={handleLinkInvoice} className="space-y-4">
            {error && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl">
                <p className="text-xs font-bold text-rose-600">{error}</p>
              </div>
            )}
            {success && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl">
                <p className="text-xs font-bold text-emerald-700">{success}</p>
              </div>
            )}

            <div className="space-y-1">
              <label className="text-[10px] uppercase font-extrabold text-slate-600 tracking-wider">Invoice Number</label>
              <input 
                type="text" 
                placeholder="e.g. INV-2247" 
                value={invoiceNumber}
                onChange={(e) => setInvoiceNumber(e.target.value)}
                className="w-full px-4 py-2.5 bg-[#f8faf9] border border-slate-200 rounded-xl text-sm font-bold text-slate-900 focus:outline-none focus:border-[#0d7a75] transition-all"
                required
              />
              <p className="text-[10px] text-slate-400 mt-1 italic font-medium">Type any invoice code for mock auto-link.</p>
            </div>

            <button 
              type="submit" 
              disabled={actionLoading}
              className="w-full bg-[#0d7a75] hover:bg-[#0b6a65] disabled:opacity-50 text-white font-extrabold py-3.5 rounded-xl transition-all shadow-md text-sm flex items-center justify-center gap-1.5"
            >
              {actionLoading ? 'Linking...' : 'Link Invoice'}
            </button>
          </form>

          <div className="p-4 bg-[#f8faf9] border border-slate-200 rounded-2xl space-y-2">
            <h4 className="text-xs font-bold text-[#0d7a75] flex items-center gap-1.5">
              <HelpCircle className="w-4 h-4" /> Commission Rules
            </h4>
            <ul className="text-xs text-slate-600 space-y-1.5 list-disc list-inside font-medium">
              <li>Rep Commission: <b>1% of invoice value</b></li>
              <li>Points credited upon customer payment completion</li>
              <li>Customer receives standard reward points independently</li>
            </ul>
          </div>
        </div>

        {/* Offerwalls / Invoices Feed Column */}
        <div className="md:col-span-2 space-y-4">
          
          {/* Top Tab Bar matching Screenshot ("History" vs "Requests" style) */}
          <div className="bg-white border border-slate-200 rounded-3xl p-3 flex flex-col sm:flex-row gap-3 items-center justify-between shadow-sm">
            
            {/* Search */}
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search invoice or buyer..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-[#f8faf9] border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:border-[#0d7a75]"
              />
            </div>
            
            {/* Tabs matching Screenshot underline style */}
            <div className="flex border-b border-slate-200 w-full sm:w-auto">
              {['all', 'pending', 'paid'].map((t) => (
                <button
                  key={t}
                  onClick={() => setFilter(t)}
                  className={`px-5 py-2 text-xs font-extrabold capitalize transition-all border-b-2 -mb-px ${
                    filter === t 
                      ? 'border-[#0d7a75] text-[#0d7a75]' 
                      : 'border-transparent text-slate-400 hover:text-slate-700'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Offerwalls / Invoice Cards matching Screenshot list style */}
          <div className="space-y-3">
            {loading ? (
              <div className="text-center py-12 text-slate-500 font-bold">Loading invoices...</div>
            ) : filteredInvoices.length === 0 ? (
              <div className="bg-white border border-slate-200 rounded-3xl p-10 text-center text-slate-500 font-bold shadow-sm">
                No invoices found matching criteria.
              </div>
            ) : (
              filteredInvoices.map((inv) => (
                <div key={inv.id} className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm space-y-3 hover:border-[#0d7a75]/40 transition-all">
                  
                  <div className="flex items-center justify-between gap-3">
                    {/* Brand box matching Screenshot Offerwall cards */}
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-[#f0f7f5] border border-[#0d7a75]/30 text-[#0d7a75] flex items-center justify-center font-black text-sm shrink-0">
                        INV
                      </div>
                      <div>
                        <h4 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
                          {inv.invoice_number}
                        </h4>
                        <p className="text-xs text-slate-500 font-medium">Customer: <b className="text-slate-800">{inv.buyer_name}</b></p>
                      </div>
                    </div>

                    <div className="text-right">
                      {inv.status === 'paid' ? (
                        <span className="bg-emerald-100 text-emerald-800 text-xs font-black px-3 py-1 rounded-full inline-flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Paid
                        </span>
                      ) : (
                        <span className="bg-amber-100 text-amber-800 text-xs font-black px-3 py-1 rounded-full inline-flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-amber-600 animate-pulse" /> Pending
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="p-3 bg-[#f8faf9] rounded-2xl flex items-center justify-between border border-slate-100 text-xs">
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Invoice Amount</span>
                      <span className="font-black text-slate-900 text-sm">₹{inv.amount.toLocaleString()}</span>
                    </div>

                    <div className="text-right">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Your 1% Commission</span>
                      <div className="bg-amber-500/15 text-slate-950 font-black px-2.5 py-0.5 rounded-full inline-flex items-center gap-1 text-xs">
                        <Coins className="w-3.5 h-3.5 text-amber-600" />
                        <span>+{inv.status === 'paid' ? inv.points_rep : intPoints(inv.amount * 0.01)} Coins</span>
                      </div>
                    </div>
                  </div>

                </div>
              ))
            )}
          </div>

        </div>

      </div>
    </div>
  );
}

function intPoints(num: number) {
  return Math.round(num).toLocaleString();
}


