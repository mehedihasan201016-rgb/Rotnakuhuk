import React from 'react';
import { 
  TrendingUp, 
  ShoppingBag, 
  Package, 
  DollarSign, 
  Boxes, 
  Store, 
  Plus, 
  AlertCircle,
  ArrowUpRight,
  Archive,
  ChevronRight,
  Percent
} from 'lucide-react';
import { KPIData, ShopSummary, SaleItem, PurchaseItem } from '../types';
import { formatTaka, formatPieces, formatPercentage, formatBengaliDate } from '../utils/formatters';

interface DashboardTabProps {
  kpis: KPIData;
  shopSummaries: ShopSummary[];
  recentSales: SaleItem[];
  recentPurchases: PurchaseItem[];
  useBengaliDigits: boolean;
  onOpenSaleModal: () => void;
  onOpenPurchaseModal: () => void;
  onNavigateToPurchases: (shopFilter?: string) => void;
  onNavigateToSales: () => void;
}

export const DashboardTab: React.FC<DashboardTabProps> = ({
  kpis,
  shopSummaries,
  recentSales,
  recentPurchases,
  useBengaliDigits,
  onOpenSaleModal,
  onOpenPurchaseModal,
  onNavigateToPurchases,
  onNavigateToSales,
}) => {
  // Calculate profit margin percentage
  const marginPct = kpis.totalSales > 0 ? (kpis.netProfit / kpis.totalSales) * 100 : 0;

  return (
    <div className="space-y-6 pb-20">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-[#1B365D] via-[#244677] to-[#1B365D] text-white rounded-2xl p-4 sm:p-5 shadow-sm border border-blue-900/40">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="text-xs font-medium text-amber-300 uppercase tracking-wider mb-1">
              রত্নকুহক গার্মেন্টস ড্যাশবোর্ড
            </div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
              ব্যবসার মূল হিসাব ও স্টক পরিস্থিতি
            </h2>
            <p className="text-xs sm:text-sm text-blue-100/90 mt-1">
              বিক্রি, ক্রয় ও বর্তমান ইনভেন্টরির রিয়েল-টাইম তথ্য
            </p>
          </div>

          {/* Fast Action Buttons */}
          <div className="flex items-center gap-2 pt-1 sm:pt-0">
            <button
              onClick={onOpenSaleModal}
              className="flex-1 sm:flex-none px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-sm transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>বিক্রি যোগ করুন</span>
            </button>
            <button
              onClick={onOpenPurchaseModal}
              className="flex-1 sm:flex-none px-3.5 py-2 rounded-xl bg-white/15 hover:bg-white/25 text-white text-xs font-semibold border border-white/20 transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>ক্রয় যোগ করুন</span>
            </button>
          </div>
        </div>
      </div>

      {/* Top 6 KPI Summary Cards Grid */}
      <section aria-labelledby="kpi-heading">
        <h3 id="kpi-heading" className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
          <span>মূল আর্থিক ও স্টক মেট্রিক্স (KPI)</span>
        </h3>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
          {/* Card 1: মোট বিক্রি */}
          <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs hover:shadow-sm transition-shadow">
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-xs font-medium">মোট বিক্রি</span>
              <div className="w-8 h-8 rounded-lg bg-blue-50 text-[#1B365D] flex items-center justify-center">
                <ShoppingBag className="w-4 h-4" />
              </div>
            </div>
            <div className="text-xl sm:text-2xl font-bold text-slate-900 tabular-nums">
              {formatTaka(kpis.totalSales, useBengaliDigits)}
            </div>
            <div className="text-[11px] text-slate-500 mt-1 flex items-center justify-between">
              <span>বিক্রিত: {formatPieces(kpis.totalSoldPieces, useBengaliDigits)}</span>
              <button 
                onClick={onNavigateToSales}
                className="text-[#1B365D] hover:underline flex items-center font-medium"
              >
                তালিকা <ChevronRight className="w-3 h-3 ml-0.5" />
              </button>
            </div>
          </div>

          {/* Card 2: মোট ক্রয় */}
          <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs hover:shadow-sm transition-shadow">
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-xs font-medium">মোট ক্রয়</span>
              <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-700 flex items-center justify-center">
                <Package className="w-4 h-4" />
              </div>
            </div>
            <div className="text-xl sm:text-2xl font-bold text-slate-900 tabular-nums">
              {formatTaka(kpis.totalPurchases, useBengaliDigits)}
            </div>
            <div className="text-[11px] text-slate-500 mt-1 flex items-center justify-between">
              <span>কেনা: {formatPieces(kpis.totalPurchasedPieces, useBengaliDigits)}</span>
              <button 
                onClick={() => onNavigateToPurchases()}
                className="text-indigo-700 hover:underline flex items-center font-medium"
              >
                চালান <ChevronRight className="w-3 h-3 ml-0.5" />
              </button>
            </div>
          </div>

          {/* Card 3: নীট লাভ (Net Profit) */}
          <div className="bg-white rounded-2xl p-4 border border-emerald-200/80 shadow-xs hover:shadow-sm transition-shadow bg-gradient-to-b from-white to-emerald-50/20">
            <div className="flex items-center justify-between text-emerald-700 mb-2">
              <span className="text-xs font-semibold">নীট লাভ (বিক্রিত আইটেমে)</span>
              <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center">
                <TrendingUp className="w-4 h-4" />
              </div>
            </div>
            <div className="text-xl sm:text-2xl font-bold text-emerald-800 tabular-nums">
              {formatTaka(kpis.netProfit, useBengaliDigits)}
            </div>
            <div className="text-[11px] text-emerald-700 mt-1 font-medium flex items-center gap-1">
              <span>মার্জিন: {formatPercentage(marginPct, useBengaliDigits)}</span>
              <span className="text-slate-400">·</span>
              <span>মোট খরচ: {formatTaka(kpis.totalSoldCost, useBengaliDigits)}</span>
            </div>
          </div>

          {/* Card 4: মোট কেনা পিস */}
          <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs hover:shadow-sm transition-shadow">
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-xs font-medium">মোট কেনা পিস</span>
              <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center">
                <Boxes className="w-4 h-4" />
              </div>
            </div>
            <div className="text-xl sm:text-2xl font-bold text-slate-900 tabular-nums">
              {formatPieces(kpis.totalPurchasedPieces, useBengaliDigits)}
            </div>
            <div className="text-[11px] text-slate-500 mt-1">
              মোট ৭টি উৎস / দোকান থেকে
            </div>
          </div>

          {/* Card 5: মোট বিক্রিত পিস */}
          <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs hover:shadow-sm transition-shadow">
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-xs font-medium">মোট বিক্রিত পিস</span>
              <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center">
                <ShoppingBag className="w-4 h-4" />
              </div>
            </div>
            <div className="text-xl sm:text-2xl font-bold text-slate-900 tabular-nums">
              {formatPieces(kpis.totalSoldPieces, useBengaliDigits)}
            </div>
            <div className="text-[11px] text-slate-500 mt-1">
              গড় বিক্রয়দর: {formatTaka(kpis.totalSoldPieces > 0 ? kpis.totalSales / kpis.totalSoldPieces : 0, useBengaliDigits)}
            </div>
          </div>

          {/* Card 6: বর্তমান স্টক (Stock Left) */}
          <div className="bg-white rounded-2xl p-4 border border-amber-200 shadow-xs hover:shadow-sm transition-shadow bg-gradient-to-b from-white to-amber-50/20">
            <div className="flex items-center justify-between text-amber-800 mb-2">
              <span className="text-xs font-semibold">বর্তমান মজুদ (স্টক)</span>
              <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center">
                <Archive className="w-4 h-4" />
              </div>
            </div>
            <div className="text-xl sm:text-2xl font-bold text-amber-900 tabular-nums">
              {formatPieces(kpis.currentStock, useBengaliDigits)}
            </div>
            <div className="text-[11px] text-slate-600 mt-1 flex items-center justify-between">
              <span>কেনা ২৫ - বিক্রি ৮</span>
              <span className="font-medium text-amber-800">মজুদ আছে</span>
            </div>
          </div>
        </div>
      </section>

      {/* Shop-Wise Purchase Summary (দোকানভিত্তিক ক্রয় সারাংশ) */}
      <section aria-labelledby="shop-summary-heading" className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-xs">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
          <div>
            <h3 id="shop-summary-heading" className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Store className="w-4 h-4 text-[#1B365D]" />
              <span>দোকানভিত্তিক ক্রয় সারাংশ (Shop-wise Purchases)</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              কোন দোকান থেকে কত পিস ও কত টাকার পোশাক কেনা হয়েছে তার হিসাব
            </p>
          </div>
          <div className="text-right">
            <div className="text-xs font-semibold text-slate-500">মোট দোকানের সংখ্যা</div>
            <div className="text-sm font-bold text-[#1B365D] tabular-nums">
              {useBengaliDigits ? `${shopSummaries.length} টি` : `${shopSummaries.length} টি`}
            </div>
          </div>
        </div>

        {/* Shop List Breakdown */}
        <div className="divide-y divide-slate-100">
          {shopSummaries.map((shop, idx) => {
            const hasLostMemo = shop.hasNote && shop.hasNote.includes('ক্যাশমেমো');
            
            return (
              <div 
                key={shop.shopName}
                onClick={() => onNavigateToPurchases(shop.shopName)}
                className="py-3.5 first:pt-1 last:pb-1 group hover:bg-slate-50/80 px-2 rounded-xl transition-colors cursor-pointer"
              >
                <div className="flex items-start justify-between gap-3 mb-1.5">
                  <div className="flex items-center gap-2.5">
                    <span className="w-5 h-5 rounded-md bg-slate-100 text-slate-600 text-xs font-bold flex items-center justify-center shrink-0">
                      {idx + 1}
                    </span>
                    <div>
                      <div className="text-sm font-semibold text-slate-900 group-hover:text-[#1B365D] transition-colors flex items-center gap-1.5">
                        <span>{shop.shopName}</span>
                        {hasLostMemo && (
                          <span className="text-[10px] px-1.5 py-0.2 rounded bg-rose-50 text-rose-700 border border-rose-200 flex items-center gap-0.5">
                            <AlertCircle className="w-2.5 h-2.5" />
                            ক্যাশমেমো নেই
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-slate-500 mt-0.5">
                        {formatPieces(shop.totalPieces, useBengaliDigits)} ({shop.purchaseCount}টি চালান)
                        {shop.hasNote && !hasLostMemo && ` · ${shop.hasNote}`}
                      </div>
                    </div>
                  </div>

                  {/* Amounts */}
                  <div className="text-right shrink-0">
                    <div className="text-sm font-bold text-slate-900 tabular-nums">
                      {formatTaka(shop.totalCost, useBengaliDigits)}
                    </div>
                    <div className="text-xs font-semibold text-blue-700 tabular-nums">
                      {formatPercentage(shop.percentage, useBengaliDigits)}
                    </div>
                  </div>
                </div>

                {/* Progress bar visual */}
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden mt-2">
                  <div 
                    className="h-full rounded-full transition-all duration-500 bg-[#1B365D]"
                    style={{ width: `${Math.min(100, Math.max(3, shop.percentage))}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer info strip */}
        <div className="mt-4 pt-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between text-xs text-slate-500 gap-2 bg-slate-50 p-2.5 rounded-xl">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-700">সর্বমোট কেনাকাটা:</span>
            <span className="font-bold text-[#1B365D] tabular-nums">{formatTaka(kpis.totalPurchases, useBengaliDigits)}</span>
            <span>·</span>
            <span>{formatPieces(kpis.totalPurchasedPieces, useBengaliDigits)}</span>
          </div>
          <button
            onClick={() => onNavigateToPurchases()}
            className="text-[#1B365D] hover:underline font-semibold flex items-center self-end sm:self-auto"
          >
            সব চালান দেখুন <ArrowUpRight className="w-3.5 h-3.5 ml-0.5" />
          </button>
        </div>
      </section>

      {/* 2-Column Section: Recent Sales & Recent Purchases */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Recent Sales Column */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
              <ShoppingBag className="w-4 h-4 text-emerald-700" />
              <span>সাম্প্রতিক বিক্রি ({recentSales.length} টি)</span>
            </h4>
            <button
              onClick={onNavigateToSales}
              className="text-xs font-medium text-[#1B365D] hover:underline"
            >
              সবগুলো
            </button>
          </div>

          <div className="space-y-2">
            {recentSales.slice(0, 4).map((sale) => (
              <div 
                key={sale.id}
                className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50/70 hover:bg-slate-100/70 transition-colors text-xs"
              >
                <div>
                  <div className="font-semibold text-slate-900">{sale.itemName}</div>
                  <div className="text-[11px] text-slate-500">
                    ক্রয়: {formatTaka(sale.costPrice, useBengaliDigits)} · {formatBengaliDate(sale.date)}
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-slate-900 tabular-nums">
                    {formatTaka(sale.sellingPrice, useBengaliDigits)}
                  </div>
                  <div className="text-[11px] font-semibold text-emerald-700 tabular-nums">
                    +লাভ {formatTaka(sale.profit, useBengaliDigits)}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={onOpenSaleModal}
            className="w-full mt-3 py-2 rounded-xl border border-dashed border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>নতুন বিক্রি লিপিবদ্ধ করুন</span>
          </button>
        </div>

        {/* Recent Purchases Column */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
              <Package className="w-4 h-4 text-indigo-700" />
              <span>সাম্প্রতিক কেনাকাটা ({recentPurchases.length} টি)</span>
            </h4>
            <button
              onClick={() => onNavigateToPurchases()}
              className="text-xs font-medium text-indigo-700 hover:underline"
            >
              সবগুলো
            </button>
          </div>

          <div className="space-y-2">
            {recentPurchases.slice(0, 4).map((purchase) => (
              <div 
                key={purchase.id}
                className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50/70 hover:bg-slate-100/70 transition-colors text-xs"
              >
                <div>
                  <div className="font-semibold text-slate-900">{purchase.shopName}</div>
                  <div className="text-[11px] text-slate-500">
                    {purchase.productName} · {formatPieces(purchase.quantity, useBengaliDigits)} @ {formatTaka(purchase.unitPrice, useBengaliDigits)}
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-slate-900 tabular-nums">
                    {formatTaka(purchase.totalPrice, useBengaliDigits)}
                  </div>
                  <div className="text-[11px] text-slate-500">
                    {formatBengaliDate(purchase.date)}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={onOpenPurchaseModal}
            className="w-full mt-3 py-2 rounded-xl border border-dashed border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>নতুন চালান লিপিবদ্ধ করুন</span>
          </button>
        </div>
      </div>
    </div>
  );
};
