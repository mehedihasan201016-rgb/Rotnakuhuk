import { SaleItem, PurchaseItem, ShopSummary, KPIData } from '../types';

export const INITIAL_PURCHASES: PurchaseItem[] = [
  {
    id: 'p-1',
    date: '2026-10-20',
    shopName: 'বস্ত্রনীড়',
    productName: 'লেডিস জামা',
    quantity: 3,
    unitPrice: 480,
    totalPrice: 1440,
    notes: '',
  },
  {
    id: 'p-2',
    date: '2026-10-22',
    shopName: 'তানুশী গার্মেন্টস',
    productName: 'বেবি ফ্রক',
    quantity: 2,
    unitPrice: 380,
    totalPrice: 760,
    notes: '',
  },
  {
    id: 'p-3',
    date: '2026-10-12',
    shopName: 'প্লাজু সেন্টার',
    productName: 'প্লাজু সেট',
    quantity: 3,
    unitPrice: 500,
    totalPrice: 1500,
    notes: '',
  },
  {
    id: 'p-4',
    date: '2026-10-20',
    shopName: 'থ্রি স্টার ফ্যাশন ওয়ার্ল্ড',
    productName: 'থ্রি-পিস',
    quantity: 2,
    unitPrice: 500,
    totalPrice: 1000,
    notes: '',
  },
  {
    id: 'p-5',
    date: '2026-10-22',
    shopName: 'ফাহাদ ফ্যাশন',
    productName: 'ডিজাইন জামা',
    quantity: 3,
    unitPrice: 500,
    totalPrice: 1500,
    notes: '',
  },
  {
    id: 'p-6',
    date: '2026-10-22',
    shopName: 'নিউ মা-বাবার দোয়া গার্মেন্টস',
    productName: 'গার্মেন্টস লট ১',
    quantity: 3,
    unitPrice: 340,
    totalPrice: 1020,
    notes: '',
  },
  {
    id: 'p-7',
    date: '2026-10-22',
    shopName: 'নিউ মা-বাবার দোয়া গার্মেন্টস',
    productName: 'গার্মেন্টস লট ২',
    quantity: 3,
    unitPrice: 170,
    totalPrice: 510,
    notes: '',
  },
  {
    id: 'p-8',
    date: '2026-10-22',
    shopName: 'অন্য দোকান (ক্যাশমেমো হারানো)',
    productName: 'মিক্সড জামা কালেকশন',
    quantity: 6,
    unitPrice: 540,
    totalPrice: 3240,
    notes: 'ক্যাশমেমো সংরক্ষিত নেই',
  },
];

export const INITIAL_SALES: SaleItem[] = [
  {
    id: 's-1',
    itemNumber: 1,
    itemName: 'জামা ১',
    costPrice: 500,
    sellingPrice: 750,
    profit: 250,
    loss: 0,
    date: '2026-10-23',
    notes: 'নগদ বিক্রি',
  },
  {
    id: 's-2',
    itemNumber: 2,
    itemName: 'জামা ২',
    costPrice: 500,
    sellingPrice: 675,
    profit: 175,
    loss: 0,
    date: '2026-10-23',
    notes: 'নগদ বিক্রি',
  },
  {
    id: 's-3',
    itemNumber: 3,
    itemName: 'জামা ৩',
    costPrice: 500,
    sellingPrice: 675,
    profit: 175,
    loss: 0,
    date: '2026-10-24',
    notes: '',
  },
  {
    id: 's-4',
    itemNumber: 4,
    itemName: 'জামা ৪',
    costPrice: 350,
    sellingPrice: 600,
    profit: 250,
    loss: 0,
    date: '2026-10-24',
    notes: '',
  },
  {
    id: 's-5',
    itemNumber: 5,
    itemName: 'জামা ৫',
    costPrice: 500,
    sellingPrice: 750,
    profit: 250,
    loss: 0,
    date: '2026-10-25',
    notes: '',
  },
  {
    id: 's-6',
    itemNumber: 6,
    itemName: 'জামা ৬',
    costPrice: 350,
    sellingPrice: 600,
    profit: 250,
    loss: 0,
    date: '2026-10-25',
    notes: '',
  },
  {
    id: 's-7',
    itemNumber: 7,
    itemName: 'জামা ৭',
    costPrice: 350,
    sellingPrice: 585,
    profit: 235,
    loss: 0,
    date: '2026-10-26',
    notes: '',
  },
  {
    id: 's-8',
    itemNumber: 8,
    itemName: 'জামা ৮',
    costPrice: 540,
    sellingPrice: 830,
    profit: 290,
    loss: 0,
    date: '2026-10-26',
    notes: '',
  },
];

const STORAGE_KEY_PURCHASES = 'ratnakuhuk_purchases_v1';
const STORAGE_KEY_SALES = 'ratnakuhuk_sales_v1';
const STORAGE_KEY_SETTINGS = 'ratnakuhuk_settings_v1';

export function loadPurchases(): PurchaseItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_PURCHASES);
    if (!raw) return INITIAL_PURCHASES;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : INITIAL_PURCHASES;
  } catch (e) {
    console.error('Failed to load purchases from localStorage', e);
    return INITIAL_PURCHASES;
  }
}

