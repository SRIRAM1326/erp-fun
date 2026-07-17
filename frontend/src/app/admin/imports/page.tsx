'use client';

import { useState } from 'react';
import { api } from '@/lib/api';
import { Database, UploadCloud, CheckCircle2, AlertTriangle, FileSpreadsheet, ArrowRight, HelpCircle } from 'lucide-react';

export default function AdminImports() {
  // Invoices Upload State
  const [invoiceFile, setInvoiceFile] = useState<File | null>(null);
  const [invoiceLoading, setInvoiceLoading] = useState(false);
  const [invoiceError, setInvoiceError] = useState('');
  const [invoiceSuccess, setInvoiceSuccess] = useState('');

  // Products Upload State
  const [productFile, setProductFile] = useState<File | null>(null);
  const [productLoading, setProductLoading] = useState(false);
  const [productError, setProductError] = useState('');
  const [productSuccess, setProductSuccess] = useState('');

  const handleInvoiceUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    setInvoiceError('');
    setInvoiceSuccess('');
    
    if (!invoiceFile) {
      setInvoiceError('Please select an invoice Excel file to upload.');
      return;
    }

    const formData = new FormData();
    formData.append('file', invoiceFile);

    setInvoiceLoading(true);
    try {
      const res = await api.post('/admin/upload/invoices', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setInvoiceSuccess(res.data.message || 'Invoices imported successfully!');
      setInvoiceFile(null);
    } catch (err: any) {
      console.error(err);
      setInvoiceError(err.response?.data?.message || 'Failed to import invoices. Please check file format.');
    } finally {
      setInvoiceLoading(false);
    }
  };

  const handleProductUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    setProductError('');
    setProductSuccess('');

    if (!productFile) {
      setProductError('Please select a product Excel file to upload.');
      return;
    }

    const formData = new FormData();
    formData.append('file', productFile);

    setProductLoading(true);
    try {
      const res = await api.post('/admin/upload/products', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setProductSuccess(res.data.message || 'Products imported successfully!');
      setProductFile(null);
    } catch (err: any) {
      console.error(err);
      setProductError(err.response?.data?.message || 'Failed to import products. Please check file format.');
    } finally {
      setProductLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Data Import Hub</h1>
        <p className="text-sm text-slate-500 mt-1">Upload Excel sheets to batch import records and instantly update dashboard values.</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        
        {/* CARD 1: INVOICES IMPORT */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col justify-between">
          <div className="p-6 border-b border-slate-100 bg-slate-50/50">
            <h3 className="font-bold text-slate-900 text-lg flex items-center gap-2">
              <FileSpreadsheet className="w-5 h-5 text-blue-600" /> Import Invoices Sheet
            </h3>
            <p className="text-xs text-slate-500 mt-1">Batch import system orders, link reps, and trigger payment rewards instantly.</p>
          </div>

          <div className="p-6 space-y-6 flex-1">
            {invoiceError && (
              <div className="p-3.5 bg-rose-50 border border-rose-100 rounded-lg flex gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <p className="text-xs font-semibold text-rose-800 leading-normal">{invoiceError}</p>
              </div>
            )}

            {invoiceSuccess && (
              <div className="p-3.5 bg-emerald-50 border border-emerald-100 rounded-lg flex gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <p className="text-xs font-semibold text-emerald-800 leading-normal">{invoiceSuccess}</p>
              </div>
            )}

            <form onSubmit={handleInvoiceUpload} className="space-y-4">
              <div className="border-2 border-dashed border-slate-200 rounded-xl p-8 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-slate-50/60 transition-colors relative">
                <input 
                  type="file" 
                  accept=".xlsx"
                  onChange={(e) => setInvoiceFile(e.target.files?.[0] || null)}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <UploadCloud className="w-10 h-10 text-slate-400 mb-2" />
                <p className="text-sm font-semibold text-slate-900">
                  {invoiceFile ? invoiceFile.name : 'Select Invoice Excel File (.xlsx)'}
                </p>
                <p className="text-xs text-slate-500 mt-1">drag and drop or click to browse</p>
              </div>

              <button 
                type="submit" 
                disabled={invoiceLoading || !invoiceFile}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-200 disabled:text-slate-400 text-white font-bold py-2.5 rounded-lg text-sm transition-all shadow-sm flex items-center justify-center gap-1.5"
              >
                {invoiceLoading ? 'Importing Invoices...' : 'Upload Invoices'}
              </button>
            </form>

            <div className="border-t border-slate-100 pt-4 space-y-3">
              <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1"><HelpCircle className="w-3.5 h-3.5 text-blue-500" /> Template Requirements</h4>
              <div className="bg-slate-50 rounded-lg p-3 text-[11px] font-mono text-slate-600 space-y-1.5 overflow-x-auto">
                <p className="font-bold text-slate-900 border-b border-slate-100 pb-1">Expected Headers:</p>
                <p>invoice_number, buyer_email, amount, status, rep_email, products</p>
                <p className="font-bold text-slate-900 border-b border-slate-100 pt-2 pb-1">Sample Row:</p>
                <p>INV-9005, buyer@store.com, 85000, paid, rep@sales.com, "Product A, Product B"</p>
              </div>
              <ul className="text-[11px] text-slate-500 list-disc list-inside space-y-1">
                <li>If the `buyer_email` is new, an account will be registered automatically.</li>
                <li>Paid invoices instantly process points calculations.</li>
                <li>Multiple products should be comma-separated inside double quotes.</li>
              </ul>
            </div>
          </div>
        </div>

        {/* CARD 2: PRODUCTS IMPORT */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col justify-between">
          <div className="p-6 border-b border-slate-100 bg-slate-50/50">
            <h3 className="font-bold text-slate-900 text-lg flex items-center gap-2">
              <Database className="w-5 h-5 text-purple-600" /> Import Products Sheet
            </h3>
            <p className="text-xs text-slate-500 mt-1">Batch import products, assign categories, and configure flat bonus points.</p>
          </div>

          <div className="p-6 space-y-6 flex-1">
            {productError && (
              <div className="p-3.5 bg-rose-50 border border-rose-100 rounded-lg flex gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <p className="text-xs font-semibold text-rose-800 leading-normal">{productError}</p>
              </div>
            )}

            {productSuccess && (
              <div className="p-3.5 bg-emerald-50 border border-emerald-100 rounded-lg flex gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <p className="text-xs font-semibold text-emerald-800 leading-normal">{productSuccess}</p>
              </div>
            )}

            <form onSubmit={handleProductUpload} className="space-y-4">
              <div className="border-2 border-dashed border-slate-200 rounded-xl p-8 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-slate-50/60 transition-colors relative">
                <input 
                  type="file" 
                  accept=".xlsx"
                  onChange={(e) => setProductFile(e.target.files?.[0] || null)}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <UploadCloud className="w-10 h-10 text-slate-400 mb-2" />
                <p className="text-sm font-semibold text-slate-900">
                  {productFile ? productFile.name : 'Select Product Excel File (.xlsx)'}
                </p>
                <p className="text-xs text-slate-500 mt-1">drag and drop or click to browse</p>
              </div>

              <button 
                type="submit" 
                disabled={productLoading || !productFile}
                className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-slate-200 disabled:text-slate-400 text-white font-bold py-2.5 rounded-lg text-sm transition-all shadow-sm flex items-center justify-center gap-1.5"
              >
                {productLoading ? 'Importing Products...' : 'Upload Products'}
              </button>
            </form>

            <div className="border-t border-slate-100 pt-4 space-y-3">
              <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1"><HelpCircle className="w-3.5 h-3.5 text-purple-500" /> Template Requirements</h4>
              <div className="bg-slate-50 rounded-lg p-3 text-[11px] font-mono text-slate-600 space-y-1.5 overflow-x-auto">
                <p className="font-bold text-slate-900 border-b border-slate-100 pb-1">Expected Headers:</p>
                <p>product_name, tag, bonus_points</p>
                <p className="font-bold text-slate-900 border-b border-slate-100 pt-2 pb-1">Sample Row:</p>
                <p>Product Alpha, special, 300</p>
              </div>
              <ul className="text-[11px] text-slate-500 list-disc list-inside space-y-1">
                <li>`tag` values must be: <code className="font-mono text-slate-900 font-semibold bg-slate-100 px-1 rounded">normal</code>, <code className="font-mono text-slate-900 font-semibold bg-slate-100 px-1 rounded">special</code>, <code className="font-mono text-slate-900 font-semibold bg-slate-100 px-1 rounded">old_stock</code>, or <code className="font-mono text-slate-900 font-semibold bg-slate-100 px-1 rounded">double_points</code>.</li>
                <li>`bonus_points` represents flat rewards applied (ignored for normal/double_points).</li>
                <li>Uploading will overwrite matching product tags; new products will be appended.</li>
              </ul>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
