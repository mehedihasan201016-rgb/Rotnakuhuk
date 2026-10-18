import React, { useState, useEffect } from 'react';
import { X, Check, Calculator, AlertTriangle, Store, Calendar, Package } from 'lucide-react';
import { PurchaseItem } from '../types';
import { formatTaka } from '../utils/formatters';

interface PurchaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (purchaseData: Omit<PurchaseItem, 'id' | 'totalPrice'> & { id?: string }) => void;
  purchaseToEdit?: PurchaseItem | null;
  existingShops: string[];
  useBengaliDigits: boolean;
}

export const PurchaseModal: React.FC<PurchaseModalProps> = ({
  isOpen,
  onClose,
  onSave,
  purchaseToEdit,
  existingShops,
  useBengaliDigits,
}) => {
  const [shopName, setShopName] = useState('');
  const [productName, setProductName] = useState('');
  const [quantity, setQuantity] = useState<number | ''>('');
  const [unitPrice, setUnitPrice] = useState<number | ''>('');
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (purchaseToEdit) {
      setShopName(purchaseToEdit.shopName);
      setProductName(purchaseToEdit.productName || 'জামা');
      setQuantity(purchaseToEdit.quantity);
      setUnitPrice(purchaseToEdit.unitPrice);
      setDate(purchaseToEdit.date || new Date().toISOString().slice(0, 10));
      setNotes(purchaseToEdit.notes || '');
    } else {
      setShopName('');
      setProductName('জামা / গার্মেন্টস আইটেম');
      setQuantity('');
      setUnitPrice('');
      setDate(new Date().toISOString().slice(0, 10));
      setNotes('');
    }
    setError('');
  }, [purchaseToEdit, isOpen]);

  if (!isOpen) return null;

  const numQuantity = Number(quantity) || 0;
  const numUnitPrice = Number(unitPrice) || 0;
  const calculatedTotal = numQuantity * numUnitPrice;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!shopName.trim()) {
      setError('দয়া করে দোকানের নাম লিখুন বা সিলেক্ট করুন');
      return;
    }
    if (numQuantity <= 0) {
      setError('সঠিক পিস সংখ্যা লিখুন (কমপক্ষে ১ হতে হবে)');
      return;
    }
    if (numUnitPrice <= 0) {
      setError('সঠিক দর/পিস লিখুন');
      return;
    }

    onSave({
      id: purchaseToEdit ? purchaseToEdit.id : undefined,
      date,
      shopName: shopName.trim(),
      productName: productName.trim() || 'পোশাক আইটেম',
      quantity: numQuantity,
      unitPrice: numUnitPrice,
      notes: notes.trim(),
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="bg-white w-full max-w-lg rounded-t-3xl sm:rounded-2xl shadow-2xl border border-slate-200 overflow-hidden max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 bg-slate-50/50">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-slate-900">
              {purchaseToEdit ? 'কেনাকাটা চালান পরিবর্তন' : 'নতুন কেনাকাটা চালান যোগ করুন'}
            </h3>
            <p className="text-xs text-slate-500">
              পিস ও দর লিখলেই মোট ক্রয়মূল্য স্বয়ংক্রিয়ভাবে হিসাব হয়ে যাবে
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 overflow-y-auto space-y-4">
          {error && (
            <div className="p-3 rounded-xl bg-rose-50 text-rose-700 text-xs font-medium border border-rose-200 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Shop Name with Quick Suggestions */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
              <Store className="w-3.5 h-3.5 text-slate-500" />
              <span>দোকানের নাম <span className="text-rose-500">*</span></span>
            </label>
            <input
              type="text"
              value={shopName}
              onChange={(e) => setShopName(e.target.value)}
              placeholder="উদা: বস্ত্রনীড়, তানুশী গার্মেন্টস, প্লাজু সেন্টার"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-[#1B365D] focus:ring-2 focus:ring-[#1B365D]/20 text-sm outline-none transition-all"
              required
            />

            {/* Quick existing shop suggestions */}
            {existingShops.length > 0 && (
              <div className="mt-2 flex flex-wrap items-center gap-1.5">
                <span className="text-[11px] text-slate-400">পরিচিত দোকান:</span>
                {existingShops.slice(0, 5).map((shop) => (
                  <button
                    key={shop}
                    type="button"
                    onClick={() => setShopName(shop)}
                    className="text-[11px] px-2 py-0.5 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
                  >
                    {shop}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Name */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
              <Package className="w-3.5 h-3.5 text-slate-500" />
              <span>পণ্যের নাম / বিবরণ</span>
            </label>
            <input
              type="text"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              placeholder="উদা: লেডিস জামা, থ্রি-পিস, প্লাজু সেট"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-[#1B365D] focus:ring-2 focus:ring-[#1B365D]/20 text-sm outline-none"
            />
          </div>

          {/* Quantity & Unit Price Grid */}
          <div className="grid grid-cols-2 gap-3">
            {/* Quantity (পিস) */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                পিস (পরিমাণ) <span className="text-rose-500">*</span>
              </label>
              <input
                type="number"
                min="1"
                step="1"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value === '' ? '' : Number(e.target.value))}
                placeholder="3"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-[#1B365D] focus:ring-2 focus:ring-[#1B365D]/20 text-sm outline-none font-medium tabular-nums"
                required
              />
            </div>

            {/* Unit Price (দর/পিস) */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                দর / পিস (৳) <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-semibold">
                  ৳
                </span>
                <input
                  type="number"
                  min="0"
                  step="any"
                  value={unitPrice}
                  onChange={(e) => setUnitPrice(e.target.value === '' ? '' : Number(e.target.value))}
                  placeholder="500"
                  className="w-full pl-8 pr-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-[#1B365D] focus:ring-2 focus:ring-[#1B365D]/20 text-sm outline-none font-medium tabular-nums"
                  required
                />
              </div>
            </div>
          </div>

          {/* Live Total Price Calculation Card */}
          <div className="p-3.5 rounded-xl bg-indigo-50/70 border border-indigo-200">
            <div className="flex items-center justify-between text-xs text-indigo-900 mb-1">
              <span className="font-semibold flex items-center gap-1.5">
                <Calculator className="w-3.5 h-3.5" />
                মোট ক্রয়মূল্য (স্বয়ংক্রিয় হিসাব):
              </span>
              <span className="text-[11px] text-indigo-700">
                {numQuantity} পিস × {formatTaka(numUnitPrice, useBengaliDigits)}
              </span>
            </div>
            <div className="text-xl font-bold text-indigo-950 tabular-nums">
              {formatTaka(calculatedTotal, useBengaliDigits)}
            </div>
          </div>

          {/* Date Picker */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-slate-500" />
              <span>চালানের তারিখ</span>
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-[#1B365D] focus:ring-2 focus:ring-[#1B365D]/20 text-sm outline-none"
            />
          </div>

          {/* Notes (e.g. ক্যাশমেমো সংক্রান্ত) */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              নোট বা মন্তব্য (ঐচ্ছিক)
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="উদা: ক্যাশমেমো সংরক্ষিত নেই, চালান নং ৮৪"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-[#1B365D] focus:ring-2 focus:ring-[#1B365D]/20 text-sm outline-none"
            />
          </div>

          {/* Submit Action */}
          <div className="pt-2 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-100 text-xs font-semibold text-slate-700 transition-colors cursor-pointer"
            >
              বাতিল
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-[#1B365D] hover:bg-[#142845] text-white text-xs font-semibold shadow-md transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
            >
              <Check className="w-4 h-4" />
              <span>{purchaseToEdit ? 'চালান আপডেট করুন' : 'চালান সংরক্ষণ করুন'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
