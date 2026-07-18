'use client';

import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import {
  History, Search, Filter, RefreshCw, FileText,
  ArrowUpRight, ArrowDownRight, ChevronDown, ChevronUp,
  Info, ShieldCheck, BookOpen, User, Calendar, Clock
} from 'lucide-react';

const SOURCE_LABELS: Record<string, { label: string; color: string; bg: string }> = {
  invoice_payment:    { label: 'Invoice Payment',    color: 'text-blue-700',    bg: 'bg-blue-50 border-blue-100' },
  sales_commission:   { label: 'Rep Commission',     color: 'text-purple-700',  bg: 'bg-purple-50 border-purple-100' },
  onboarding_bonus:   { label: 'Onboarding Bonus',   color: 'text-teal-700',    bg: 'bg-teal-50 border-teal-100' },
  referral_bonus:     { label: 'Referral Bonus',     color: 'text-indigo-700',  bg: 'bg-indigo-50 border-indigo-100' },
  redemption:         { label: 'Redemption Payout',  color: 'text-rose-700',    bg: 'bg-rose-50 border-rose-100' },
  redemption_refund:  { label: 'Redemption Refund',  color: 'text-amber-700',   bg: 'bg-amber-50 border-amber-100' },
  scan:               { label: 'QR Scan',            color: 'text-emerald-700', bg: 'bg-emerald-50 border-emerald-100' },
  manual:             { label: 'Manual Adjustment',  color: 'text-slate-700',   bg: 'bg-slate-50 border-slate-200' },
};

function parseRules(ruleStr: string | null): string[] {
  if (!ruleStr) return [];
  return ruleStr.split(',').map((r) => r.trim()).filter(Boolean);
}

function RuleBadge({ rule }: { rule: string }) {
  const match = rule.match(/^(BR-\d+)/);
  const code = match ? match[1] : null;
  const desc = code ? rule.replace(code, '').replace(/^\s*\(/, '').replace(/\)$/, '').trim() : rule;
  return (
    <div className="inline-flex items-start gap-2 bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-[10px] leading-normal shadow-sm">
      {code && (
        <span className="font-mono font-black text-blue-700 shrink-0 bg-blue-50 px-1 py-0.5 rounded border border-blue-100">{code}</span>
      )}
      <span className="text-slate-700 font-semibold">{desc || rule}</span>
    </div>
  );
}

