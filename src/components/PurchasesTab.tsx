import React, { useState, useMemo } from 'react';
import { 
  Plus, 
  Search, 
  Package, 
  Store, 
  Calendar, 
  Tag, 
  Trash2, 
  Edit3, 
  AlertCircle,
  FileText,
  Filter,
  ArrowUpDown,
  Coins
} from 'lucide-react';
import { PurchaseItem } from '../types';
import { formatTaka, formatPieces, formatBengaliDate } from '../utils/formatters';

interface PurchasesTabProps {
  purchases: PurchaseItem[];
  selectedShopFilter: string | null;
  onClearShopFilter: () => void;
  onSelectShopFilter: (shop: string | null) => void;
  useBengaliDigits: boolean;
  onAddPurchase: () => void;
  onEditPurchase: (purchase: PurchaseItem) => void;
  onDeletePurchase: (id: string) => void;
}

export const PurchasesTab: React.FC<PurchasesTabProps> = ({
  purchases,
  selectedShopFilter,
  onClearShopFilter,
  onSelectShopFilter,
  useBengaliDigits,
  onAddPurchase,
  onEditPurchase,
  onDeletePurchase,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'date' | 'total' | 'quantity' | 'shop'>('date');
  const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc');
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Distinct shop names for filter chips
  const distinctShops = useMemo(() => {
    const set = new Set<string>();
    purchases.forEach((p) => {
      if (p.shopName) set.add(p.shopName.trim());
    });
    return Array.from(set);
  }, [purchases]);

  // Filtered & sorted purchases
  const filteredPurchases = useMemo(() => {
    return purchases
      .filter((item) => {
        // Shop filter
        if (selectedShopFilter && item.shopName.trim() !== selectedShopFilter.trim()) {
          return false;
        }

        const query = searchTerm.toLowerCase().trim();
        if (!query) return true;
        return (
          item.shopName.toLowerCase().includes(query) ||
          item.productName.toLowerCase().includes(query) ||
          (item.notes && item.notes.toLowerCase().includes(query)) ||
          item.date.includes(query)
        );
      })
      .sort((a, b) => {
        let valA: any = a.date;
        let valB: any = b.date;
        if (sortBy === 'total') {
          valA = a.totalPrice;
          valB = b.totalPrice;
        } else if (sortBy === 'quantity') {
          valA = a.quantity;
          valB = b.quantity;
        } else if (sortBy === 'shop') {
          valA = a.shopName;
          valB = b.shopName;
        }
        if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
        if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
        return 0;
      });
  }, [purchases, selectedShopFilter, searchTerm, sortBy, sortOrder]);

  const totalFilteredPieces = filteredPurchases.reduce((acc, p) => acc + (p.quantity || 0), 0);
  const totalFilteredCost = filteredPurchases.reduce((acc, p) => acc + (p.totalPrice || 0), 0);

  return (
    <div className="space-y-4 pb-28">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-800 flex items-center justify-center">
                <Package className="w-4 h-4" />
              </div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900">
                কেনাকাটা ও চালান খাতা (Purchase Tracker)
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              মোট {formatPieces(purchases.length, useBengaliDigits)} চালান তালিকাভুক্ত রয়েছে
            </p>
          </div>

          {/* Quick Metrics */}
          <div className="flex items-center gap-2 self-start sm:self-auto bg-slate-50 p-2 rounded-xl text-xs">
            <div>
              <span className="text-[10px] text-slate-500 block">মোট ক্রয়মূল্য</span>
              <span className="font-bold text-[#1B365D] tabular-nums">
                {formatTaka(totalFilteredCost, useBengaliDigits)}
              </span>
            </div>
            <span className="text-slate-300">|</span>
            <div>
              <span className="text-[10px] text-slate-500 block">মোট কেনা পিস</span>
              <span className="font-bold text-indigo-700 tabular-nums">
                {formatPieces(totalFilteredPieces, useBengaliDigits)}
              </span>
            </div>
          </div>
        </div>

        {/* Search & Sort Controls */}
        <div className="mt-4 pt-3 border-t border-slate-100 flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="দোকান বা পণ্যের নাম দিয়ে খুঁজুন..."
              className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 focus:border-[#1B365D] focus:ring-1 focus:ring-[#1B365D] text-xs outline-none bg-slate-50/50"
            />
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-slate-500 shrink-0 text-[11px]">সর্ট:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-2.5 py-2 rounded-xl border border-slate-200 bg-white text-xs text-slate-700 outline-none cursor-pointer"
            >
              <option value="date">তারিখ অনুয়ায়ী</option>
              <option value="total">সর্বোচ্চ খরচ</option>
              <option value="quantity">পিস অনুযায়ী</option>
              <option value="shop">দোকানের নাম</option>
            </select>
            <button
              onClick={() => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')}
              title="অর্ডার পরিবর্তন"
              className="p-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 cursor-pointer"
            >
              <ArrowUpDown className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Shop Filter Chips */}
        <div className="mt-3 pt-2 flex items-center gap-1.5 overflow-x-auto pb-1 text-xs no-scrollbar">
          <button
            onClick={onClearShopFilter}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors cursor-pointer font-medium ${
              selectedShopFilter === null
                ? 'bg-[#1B365D] text-white shadow-xs'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
          >
            সকল দোকান ({purchases.length})
          </button>
          {distinctShops.map((shop) => {
            const isSelected = selectedShopFilter === shop;
            return (
              <button
                key={shop}
                onClick={() => onSelectShopFilter(isSelected ? null : shop)}
                className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors cursor-pointer font-medium ${
                  isSelected
                    ? 'bg-[#1B365D] text-white shadow-xs'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                {shop}
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Filter Indicator */}
      {selectedShopFilter && (
        <div className="flex items-center justify-between px-3 py-2 bg-indigo-50/70 border border-indigo-200 rounded-xl text-xs text-indigo-900">
          <span>
            ফিল্টার করা দোকান: <strong>{selectedShopFilter}</strong>
          </span>
          <button
            onClick={onClearShopFilter}
            className="text-indigo-700 hover:underline font-medium cursor-pointer"
          >
            ফিল্টার সরান
          </button>
        </div>
      )}

      {/* Purchases List Cards */}
      {filteredPurchases.length === 0 ? (
        <div className="bg-white rounded-2xl p-8 border border-slate-200/80 text-center text-slate-500">
          <Package className="w-10 h-10 mx-auto text-slate-300 mb-2" />
          <h3 className="font-semibold text-slate-700 text-sm">কোনো চালানের তথ্য পাওয়া যায়নি</h3>
          <p className="text-xs text-slate-400 mt-1">সার্চ বা দোকান ফিল্টার পরিবর্তন করুন</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredPurchases.map((purchase) => {
            const hasLostMemo = purchase.notes && purchase.notes.includes('ক্যাশমেমো');
            const isDeleting = deleteConfirmId === purchase.id;

            return (
              <div
                key={purchase.id}
                className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs hover:border-slate-300 transition-all group"
              >
                <div className="flex items-start justify-between gap-3">
                  {/* Left: Shop and Product */}
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-800 flex items-center justify-center shrink-0 mt-0.5">
                      <Store className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm sm:text-base font-bold text-slate-900">
                          {purchase.shopName}
                        </h4>
                        {hasLostMemo && (
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200 font-medium flex items-center gap-1">
                            <AlertCircle className="w-3 h-3" />
                            ক্যাশমেমো সংরক্ষিত নেই
                          </span>
                        )}
                      </div>

                      <div className="flex flex-wrap items-center gap-2 text-xs text-slate-600 mt-1">
                        <span className="font-medium text-slate-700">
                          {purchase.productName}
                        </span>
                        <span>·</span>
                        <span className="flex items-center gap-1 text-slate-500">
                          <Calendar className="w-3 h-3 text-slate-400" />
                          {formatBengaliDate(purchase.date)}
                        </span>
                      </div>

                      {purchase.notes && !hasLostMemo && (
                        <div className="text-[11px] text-slate-500 mt-1 bg-slate-50 px-2 py-0.5 rounded inline-block">
                          নোট: {purchase.notes}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Right: Actions */}
                  <div className="flex items-center gap-1 opacity-90 sm:opacity-70 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => onEditPurchase(purchase)}
                      title="সম্পাদনা করুন"
                      className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors cursor-pointer"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setDeleteConfirmId(purchase.id)}
                      title="মুছে ফেলুন"
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Calculation Details Strip */}
                <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs bg-slate-50/70 p-2.5 rounded-xl">
                  {/* Pieces and Unit Price */}
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-slate-800">
                      {formatPieces(purchase.quantity, useBengaliDigits)}
                    </span>
                    <span className="text-slate-400">×</span>
                    <span className="text-slate-600">
                      দর {formatTaka(purchase.unitPrice, useBengaliDigits)}
                    </span>
                  </div>

                  {/* Total Price */}
                  <div className="text-right">
                    <span className="text-[10px] text-slate-500 block">মোট ক্রয়</span>
                    <span className="font-bold text-sm text-[#1B365D] tabular-nums">
                      {formatTaka(purchase.totalPrice, useBengaliDigits)}
                    </span>
                  </div>
                </div>

                {/* Inline Delete Confirmation */}
                {isDeleting && (
                  <div className="mt-3 p-3 rounded-xl bg-rose-50 border border-rose-200 flex items-center justify-between text-xs text-rose-800 animate-in fade-in">
                    <span>আপনি কি নিশ্চিতভাবে এই চালানটি মুছে ফেলতে চান?</span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setDeleteConfirmId(null)}
                        className="px-2.5 py-1 rounded-lg bg-white text-slate-700 border border-slate-300 font-medium hover:bg-slate-100 cursor-pointer"
                      >
                        না
                      </button>
                      <button
                        onClick={() => {
                          onDeletePurchase(purchase.id);
                          setDeleteConfirmId(null);
                        }}
                        className="px-2.5 py-1 rounded-lg bg-rose-600 text-white font-medium hover:bg-rose-700 cursor-pointer"
                      >
                        হ্যাঁ, মুছুন
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Floating Action Button (FAB) for adding new purchase */}
      <div className="fixed bottom-20 right-4 sm:right-6 z-40">
        <button
          onClick={onAddPurchase}
          className="flex items-center gap-2 px-4 py-3 rounded-full bg-[#1B365D] hover:bg-[#142845] text-white font-bold text-xs sm:text-sm shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-0.5 active:scale-95 cursor-pointer border border-blue-400/30"
        >
          <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center">
            <Plus className="w-4 h-4 stroke-[3]" />
          </div>
          <span>নতুন কেনাকাটা যোগ করুন</span>
        </button>
      </div>
    </div>
  );
};
