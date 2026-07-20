'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { Search, Filter, MoreVertical, Download, Plus, Mail } from 'lucide-react';

export default function AdminBuyersPage() {
  const [buyers, setBuyers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchBuyers = async () => {
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

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Customer Management</h1>
          <p className="text-sm text-slate-500 mt-1">Manage wholesale customers, tiers, and points balances.</p>
        </div>
        <div className="flex gap-2">
          <button className="bg-white border border-slate-200 text-slate-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-50 flex items-center gap-2 shadow-sm">
            <Download className="w-4 h-4" /> Export
          </button>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 flex items-center gap-2 shadow-sm">
            <Plus className="w-4 h-4" /> Add Customer
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        {/* Toolbar */}
        <div className="p-4 border-b border-slate-200 bg-slate-50 flex flex-col sm:flex-row justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search by business name or email..." 
              className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex gap-2">
            <button className="bg-white border border-slate-200 text-slate-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-50 flex items-center gap-2">
              <Filter className="w-4 h-4" /> Filter By Tier
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-slate-50 text-slate-500 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 font-medium">Business / Buyer</th>
                <th className="px-6 py-4 font-medium">Contact</th>
                <th className="px-6 py-4 font-medium">Tier</th>
                <th className="px-6 py-4 font-medium text-right">Points Balance</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-slate-500">Loading buyers...</td>
                </tr>
              ) : buyers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-slate-500">No buyers found.</td>
                </tr>
              ) : (
                buyers.map((buyer) => (
                  <tr key={buyer.id} className="hover:bg-slate-50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-xs">
                          {(buyer.business_name || buyer.name).charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-semibold text-slate-900">{buyer.business_name || 'N/A'}</p>
                          <p className="text-xs text-slate-500">{buyer.name}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1 text-slate-600">
                        <Mail className="w-3 h-3" />
                        <span className="text-xs">{buyer.email}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-md text-xs font-semibold capitalize ${
                        buyer.tier === 'platinum' ? 'bg-slate-900 text-white' : 
                        buyer.tier === 'gold' ? 'bg-amber-100 text-amber-800' : 
                        buyer.tier === 'silver' ? 'bg-slate-200 text-slate-700' : 
                        'bg-blue-50 text-blue-700'
                      }`}>
                        {buyer.tier || 'Silver'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right font-bold text-slate-900">
                      {(buyer.total_points || 0).toLocaleString()} pts
                    </td>
                    <td className="px-6 py-4 text-right">
                      {!buyer.is_verified ? (
                        <button
                          onClick={() => handleVerifyBuyer(buyer.id)}
                          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs px-2.5 py-1.5 rounded-lg transition-colors shadow-sm"
                        >
                          Verify Account
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
        
        {/* Pagination Dummy */}
        <div className="p-4 border-t border-slate-100 flex items-center justify-between text-sm text-slate-500">
          <div>Showing 1 to {buyers.length} of {buyers.length} entries</div>
          <div className="flex gap-1">
            <button className="px-3 py-1 border border-slate-200 rounded text-slate-400 cursor-not-allowed bg-slate-50">Prev</button>
            <button className="px-3 py-1 border border-blue-600 bg-blue-50 text-blue-700 rounded font-medium">1</button>
            <button className="px-3 py-1 border border-slate-200 rounded text-slate-400 cursor-not-allowed bg-slate-50">Next</button>
          </div>
        </div>
      </div>
    </div>
  );
}