function LogRow({ log }: { log: any }) {
  const [expanded, setExpanded] = useState(false);
  const rules = parseRules(log.rule_applied);
  const src = SOURCE_LABELS[log.source] || { label: log.source.replace(/_/g, ' '), color: 'text-slate-700', bg: 'bg-slate-50 border-slate-200' };

  return (
    <>
      <tr
        className={`hover:bg-slate-50/70 transition-colors cursor-pointer border-b border-slate-100 ${expanded ? 'bg-slate-50/50' : ''}`}
        onClick={() => setExpanded(!expanded)}
      >
        {/* Timestamp */}
        <td className="px-5 py-4 text-xs text-slate-500 font-semibold font-mono whitespace-nowrap">
          <div className="flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <span>{new Date(log.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
          </div>
          <div className="text-[10px] text-slate-400 mt-1 flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span>{new Date(log.created_at).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}</span>
          </div>
        </td>

        {/* Account */}
        <td className="px-5 py-4">
          <div className="flex items-center gap-2.5">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 shadow-sm ${
              log.buyer_role === 'rep' 
                ? 'bg-purple-100 text-purple-700 border border-purple-200' 
                : 'bg-blue-100 text-blue-700 border border-blue-200'
            }`}>
              {log.buyer_name?.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="text-slate-900 font-bold text-xs leading-none">{log.buyer_name}</p>
              <p className="text-[10px] text-slate-400 font-semibold mt-1 leading-none">{log.buyer_email}</p>
            </div>
          </div>
        </td>

        {/* Role */}
        <td className="px-5 py-4">
          <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider border ${
            log.buyer_role === 'rep' 
              ? 'text-purple-700 bg-purple-50 border-purple-100' 
              : 'text-blue-700 bg-blue-50 border-blue-100'
          }`}>
            {log.buyer_role === 'rep' ? 'Rep' : 'Buyer'}
          </span>
        </td>

        {/* Source */}
        <td className="px-5 py-4">
          <span className={`inline-block px-2.5 py-0.5 rounded-full text-[9px] font-black border uppercase tracking-wider ${src.bg} ${src.color}`}>
            {src.label}
          </span>
        </td>

        {/* Invoice # */}
        <td className="px-5 py-4 text-center">
          {log.invoice_number ? (
            <span className="inline-flex items-center gap-1 font-bold text-xs text-slate-800 bg-slate-100 px-2 py-0.5 rounded-lg border">
              <FileText className="w-3 h-3 text-slate-400" /> {log.invoice_number}
            </span>
          ) : (
            <span className="text-slate-300 text-xs">—</span>
          )}
        </td>

        {/* Config Version */}
        <td className="px-5 py-4 text-center">
          {log.config_version ? (
            <span className="inline-flex items-center gap-0.5 text-[9px] font-mono font-bold text-slate-600 bg-slate-50 border border-slate-200 px-2 py-0.5 rounded-lg shadow-sm">
              V{log.config_version}
            </span>
          ) : (
            <span className="text-slate-300 text-xs">—</span>
          )}
        </td>

        {/* Rules summary */}
        <td className="px-5 py-4 max-w-[220px]">
          {rules.length > 0 ? (
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] text-slate-600 font-bold truncate max-w-[160px]" title={rules[0]}>
                {rules[0]}
              </span>
              {rules.length > 1 && (
                <span className="text-[9px] font-black text-blue-700 bg-blue-50 border border-blue-100 px-1.5 py-0.5 rounded shrink-0">
                  +{rules.length - 1}
                </span>
              )}
            </div>
          ) : (
            <span className="text-slate-400 text-[10px] italic">No rule recorded</span>
          )}
        </td>

        {/* Points Delta */}
        <td className="px-5 py-4 text-right">
          {log.type === 'credit' ? (
            <span className="text-emerald-600 font-black text-xs sm:text-sm inline-flex items-center gap-0.5 bg-emerald-50 px-2 py-1 rounded-xl border border-emerald-100">
              <ArrowUpRight className="w-3.5 h-3.5" /> +{log.points.toLocaleString()}
            </span>
          ) : (
            <span className="text-rose-600 font-black text-xs sm:text-sm inline-flex items-center gap-0.5 bg-rose-50 px-2 py-1 rounded-xl border border-rose-100">
              <ArrowDownRight className="w-3.5 h-3.5" /> −{log.points.toLocaleString()}
            </span>
          )}
        </td>

        {/* Expand toggle */}
        <td className="px-3 py-4 text-center">
          {rules.length > 0 ? (
            expanded
              ? <ChevronUp className="w-4 h-4 text-slate-400" />
              : <ChevronDown className="w-4 h-4 text-slate-400" />
          ) : null}
        </td>
      </tr>

      {/* Expanded Rules Detail */}
      {expanded && (
        <tr className="bg-slate-50/40">
          <td colSpan={9} className="px-6 py-5 border-b border-slate-200">
            <div className="flex items-start gap-4">
              <div className="bg-blue-50 border border-blue-100 rounded-xl p-2.5 shrink-0 mt-0.5 shadow-sm">
                <BookOpen className="w-5 h-5 text-blue-700" />
              </div>
              <div className="flex-1 space-y-3">
                <div className="flex items-center gap-2">
                  <p className="text-xs font-black text-slate-900 uppercase tracking-wide">Business Rules Applied</p>
                  {log.config_version && (
                    <span className="text-[10px] font-mono font-bold text-slate-500 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded-lg shadow-sm">
                      Config Version {log.config_version}
                    </span>
                  )}
                </div>
                <div className="flex flex-wrap gap-2">
                  {rules.map((rule: string, i: number) => (
                    <RuleBadge key={i} rule={rule} />
                  ))}
                </div>
                <p className="text-xs text-blue-800 font-medium flex items-center gap-1.5 mt-2 bg-blue-50/50 p-2.5 border border-blue-100/50 rounded-xl max-w-3xl leading-relaxed">
                  <Info className="w-4 h-4 text-blue-600 shrink-0" />
                  <span>
                    This transaction details the allocation rules applied for **{log.buyer_name}** resulting in a delta of **{log.type === 'credit' ? '+' : '−'}{log.points.toLocaleString()} points**
                    {log.invoice_number ? ` generated against Invoice #${log.invoice_number}` : ''}.
                  </span>
                </p>
              </div>
            </div>
          </td>
        </tr>
      )}
    </>
  );
}

