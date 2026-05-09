import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
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

import { selectUserById } from "../../user/features/userSelectors";
import { selectAuth } from "../../auth/features/authSelectors";

//import { selectAllCategory } from "../../category/features/categorySelectors.ts";
import { fetchAllCategory } from "../../category/features/categoryThunks.ts";
import { fetchParty } from "../../party/features/partyThunks.ts";
import { selectParties, selectPartyStatus } from "../../party/features/partySelectors.ts";

export default function CustomerBalanceStatement() {
  const { partyType } = useParams();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const authUser = useSelector(selectAuth);
  const user = useSelector(selectUserById(Number(authUser.user?.id)));

  const status = useSelector(selectPartyStatus);
  //const categories = useSelector(selectAllCategory);
  const parties = useSelector(selectParties(Number( user?.business?.id), String(partyType)));

  useEffect(() => {
    dispatch(fetchParty({ type: "all" }))
    dispatch(fetchAllCategory());
  }, [dispatch]);


  return (
    <>
      <PageMeta
        title={`${partyType ? partyType.charAt(0).toUpperCase() + partyType.slice(1).toLowerCase() : ''} List`}
        description="Invoice Table with Search, Sort, Pagination"
      />
      <PageBreadcrumb pageTitle={`${partyType ? partyType.charAt(0).toUpperCase() + partyType.slice(1).toLowerCase() : ''} List`} />

      <div className="flex justify-between print:hidden mb-2">
        <div className="flex">
          
        </div>

        <div>
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
                  </div>
                </div>
              </div>

              <Table>
                <TableHeader className="border border-gray-500 dark:border-white/[0.05] bg-sky-200 text-black text-sm dark:bg-gray-800 dark:text-gray-400">
                  <TableRow className="border border-gray-500">
                    <TableCell isHeader className="border border-gray-500 text-center px-1 py-1">Sl</TableCell>

                    {partyType === "supplier" 
                        ? <TableCell isHeader className="border border-gray-500 text-center px-1 py-1">Supplier Name</TableCell>
                        : partyType === "customer" 
                          ? <TableCell isHeader className="border border-gray-500 text-center px-1 py-1">Customer Name</TableCell>
                          : <TableCell isHeader className="border border-gray-500 text-center px-1 py-1">Party Name</TableCell>
                    }
                    <TableCell isHeader className="border border-gray-500 text-center px-1 py-1 max-w-24">Advance (Over/Due)</TableCell>
                    <TableCell isHeader className="border border-gray-500 text-center px-1 py-1 max-w-24">Stock Amount (Over/Due)</TableCell>
                    <TableCell isHeader className="border border-gray-500 text-center px-1 py-1 max-w-24">Payment (Over/Due)</TableCell>
                  </TableRow>
                </TableHeader>

                <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                  {status === 'loading' ? (
                    <TableRow>
                      <TableCell colSpan={14} className="text-center py-4 text-gray-500 dark:text-gray-300">
                        Loading data...
                      </TableCell>
                    </TableRow>
                  ) : parties.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={14} className="text-center py-4 text-gray-500 dark:text-gray-300">
                        No data found.
                      </TableCell>
                    </TableRow>
                  ) : (
                    parties.map((party, index) => (
                      <TableRow key={party.id} className="border border-gray-500 dark:border-white/[0.05]">
                        <TableCell className="border border-gray-500 text-center px-1 py-1 text-sm text-gray-500 dark:text-gray-400">
                          {index + 1}
                        </TableCell>

                        <TableCell className="border border-gray-500 text-center px-1 py-1 text-sm text-gray-500 dark:text-gray-400">
                          {party.name}
                        </TableCell>

                        <TableCell className="border border-gray-500 text-center px-1 py-1 text-sm text-gray-500 dark:text-gray-400">
                          <div>
                            {party.advanceSummary?.length ? (
                              party.advanceSummary.map((s, idx) => {
                                const balance = Number(s.advanceInSum) - Number(s.advanceOutSum);
                                if (balance === 0) return null;

                                const balanceClass =
                                  balance > 0 ? "text-green-700" : balance < 0 ? "text-red-500" : "";

                                return (
                                  <div key={idx} className={balanceClass}>
                                    {`${s.currency}: ${balance.toFixed(2)}`}
                                  </div>
                                );
                              })
                            ) : (
                              "-"
                            )}
                          </div>
                        </TableCell>

                        <TableCell className="border border-gray-500 text-center px-1 py-1 text-sm text-gray-500 dark:text-gray-400">
                          <div>
                            {party.stockSummary?.length ? (
                              party.stockSummary.map((s, idx) => {
                                const balance = Number(s.stockInSum) - Number(s.stockOutSum);
                                if (balance === 0) return null;

                                const balanceClass =
                                  balance > 0 ? "text-green-700" : balance < 0 ? "text-red-500" : "";

                                return (
                                  <div key={idx} className={balanceClass}>
                                    {`${s.currency}: ${balance}`}
                                  </div>
                                );
                              })
                            ) : (
                              "-"
                            )}
                          </div>
                        </TableCell>

                        {/* Payment Due */}
                        <TableCell className="border border-gray-500 text-center px-1 py-1 text-sm text-gray-500 dark:text-gray-400">
                          <div>
                            {party.paymentSummary?.length ? (
                              party.paymentSummary.map((s, idx) => {
                                const balance = Number(s.paymentInSum) - Number(s.paymentOutSum);
                                if (balance === 0) return null;

                                const balanceClass =
                                  balance > 0 ? "text-green-700" : balance < 0 ? "text-red-500" : "";

                                return (
                                  <div key={idx} className={balanceClass}>
                                    {`${s.currency}: ${balance.toFixed(2)}`}
                                  </div>
                                );
                              })
                            ) : (
                              "-"
                            )}
                          </div>
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
