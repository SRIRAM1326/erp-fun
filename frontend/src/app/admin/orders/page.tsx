'use client';

import { useState } from 'react';
import { Search, Filter, MoreVertical, Plus, Upload, Download, FileText } from 'lucide-react';

export default function AdminOrdersPage() {
  const [activeTab, setActiveTab] = useState('all');

  // Dummy Data
  const orders = [
    { id: 'ORD-7781', buyer: 'Wholesale Traders Ltd', date: '2026-07-10', amount: '₹1,45,000', qrGenerated: true, status: 'Fulfilled' },
    { id: 'ORD-7780', buyer: 'Apex Distributors', date: '2026-07-09', amount: '₹85,500', qrGenerated: true, status: 'Fulfilled' },
    { id: 'ORD-7779', buyer: 'Global Imports', date: '2026-07-09', amount: '₹3,20,000', qrGenerated: false, status: 'Processing' },
    { id: 'ORD-7778', buyer: 'Ramesh Agencies', date: '2026-07-08', amount: '₹42,000', qrGenerated: true, status: 'Fulfilled' },
    { id: 'ORD-7777', buyer: 'City Electronics', date: '2026-07-07', amount: '₹12,500', qrGenerated: false, status: 'Pending' },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Orders & Invoices</h1>
          <p className="text-sm text-slate-500 mt-1">Manage wholesale orders and link them to QR rewards.</p>
        </div>
        <div className="flex gap-2">
          <button className="bg-white border border-slate-200 text-slate-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-50 flex items-center gap-2 shadow-sm">
            <Upload className="w-4 h-4" /> Import Excel
          </button>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 flex items-center gap-2 shadow-sm">
            <Plus className="w-4 h-4" /> New Order
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        {/* Tabs */}
        <div className="border-b border-slate-200 flex overflow-x-auto hide-scrollbar">
          {['all', 'processing', 'fulfilled', 'unlinked_qr'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-4 text-sm font-semibold capitalize whitespace-nowrap border-b-2 transition-colors ${
                activeTab === tab 
                  ? 'border-blue-600 text-blue-600' 
                  : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
              }`}
            >
              {tab.replace('_', ' ')}
            </button>
          ))}
        </div>

        {/* Toolbar */}
        <div className="p-4 border-b border-slate-200 bg-slate-50 flex flex-col sm:flex-row justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search by Order ID or Buyer Name..." 
              className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex gap-2">
            <button className="bg-white border border-slate-200 text-slate-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-50 flex items-center gap-2">
              <Filter className="w-4 h-4" /> Filter
            </button>
            <button className="bg-white border border-slate-200 text-slate-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-50 flex items-center gap-2">
              <Download className="w-4 h-4" /> Export
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-slate-50 text-slate-500 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 font-medium">Order ID</th>
                <th className="px-6 py-4 font-medium">Date</th>
                <th className="px-6 py-4 font-medium">Buyer</th>
                <th className="px-6 py-4 font-medium text-right">Amount</th>
                <th className="px-6 py-4 font-medium text-center">QR Status</th>
                <th className="px-6 py-4 font-medium text-center">Status</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {orders.map((order) => (
                <tr key={order.id} className="hover:bg-slate-50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 font-semibold text-slate-900">
                      <FileText className="w-4 h-4 text-slate-400" /> {order.id}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-slate-600">{order.date}</td>
                  <td className="px-6 py-4 font-medium text-slate-900">{order.buyer}</td>
                  <td className="px-6 py-4 text-right font-medium text-slate-900">{order.amount}</td>
                  <td className="px-6 py-4 text-center">
                    {order.qrGenerated ? (
                      <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-1 rounded-md text-xs font-semibold">Linked</span>
                    ) : (
                      <button className="bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 px-2.5 py-1 rounded-md text-xs font-semibold transition-colors">
                        Generate QR
                      </button>
                    )}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className={`px-2.5 py-1 rounded-md text-xs font-semibold ${
                      order.status === 'Fulfilled' ? 'bg-slate-100 text-slate-700' :
                      order.status === 'Processing' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                      'bg-rose-50 text-rose-700 border border-rose-200'
                    }`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="p-1.5 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded transition-colors">
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Pagination Dummy */}
        <div className="p-4 border-t border-slate-100 flex items-center justify-between text-sm text-slate-500">
          <div>Showing 1 to {orders.length} of {orders.length} entries</div>
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
