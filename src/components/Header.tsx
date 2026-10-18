import React from 'react';
import { 
  RotateCcw, 
  Download, 
  Code2, 
  Smartphone, 
  Monitor, 
  Languages, 
  Sparkles 
} from 'lucide-react';
import { formatTaka } from '../utils/formatters';

interface HeaderProps {
  useBengaliDigits: boolean;
  setUseBengaliDigits: (val: boolean | ((prev: boolean) => boolean)) => void;
  isMobileFrame: boolean;
  setIsMobileFrame: (val: boolean | ((prev: boolean) => boolean)) => void;
  onResetData: () => void;
  onExportCSV: () => void;
  onOpenKotlinCode: () => void;
  totalSales: number;
  netProfit: number;
}

export const Header: React.FC<HeaderProps> = ({
  useBengaliDigits,
  setUseBengaliDigits,
  isMobileFrame,
  setIsMobileFrame,
  onResetData,
  onExportCSV,
  onOpenKotlinCode,
  totalSales,
  netProfit,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-[#1B365D] text-white shadow-md">
      <div className="max-w-6xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between gap-3">
          {/* Brand Logo & Name */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center font-bold text-xl text-amber-300 shadow-inner">
              র
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg md:text-xl font-bold tracking-tight text-white leading-none">
                  রত্নকুহক
                </h1>
                <span className="text-[11px] font-medium px-2 py-0.5 rounded bg-white/10 text-blue-100 hidden sm:inline-block">
                  Ratnakuhuk
                </span>
              </div>
              <p className="text-[11px] text-blue-200 mt-0.5">
                পোশাক ব্যবসা ও স্টক হিসাব
              </p>
            </div>
          </div>

          {/* Quick Toolbar Actions */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Number Format Toggle (বাংলা / English digits) */}
            <button
              onClick={() => setUseBengaliDigits((prev) => !prev)}
              title="সংখ্যা ফরম্যাট পরিবর্তন (বাংলা / ইংরেজি)"
              className="px-2.5 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-medium text-white transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Languages className="w-3.5 h-3.5 text-amber-300" />
              <span className="hidden sm:inline">{useBengaliDigits ? 'সংখ্যা: বাংলা' : 'সংখ্যা: ইংরেজি'}</span>
              <span className="sm:hidden">{useBengaliDigits ? '১২৩' : '123'}</span>
            </button>

            {/* Mobile View Toggle */}
            <button
              onClick={() => setIsMobileFrame((prev) => !prev)}
              title={isMobileFrame ? 'ফুলস্ক্রিন ভিউ করুন' : 'মোবাইল ফ্রেম ভিউ করুন'}
              className="p-2 sm:px-2.5 sm:py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-medium text-white transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              {isMobileFrame ? (
                <>
                  <Monitor className="w-3.5 h-3.5 text-blue-200" />
                  <span className="hidden md:inline">ফুলস্ক্রিন</span>
                </>
              ) : (
                <>
                  <Smartphone className="w-3.5 h-3.5 text-emerald-300" />
                  <span className="hidden md:inline">মোবাইল অ্যাপ ফ্রেম</span>
                </>
              )}
            </button>

            {/* Android APK & Code Viewer */}
            <button
              onClick={onOpenKotlinCode}
              title="Android APK বিল্ড নির্দেশিকা ও সোর্স কোড দেখুন"
              className="p-2 sm:px-2.5 sm:py-1.5 rounded-lg bg-emerald-700/80 hover:bg-emerald-700 text-xs font-medium text-white transition-colors flex items-center gap-1.5 cursor-pointer shadow-sm"
            >
              <Smartphone className="w-3.5 h-3.5 text-amber-300" />
              <span className="hidden sm:inline">Android APK</span>
            </button>

            {/* Export CSV */}
            <button
              onClick={onExportCSV}
              title="এক্সেল / CSV ব্যাকআপ ডাউনলোড"
              className="p-2 sm:px-2.5 sm:py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-medium text-white transition-colors flex items-center gap-1 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-blue-200" />
              <span className="hidden lg:inline">ডাউনলোড</span>
            </button>

            {/* Reset Data */}
            <button
              onClick={onResetData}
              title="মূল স্প্রেডশিট ডেটাতে রিসেট করুন"
              className="p-2 rounded-lg bg-white/10 hover:bg-rose-900/40 text-blue-200 hover:text-rose-200 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
