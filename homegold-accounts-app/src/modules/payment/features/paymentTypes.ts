
import { Category } from "../../category/features/categoryTypes";
import { Party } from "../../party/features/partyTypes";
import { Invoice } from "../../invoice/features/invoiceTypes";
import { Account } from "../../account/features/accountTypes";


export type OptionType = {
  label: string;
  value: string;
};

export const paymentOptions:  OptionType[] = [
    { value: "payment_in", label: "Payment (Received)" },
    { value: "payment_out", label: "Payment (Make)" },

    { value: "discount_sale", label: "Discount (Sale)" },
    { value: "discount_purchase", label: "Discount (Purchase)" },
    { value: "premium_received", label: "Premium (Received)" },
    { value: "premium_paid", label: "Premium (Paid)" },
    { value: "deposit", label: "Deposit" },
    { value: "withdraw", label: "Withdraw" },

    { value: "advance_received", label: "Advance Received" },
    { value: "advance_received_deduct", label: "Advance Received (Deduct)"},
    { value: "advance_payment", label: "Advance Payment" },
    { value: "advance_payment_deduct", label: "Advance Payment (Deduct)"},

    { value: "payable", label: "Payable" },
    { value: "receivable", label: "Receivable"},

    { value: "bill_out", label: "Bill Payment" },
    { value: "capital_in", label: "Capital In" },
    { value: "capital_out", label: "Capital Out"},
];

export const expenseOptions:  OptionType[] = [
  { value: "office_expense", label: "Expense" },
];

export  const paymentMethodOptions:  OptionType[] = [
    { value: "cash", label: "Cash" },
    { value: "bank", label: "Bank" },
];



export interface Payment {
  id?: number;   
  businessId?: number;        
  invoiceId?: number | null;
  categoryId?: number | null;
  invoiceRefId?: string;
  partyId?: number | null;
  paymentRefNo?: string;
  invoiceRefNo?: string;
  vatInvoiceRefNo?: string;
  paymentType: string;
  paymentDate: string;
  note?: string;
  amountPaid: number;
  bankId?: number | null;
  bank?: Account;
  paymentMethod?: string;
  paymentDetails?: string;
  currency: string;
  debit?: number;
  credit?: number;
  category?: Category;
  invoice?: Invoice;
  party?: Party;
  system: number;
  createdBy?: number;
  updatedBy?: number;
  createdByUser?: string;
  updatedByUser?: string;
}

export interface PaymentState {
  data: Payment[];
  dataPaginated: Payment[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  totalItems: number;
  totalPages: number;
  currentPage: number;
}
