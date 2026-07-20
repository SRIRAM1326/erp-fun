'use client';

import { useState } from 'react';
import { api } from '@/lib/api';
import { Database, UploadCloud, CheckCircle2, AlertTriangle, FileSpreadsheet, Users, HelpCircle } from 'lucide-react';

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

  // Customer Master Upload State
  const [customerFile, setCustomerFile] = useState<File | null>(null);
  const [customerLoading, setCustomerLoading] = useState(false);
  const [customerError, setCustomerError] = useState('');
  const [customerSuccess, setCustomerSuccess] = useState('');
  const [customerSummary, setCustomerSummary] = useState<any | null>(null);

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
      const res = await api.post('/admin/upload/invoices', formData);
      setInvoiceSuccess(res.data.message || 'Invoices imported successfully!');
      setInvoiceFile(null);
    } catch (err: any) {
      console.error(err);
      const errMsg = err.response?.data?.message || err.message || 'Failed to import invoices. Please check file format.';
      setInvoiceError(errMsg);
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
      const res = await api.post('/admin/upload/products', formData);
      setProductSuccess(res.data.message || 'Products imported successfully!');
      setProductFile(null);
    } catch (err: any) {
      console.error(err);
      const errMsg = err.response?.data?.message || err.message || 'Failed to import products. Please check file format.';
      setProductError(errMsg);
    } finally {
      setProductLoading(false);
    }
  };

  const handleCustomerUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    setCustomerError('');
    setCustomerSuccess('');
    setCustomerSummary(null);

    if (!customerFile) {
      setCustomerError('Please select a Customer Master Excel file to upload.');
      return;
    }

    const formData = new FormData();
    formData.append('file', customerFile);

    setCustomerLoading(true);
    try {
      const res = await api.post('/admin/upload/customers', formData);
      setCustomerSuccess(res.data.message || 'Customer Master imported successfully!');
      setCustomerSummary(res.data.summary);
      setCustomerFile(null);
    } catch (err: any) {
      console.error(err);
      const errMsg = err.response?.data?.message || err.message || 'Failed to import Customer Master. Please check file format.';
      setCustomerError(errMsg);
    } finally {
      setCustomerLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Data Import Hub</h1>
        <p className="text-sm text-slate-500 mt-1">Upload Excel sheets to batch import records and instantly update dashboard values.</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6 items-start">
        
        {/* CARD 1: CUSTOMER MASTER IMPORT */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col justify-between">
          <div className="p-5 border-b border-slate-100 bg-emerald-50/40">
            <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
              <Users className="w-5 h-5 text-emerald-600" /> Import Customer Master
            </h3>
            <p className="text-xs text-slate-500 mt-1">Batch import customer master profiles, addresses, and contact numbers.</p>
          </div>

          <div className="p-5 space-y-5 flex-1">
            {customerError && (
              <div className="p-3 bg-rose-50 border border-rose-100 rounded-xl flex gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <p className="text-xs font-semibold text-rose-800 leading-normal">{customerError}</p>
              </div>
            )}

            {customerSuccess && (
              <div className="p-3 bg-emerald-50 border border-emerald-100 rounded-xl flex gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <p className="text-xs font-semibold text-emerald-800 leading-normal">{customerSuccess}</p>
              </div>
            )}

            {customerSummary && (
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs space-y-2">
                <p className="font-bold text-slate-900 border-b border-slate-200 pb-1">Import Summary Breakdown:</p>
                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div>Total Processed: <strong>{customerSummary.total_records}</strong></div>
                  <div className="text-emerald-700">Imported: <strong>{customerSummary.imported}</strong></div>
                  <div className="text-blue-700">Updated: <strong>{customerSummary.updated}</strong></div>
                  <div className="text-amber-700">Skipped: <strong>{customerSummary.skipped}</strong></div>
                </div>
              </div>
            )}

            <form onSubmit={handleCustomerUpload} className="space-y-4">
              <div className="border-2 border-dashed border-slate-200 rounded-xl p-6 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-slate-50/60 transition-colors relative">
                <input 
                  type="file" 
                  accept=".xlsx"
                  onChange={(e) => setCustomerFile(e.target.files?.[0] || null)}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <UploadCloud className="w-8 h-8 text-emerald-500 mb-2" />
                <p className="text-xs font-bold text-slate-900">
                  {customerFile ? customerFile.name : 'Select Customer Excel File (.xlsx)'}
                </p>
                <p className="text-[10px] text-slate-400 mt-1">drag and drop or click to browse</p>
              </div>

              <button 
                type="submit" 
                disabled={customerLoading || !customerFile}
                className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-200 disabled:text-slate-400 text-white font-bold py-2.5 rounded-xl text-xs transition-all shadow-sm flex items-center justify-center gap-1.5"
              >
                {customerLoading ? 'Importing Customer Master...' : 'Upload Customer Master'}
              </button>
            </form>

            <div className="border-t border-slate-100 pt-4 space-y-2">
              <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1"><HelpCircle className="w-3.5 h-3.5 text-emerald-500" /> Template Requirements</h4>
              <div className="bg-slate-50 rounded-xl p-3 text-[11px] font-mono text-slate-600 space-y-1 overflow-x-auto">
                <p className="font-bold text-slate-900 border-b border-slate-200 pb-1">Expected Headers:</p>
                <p>Customer Code, Customer Name, Address, City, State, Phone Number, Mail</p>
              </div>
              <ul className="text-[10px] text-slate-500 list-disc list-inside space-y-1">
                <li>Empty cells automatically default to <strong>0</strong>.</li>
                <li>Updates existing records if Code or Email matches.</li>
              </ul>
            </div>
          </div>
        </div>

        {/* CARD 2: INVOICES IMPORT */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col justify-between">
          <div className="p-5 border-b border-slate-100 bg-slate-50/50">
            <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
              <FileSpreadsheet className="w-5 h-5 text-blue-600" /> Import Invoices Sheet
            </h3>
            <p className="text-xs text-slate-500 mt-1">Batch import system orders, link reps, and trigger payment rewards instantly.</p>
          </div>

          <div className="p-5 space-y-5 flex-1">
            {invoiceError && (
              <div className="p-3 bg-rose-50 border border-rose-100 rounded-xl flex gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <p className="text-xs font-semibold text-rose-800 leading-normal">{invoiceError}</p>
              </div>
            )}

            {invoiceSuccess && (
              <div className="p-3 bg-emerald-50 border border-emerald-100 rounded-xl flex gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <p className="text-xs font-semibold text-emerald-800 leading-normal">{invoiceSuccess}</p>
              </div>
            )}

            <form onSubmit={handleInvoiceUpload} className="space-y-4">
              <div className="border-2 border-dashed border-slate-200 rounded-xl p-6 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-slate-50/60 transition-colors relative">
                <input 
                  type="file" 
                  accept=".xlsx"
                  onChange={(e) => setInvoiceFile(e.target.files?.[0] || null)}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <UploadCloud className="w-8 h-8 text-blue-500 mb-2" />
                <p className="text-xs font-bold text-slate-900">
                  {invoiceFile ? invoiceFile.name : 'Select Invoice Excel File (.xlsx)'}
                </p>
                <p className="text-[10px] text-slate-400 mt-1">drag and drop or click to browse</p>
              </div>

              <button 
                type="submit" 
                disabled={invoiceLoading || !invoiceFile}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-200 disabled:text-slate-400 text-white font-bold py-2.5 rounded-xl text-xs transition-all shadow-sm flex items-center justify-center gap-1.5"
              >
                {invoiceLoading ? 'Importing Invoices...' : 'Upload Invoices'}
              </button>
            </form>

            <div className="border-t border-slate-100 pt-4 space-y-2">
              <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1"><HelpCircle className="w-3.5 h-3.5 text-blue-500" /> Template Requirements</h4>
              <div className="bg-slate-50 rounded-xl p-3 text-[11px] font-mono text-slate-600 space-y-1 overflow-x-auto">
                <p className="font-bold text-slate-900 border-b border-slate-200 pb-1">Expected Headers:</p>
                <p>invoice_number, buyer_email, amount, status, rep_email, products</p>
              </div>
              <ul className="text-[10px] text-slate-500 list-disc list-inside space-y-1">
                <li>Paid invoices process points calculations automatically.</li>
              </ul>
            </div>
          </div>
        </div>

        {/* CARD 3: PRODUCTS IMPORT */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col justify-between">
          <div className="p-5 border-b border-slate-100 bg-slate-50/50">
            <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
              <Database className="w-5 h-5 text-purple-600" /> Import Products Sheet
            </h3>
            <p className="text-xs text-slate-500 mt-1">Batch import products, assign categories, and configure flat bonus points.</p>
          </div>

          <div className="p-5 space-y-5 flex-1">
            {productError && (
              <div className="p-3 bg-rose-50 border border-rose-100 rounded-xl flex gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <p className="text-xs font-semibold text-rose-800 leading-normal">{productError}</p>
              </div>
            )}

            {productSuccess && (
              <div className="p-3 bg-emerald-50 border border-emerald-100 rounded-xl flex gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <p className="text-xs font-semibold text-emerald-800 leading-normal">{productSuccess}</p>
              </div>
            )}

            <form onSubmit={handleProductUpload} className="space-y-4">
              <div className="border-2 border-dashed border-slate-200 rounded-xl p-6 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-slate-50/60 transition-colors relative">
                <input 
                  type="file" 
                  accept=".xlsx"
                  onChange={(e) => setProductFile(e.target.files?.[0] || null)}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <UploadCloud className="w-8 h-8 text-purple-500 mb-2" />
                <p className="text-xs font-bold text-slate-900">
                  {productFile ? productFile.name : 'Select Product Excel File (.xlsx)'}
                </p>
                <p className="text-[10px] text-slate-400 mt-1">drag and drop or click to browse</p>
              </div>

              <button 
                type="submit" 
                disabled={productLoading || !productFile}
                className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-slate-200 disabled:text-slate-400 text-white font-bold py-2.5 rounded-xl text-xs transition-all shadow-sm flex items-center justify-center gap-1.5"
              >
                {productLoading ? 'Importing Products...' : 'Upload Products'}
              </button>
            </form>

            <div className="border-t border-slate-100 pt-4 space-y-2">
              <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1"><HelpCircle className="w-3.5 h-3.5 text-purple-500" /> Template Requirements</h4>
              <div className="bg-slate-50 rounded-xl p-3 text-[11px] font-mono text-slate-600 space-y-1 overflow-x-auto">
                <p className="font-bold text-slate-900 border-b border-slate-200 pb-1">Expected Headers:</p>
                <p>product_name, tag, bonus_points</p>
              </div>
              <ul className="text-[10px] text-slate-500 list-disc list-inside space-y-1">
                <li>Tags: <code className="font-mono bg-slate-100 px-1 rounded">normal</code>, <code className="font-mono bg-slate-100 px-1 rounded">special</code>, <code className="font-mono bg-slate-100 px-1 rounded">old_stock</code>, <code className="font-mono bg-slate-100 px-1 rounded">double_points</code>.</li>
              </ul>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
