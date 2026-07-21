'use client';

import { useState, useEffect, useMemo } from 'react';
import { api } from '@/lib/api';
import {
  Tag, Plus, Edit2, Trash2, RefreshCw, X, Info,
  PackageCheck, Zap, Archive, Star, Box, TrendingUp,
  ShoppingCart, LayoutGrid, List, BarChart3, Award,
  ChevronDown, ChevronRight, Search, Users, Check
} from 'lucide-react';

const EMPTY_FORM = {
  name: '',
  tag: 'Special',
  tag_description: 'Fixed bonus on every invoice',
  bonus_points: 300,
  recipient_customer: true,
  recipient_rep: false,
  category: '',
  brand: ''
};

type ViewMode = 'sales' | 'brandwise' | 'categorywise' | 'productwise';

const VIEW_TABS: { id: ViewMode; label: string; icon: any }[] = [
  { id: 'categorywise', label: 'Categorywise', icon: LayoutGrid  },
  { id: 'brandwise',    label: 'Brandwise',    icon: Award       },
  { id: 'productwise',  label: 'Productwise',  icon: List        },
  { id: 'sales',        label: 'Sales Report', icon: TrendingUp  },
];

export default function AdminProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [tagTypes, setTagTypes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any | null>(null);
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [formError, setFormError] = useState('');
  const [formLoading, setFormLoading] = useState(false);
  const [filterTag, setFilterTag] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState<ViewMode>('categorywise');
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());
  const itemsPerPage = 24;

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const [resProd, resTags] = await Promise.all([
        api.get('/admin/products'),
        api.get('/admin/tag-types')
      ]);
      setProducts(resProd.data);
      setTagTypes(resTags.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProducts(); }, []);

  // Reset page on view change
  useEffect(() => { setCurrentPage(1); }, [viewMode, searchTerm, filterTag]);

  const openCreate = () => {
    setEditingProduct(null);
    setFormData(EMPTY_FORM);
    setFormError('');
    setShowModal(true);
  };

  const openEdit = (p: any) => {
    setEditingProduct(p);
    setFormData({
      name: p.name,
      tag: p.tag || 'Special',
      tag_description: p.tag_description || '',
      bonus_points: p.bonus_points ?? 300,
      recipient_customer: p.recipient_customer ?? true,
      recipient_rep: p.recipient_rep ?? false,
      category: p.category || '',
      brand: p.brand || ''
    });
    setFormError('');
    setShowModal(true);
  };

  const selectTagPreset = (tt: any) => {
    setFormData((prev) => ({
      ...prev,
      tag: tt.title,
      tag_description: tt.description || '',
      bonus_points: tt.points ?? 0,
      recipient_customer: tt.recipient_customer ?? true,
      recipient_rep: tt.recipient_rep ?? false
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);
    setFormError('');

    if (!formData.recipient_customer && !formData.recipient_rep && formData.tag.toLowerCase() !== 'normal') {
      setFormError('Please select at least one Point Recipient (Customer or Sales Partner).');
      setFormLoading(false);
      return;
    }

    try {
      await api.post('/admin/products', formData);
      setShowModal(false);
      fetchProducts();
    } catch (err: any) {
      setFormError(err?.response?.data?.message || 'Something went wrong');
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async (p: any) => {
    if (!confirm(`Remove product tag for "${p.name}"?`)) return;
    try {
      await api.delete(`/admin/products/${p.id}`);
      fetchProducts();
    } catch (err) { console.error(err); }
  };

  const toggleGroup = (key: string) => {
    setExpandedGroups(prev => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  // Base filtered list
  const filtered = useMemo(() => products.filter((p) => {
    const matchesTag = filterTag ? (p.tag || '').toLowerCase() === filterTag.toLowerCase() : true;
    const matchesSearch = searchTerm
      ? p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (p.category || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (p.tag || '').toLowerCase().includes(searchTerm.toLowerCase())
      : true;
    return matchesTag && matchesSearch;
  }), [products, filterTag, searchTerm]);

  // Grouped by brand
  const groupedByBrand = useMemo(() => {
    const map: Record<string, any[]> = {};
    filtered.forEach(p => {
      const key = p.brand || 'Other';
      if (!map[key]) map[key] = [];
      map[key].push(p);
    });
    return Object.entries(map).sort((a, b) => b[1].length - a[1].length);
  }, [filtered]);

  // Grouped by category
  const groupedByCategory = useMemo(() => {
    const map: Record<string, any[]> = {};
    filtered.forEach(p => {
      const cat = p.category || 'Uncategorized';
      if (!map[cat]) map[cat] = [];
      map[cat].push(p);
    });
    return Object.entries(map).sort((a, b) => a[0].localeCompare(b[0]));
  }, [filtered]);

  // Sorted by sales
  const sortedBySales = useMemo(() =>
    [...filtered].sort((a, b) => (b.invoices_this_month ?? 0) - (a.invoices_this_month ?? 0)),
    [filtered]
  );

  // Summary counts
  const taggedCount = products.filter((p) => (p.tag || '').toLowerCase() !== 'normal').length;
  const brandCount = new Set(products.map(p => p.brand).filter(Boolean)).size;
  const categoryCount = new Set(products.map(p => p.category).filter(Boolean)).size;

  // Pagination for flat views
  const totalPages = Math.ceil(
    (viewMode === 'productwise' ? filtered : sortedBySales).length / itemsPerPage
  );
  const paginatedFlat = (viewMode === 'productwise' ? filtered : sortedBySales)
    .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const tagBadge = (product: any) => {
    const isNormal = !product.tag || product.tag.toLowerCase() === 'normal';
    if (isNormal) {
      return (
        <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full border bg-slate-100 border-slate-200 text-slate-500">
          <span className="w-1.5 h-1.5 rounded-full bg-slate-400" /> Normal
        </span>
      );
    }

    const recCust = product.recipient_customer ?? true;
    const recRep = product.recipient_rep ?? false;

    let recBadge = 'Customer';
    let recBg = 'bg-blue-50 text-blue-700 border-blue-200';
    if (recCust && recRep) {
      recBadge = 'Cust & Partner';
      recBg = 'bg-emerald-50 text-emerald-700 border-emerald-200';
    } else if (recRep) {
      recBadge = 'Sales Partner';
      recBg = 'bg-purple-50 text-purple-700 border-purple-200';
    }

    return (
      <div className="flex flex-wrap items-center gap-1.5">
        <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full border bg-blue-50 border-blue-200 text-blue-800">
          <Tag className="w-2.5 h-2.5 text-blue-600" />
          {product.tag}
        </span>
        <span className={`inline-flex items-center text-[9px] font-bold px-1.5 py-0.5 rounded-full border ${recBg}`}>
          {recBadge}
        </span>
      </div>
    );
  };

  const renderProductCard = (product: any) => {
    const isNormal = !product.tag || product.tag.toLowerCase() === 'normal';
    const isDouble = (product.tag || '').toLowerCase() === 'double_points';

    return (
      <div key={product.id} className={`bg-white rounded-xl border shadow-sm p-4 flex flex-col gap-3 transition-all hover:shadow-md hover:-translate-y-0.5 ${
        !isNormal ? 'border-l-4 border-l-blue-500' : 'border-slate-200'
      }`}>
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-start gap-2 min-w-0">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center border shrink-0 ${!isNormal ? 'bg-blue-50 border-blue-200 text-blue-600' : 'bg-slate-100 border-slate-200 text-slate-400'}`}>
              <Tag className="w-3.5 h-3.5" />
            </div>
            <div className="min-w-0">
              <p className="font-semibold text-slate-900 text-xs leading-tight line-clamp-2">{product.name}</p>
              <p className="text-[10px] text-slate-400 mt-0.5 truncate">
                {product.brand && <span>{product.brand}</span>}
                {product.brand && product.category && <span className="mx-1">·</span>}
                {product.category && <span>{product.category}</span>}
              </p>
              <div className="mt-1">{tagBadge(product)}</div>
            </div>
          </div>
          <div className="flex gap-1 shrink-0">
            <button onClick={() => openEdit(product)} className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Edit Tag">
              <Edit2 className="w-3 h-3" />
            </button>
            <button onClick={() => handleDelete(product)} className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors" title="Remove">
              <Trash2 className="w-3 h-3" />
            </button>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100">
          <div className="text-center">
            {isDouble ? (
              <>
                <p className="text-sm font-black text-purple-700">2×</p>
                <p className="text-[10px] text-slate-400 font-medium">Multiplier</p>
              </>
            ) : (
              <>
                <p className={`text-sm font-black ${!isNormal ? 'text-blue-700' : 'text-slate-300'}`}>
                  {!isNormal ? `+${product.bonus_points}` : '—'}
                </p>
                <p className="text-[10px] text-slate-400 font-medium">Bonus Pts</p>
              </>
            )}
          </div>
          <div className="text-center border-l border-slate-100">
            <p className="text-sm font-black text-slate-900">{product.invoices_this_month ?? 0}</p>
            <p className="text-[10px] text-slate-400 font-medium">Sales</p>
          </div>
        </div>
      </div>
    );
  };

  const renderGroupView = (groups: [string, any[]][], label: string) => (
    <div className="space-y-3">
      {groups.map(([groupName, groupProducts]) => {
        const isExpanded = expandedGroups.has(groupName);
        const taggedInGroup = groupProducts.filter(p => (p.tag || '').toLowerCase() !== 'normal').length;
        const salesInGroup = groupProducts.reduce((s, p) => s + (p.invoices_this_month || 0), 0);
        return (
          <div key={groupName} className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            {/* Group Header */}
            <button
              onClick={() => toggleGroup(groupName)}
              className="w-full flex items-center justify-between p-4 hover:bg-slate-50 transition-colors text-left"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-xs font-black shrink-0">
                  {groupName.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="font-bold text-slate-900 text-sm">{groupName}</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    {groupProducts.length} products · {taggedInGroup} tagged · {salesInGroup} sales this month
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                {isExpanded
                  ? <ChevronDown className="w-4 h-4 text-slate-400" />
                  : <ChevronRight className="w-4 h-4 text-slate-400" />
                }
              </div>
            </button>
            {/* Products Grid */}
            {isExpanded && (
              <div className="border-t border-slate-100 p-4 bg-slate-50/50">
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                  {groupProducts.map(p => renderProductCard(p))}
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );

  const renderSalesView = () => {
    const topSellers = sortedBySales.filter(p => p.invoices_this_month > 0);
    const noSales = sortedBySales.filter(p => !p.invoices_this_month);
    return (
      <div className="space-y-6">
        {topSellers.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp className="w-4 h-4 text-emerald-600" />
              <h3 className="text-sm font-bold text-slate-700">Active Products (This Month)</h3>
              <span className="text-xs text-slate-400 font-medium">— {topSellers.length} products with sales</span>
            </div>
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50">
                    <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Rank</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Product</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider hidden sm:table-cell">Brand</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Tag</th>
                    <th className="text-right px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Sales</th>
                    <th className="text-right px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {topSellers.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map((p, i) => (
                    <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-4 py-3">
                        <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-black ${
                          i === 0 ? 'bg-amber-400 text-white' :
                          i === 1 ? 'bg-slate-300 text-white' :
                          i === 2 ? 'bg-orange-400 text-white' :
                          'bg-slate-100 text-slate-500'
                        }`}>
                          {(currentPage - 1) * itemsPerPage + i + 1}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <p className="text-sm font-semibold text-slate-900 line-clamp-1">{p.name}</p>
                      </td>
                      <td className="px-4 py-3 hidden sm:table-cell">
                        <span className="text-xs text-slate-500">{p.brand || '—'}</span>
                      </td>
                      <td className="px-4 py-3">{tagBadge(p)}</td>
                      <td className="px-4 py-3 text-right">
                        <span className="text-sm font-black text-emerald-700">{p.invoices_this_month}</span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <button onClick={() => openEdit(p)} className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors inline-flex">
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
        {noSales.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Box className="w-4 h-4 text-slate-400" />
              <h3 className="text-sm font-bold text-slate-400">No Sales This Month</h3>
              <span className="text-xs text-slate-400 font-medium">— {noSales.length} products</span>
            </div>
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50">
                    <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Product</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider hidden sm:table-cell">Brand</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Tag</th>
                    <th className="text-right px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {noSales.slice(0, 50).map((p) => (
                    <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-4 py-3">
                        <p className="text-xs font-medium text-slate-600 line-clamp-1">{p.name}</p>
                      </td>
                      <td className="px-4 py-3 hidden sm:table-cell">
                        <span className="text-xs text-slate-400">{p.brand || '—'}</span>
                      </td>
                      <td className="px-4 py-3">{tagBadge(p)}</td>
                      <td className="px-4 py-3 text-right">
                        <button onClick={() => openEdit(p)} className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors inline-flex">
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {noSales.length > 50 && (
                <div className="px-4 py-3 border-t border-slate-100 bg-slate-50 text-center">
                  <p className="text-xs text-slate-400">Showing 50 of {noSales.length} products with no sales</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Product Tagging</h1>
          <p className="text-sm text-slate-500 mt-1">
            Assign custom bonus reward points and recipient distribution rules to products.
          </p>
        </div>
        <div className="flex gap-2">
          <button onClick={fetchProducts} className="bg-white border border-slate-200 text-slate-700 px-3 py-2 rounded-lg text-sm font-medium hover:bg-slate-50 flex items-center gap-2 shadow-sm">
            <RefreshCw className="w-4 h-4" /> Refresh
          </button>
          <button onClick={openCreate} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 shadow-sm transition-colors">
            <Plus className="w-4 h-4" /> Tag Product
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: 'Total Products', value: products.length, icon: Box, color: 'text-slate-700', bg: 'bg-slate-100' },
          { label: 'Brands / Categories', value: `${brandCount} / ${categoryCount}`, icon: Award, color: 'text-indigo-700', bg: 'bg-indigo-50' },
          { label: 'Tagged Products', value: taggedCount, icon: Star, color: 'text-amber-700', bg: 'bg-amber-50' },
        ].map((card) => {
          const Icon = card.icon;
          return (
            <div key={card.label} className="bg-white rounded-xl border border-slate-200 p-3 shadow-sm flex items-center gap-3">
              <div className={`w-8 h-8 rounded-lg ${card.bg} flex items-center justify-center shrink-0`}>
                <Icon className={`w-4 h-4 ${card.color}`} />
              </div>
              <div>
                <p className="text-lg font-bold text-slate-900 leading-none">{card.value}</p>
                <p className="text-[11px] text-slate-500 font-medium mt-1 leading-none">{card.label}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* View Tabs + Filters Bar */}
      <div className="flex flex-col gap-3">
        {/* View Mode Tabs */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl w-fit">
          {VIEW_TABS.map(tab => {
            const Icon = tab.icon;
            const isActive = viewMode === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setViewMode(tab.id)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                  isActive
                    ? 'bg-white text-blue-700 shadow-sm'
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Search Bar */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            <input
              type="text"
              placeholder="Search products, brands, or tags..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
          </div>
        </div>
      </div>

      {/* View Content */}
      {loading ? (
        <div className="bg-white rounded-xl border border-slate-200 p-12 text-center text-slate-500 shadow-sm">
          <RefreshCw className="w-6 h-6 animate-spin text-blue-500 mx-auto mb-2" />
          Loading products…
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 p-12 text-center shadow-sm">
          <Tag className="w-10 h-10 text-slate-300 mx-auto mb-3" />
          <p className="text-slate-500 font-medium">No products found.</p>
          <p className="text-sm text-slate-400 mt-1">Try modifying your search query.</p>
        </div>
      ) : (
        <>
          {/* SALES VIEW */}
          {viewMode === 'sales' && renderSalesView()}

          {/* BRANDWISE VIEW */}
          {viewMode === 'brandwise' && (
            <div className="space-y-2">
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs text-slate-500 font-medium">{groupedByBrand.length} brands · {filtered.length} products</p>
                <div className="flex gap-2">
                  <button
                    onClick={() => setExpandedGroups(new Set(groupedByBrand.map(([k]) => k)))}
                    className="text-xs text-blue-600 hover:underline font-medium"
                  >Expand All</button>
                  <span className="text-slate-300">|</span>
                  <button
                    onClick={() => setExpandedGroups(new Set())}
                    className="text-xs text-slate-500 hover:underline font-medium"
                  >Collapse All</button>
                </div>
              </div>
              {renderGroupView(groupedByBrand, "Brand")}
            </div>
          )}

          {/* CATEGORYWISE VIEW */}
          {viewMode === 'categorywise' && (
            <div className="space-y-2">
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs text-slate-500 font-medium">{groupedByCategory.length} categories · {filtered.length} products</p>
                <div className="flex gap-2">
                  <button
                    onClick={() => setExpandedGroups(new Set(groupedByCategory.map(([k]) => k)))}
                    className="text-xs text-blue-600 hover:underline font-medium"
                  >Expand All</button>
                  <span className="text-slate-300">|</span>
                  <button
                    onClick={() => setExpandedGroups(new Set())}
                    className="text-xs text-slate-500 hover:underline font-medium"
                  >Collapse All</button>
                </div>
              </div>
              {renderGroupView(groupedByCategory, "Category")}
            </div>
          )}

          {/* PRODUCTWISE VIEW */}
          {viewMode === 'productwise' && (
            <div className="space-y-4">
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {paginatedFlat.map((product) => (
                  renderProductCard(product)
                ))}
              </div>
              {totalPages > 1 && (
                <div className="flex items-center justify-between border-t border-slate-200 pt-6">
                  <p className="text-xs font-semibold text-slate-500">
                    Showing <strong className="text-slate-900">{((currentPage - 1) * itemsPerPage) + 1}</strong> to{" "}
                    <strong className="text-slate-900">{Math.min(currentPage * itemsPerPage, filtered.length)}</strong>{" "}
                    of <strong className="text-slate-900">{filtered.length}</strong> products
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50 transition-all shadow-sm"
                    >Previous</button>
                    <span className="text-xs font-semibold text-slate-500 self-center">Page {currentPage} of {totalPages}</span>
                    <button
                      onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages}
                      className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50 transition-all shadow-sm"
                    >Next</button>
                  </div>
                </div>
              )}
            </div>
          )}
        </>
      )}

      {/* Add / Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between p-6 border-b border-slate-100 shrink-0">
              <div>
                <h2 className="text-lg font-bold text-slate-900">{editingProduct ? 'Edit Product Tag' : 'Tag a Product'}</h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Configure custom tag type, points, and recipient distribution rules.
                </p>
              </div>
              <button onClick={() => setShowModal(false)} className="p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-5 overflow-y-auto custom-scrollbar flex-1">
              {formError && (
                <div className="bg-rose-50 border border-rose-200 text-rose-700 text-sm font-medium px-4 py-2.5 rounded-lg">{formError}</div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Product Name *</label>
                <input
                  type="text"
                  required
                  disabled={!!editingProduct}
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Havells 1200mm Fan"
                  className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-slate-50 disabled:text-slate-500"
                />
                {editingProduct && <p className="text-[10px] text-slate-400 mt-1">Product name cannot be changed after creation.</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">Brand</label>
                  <input
                    type="text"
                    value={formData.brand}
                    onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                    placeholder="e.g. HAVELLS"
                    className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">Category</label>
                  <input
                    type="text"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    placeholder="e.g. Appliances"
                    className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Tag Type Presets & Custom Selection */}
              <div className="space-y-3 pt-2 border-t border-slate-100">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold text-slate-800">Tag Type Configuration *</label>
                  <span className="text-[10px] text-blue-600 font-semibold">Select preset or type custom</span>
                </div>

                {/* Quick Presets Chips */}
                <div className="flex flex-wrap gap-1.5">
                  {tagTypes.map((tt) => {
                    const isSelected = formData.tag.toLowerCase() === tt.title.toLowerCase();
                    return (
                      <button
                        key={tt.id || tt.title}
                        type="button"
                        onClick={() => selectTagPreset(tt)}
                        className={`text-xs font-bold px-3 py-1.5 rounded-xl border transition-all flex items-center gap-1.5 ${
                          isSelected
                            ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                            : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                        }`}
                      >
                        {isSelected && <Check className="w-3 h-3 text-white" />}
                        <span>{tt.title}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Tag Title Input (Allows Typing Custom Tag) */}
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">Tag Title *</label>
                  <input
                    type="text"
                    required
                    value={formData.tag}
                    onChange={(e) => setFormData({ ...formData, tag: e.target.value })}
                    placeholder="e.g. Special, Old Stock, Festival Bonus..."
                    className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Tag Description */}
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">Description</label>
                  <input
                    type="text"
                    value={formData.tag_description}
                    onChange={(e) => setFormData({ ...formData, tag_description: e.target.value })}
                    placeholder="Brief description of the tag"
                    className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Tag Points */}
                {formData.tag.toLowerCase() !== 'double_points' && (
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">Reward Points *</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">+</span>
                      <input
                        type="number"
                        required
                        min={0}
                        value={formData.bonus_points}
                        onChange={(e) => setFormData({ ...formData, bonus_points: parseInt(e.target.value) || 0 })}
                        className="w-full pl-7 pr-16 py-2.5 border border-slate-200 rounded-xl text-sm font-mono font-bold focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs font-semibold">pts</span>
                    </div>
                  </div>
                )}

                {/* Point Recipient Checkboxes */}
                <div className="space-y-2 pt-2">
                  <label className="block text-[11px] font-bold text-slate-700">Point Recipient *</label>
                  <div className="grid grid-cols-2 gap-3">
                    <label className={`flex items-center gap-2.5 p-3 rounded-xl border cursor-pointer transition-all ${
                      formData.recipient_customer ? 'bg-blue-50/70 border-blue-300' : 'bg-slate-50 border-slate-200'
                    }`}>
                      <input
                        type="checkbox"
                        checked={formData.recipient_customer}
                        onChange={(e) => setFormData({ ...formData, recipient_customer: e.target.checked })}
                        className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
                      />
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-slate-900">Customer</p>
                        <p className="text-[10px] text-slate-500">Buyer receives points</p>
                      </div>
                    </label>

                    <label className={`flex items-center gap-2.5 p-3 rounded-xl border cursor-pointer transition-all ${
                      formData.recipient_rep ? 'bg-purple-50/70 border-purple-300' : 'bg-slate-50 border-slate-200'
                    }`}>
                      <input
                        type="checkbox"
                        checked={formData.recipient_rep}
                        onChange={(e) => setFormData({ ...formData, recipient_rep: e.target.checked })}
                        className="w-4 h-4 rounded text-purple-600 focus:ring-purple-500"
                      />
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-slate-900">Sales Partner</p>
                        <p className="text-[10px] text-slate-500">Rep receives points</p>
                      </div>
                    </label>
                  </div>
                </div>

                {/* Point Distribution Summary Rule */}
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs space-y-1 mt-2">
                  <p className="font-bold text-slate-600 uppercase tracking-wider text-[10px]">Point Distribution Rule</p>
                  {formData.recipient_customer && formData.recipient_rep ? (
                    <p className="text-emerald-700 font-semibold flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5 shrink-0" /> Both Customer and Sales Partner will receive points independently.
                    </p>
                  ) : formData.recipient_customer ? (
                    <p className="text-blue-700 font-semibold flex items-center gap-1.5">
                      <PackageCheck className="w-3.5 h-3.5 shrink-0" /> Reward points will be awarded ONLY to the Customer.
                    </p>
                  ) : formData.recipient_rep ? (
                    <p className="text-purple-700 font-semibold flex items-center gap-1.5">
                      <Award className="w-3.5 h-3.5 shrink-0" /> Reward points will be awarded ONLY to the Sales Partner.
                    </p>
                  ) : (
                    <p className="text-amber-700 font-semibold">
                      ⚠️ Neither Customer nor Sales Partner selected. No points will be awarded.
                    </p>
                  )}
                </div>

              </div>

              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold py-2.5 rounded-xl text-sm transition-colors">
                  Cancel
                </button>
                <button type="submit" disabled={formLoading} className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-semibold py-2.5 rounded-xl text-sm transition-colors shadow-sm">
                  {formLoading ? 'Saving…' : editingProduct ? 'Update Tag' : 'Save Product Tag'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
