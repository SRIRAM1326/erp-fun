'use client';

import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import {
  Layers, RefreshCw, Info, Calendar, Clock, ChevronDown, ChevronUp, AlertCircle, FileText
} from 'lucide-react';
import { format } from 'date-fns';

export default function AdminVersionsPage() {
  const [versions, setVersions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const fetchVersions = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await api.get('/admin/config/versions');
      setVersions(res.data);
      if (res.data.length > 0) {
        setExpandedId(res.data[0].version); // Expand the latest version by default
      }
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to load configuration versions.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchVersions(); }, []);

  const toggleExpand = (version: number) => {
    if (expandedId === version) {
      setExpandedId(null);
    } else {
      setExpandedId(version);
    }
  };

  const renderConfigGrid = (config: any) => {
    const fields = [
      { label: 'Invoice to Points %', value: `${((config.invoice_reward_percentage ?? 0.50) * 100).toFixed(1)}%` },
      { label: 'Credit Period', value: `${config.credit_period} Days` },
      { label: 'Payment Cutoff', value: `${config.forfeiture_cutoff} Days` },
      { label: 'High-Spend Threshold', value: `₹${config.high_spend_threshold.toLocaleString()}` },
      { label: 'High-Spend Bonus', value: `${config.high_spend_bonus} pts` },
      { label: 'Loyalty Bonus', value: `${config.loyalty_bonus} pts` },
      { label: 'Regular Bonus', value: `${config.regular_bonus} pts` },
      { label: 'Special Product Bonus', value: `${config.special_bonus} pts` },
      { label: 'Old Stock Bonus', value: `${config.old_stock_bonus} pts` },
      { label: 'Referral Min Purchase', value: `₹${config.referral_min_value.toLocaleString()}` },
      { label: 'Referral Reward Rate', value: `${(config.referral_rate * 100).toFixed(1)}%` },
      { label: 'Shop Onboard Bonus', value: `${config.shop_onboard_bonus} pts` },
    ];

    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4 p-5 bg-slate-50 rounded-xl border border-slate-200">
        {fields.map(f => (
          <div key={f.label} className="space-y-1">
            <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">{f.label}</p>
            <p className="text-sm font-semibold text-slate-900">{f.value}</p>
          </div>
        ))}
        <div className="col-span-2 md:col-span-3 lg:col-span-4 space-y-1 border-t border-slate-200 pt-3 mt-1">
          <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Double Points Products</p>
          <p className="text-sm font-semibold text-slate-900">{config.double_products}</p>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
            <Layers className="w-6 h-6 text-blue-600" />
            Configuration Versioning
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            A complete history of all reward rule changes for auditing and historical accuracy.
          </p>
        </div>
        <button onClick={fetchVersions} className="bg-white border border-slate-200 text-slate-700 px-3 py-2 rounded-lg text-sm font-medium hover:bg-slate-50 flex items-center gap-2 shadow-sm shrink-0">
          <RefreshCw className="w-4 h-4" /> Refresh
        </button>
      </div>

      {/* Info callout */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl px-5 py-3.5 flex items-start gap-3">
        <Info className="w-5 h-5 text-amber-600 mt-0.5 shrink-0" />
        <p className="text-sm text-amber-800 leading-relaxed font-medium">
          Historical invoices are always calculated using the configuration that was active when the invoice was created. 
          Previous configurations are never overwritten.
        </p>
      </div>

      {error && (
        <div className="bg-rose-50 border border-rose-200 rounded-xl px-5 py-3.5 text-sm font-semibold text-rose-700 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" /> {error}
        </div>
      )}

      {/* Timeline List */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-16 text-center text-slate-500 flex flex-col items-center">
            <RefreshCw className="w-8 h-8 animate-spin text-blue-600 mb-3" />
            Loading version history...
          </div>
        ) : versions.length === 0 ? (
          <div className="p-16 text-center text-slate-500">
            <FileText className="w-10 h-10 text-slate-300 mx-auto mb-3" />
            No configuration versions found.
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {versions.map((version, index) => {
              const isActive = index === 0;
              const isExpanded = expandedId === version.version;
              const date = new Date(version.created_at);

              return (
                <div key={version.version} className="transition-colors hover:bg-slate-50/50">
                  <div 
                    onClick={() => toggleExpand(version.version)}
                    className="p-5 cursor-pointer flex items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-4">
                      {/* Version Badge */}
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 border-2 ${
                        isActive 
                          ? 'bg-blue-50 border-blue-200 text-blue-700' 
                          : 'bg-slate-50 border-slate-200 text-slate-500'
                      }`}>
                        <div className="text-center leading-none">
                          <p className="text-[10px] font-bold uppercase mb-0.5">Vol</p>
                          <p className="text-base font-black">V{version.version}</p>
                        </div>
                      </div>

                      {/* Details */}
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className={`font-bold ${isActive ? 'text-blue-900' : 'text-slate-900'}`}>
                            Configuration V{version.version}
                          </h3>
                          {isActive && (
                            <span className="bg-blue-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                              Active Now
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-3 mt-1 text-xs font-medium text-slate-500">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5" />
                            {format(date, 'MMM d, yyyy')}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5" />
                            {format(date, 'h:mm a')}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="text-slate-400">
                      {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                    </div>
                  </div>

                  {/* Expanded Content */}
                  {isExpanded && (
                    <div className="px-5 pb-5 pt-0 animate-in slide-in-from-top-2 duration-200">
                      {renderConfigGrid(version)}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
