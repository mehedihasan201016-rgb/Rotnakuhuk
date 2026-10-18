import React, { useState, useMemo } from 'react';
import { 
  Plus, 
  Search, 
  ShoppingBag, 
  TrendingUp, 
  TrendingDown, 
  Trash2, 
  Edit3, 
  Calendar, 
  Tag, 
  ArrowUpDown,
  Filter
} from 'lucide-react';
import { SaleItem } from '../types';
import { formatTaka, formatPieces, formatBengaliDate, toBengaliNumber } from '../utils/formatters';

interface SalesTabProps {
  sales: SaleItem[];
  useBengaliDigits: boolean;
  onAddSale: () => void;
  onEditSale: (sale: SaleItem) => void;
  onDeleteSale: (id: string) => void;
}

export const SalesTab: React.FC<SalesTabProps> = ({
  sales,
  useBengaliDigits,
  onAddSale,
  onEditSale,
  onDeleteSale,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'itemNumber' | 'profit' | 'price' | 'date'>('itemNumber');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Filtered & sorted sales
  const filteredSales = useMemo(() => {
    return sales
      .filter((item) => {
        const query = searchTerm.toLowerCase().trim();
        if (!query) return true;
        return (
          item.itemName.toLowerCase().includes(query) ||
          item.itemNumber.toString().includes(query) ||
          (item.notes && item.notes.toLowerCase().includes(query)) ||
          item.date.includes(query)
        );
      })
      .sort((a, b) => {
        let valA: string | number = a.itemNumber;
        let valB: string | number = b.itemNumber;
        if (sortBy === 'price') {
          valA = a.sellingPrice;
          valB = b.sellingPrice;
        } else if (sortBy === 'profit') {
          valA = a.profit;
          valB = b.profit;
        } else if (sortBy === 'date') {
          valA = a.date;
          valB = b.date;
        } else {
          valA = a.itemNumber;
          valB = b.itemNumber;
        }
        if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
        if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
        return 0;
      });
  }, [sales, searchTerm, sortBy, sortOrder]);

  // Aggregate totals for the filtered view
  const totalSelling = filteredSales.reduce((acc, s) => acc + (s.sellingPrice || 0), 0);
  const totalCost = filteredSales.reduce((acc, s) => acc + (s.costPrice || 0), 0);
  const totalProfit = filteredSales.reduce((acc, s) => acc + (s.profit || 0), 0);
  const totalLoss = filteredSales.reduce((acc, s) => acc + (s.loss || 0), 0);

  return (
    <div className="space-y-4 pb-28">
      {/* Sales Summary Banner */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-800 flex items-center justify-center">
                <ShoppingBag className="w-4 h-4" />
              </div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900">
                বিক্রির তালিকা ও রেজিস্টার (Sales Tracker)
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              মোট {formatPieces(sales.length, useBengaliDigits)} জামা বিক্রি রেকর্ড করা হয়েছে
            </p>
          </div>

          {/* Quick Metrics in Header */}
          <div className="flex items-center gap-2 self-start sm:self-auto bg-slate-50 p-2 rounded-xl text-xs">
            <div>
              <span className="text-[10px] text-slate-500 block">মোট বিক্রয়মূল্য</span>
              <span className="font-bold text-[#1B365D] tabular-nums">
                {formatTaka(totalSelling, useBengaliDigits)}
              </span>
            </div>
            <span className="text-slate-300">|</span>
            <div>
              <span className="text-[10px] text-slate-500 block">নীট লাভ</span>
              <span className="font-bold text-emerald-700 tabular-nums">
                {formatTaka(totalProfit - totalLoss, useBengaliDigits)}
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
              placeholder="জামার নাম বা ক্র.নং দিয়ে খুঁজুন..."
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
              <option value="itemNumber">ক্র.নং অনুয়ায়ী</option>
              <option value="profit">সর্বোচ্চ লাভ</option>
              <option value="price">বিক্রয়মূল্য</option>
              <option value="date">তারিখ</option>
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
      </div>

      {/* Sales Items List */}
      {filteredSales.length === 0 ? (
        <div className="bg-white rounded-2xl p-8 border border-slate-200/80 text-center text-slate-500">
          <ShoppingBag className="w-10 h-10 mx-auto text-slate-300 mb-2" />
          <h3 className="font-semibold text-slate-700 text-sm">কোনো বিক্রির তথ্য পাওয়া যায়নি</h3>
          <p className="text-xs text-slate-400 mt-1">সার্চ ফিল্টার পরিবর্তন করুন বা নতুন বিক্রি যোগ করুন</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredSales.map((sale) => {
            const isLoss = sale.loss > 0;
            const isDeleting = deleteConfirmId === sale.id;

            return (
              <div
                key={sale.id}
                className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs hover:border-slate-300 transition-all group"
              >
                <div className="flex items-start justify-between gap-3">
                  {/* Left: Serial & Item Info */}
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-xl bg-[#1B365D]/10 text-[#1B365D] font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                      {useBengaliDigits ? toBengaliNumber(sale.itemNumber) : sale.itemNumber}
                    </div>
                    <div>
                      <h4 className="text-sm sm:text-base font-bold text-slate-900 flex items-center gap-2">
                        <span>{sale.itemName}</span>
                      </h4>
                      <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 mt-0.5">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-slate-400" />
                          {formatBengaliDate(sale.date)}
                        </span>
                        {sale.notes && (
                          <>
                            <span>·</span>
                            <span className="text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded text-[11px]">
                              {sale.notes}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Right: Actions */}
                  <div className="flex items-center gap-1 opacity-90 sm:opacity-70 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => onEditSale(sale)}
                      title="সম্পাদনা করুন"
                      className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors cursor-pointer"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setDeleteConfirmId(sale.id)}
                      title="মুছে ফেলুন"
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Price Breakdown Strip */}
                <div className="mt-3 pt-3 border-t border-slate-100 grid grid-cols-4 gap-2 text-center text-xs">
                  {/* Cost Price */}
                  <div className="bg-slate-50 p-2 rounded-xl">
                    <span className="text-[10px] text-slate-500 block">ক্রয়মূল্য (৳)</span>
                    <span className="font-semibold text-slate-800 tabular-nums">
                      {formatTaka(sale.costPrice, useBengaliDigits)}
                    </span>
                  </div>

                  {/* Selling Price */}
                  <div className="bg-blue-50/60 p-2 rounded-xl">
                    <span className="text-[10px] text-blue-700 block">বিক্রয়মূল্য (৳)</span>
                    <span className="font-bold text-blue-900 tabular-nums">
                      {formatTaka(sale.sellingPrice, useBengaliDigits)}
                    </span>
                  </div>

                  {/* Profit */}
                  <div className={`p-2 rounded-xl ${sale.profit > 0 ? 'bg-emerald-50 text-emerald-800' : 'bg-slate-50 text-slate-400'}`}>
                    <span className="text-[10px] block font-medium">লাভ (৳)</span>
                    <span className="font-bold tabular-nums">
                      {sale.profit > 0 ? `+${formatTaka(sale.profit, useBengaliDigits)}` : '০'}
                    </span>
                  </div>

                  {/* Loss */}
                  <div className={`p-2 rounded-xl ${sale.loss > 0 ? 'bg-rose-50 text-rose-800' : 'bg-slate-50 text-slate-400'}`}>
                    <span className="text-[10px] block font-medium">লস (৳)</span>
                    <span className="font-bold tabular-nums">
                      {sale.loss > 0 ? `-${formatTaka(sale.loss, useBengaliDigits)}` : '০'}
                    </span>
                  </div>
                </div>

                {/* Inline Delete Confirmation if requested */}
                {isDeleting && (
                  <div className="mt-3 p-3 rounded-xl bg-rose-50 border border-rose-200 flex items-center justify-between text-xs text-rose-800 animate-in fade-in">
                    <span>আপনি কি নিশ্চিতভাবে এই বিক্রির হিসাবটি মুছে ফেলতে চান?</span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setDeleteConfirmId(null)}
                        className="px-2.5 py-1 rounded-lg bg-white text-slate-700 border border-slate-300 font-medium hover:bg-slate-100 cursor-pointer"
                      >
                        না
                      </button>
                      <button
                        onClick={() => {
                          onDeleteSale(sale.id);
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

      {/* Floating Action Button (FAB) for adding new sale */}
      <div className="fixed bottom-20 right-4 sm:right-6 z-40">
        <button
          onClick={onAddSale}
          className="flex items-center gap-2 px-4 py-3 rounded-full bg-[#1B365D] hover:bg-[#142845] text-white font-bold text-xs sm:text-sm shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-0.5 active:scale-95 cursor-pointer border border-blue-400/30"
        >
          <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center">
            <Plus className="w-4 h-4 stroke-[3]" />
          </div>
          <span>নতুন বিক্রি যোগ করুন</span>
        </button>
      </div>
    </div>
  );
};
