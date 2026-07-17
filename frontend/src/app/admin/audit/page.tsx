'use client';

import { useState, useEffect, useRef } from 'react';
import { api } from '@/lib/api';
import {
  History, Search, Filter, RefreshCw, FileText,
  ArrowUpRight, ArrowDownRight, ChevronDown, ChevronUp,
  Info, ShieldCheck, BookOpen, User
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
    <div className="inline-flex items-start gap-1.5 bg-slate-100 border border-slate-200 rounded-md px-2 py-1 text-[10px] leading-snug">
      {code && (
        <span className="font-mono font-bold text-blue-700 shrink-0">{code}</span>
      )}
      <span className="text-slate-600 font-medium">{desc || rule}</span>
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
        className={`hover:bg-slate-50/60 transition-colors cursor-pointer ${expanded ? 'bg-slate-50/40' : ''}`}
        onClick={() => setExpanded(!expanded)}
      >
        {/* Timestamp */}
        <td className="px-5 py-3.5 text-xs text-slate-500 font-mono whitespace-nowrap">
          <div>{new Date(log.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</div>
          <div className="text-[10px] text-slate-400">{new Date(log.created_at).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}</div>
        </td>

        {/* Account */}
        <td className="px-5 py-3.5">
          <div className="flex items-center gap-2">
            <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${log.buyer_role === 'rep' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>
              {log.buyer_name?.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="text-slate-900 font-semibold text-xs leading-none">{log.buyer_name}</p>
              <p className="text-[10px] text-slate-400 font-normal mt-0.5">{log.buyer_email}</p>
            </div>
          </div>
        </td>

        {/* Role */}
        <td className="px-5 py-3.5">
          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${log.buyer_role === 'rep' ? 'text-purple-700 bg-purple-50 border-purple-100' : 'text-blue-700 bg-blue-50 border-blue-100'}`}>
            {log.buyer_role === 'rep' ? 'Rep' : 'Buyer'}
          </span>
        </td>

        {/* Source */}
        <td className="px-5 py-3.5">
          <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold border capitalize ${src.bg} ${src.color}`}>
            {src.label}
          </span>
        </td>

        {/* Invoice # */}
        <td className="px-5 py-3.5 text-center">
          {log.invoice_number ? (
            <span className="inline-flex items-center gap-1 font-bold text-xs text-slate-800">
              <FileText className="w-3 h-3 text-slate-400" /> {log.invoice_number}
            </span>
          ) : (
            <span className="text-slate-300 text-xs">—</span>
          )}
        </td>

        {/* Config Version */}
        <td className="px-5 py-3.5 text-center">
          {log.config_version ? (
            <span className="inline-flex items-center gap-0.5 text-[10px] font-mono font-bold text-slate-600 bg-slate-100 border border-slate-200 px-1.5 py-0.5 rounded">
              v{log.config_version}
            </span>
          ) : (
            <span className="text-slate-300 text-xs">—</span>
          )}
        </td>

        {/* Rules summary */}
        <td className="px-5 py-3.5 max-w-[220px]">
          {rules.length > 0 ? (
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] text-slate-600 font-medium truncate max-w-[160px]" title={rules[0]}>
                {rules[0]}
              </span>
              {rules.length > 1 && (
                <span className="text-[10px] font-bold text-blue-600 bg-blue-50 border border-blue-100 px-1 rounded shrink-0">
                  +{rules.length - 1}
                </span>
              )}
            </div>
          ) : (
            <span className="text-slate-400 text-[10px] italic">No rule recorded</span>
          )}
        </td>

        {/* Points Delta */}
        <td className="px-5 py-3.5 text-right">
          {log.type === 'credit' ? (
            <span className="text-emerald-600 font-black text-sm inline-flex items-center gap-0.5">
              <ArrowUpRight className="w-3.5 h-3.5" /> +{log.points.toLocaleString()}
            </span>
          ) : (
            <span className="text-rose-600 font-black text-sm inline-flex items-center gap-0.5">
              <ArrowDownRight className="w-3.5 h-3.5" /> −{log.points.toLocaleString()}
            </span>
          )}
          <p className="text-[10px] text-slate-400 font-normal">pts</p>
        </td>

        {/* Expand toggle */}
        <td className="px-3 py-3.5 text-center">
          {rules.length > 0 ? (
            expanded
              ? <ChevronUp className="w-3.5 h-3.5 text-slate-400" />
              : <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          ) : null}
        </td>
      </tr>

      {/* Expanded Rules Detail */}
      {expanded && (
        <tr className="bg-blue-50/30">
          <td colSpan={9} className="px-6 py-4 border-b border-blue-100">
            <div className="flex items-start gap-3">
              <div className="bg-blue-100 rounded-lg p-2 shrink-0 mt-0.5">
                <BookOpen className="w-4 h-4 text-blue-700" />
              </div>
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-2">
                  <p className="text-xs font-bold text-slate-900">Business Rules Applied</p>
                  {log.config_version && (
                    <span className="text-[10px] font-mono font-bold text-slate-500 bg-slate-200 border border-slate-300 px-1.5 py-0.5 rounded">
                      Config Version {log.config_version}
                    </span>
                  )}
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {rules.map((rule, i) => (
                    <RuleBadge key={i} rule={rule} />
                  ))}
                </div>
                <p className="text-[10px] text-blue-700 font-medium flex items-center gap-1 mt-1">
                  <Info className="w-3 h-3" />
                  This explains why <strong>{log.buyer_name}</strong> received {log.type === 'credit' ? '+' : '−'}{log.points.toLocaleString()} points
                  {log.invoice_number ? ` for invoice ${log.invoice_number}` : ''}.
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
  const filtered = typeFilter ? logs.filter((l) => l.type === typeFilter) : logs;

  const creditCount = logs.filter((l) => l.type === 'credit').length;
  const debitCount  = logs.filter((l) => l.type === 'debit').length;
  const totalCreditPts = logs.filter((l) => l.type === 'credit').reduce((s, l) => s + l.points, 0);
  const totalDebitPts  = logs.filter((l) => l.type === 'debit').reduce((s, l) => s + l.points, 0);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Audit Log</h1>
          <p className="text-sm text-slate-500 mt-1">
            Every reward point transaction — credited or withheld — along with the exact business rule and configuration version used to calculate it.
          </p>
        </div>
        <button
          onClick={fetchLogs}
          className="bg-white border border-slate-200 text-slate-700 px-3 py-2 rounded-lg text-sm font-medium hover:bg-slate-50 flex items-center gap-2 shadow-sm shrink-0"
        >
          <RefreshCw className="w-4 h-4" /> Refresh
        </button>
      </div>

      {/* Summary KPI strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Entries', value: logs.length, icon: History, color: 'text-slate-700', bg: 'bg-slate-100' },
          { label: 'Credit Events', value: creditCount, sub: `+${totalCreditPts.toLocaleString()} pts`, icon: ArrowUpRight, color: 'text-emerald-700', bg: 'bg-emerald-50' },
          { label: 'Debit Events', value: debitCount, sub: `−${totalDebitPts.toLocaleString()} pts`, icon: ArrowDownRight, color: 'text-rose-700', bg: 'bg-rose-50' },
          { label: 'Net Points', value: (totalCreditPts - totalDebitPts).toLocaleString(), sub: 'across all accounts', icon: ShieldCheck, color: 'text-blue-700', bg: 'bg-blue-50' },
        ].map((card) => {
          const Icon = card.icon;
          return (
            <div key={card.label} className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
              <div className={`w-8 h-8 rounded-lg ${card.bg} flex items-center justify-center mb-3`}>
                <Icon className={`w-4 h-4 ${card.color}`} />
              </div>
              <p className="text-xl font-bold text-slate-900">{card.value}</p>
              <p className="text-xs text-slate-500 font-medium mt-0.5">{card.label}</p>
              {card.sub && <p className={`text-[10px] font-semibold mt-0.5 ${card.color}`}>{card.sub}</p>}
            </div>
          );
        })}
      </div>

      {/* Info callout */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl px-5 py-3.5 flex items-start gap-3">
        <Info className="w-4 h-4 text-blue-600 mt-0.5 shrink-0" />
        <p className="text-xs text-blue-800 font-medium leading-relaxed">
          Click any row to expand the <strong>business rules applied</strong> and the <strong>configuration version</strong> active at the time of the transaction. 
          This lets you answer <em>"Why did this customer receive these points?"</em> without any additional investigation.
        </p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm flex flex-col md:flex-row gap-3 items-center">
        <form onSubmit={handleSearchSubmit} className="flex gap-2 w-full md:max-w-sm">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search name, email, invoice, rule…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm px-4 py-2 rounded-lg transition-colors shadow-sm">
            Search
          </button>
        </form>

        <div className="flex gap-2 ml-auto flex-wrap">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500">
            <Filter className="w-3.5 h-3.5" /> Filter:
          </div>
          <select
            value={sourceFilter}
            onChange={(e) => setSourceFilter(e.target.value)}
            className="border border-slate-200 rounded-lg text-xs px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500 font-semibold bg-white"
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
            className="border border-slate-200 rounded-lg text-xs px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500 font-semibold bg-white"
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
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-500 border-b border-slate-200 text-[11px] font-semibold uppercase tracking-wider">
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
            <tbody className="divide-y divide-slate-100 font-medium">
              {loading ? (
                <tr>
                  <td colSpan={9} className="px-6 py-10 text-center text-slate-500">
                    <RefreshCw className="w-4 h-4 animate-spin text-blue-600 inline mr-2" />Loading audit entries…
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-6 py-10 text-center text-slate-400 italic">
                    No transactions matched your filter criteria.
                  </td>
                </tr>
              ) : (
                filtered.map((log) => <LogRow key={log.id} log={log} />)
              )}
            </tbody>
          </table>
        </div>

        {/* Footer count */}
        {!loading && filtered.length > 0 && (
          <div className="px-5 py-3 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between">
            <p className="text-xs text-slate-500 font-medium">Showing <strong>{filtered.length}</strong> entries</p>
            <p className="text-xs text-slate-400">Click any row to view the exact rules used for that transaction</p>
          </div>
        )}
      </div>
    </div>
  );
}
