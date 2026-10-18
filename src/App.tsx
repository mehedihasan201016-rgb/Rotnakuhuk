import React, { useState, useMemo, useEffect } from 'react';
import { Header } from './components/Header';
import { BottomNav, TabType } from './components/BottomNav';
import { DashboardTab } from './components/DashboardTab';
import { SalesTab } from './components/SalesTab';
import { PurchasesTab } from './components/PurchasesTab';
import { SaleModal } from './components/SaleModal';
import { PurchaseModal } from './components/PurchaseModal';
import { KotlinCodeModal } from './components/KotlinCodeModal';
import { 
  loadSales, 
  saveSales, 
  loadPurchases, 
  savePurchases, 
  calculateKPIs, 
  calculateShopSummaries,
  resetToDefaultData,
  exportToCSV
} from './utils/storage';
import { SaleItem, PurchaseItem } from './types';
import { CheckCircle2, AlertCircle, RotateCcw } from 'lucide-react';

export default function App() {
  const [sales, setSales] = useState<SaleItem[]>(() => loadSales());
  const [purchases, setPurchases] = useState<PurchaseItem[]>(() => loadPurchases());
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [useBengaliDigits, setUseBengaliDigits] = useState<boolean>(true);
  const [isMobileFrame, setIsMobileFrame] = useState<boolean>(false);
  const [selectedShopFilter, setSelectedShopFilter] = useState<string | null>(null);

  // Modals state
  const [isSaleModalOpen, setIsSaleModalOpen] = useState(false);
  const [saleToEdit, setSaleToEdit] = useState<SaleItem | null>(null);

  const [isPurchaseModalOpen, setIsPurchaseModalOpen] = useState(false);
  const [purchaseToEdit, setPurchaseToEdit] = useState<PurchaseItem | null>(null);

  const [isKotlinModalOpen, setIsKotlinModalOpen] = useState(false);
  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);

  // Toast notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((curr) => (curr === msg ? null : curr));
    }, 2800);
  };

  // Sync to localStorage
  useEffect(() => {
    saveSales(sales);
  }, [sales]);

  useEffect(() => {
    savePurchases(purchases);
  }, [purchases]);

  // Dynamic calculated KPIs
  const kpis = useMemo(() => calculateKPIs(sales, purchases), [sales, purchases]);

  // Dynamic calculated shop summaries
  const shopSummaries = useMemo(() => calculateShopSummaries(purchases), [purchases]);

  // Existing shops list for suggestions
  const existingShops = useMemo(() => {
    const set = new Set<string>();
    purchases.forEach((p) => {
      if (p.shopName) set.add(p.shopName.trim());
    });
    return Array.from(set);
  }, [purchases]);

  // Next sale item number
  const nextSaleItemNumber = useMemo(() => {
    if (sales.length === 0) return 1;
    const maxNum = Math.max(...sales.map((s) => s.itemNumber || 0));
    return maxNum + 1;
  }, [sales]);

  // Handlers for Sales
  const handleSaveSale = (
    saleData: Omit<SaleItem, 'id' | 'profit' | 'loss'> & { id?: string }
  ) => {
    const profit = Math.max(0, saleData.sellingPrice - saleData.costPrice);
    const loss = Math.max(0, saleData.costPrice - saleData.sellingPrice);

    if (saleData.id) {
      // Edit existing
      setSales((prev) =>
        prev.map((s) =>
          s.id === saleData.id
            ? { ...s, ...saleData, profit, loss, id: saleData.id }
            : s
        )
      );
      showToast('বিক্রির তথ্য সফলভাবে আপডেট হয়েছে!');
    } else {
      // Create new
      const newSale: SaleItem = {
        id: `s-${Date.now()}`,
        itemNumber: saleData.itemNumber,
        itemName: saleData.itemName,
        costPrice: saleData.costPrice,
        sellingPrice: saleData.sellingPrice,
        profit,
        loss,
        date: saleData.date,
        notes: saleData.notes,
      };
      setSales((prev) => [newSale, ...prev]);
      showToast('নতুন বিক্রি সফলভাবে যোগ করা হয়েছে!');
    }
    setSaleToEdit(null);
  };

  const handleDeleteSale = (id: string) => {
    setSales((prev) => prev.filter((s) => s.id !== id));
    showToast('বিক্রির হিসাব মুছে ফেলা হয়েছে।');
  };

  // Handlers for Purchases
  const handleSavePurchase = (
    purchaseData: Omit<PurchaseItem, 'id' | 'totalPrice'> & { id?: string }
  ) => {
    const totalPrice = purchaseData.quantity * purchaseData.unitPrice;

    if (purchaseData.id) {
      // Edit existing
      setPurchases((prev) =>
        prev.map((p) =>
          p.id === purchaseData.id
            ? { ...p, ...purchaseData, totalPrice, id: purchaseData.id }
            : p
        )
      );
      showToast('কেনাকাটা চালান সফলভাবে আপডেট হয়েছে!');
    } else {
      // Create new
      const newPurchase: PurchaseItem = {
        id: `p-${Date.now()}`,
        date: purchaseData.date,
        shopName: purchaseData.shopName,
        productName: purchaseData.productName,
        quantity: purchaseData.quantity,
        unitPrice: purchaseData.unitPrice,
        totalPrice,
        notes: purchaseData.notes,
      };
      setPurchases((prev) => [newPurchase, ...prev]);
      showToast('নতুন চালান সফলভাবে যোগ করা হয়েছে!');
    }
    setPurchaseToEdit(null);
  };

  const handleDeletePurchase = (id: string) => {
    setPurchases((prev) => prev.filter((p) => p.id !== id));
    showToast('চালানের হিসাব মুছে ফেলা হয়েছে।');
  };

  // Reset to original spreadsheet data
  const handleReset = () => {
    const { sales: defaultSales, purchases: defaultPurchases } = resetToDefaultData();
    setSales(defaultSales);
    setPurchases(defaultPurchases);
    setSelectedShopFilter(null);
    setIsResetConfirmOpen(false);
    showToast('মূল স্প্রেডশিটের প্রাথমিক তথ্যে রিসেট করা হয়েছে!');
  };

  // Navigation helpers
  const handleNavigateToPurchases = (shopFilter?: string) => {
    if (shopFilter) {
      setSelectedShopFilter(shopFilter);
    }
    setActiveTab('purchases');
  };

  const handleNavigateToSales = () => {
    setActiveTab('sales');
  };

  return (
    <div className="min-h-screen bg-[#F4F6F9] text-slate-900 flex flex-col justify-between selection:bg-[#1B365D] selection:text-white">
      {/* Top Header */}
      <Header
        useBengaliDigits={useBengaliDigits}
        setUseBengaliDigits={setUseBengaliDigits}
        isMobileFrame={isMobileFrame}
        setIsMobileFrame={setIsMobileFrame}
        onResetData={() => setIsResetConfirmOpen(true)}
        onExportCSV={() => exportToCSV(sales, purchases)}
        onOpenKotlinCode={() => setIsKotlinModalOpen(true)}
        totalSales={kpis.totalSales}
        netProfit={kpis.netProfit}
      />

      {/* Main Content Area */}
      <main className="flex-1 w-full flex justify-center py-4 px-3 sm:px-6">
        <div
          className={`w-full transition-all duration-300 ${
            isMobileFrame
              ? 'max-w-[430px] border-8 border-slate-800 rounded-[40px] shadow-2xl bg-[#F4F6F9] p-3 overflow-hidden min-h-[750px] relative'
              : 'max-w-4xl'
          }`}
        >
          {/* Mobile frame simulated notch and status bar if mobile frame is on */}
          {isMobileFrame && (
            <div className="w-full flex items-center justify-between px-4 pt-1 pb-3 text-xs text-slate-500 font-mono">
              <span>9:41</span>
              <div className="w-20 h-4 bg-slate-800 rounded-full mx-auto" />
              <span>5G 100%</span>
            </div>
          )}

          {/* Active Tab View */}
          {activeTab === 'dashboard' && (
            <DashboardTab
              kpis={kpis}
              shopSummaries={shopSummaries}
              recentSales={sales}
              recentPurchases={purchases}
              useBengaliDigits={useBengaliDigits}
              onOpenSaleModal={() => {
                setSaleToEdit(null);
                setIsSaleModalOpen(true);
              }}
              onOpenPurchaseModal={() => {
                setPurchaseToEdit(null);
                setIsPurchaseModalOpen(true);
              }}
              onNavigateToPurchases={handleNavigateToPurchases}
              onNavigateToSales={handleNavigateToSales}
            />
          )}

          {activeTab === 'sales' && (
            <SalesTab
              sales={sales}
              useBengaliDigits={useBengaliDigits}
              onAddSale={() => {
                setSaleToEdit(null);
                setIsSaleModalOpen(true);
              }}
              onEditSale={(sale) => {
                setSaleToEdit(sale);
                setIsSaleModalOpen(true);
              }}
              onDeleteSale={handleDeleteSale}
            />
          )}

          {activeTab === 'purchases' && (
            <PurchasesTab
              purchases={purchases}
              selectedShopFilter={selectedShopFilter}
              onClearShopFilter={() => setSelectedShopFilter(null)}
              onSelectShopFilter={(shop) => setSelectedShopFilter(shop)}
              useBengaliDigits={useBengaliDigits}
              onAddPurchase={() => {
                setPurchaseToEdit(null);
                setIsPurchaseModalOpen(true);
              }}
              onEditPurchase={(purchase) => {
                setPurchaseToEdit(purchase);
                setIsPurchaseModalOpen(true);
              }}
              onDeletePurchase={handleDeletePurchase}
            />
          )}
        </div>
      </main>

      {/* Bottom Navigation Bar */}
      <BottomNav
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        salesCount={sales.length}
        purchasesCount={purchases.length}
        useBengaliDigits={useBengaliDigits}
      />

      {/* Sale Add/Edit Modal */}
      <SaleModal
        isOpen={isSaleModalOpen}
        onClose={() => {
          setIsSaleModalOpen(false);
          setSaleToEdit(null);
        }}
        onSave={handleSaveSale}
        saleToEdit={saleToEdit}
        nextItemNumber={nextSaleItemNumber}
        useBengaliDigits={useBengaliDigits}
      />

      {/* Purchase Add/Edit Modal */}
      <PurchaseModal
        isOpen={isPurchaseModalOpen}
        onClose={() => {
          setIsPurchaseModalOpen(false);
          setPurchaseToEdit(null);
        }}
        onSave={handleSavePurchase}
        purchaseToEdit={purchaseToEdit}
        existingShops={existingShops}
        useBengaliDigits={useBengaliDigits}
      />

      {/* Kotlin / Android Jetpack Compose Code Inspector Modal */}
      <KotlinCodeModal
        isOpen={isKotlinModalOpen}
        onClose={() => setIsKotlinModalOpen(false)}
      />

      {/* Reset Confirmation Dialog */}
      {isResetConfirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl p-5 max-w-sm w-full shadow-2xl border border-slate-200">
            <div className="w-10 h-10 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mb-3">
              <RotateCcw className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900">
              ডেটা রিসেট নিশ্চিতকরণ
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              আপনি কি সব পরিবর্তন মুছে ফেলে স্প্রেডশিটের মূল ৮টি বিক্রয় ও ৮টি কেনাকাটার প্রাথমিক তথ্যে ফিরে যেতে চান?
            </p>
            <div className="mt-4 flex items-center justify-end gap-2">
              <button
                onClick={() => setIsResetConfirmOpen(false)}
                className="px-3.5 py-2 rounded-xl border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-100 cursor-pointer"
              >
                বাতিল
              </button>
              <button
                onClick={handleReset}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold shadow-sm cursor-pointer"
              >
                হ্যাঁ, রিসেট করুন
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 px-4 py-2.5 rounded-full bg-slate-900 text-white text-xs font-semibold shadow-xl flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
