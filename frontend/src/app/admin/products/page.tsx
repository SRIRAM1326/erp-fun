'use client';

import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import {
  Tag, Plus, Edit2, Trash2, RefreshCw, X, Info,
  PackageCheck, Zap, Archive, Star, Box, TrendingUp, ShoppingCart
} from 'lucide-react';

const TAG_OPTIONS = [
  { value: 'normal',        label: 'Normal',        desc: 'No bonus points',                       color: 'text-slate-600',   bg: 'bg-slate-100 border-slate-200',   icon: Box },
  { value: 'special',       label: 'Special',       desc: 'Fixed bonus on every invoice',          color: 'text-blue-700',    bg: 'bg-blue-50 border-blue-200',      icon: Star },
  { value: 'old_stock',     label: 'Old Stock',     desc: 'Higher bonus to move aging inventory',  color: 'text-amber-700',   bg: 'bg-amber-50 border-amber-200',    icon: Archive },
  { value: 'double_points', label: 'Double Points', desc: '2× multiplier on base buyer points',    color: 'text-purple-700',  bg: 'bg-purple-50 border-purple-200',  icon: Zap },
];

const getTag = (val: string) => TAG_OPTIONS.find((t) => t.value === val) || TAG_OPTIONS[0];

const EMPTY_FORM = { name: '', tag: 'special', bonus_points: 300 };

