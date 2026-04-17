import { useEffect } from "react";
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
  selectStockStatus,
  selectStockReport
} from "../../stock/features/stockSelectors.ts";
import { getStockReport } from "../../stock/features/stockThunks.ts";
import { selectAuth } from "../../auth/features/authSelectors";
import { selectUserById } from "../../user/features/userSelectors";
import { selectAllCategory } from "../../category/features/categorySelectors.ts";
import { fetchAllCategory } from "../../category/features/categoryThunks.ts";

export default function StockReport() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(getStockReport());
    dispatch(fetchAllCategory());
  }, [dispatch]);

  const authUser = useSelector(selectAuth);
  const user = useSelector(selectUserById(Number(authUser.user?.id)));
  const status = useSelector(selectStockStatus);
  const stockReports = useSelector(selectStockReport);
  const categories = useSelector(selectAllCategory);
  const positiveStocks = stockReports.filter(
    (stock) =>
      Number(stock.totalIn) - Number(stock.totalOut) - Number(stock.totalDamaged) > 0
  );
  const overall = stockReports.reduce(
    (acc, stock) => {
      acc.totalIn += Number(stock.totalIn) || 0;
      acc.totalOut += Number(stock.totalOut) || 0;
      acc.totalDamaged += Number(stock.totalDamaged) || 0;
      acc.available +=
        Number(stock.availableQty) ||
        (Number(stock.totalIn) - Number(stock.totalOut) - Number(stock.totalDamaged));
      return acc;
    },
    { totalIn: 0, totalOut: 0, totalDamaged: 0, available: 0 }
  );
  

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

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                <div className="border border-gray-300 rounded p-2 text-center text-sm">
                  <p className="text-gray-500">Overall In</p>
                  <p className="font-semibold">{overall.totalIn.toFixed(2)}</p>
                </div>
                <div className="border border-gray-300 rounded p-2 text-center text-sm">
                  <p className="text-gray-500">Overall Out</p>
                  <p className="font-semibold">{overall.totalOut.toFixed(2)}</p>
                </div>
                <div className="border border-gray-300 rounded p-2 text-center text-sm">
                  <p className="text-gray-500">Overall Damaged</p>
                  <p className="font-semibold">{overall.totalDamaged.toFixed(2)}</p>
                </div>
                <div className="border border-gray-300 rounded p-2 text-center text-sm">
                  <p className="text-gray-500">Overall Available</p>
                  <p className="font-semibold">{overall.available.toFixed(2)}</p>
                </div>
              </div>
            

              <Table>
                <TableHeader className="border border-gray-500 dark:border-white/[0.05] bg-gray-200 text-black text-sm dark:bg-gray-800 dark:text-gray-400">
                  <TableRow>
                    <TableCell isHeader className="border border-gray-500 text-center px-2 py-1">Sl</TableCell>
                    {!categories.find((c) => ["currency", "gold"].includes(c.name.toLowerCase()) ) && (
                      <TableCell isHeader className="border border-gray-500 text-center px-2 py-1">Container</TableCell>
                    )}
                    <TableCell isHeader className="border border-gray-500 text-center px-2 py-1">Warehouse</TableCell>
                    <TableCell isHeader className="border border-gray-500 text-center px-2 py-1">Item</TableCell>
                    <TableCell isHeader className="border border-gray-500 text-center px-2 py-1">Unit</TableCell>
                    <TableCell isHeader className="border border-gray-500 text-center px-2 py-1">Stock In</TableCell>
                    <TableCell isHeader className="border border-gray-500 text-center px-2 py-1">Stock Out</TableCell>
                    <TableCell isHeader className="border border-gray-500 text-center px-2 py-1">Stock</TableCell>
                    <TableCell isHeader className="border border-gray-500 text-center px-2 py-1">Remarks</TableCell>
                  </TableRow>
                </TableHeader>

                <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                  {status === 'loading' ? (
                    <TableRow>
                      <TableCell colSpan={10} className="border border-gray-500 text-center py-4 text-gray-500 dark:text-gray-300">
                        Loading data...
                      </TableCell>
                    </TableRow>
                  ) : stockReports.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={10} className="border border-gray-500 text-center py-4 text-gray-500 dark:text-gray-300">
                        No data found.
                      </TableCell>
                    </TableRow>
                  ) : (
                    positiveStocks.map((stock, index) => (
                      <TableRow key={index} className="border border-gray-500 dark:border-white/[0.05]">
                        <TableCell className="text-center px-2 py-1 text-sm text-gray-500 dark:text-gray-400">
                          {index + 1}
                        </TableCell>
                        
                        {!categories.find((c) => ["currency", "gold"].includes(c.name.toLowerCase()) ) && (
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
                          {stock.totalIn.toFixed(2)}
                        </TableCell>
                        <TableCell className="border border-gray-500 text-center px-2 py-1 text-sm text-gray-500 dark:text-gray-400">
                          {stock.totalOut.toFixed(2)}
                        </TableCell>
                        
                        <TableCell className="border border-gray-500 text-center px-2 py-1 text-sm text-gray-500 dark:text-gray-400">
                          {(stock.availableQty ?? (stock.totalIn - stock.totalOut - stock.totalDamaged)).toFixed(2)}
                        </TableCell>
                        
                        <TableCell className="border border-gray-500 text-center px-2 py-1 text-sm text-gray-500 dark:text-gray-400">
                          Adjustment: {stock.totalDamaged.toFixed(2)}
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
      
    </>
  );
}
