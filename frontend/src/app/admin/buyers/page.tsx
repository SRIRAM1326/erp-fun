'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import {
  Search, Filter, Download, Plus, Mail, Phone, MapPin,
  UploadCloud, FileSpreadsheet, CheckCircle2, AlertTriangle, X, RefreshCw
} from 'lucide-react';

export default function AdminBuyersPage() {
  const [buyers, setBuyers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTier, setSelectedTier] = useState('');

  // Import Modal State
  const [showImportModal, setShowImportModal] = useState(false);
  const [importFile, setImportFile] = useState<File | null>(null);
  const [importLoading, setImportLoading] = useState(false);
  const [importError, setImportError] = useState('');
  const [importSummary, setImportSummary] = useState<any | null>(null);

  const fetchBuyers = async () => {
    setLoading(true);
    try {
      const res = await api.get('/admin/buyers');
      setBuyers(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBuyers();
  }, []);

  const handleVerifyBuyer = async (id: number) => {
    if (!confirm('Verify this store? This will approve their loyalty account and award a flat +1,000 points onboarding bonus to their assigned representative.')) {
      return;
    }
    try {
      await api.post(`/admin/buyers/${id}/verify`);
      await fetchBuyers();
    } catch (err) {
      console.error(err);
      alert('Failed to verify buyer.');
    }
  };

  const handleImportSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!importFile) {
      setImportError('Please select a Customer Master Excel file (.xlsx).');
      return;
    }

    setImportError('');
    setImportSummary(null);
    setImportLoading(true);

    const formData = new FormData();
    formData.append('file', importFile);

    try {
      const res = await api.post('/admin/upload/customers', formData);
      setImportSummary(res.data.summary);
      setImportFile(null);
      await fetchBuyers();
    } catch (err: any) {
      console.error(err);
      setImportError(err.response?.data?.message || 'Failed to import Customer Master. Please check file format.');
    } finally {
      setImportLoading(false);
    }
  };

  const filteredBuyers = buyers.filter((buyer) => {
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch = !q || (
      (buyer.name && buyer.name.toLowerCase().includes(q)) ||
      (buyer.business_name && buyer.business_name.toLowerCase().includes(q)) ||
      (buyer.email && buyer.email.toLowerCase().includes(q)) ||
      (buyer.customer_code && buyer.customer_code.toLowerCase().includes(q)) ||
      (buyer.city && buyer.city.toLowerCase().includes(q)) ||
      (buyer.phone && buyer.phone.toLowerCase().includes(q))
    );
    const matchesTier = !selectedTier || (buyer.tier && buyer.tier.toLowerCase() === selectedTier.toLowerCase());
    return matchesSearch && matchesTier;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header Title Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 bg-white border border-slate-200 p-6 rounded-2xl shadow-sm">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
            Customer Management
          </h1>
          <p className="text-sm text-slate-500 font-medium mt-1">
            Manage wholesale customer master records, addresses, tiers, and points balances.
          </p>
        </div>
        <div className="flex flex-wrap gap-2 shrink-0">
          <button
            onClick={() => {
              setImportSummary(null);
              setImportError('');
              setImportFile(null);
              setShowImportModal(true);
            }}
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 shadow-sm transition-all"
          >
            <FileSpreadsheet className="w-4 h-4" /> Import Customer Master
          </button>
          <button
            onClick={fetchBuyers}
            className="bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 px-3 py-2 rounded-xl text-sm font-medium transition-all shadow-sm flex items-center gap-1.5"
          >
            <RefreshCw className="w-4 h-4" /> Refresh
          </button>
        </div>
      </div>

      {/* Main Table Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {/* Toolbar Filters */}
        <div className="p-4 border-b border-slate-200 bg-slate-50/50 flex flex-col sm:flex-row justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by Code, Name, Email, City, Phone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
            />
          </div>
          <div className="flex gap-2">
            <select
              value={selectedTier}
              onChange={(e) => setSelectedTier(e.target.value)}
              className="bg-white border border-slate-200 text-slate-700 px-3.5 py-2 rounded-xl text-xs font-bold focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
            >
              <option value="">All Tiers</option>
              <option value="platinum">Platinum</option>
              <option value="gold">Gold</option>
              <option value="silver">Silver</option>
              <option value="bronze">Bronze</option>
            </select>
          </div>
        </div>

        {/* Data Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-slate-50 text-slate-500 border-b border-slate-200 text-xs uppercase font-bold tracking-wider">
              <tr>
                <th className="px-6 py-4">Customer Code</th>
                <th className="px-6 py-4">Customer / Business Name</th>
                <th className="px-6 py-4">Contact (Phone & Mail)</th>
                <th className="px-6 py-4">Address & Location</th>
                <th className="px-6 py-4 font-center">Tier</th>
                <th className="px-6 py-4 text-right">Points Balance</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-slate-500">
                    <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                    Loading customers...
                  </td>
                </tr>
              ) : filteredBuyers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-slate-400 italic">
                    No customers found. Click &quot;Import Customer Master&quot; to upload from Excel.
                  </td>
                </tr>
              ) : (
                filteredBuyers.map((buyer) => (
                  <tr key={buyer.id} className="hover:bg-slate-50 transition-colors group">
                    <td className="px-6 py-4">
                      <span className="font-mono font-bold text-xs bg-slate-100 text-slate-800 px-2.5 py-1 rounded-lg border border-slate-200">
                        {buyer.customer_code || '0'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center font-black text-sm shadow-sm shrink-0">
                          {(buyer.business_name || buyer.name).charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900 text-sm leading-tight">{buyer.business_name || buyer.name}</p>
                          <p className="text-xs text-slate-500 mt-0.5">{buyer.name}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 space-y-1">
                      <div className="flex items-center gap-1.5 text-xs text-slate-700 font-semibold">
                        <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>{buyer.phone || '0'}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-slate-500">
                        <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>{buyer.email || '0'}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-start gap-1.5 text-xs text-slate-700">
                        <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                        <div>
                          <p className="font-semibold text-slate-800 truncate max-w-[200px]" title={buyer.address || '0'}>
                            {buyer.address || '0'}
                          </p>
                          <p className="text-[11px] text-slate-400">
                            {[buyer.city !== '0' ? buyer.city : null, buyer.state !== '0' ? buyer.state : null].filter(Boolean).join(', ') || '0'}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-bold capitalize border ${
                        buyer.tier === 'platinum' ? 'bg-slate-900 text-white border-slate-900' :
                        buyer.tier === 'gold' ? 'bg-amber-50 text-amber-800 border-amber-200' :
                        buyer.tier === 'silver' ? 'bg-slate-100 text-slate-700 border-slate-200' :
                        'bg-blue-50 text-blue-700 border-blue-100'
                      }`}>
                        {buyer.tier || 'Silver'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right font-black text-slate-900 text-sm">
                      {(buyer.total_points || 0).toLocaleString()} pts
                    </td>
                    <td className="px-6 py-4 text-right">
                      {!buyer.is_verified ? (
                        <button
                          onClick={() => handleVerifyBuyer(buyer.id)}
                          className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-3 py-1.5 rounded-xl transition-all shadow-sm"
                        >
                          Verify Account
                        </button>
                      ) : (
                        <span className="text-xs text-slate-400 font-semibold inline-flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Verified
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-medium bg-slate-50/50">
          <div>Showing <strong>{filteredBuyers.length}</strong> of <strong>{buyers.length}</strong> customers</div>
        </div>
      </div>

      {/* IMPORT CUSTOMER MASTER MODAL */}
      {showImportModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 bg-slate-50/50">
              <div>
                <h3 className="font-black text-slate-900 text-lg flex items-center gap-2">
                  <FileSpreadsheet className="w-5 h-5 text-emerald-600" /> Import Customer Master
                </h3>
                <p className="text-xs text-slate-500 mt-1 font-medium">
                  Upload Customer Master Excel file (.xlsx) with fields: Customer Code, Customer Name, Address, City, State, Phone Number, Mail.
                </p>
              </div>
              <button
                onClick={() => setShowImportModal(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6">
              {importError && (
                <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl flex gap-2">
                  <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  <p className="text-xs font-semibold text-rose-800">{importError}</p>
                </div>
              )}

              {/* Import Summary Results Display */}
              {importSummary ? (
                <div className="space-y-4">
                  <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-3">
                    <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
                    <div>
                      <h4 className="font-bold text-emerald-900 text-sm">Customer Master Import Completed!</h4>
                      <p className="text-xs text-emerald-700 mt-0.5 font-medium">
                        Processed total of <strong>{importSummary.total_records}</strong> records.
                      </p>
                    </div>
                  </div>

                  {/* Summary Metric Stats */}
                  <div className="grid grid-cols-4 gap-3 text-center">
                    <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                      <p className="text-[10px] text-slate-400 font-bold uppercase">Total</p>
                      <p className="text-xl font-black text-slate-900 mt-0.5">{importSummary.total_records}</p>
                    </div>
                    <div className="p-3 bg-emerald-50 border border-emerald-100 rounded-xl">
                      <p className="text-[10px] text-emerald-600 font-bold uppercase">Imported</p>
                      <p className="text-xl font-black text-emerald-700 mt-0.5">{importSummary.imported}</p>
                    </div>
                    <div className="p-3 bg-blue-50 border border-blue-100 rounded-xl">
                      <p className="text-[10px] text-blue-600 font-bold uppercase">Updated</p>
                      <p className="text-xl font-black text-blue-700 mt-0.5">{importSummary.updated}</p>
                    </div>
                    <div className="p-3 bg-amber-50 border border-amber-100 rounded-xl">
                      <p className="text-[10px] text-amber-600 font-bold uppercase">Skipped</p>
                      <p className="text-xl font-black text-amber-700 mt-0.5">{importSummary.skipped}</p>
                    </div>
                  </div>

                  {/* Errors / Warnings List */}
                  {importSummary.errors && importSummary.errors.length > 0 && (
                    <div className="space-y-1.5">
                      <p className="text-xs font-bold text-slate-700">Encountered Issues / Warnings:</p>
                      <div className="max-h-36 overflow-y-auto bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-1">
                        {importSummary.errors.map((errStr: string, idx: number) => (
                          <p key={idx} className="text-[11px] font-mono text-rose-600 flex items-center gap-1.5">
                            <AlertTriangle className="w-3 h-3 shrink-0" /> {errStr}
                          </p>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="pt-2">
                    <button
                      onClick={() => setShowImportModal(false)}
                      className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-2.5 rounded-xl text-xs transition-colors"
                    >
                      Done & View Customer List
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleImportSubmit} className="space-y-5">
                  <div className="border-2 border-dashed border-slate-200 rounded-2xl p-8 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-slate-50/60 transition-colors relative">
                    <input
                      type="file"
                      accept=".xlsx"
                      onChange={(e) => setImportFile(e.target.files?.[0] || null)}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <UploadCloud className="w-10 h-10 text-emerald-500 mb-2" />
                    <p className="text-sm font-semibold text-slate-900">
                      {importFile ? importFile.name : 'Select Customer Master Excel (.xlsx)'}
                    </p>
                    <p className="text-xs text-slate-500 mt-1">drag and drop or click to browse</p>
                  </div>

                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-[11px] text-slate-600 space-y-1">
                    <p className="font-bold text-slate-800">Supported Sheet Headers:</p>
                    <p className="font-mono text-slate-600">Customer Code, Customer Name, Address, City, State, Phone Number, Mail</p>
                    <p className="text-[10px] text-slate-400 mt-1">
                      * Empty or blank cells are automatically stored as <strong>0</strong>.
                    </p>
                  </div>

                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => setShowImportModal(false)}
                      className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-2.5 rounded-xl text-xs transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={importLoading || !importFile}
                      className="flex-1 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold py-2.5 rounded-xl text-xs transition-colors shadow-sm flex items-center justify-center gap-2"
                    >
                      {importLoading ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin" /> Importing...
                        </>
                      ) : (
                        'Upload & Import Customer Master'
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