export default function AdminProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any | null>(null);
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [formError, setFormError] = useState('');
  const [formLoading, setFormLoading] = useState(false);
  const [filterTag, setFilterTag] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 24;

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await api.get('/admin/products');
      setProducts(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProducts(); }, []);

  const openCreate = () => {
    setEditingProduct(null);
    setFormData(EMPTY_FORM);
    setFormError('');
    setShowModal(true);
  };

  const openEdit = (p: any) => {
    setEditingProduct(p);
    setFormData({ name: p.name, tag: p.tag, bonus_points: p.bonus_points });
    setFormError('');
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);
    setFormError('');
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

  // Filter products by tag and search term
  const filtered = products.filter((p) => {
    const matchesTag = filterTag ? p.tag === filterTag : true;
    const matchesSearch = searchTerm ? p.name.toLowerCase().includes(searchTerm.toLowerCase()) : true;
    return matchesTag && matchesSearch;
  });

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paginatedProducts = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  // Summary counts
  const taggedCount = products.filter((p) => p.tag !== 'normal').length;
  const totalInvoicesThisMonth = products.reduce((s, p) => s + (p.invoices_this_month || 0), 0);
  const specialCount = products.filter((p) => p.tag === 'special').length;
  const oldStockCount = products.filter((p) => p.tag === 'old_stock').length;

  const selectedTagOption = formData.tag !== 'normal' && formData.tag !== 'double_points';

  return (
    <div className="space-y-6 max-w-7xl mx-auto">

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Product Tagging</h1>
          <p className="text-sm text-slate-500 mt-1">
            Assign bonus reward points to individual products. Tagged products automatically apply bonuses on every qualifying invoice.
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
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Tagged Products', value: taggedCount, icon: Tag, color: 'text-blue-700', bg: 'bg-blue-50' },
          { label: 'Invoices This Month', value: totalInvoicesThisMonth, icon: ShoppingCart, color: 'text-emerald-700', bg: 'bg-emerald-50', sub: 'containing tagged products' },
          { label: 'Special Promotions', value: specialCount, icon: Star, color: 'text-blue-700', bg: 'bg-blue-50' },
          { label: 'Old Stock Promotions', value: oldStockCount, icon: Archive, color: 'text-amber-700', bg: 'bg-amber-50' },
        ].map((card) => {
          const Icon = card.icon;
          return (
            <div key={card.label} className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
              <div className={`w-8 h-8 rounded-lg ${card.bg} flex items-center justify-center mb-3`}>
                <Icon className={`w-4 h-4 ${card.color}`} />
              </div>
              <p className="text-xl font-bold text-slate-900">{card.value}</p>
              <p className="text-xs text-slate-500 font-medium mt-0.5">{card.label}</p>
              {card.sub && <p className="text-[10px] text-slate-400 mt-0.5">{card.sub}</p>}
            </div>
          );
        })}
      </div>

      {/* Info callout */}
      <div className="bg-indigo-50 border border-indigo-200 rounded-xl px-5 py-3.5 flex items-start gap-3">
        <Info className="w-4 h-4 text-indigo-600 mt-0.5 shrink-0" />
        <p className="text-xs text-indigo-800 font-medium leading-relaxed">
          If multiple tagged products appear on the same invoice, all applicable bonus points are <strong>added together</strong>.
          For example, a customer may receive <strong>+300 pts</strong> for a Special product and <strong>+500 pts</strong> for an Old Stock product on the same invoice.
        </p>
      </div>

      {/* Search and Filters Bar */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-stretch md:items-center">
        {/* Tag filter tabs */}
        <div className="flex gap-2 flex-wrap">
          {[{ value: '', label: 'All Tags' }, ...TAG_OPTIONS].map((opt) => (
            <button
              key={opt.value}
              onClick={() => {
                setFilterTag(opt.value);
                setCurrentPage(1);
              }}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors ${filterTag === opt.value
                ? 'bg-blue-600 text-white border-blue-600'
                : 'bg-white text-slate-600 border-slate-200 hover:border-blue-300'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative md:w-80">
          <input
            type="text"
            placeholder="Search products by name..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full px-4 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
          />
        </div>
      </div>

      {/* Product Grid */}
      {loading ? (
        <div className="bg-white rounded-xl border border-slate-200 p-12 text-center text-slate-500 shadow-sm">
          <RefreshCw className="w-6 h-6 animate-spin text-blue-500 mx-auto mb-2" />
          Loading products…
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 p-12 text-center shadow-sm">
          <Tag className="w-10 h-10 text-slate-300 mx-auto mb-3" />
          <p className="text-slate-500 font-medium">No products found.</p>
          <p className="text-sm text-slate-400 mt-1">Try modifying your search or filter settings.</p>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {paginatedProducts.map((product) => {
              const tag = getTag(product.tag);
              const TagIcon = tag.icon;
              const isBonus = product.tag !== 'normal';
              return (
                <div
                  key={product.id}
                  className={`bg-white rounded-xl border shadow-sm p-5 flex flex-col gap-3 transition-all hover:shadow-md hover:-translate-y-0.5 ${isBonus ? 'border-l-4 ' + (
                    product.tag === 'special'       ? 'border-l-blue-500' :
                    product.tag === 'old_stock'     ? 'border-l-amber-500' :
                    product.tag === 'double_points' ? 'border-l-purple-500' : 'border-l-slate-200'
                  ) : 'border-slate-200'}`}
                >
                  {/* Product header */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <div className={`w-9 h-9 rounded-lg flex items-center justify-center border ${tag.bg}`}>
                        <TagIcon className={`w-4 h-4 ${tag.color}`} />
                      </div>
                      <div>
                        <p className="font-bold text-slate-900 text-sm leading-tight">{product.name}</p>
                        <span className={`inline-block mt-0.5 text-[10px] font-bold px-2 py-0.5 rounded-full border ${tag.bg} ${tag.color}`}>
                          {tag.label}
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-1 shrink-0">
                      <button
                        onClick={() => openEdit(product)}
                        className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Edit"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(product)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                        title="Remove"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Tag description */}
                  <p className="text-[11px] text-slate-500 leading-relaxed">{tag.desc}</p>

                  {/* Stats row */}
                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100">
                    <div className="text-center">
                      {product.tag === 'double_points' ? (
                        <>
                          <p className="text-base font-black text-purple-700">2×</p>
                          <p className="text-[10px] text-slate-400 font-medium">Multiplier</p>
                        </>
                      ) : (
                        <>
                          <p className={`text-base font-black ${isBonus ? 'text-blue-700' : 'text-slate-400'}`}>
                            {isBonus ? `+${product.bonus_points}` : '—'}
                          </p>
                          <p className="text-[10px] text-slate-400 font-medium">Bonus Pts</p>
                        </>
                      )}
                    </div>
                    <div className="text-center border-l border-slate-100">
                      <p className="text-base font-black text-slate-900">{product.invoices_this_month ?? 0}</p>
                      <p className="text-[10px] text-slate-400 font-medium">Invoices This Month</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between border-t border-slate-200 pt-6">
              <p className="text-xs font-semibold text-slate-500">
                Showing <strong className="text-slate-900">{((currentPage - 1) * itemsPerPage) + 1}</strong> to{" "}
                <strong className="text-slate-900">
                  {Math.min(currentPage * itemsPerPage, filtered.length)}
                </strong>{" "}
                of <strong className="text-slate-900">{filtered.length}</strong> products
              </p>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-55 disabled:cursor-not-allowed transition-all shadow-sm"
                >
                  Previous
                </button>
                <span className="text-xs font-semibold text-slate-500 self-center">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  type="button"
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-55 disabled:cursor-not-allowed transition-all shadow-sm"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Add / Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg">
            <div className="flex items-center justify-between p-6 border-b border-slate-100">
              <div>
                <h2 className="text-lg font-bold text-slate-900">{editingProduct ? 'Edit Product Tag' : 'Tag a Product'}</h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  {editingProduct ? 'Update the bonus configuration for this product.' : 'Assign a bonus tag to a product name. Applies to all future invoices containing it.'}
                </p>
              </div>
              <button onClick={() => setShowModal(false)} className="p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-5">
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
                  placeholder="e.g. Product A, Premium Wheat Flour"
                  className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-slate-50 disabled:text-slate-500"
                />
                {editingProduct && <p className="text-[10px] text-slate-400 mt-1">Product name cannot be changed. Create a new entry if needed.</p>}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-2">Tag Type *</label>
                <div className="grid grid-cols-2 gap-2">
                  {TAG_OPTIONS.filter((t) => t.value !== 'normal').map((opt) => {
                    const Icon = opt.icon;
                    const isSelected = formData.tag === opt.value;
                    return (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => setFormData({ ...formData, tag: opt.value })}
                        className={`flex items-start gap-2.5 p-3 rounded-xl border-2 text-left transition-all ${
                          isSelected ? 'border-blue-500 bg-blue-50' : 'border-slate-200 hover:border-blue-200 bg-white'
                        }`}
                      >
                        <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${opt.bg}`}>
                          <Icon className={`w-3.5 h-3.5 ${opt.color}`} />
                        </div>
                        <div>
                          <p className={`text-xs font-bold ${isSelected ? 'text-blue-700' : 'text-slate-900'}`}>{opt.label}</p>
                          <p className="text-[10px] text-slate-500 leading-tight mt-0.5">{opt.desc}</p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {formData.tag !== 'double_points' && (
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">Bonus Points *</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">+</span>
                    <input
                      type="number"
                      required
                      min={1}
                      value={formData.bonus_points}
                      onChange={(e) => setFormData({ ...formData, bonus_points: parseInt(e.target.value) || 0 })}
                      className="w-full pl-7 pr-16 py-2.5 border border-slate-200 rounded-lg text-sm font-mono font-bold focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs font-semibold">pts</span>
                  </div>
                  <p className="text-[10px] text-slate-400 mt-1">Added flat to buyer's total on every invoice containing this product.</p>
                </div>
              )}

              {formData.tag === 'double_points' && (
                <div className="bg-purple-50 border border-purple-200 rounded-lg px-4 py-3 text-xs text-purple-800 font-medium">
                  <strong>Double Points</strong> applies a 2× multiplier to the buyer's entire base points calculation for that invoice. No separate bonus_points value is needed.
                </div>
              )}

              <div className="flex gap-3 pt-1">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold py-2.5 rounded-lg text-sm transition-colors">
                  Cancel
                </button>
                <button type="submit" disabled={formLoading} className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-semibold py-2.5 rounded-lg text-sm transition-colors">
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
