import React, { useState, useEffect } from 'react';
import { X, Check, Calculator, AlertTriangle, ArrowRight } from 'lucide-react';
import { SaleItem } from '../types';
import { formatTaka } from '../utils/formatters';

interface SaleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (saleData: Omit<SaleItem, 'id' | 'profit' | 'loss'> & { id?: string }) => void;
  saleToEdit?: SaleItem | null;
  nextItemNumber: number;
  useBengaliDigits: boolean;
}

export const SaleModal: React.FC<SaleModalProps> = ({
  isOpen,
  onClose,
  onSave,
  saleToEdit,
  nextItemNumber,
  useBengaliDigits,
}) => {
  const [itemName, setItemName] = useState('');
  const [costPrice, setCostPrice] = useState<number | ''>('');
  const [sellingPrice, setSellingPrice] = useState<number | ''>('');
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (saleToEdit) {
      setItemName(saleToEdit.itemName);
      setCostPrice(saleToEdit.costPrice);
      setSellingPrice(saleToEdit.sellingPrice);
      setDate(saleToEdit.date || new Date().toISOString().slice(0, 10));
      setNotes(saleToEdit.notes || '');
    } else {
      setItemName(`জামা ${nextItemNumber}`);
      setCostPrice('');
      setSellingPrice('');
      setDate(new Date().toISOString().slice(0, 10));
      setNotes('');
    }
    setError('');
  }, [saleToEdit, nextItemNumber, isOpen]);

  if (!isOpen) return null;

  const numericCost = Number(costPrice) || 0;
  const numericSelling = Number(sellingPrice) || 0;
  const calculatedProfit = Math.max(0, numericSelling - numericCost);
  const calculatedLoss = Math.max(0, numericCost - numericSelling);
  const isProfitable = numericSelling >= numericCost;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!itemName.trim()) {
      setError('দয়া করে জামার নাম লিখুন');
      return;
    }
    if (numericCost <= 0) {
      setError('সঠিক ক্রয়মূল্য লিখুন (০ এর বেশি হতে হবে)');
      return;
    }
    if (numericSelling <= 0) {
      setError('সঠিক বিক্রয়মূল্য লিখুন (০ এর বেশি হতে হবে)');
      return;
    }

    onSave({
      id: saleToEdit ? saleToEdit.id : undefined,
      itemNumber: saleToEdit ? saleToEdit.itemNumber : nextItemNumber,
      itemName: itemName.trim(),
      costPrice: numericCost,
      sellingPrice: numericSelling,
      date,
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
        {/* Modal Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 bg-slate-50/50">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-slate-900">
              {saleToEdit ? 'বিক্রির তথ্য পরিবর্তন করুন' : 'নতুন বিক্রি যোগ করুন'}
            </h3>
            <p className="text-xs text-slate-500">
              জামার নাম, ক্রয়মূল্য ও বিক্রয়মূল্য দিলে লাভ-লস স্বয়ংক্রিয়ভাবে হিসাব হবে
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-5 overflow-y-auto space-y-4">
          {error && (
            <div className="p-3 rounded-xl bg-rose-50 text-rose-700 text-xs font-medium border border-rose-200 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Item Name */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              জামার নাম / আইটেম বিবরণ <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
              placeholder="উদা: জামা ৯, সিল্ক কুর্তি, থ্রি-পিস"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-[#1B365D] focus:ring-2 focus:ring-[#1B365D]/20 text-sm outline-none transition-all"
              required
            />
          </div>

          {/* Pricing Grid */}
          <div className="grid grid-cols-2 gap-3">
            {/* Cost Price */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                ক্রয়মূল্য (৳) <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-semibold">
                  ৳
                </span>
                <input
                  type="number"
                  min="0"
                  step="any"
                  value={costPrice}
                  onChange={(e) => setCostPrice(e.target.value === '' ? '' : Number(e.target.value))}
                  placeholder="500"
                  className="w-full pl-8 pr-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-[#1B365D] focus:ring-2 focus:ring-[#1B365D]/20 text-sm outline-none font-medium tabular-nums"
                  required
                />
              </div>
            </div>

            {/* Selling Price */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                বিক্রয়মূল্য (৳) <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-semibold">
                  ৳
                </span>
                <input
                  type="number"
                  min="0"
                  step="any"
                  value={sellingPrice}
                  onChange={(e) => setSellingPrice(e.target.value === '' ? '' : Number(e.target.value))}
                  placeholder="750"
                  className="w-full pl-8 pr-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-[#1B365D] focus:ring-2 focus:ring-[#1B365D]/20 text-sm outline-none font-medium tabular-nums"
                  required
                />
              </div>
            </div>
          </div>

          {/* Real-time Profit/Loss Preview Card */}
          <div className={`p-3.5 rounded-xl border transition-all ${
            numericSelling > 0 && isProfitable 
              ? 'bg-emerald-50/70 border-emerald-200' 
              : numericSelling > 0 && !isProfitable 
                ? 'bg-rose-50/70 border-rose-200'
                : 'bg-slate-50 border-slate-200'
          }`}>
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="font-semibold text-slate-700 flex items-center gap-1.5">
                <Calculator className="w-3.5 h-3.5 text-slate-500" />
                স্বয়ংক্রিয় লাভ/লস ফলাফল:
              </span>
              <span className="text-[11px] text-slate-500">
                (বিক্রয়মূল্য - ক্রয়মূল্য)
              </span>
            </div>

            <div className="flex items-center justify-between pt-1">
              <div>
                <span className="text-xs text-slate-600 block">লাভ (Profit):</span>
                <span className="text-lg font-bold text-emerald-700 tabular-nums">
                  {formatTaka(calculatedProfit, useBengaliDigits)}
                </span>
              </div>

              <ArrowRight className="w-4 h-4 text-slate-400" />

              <div className="text-right">
                <span className="text-xs text-slate-600 block">লস (Loss):</span>
                <span className={`text-lg font-bold tabular-nums ${calculatedLoss > 0 ? 'text-rose-700' : 'text-slate-400'}`}>
                  {formatTaka(calculatedLoss, useBengaliDigits)}
                </span>
              </div>
            </div>
          </div>

          {/* Date Picker */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              বিক্রির তারিখ
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-[#1B365D] focus:ring-2 focus:ring-[#1B365D]/20 text-sm outline-none"
            />
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              নোট বা মন্তব্য (ঐচ্ছিক)
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="উদা: নগদ বিক্রি, কাস্টমার রসিদ নং ১২"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-[#1B365D] focus:ring-2 focus:ring-[#1B365D]/20 text-sm outline-none"
            />
          </div>

          {/* Submit Buttons */}
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
              <span>{saleToEdit ? 'আপডেট করুন' : 'সংরক্ষণ করুন'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
