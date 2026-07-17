'use client';

import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import {
  Sliders, Save, RefreshCw, Layers, Info, AlertTriangle,
  CheckCircle2, Clock, CreditCard, TrendingUp, Users, Gift, Store
} from 'lucide-react';

interface ConfigField {
  key: string;
  label: string;
  description: string;
  type: 'number' | 'float' | 'percent' | 'text';
  prefix?: string;
  suffix?: string;
  step?: string;
  icon: any;
  usedIn: string[];
}

const CONFIG_GROUPS: { title: string; desc: string; fields: ConfigField[] }[] = [
  {
    title: 'Payment & Credit Period',
    desc: 'Controls when buyers earn double vs. reduced vs. zero points based on how quickly invoices are paid.',
    fields: [
      {
        key: 'credit_period',
        label: 'Credit Period (Days)',
        description: 'Invoices paid within this many days after issuance earn 2× base points. After this window, points scale down linearly.',
        type: 'number',
        suffix: 'days',
        icon: Clock,
        usedIn: ['Customer Portal', 'Admin Portal'],
      },
      {
        key: 'forfeiture_cutoff',
        label: 'Payment Cutoff (Days)',
        description: 'Invoices paid after this many days earn zero points. This is the hard forfeiture boundary.',
        type: 'number',
        suffix: 'days',
        icon: AlertTriangle,
        usedIn: ['Customer Portal', 'Admin Portal'],
      },
    ],
  },
  {
    title: 'High-Spend Threshold Bonus',
    desc: 'Buyers who exceed the monthly purchase threshold earn an additional flat bonus on top of their invoice points.',
    fields: [
      {
        key: 'high_spend_threshold',
        label: 'Monthly Purchase Threshold',
        description: 'If a buyer\'s total paid invoice amount in a calendar month exceeds this value, they qualify for the high-spend bonus.',
        type: 'number',
        prefix: '₹',
        icon: TrendingUp,
        usedIn: ['Admin Portal (Reports)'],
      },
      {
        key: 'high_spend_bonus',
        label: 'High-Spend Bonus Points',
        description: 'Flat bonus points awarded when a buyer exceeds the monthly purchase threshold.',
        type: 'number',
        suffix: 'pts',
        icon: Gift,
        usedIn: ['Customer Portal', 'Admin Portal'],
      },
    ],
  },
  {
    title: 'Loyalty Tier Bonuses',
    desc: 'Additional flat bonus points awarded to customers based on their loyalty tier standing.',
    fields: [
      {
        key: 'loyalty_bonus',
        label: 'Loyalty Tier Bonus',
        description: 'Bonus points awarded to buyers in the loyalty tier (e.g. consistent repeat purchasers).',
        type: 'number',
        suffix: 'pts',
        icon: CreditCard,
        usedIn: ['Customer Portal'],
      },
      {
        key: 'regular_bonus',
        label: 'Regular Buyer Bonus',
        description: 'Base bonus applied to regular buyers at invoice payment.',
        type: 'number',
        suffix: 'pts',
        icon: CreditCard,
        usedIn: ['Customer Portal'],
      },
    ],
  },
  {
    title: 'Product-Specific Bonuses',
    desc: 'Default bonus point values for Special and Old Stock tagged products (can be overridden per product in Product Tagging).',
    fields: [
      {
        key: 'special_bonus',
        label: 'Special Product Bonus',
        description: 'Default flat bonus points for any product tagged as "Special". Overridden if a product-specific value is set in Product Tagging.',
        type: 'number',
        suffix: 'pts',
        icon: Gift,
        usedIn: ['Customer Portal', 'Admin Portal'],
      },
      {
        key: 'old_stock_bonus',
        label: 'Old Stock Bonus',
        description: 'Default flat bonus points for any product tagged as "Old Stock". Intended to help clear aging inventory.',
        type: 'number',
        suffix: 'pts',
        icon: Gift,
        usedIn: ['Customer Portal', 'Admin Portal'],
      },
    ],
  },
  {
    title: 'Referral & Marketing Rep Settings',
    desc: 'Controls the minimum invoice value for rep commission eligibility and the commission rate applied.',
    fields: [
      {
        key: 'referral_min_value',
        label: 'Minimum Purchase Amount for Referral',
        description: 'A Marketing Representative\'s referred invoice must be equal to or above this value for the rep to earn commission points.',
        type: 'number',
        prefix: '₹',
        icon: Users,
        usedIn: ['Customer Portal', 'Rep Portal', 'Admin Portal'],
      },
      {
        key: 'referral_rate',
        label: 'Referral Reward Rate',
        description: 'Percentage of the invoice amount awarded as commission points to the Marketing Representative (e.g. 0.01 = 1%).',
        type: 'percent',
        step: '0.001',
        icon: TrendingUp,
        usedIn: ['Rep Portal', 'Admin Portal'],
      },
      {
        key: 'shop_onboard_bonus',
        label: 'Shop Onboarding Bonus',
        description: 'One-time bonus points awarded to a Marketing Representative when a shop they referred is verified by the Admin.',
        type: 'number',
        suffix: 'pts',
        icon: Store,
        usedIn: ['Rep Portal', 'Admin Portal'],
      },
    ],
  },
];

