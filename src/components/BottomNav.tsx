import React from 'react';
import { LayoutDashboard, ShoppingBag, Package } from 'lucide-react';
import { toBengaliNumber } from '../utils/formatters';

export type TabType = 'dashboard' | 'sales' | 'purchases';

interface BottomNavProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  salesCount: number;
  purchasesCount: number;
  useBengaliDigits: boolean;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  setActiveTab,
  salesCount,
  purchasesCount,
  useBengaliDigits,
}) => {
  const tabs = [
    {
      id: 'dashboard' as TabType,
      label: 'ড্যাশবোর্ড',
      icon: LayoutDashboard,
      badge: null,
    },
    {
      id: 'sales' as TabType,
      label: 'বিক্রি',
      icon: ShoppingBag,
      badge: useBengaliDigits ? toBengaliNumber(salesCount) : salesCount.toString(),
    },
    {
      id: 'purchases' as TabType,
      label: 'কেনাকাটা',
      icon: Package,
      badge: useBengaliDigits ? toBengaliNumber(purchasesCount) : purchasesCount.toString(),
    },
  ];

  return (
    <nav 
      aria-label="মূল নেভিগেশন"
      className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/80 shadow-[0_-4px_16px_rgba(0,0,0,0.06)]"
    >
      <div className="max-w-md mx-auto grid grid-cols-3 h-16 px-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-col items-center justify-center relative min-h-[56px] transition-all cursor-pointer group ${
                isActive ? 'text-[#1B365D]' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <div className="relative">
                {/* Material 3 active background capsule */}
                <div
                  className={`w-14 h-8 rounded-full flex items-center justify-center transition-all ${
                    isActive ? 'bg-[#1B365D]/10 text-[#1B365D] scale-105' : 'text-slate-500 group-hover:bg-slate-100'
                  }`}
                >
                  <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5px]' : 'stroke-2'}`} />
                </div>

                {/* Badge if present */}
                {tab.badge && (
                  <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 text-[10px] font-bold bg-[#1B365D] text-white rounded-full flex items-center justify-center border-2 border-white">
                    {tab.badge}
                  </span>
                )}
              </div>

              <span
                className={`text-[11px] tracking-tight mt-0.5 transition-all ${
                  isActive ? 'font-bold text-[#1B365D]' : 'font-medium text-slate-500'
                }`}
              >
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
