import { Container } from "../../container/features/containerTypes";
import { Warehouse } from "../../warehouse/features/warehouseTypes";
import { Item } from "../../item/features/itemTypes";
import { Business } from "../../business/features/businessTypes";
import { Account } from "../../account/features/accountTypes";
import { Invoice } from "../../invoice/features/invoiceTypes";
import { Party } from "../../party/features/partyTypes";

export interface Stock {
  id?: number;
  business?: Business;
  container?: Container;
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
  toWarehouseId?: number | null;
  bankId?: number | null;
  quantity: number;

  unit?: string;
  invoiceRefNo?: string;
  stockRefNo?: string;
  containerId?: number | null;

  createdBy?: number;
  updatedBy?: number;
  createdByUser?: string;
  updatedByUser?: string;
}

export interface StockReport {
  warehouseId?: number | null;
  warehouse?: Warehouse;
  containerId: number;
  itemId: number;
  containerNo?: string;
  container: Container;
  unit?: string;
  itemName?: string;
  item: Item;
  totalIn: number;
  totalOut: number;
  totalDamaged: number;
  availableQty?: number;
}

export interface StockState {
  data: Stock[];
  report: StockReport[],
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}
