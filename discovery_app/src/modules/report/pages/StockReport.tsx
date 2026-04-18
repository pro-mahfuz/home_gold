import { useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../../components/ui/table/index.tsx";
import PageBreadcrumb from "../../../components/common/PageBreadCrumb.tsx";
import PageMeta from "../../../components/common/PageMeta.tsx";

import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../../../store/store.ts";
import {
  selectAllStock,
  selectStockStatus,
  selectStockReport
} from "../../stock/features/stockSelectors.ts";
import { fetchAllStock, getStockReport } from "../../stock/features/stockThunks.ts";
import { selectAuth } from "../../auth/features/authSelectors";
import { selectUserById } from "../../user/features/userSelectors";
import { selectAllCategory } from "../../category/features/categorySelectors.ts";
import { fetchAllCategory } from "../../category/features/categoryThunks.ts";

export default function StockReport() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(getStockReport());
    dispatch(fetchAllStock());
    dispatch(fetchAllCategory());
  }, [dispatch]);

  const authUser = useSelector(selectAuth);
  const user = useSelector(selectUserById(Number(authUser.user?.id)));
  const status = useSelector(selectStockStatus);
  const stockReports = useSelector(selectStockReport);
  const stocks = useSelector(selectAllStock);
  const categories = useSelector(selectAllCategory);
  const showContainerColumn = !categories.find((c) => ["currency", "gold"].includes(c.name.toLowerCase()));
  const tableColumnCount = showContainerColumn ? 13 : 12;
  const partyTransferColumnCount = showContainerColumn ? 8 : 7;
  const overall = stockReports.reduce(
    (acc, stock) => {
      acc.totalStockIn += Number(stock.totalStockIn) || 0;
      acc.totalStockOut += Number(stock.totalStockOut) || 0;
      acc.totalTransferOut += Number(stock.totalTransferOut) || 0;
      acc.totalTransferReturn += Number(stock.totalTransferReturn) || 0;
      acc.totalIn += Number(stock.totalIn) || 0;
      acc.totalOut += Number(stock.totalOut) || 0;
      acc.totalDamaged += Number(stock.totalDamaged) || 0;
      acc.currentStock += Number(stock.currentStock) || 0;
      acc.transferStock += Number(stock.transferStock) || 0;
      acc.totalStock += Number(stock.totalStock) || 0;
      return acc;
    },
    {
      totalStockIn: 0,
      totalStockOut: 0,
      totalTransferOut: 0,
      totalTransferReturn: 0,
      totalIn: 0,
      totalOut: 0,
      totalDamaged: 0,
      currentStock: 0,
      transferStock: 0,
      totalStock: 0
    }
  );

  const partyTransferStocks = useMemo(() => {
    const grouped = new Map<
      string,
      {
        partyId: number;
        partyName: string;
        itemId: number;
        itemName: string;
        containerId: number;
        containerNo: string;
        unit: string;
        transferOut: number;
        transferReturn: number;
        transferStock: number;
      }
    >();

    stocks
      .filter((stock) => ["stock_transfer", "stock_transfer_return"].includes(stock.movementType))
      .forEach((stock) => {
        const partyId = Number(stock.partyId) || 0;
        const itemId = Number(stock.itemId) || 0;
        const containerId = Number(stock.containerId) || 0;
        const unit = stock.unit ?? "";
        const key = [partyId, itemId, containerId, unit].join("|");

        const existing = grouped.get(key) ?? {
          partyId,
          partyName: stock.party?.name ?? "-",
          itemId,
          itemName: stock.item?.name ?? "-",
          containerId,
          containerNo: stock.container?.containerNo ?? "-",
          unit,
          transferOut: 0,
          transferReturn: 0,
          transferStock: 0,
        };

        const quantity = Number(stock.quantity) || 0;
        if (stock.movementType === "stock_transfer") {
          existing.transferOut += quantity;
        }
        if (stock.movementType === "stock_transfer_return") {
          existing.transferReturn += quantity;
        }

        existing.transferStock = existing.transferOut - existing.transferReturn;
        grouped.set(key, existing);
      });

    return Array.from(grouped.values())
      .filter((row) => row.transferOut > 0 || row.transferReturn > 0)
      .sort((a, b) => {
        const partyCompare = a.partyName.localeCompare(b.partyName);
        if (partyCompare !== 0) return partyCompare;

        const itemCompare = a.itemName.localeCompare(b.itemName);
        if (itemCompare !== 0) return itemCompare;

        return a.unit.localeCompare(b.unit);
      });
  }, [stocks]);
  

  return (
    <>
      <PageMeta
        title="Stock Report"
        description="Stock Table with Search, Sort, Pagination"
      />
      <PageBreadcrumb pageTitle="Stock Report" />

      {/* Print Button */}
      <div className="mb-4 flex justify-end print:hidden">
        <button
          onClick={() => navigate(-1)}
          className="bg-red-400 text-white px-2 py-1 rounded-full hover:bg-red-700 mr-4"
        >
          Back
        </button>

        <button
          onClick={() => window.print()}
          className="bg-purple-600 text-white px-2 py-1 rounded-full hover:bg-purple-900"
        >
          Print Report
        </button>
      </div>

      <div id="print-section">
        <div className="space-y-6">
          <div className="rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
            <div className="max-w-full p-4">

              <div className="p-5 rounded-2xl lg:p-6">
                <div className="flex flex-row items-center text-center gap-5 xl:flex-row xl:justify-between">
                  <div className="flex flex-col items-center w-full gap-1">
                    <h4 className="text-lg font-semibold text-gray-800 dark:text-white/90">
                        {user?.business?.businessName}
                    </h4>
                    {user?.business?.trnNo && (
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            TRN No: {user.business.trnNo}
                        </p>
                    )}
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        Address: {user?.business?.address} , Email: {user?.business?.email} , Phone: {(user?.business?.phoneCode ?? '') + user?.business?.phoneNumber}
                    </p>
                    <h6 className="border border-gray-500 p-1 rounded text-sm font-semibold text-gray-800 dark:text-white/90 mt-5">
                        Stock Report
                    </h6>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-8 gap-3 mb-4">
                <div className="border border-gray-300 rounded p-2 text-center text-sm">
                  <p className="text-gray-500">Stock In</p>
                  <p className="font-semibold">{overall.totalStockIn.toFixed(2)}</p>
                </div>
                <div className="border border-gray-300 rounded p-2 text-center text-sm">
                  <p className="text-gray-500">Transfer Return</p>
                  <p className="font-semibold">{overall.totalTransferReturn.toFixed(2)}</p>
                </div>
                <div className="border border-gray-300 rounded p-2 text-center text-sm">
                  <p className="text-gray-500">Stock Out</p>
                  <p className="font-semibold">{overall.totalStockOut.toFixed(2)}</p>
                </div>
                <div className="border border-gray-300 rounded p-2 text-center text-sm">
                  <p className="text-gray-500">Transfer Out</p>
                  <p className="font-semibold">{overall.totalTransferOut.toFixed(2)}</p>
                </div>
                <div className="border border-gray-300 rounded p-2 text-center text-sm">
                  <p className="text-gray-500">Adjustment</p>
                  <p className="font-semibold">{overall.totalDamaged.toFixed(2)}</p>
                </div>
                <div className="border border-gray-300 rounded p-2 text-center text-sm">
                  <p className="text-gray-500">Current Stock</p>
                  <p className="font-semibold">{overall.currentStock.toFixed(2)}</p>
                </div>
                <div className="border border-gray-300 rounded p-2 text-center text-sm">
                  <p className="text-gray-500">Transfer Stock</p>
                  <p className="font-semibold">{overall.transferStock.toFixed(2)}</p>
                </div>
                <div className="border border-gray-300 rounded p-2 text-center text-sm">
                  <p className="text-gray-500">Total Stock</p>
                  <p className="font-semibold">{overall.totalStock.toFixed(2)}</p>
                </div>
              </div>
            

              <Table>
                <TableHeader className="border border-gray-500 dark:border-white/[0.05] bg-gray-200 text-black text-sm dark:bg-gray-800 dark:text-gray-400">
                  <TableRow>
                    <TableCell isHeader className="border border-gray-500 text-center px-2 py-1">Sl</TableCell>
                    {showContainerColumn && (
                      <TableCell isHeader className="border border-gray-500 text-center px-2 py-1">Container</TableCell>
                    )}
                    <TableCell isHeader className="border border-gray-500 text-center px-2 py-1">Warehouse</TableCell>
                    <TableCell isHeader className="border border-gray-500 text-center px-2 py-1">Item</TableCell>
                    <TableCell isHeader className="border border-gray-500 text-center px-2 py-1">Unit</TableCell>
                    <TableCell isHeader className="border border-gray-500 text-center px-2 py-1">Stock In</TableCell>
                    <TableCell isHeader className="border border-gray-500 text-center px-2 py-1">Transfer Return</TableCell>
                    <TableCell isHeader className="border border-gray-500 text-center px-2 py-1">Stock Out</TableCell>
                    <TableCell isHeader className="border border-gray-500 text-center px-2 py-1">Transfer Out</TableCell>
                    <TableCell isHeader className="border border-gray-500 text-center px-2 py-1">Current Stock</TableCell>
                    <TableCell isHeader className="border border-gray-500 text-center px-2 py-1">Transfer Stock</TableCell>
                    <TableCell isHeader className="border border-gray-500 text-center px-2 py-1">Total Stock</TableCell>
                    <TableCell isHeader className="border border-gray-500 text-center px-2 py-1">Remarks</TableCell>
                  </TableRow>
                </TableHeader>

                <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                  {status === 'loading' ? (
                      <TableRow>
                      <TableCell colSpan={tableColumnCount} className="border border-gray-500 text-center py-4 text-gray-500 dark:text-gray-300">
                        Loading data...
                      </TableCell>
                    </TableRow>
                  ) : stockReports.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={tableColumnCount} className="border border-gray-500 text-center py-4 text-gray-500 dark:text-gray-300">
                        No data found.
                      </TableCell>
                    </TableRow>
                  ) : (
                    stockReports.map((stock, index) => (
                      <TableRow key={index} className="border border-gray-500 dark:border-white/[0.05]">
                        <TableCell className="text-center px-2 py-1 text-sm text-gray-500 dark:text-gray-400">
                          {index + 1}
                        </TableCell>
                        
                        {showContainerColumn && (
                          <TableCell className="border border-gray-500 text-center px-2 py-1 text-sm text-gray-500 dark:text-gray-400">
                              {stock.container?.containerNo}
                          </TableCell>
                        )}
                        <TableCell className="border border-gray-500 text-center px-2 py-1 text-sm text-gray-500 dark:text-gray-400">
                          {stock.warehouse?.name ?? "-"}
                        </TableCell>
                        
                        <TableCell className="border border-gray-500 text-center px-2 py-1 text-sm text-gray-500 dark:text-gray-400">
                          {stock.item?.name}
                        </TableCell>
                        <TableCell className="border border-gray-500 text-center px-2 py-1 text-sm text-gray-500 dark:text-gray-400">
                          {stock.unit?.toUpperCase()}
                        </TableCell>
                        
                        <TableCell className="border border-gray-500 text-center px-2 py-1 text-sm text-gray-500 dark:text-gray-400">
                          {(stock.totalStockIn ?? 0).toFixed(2)}
                        </TableCell>
                        <TableCell className="border border-gray-500 text-center px-2 py-1 text-sm text-gray-500 dark:text-gray-400">
                          {(stock.totalTransferReturn ?? 0).toFixed(2)}
                        </TableCell>
                        <TableCell className="border border-gray-500 text-center px-2 py-1 text-sm text-gray-500 dark:text-gray-400">
                          {(stock.totalStockOut ?? 0).toFixed(2)}
                        </TableCell>
                        <TableCell className="border border-gray-500 text-center px-2 py-1 text-sm text-gray-500 dark:text-gray-400">
                          {(stock.totalTransferOut ?? 0).toFixed(2)}
                        </TableCell>
                        
                        <TableCell className="border border-gray-500 text-center px-2 py-1 text-sm text-gray-500 dark:text-gray-400">
                          {(stock.currentStock ?? 0).toFixed(2)}
                        </TableCell>

                        <TableCell className="border border-gray-500 text-center px-2 py-1 text-sm text-gray-500 dark:text-gray-400">
                          {(stock.transferStock ?? 0).toFixed(2)}
                        </TableCell>

                        <TableCell className="border border-gray-500 text-center px-2 py-1 text-sm text-gray-500 dark:text-gray-400">
                          {(stock.totalStock ?? 0).toFixed(2)}
                        </TableCell>
                        
                        <TableCell className="border border-gray-500 text-center px-2 py-1 text-sm text-gray-500 dark:text-gray-400">
                          Total In: {stock.totalIn.toFixed(2)} | Total Out: {stock.totalOut.toFixed(2)} | Adjustment: {stock.totalDamaged.toFixed(2)}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>

              <div className="mt-8">
                <h6 className="border border-gray-500 p-1 rounded text-sm font-semibold text-gray-800 dark:text-white/90 mb-4 text-center">
                  Transfer Stock Of All Party
                </h6>

                <Table>
                  <TableHeader className="border border-gray-500 dark:border-white/[0.05] bg-gray-200 text-black text-sm dark:bg-gray-800 dark:text-gray-400">
                    <TableRow>
                      <TableCell isHeader className="border border-gray-500 text-center px-2 py-1">Sl</TableCell>
                      <TableCell isHeader className="border border-gray-500 text-center px-2 py-1">Party</TableCell>
                      {showContainerColumn && (
                        <TableCell isHeader className="border border-gray-500 text-center px-2 py-1">Container</TableCell>
                      )}
                      <TableCell isHeader className="border border-gray-500 text-center px-2 py-1">Item</TableCell>
                      <TableCell isHeader className="border border-gray-500 text-center px-2 py-1">Unit</TableCell>
                      <TableCell isHeader className="border border-gray-500 text-center px-2 py-1">Transfer Out</TableCell>
                      <TableCell isHeader className="border border-gray-500 text-center px-2 py-1">Transfer Return</TableCell>
                      <TableCell isHeader className="border border-gray-500 text-center px-2 py-1">Transfer Stock</TableCell>
                    </TableRow>
                  </TableHeader>

                  <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                    {status === "loading" ? (
                      <TableRow>
                        <TableCell colSpan={partyTransferColumnCount} className="border border-gray-500 text-center py-4 text-gray-500 dark:text-gray-300">
                          Loading data...
                        </TableCell>
                      </TableRow>
                    ) : partyTransferStocks.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={partyTransferColumnCount} className="border border-gray-500 text-center py-4 text-gray-500 dark:text-gray-300">
                          No transfer stock found.
                        </TableCell>
                      </TableRow>
                    ) : (
                      partyTransferStocks.map((stock, index) => (
                        <TableRow key={`${stock.partyId}-${stock.itemId}-${stock.containerId}-${stock.unit}`} className="border border-gray-500 dark:border-white/[0.05]">
                          <TableCell className="border border-gray-500 text-center px-2 py-1 text-sm text-gray-500 dark:text-gray-400">
                            {index + 1}
                          </TableCell>
                          <TableCell className="border border-gray-500 text-center px-2 py-1 text-sm text-gray-500 dark:text-gray-400">
                            {stock.partyName}
                          </TableCell>
                          {showContainerColumn && (
                            <TableCell className="border border-gray-500 text-center px-2 py-1 text-sm text-gray-500 dark:text-gray-400">
                              {stock.containerNo}
                            </TableCell>
                          )}
                          <TableCell className="border border-gray-500 text-center px-2 py-1 text-sm text-gray-500 dark:text-gray-400">
                            {stock.itemName}
                          </TableCell>
                          <TableCell className="border border-gray-500 text-center px-2 py-1 text-sm text-gray-500 dark:text-gray-400">
                            {stock.unit?.toUpperCase() || "-"}
                          </TableCell>
                          <TableCell className="border border-gray-500 text-center px-2 py-1 text-sm text-gray-500 dark:text-gray-400">
                            {stock.transferOut.toFixed(2)}
                          </TableCell>
                          <TableCell className="border border-gray-500 text-center px-2 py-1 text-sm text-gray-500 dark:text-gray-400">
                            {stock.transferReturn.toFixed(2)}
                          </TableCell>
                          <TableCell className="border border-gray-500 text-center px-2 py-1 text-sm text-gray-500 dark:text-gray-400">
                            {stock.transferStock.toFixed(2)}
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>
          </div>
        </div>
      </div>
      
    </>
  );
}
