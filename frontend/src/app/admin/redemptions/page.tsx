'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { CheckCircle2, XCircle, Clock, Landmark, Gift, AlertCircle } from 'lucide-react';

export default function AdminRedemptions() {
  const [redemptions, setRedemptions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const fetchRedemptions = async () => {
    try {
      const res = await api.get('/admin/redemptions');
      setRedemptions(res.data);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch redemptions list.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRedemptions();
  }, []);

  const handleApprove = async (id: number) => {
    setError('');
    setSuccess('');
    try {
      await api.post(`/admin/redemptions/${id}/approve`);
      setSuccess('Redemption approved successfully!');
      fetchRedemptions();
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to approve redemption.');
    }
  };

  const handleReject = async (id: number) => {
    setError('');
    setSuccess('');
    try {
      await api.post(`/admin/redemptions/${id}/reject`);
      setSuccess('Redemption rejected and points refunded to user.');
      fetchRedemptions();
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to reject redemption.');
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Title */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Point Redemptions</h1>
        <p className="text-sm text-slate-500 mt-1">Review, approve, or reject cash payouts and premium product catalog claims submitted by representatives.</p>
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

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-slate-50 text-slate-500 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 font-semibold">User</th>
                <th className="px-6 py-4 font-semibold">Role</th>
                <th className="px-6 py-4 font-semibold">Date Requested</th>
                <th className="px-6 py-4 font-semibold text-center">Type</th>
                <th className="px-6 py-4 font-semibold text-right">Points Redeemed</th>
                <th className="px-6 py-4 font-semibold">Payout / Product Details</th>
                <th className="px-6 py-4 font-semibold text-center">Status</th>
                <th className="px-6 py-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={8} className="px-6 py-8 text-center text-slate-500">Loading redemptions...</td>
                </tr>
              ) : redemptions.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-8 text-center text-slate-500">No redemption requests found.</td>
                </tr>
              ) : (
                redemptions.map((r) => (
                  <tr key={r.id} className="hover:bg-slate-50 transition-colors group">
                    <td className="px-6 py-4 font-bold text-slate-900">
                      {r.user_name}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-semibold capitalize ${
                        r.user_role === 'rep' ? 'text-purple-700 bg-purple-50' : 'text-blue-700 bg-blue-50'
                      }`}>
                        {r.user_role === 'rep' ? 'Representative' : r.user_role}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-500">
                      {new Date(r.created_at).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-center">
                      {r.redemption_type === 'cash' ? (
                        <span className="inline-flex items-center gap-1.5 text-xs text-[#3b82f6] bg-[#3b82f6]/5 px-2.5 py-1 rounded-lg border border-[#3b82f6]/10 font-semibold">
                          <Landmark className="w-3.5 h-3.5" /> Cash Transfer
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 text-xs text-[#8b5cf6] bg-[#8b5cf6]/5 px-2.5 py-1 rounded-lg border border-[#8b5cf6]/10 font-semibold">
                          <Gift className="w-3.5 h-3.5" /> Product
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right font-black text-slate-900">
                      {r.points_redeemed.toLocaleString()} pts
                    </td>
                    <td className="px-6 py-4 text-xs font-medium text-slate-600 max-w-xs truncate" title={r.details}>
                      {r.details || 'N/A'}
                    </td>
                    <td className="px-6 py-4 text-center">
                      {r.status === 'approved' ? (
                        <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-1 rounded-md text-xs font-semibold flex items-center justify-center gap-1 w-24 mx-auto">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Approved
                        </span>
                      ) : r.status === 'rejected' ? (
                        <span className="bg-rose-50 text-rose-700 border border-rose-200 px-2.5 py-1 rounded-md text-xs font-semibold flex items-center justify-center gap-1 w-24 mx-auto">
                          <XCircle className="w-3.5 h-3.5" /> Rejected
                        </span>
                      ) : (
                        <span className="bg-amber-50 text-amber-700 border border-amber-200 px-2.5 py-1 rounded-md text-xs font-semibold flex items-center justify-center gap-1 w-24 mx-auto">
                          <Clock className="w-3.5 h-3.5 animate-pulse" /> Pending
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      {r.status === 'pending' ? (
                        <div className="flex gap-2 justify-end">
                          <button
                            onClick={() => handleReject(r.id)}
                            className="bg-white border border-rose-200 hover:bg-rose-50 text-rose-600 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1 shadow-sm"
                          >
                            <XCircle className="w-3.5 h-3.5" /> Reject
                          </button>
                          <button
                            onClick={() => handleApprove(r.id)}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1 shadow-sm"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" /> Approve
                          </button>
                        </div>
                      ) : (
                        <span className="text-xs text-slate-400 font-medium">Processed</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