export function savePurchases(items: PurchaseItem[]) {
  try {
    localStorage.setItem(STORAGE_KEY_PURCHASES, JSON.stringify(items));
  } catch (e) {
    console.error('Failed to save purchases to localStorage', e);
  }
}

export function loadSales(): SaleItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_SALES);
    if (!raw) return INITIAL_SALES;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : INITIAL_SALES;
  } catch (e) {
    console.error('Failed to load sales from localStorage', e);
    return INITIAL_SALES;
  }
}

export function saveSales(items: SaleItem[]) {
  try {
    localStorage.setItem(STORAGE_KEY_SALES, JSON.stringify(items));
  } catch (e) {
    console.error('Failed to save sales to localStorage', e);
  }
}

export function resetToDefaultData(): { sales: SaleItem[]; purchases: PurchaseItem[] } {
  savePurchases(INITIAL_PURCHASES);
  saveSales(INITIAL_SALES);
  return {
    purchases: INITIAL_PURCHASES,
    sales: INITIAL_SALES,
  };
}

export function calculateKPIs(sales: SaleItem[], purchases: PurchaseItem[]): KPIData {
  const totalSales = sales.reduce((acc, curr) => acc + (curr.sellingPrice || 0), 0);
  const totalPurchases = purchases.reduce((acc, curr) => acc + (curr.totalPrice || 0), 0);
  
  const totalProfit = sales.reduce((acc, curr) => acc + (curr.profit || 0), 0);
  const totalLoss = sales.reduce((acc, curr) => acc + (curr.loss || 0), 0);
  const netProfit = totalProfit - totalLoss;

  const totalPurchasedPieces = purchases.reduce((acc, curr) => acc + (curr.quantity || 0), 0);
  const totalSoldPieces = sales.length; // Each row represents a sold piece/unit
  const currentStock = Math.max(0, totalPurchasedPieces - totalSoldPieces);

  const totalSoldCost = sales.reduce((acc, curr) => acc + (curr.costPrice || 0), 0);
  const inventoryValue = Math.max(0, totalPurchases - totalSoldCost);

  return {
    totalSales,
    totalPurchases,
    netProfit,
    totalPurchasedPieces,
    totalSoldPieces,
    currentStock,
    totalSoldCost,
    inventoryValue,
  };
}

export function calculateShopSummaries(purchases: PurchaseItem[]): ShopSummary[] {
  const shopMap: Record<string, { totalPieces: number; totalCost: number; count: number; hasNote?: string }> = {};
  const totalOverallCost = purchases.reduce((acc, p) => acc + (p.totalPrice || 0), 0);

  purchases.forEach((p) => {
    const shop = p.shopName.trim() || 'অন্যান্য';
    if (!shopMap[shop]) {
      shopMap[shop] = { totalPieces: 0, totalCost: 0, count: 0, hasNote: p.notes };
    }
    shopMap[shop].totalPieces += Number(p.quantity) || 0;
    shopMap[shop].totalCost += Number(p.totalPrice) || 0;
    shopMap[shop].count += 1;
    if (p.notes && !shopMap[shop].hasNote) {
      shopMap[shop].hasNote = p.notes;
    }
  });

  return Object.entries(shopMap)
    .map(([shopName, data]) => {
      const percentage = totalOverallCost > 0 ? (data.totalCost / totalOverallCost) * 100 : 0;
      return {
        shopName,
        totalPieces: data.totalPieces,
        totalCost: data.totalCost,
        percentage,
        purchaseCount: data.count,
        hasNote: data.hasNote,
      };
    })
    .sort((a, b) => b.totalCost - a.totalCost);
}

export function exportToCSV(sales: SaleItem[], purchases: PurchaseItem[]) {
  // Generate CSV for Sales and Purchases
  let csvContent = "data:text/csv;charset=utf-8,\uFEFF"; // Include BOM for proper Bengali text rendering
  
  csvContent += "=== রত্নকুহক - বিক্রির হিসাব (Sales) ===\n";
  csvContent += "ক্র.নং,জামার নাম,তারিখ,ক্রয়মূল্য (৳),বিক্রয়মূল্য (৳),লাভ (৳),লস (৳),নোট\n";
  sales.forEach((s) => {
    csvContent += `"${s.itemNumber}","${s.itemName}","${s.date}","${s.costPrice}","${s.sellingPrice}","${s.profit}","${s.loss}","${s.notes || ''}"\n`;
  });

  csvContent += "\n=== রত্নকুহক - কেনাকাটার হিসাব (Purchases) ===\n";
  csvContent += "তারিখ,দোকানের নাম,পণ্যের নাম,পিস,দর/পিস (৳),মোট ক্রয় (৳),নোট\n";
  purchases.forEach((p) => {
    csvContent += `"${p.date}","${p.shopName}","${p.productName}","${p.quantity}","${p.unitPrice}","${p.totalPrice}","${p.notes || ''}"\n`;
  });

  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", `ratnakuhuk_accounts_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
