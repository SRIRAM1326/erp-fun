'use client';

import { useEffect, useState, useMemo } from 'react';
import { api } from '@/lib/api';
import {
  Award, Users, FileText, Wallet, TrendingUp, X, CheckCircle2,
  AlertTriangle, Phone, Plus, Edit2, PowerOff, Power,
  Trash2, RefreshCw, ArrowUpRight, ShoppingBag, BarChart3,
  Clock, BadgeCheck, ChevronDown, ChevronUp, Calendar
} from 'lucide-react';

const EMPTY_FORM = { name: '', email: '', phone: '', password: 'rep123' };

export default function AdminReps() {
  const [reps, setReps] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRep, setSelectedRep] = useState<any | null>(null);
  const [repInvoices, setRepInvoices] = useState<any[]>([]);
  const [invoicesLoading, setInvoicesLoading] = useState(false);
  const [invoiceTimeFilter, setInvoiceTimeFilter] = useState<'day' | 'week' | 'month' | 'all'>('month');

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [editingRep, setEditingRep] = useState<any | null>(null);
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [formError, setFormError] = useState('');
  const [formLoading, setFormLoading] = useState(false);

  const fetchReps = async () => {
    setLoading(true);
    try {
      const res = await api.get('/admin/reps');
      setReps(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectRep = async (rep: any) => {
    if (selectedRep?.id === rep.id) {
      setSelectedRep(null);
      setRepInvoices([]);
      return;
    }
    setSelectedRep(rep);
    setInvoicesLoading(true);
    try {
      const res = await api.get(`/admin/reps/${rep.id}/invoices`);
      setRepInvoices(res.data);
    } catch (err) {
      console.error(err);
      setRepInvoices([]);
    } finally {
      setInvoicesLoading(false);
    }
  };

  const openCreateModal = () => {
    setEditingRep(null);
    setFormData(EMPTY_FORM);
    setFormError('');
    setShowModal(true);
  };

  const openEditModal = (rep: any, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingRep(rep);
    setFormData({ name: rep.name, email: rep.email, phone: rep.phone || '', password: '' });
    setFormError('');
    setShowModal(true);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);
    setFormError('');
    try {
      if (editingRep) {
        await api.patch(`/admin/reps/${editingRep.id}`, formData);
      } else {
        await api.post('/admin/reps', formData);
      }
      setShowModal(false);
      fetchReps();
    } catch (err: any) {
      setFormError(err?.response?.data?.message || 'Something went wrong');
    } finally {
      setFormLoading(false);
    }
  };

  const handleToggleActive = async (rep: any, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await api.patch(`/admin/reps/${rep.id}`, { is_active: !rep.is_active });
      fetchReps();
      if (selectedRep?.id === rep.id) setSelectedRep({ ...selectedRep, is_active: !rep.is_active });
    } catch (err) { console.error(err); }
  };

  const handleDelete = async (rep: any, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm(`Delete representative "${rep.name}"? This cannot be undone.`)) return;
    try {
      await api.delete(`/admin/reps/${rep.id}`);
      if (selectedRep?.id === rep.id) { setSelectedRep(null); setRepInvoices([]); }
      fetchReps();
    } catch (err) { console.error(err); }
  };

  useEffect(() => { fetchReps(); }, []);

  const summaryStats = reps.reduce((acc, r) => ({
    total: acc.total + 1,
    active: acc.active + (r.is_active ? 1 : 0),
    totalSales: acc.totalSales + r.total_sales,
    creditedPoints: acc.creditedPoints + r.credited_points,
    pendingPoints: acc.pendingPoints + r.pending_points,
  }), { total: 0, active: 0, totalSales: 0, creditedPoints: 0, pendingPoints: 0 });

  const filteredInvoices = useMemo(() => {
    if (!repInvoices || repInvoices.length === 0) return [];
    if (invoiceTimeFilter === 'all') return repInvoices;

    const now = new Date();
    return repInvoices.filter((inv) => {
      if (!inv.created_at) return true;
      const invDate = new Date(inv.created_at);
      const diffMs = now.getTime() - invDate.getTime();
      if (diffMs < 0) return true;
      const diffDays = diffMs / (1000 * 60 * 60 * 24);

      if (invoiceTimeFilter === 'day') return diffDays <= 1;
      if (invoiceTimeFilter === 'week') return diffDays <= 7;
      if (invoiceTimeFilter === 'month') return diffDays <= 30;
      return true;
    });
  }, [repInvoices, invoiceTimeFilter]);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Marketing Representative Oversight</h1>
          <p className="text-sm text-slate-500 mt-1">Manage reps, track referral performance, and monitor earnings in real time.</p>
        </div>
        <div className="flex gap-2">
          <button onClick={fetchReps} className="bg-white border border-slate-200 text-slate-700 px-3 py-2 rounded-lg text-sm font-medium hover:bg-slate-50 flex items-center gap-2 shadow-sm">
            <RefreshCw className="w-4 h-4" /> Refresh
          </button>
          <button onClick={openCreateModal} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 shadow-sm transition-colors">
            <Plus className="w-4 h-4" /> Add Representative
          </button>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {[
          { label: 'Total Reps', value: summaryStats.total, icon: Award, color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'Active Reps', value: summaryStats.active, icon: BadgeCheck, color: 'text-emerald-600', bg: 'bg-emerald-50' },
          { label: 'Total Sales', value: `₹${(summaryStats.totalSales / 100000).toFixed(1)}L`, icon: ShoppingBag, color: 'text-purple-600', bg: 'bg-purple-50' },
          { label: 'Credited Points', value: summaryStats.creditedPoints.toLocaleString(), icon: CheckCircle2, color: 'text-teal-600', bg: 'bg-teal-50' },
          { label: 'Pending Points', value: summaryStats.pendingPoints.toLocaleString(), icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50' },
        ].map((card) => {
          const Icon = card.icon;
          return (
            <div key={card.label} className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
              <div className={`w-8 h-8 rounded-lg ${card.bg} flex items-center justify-center mb-3`}>
                <Icon className={`w-4 h-4 ${card.color}`} />
              </div>
              <p className="text-xl font-bold text-slate-900">{card.value}</p>
              <p className="text-xs text-slate-500 font-medium mt-0.5">{card.label}</p>
            </div>
          );
        })}
      </div>

      {/* Main Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-slate-900">Registered Representatives</h3>
            <p className="text-xs text-slate-500 mt-0.5">Click any row to view their invoice details and referral audit trail.</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-slate-50 text-slate-500 border-b border-slate-200 font-semibold text-xs uppercase tracking-wider">
              <tr>
                <th className="px-5 py-3">Representative</th>
                <th className="px-5 py-3">Contact</th>
                <th className="px-5 py-3 text-center">Total Invoices</th>
                <th className="px-5 py-3 text-right">Total Sales</th>
                <th className="px-5 py-3 text-right">Pending Points</th>
                <th className="px-5 py-3 text-right">Credited Points</th>
                <th className="px-5 py-3 text-center">Status</th>
                <th className="px-5 py-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {loading ? (
                <tr><td colSpan={8} className="px-6 py-10 text-center text-slate-500">Loading representatives...</td></tr>
              ) : reps.length === 0 ? (
                <tr><td colSpan={8} className="px-6 py-10 text-center text-slate-500">No representatives registered. Click "Add Representative" to get started.</td></tr>
              ) : (
                reps.map((rep) => (
                  <>
                    <tr
                      key={rep.id}
                      onClick={() => handleSelectRep(rep)}
                      className={`hover:bg-purple-50/20 cursor-pointer transition-colors ${selectedRep?.id === rep.id ? 'bg-purple-50/40 border-l-4 border-l-purple-600' : ''} ${!rep.is_active ? 'opacity-60' : ''}`}
                    >
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm shadow-sm ${rep.is_active ? 'bg-purple-600 text-white' : 'bg-slate-300 text-slate-600'}`}>
                            {rep.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-semibold text-slate-900 text-sm">{rep.name}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <p className="text-xs text-slate-600 flex items-center gap-1">
                          <Phone className="w-3 h-3" /> {rep.phone || 'N/A'}
                        </p>
                      </td>
                      <td className="px-5 py-4 text-center">
                        <span className="font-bold text-slate-900 flex items-center justify-center gap-1">
                          <FileText className="w-3.5 h-3.5 text-slate-400" /> {rep.total_invoices_count}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-right">
                        <span className="font-bold text-slate-900 text-xs">₹{rep.total_sales.toLocaleString()}</span>
                      </td>
                      <td className="px-5 py-4 text-right">
                        <span className="text-amber-600 font-bold text-xs">{rep.pending_points.toLocaleString()} pts</span>
                      </td>
                      <td className="px-5 py-4 text-right">
                        <span className="text-emerald-600 font-bold text-xs">+{rep.credited_points.toLocaleString()} pts</span>
                      </td>
                      <td className="px-5 py-4 text-center">
                        {rep.is_active ? (
                          <span className="inline-flex items-center gap-1 bg-emerald-50 border border-emerald-200 text-emerald-700 text-[10px] px-2 py-0.5 rounded-full font-bold">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" /> Active
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 bg-slate-100 border border-slate-200 text-slate-500 text-[10px] px-2 py-0.5 rounded-full font-bold">
                            <span className="w-1.5 h-1.5 rounded-full bg-slate-400 inline-block" /> Inactive
                          </span>
                        )}
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={(e) => openEditModal(rep, e)}
                            title="Edit"
                            className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={(e) => handleToggleActive(rep, e)}
                            title={rep.is_active ? 'Deactivate' : 'Activate'}
                            className={`p-1.5 rounded-lg transition-colors ${rep.is_active ? 'text-slate-400 hover:text-amber-600 hover:bg-amber-50' : 'text-slate-400 hover:text-emerald-600 hover:bg-emerald-50'}`}
                          >
                            {rep.is_active ? <PowerOff className="w-3.5 h-3.5" /> : <Power className="w-3.5 h-3.5" />}
                          </button>
                          <button
                            onClick={(e) => handleDelete(rep, e)}
                            title="Delete"
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleSelectRep(rep)}
                            title={selectedRep?.id === rep.id ? 'Collapse' : 'View Invoices'}
                            className="p-1.5 text-slate-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                          >
                            {selectedRep?.id === rep.id ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                          </button>
                        </div>
                      </td>
                    </tr>
 
                    {/* Expandable Invoice Oversight Panel */}
                    {selectedRep?.id === rep.id && (
                      <tr key={`${rep.id}-invoices`}>
                        <td colSpan={8} className="px-0 py-0 bg-purple-50/30 border-b border-purple-100">
                          <div className="p-5 space-y-4">

                            {/* Info note */}
                            <div className="bg-blue-50 border border-blue-100 rounded-lg px-4 py-2.5 text-xs text-blue-800 font-medium">
                              <strong>Pending points</strong> = 1% referral reward waiting for customer payment confirmation. &nbsp;
                              <strong>Credited points</strong> = rewards already approved and issued after invoice payment.
                            </div>

                            {/* Invoice list */}
                            <div>
                              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3 pb-2 border-b border-purple-100/60">
                                <div>
                                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                                    <Calendar className="w-3.5 h-3.5 text-purple-600" /> Linked Invoice Details
                                  </h4>
                                  <p className="text-[11px] text-slate-500 mt-0.5">
                                    Showing {filteredInvoices.length} {filteredInvoices.length === 1 ? 'invoice' : 'invoices'}
                                    {invoiceTimeFilter !== 'all' && ` in the last ${invoiceTimeFilter}`}
                                  </p>
                                </div>
                                <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-xl p-1 shadow-sm shrink-0">
                                  {[
                                    { id: 'day', label: '1 Day' },
                                    { id: 'week', label: '1 Week' },
                                    { id: 'month', label: '1 Month' },
                                    { id: 'all', label: 'All Time' },
                                  ].map((tab) => (
                                    <button
                                      key={tab.id}
                                      onClick={() => setInvoiceTimeFilter(tab.id as any)}
                                      className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                                        invoiceTimeFilter === tab.id
                                          ? 'bg-purple-600 text-white shadow-sm font-bold'
                                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                                      }`}
                                    >
                                      {tab.label}
                                    </button>
                                  ))}
                                </div>
                              </div>
                              {invoicesLoading ? (
                                <div className="py-6 text-center text-slate-400 flex items-center justify-center gap-2">
                                  <RefreshCw className="w-4 h-4 animate-spin" /> Loading invoices...
                                </div>
                              ) : repInvoices.length === 0 ? (
                                <p className="text-xs text-slate-400 italic text-center py-4">No invoices linked to this representative.</p>
                              ) : filteredInvoices.length === 0 ? (
                                <p className="text-xs text-slate-400 italic text-center py-4">No invoices found for the selected time range ({invoiceTimeFilter}).</p>
                              ) : (
                                <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                                  {filteredInvoices.map((inv) => (
                                    <div key={inv.id} className="bg-white border border-slate-100 rounded-lg p-3 shadow-sm space-y-2 hover:border-purple-200 transition-colors">
                                      <div className="flex justify-between items-start">
                                        <div>
                                          <p className="font-bold text-slate-900 text-xs flex items-center gap-1">
                                            <FileText className="w-3.5 h-3.5 text-slate-400" /> {inv.invoice_number}
                                          </p>
                                          <p className="text-[10px] text-slate-500 mt-0.5">Store: {inv.buyer_name}</p>
                                        </div>
                                        <div className="text-right">
                                          <p className="font-bold text-slate-900 text-xs">₹{inv.amount.toLocaleString()}</p>
                                          <p className="text-[9px] text-slate-400">{new Date(inv.created_at).toLocaleDateString()}</p>
                                        </div>
                                      </div>
                                      <div className="flex items-center justify-between pt-1.5 border-t border-slate-50">
                                        {inv.qualifies ? (
                                          <span className="inline-flex items-center gap-1 bg-emerald-50 border border-emerald-100 text-emerald-700 text-[10px] px-1.5 py-0.5 rounded-full font-bold">
                                            <CheckCircle2 className="w-2.5 h-2.5" /> Qualifies
                                          </span>
                                        ) : (
                                          <span className="inline-flex items-center gap-1 bg-rose-50 border border-rose-100 text-rose-700 text-[10px] px-1.5 py-0.5 rounded-full font-bold">
                                            <AlertTriangle className="w-2.5 h-2.5" /> Non-Qualifying
                                          </span>
                                        )}
                                        {inv.status === 'paid' ? (
                                          <span className="text-[10px] text-emerald-600 font-bold">+{inv.points_rep.toLocaleString()} pts</span>
                                        ) : (
                                          <span className="text-[10px] text-amber-600 font-semibold bg-amber-50 px-1.5 py-0.5 rounded border border-amber-100">Awaiting</span>
                                        )}
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between p-6 border-b border-slate-100">
              <div>
                <h2 className="text-lg font-bold text-slate-900">{editingRep ? 'Edit Representative' : 'Add New Representative'}</h2>
                <p className="text-xs text-slate-500 mt-0.5">{editingRep ? 'Update rep details and status.' : 'Fill in details to register a new marketing rep.'}</p>
              </div>
              <button onClick={() => setShowModal(false)} className="p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="p-6 space-y-4">
              {formError && (
                <div className="bg-rose-50 border border-rose-200 text-rose-700 text-sm font-medium px-4 py-2.5 rounded-lg">{formError}</div>
              )}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Full Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g. Priya Menon"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Email Address *</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="rep@example.com"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Phone Number</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="+91 98765 43210"
                />
              </div>
              {!editingRep && (
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">Initial Password</label>
                  <input
                    type="text"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="rep123"
                  />
                  <p className="text-[10px] text-slate-400 mt-1">Rep can change this after first login.</p>
                </div>
              )}
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold py-2.5 rounded-lg text-sm transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={formLoading}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-semibold py-2.5 rounded-lg text-sm transition-colors"
                >
                  {formLoading ? 'Saving...' : editingRep ? 'Update Representative' : 'Create Representative'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
