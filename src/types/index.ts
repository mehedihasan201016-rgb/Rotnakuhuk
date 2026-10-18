export interface SaleItem {
  id: string;
  itemNumber: number;
  itemName: string;
  costPrice: number;
  sellingPrice: number;
  profit: number;
  loss: number;
  date: string;
  notes?: string;
}

export interface PurchaseItem {
  id: string;
  date: string;
  shopName: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  notes?: string;
}

export interface ShopSummary {
  shopName: string;
  totalPieces: number;
  totalCost: number;
  percentage: number;
  purchaseCount: number;
  hasNote?: string;
}

export interface KPIData {
  totalSales: number;
  totalPurchases: number;
  netProfit: number;
  totalPurchasedPieces: number;
  totalSoldPieces: number;
  currentStock: number;
  totalSoldCost: number;
  inventoryValue: number;
}
