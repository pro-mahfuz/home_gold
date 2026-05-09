import { Warehouse } from "../../warehouse/features/warehouseTypes";
import { Item } from "../../item/features/itemTypes";
import { Business } from "../../business/features/businessTypes";
import { Account } from "../../account/features/accountTypes";
import { Invoice } from "../../invoice/features/invoiceTypes";
import { Party } from "../../party/features/partyTypes";

export interface Stock {
  id?: number;
  business?: Business;
  item?: Item;
  warehouse?: Warehouse;
  bank?: Account;
  invoice?: Invoice;
  party?: Party;

  businessId?: number;
  date: string;
  invoiceType?: string;
  invoiceId?: number;
  categoryId?: number;
  partyId?: number;
  itemId: number;
  movementType: string;
  warehouseId?: number | null;
  bankId?: number | null;
  quantity: number;

  unit?: string;
  invoiceRefNo?: string;
  stockRefNo?: string;

  createdBy?: number;
  updatedBy?: number;
  createdByUser?: string;
  updatedByUser?: string;
}

export interface StockReport {
  partyId?: number | null;
  party?: Party;
  warehouseId?: number | null;
  warehouse?: Warehouse;
  itemId: number;
  unit?: string;
  itemName?: string;
  item: Item;
  totalUnfixPurchase?: number;
  totalFixPurchase?: number;
  totalUnfixSale?: number;
  totalFixSale?: number;
  totalStockIn?: number;
  totalStockOut?: number;
  totalTransferOut?: number;
  totalTransferReturn?: number;
  totalIn: number;
  totalOut: number;
  totalDamaged: number;
  currentStock?: number;
  transferStock?: number;
  totalStock?: number;
  availableQty?: number;
}

export interface StockState {
  data: Stock[];
  report: StockReport[],
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}
