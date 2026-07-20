'use client';

import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import {
  Sliders, Save, RefreshCw, Layers, Info, AlertTriangle,
  CheckCircle2, Clock, CreditCard, TrendingUp, Users, Gift, 
  Store, Calculator, Sparkles, HelpCircle, ShieldAlert, Percent
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
    desc: 'Controls base invoice points conversion percentage, payment credit windows, and forfeiture cutoff.',
    fields: [
      {
        key: 'invoice_reward_percentage',
        label: 'Invoice to Reward Points Percentage',
        description: 'This field defines the percentage of the invoice amount that will be converted into reward points. For example, if a customer makes a purchase of ₹50,000 and the Invoice to Reward Points Percentage is set to 50%, the customer will receive 25,000 reward points.',
        type: 'percent',
        step: '0.01',
        icon: Percent,
        usedIn: ['Customer Portal', 'Admin Portal'],
      },
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
        description: "If a buyer's total paid invoice amount in a calendar month exceeds this value, they qualify for the high-spend bonus.",
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
    title: 'Loyalty Tier Variable (Consecutive Monthly Purchase)',
    desc: 'Defines consecutive months requirement, minimum monthly purchase amount, and loyalty bonus points awarded.',
    fields: [
      {
        key: 'loyalty_consecutive_months',
        label: 'Consecutive Months Required',
        description: 'Number of consecutive months a customer must meet the minimum purchase requirement to qualify for a loyalty reward (e.g. 3, 6, or 12 months).',
        type: 'number',
        suffix: 'Months',
        icon: Clock,
        usedIn: ['Customer Portal', 'Admin Portal'],
      },
      {
        key: 'loyalty_min_monthly_purchase',
        label: 'Minimum Monthly Purchase Amount',
        description: 'Minimum required paid purchase amount per month during the consecutive period (e.g., ₹2,00,000).',
        type: 'number',
        prefix: '₹',
        icon: TrendingUp,
        usedIn: ['Customer Portal', 'Admin Portal'],
      },
      {
        key: 'loyalty_bonus',
        label: 'Loyalty Bonus Points Awarded',
        description: 'Configured loyalty bonus points awarded when the customer completes the required purchases for the specified consecutive months (e.g. 10,000 Points).',
        type: 'number',
        suffix: 'pts',
        icon: Gift,
        usedIn: ['Customer Portal', 'Admin Portal'],
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
    title: 'Marketing Rep & Commission Settings',
    desc: 'Controls the commission rate applied and onboarding bonus for marketing representatives.',
    fields: [
      {
        key: 'referral_rate',
        label: 'Rep Commission Rate',
        description: 'Percentage of the invoice amount awarded as commission points to the Marketing Representative (e.g. 0.01 = 1%).',
        type: 'percent',
        step: '0.001',
        icon: TrendingUp,
        usedIn: ['Rep Portal', 'Admin Portal'],
      },
      {
        key: 'shop_onboard_bonus',
        label: 'Shop Onboarding Bonus',
        description: 'One-time bonus points awarded to a Marketing Representative when a shop assigned to them is verified by the Admin.',
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

  // Redesign Tab selection state
  const [activeTab, setActiveTab] = useState(0);

  // Simulator values state
  const [simDaysToPay, setSimDaysToPay] = useState(10);
  const [simInvoiceVal, setSimInvoiceVal] = useState(15000);
  const [simMonthlySpend, setSimMonthlySpend] = useState(180000);

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
            className="w-full px-3.5 py-3 pr-24 border border-slate-200 rounded-xl text-sm font-mono font-bold focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
            required
          />
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 text-xs font-semibold bg-slate-50 px-2 py-1 rounded border">
            = {((val || 0) * 100).toFixed(1)}%
          </span>
        </div>
      );
    }

    return (
      <div className="relative">
        {field.prefix && (
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">{field.prefix}</span>
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
          className={`w-full px-3.5 py-3 border border-slate-200 rounded-xl text-sm font-mono font-bold focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm ${field.prefix ? 'pl-8' : ''} ${field.suffix ? 'pr-16' : ''}`}
          required
        />
        {field.suffix && (
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 text-xs font-semibold">{field.suffix}</span>
        )}
      </div>
    );
  };

  // Live Simulator Calculations
  const invoiceRewardPct = config?.invoice_reward_percentage ?? 0.50;
  const creditPeriod = config?.credit_period ?? 7;
  const forfeitureCutoff = config?.forfeiture_cutoff ?? 30;
  const highSpendThreshold = config?.high_spend_threshold ?? 200000;
  const highSpendBonus = config?.high_spend_bonus ?? 500;
  const referralMinVal = config?.referral_min_value ?? 10000;
  const referralRate = config?.referral_rate ?? 0.01;

  // Calculate dynamic multiplier for invoice days payment
  const getSimMultiplier = () => {
    if (simDaysToPay <= creditPeriod) return 2.0;
    if (simDaysToPay > forfeitureCutoff) return 0.0;
    const factor = 2.0 - ((simDaysToPay - creditPeriod) / (forfeitureCutoff - creditPeriod)) * 2.0;
    return Math.max(0.0, Math.min(2.0, factor));
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      
      {/* Header Title Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white border border-slate-200 p-6 rounded-2xl shadow-sm">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <Sliders className="w-6 h-6 text-blue-600" />
            <span>Reward Rules</span>
          </h1>
          <p className="text-sm text-slate-500 font-medium mt-1">
            Global multipliers, credit period decay rates, rep commission limits, and loyalty tier incentives.
          </p>
        </div>
        <button 
          onClick={fetchConfig} 
          className="bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 px-4 py-2.5 rounded-xl text-xs font-bold transition-all shadow-sm flex items-center gap-2 shrink-0 self-stretch sm:self-auto text-center justify-center"
        >
          <RefreshCw className="w-3.5 h-3.5" /> Refresh Rules
        </button>
      </div>

      {/* Version badge + automatic versioning indicator */}
      {config && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white border border-slate-200 rounded-2xl px-5 py-4 flex items-center gap-3.5 shadow-sm">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center shrink-0 shadow-md">
              <Layers className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Active Version</p>
              <p className="text-2xl font-black text-blue-600 leading-none mt-1">V{config.version}</p>
            </div>
          </div>
          <div className="md:col-span-2 bg-gradient-to-r from-amber-50 to-orange-50/30 border border-amber-100 rounded-2xl px-5 py-4 flex items-start gap-3 shadow-sm">
            <ShieldAlert className="w-5 h-5 text-amber-600 mt-0.5 shrink-0" />
            <div>
              <p className="text-xs font-bold text-amber-800">Auto-Versioning Enabled</p>
              <p className="text-[11px] text-amber-700 mt-1 leading-relaxed font-medium">
                Saving updates creates **Version {config.version + 1}**. Historical points calculations are securely preserved, locking rule versions at the time of invoice payment to protect legacy metrics.
              </p>
            </div>
          </div>
        </div>
      )}

      {error && (
        <div className="bg-rose-50 border border-rose-200 rounded-xl px-5 py-3.5 text-sm font-semibold text-rose-700 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 shrink-0" /> {error}
        </div>
      )}

      {success && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl px-5 py-3.5 text-sm font-semibold text-emerald-700 flex items-center gap-2 shadow-sm">
          <CheckCircle2 className="w-4 h-4 shrink-0" /> {success}
        </div>
      )}

      {loading ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-20 text-center text-slate-500 shadow-sm flex flex-col justify-center items-center gap-3">
          <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-xs font-bold text-slate-500 animate-pulse">Loading reward configurations…</p>
        </div>
      ) : (
        <form onSubmit={handleSave} className="space-y-6">
          
          {/* Main Dual-Column Page Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* Left Sidebar Category Tabs + Rule Simulator */}
            <div className="lg:col-span-4 space-y-6">
              
              {/* Tab Selector Card */}
              <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm space-y-1">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-3 mb-2.5">Rule Groups</p>
                {CONFIG_GROUPS.map((group, index) => {
                  const isActive = activeTab === index;
                  // Get first field's icon
                  const Icon = group.fields[0]?.icon || Sliders;
                  return (
                    <button
                      key={group.title}
                      type="button"
                      onClick={() => setActiveTab(index)}
                      className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl text-left transition-all ${
                        isActive 
                          ? 'bg-blue-600 text-white font-bold shadow-md shadow-blue-500/10' 
                          : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 font-semibold'
                      }`}
                    >
                      <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                      <div className="min-w-0">
                        <p className="text-xs truncate leading-tight">{group.title}</p>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Dynamic Interactive Rule Simulator */}
              <div className="bg-slate-900 text-white rounded-2xl p-5 shadow-lg border border-slate-800 space-y-4 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl pointer-events-none"></div>
                <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
                  <Calculator className="w-4 h-4 text-blue-400" />
                  <h4 className="text-xs font-bold tracking-wider text-slate-200 uppercase">Live Engine Simulator</h4>
                </div>

                {/* Tab 0 Simulator (Credit Period Decay & Base Conversion) */}
                {activeTab === 0 && (
                  <div className="space-y-4 text-xs">
                    <p className="text-slate-400 leading-normal">
                      Slide to simulate delays in buyer payment and observe the decaying points factor.
                    </p>
                    <div className="space-y-2">
                      <div className="flex justify-between font-mono font-bold">
                        <span className="text-slate-400">Payment Delay:</span>
                        <span className="text-blue-400">{simDaysToPay} days</span>
                      </div>
                      <input
                        type="range"
                        min="1"
                        max="90"
                        value={simDaysToPay}
                        onChange={(e) => setSimDaysToPay(parseInt(e.target.value))}
                        className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
                      />
                      <div className="flex justify-between text-[10px] text-slate-500 font-bold font-mono">
                        <span>1d</span>
                        <span>{creditPeriod}d (credit)</span>
                        <span>{forfeitureCutoff}d (cutoff)</span>
                        <span>90d</span>
                      </div>
                    </div>
                    
                    <div className="bg-slate-950 p-4 rounded-xl text-center space-y-2 border border-slate-850">
                      <p className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold">Point Multiplier Factor</p>
                      <p className={`text-3xl font-black ${
                        getSimMultiplier() === 2.0 ? 'text-emerald-400' :
                        getSimMultiplier() > 0 ? 'text-amber-400' : 'text-rose-500'
                      }`}>
                        {getSimMultiplier().toFixed(2)}×
                      </p>
                      <span className="text-[9px] text-slate-500 font-semibold block">
                        {simDaysToPay <= creditPeriod ? '🎉 Premium Double Rate Qualified!' :
                         simDaysToPay > forfeitureCutoff ? '🛑 Forfeited: 0 points credited' :
                         '⚠️ Scale Decay: Linear point penalty applied'}
                      </span>

                      <div className="pt-2 border-t border-slate-800 text-left text-[11px] space-y-1 text-slate-400">
                        <p className="font-semibold text-slate-300">Example: ₹50,000 Invoice</p>
                        <div className="flex justify-between">
                          <span>Base ({(invoiceRewardPct * 100).toFixed(1)}%):</span>
                          <span className="font-mono text-slate-200">{Math.round(50000 * invoiceRewardPct).toLocaleString()} pts</span>
                        </div>
                        <div className="flex justify-between font-bold text-blue-400">
                          <span>Earned Points:</span>
                          <span className="font-mono">{Math.round(50000 * invoiceRewardPct * getSimMultiplier()).toLocaleString()} pts</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Tab 1 Simulator (Monthly High Spend Bonus) */}
                {activeTab === 1 && (
                  <div className="space-y-4 text-xs">
                    <p className="text-slate-400 leading-normal">
                      Simulate a buyer\'s monthly cumulative purchase spend to see threshold milestone qualification.
                    </p>
                    <div className="space-y-2">
                      <div className="flex justify-between font-mono font-bold">
                        <span className="text-slate-400">Monthly Purchase:</span>
                        <span className="text-emerald-400">₹{simMonthlySpend.toLocaleString()}</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="300000"
                        step="5000"
                        value={simMonthlySpend}
                        onChange={(e) => setSimMonthlySpend(parseInt(e.target.value))}
                        className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                      />
                      <div className="flex justify-between text-[10px] text-slate-500 font-bold font-mono">
                        <span>₹0</span>
                        <span>₹{(highSpendThreshold/1000).toFixed(0)}k (threshold)</span>
                        <span>₹300k</span>
                      </div>
                    </div>
                    
                    <div className="bg-slate-950 p-4 rounded-xl text-center border border-slate-850">
                      {simMonthlySpend >= highSpendThreshold ? (
                        <div className="space-y-1">
                          <p className="text-[10px] text-emerald-400 uppercase tracking-widest font-black flex items-center justify-center gap-1">
                            <Sparkles className="w-3.5 h-3.5" /> Milestone Unlocked!
                          </p>
                          <p className="text-3xl font-black text-white">+{highSpendBonus} pts</p>
                          <span className="text-[9px] text-slate-500 font-semibold">Credited to buyer as monthly milestone bonus.</span>
                        </div>
                      ) : (
                        <div className="space-y-1">
                          <p className="text-[10px] text-amber-500 uppercase tracking-widest font-black">Milestone Locked</p>
                          <p className="text-lg font-bold text-slate-400">₹{(highSpendThreshold - simMonthlySpend).toLocaleString()} more spend needed</p>
                          <span className="text-[9px] text-slate-500 font-semibold">Flat bonus of +{highSpendBonus} pts not qualified.</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Tab 4 Simulator (Representative commissions) */}
                {activeTab === 4 && (
                  <div className="space-y-4 text-xs">
                    <p className="text-slate-400 leading-normal">
                      Slide to simulate an invoice value and calculate representative sales commission.
                    </p>
                    <div className="space-y-2">
                      <div className="flex justify-between font-mono font-bold">
                        <span className="text-slate-400">Invoice Amount:</span>
                        <span className="text-purple-400">₹{simInvoiceVal.toLocaleString()}</span>
                      </div>
                      <input
                        type="range"
                        min="1000"
                        max="100000"
                        step="1000"
                        value={simInvoiceVal}
                        onChange={(e) => setSimInvoiceVal(parseInt(e.target.value))}
                        className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-purple-500"
                      />
                      <div className="flex justify-between text-[10px] text-slate-500 font-bold font-mono">
                        <span>₹1k</span>
                        <span>₹50k</span>
                        <span>₹100k</span>
                      </div>
                    </div>
                    
                    <div className="bg-slate-950 p-4 rounded-xl text-center border border-slate-850">
                      <div className="space-y-1">
                        <p className="text-[10px] text-purple-400 uppercase tracking-widest font-bold">Rep Commission Calculated</p>
                        <p className="text-3xl font-black text-white">+{Math.round(simInvoiceVal * referralRate).toLocaleString()} pts</p>
                        <span className="text-[9px] text-slate-500 font-semibold">Calculated at commission rate of {(referralRate*100).toFixed(1)}%.</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Tab 2 Simulator (Loyalty Tier Variable - Consecutive Monthly Purchase) */}
                {activeTab === 2 && (
                  <div className="space-y-4 text-xs">
                    <p className="text-slate-400 leading-normal">
                      Slide to simulate a buyer's average monthly purchase spend across consecutive months.
                    </p>
                    <div className="space-y-2">
                      <div className="flex justify-between font-mono font-bold">
                        <span className="text-slate-400">Monthly Spend:</span>
                        <span className="text-amber-400">₹{simMonthlySpend.toLocaleString()}</span>
                      </div>
                      <input
                        type="range"
                        min="50000"
                        max="500000"
                        step="10000"
                        value={simMonthlySpend}
                        onChange={(e) => setSimMonthlySpend(parseInt(e.target.value))}
                        className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
                      />
                      <div className="flex justify-between text-[10px] text-slate-500 font-bold font-mono">
                        <span>₹50k</span>
                        <span>₹{((config?.loyalty_min_monthly_purchase ?? 200000)/1000).toFixed(0)}k (min req)</span>
                        <span>₹500k</span>
                      </div>
                    </div>
                    
                    <div className="bg-slate-950 p-4 rounded-xl text-center border border-slate-850">
                      {simMonthlySpend >= (config?.loyalty_min_monthly_purchase ?? 200000) ? (
                        <div className="space-y-1">
                          <p className="text-[10px] text-amber-400 uppercase tracking-widest font-black flex items-center justify-center gap-1">
                            <Sparkles className="w-3.5 h-3.5" /> {config?.loyalty_consecutive_months ?? 3}-Month Loyalty Streak Qualified!
                          </p>
                          <p className="text-3xl font-black text-white">+{(config?.loyalty_bonus ?? 10000).toLocaleString()} pts</p>
                          <span className="text-[9px] text-slate-500 font-semibold block">
                            Purchases meet/exceed ₹{(config?.loyalty_min_monthly_purchase ?? 200000).toLocaleString()} for {config?.loyalty_consecutive_months ?? 3} consecutive months.
                          </span>
                        </div>
                      ) : (
                        <div className="space-y-1">
                          <p className="text-[10px] text-rose-400 uppercase tracking-widest font-bold">Streak Requirement Not Met</p>
                          <p className="text-lg font-bold text-slate-400">
                            ₹{((config?.loyalty_min_monthly_purchase ?? 200000) - simMonthlySpend).toLocaleString()} more spend needed / mo
                          </p>
                          <span className="text-[9px] text-slate-500 font-semibold block">
                            Requires ₹{(config?.loyalty_min_monthly_purchase ?? 200000).toLocaleString()} / month for {config?.loyalty_consecutive_months ?? 3} consecutive months to unlock +{(config?.loyalty_bonus ?? 10000).toLocaleString()} pts.
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Default Fallback for other tabs */}
                {activeTab === 3 && (
                  <div className="space-y-3 text-xs text-center py-4">
                    <HelpCircle className="w-8 h-8 text-slate-600 mx-auto" />
                    <p className="text-slate-400 leading-normal">
                      Configure standard tier-wide payouts and default tag adjustments on the settings panel to the right.
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Right Form panel containing active tab inputs */}
            <div className="lg:col-span-8 space-y-6">
              
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                
                {/* Active Group Header Banner */}
                <div className="px-6 py-5 border-b border-slate-100 bg-slate-50/50">
                  <h3 className="font-black text-slate-900 text-base">{CONFIG_GROUPS[activeTab].title}</h3>
                  <p className="text-xs text-slate-500 mt-1 font-semibold leading-relaxed">{CONFIG_GROUPS[activeTab].desc}</p>
                </div>

                {/* Input Fields */}
                <div className="p-6 space-y-6">
                  {CONFIG_GROUPS[activeTab].fields.map((field) => {
                    const Icon = field.icon;
                    return (
                      <div key={field.key} className="space-y-2 border-b border-slate-50 pb-5 last:border-0 last:pb-0">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
                              <Icon className="w-4 h-4 text-blue-600" />
                            </div>
                            <label className="text-xs font-bold text-slate-800">{field.label}</label>
                          </div>
                        </div>

                        <div className="max-w-md">
                          {renderInput(field)}
                        </div>

                        <p className="text-xs text-slate-400 font-medium leading-relaxed max-w-2xl">{field.description}</p>

                        {/* Portals badge labels */}
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {field.usedIn.map((portal) => (
                            <span
                              key={portal}
                              className={`text-[9px] font-bold px-2 py-0.5 rounded-full border ${PORTAL_COLORS[portal] || 'bg-slate-100 text-slate-600 border-slate-200'}`}
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

              {/* Bottom Sticky Action Banner */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm px-6 py-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-start gap-2.5 text-xs text-slate-500 font-medium leading-relaxed">
                  <Info className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                  <span>
                    Saving creates **Version {config ? config.version + 1 : '–'}**. This instantly locks calculations for all incoming invoices.
                  </span>
                </div>
                <button
                  type="submit"
                  disabled={saving}
                  className="bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-bold py-2.5 px-6 rounded-xl text-xs transition-colors flex items-center gap-2 shadow-sm shrink-0 self-stretch sm:self-auto text-center justify-center"
                >
                  <Save className="w-4 h-4" />
                  {saving ? 'Saving Rules…' : 'Save & Activate Rules'}
                </button>
              </div>

            </div>

          </div>

        </form>
      )}

    </div>
  );
}
