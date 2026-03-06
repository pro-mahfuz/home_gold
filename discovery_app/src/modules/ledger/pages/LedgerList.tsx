import { useMemo, useState, useEffect, Fragment } from "react";

import {
  PaginationControl,
  SearchControl,
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableFooter,
  TableRow,
} from "../../../components/ui/table/index.tsx";
import PageBreadcrumb from "../../../components/common/PageBreadCrumb.tsx";
import PageMeta from "../../../components/common/PageMeta.tsx";

import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../../../store/store.ts";
import { fetchAll } from "../features/ledgerThunks.ts";
import { selectUser } from "../../auth/features/authSelectors.ts";
import { selectLedgerByPartyType, selectLedgerStatus } from "../features/ledgerSelectors.ts";
import { selectAllCategory } from "../../category/features/categorySelectors.ts";
import { fetchAllCategory } from "../../category/features/categoryThunks.ts";
import { selectPartyById } from "../../party/features/partySelectors.ts";
import { useParams } from "react-router";
// import { useNavigate } from "react-router-dom";


export default function LedgerList() {
  const { ledgerType, partyId } = useParams();
  
  // const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const [filterText, setFilterText] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const authUser = useSelector(selectUser);
  const categories = useSelector(selectAllCategory);

  const partyID = Number(partyId) ?? 0;
  const businessID = Number(authUser?.business?.id) ?? 0;

  const party = useSelector(selectPartyById(partyID));
  const status = useSelector(selectLedgerStatus);
  const ledgers = useSelector(selectLedgerByPartyType(businessID, String(ledgerType), partyID));
  

  useEffect(() => {
    dispatch(fetchAll());
    dispatch(fetchAllCategory());
  }, [dispatch]);

  // Filter users by name/email
  const filteredLedgers = useMemo(() => {
    return ledgers.filter((ledger) =>
      ledger.transactionType.toLowerCase().includes(filterText.toLowerCase()) ||
      String(ledger.invoiceId ?? ledger.paymentId).toLowerCase().includes(filterText.toLowerCase()) ||
      ledger.party?.name?.toLowerCase().includes(filterText.toLowerCase())
    );
  }, [ledgers, filterText]);


  // Compute cumulative balance for all ledgers
  const ledgersWithBalance = useMemo(() => {
    let cumulative = 0;
    return filteredLedgers.map((ledger) => {
      cumulative += Number(ledger.runningBalance ?? 0);
      return {
        ...ledger,
        cumulativeBalance: cumulative,
      };
    });
  }, [filteredLedgers]);

  // Pagination
  const totalPages = Math.ceil(ledgersWithBalance.length / itemsPerPage) || 1;
  const paginatedLedgers = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return ledgersWithBalance.slice(start, start + itemsPerPage);
  }, [ledgersWithBalance, currentPage, itemsPerPage]);

  type CurrencyTotals = {
    purchaseDebit: number;
    purchaseCredit: number;
    purchaseStockDebit: number;
    purchaseStockCredit: number;
    saleDebit: number;
    saleCredit: number;
    saleStockDebit: number;
    saleStockCredit: number;
    advanceDebit: number;
    advanceCredit: number;
    purchaseBalance: number;
    saleBalance: number;
    advanceBalance: number;
    purchaseStockBalance: number;
    saleStockBalance: number;
    closeBalance: number;
    purchageMargin: number;
    saleMargin: number;
  };

  const ledgerTotalsByCurrency = useMemo(() => {
    return ledgersWithBalance.reduce<Record<string, CurrencyTotals>>((totals, ledger) => {
      const currency = ledger.currency || ledger.invoice?.currency || 'UNKNOWN';
      const debit = Number(ledger.debit) || 0;
      const credit = Number(ledger.credit) || 0;
      const debitQty = Number(ledger.debitQty) || 0;
      const creditQty = Number(ledger.creditQty) || 0;

      if (!totals[currency]) {
        totals[currency] = {
          purchaseDebit: 0,
          purchaseCredit: 0,
          purchaseStockDebit: 0,
          purchaseStockCredit: 0,
          saleDebit: 0,
          saleCredit: 0,
          saleStockDebit: 0,
          saleStockCredit: 0,
          purchaseBalance: 0,
          saleBalance: 0,
          advanceDebit: 0,
          advanceCredit: 0,
          purchaseStockBalance: 0,
          saleStockBalance: 0,
          advanceBalance: 0,
          closeBalance: 0,
          purchageMargin: 0,
          saleMargin: 0,
        };
      }

      const current = totals[currency];

      if (
        ["purchase", "fix_purchase", "unfix_purchase", "wholesale_purchase","clearance_bill", "payment_out", "stock_in", "discount_purchase"].includes(ledger.transactionType)
      ) {
        current.purchaseDebit += debit;
        current.purchaseCredit += credit;
        current.purchaseStockDebit += debitQty;
        current.purchaseStockCredit += creditQty;
      }

      if (
        ["sale", "fix_sale", "unfix_sale", "wholesale_sale","payment_in", "stock_out", "discount_sale"].includes(ledger.transactionType)
      ) {
        current.saleDebit += debit;
        current.saleCredit += credit;
        current.saleStockDebit += debitQty;
        current.saleStockCredit += creditQty;
      }

      if (
        ["capital_in","advance_received", "advance_payment_deduct", "premium_received", "deposit"].includes(ledger.transactionType)
      ) {
        current.advanceCredit += credit;
      }

      if (
        ["capital_out", "advance_payment", "advance_received_deduct", "premium_paid", "withdraw"].includes(ledger.transactionType)
      ) {
        current.advanceDebit += debit;
      }

      current.purchaseBalance = current.purchaseCredit - current.purchaseDebit;
      current.purchaseStockBalance = current.purchaseStockDebit - current.purchaseStockCredit;
      current.saleBalance = current.saleCredit - current.saleDebit;
      current.saleStockBalance = current.saleStockDebit - current.saleStockCredit;
      current.advanceBalance = current.advanceCredit - current.advanceDebit;
      current.closeBalance = current.purchaseBalance + current.saleBalance;

      return totals;
    }, {});
  }, [ledgersWithBalance]);

  return (
    <>
      <PageMeta
        title={`${ledgerType ? ledgerType.charAt(0).toUpperCase() + ledgerType.slice(1).toLowerCase() : ''} Ledger`}
        description="Voucher & Ledger with Search, Sort, Pagination"
      />
      <PageBreadcrumb pageTitle={`${ledgerType ? ledgerType.charAt(0).toUpperCase() + ledgerType.slice(1).toLowerCase() : ''} Ledger`} />

      {party ? 
        <div>
          {/* Print Button */}
          <div className="flex justify-between print:hidden mb-2">
            <div className="flex">
              
            </div>
    
            <div>
              <button
              onClick={() => window.print()}
              className="bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700"
              >
              Print Report
              </button>
            </div>
          </div>

          <div id="print-section">

            <div className="space-y-6">
              <div className="rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03] p-3">
                <div className="space-y-1 mb-3 text-center font-semibold">
                  <h3>{party ? 'LEDGER' : ''}</h3>
                  {
                    party && (<h4>of</h4>)
                  }
                  
                  <h4>{party ? '' + party.name : ''}</h4>
                  <h4>{party && party.phoneNumber ? 'Phone: ' + party.phoneCode + party.phoneNumber : ''}</h4>
                </div>
                
                <div className="max-w-full overflow-x-hidden">
                  <Table>
                    <TableHeader className="border border-gray-500 dark:border-white/[0.05] bg-gray-200 text-black text-sm dark:bg-gray-800 dark:text-gray-400">
                      <TableRow>
                        <TableCell isHeader className="text-center px-2 py-2">{""}</TableCell>
                        <TableCell isHeader className="text-center px-2 py-2">{""}</TableCell>
                        <TableCell isHeader className="text-center px-2 py-2">{""}</TableCell>
                        <TableCell isHeader className="text-center px-2 py-2">{""}</TableCell>
                        <TableCell isHeader className="text-center px-2 py-2">{""}</TableCell>
                        <TableCell isHeader className="text-center px-2 py-2">{""}</TableCell>
                        <TableCell isHeader className="text-center px-2 py-2">{""}</TableCell>
                        <TableCell isHeader className="text-center px-2 py-2">{""}</TableCell>
                        
                        { (ledgerType === "purchase" || ledgerType === "all") && (
                          <>
                            <TableCell colSpan={2} className="border border-gray-500 text-center px-2 py-2 font-semibold">Purchase</TableCell>
                            {categories.find((c) => ["currency", "gold"].includes(c.name.toLowerCase())) && (
                              <TableCell colSpan={2} className="border border-gray-500 bg-gray-50 text-center px-2 py-2 font-semibold">Purchase Stock Money</TableCell>
                            )}
                          </>
                        )}

                        { (ledgerType === "sale" || ledgerType === "all") && (
                          <>
                            <TableCell colSpan={2} className="border border-gray-500 text-center px-2 py-2 font-semibold">Sale</TableCell>
                            {categories.find((c) => ["currency", "gold"].includes(c.name.toLowerCase())) && (
                              <TableCell colSpan={2} className="border border-gray-500 bg-gray-50 text-center px-2 py-2 font-semibold">Sale Stock Money</TableCell>
                            )}
                          </>
                        )}
                        {categories.find((c) => ["currency", "gold"].includes(c.name.toLowerCase())) && (
                          <TableCell colSpan={2} className="border border-gray-500 bg-gray-50 text-center px-2 py-2 font-semibold">Advance</TableCell>
                        )}

                        <TableCell className="border border-gray-500 bg-gray-50 text-center px-2 py-2 font-semibold">{""}</TableCell>

                        {/* <TableCell isHeader className="text-center px-2 py-2">{""}</TableCell>
                        <TableCell isHeader className="text-center px-2 py-2">{""}</TableCell> */}
                      </TableRow>

                      <TableRow>
                        <TableCell isHeader className="text-center px-2 py-2">Sl</TableCell>
                        <TableCell isHeader className="text-center px-2 py-2">Transaction</TableCell>
                        <TableCell isHeader className="text-center px-2 py-2">Reference</TableCell>
                        <TableCell isHeader className="text-center px-2 py-2">Date</TableCell>
                        <TableCell isHeader className="text-center px-2 py-2">Party Name</TableCell>
                        <TableCell isHeader className="text-center px-2 py-2">Description</TableCell>
                        
                        <TableCell isHeader className="text-center px-2 py-2">Account</TableCell>
                        <TableCell isHeader className="text-center px-2 py-2">Currency</TableCell>

                        { (ledgerType === "purchase" || ledgerType === "all") && (
                          <>
                            <TableCell colSpan={1} className="border border-gray-500 text-center px-2 py-2 font-semibold">Debit</TableCell>
                            <TableCell colSpan={1} className="border border-gray-500 text-center px-2 py-2 font-semibold">Credit</TableCell>
                            
                            {categories.find((c) => ["currency", "gold"].includes(c.name.toLowerCase())) && (
                              <>
                              <TableCell colSpan={1} className="border border-gray-500 bg-gray-50 text-center px-2 py-2 font-semibold">Debit</TableCell>
                              <TableCell colSpan={1} className="border border-gray-500 bg-gray-50 text-center px-2 py-2 font-semibold">Credit</TableCell>
                              </>
                            )}
                          </>
                        )}

                        { (ledgerType === "sale" || ledgerType === "all") && (
                          <>
                            <TableCell colSpan={1} className="border border-gray-500 text-center px-2 py-2 font-semibold">Debit</TableCell>
                            <TableCell colSpan={1} className="border border-gray-500 text-center px-2 py-2 font-semibold">Credit</TableCell>

                            {categories.find((c) => ["currency", "gold"].includes(c.name.toLowerCase())) && (
                              <>
                              <TableCell colSpan={1} className="border border-gray-500 bg-gray-50 text-center px-2 py-2 font-semibold">Debit</TableCell>
                              <TableCell colSpan={1} className="border border-gray-500 bg-gray-50 text-center px-2 py-2 font-semibold">Credit</TableCell>
                              </>
                            )}
                          </>
                        )}
                        {categories.find((c) => ["currency", "gold"].includes(c.name.toLowerCase())) && (
                          <>
                            <TableCell colSpan={1} className="border border-gray-500 bg-gray-200 text-center px-2 py-2 font-semibold">Debit</TableCell>
                            <TableCell colSpan={1} className="border border-gray-500 bg-gray-200 text-center px-2 py-2 font-semibold">Credit</TableCell>
                          </>
                        )}

                        <TableCell className="border border-gray-500 bg-gray-50 text-center px-2 py-2 font-semibold">Balance</TableCell>

                        {/* <TableCell isHeader className="text-center px-2 py-2">Created</TableCell>
                        <TableCell isHeader className="text-center px-2 py-2">Updated</TableCell> */}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {status === 'loading' ? (
                        <TableRow>
                          <TableCell colSpan={12} className="text-center py-4 text-gray-500 dark:text-gray-300">
                            Loading data...
                          </TableCell>
                        </TableRow>
                      ) : paginatedLedgers.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={12} className="text-center py-4 text-gray-500 dark:text-gray-300">
                            No data found.
                          </TableCell>
                        </TableRow>
                      ) : (
                        paginatedLedgers.map((ledger, index) => (
                          <TableRow key={`primary-${ledger.id}`} className="border-b border-gray-100 dark:border-white/[0.05]">
                            <TableCell className="text-center px-2 py-2 text-sm text-gray-500 dark:text-gray-400">
                              {index + 1}
                            </TableCell>

                            <TableCell className="text-center px-2 py-2 text-sm text-gray-500 dark:text-gray-400">
                              {ledger.transactionType}
                            </TableCell>

                            <TableCell className="text-center px-2 py-2 text-sm text-gray-500 dark:text-gray-400">
                              {ledger.paymentId === null && ledger.stockId === null ? ledger.invoiceRefNo : ""}
                              {ledger.paymentRefNo}
                              {ledger.stockRefNo}
                              {ledger.paymentId !== null && ledger?.payment?.invoice && (
                                <>
                                  <br />
                                  <span className="text-xs">
                                    {`${ledger.payment.invoice.prefix ?? ""}-${String(ledger.payment.invoiceId ?? 0).padStart(6, "0")}`}
                                  </span>
                                </>
                              )}
                              {ledger.stockId !== null && ledger?.stock?.invoice && (
                                <>
                                  <br />
                                  <span className="text-xs">{`${ledger.stock.invoice.prefix ?? ""} - ${String(ledger.stock.invoiceId ?? 0).padStart(6, '0')}`}</span>
                                </>
                              )}
                            </TableCell>

                            <TableCell className="text-center px-2 py-2 text-sm text-gray-500 dark:text-gray-400">
                              {ledger.date}
                            </TableCell>

                            <TableCell className="text-center px-2 py-2 text-sm text-gray-500 dark:text-gray-400">
                              {ledger.party?.name}
                            </TableCell>

                            <TableCell className="text-center px-2 py-2 text-sm text-gray-500 dark:text-gray-400">
                              <div>
                                {(ledger.transactionType === "purchase" || ledger.transactionType === "sale" || ledger.transactionType === "clearance_bill") && ledger.description ? (
                                  ledger.description.split('<br />').map((line, idx) => (
                                    <Fragment key={`${line}-${idx}`}>
                                      {line}
                                      <br />
                                    </Fragment>
                                  ))
                                ) : ledger.description || ''
                                }
                              </div>
                            </TableCell>
                            
                            <TableCell className="text-center py-2 text-sm text-gray-500 dark:text-gray-400">
                              {ledger.bank?.accountName ?? "---"}
                            </TableCell>

                            <TableCell className="text-center py-2 text-sm text-gray-500 dark:text-gray-400">
                              {ledger.currency ?? "---"}
                            </TableCell>

                            { (ledgerType === "purchase" || ledgerType === "all") && (
                              <>
                                <TableCell className="border border-gray-300 bg-gray-200 text-center px-2 py-2">
                                  { 
                                    ledger.transactionType === "purchase" || 
                                    ledger.transactionType === "clearance_bill" || 
                                    ledger.transactionType === "wholesale_purchase" || 
                                    ledger.transactionType === "fix_purchase" || 
                                    ledger.transactionType === "unfix_purchase" || 
                                    ledger.transactionType === "payment_out" || 
                                    ledger.transactionType === "discount_purchase" 
                                    ? ledger.debit > 0 ? ledger.debit : "-" : "-" 
                                  }
                                </TableCell>
                                <TableCell className="border border-gray-300 bg-gray-200 text-center px-2 py-2">
                                  { 
                                    ledger.transactionType === "purchase" || 
                                    ledger.transactionType === "clearance_bill" || 
                                    ledger.transactionType === "wholesale_purchase" || 
                                    ledger.transactionType === "fix_purchase" || 
                                    ledger.transactionType === "unfix_purchase" || 
                                    ledger.transactionType === "discount_purchase" 
                                    ? ledger.credit > 0 ? ledger.credit : "-" : "-" 
                                  }
                                </TableCell>
                                
                                {categories.find((c) => ["currency", "gold"].includes(c.name.toLowerCase())) && (
                                  <>
                                    <TableCell className="border border-gray-300 bg-gray-50 text-center px-2 py-2">
                                      { 
                                        ledger.transactionType === "purchase" || 
                                        ledger.transactionType === "clearance_bill" || 
                                        ledger.transactionType === "wholesale_purchase" || 
                                        ledger.transactionType === "fix_purchase" || 
                                        ledger.transactionType === "unfix_purchase" || 
                                        ledger.transactionType === "stock_in" 
                                        ? ledger.debitQty > 0 ? ledger.debitQty : "-" : "-" 
                                      }
                                    </TableCell>
                                    <TableCell className="border border-gray-300 bg-gray-50 text-center px-2 py-2">
                                      { 
                                        ledger.transactionType === "purchase" || 
                                        ledger.transactionType === "clearance_bill" || 
                                        ledger.transactionType === "wholesale_purchase" || 
                                        ledger.transactionType === "fix_purchase" || 
                                        ledger.transactionType === "unfix_purchase" || 
                                        ledger.transactionType === "stock_in" 
                                        ? ledger.creditQty > 0 ? ledger.creditQty : "-" : "-" 
                                      }
                                    </TableCell>
                                  </>
                                )}
                              </>
                            )}
                            
                            
                            { (ledgerType === "sale" || ledgerType === "all") && (
                              <>
                                <TableCell className="border border-gray-300 bg-gray-200 text-center px-2 py-2">
                                  { 
                                    ledger.transactionType === "sale" || 
                                    ledger.transactionType === "wholesale_sale" || 
                                    ledger.transactionType === "fix_sale" || 
                                    ledger.transactionType === "unfix_sale" || 
                                    ledger.transactionType === "discount_sale" 
                                    ? ledger.debit > 0 ? ledger.debit : "-" : "-" 
                                  }
                                </TableCell>
                                <TableCell className="border border-gray-300 bg-gray-200 text-center px-2 py-2">
                                  { 
                                    ledger.transactionType === "sale" || 
                                    ledger.transactionType === "wholesale_sale" || 
                                    ledger.transactionType === "fix_sale" || 
                                    ledger.transactionType === "unfix_sale" || 
                                    ledger.transactionType === "payment_in" || 
                                    ledger.transactionType === "discount_sale" 
                                    ? ledger.credit > 0 ? ledger.credit : "-" : "-" 
                                  }
                                </TableCell>
                                
                                {categories.find((c) => ["currency", "gold"].includes(c.name.toLowerCase())) && (
                                  <>
                                  <TableCell className="border border-gray-300 bg-gray-50 text-center px-2 py-2">
                                    { 
                                      ledger.transactionType === "sale" || 
                                      ledger.transactionType === "wholesale_sale" || 
                                      ledger.transactionType === "fix_sale" || 
                                      ledger.transactionType === "unfix_sale" || 
                                      ledger.transactionType === "stock_out" 
                                      ? ledger.debitQty > 0 ? ledger.debitQty : "-" : "-" 
                                    }
                                  </TableCell>
                                  <TableCell className="border border-gray-300 bg-gray-50 text-center px-2 py-2">
                                    { 
                                      ledger.transactionType === "sale" || 
                                      ledger.transactionType === "wholesale_sale" || 
                                      ledger.transactionType === "fix_sale" || 
                                      ledger.transactionType === "unfix_sale" || 
                                      ledger.transactionType === "stock_out" 
                                      ? ledger.creditQty > 0 ? ledger.creditQty : "-" : "-" 
                                    }
                                  </TableCell>
                                  </>
                                )}
                              </>
                            )}

                            {categories.find((c) => ["currency", "gold"].includes(c.name.toLowerCase())) && (
                              <>
                              <TableCell className="border border-gray-300 bg-gray-200 text-center px-2 py-2">
                                { 
                                  ledger.transactionType === "capital_out" || 
                                  ledger.transactionType === "advance_payment" || 
                                  ledger.transactionType === "advance_received_deduct" ||
                                  ledger.transactionType === "withdraw" ||
                                  ledger.transactionType === "premium_paid"
                                  ? ledger.debit > 0 ? ledger.debit : "-" : "-" 
                                }
                              </TableCell>
                              <TableCell className="border border-gray-300 bg-gray-200 text-center px-2 py-2">
                                { 
                                  ledger.transactionType === "capital_in" || 
                                  ledger.transactionType === "advance_received" || 
                                  ledger.transactionType === "advance_payment_deduct" ||
                                  ledger.transactionType === "deposit" ||
                                  ledger.transactionType === "premium_received"
                                  ? ledger.credit > 0 ? ledger.credit : "-" : "-" 
                                }
                              </TableCell>
                              </>
                            )}

                            <TableCell className="border border-gray-300 text-center px-2 py-2">
                              {ledger.cumulativeBalance.toFixed(2)}
                            </TableCell>
                            
                          </TableRow>
                        ))
                      )}
                    </TableBody>

                    <TableFooter className="border-separate border-spacing-y-2 text-black text-sm dark:bg-gray-800 mt-4">
                      {Object.entries(ledgerTotalsByCurrency).map(([currency, totals]) => (
                        <Fragment key={currency}>
                          <TableRow>
                            <TableCell className="text-center px-2 py-2">{""}</TableCell>
                          </TableRow>

                          <TableRow>
                            <TableCell isHeader className="text-center px-2 py-2">{""}</TableCell>
                            <TableCell isHeader className="text-center px-2 py-2">{""}</TableCell>
                            <TableCell isHeader className="text-center px-2 py-2">{""}</TableCell>
                            <TableCell isHeader className="text-center px-2 py-2">{""}</TableCell>
                            <TableCell isHeader className="text-center px-2 py-2">{""}</TableCell>
                            <TableCell isHeader className="text-center px-2 py-2">{""}</TableCell>
                            
                            <TableCell isHeader className="text-center px-2 py-2">{currency}</TableCell>
                              
                            <TableCell className="border border-gray-500 text-center">
                              Total:
                            </TableCell>
                            
                                  
                            {(ledgerType === "purchase" || ledgerType === "all") && (
                              <>
                              <TableCell className="border border-gray-500 bg-gray-200 text-center px-2 py-2">{totals.purchaseDebit.toFixed(2)}</TableCell>
                              <TableCell className="border border-gray-500 bg-gray-200 text-center border-l border-gray-500 text-center px-2 py-2">{totals.purchaseCredit.toFixed(2)}</TableCell>
                              {categories.find((c) => ["currency", "gold"].includes(c.name.toLowerCase())) && (
                                <>
                                <TableCell className="border border-gray-500 bg-gray-50 text-center px-2 py-2">{totals.purchaseStockDebit.toFixed(2)}</TableCell>
                                <TableCell className="border border-gray-500 bg-gray-50 text-center border-l border-gray-500 text-center px-2 py-2">{totals.purchaseStockCredit.toFixed(2)}</TableCell>
                                </>
                              )}
                              </>
                            )}

                            {(ledgerType === "sale" || ledgerType === "all") && (
                              <>
                              <TableCell className="border border-gray-500 bg-gray-200 text-center px-2 py-2">{totals.saleDebit.toFixed(2)}</TableCell>
                              <TableCell className="border border-gray-500 bg-gray-200 text-center border-l border-gray-500 text-center px-2 py-2">{totals.saleCredit.toFixed(2)}</TableCell>
                              {categories.find((c) => ["currency", "gold"].includes(c.name.toLowerCase())) && (
                                <>
                                <TableCell className="border border-gray-500 bg-gray-50 text-center px-2 py-2">{totals.saleStockDebit.toFixed(2)}</TableCell>
                                <TableCell className="border border-gray-500 bg-gray-50 text-center border-l border-gray-500 text-center px-2 py-2">{totals.saleStockCredit.toFixed(2)}</TableCell>
                                </>
                              )}
                              </>
                            )}
                            
                            
                            {categories.find((c) => ["currency", "gold"].includes(c.name.toLowerCase())) && (
                              <>
                                <TableCell className="border border-gray-500 bg-gray-200 text-center px-2 py-2">{totals.advanceDebit.toFixed(2)}</TableCell>
                                <TableCell className="border border-gray-500 bg-gray-200 text-center border-l border-gray-500 text-center px-2 py-2">{totals.advanceCredit.toFixed(2)}</TableCell>
                              </>
                            )}

                            <TableCell className="border border-gray-500 text-center border-l border-gray-500 text-center px-2 py-2">{totals.closeBalance.toFixed(2)}</TableCell>
                          </TableRow>

                          <TableRow>
                            <TableCell isHeader colSpan={7} className="text-center px-2 py-2">{""}</TableCell>
                            <TableCell className="border border-gray-500 text-center">Balance:</TableCell>

                            {(ledgerType === "purchase" || ledgerType === "all") && (
                              <>
                              <TableCell colSpan={2} className={`border border-gray-500 bg-gray-200 text-center px-2 py-2 font-semibold ${totals.purchaseBalance > 0 ? "text-green-700" : totals.purchaseBalance < 0 ? "text-red-600" : ""}`}>{totals.purchaseBalance.toFixed(2)}</TableCell>
                              {categories.find((c) => ["currency", "gold"].includes(c.name.toLowerCase())) && (
                                <>
                                <TableCell colSpan={2} className={`border border-gray-500 bg-gray-200 text-center px-2 py-2 font-semibold ${totals.purchaseStockBalance < 0 ? "text-red-600" : totals.purchaseStockBalance > 0 ? "text-green-700" : ""}`}>{totals.purchaseStockBalance.toFixed(2)}</TableCell>
                                </>
                              )}
                              </>
                            )}
                            
                            {(ledgerType === "sale" || ledgerType === "all") && (
                              <>
                              <TableCell colSpan={2} className={`border border-gray-500 bg-gray-200 text-center px-2 py-2 font-semibold ${totals.saleBalance < 0 ? "text-red-600" : totals.saleBalance > 0 ? "text-green-700" : ""}`}>{totals.saleBalance.toFixed(2)}</TableCell>
                              {categories.find((c) => ["currency", "gold"].includes(c.name.toLowerCase())) && (
                                <>
                                <TableCell colSpan={2} className={`border border-gray-500 bg-gray-200 text-center px-2 py-2 font-semibold ${totals.saleStockBalance > 0 ? "text-green-700" : totals.saleStockBalance < 0 ? "text-red-600" : ""}`}>{totals.saleStockBalance.toFixed(2)}</TableCell>
                                </>
                              )}
                              </>
                            )}
                            

                            {categories.find((c) => ["currency", "gold"].includes(c.name.toLowerCase())) && (
                              <TableCell colSpan={2} className={`border border-gray-500 bg-gray-200 text-center px-2 py-2 font-semibold ${totals.advanceBalance < 0 ? "text-red-600" : totals.advanceBalance > 0 ? "text-green-700" : ""}`}>{totals.advanceBalance.toFixed(2)}</TableCell>
                            )}

                            <TableCell colSpan={2} className={`border border-gray-500 text-center px-2 py-2 font-semibold ${totals.closeBalance < 0 ? "text-red-600" : totals.closeBalance > 0 ? "text-green-700" : ""}`}>{totals.closeBalance.toFixed(2)}</TableCell>
                          </TableRow>
                        </Fragment>
                      ))}  
                    </TableFooter>
                  
                  </Table>
                
                </div>
              </div>
            </div>
          </div>
        </div>
      :
        <div>
          <div className="space-y-6">
            <div className="rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03] p-3">
              {/* Search Input */}
              <SearchControl value={filterText} onChange={setFilterText} />
              
              <div className="max-w-full overflow-x-hidden">
                <Table>
                  <TableHeader className="border border-gray-500 dark:border-white/[0.05] bg-gray-200 text-black text-sm dark:bg-gray-800 dark:text-gray-400">
                    <TableRow>
                      <TableCell isHeader className="text-center px-2 py-2">{""}</TableCell>
                      <TableCell isHeader className="text-center px-2 py-2">{""}</TableCell>
                      <TableCell isHeader className="text-center px-2 py-2">{""}</TableCell>
                      <TableCell isHeader className="text-center px-2 py-2">{""}</TableCell>
                      <TableCell isHeader className="text-center px-2 py-2">{""}</TableCell>
                      <TableCell isHeader className="text-center px-2 py-2">{""}</TableCell>
                      <TableCell isHeader className="text-center px-2 py-2">{""}</TableCell>
                      <TableCell isHeader className="text-center px-2 py-2">{""}</TableCell>
                      
                      { (ledgerType === "purchase" || ledgerType === "all") && (
                        <>
                          <TableCell colSpan={2} className="border border-gray-500 text-center px-2 py-2 font-semibold">Purchase</TableCell>
                          {categories.find((c) => ["currency", "gold"].includes(c.name.toLowerCase())) && (
                            <TableCell colSpan={2} className="border border-gray-500 bg-gray-50 text-center px-2 py-2 font-semibold">Purchase Stock Money</TableCell>
                          )}
                        </>
                      )}

                      { (ledgerType === "sale" || ledgerType === "all") && (
                        <>
                          <TableCell colSpan={2} className="border border-gray-500 text-center px-2 py-2 font-semibold">Sale</TableCell>
                          {categories.find((c) => ["currency", "gold"].includes(c.name.toLowerCase())) && (
                            <TableCell colSpan={2} className="border border-gray-500 bg-gray-50 text-center px-2 py-2 font-semibold">Sale Stock Money</TableCell>
                          )}
                        </>
                      )}
                      {categories.find((c) => ["currency", "gold"].includes(c.name.toLowerCase())) && (
                        <TableCell colSpan={2} className="border border-gray-500 bg-gray-50 text-center px-2 py-2 font-semibold">Advance</TableCell>
                      )}

                      <TableCell className="border border-gray-500 bg-gray-50 text-center px-2 py-2 font-semibold">{""}</TableCell>

                      {/* <TableCell isHeader className="text-center px-2 py-2">{""}</TableCell>
                      <TableCell isHeader className="text-center px-2 py-2">{""}</TableCell> */}
                    </TableRow>

                    <TableRow>
                      <TableCell isHeader className="text-center px-2 py-2">Sl</TableCell>
                      <TableCell isHeader className="text-center px-2 py-2">Transaction</TableCell>
                      <TableCell isHeader className="text-center px-2 py-2">Reference</TableCell>
                      <TableCell isHeader className="text-center px-2 py-2">Date</TableCell>
                      <TableCell isHeader className="text-center px-2 py-2">Party Name</TableCell>
                      <TableCell isHeader className="text-center px-2 py-2">Description</TableCell>
                      
                      <TableCell isHeader className="text-center px-2 py-2">Account</TableCell>
                      <TableCell isHeader className="text-center px-2 py-2">Currency</TableCell>

                      { (ledgerType === "purchase" || ledgerType === "all") && (
                        <>
                          <TableCell colSpan={1} className="border border-gray-500 text-center px-2 py-2 font-semibold">Debit</TableCell>
                          <TableCell colSpan={1} className="border border-gray-500 text-center px-2 py-2 font-semibold">Credit</TableCell>
                          
                          {categories.find((c) => ["currency", "gold"].includes(c.name.toLowerCase())) && (
                            <>
                            <TableCell colSpan={1} className="border border-gray-500 bg-gray-50 text-center px-2 py-2 font-semibold">Debit</TableCell>
                            <TableCell colSpan={1} className="border border-gray-500 bg-gray-50 text-center px-2 py-2 font-semibold">Credit</TableCell>
                            </>
                          )}
                        </>
                      )}

                      { (ledgerType === "sale" || ledgerType === "all") && (
                        <>
                          <TableCell colSpan={1} className="border border-gray-500 text-center px-2 py-2 font-semibold">Debit</TableCell>
                          <TableCell colSpan={1} className="border border-gray-500 text-center px-2 py-2 font-semibold">Credit</TableCell>

                          {categories.find((c) => ["currency", "gold"].includes(c.name.toLowerCase())) && (
                            <>
                            <TableCell colSpan={1} className="border border-gray-500 bg-gray-50 text-center px-2 py-2 font-semibold">Debit</TableCell>
                            <TableCell colSpan={1} className="border border-gray-500 bg-gray-50 text-center px-2 py-2 font-semibold">Credit</TableCell>
                            </>
                          )}
                        </>
                      )}
                      {categories.find((c) => ["currency", "gold"].includes(c.name.toLowerCase())) && (
                        <>
                          <TableCell colSpan={1} className="border border-gray-500 bg-gray-200 text-center px-2 py-2 font-semibold">Debit</TableCell>
                          <TableCell colSpan={1} className="border border-gray-500 bg-gray-200 text-center px-2 py-2 font-semibold">Credit</TableCell>
                        </>
                      )}

                      <TableCell className="border border-gray-500 bg-gray-50 text-center px-2 py-2 font-semibold">Balance</TableCell>

                      {/* <TableCell isHeader className="text-center px-2 py-2">Created</TableCell>
                      <TableCell isHeader className="text-center px-2 py-2">Updated</TableCell> */}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {status === 'loading' ? (
                      <TableRow>
                        <TableCell colSpan={12} className="text-center py-4 text-gray-500 dark:text-gray-300">
                          Loading data...
                        </TableCell>
                      </TableRow>
                    ) : paginatedLedgers.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={12} className="text-center py-4 text-gray-500 dark:text-gray-300">
                          No data found.
                        </TableCell>
                      </TableRow>
                    ) : (
                      paginatedLedgers.map((ledger, index) => (
                        <TableRow key={`primary-${ledger.id}`} className="border-b border-gray-100 dark:border-white/[0.05]">
                          <TableCell className="text-center px-2 py-2 text-sm text-gray-500 dark:text-gray-400">
                            {index + 1}
                          </TableCell>

                          <TableCell className="text-center px-2 py-2 text-sm text-gray-500 dark:text-gray-400">
                            {ledger.transactionType}
                          </TableCell>

                          <TableCell className="text-center px-2 py-2 text-sm text-gray-500 dark:text-gray-400">
                            {ledger.paymentId === null && ledger.stockId === null ? ledger.invoiceRefNo : ""}
                            {ledger.paymentRefNo}
                            {ledger.stockRefNo}
                            {ledger.paymentId !== null && ledger?.payment?.invoice && (
                              <>
                                <br />
                                <span className="text-xs">
                                  {`${ledger.payment.invoice.prefix ?? ""}-${String(ledger.payment.invoiceId ?? 0).padStart(6, "0")}`}
                                </span>
                              </>
                            )}
                            {ledger.stockId !== null && ledger?.stock?.invoice && (
                              <>
                                <br />
                                <span className="text-xs">{`${ledger.stock.invoice.prefix ?? ""} - ${String(ledger.stock.invoiceId ?? 0).padStart(6, '0')}`}</span>
                              </>
                            )}
                          </TableCell>

                          <TableCell className="text-center px-2 py-2 text-sm text-gray-500 dark:text-gray-400">
                            {ledger.date}
                          </TableCell>

                          <TableCell className="text-center px-2 py-2 text-sm text-gray-500 dark:text-gray-400">
                            {ledger.party?.name}
                          </TableCell>

                          <TableCell className="text-center px-2 py-2 text-sm text-gray-500 dark:text-gray-400">
                            <div>
                              {(ledger.transactionType === "purchase" || ledger.transactionType === "sale" || ledger.transactionType === "clearance_bill") && ledger.description ? (
                                ledger.description.split('<br />').map((line, idx) => (
                                  <Fragment key={`${line}-${idx}`}>
                                    {line}
                                    <br />
                                  </Fragment>
                                ))
                              ) : ledger.description || ''
                              }
                            </div>
                          </TableCell>
                          
                          <TableCell className="text-center py-2 text-sm text-gray-500 dark:text-gray-400">
                            {ledger.bank?.accountName ?? "---"}
                          </TableCell>

                          <TableCell className="text-center py-2 text-sm text-gray-500 dark:text-gray-400">
                            {ledger.currency ?? "---"}
                          </TableCell>

                          { (ledgerType === "purchase" || ledgerType === "all") && (
                            <>
                              <TableCell className="border border-gray-300 bg-gray-200 text-center px-2 py-2">
                                { 
                                  ledger.transactionType === "purchase" || 
                                  ledger.transactionType === "clearance_bill" || 
                                  ledger.transactionType === "wholesale_purchase" || 
                                  ledger.transactionType === "fix_purchase" || 
                                  ledger.transactionType === "unfix_purchase" || 
                                  ledger.transactionType === "payment_out" || 
                                  ledger.transactionType === "discount_purchase" 
                                  ? ledger.debit > 0 ? ledger.debit : "-" : "-" 
                                }
                              </TableCell>
                              <TableCell className="border border-gray-300 bg-gray-200 text-center px-2 py-2">
                                { 
                                  ledger.transactionType === "purchase" || 
                                  ledger.transactionType === "clearance_bill" || 
                                  ledger.transactionType === "wholesale_purchase" || 
                                  ledger.transactionType === "fix_purchase" || 
                                  ledger.transactionType === "unfix_purchase" || 
                                  ledger.transactionType === "discount_purchase" 
                                  ? ledger.credit > 0 ? ledger.credit : "-" : "-" 
                                }
                              </TableCell>
                              
                              {categories.find((c) => ["currency", "gold"].includes(c.name.toLowerCase())) && (
                                <>
                                  <TableCell className="border border-gray-300 bg-gray-50 text-center px-2 py-2">
                                    { 
                                      ledger.transactionType === "purchase" || 
                                      ledger.transactionType === "clearance_bill" || 
                                      ledger.transactionType === "wholesale_purchase" || 
                                      ledger.transactionType === "fix_purchase" || 
                                      ledger.transactionType === "unfix_purchase" || 
                                      ledger.transactionType === "stock_in" 
                                      ? ledger.debitQty > 0 ? ledger.debitQty : "-" : "-" 
                                    }
                                  </TableCell>
                                  <TableCell className="border border-gray-300 bg-gray-50 text-center px-2 py-2">
                                    { 
                                      ledger.transactionType === "purchase" || 
                                      ledger.transactionType === "clearance_bill" || 
                                      ledger.transactionType === "wholesale_purchase" || 
                                      ledger.transactionType === "fix_purchase" || 
                                      ledger.transactionType === "unfix_purchase" || 
                                      ledger.transactionType === "stock_in" 
                                      ? ledger.creditQty > 0 ? ledger.creditQty : "-" : "-" 
                                    }
                                  </TableCell>
                                </>
                              )}
                            </>
                          )}
                          
                          
                          { (ledgerType === "sale" || ledgerType === "all") && (
                            <>
                              <TableCell className="border border-gray-300 bg-gray-200 text-center px-2 py-2">
                                { 
                                  ledger.transactionType === "sale" || 
                                  ledger.transactionType === "wholesale_sale" || 
                                  ledger.transactionType === "fix_sale" || 
                                  ledger.transactionType === "unfix_sale" || 
                                  ledger.transactionType === "discount_sale" 
                                  ? ledger.debit > 0 ? ledger.debit : "-" : "-" 
                                }
                              </TableCell>
                              <TableCell className="border border-gray-300 bg-gray-200 text-center px-2 py-2">
                                { 
                                  ledger.transactionType === "sale" || 
                                  ledger.transactionType === "wholesale_sale" || 
                                  ledger.transactionType === "fix_sale" || 
                                  ledger.transactionType === "unfix_sale" || 
                                  ledger.transactionType === "payment_in" || 
                                  ledger.transactionType === "discount_sale" 
                                  ? ledger.credit > 0 ? ledger.credit : "-" : "-" 
                                }
                              </TableCell>
                              
                              {categories.find((c) => ["currency", "gold"].includes(c.name.toLowerCase())) && (
                                <>
                                <TableCell className="border border-gray-300 bg-gray-50 text-center px-2 py-2">
                                  { 
                                    ledger.transactionType === "sale" || 
                                    ledger.transactionType === "wholesale_sale" || 
                                    ledger.transactionType === "fix_sale" || 
                                    ledger.transactionType === "unfix_sale" || 
                                    ledger.transactionType === "stock_out" 
                                    ? ledger.debitQty > 0 ? ledger.debitQty : "-" : "-" 
                                  }
                                </TableCell>
                                <TableCell className="border border-gray-300 bg-gray-50 text-center px-2 py-2">
                                  { 
                                    ledger.transactionType === "sale" || 
                                    ledger.transactionType === "wholesale_sale" || 
                                    ledger.transactionType === "fix_sale" || 
                                    ledger.transactionType === "unfix_sale" || 
                                    ledger.transactionType === "stock_out" 
                                    ? ledger.creditQty > 0 ? ledger.creditQty : "-" : "-" 
                                  }
                                </TableCell>
                                </>
                              )}
                            </>
                          )}

                          {categories.find((c) => ["currency", "gold"].includes(c.name.toLowerCase())) && (
                            <>
                            <TableCell className="border border-gray-300 bg-gray-200 text-center px-2 py-2">
                              { 
                                ledger.transactionType === "capital_out" || 
                                ledger.transactionType === "advance_payment" || 
                                ledger.transactionType === "advance_received_deduct" ||
                                ledger.transactionType === "withdraw" ||
                                ledger.transactionType === "premium_paid"
                                ? ledger.debit > 0 ? ledger.debit : "-" : "-" 
                              }
                            </TableCell>
                            <TableCell className="border border-gray-300 bg-gray-200 text-center px-2 py-2">
                              { 
                                ledger.transactionType === "capital_in" || 
                                ledger.transactionType === "advance_received" || 
                                ledger.transactionType === "advance_payment_deduct" ||
                                ledger.transactionType === "deposit" ||
                                ledger.transactionType === "premium_received"
                                ? ledger.credit > 0 ? ledger.credit : "-" : "-" 
                              }
                            </TableCell>
                            </>
                          )}

                          <TableCell className="border border-gray-300 text-center px-2 py-2">
                            {ledger.cumulativeBalance.toFixed(2)}
                          </TableCell>
                          
                        </TableRow>
                      ))
                    )}
                  </TableBody>

                  <TableFooter className="border-separate border-spacing-y-2 text-black text-sm dark:bg-gray-800 mt-4">
                    {Object.entries(ledgerTotalsByCurrency).map(([currency, totals]) => (
                      <Fragment key={currency}>
                        <TableRow>
                          <TableCell className="text-center px-2 py-2">{""}</TableCell>
                        </TableRow>

                        <TableRow>
                          <TableCell isHeader className="text-center px-2 py-2">{""}</TableCell>
                          <TableCell isHeader className="text-center px-2 py-2">{""}</TableCell>
                          <TableCell isHeader className="text-center px-2 py-2">{""}</TableCell>
                          <TableCell isHeader className="text-center px-2 py-2">{""}</TableCell>
                          <TableCell isHeader className="text-center px-2 py-2">{""}</TableCell>
                          <TableCell isHeader className="text-center px-2 py-2">{""}</TableCell>
                          
                          <TableCell isHeader className="text-center px-2 py-2">{currency}</TableCell>
                            
                          <TableCell className="border border-gray-500 text-center">
                            Total:
                          </TableCell>
                          
                                
                          {(ledgerType === "purchase" || ledgerType === "all") && (
                            <>
                            <TableCell className="border border-gray-500 bg-gray-200 text-center px-2 py-2">{totals.purchaseDebit.toFixed(2)}</TableCell>
                            <TableCell className="border border-gray-500 bg-gray-200 text-center border-l border-gray-500 text-center px-2 py-2">{totals.purchaseCredit.toFixed(2)}</TableCell>
                            {categories.find((c) => ["currency", "gold"].includes(c.name.toLowerCase())) && (
                              <>
                              <TableCell className="border border-gray-500 bg-gray-50 text-center px-2 py-2">{totals.purchaseStockDebit.toFixed(2)}</TableCell>
                              <TableCell className="border border-gray-500 bg-gray-50 text-center border-l border-gray-500 text-center px-2 py-2">{totals.purchaseStockCredit.toFixed(2)}</TableCell>
                              </>
                            )}
                            </>
                          )}

                          {(ledgerType === "sale" || ledgerType === "all") && (
                            <>
                            <TableCell className="border border-gray-500 bg-gray-200 text-center px-2 py-2">{totals.saleDebit.toFixed(2)}</TableCell>
                            <TableCell className="border border-gray-500 bg-gray-200 text-center border-l border-gray-500 text-center px-2 py-2">{totals.saleCredit.toFixed(2)}</TableCell>
                            {categories.find((c) => ["currency", "gold"].includes(c.name.toLowerCase())) && (
                              <>
                              <TableCell className="border border-gray-500 bg-gray-50 text-center px-2 py-2">{totals.saleStockDebit.toFixed(2)}</TableCell>
                              <TableCell className="border border-gray-500 bg-gray-50 text-center border-l border-gray-500 text-center px-2 py-2">{totals.saleStockCredit.toFixed(2)}</TableCell>
                              </>
                            )}
                            </>
                          )}
                          
                          
                          {categories.find((c) => ["currency", "gold"].includes(c.name.toLowerCase())) && (
                            <>
                              <TableCell className="border border-gray-500 bg-gray-200 text-center px-2 py-2">{totals.advanceDebit.toFixed(2)}</TableCell>
                              <TableCell className="border border-gray-500 bg-gray-200 text-center border-l border-gray-500 text-center px-2 py-2">{totals.advanceCredit.toFixed(2)}</TableCell>
                            </>
                          )}

                          <TableCell className="border border-gray-500 text-center border-l border-gray-500 text-center px-2 py-2">{totals.closeBalance.toFixed(2)}</TableCell>
                        </TableRow>

                        <TableRow>
                          <TableCell isHeader colSpan={7} className="text-center px-2 py-2">{""}</TableCell>
                          <TableCell className="border border-gray-500 text-center">Balance:</TableCell>

                          {(ledgerType === "purchase" || ledgerType === "all") && (
                            <>
                            <TableCell colSpan={2} className={`border border-gray-500 bg-gray-200 text-center px-2 py-2 font-semibold ${totals.purchaseBalance > 0 ? "text-green-700" : totals.purchaseBalance < 0 ? "text-red-600" : ""}`}>{totals.purchaseBalance.toFixed(2)}</TableCell>
                            {categories.find((c) => ["currency", "gold"].includes(c.name.toLowerCase())) && (
                              <>
                              <TableCell colSpan={2} className={`border border-gray-500 bg-gray-200 text-center px-2 py-2 font-semibold ${totals.purchaseStockBalance < 0 ? "text-red-600" : totals.purchaseStockBalance > 0 ? "text-green-700" : ""}`}>{totals.purchaseStockBalance.toFixed(2)}</TableCell>
                              </>
                            )}
                            </>
                          )}
                           
                          {(ledgerType === "sale" || ledgerType === "all") && (
                            <>
                            <TableCell colSpan={2} className={`border border-gray-500 bg-gray-200 text-center px-2 py-2 font-semibold ${totals.saleBalance < 0 ? "text-red-600" : totals.saleBalance > 0 ? "text-green-700" : ""}`}>{totals.saleBalance.toFixed(2)}</TableCell>
                            {categories.find((c) => ["currency", "gold"].includes(c.name.toLowerCase())) && (
                              <>
                              <TableCell colSpan={2} className={`border border-gray-500 bg-gray-200 text-center px-2 py-2 font-semibold ${totals.saleStockBalance > 0 ? "text-green-700" : totals.saleStockBalance < 0 ? "text-red-600" : ""}`}>{totals.saleStockBalance.toFixed(2)}</TableCell>
                              </>
                            )}
                            </>
                          )}
                          

                          {categories.find((c) => ["currency", "gold"].includes(c.name.toLowerCase())) && (
                            <TableCell colSpan={2} className={`border border-gray-500 bg-gray-200 text-center px-2 py-2 font-semibold ${totals.advanceBalance < 0 ? "text-red-600" : totals.advanceBalance > 0 ? "text-green-700" : ""}`}>{totals.advanceBalance.toFixed(2)}</TableCell>
                          )}

                          <TableCell colSpan={2} className={`border border-gray-500 text-center px-2 py-2 font-semibold ${totals.closeBalance < 0 ? "text-red-600" : totals.closeBalance > 0 ? "text-green-700" : ""}`}>{totals.closeBalance.toFixed(2)}</TableCell>
                        </TableRow>
                      </Fragment>
                    ))}  
                  </TableFooter>
                  
                </Table>
              
              </div>

              {/* Pagination Controls */}
              <PaginationControl
                currentPage={currentPage}
                totalPages={totalPages}
                itemsPerPage={itemsPerPage}
                onPageChange={setCurrentPage}
                onItemsPerPageChange={setItemsPerPage}
              />
            </div>
          </div>
        </div>
      }
    </>
  );
}
