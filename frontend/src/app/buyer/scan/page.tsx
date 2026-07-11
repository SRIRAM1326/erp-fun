'use client';

import { useState, useEffect } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { api } from '@/lib/api';
import { CheckCircle2, XCircle, Camera, QrCode, Upload } from 'lucide-react';
import Link from 'next/link';

export default function ScanPage() {
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const [manualCode, setManualCode] = useState('');
  const [loading, setLoading] = useState(false);

  const handleClaim = async (code: string) => {
    setLoading(true);
    setStatus('idle');
    try {
      const res = await api.post('/buyer/scan', { code_value: code });
      setStatus('success');
      setMessage(res.data.message);
    } catch (err: unknown) {
      setStatus('error');
      const error = err as { response?: { data?: { message?: string } } };
      setMessage(error.response?.data?.message || 'Invalid or expired QR code.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const scanner = new Html5QrcodeScanner(
      'reader',
      { fps: 10, qrbox: { width: 250, height: 250 } },
      false
    );

    const onScanSuccess = (decodedText: string) => {
      scanner.clear();
      handleClaim(decodedText);
    };

    const onScanFailure = (_error: unknown) => {};

    scanner.render(onScanSuccess, onScanFailure);

    return () => {
      scanner.clear().catch(console.error);
    };
  }, []);

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <div className="text-center">
        <h1 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">Scan QR Code</h1>
        <p className="text-slate-500 mt-2">Scan the QR code from your wholesale invoice to claim points.</p>
      </div>

      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <h2 className="font-semibold text-slate-900 flex items-center gap-2">
            <Camera className="w-5 h-5 text-blue-600" />
            Live Scanner
          </h2>
          <button className="text-sm font-medium text-blue-600 hover:text-blue-700 flex items-center gap-1">
            <Upload className="w-4 h-4" /> Upload Image
          </button>
        </div>
        
        <div id="reader" className="w-full rounded-xl overflow-hidden border-2 border-dashed border-slate-300 bg-slate-50"></div>
        
        <div className="mt-6 flex items-center justify-center gap-4 text-sm text-slate-500">
          <span className="flex items-center gap-1"><QrCode className="w-4 h-4" /> Position QR inside frame</span>
        </div>
      </div>

      {status === 'success' && (
        <div className="p-6 bg-emerald-50 text-emerald-900 rounded-2xl flex flex-col items-center justify-center text-center space-y-3 border border-emerald-200 shadow-sm animate-in fade-in zoom-in duration-300">
          <CheckCircle2 className="w-12 h-12 text-emerald-500" />
          <div>
            <h3 className="text-lg font-bold">QR Verified Successfully</h3>
            <p className="text-emerald-700 font-medium">{message}</p>
          </div>
          <Link href="/buyer/rewards" className="mt-2 bg-emerald-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-emerald-700 transition-colors">
            View Rewards
          </Link>
        </div>
      )}

      {status === 'error' && (
        <div className="p-6 bg-rose-50 text-rose-900 rounded-2xl flex flex-col items-center justify-center text-center space-y-3 border border-rose-200 shadow-sm animate-in fade-in zoom-in duration-300">
          <XCircle className="w-12 h-12 text-rose-500" />
          <div>
            <h3 className="text-lg font-bold">Verification Failed</h3>
            <p className="text-rose-700 font-medium">{message}</p>
          </div>
          <button onClick={() => window.location.reload()} className="mt-2 bg-white text-rose-600 border border-rose-200 px-6 py-2 rounded-lg font-medium hover:bg-rose-50 transition-colors">
            Try Again
          </button>
        </div>
      )}

      <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-500 mb-4 flex items-center">
          Trouble Scanning? Use Manual Entry
        </h2>
        <form 
          onSubmit={(e) => {
            e.preventDefault();
            handleClaim(manualCode);
          }} 
          className="flex flex-col sm:flex-row gap-3"
        >
          <input 
            value={manualCode} 
            onChange={(e) => setManualCode(e.target.value)} 
            placeholder="Enter Invoice QR Code ID" 
            className="flex-1 bg-white border border-slate-300 rounded-lg px-4 py-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-medium"
            required
          />
          <button type="submit" className="bg-slate-900 hover:bg-slate-800 text-white font-semibold px-8 py-3 rounded-lg transition-colors whitespace-nowrap shadow-sm" disabled={loading}>
            Claim Points
          </button>
        </form>
      </div>
    </div>
  );
}
