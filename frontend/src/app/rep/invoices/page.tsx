'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { FileText, Plus, Search, HelpCircle, CheckCircle2, Clock } from 'lucide-react';

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
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Title */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <span className="text-xs font-bold text-[#8b5cf6] uppercase tracking-wider">Management</span>
          <h1 className="text-3xl font-extrabold text-white tracking-tight mt-1">My Invoices</h1>
          <p className="text-[#8f8bb3] text-sm mt-1">Register invoices issued to referred customers and monitor point breakdowns.</p>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-8 items-start">
        
        {/* Link Invoice Card */}
        <div className="bg-[#14122d] border border-[#242247] rounded-3xl p-6 shadow-xl space-y-6">
          <div>
            <h3 className="font-extrabold text-white text-lg flex items-center gap-2">
              <Plus className="w-5 h-5 text-[#8b5cf6]" /> Link Invoice
            </h3>
            <p className="text-xs text-[#8f8bb3] mt-1">Link a wholesale invoice to receive your 1.0% commission in reward points.</p>
          </div>

          <form onSubmit={handleLinkInvoice} className="space-y-4">
            {error && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl">
                <p className="text-xs font-bold text-red-400">{error}</p>
              </div>
            )}
            {success && (
              <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
                <p className="text-xs font-bold text-emerald-400">{success}</p>
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-[10px] uppercase font-bold text-[#8f8bb3] tracking-wider">Invoice Number</label>
              <input 
                type="text" 
                placeholder="e.g. INV-2247" 
                value={invoiceNumber}
                onChange={(e) => setInvoiceNumber(e.target.value)}
                className="w-full px-4 py-3 bg-[#0c0a1f] border border-[#242247] rounded-xl text-sm font-semibold text-white focus:outline-none focus:border-[#8b5cf6] transition-all"
                required
              />
              <p className="text-[10px] text-[#8f8bb3] mt-1 italic">Type any invoice code; unseeded codes will mock-create automatically for testing.</p>
            </div>

            <button 
              type="submit" 
              disabled={actionLoading}
              className="w-full bg-[#8b5cf6] hover:bg-[#8b5cf6]/80 disabled:bg-[#8b5cf6]/40 text-white font-bold py-3 rounded-xl transition-all shadow-md shadow-[#8b5cf6]/20 flex items-center justify-center gap-1"
            >
              {actionLoading ? 'Linking...' : 'Link Invoice'}
            </button>
          </form>

          <div className="p-4 bg-[#090717]/50 border border-[#242247] rounded-2xl space-y-3">
            <h4 className="text-xs font-bold text-white flex items-center gap-1"><HelpCircle className="w-3.5 h-3.5 text-[#ffd700]" /> Earning Rules</h4>
            <ul className="text-[11px] text-[#8f8bb3] space-y-2 list-disc list-inside">
              <li>Rep Commission: 1% of total invoice value.</li>
              <li>Commission credits <b className="text-white">only after</b> customer completes invoice payment.</li>
              <li>Customer receives full standard points independently (doubled if paid within 7 days).</li>
            </ul>
          </div>
        </div>

        {/* Linked Invoices Feed */}
        <div className="md:col-span-2 space-y-6">
          
          {/* Filters and Search */}
          <div className="bg-[#14122d] border border-[#242247] rounded-3xl p-4 flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8f8bb3]" />
              <input 
                type="text" 
                placeholder="Search invoices or customer..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-[#0c0a1f] border border-[#242247] rounded-xl text-xs font-semibold text-white focus:outline-none focus:border-[#8b5cf6] transition-all"
              />
            </div>
            
            <div className="flex gap-2 w-full sm:w-auto">
              {['all', 'pending', 'paid'].map((t) => (
                <button
                  key={t}
                  onClick={() => setFilter(t)}
                  className={`flex-1 sm:flex-none px-4 py-2 rounded-xl text-xs font-bold capitalize transition-all border ${
                    filter === t 
                      ? 'bg-[#8b5cf6] text-white border-[#8b5cf6] shadow-md shadow-[#8b5cf6]/20' 
                      : 'bg-[#0c0a1f] text-[#8f8bb3] border-[#242247] hover:text-white'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* List */}
          <div className="space-y-4">
            {loading ? (
              <div className="text-center py-12 text-[#8f8bb3] font-semibold">Loading linked invoices...</div>
            ) : filteredInvoices.length === 0 ? (
              <div className="bg-[#14122d] border border-[#242247] rounded-3xl p-12 text-center text-[#8f8bb3] font-semibold">
                No invoices found matching criteria.
              </div>
            ) : (
              filteredInvoices.map((inv) => (
                <div key={inv.id} className="bg-[#14122d] border border-[#242247] rounded-3xl p-6 space-y-4 shadow-xl">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-extrabold text-white text-base flex items-center gap-2">
                        <FileText className="w-4 h-4 text-[#8b5cf6]" /> {inv.invoice_number}
                      </h4>
                      <p className="text-xs text-[#8f8bb3] mt-1">Customer: <b className="text-white">{inv.buyer_name}</b> &middot; Issued {new Date(inv.created_at).toLocaleDateString()}</p>
                    </div>
                    <div>
                      {inv.status === 'paid' ? (
                        <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-bold px-3 py-1 rounded-xl flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Paid & Credited
                        </span>
                      ) : (
                        <span className="bg-amber-500/10 text-amber-400 border border-amber-500/20 text-xs font-bold px-3 py-1 rounded-xl flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 animate-pulse" /> Awaiting Payment
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="p-4 bg-[#0c0a1f] rounded-2xl flex items-center justify-between border border-[#242247]">
                    <div>
                      <p className="text-[10px] uppercase font-bold text-[#8f8bb3] tracking-wider">Invoice value</p>
                      <p className="text-lg font-black text-white">₹{inv.amount.toLocaleString()}</p>
                    </div>
                    {inv.status === 'paid' && inv.paid_at && (
                      <div className="text-right">
                        <p className="text-[10px] uppercase font-bold text-[#8f8bb3] tracking-wider">Paid On</p>
                        <p className="text-xs font-bold text-slate-300">{new Date(inv.paid_at).toLocaleDateString()}</p>
                      </div>
                    )}
                  </div>

                  {/* Split Grid */}
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="p-4 bg-[#8b5cf6]/10 border border-[#8b5cf6]/20 rounded-2xl">
                      <p className="text-[10px] uppercase font-bold text-[#8b5cf6] tracking-wider">Rep Rewards Commission</p>
                      <p className="text-2xl font-black text-white mt-1">
                        {inv.status === 'paid' ? inv.points_rep : intPoints(inv.amount * 0.01)} <span className="text-xs font-semibold text-[#8f8bb3]">PTS</span>
                      </p>
                      <p className="text-[10px] text-[#8f8bb3] mt-1">1% of invoice total</p>
                    </div>
                    <div className="p-4 bg-[#090717] border border-[#242247] rounded-2xl">
                      <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Customer Rewards Earned</p>
                      <p className="text-2xl font-black text-white mt-1">
                        {inv.status === 'paid' ? inv.points_customer : `Up to ${intPoints(inv.amount * 0.02)}`} <span className="text-xs font-semibold text-[#8f8bb3]">PTS</span>
                      </p>
                      <p className="text-[10px] text-[#8f8bb3] mt-1">Base 1%, doubled if paid within 7 days</p>
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
