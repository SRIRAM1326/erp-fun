'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { Search, Filter, Plus, FileText, CheckCircle2, Clock, Landmark, AlertCircle } from 'lucide-react';

export default function AdminInvoices() {
  const [invoices, setInvoices] = useState<any[]>([]);
  const [buyers, setBuyers] = useState<any[]>([]);
  const [reps, setReps] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Modal / Form state
  const [modalOpen, setModalOpen] = useState(false);
  const [newInvoiceNumber, setNewInvoiceNumber] = useState('');
  const [newBuyerId, setNewBuyerId] = useState('');
  const [newRepId, setNewRepId] = useState('');
  const [newAmount, setNewAmount] = useState('');
  const [modalError, setModalError] = useState('');
  const [formLoading, setFormLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchInvoices = async () => {
    try {
      const res = await api.get('/admin/invoices');
      setInvoices(res.data);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch invoices.');
    }
  };

  const fetchDependencies = async () => {
    try {
      const resBuyers = await api.get('/admin/buyers');
      setBuyers(resBuyers.data);
      const resReps = await api.get('/admin/reps');
      setReps(resReps.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      await Promise.all([fetchInvoices(), fetchDependencies()]);
      setLoading(false);
    };
    init();
  }, []);

  const handleCreateInvoice = async (e: React.FormEvent) => {
    e.preventDefault();
    setModalError('');
    setFormLoading(true);

    const amt = parseFloat(newAmount);
    if (!newInvoiceNumber.trim() || !newBuyerId || isNaN(amt) || amt <= 0) {
      setModalError('All fields are required and amount must be positive.');
      setFormLoading(false);
      return;
    }

    try {
      await api.post('/admin/invoices', {
        invoice_number: newInvoiceNumber,
        buyer_id: parseInt(newBuyerId),
        rep_id: newRepId ? parseInt(newRepId) : null,
        amount: amt
      });
      setSuccess('Invoice created successfully!');
      setModalOpen(false);
      
      // Reset form
      setNewInvoiceNumber('');
      setNewBuyerId('');
      setNewRepId('');
      setNewAmount('');
      
      await fetchInvoices();
    } catch (err: any) {
      console.error(err);
      setModalError(err.response?.data?.message || 'Failed to create invoice.');
    } finally {
      setFormLoading(false);
    }
  };

  const handlePayInvoice = async (id: number) => {
    if (!confirm('Mark this invoice as Paid? This will calculate and credit points immediately.')) {
      return;
    }
    setError('');
    setSuccess('');
    try {
      const res = await api.post(`/admin/invoices/${id}/pay`);
      setSuccess(`Success! Customer earned ${res.data.points_customer} pts, Representative earned ${res.data.points_rep} pts.`);
      await fetchInvoices();
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to pay invoice.');
    }
  };

  const filteredInvoices = invoices.filter((inv) => {
    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase().trim();
    return (inv.invoice_number && inv.invoice_number.toLowerCase().includes(query)) ||
           (inv.buyer_name && inv.buyer_name.toLowerCase().includes(query)) ||
           (inv.rep_name && inv.rep_name.toLowerCase().includes(query));
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Invoices &amp; Billing</h1>
          <p className="text-sm text-slate-500 mt-1">Manage global wholesale invoices, assign marketing reps, and process payments.</p>
        </div>
        <button 
          onClick={() => setModalOpen(true)}
          className="bg-blue-600 text-white px-4 py-2.5 rounded-lg text-sm font-semibold hover:bg-blue-700 transition-all flex items-center gap-2 shadow-sm"
        >
          <Plus className="w-4 h-4" /> Create Invoice
        </button>
      </div>

      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl flex items-start gap-2">
          <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
          <p className="text-sm text-rose-800 font-medium">{error}</p>
        </div>
      )}

      {success && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-start gap-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
          <p className="text-sm text-emerald-800 font-medium">{success}</p>
        </div>
      )}

      {/* Search Bar */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm flex items-center">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          <input
            type="text"
            placeholder="Search by invoice number or buyer..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 shadow-sm"
          />
        </div>
      </div>

      {/* Table Container */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-slate-50 text-slate-500 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 font-semibold">Invoice ID</th>
                <th className="px-6 py-4 font-semibold">Date</th>
                <th className="px-6 py-4 font-semibold">Buyer (Customer)</th>
                <th className="px-6 py-4 font-semibold">Marketing Rep</th>
                <th className="px-6 py-4 font-semibold text-right">Amount</th>
                <th className="px-6 py-4 font-semibold text-center">Status</th>
                <th className="px-6 py-4 font-semibold text-right">Earning splits</th>
                <th className="px-6 py-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={8} className="px-6 py-8 text-center text-slate-500">Loading invoices...</td>
                </tr>
              ) : filteredInvoices.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-8 text-center text-slate-500">
                    {invoices.length === 0 ? 'No invoices registered in the system.' : 'No invoices matched your search query.'}
                  </td>
                </tr>
              ) : (
                filteredInvoices.map((inv: any) => (
                  <tr key={inv.id} className="hover:bg-slate-50 transition-colors group">
                    <td className="px-6 py-4 font-bold text-slate-900">
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-slate-400" />
                        <span>{inv.invoice_number}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-500">
                      {new Date(inv.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 font-medium text-slate-900">
                      {inv.buyer_name}
                    </td>
                    <td className="px-6 py-4 text-slate-600 font-medium">
                      {inv.rep_name !== 'N/A' ? (
                        <span className="text-purple-600 bg-purple-50 px-2 py-0.5 rounded-full text-xs font-semibold">{inv.rep_name}</span>
                      ) : (
                        <span className="text-slate-400 text-xs italic">Unassigned</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right font-bold text-slate-900">
                      ₹{inv.amount.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-center">
                      {inv.status === 'paid' ? (
                        <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-1 rounded-md text-xs font-semibold">Paid</span>
                      ) : (
                        <span className="bg-amber-50 text-amber-700 border border-amber-200 px-2.5 py-1 rounded-md text-xs font-semibold">Pending</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right text-xs">
                      {inv.status === 'paid' ? (
                        <div className="space-y-0.5 text-slate-600">
                          <p>Customer: <span className="font-semibold text-slate-900">+{inv.points_customer} pts</span></p>
                          <p>Rep: <span className="font-semibold text-slate-900">+{inv.points_rep} pts</span></p>
                        </div>
                      ) : (
                        <span className="text-slate-400 italic">Credits on payment</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      {inv.status !== 'paid' ? (
                        <button 
                          onClick={() => handlePayInvoice(inv.id)}
                          className="bg-emerald-600 text-white hover:bg-emerald-700 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 shadow-sm inline-flex justify-end ml-auto"
                        >
                          <Clock className="w-3.5 h-3.5" /> Mark Paid
                        </button>
                      ) : (
                        <span className="text-xs text-slate-400 font-medium">No actions</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Invoice Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-100 relative">
            <h3 className="text-lg font-bold text-slate-950 mb-2">Create New Invoice</h3>
            <p className="text-xs text-slate-500 mb-6">Create a wholesale invoice. If assigned to a representative, commission rules will evaluate upon payment.</p>
            
            {modalError && (
              <div className="p-3 bg-rose-50 border border-rose-100 rounded-xl mb-4">
                <p className="text-xs font-bold text-rose-700">{modalError}</p>
              </div>
            )}

            <form onSubmit={handleCreateInvoice} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Invoice Number</label>
                <input 
                  type="text" 
                  placeholder="e.g. INV-9901" 
                  value={newInvoiceNumber}
                  onChange={(e) => setNewInvoiceNumber(e.target.value)}
                  className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-blue-500"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Buyer (Customer)</label>
                <select 
                  value={newBuyerId}
                  onChange={(e) => setNewBuyerId(e.target.value)}
                  className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-blue-500"
                  required
                >
                  <option value="">Select Buyer...</option>
                  {buyers.map(b => (
                    <option key={b.id} value={b.id}>{b.business_name || b.name} ({b.name})</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Marketing Representative (Optional)</label>
                <select 
                  value={newRepId}
                  onChange={(e) => setNewRepId(e.target.value)}
                  className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-blue-500"
                >
                  <option value="">None / Direct Store Purchase</option>
                  {reps.map(r => (
                    <option key={r.id} value={r.id}>{r.name}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Invoice Value (INR)</label>
                <input 
                  type="number" 
                  placeholder="e.g. 50000" 
                  value={newAmount}
                  onChange={(e) => setNewAmount(e.target.value)}
                  className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-blue-500"
                  required
                  min="1"
                />
              </div>

              <div className="flex gap-3 justify-end pt-4">
                <button 
                  type="button" 
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 border border-slate-200 text-slate-700 rounded-xl text-sm font-semibold hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={formLoading}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-600/50 text-white rounded-xl text-sm font-semibold transition-colors"
                >
                  {formLoading ? 'Creating...' : 'Create Invoice'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