const PORTAL_COLORS: Record<string, string> = {
  'Customer Portal': 'bg-blue-50 text-blue-700 border-blue-100',
  'Rep Portal': 'bg-purple-50 text-purple-700 border-purple-100',
  'Admin Portal': 'bg-slate-100 text-slate-700 border-slate-200',
  'Admin Portal (Reports)': 'bg-indigo-50 text-indigo-700 border-indigo-100',
};

export default function AdminRewardConfigPage() {
  const [config, setConfig] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const fetchConfig = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await api.get('/admin/config');
      setConfig(res.data);
    } catch (err) {
      setError('Failed to load reward configuration.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchConfig(); }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');
    try {
      const res = await api.post('/admin/config', config);
      setSuccess(`✓ Configuration saved as Version ${res.data.version}. All future reward calculations will use this version. Historical invoices remain unaffected.`);
      setConfig((prev: any) => ({ ...prev, version: res.data.version }));
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to save configuration.');
    } finally {
      setSaving(false);
    }
  };

  const updateField = (key: string, value: any) => {
    setConfig((prev: any) => ({ ...prev, [key]: value }));
    setSuccess('');
  };

  const renderInput = (field: ConfigField) => {
    const val = config?.[field.key] ?? '';
    const Icon = field.icon;

    if (field.type === 'percent') {
      return (
        <div className="relative">
          <input
            type="number"
            step={field.step || '0.001'}
            min={0}
            max={1}
            value={val}
            onChange={(e) => updateField(field.key, parseFloat(e.target.value) || 0)}
            className="w-full px-3 py-2.5 pr-24 border border-slate-200 rounded-lg text-sm font-mono font-bold focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 text-xs font-semibold">
            = {((val || 0) * 100).toFixed(1)}%
          </span>
        </div>
      );
    }

    return (
      <div className="relative">
        {field.prefix && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">{field.prefix}</span>
        )}
        <input
          type="number"
          step={field.type === 'float' ? '0.01' : '1'}
          min={0}
          value={val}
          onChange={(e) => {
            const v = field.type === 'float' ? parseFloat(e.target.value) || 0 : parseInt(e.target.value) || 0;
            updateField(field.key, v);
          }}
          className={`w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm font-mono font-bold focus:outline-none focus:ring-2 focus:ring-blue-500 ${field.prefix ? 'pl-7' : ''} ${field.suffix ? 'pr-16' : ''}`}
          required
        />
        {field.suffix && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs font-semibold">{field.suffix}</span>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Reward Rule Configuration</h1>
          <p className="text-sm text-slate-500 mt-1">
            All configurable values used by the reward engine. No reward calculation values are hardcoded into the system.
          </p>
        </div>
        <button onClick={fetchConfig} className="bg-white border border-slate-200 text-slate-700 px-3 py-2 rounded-lg text-sm font-medium hover:bg-slate-50 flex items-center gap-2 shadow-sm shrink-0">
          <RefreshCw className="w-4 h-4" /> Refresh
        </button>
      </div>

      {/* Version badge + versioning callout */}
      {config && (
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="bg-white border border-slate-200 rounded-xl px-5 py-4 flex items-center gap-3 shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center shrink-0">
              <Layers className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-medium">Active Version</p>
              <p className="text-2xl font-black text-blue-600">V{config.version}</p>
            </div>
          </div>
          <div className="flex-1 bg-amber-50 border border-amber-200 rounded-xl px-5 py-4 flex items-start gap-3">
            <AlertTriangle className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
            <div>
              <p className="text-xs font-bold text-amber-800">Configuration Versioning is Automatic</p>
              <p className="text-xs text-amber-700 mt-0.5 leading-relaxed">
                Every save creates a new version (V{config.version} → V{config.version + 1}). Historical invoices will always use the version active at the time they were calculated — changes never retroactively affect past payouts.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Global usage note */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl px-5 py-3.5 flex items-start gap-3">
        <Info className="w-4 h-4 text-blue-600 mt-0.5 shrink-0" />
        <p className="text-xs text-blue-800 font-medium leading-relaxed">
          These settings are used across the <strong>Customer Portal</strong>, <strong>Marketing Representative Portal</strong>, and <strong>Admin Portal</strong>.
          Each field below shows which portals are affected.
        </p>
      </div>

      {error && (
        <div className="bg-rose-50 border border-rose-200 rounded-xl px-5 py-3.5 text-sm font-semibold text-rose-700 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 shrink-0" /> {error}
        </div>
      )}

      {success && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl px-5 py-3.5 text-sm font-semibold text-emerald-700 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" /> {success}
        </div>
      )}

      {loading ? (
        <div className="bg-white rounded-xl border border-slate-200 p-16 text-center text-slate-500 shadow-sm">
          <RefreshCw className="w-6 h-6 animate-spin text-blue-600 mx-auto mb-2" />
          Loading reward configuration…
        </div>
      ) : (
        <form onSubmit={handleSave} className="space-y-6">

          {CONFIG_GROUPS.map((group) => (
            <div key={group.title} className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
              {/* Group header */}
              <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50">
                <h3 className="font-bold text-slate-900">{group.title}</h3>
                <p className="text-xs text-slate-500 mt-0.5">{group.desc}</p>
              </div>

              <div className="p-6 grid md:grid-cols-2 gap-6">
                {group.fields.map((field) => {
                  const Icon = field.icon;
                  return (
                    <div key={field.key} className="space-y-2">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-md bg-blue-50 flex items-center justify-center shrink-0">
                          <Icon className="w-3.5 h-3.5 text-blue-600" />
                        </div>
                        <label className="text-xs font-bold text-slate-900">{field.label}</label>
                      </div>

                      {renderInput(field)}

                      <p className="text-[11px] text-slate-500 leading-relaxed">{field.description}</p>

                      {/* Used-in portals */}
                      <div className="flex flex-wrap gap-1.5 pt-0.5">
                        {field.usedIn.map((portal) => (
                          <span
                            key={portal}
                            className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${PORTAL_COLORS[portal] || 'bg-slate-100 text-slate-600 border-slate-200'}`}
                          >
                            {portal}
                          </span>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}

          {/* Save button */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm px-6 py-5 flex items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-sm text-slate-600">
              <Sliders className="w-4 h-4 text-slate-400" />
              <span>Saving will create <strong>Version {config ? config.version + 1 : '–'}</strong> and activate it for all new reward calculations.</span>
            </div>
            <button
              type="submit"
              disabled={saving}
              className="bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-bold py-2.5 px-6 rounded-lg text-sm transition-colors flex items-center gap-2 shadow-sm shrink-0"
            >
              <Save className="w-4 h-4" />
              {saving ? 'Saving…' : 'Save & Create New Version'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