export default function AdminAuditLogs() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [sourceFilter, setSourceFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [error, setError] = useState('');

  const fetchLogs = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await api.get('/admin/audit-logs', {
        params: { search: search.trim(), source: sourceFilter }
      });
      setLogs(res.data);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch audit log entries.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchLogs(); }, [sourceFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchLogs();
  };

  // Client-side type filter
  const filtered = typeFilter ? logs.filter((l: any) => l.type === typeFilter) : logs;

  const creditCount = logs.filter((l: any) => l.type === 'credit').length;
  const debitCount  = logs.filter((l: any) => l.type === 'debit').length;
  const totalCreditPts = logs.filter((l: any) => l.type === 'credit').reduce((s: number, l: any) => s + l.points, 0);
  const totalDebitPts  = logs.filter((l: any) => l.type === 'debit').reduce((s: number, l: any) => s + l.points, 0);

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white border border-slate-200 p-6 rounded-2xl shadow-sm">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <History className="w-6 h-6 text-yellow-500 animate-pulse" />
            <span>Audit Log</span>
          </h1>
          <p className="text-sm text-slate-500 font-medium mt-1">
            Historical trace of points credits and redemptions mapped to business rules.
          </p>
        </div>
        <button
          onClick={fetchLogs}
          className="bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 px-4 py-2.5 rounded-xl text-xs font-bold transition-all shadow-sm flex items-center gap-2 shrink-0 self-stretch sm:self-auto text-center justify-center"
        >
          <RefreshCw className="w-3.5 h-3.5" /> Refresh Audit Logs
        </button>
      </div>

      {/* Summary KPI strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Entries', value: logs.length, sub: 'Transactions tracked', icon: History, color: 'text-slate-700', bg: 'bg-slate-100 border-slate-200' },
          { label: 'Credit Events', value: creditCount, sub: `+${totalCreditPts.toLocaleString()} pts credited`, icon: ArrowUpRight, color: 'text-emerald-700', bg: 'bg-emerald-50 border-emerald-100' },
          { label: 'Debit Events', value: debitCount, sub: `−${totalDebitPts.toLocaleString()} pts claimed`, icon: ArrowDownRight, color: 'text-rose-700', bg: 'bg-rose-50 border-rose-100' },
          { label: 'Net Circulation', value: (totalCreditPts - totalDebitPts).toLocaleString(), sub: 'Outstanding points balance', icon: ShieldCheck, color: 'text-blue-700', bg: 'bg-blue-50 border-blue-100' },
        ].map((card) => {
          const Icon = card.icon;
          return (
            <div key={card.label} className="group bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all flex items-start gap-4">
              <div className={`p-3 rounded-xl ${card.bg} border shrink-0 transition-transform group-hover:scale-110 duration-200`}>
                <Icon className={`w-5 h-5 ${card.color}`} />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1.5">{card.label}</p>
                <p className="text-2xl font-black text-slate-900 leading-tight">{card.value.toLocaleString()}</p>
                <p className="text-[10px] text-slate-500 font-semibold mt-1 leading-none truncate">{card.sub}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Info callout */}
      <div className="bg-blue-50/50 border border-blue-200 rounded-2xl px-5 py-4 flex items-start gap-3 shadow-sm">
        <Info className="w-5 h-5 text-blue-600 mt-0.5 shrink-0 animate-bounce" />
        <p className="text-xs text-blue-800 font-semibold leading-relaxed">
          Expand any record below to investigate the **exact business rules** and **active rule configuration version** applied.
          This enables immediate resolution of customer points audits.
        </p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm flex flex-col md:flex-row gap-4 items-center">
        <form onSubmit={handleSearchSubmit} className="flex gap-2 w-full md:max-w-md shrink-0">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search buyer name, email, invoice..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
            />
          </div>
          <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-5 py-2.5 rounded-xl transition-all shadow-sm">
            Search
          </button>
        </form>

        <div className="flex gap-3 ml-auto flex-wrap w-full md:w-auto justify-end items-center">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400">
            <Filter className="w-4 h-4" /> Filters:
          </div>
          <select
            value={sourceFilter}
            onChange={(e) => setSourceFilter(e.target.value)}
            className="border border-slate-200 rounded-xl text-xs px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 font-bold bg-white text-slate-600 shadow-sm"
          >
            <option value="">All Sources</option>
            <option value="invoice_payment">Invoice Payments</option>
            <option value="sales_commission">Rep Commissions</option>
            <option value="onboarding_bonus">Onboarding Bonus</option>
            <option value="referral_bonus">Referral Bonus</option>
            <option value="redemption">Redemption Payouts</option>
            <option value="redemption_refund">Redemption Refunds</option>
          </select>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="border border-slate-200 rounded-xl text-xs px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 font-bold bg-white text-slate-600 shadow-sm"
          >
            <option value="">Credit & Debit</option>
            <option value="credit">Credits Only</option>
            <option value="debit">Debits Only</option>
          </select>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-sm font-semibold text-rose-800">{error}</div>
      )}

      {/* Log Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-400 border-b border-slate-200 text-[10px] font-black uppercase tracking-wider">
              <tr>
                <th className="px-5 py-3">Timestamp</th>
                <th className="px-5 py-3">Account</th>
                <th className="px-5 py-3">Role</th>
                <th className="px-5 py-3">Source</th>
                <th className="px-5 py-3 text-center">Invoice #</th>
                <th className="px-5 py-3 text-center">Config Ver.</th>
                <th className="px-5 py-3">Rules Applied</th>
                <th className="px-5 py-3 text-right">Points Δ</th>
                <th className="px-5 py-3 w-8"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-bold">
              {loading ? (
                <tr>
                  <td colSpan={9} className="px-6 py-16 text-center text-slate-500">
                    <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                    <span className="text-xs text-slate-400 font-bold">Loading audit entries…</span>
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-6 py-16 text-center text-slate-400 italic font-medium">
                    No transactions matched your filter criteria.
                  </td>
                </tr>
              ) : (
                filtered.map((log: any) => <LogRow key={log.id} log={log} />)
              )}
            </tbody>
          </table>
        </div>

        {/* Footer count */}
        {!loading && filtered.length > 0 && (
          <div className="px-5 py-3.5 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between font-semibold">
            <p className="text-xs text-slate-500">Showing <strong>{filtered.length}</strong> transactions</p>
            <p className="text-[10px] text-slate-400 italic">Click rows to view active configurations</p>
          </div>
        )}
      </div>
    </div>
  );
}
