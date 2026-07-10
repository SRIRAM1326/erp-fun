'use client';

import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { QrCode, Plus, Download, Search, CheckCircle2, Copy } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';

export default function QRManagement() {
  const [qrs, setQrs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [points, setPoints] = useState(100);
  const [generating, setGenerating] = useState(false);
  const [newQr, setNewQr] = useState<any>(null);

  const fetchQRs = async () => {
    try {
      const res = await api.get('/admin/qrs');
      setQrs(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQRs();
  }, []);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setGenerating(true);
    try {
      const res = await api.post('/admin/qr/generate', { points: Number(points) });
      setNewQr(res.data);
      fetchQRs();
    } catch (err) {
      console.error(err);
    } finally {
      setGenerating(false);
    }
  };

  const closeAndResetModal = () => {
    setIsModalOpen(false);
    setNewQr(null);
    setPoints(100);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">QR Code Management</h1>
          <p className="text-sm text-slate-500 mt-1">Generate and track reward QR codes for invoices.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 text-white px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-blue-700 flex items-center gap-2 shadow-sm transition-colors"
        >
          <Plus className="w-4 h-4" /> Generate New QR
        </button>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        {/* Toolbar */}
        <div className="p-4 border-b border-slate-200 bg-slate-50 flex flex-col sm:flex-row justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search by QR Code ID or Status..." 
              className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-slate-50 text-slate-500 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 font-medium">QR Value (Secret)</th>
                <th className="px-6 py-4 font-medium text-right">Points Value</th>
                <th className="px-6 py-4 font-medium text-center">Status</th>
                <th className="px-6 py-4 font-medium">Created On</th>
                <th className="px-6 py-4 font-medium">Scanned By</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-slate-500">Loading QR codes...</td>
                </tr>
              ) : qrs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-slate-500">No QR codes found.</td>
                </tr>
              ) : (
                qrs.map((qr) => (
                  <tr key={qr.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 font-mono text-xs text-slate-600 bg-slate-100 px-2 py-1 rounded w-fit">
                        <QrCode className="w-3 h-3 text-slate-400" /> {qr.code_value}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right font-bold text-slate-900">
                      {qr.points} pts
                    </td>
                    <td className="px-6 py-4 text-center">
                      {qr.is_scanned ? (
                        <span className="bg-slate-100 text-slate-500 px-2.5 py-1 rounded-md text-xs font-semibold">Claimed</span>
                      ) : (
                        <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-1 rounded-md text-xs font-semibold">Active</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-slate-600">
                      {new Date(qr.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-slate-600">
                      {qr.scanned_by ? `User #${qr.scanned_by}` : '-'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Generation Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xl max-w-md w-full overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h2 className="text-lg font-bold text-slate-900">Generate Reward QR</h2>
              <button onClick={closeAndResetModal} className="text-slate-400 hover:text-slate-600 text-xl leading-none">&times;</button>
            </div>
            
            <div className="p-6">
              {!newQr ? (
                <form onSubmit={handleGenerate} className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">Points Value</label>
                    <input 
                      type="number" 
                      value={points} 
                      onChange={(e) => setPoints(Number(e.target.value))}
                      className="w-full border border-slate-300 rounded-lg px-4 py-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                      min="1"
                    />
                    <p className="text-xs text-slate-500 mt-2">Enter the amount of points this QR code will reward upon scanning.</p>
                  </div>
                  <button 
                    type="submit" 
                    className="w-full bg-blue-600 text-white font-semibold py-3 rounded-lg hover:bg-blue-700 transition-colors shadow-sm disabled:opacity-70"
                    disabled={generating}
                  >
                    {generating ? 'Generating...' : 'Create QR Code'}
                  </button>
                </form>
              ) : (
                <div className="text-center space-y-6">
                  <div className="inline-flex items-center justify-center bg-emerald-50 text-emerald-600 p-2 rounded-full mb-2">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mt-2">QR Code Ready</h3>
                  
                  <div className="bg-white p-4 inline-block rounded-xl border border-slate-200 shadow-sm">
                    <QRCodeSVG value={newQr.code_value} size={200} />
                  </div>
                  
                  <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Secret Code</p>
                    <div className="flex items-center justify-center gap-2">
                      <span className="font-mono font-bold text-slate-900 text-lg">{newQr.code_value}</span>
                      <button className="text-slate-400 hover:text-slate-600" title="Copy"><Copy className="w-4 h-4" /></button>
                    </div>
                    <p className="text-sm font-medium text-blue-600 mt-2">{newQr.points} Points Value</p>
                  </div>
                  
                  <div className="flex gap-3">
                    <button onClick={closeAndResetModal} className="flex-1 bg-white border border-slate-300 text-slate-700 font-semibold py-2.5 rounded-lg hover:bg-slate-50 transition-colors">
                      Done
                    </button>
                    <button className="flex-1 bg-slate-900 text-white font-semibold py-2.5 rounded-lg hover:bg-slate-800 transition-colors flex items-center justify-center gap-2">
                      <Download className="w-4 h-4" /> Download
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
