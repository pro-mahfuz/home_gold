import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  EyeIcon,
  PencilIcon,
  TrashIcon,
  ChevronDownIcon,
} from '@heroicons/react/20/solid';
import {
  PaginationControl,
  //SearchControl,
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../../components/ui/table/index.tsx";
import PageBreadcrumb from "../../../components/common/PageBreadCrumb.tsx";
import PageMeta from "../../../components/common/PageMeta.tsx";
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react';
import Label from "../../../components/form/Label";
import Select from "react-select";

import { toast } from "react-toastify";
import { useModal } from "../../../hooks/useModal.ts";
import ConfirmationModal from "../../../components/ui/modal/ConfirmationModal.tsx";

import { selectStyles } from "../../types.ts";
import { Party } from "../features/partyTypes.ts";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../../../store/store.ts";
//import { selectUser } from "../../auth/features/authSelectors.ts";
import { selectAllPartyPagination, selectPartyStatus, selectTotalPages } from "../features/partySelectors.ts";
import { fetchPartyPaginated, deleteParty } from "../features/partyThunks.ts";
import { selectAllCategory } from "../../category/features/categorySelectors.ts";
import { fetchAllCategory } from "../../category/features/categoryThunks.ts";
import { selectAllParties } from "../../party/features/partySelectors";
import { fetchParty } from "../../party/features/partyThunks.ts";

export default function PartyList() {
  const { partyType } = useParams();

  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  //const authUser = useSelector(selectUser);
  const status = useSelector(selectPartyStatus);

  const totalPages = useSelector(selectTotalPages);
const [filterText, setFilterText] = useState<number | undefined>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(10);

  useEffect(() => {
    dispatch(fetchPartyPaginated({ page: currentPage, limit: itemsPerPage, type: partyType, filterText: filterText }));
    dispatch(fetchAllCategory());
    if ( matchingParties.length === 0) dispatch(fetchParty({ type: "all" }));
  }, [dispatch, currentPage, itemsPerPage, partyType, filterText]);

  const parties = useSelector(selectAllPartyPagination);
  const categories = useSelector(selectAllCategory);
  const matchingParties = useSelector(selectAllParties);

  

  const { isOpen, openModal, closeModal } = useModal();
  const [selectedParty, setSelectedParty] = useState<Party | null>(null);

  

  // const filteredParties = useMemo(() => {
  //   const search = filterText.toLowerCase().trim();

  //   if (!search) return parties;

  //   return parties.filter((p) => {
  //     const name = p.name?.toLowerCase() ?? "";
  //     const phone = p.phoneNumber ?? "";
  //     const address = p.address?.toLowerCase() ?? "";

  //     return (
  //       name.includes(search) ||
  //       phone.includes(search) ||
  //       address.includes(search)
  //     );
  //   });
  // }, [parties, filterText]);

  // const totalPages = Math.ceil(filteredParties.length / itemsPerPage);

  // const paginatedParties = useMemo(() => {
  //   const start = (currentPage - 1) * itemsPerPage;
  //   return filteredParties.slice(start, start + itemsPerPage);
  // }, [filteredParties, currentPage, itemsPerPage]);

  const handleLedger = (party: Party) => {
    const hasCurrencyOrGold = categories.find((c) =>
      ["currency", "gold"].includes(c.name.toLowerCase())
    );

    let url = "";

    if (hasCurrencyOrGold) {
      url =
        party.type === "party"
          ? `/ledger/1/party/${party.id}`
          : `/ledger/all/list/${party.id}`;
    } else {
      url =
        party.type === "supplier"
          ? `/ledger/purchase/list/${party.id}`
          : `/ledger/sale/list/${party.id}`;
    }

    console.log("Navigate to:", url);

    navigate(url);
  };

  const handleView = (party: Party) => {
    navigate(`/party/view/${party.id}`);
  };

  const handleEdit = (party: Party) => {
    navigate(`/party/edit/${party.id}`);
  };

  const handleDelete = async () => {
    if (!selectedParty) return;
    try {
      await dispatch(deleteParty(selectedParty.id!)).unwrap();
      toast.success("Customer deleted successfully");
      closeAndResetModal();
    } catch (error) {
      console.error("Failed to delete user:", error);
      toast.error("Failed to delete user");
    }
  };

  const closeAndResetModal = () => {
    setSelectedParty(null);
    closeModal();
  };

  // useEffect(() => {
  //   if (currentPage > totalPages) {
  //     setCurrentPage(1);
  //   }
  // }, [totalPages, currentPage]);

  return (
    <>
      <PageMeta
        title={`${partyType ? partyType.charAt(0).toUpperCase() + partyType.slice(1).toLowerCase() : ''} List Table`}
        description="Customers Table with Search, Sort, Pagination"
      />
      <PageBreadcrumb pageTitle={`${!partyType || partyType === "all" ? "Party List" : partyType.charAt(0).toUpperCase() + partyType.slice(1).toLowerCase() + ' List'}`} />

      <div className="mb-4 flex justify-start">
        <div>
          <button
              onClick={() => navigate(-1)}
              className="bg-red-400 text-white px-2 py-1 rounded-full hover:bg-red-700 mr-4"
          >
              Back
          </button>

          <button
            onClick={() => {setCurrentPage(1)}}
            className="bg-fuchsia-400 text-white px-2 py-1 rounded-full hover:bg-fuchsia-700 mr-4"
          >
            Refresh
          </button>
            
        </div>

        <div>
          <button
            onClick={() => {partyType === "all" ? navigate('/party/create') : partyType === "supplier" ? navigate('/party/supplier/create') : navigate('/party/customer/create')}}
            className="bg-lime-600 text-white px-2 py-1 rounded-full hover:bg-lime-900 mr-4"
          >
            Create
          </button>
            
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-6 gap-6 mb-5">
        {/* Search Input */}
        <div>
          <Label>Select Party</Label>
          <Select
            options={matchingParties.map((p) => ({
              label: p.name,
              value: Number(p.id),
            }))}
            placeholder="Search and select party"
            onChange={(selectedOption) =>
              setFilterText(selectedOption?.value)
            }
            isClearable
            styles={selectStyles}
            classNamePrefix="react-select"
          />
        </div>
      </div>

      <div className="space-y-6">
        <div className="rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
          <div className="max-w-full p-4">

            {/* Table */}
            <Table>
              <TableHeader className="border border-gray-500 dark:border-white/[0.05] bg-sky-200 text-black text-sm dark:bg-gray-800 dark:text-gray-400">
                <TableRow className="border border-gray-500">
                  <TableCell isHeader className="border border-gray-500 text-center px-4 py-1">Sl</TableCell>
                  <TableCell isHeader className="border border-gray-500 text-center px-4 py-1">Party Name</TableCell>
                  <TableCell isHeader className="border border-gray-500 text-center px-4 py-1">Phone</TableCell>
                  <TableCell isHeader className="border border-gray-500 text-center px-4 py-1">Email</TableCell>
                  {/* {!categories.find((c) => ["currency", "gold"].includes(c.name.toLowerCase())) && ( 
                    <>
                      <TableCell isHeader className="text-center px-4 py-2">Balance</TableCell>
                    </>
                  )} */}
                  <TableCell isHeader className="border border-gray-500 text-center px-4 py-1">isActive</TableCell>
                  <TableCell isHeader className="border border-gray-500 text-center px-4 py-1">Ledgers</TableCell>
                  <TableCell isHeader className="border border-gray-500 text-center px-4 py-1">Action</TableCell>
                </TableRow>
              </TableHeader>

              <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                {status === 'loading' ? (
                  <TableRow className="border border-gray-500">
                    <TableCell colSpan={11- (!categories.find((c) => ["currency", "gold"].includes(c.name.toLowerCase())) ? 3: 0)} className="border border-gray-500 text-center py-4 text-gray-500 dark:text-gray-300">
                      Loading data...
                    </TableCell>
                  </TableRow>
                ) : parties.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={11 - (!categories.find((c) => ["currency", "gold"].includes(c.name.toLowerCase())) ? 3: 0)} className="border border-gray-500 text-center py-4 text-gray-500 dark:text-gray-300">
                      No data found.
                    </TableCell>
                  </TableRow>
                ) : (
                  parties.map((party, index) => (
                    <TableRow key={party.id} className="border-b border-gray-100 dark:border-white/[0.05]">
                      <TableCell className="border border-gray-500 text-center px-4 py-1 text-sm text-gray-500 dark:text-gray-400">
                        {(currentPage - 1) * itemsPerPage + index + 1}
                      </TableCell>

                      <TableCell className="border border-gray-500 text-center px-4 py-1 text-sm text-gray-500 dark:text-gray-400">
                        {party.name}
                      </TableCell>

                      <TableCell className="border border-gray-500 text-center px-4 py-1 text-sm text-gray-500 dark:text-gray-400">
                        {party.phoneCode && party.phoneNumber
                          ? `${party.phoneCode} ${party.phoneNumber}`
                          : "—"}
                      </TableCell>

                      <TableCell className="border border-gray-500 text-center px-4 py-1 text-sm text-gray-500 dark:text-gray-400">
                        {party.email ? party.email : "—"}
                      </TableCell>

                      {/* {!categories.find((c) => ["currency", "gold"].includes(c.name.toLowerCase())) && ( 
                        <TableCell className="border border-gray-500 text-center px-4 py-2 text-sm text-gray-500 dark:text-gray-400">
                          <div>
                            {party.summaryByCurrency && party.summaryByCurrency.length > 0 ? (
                              party.summaryByCurrency
                                // filter only meaningful balances
                                .filter(s => Math.abs(Number(s.netBalance)) >= 0.005)
                                .map((s, idx) => {
                                  const netBalance = Number(s.netBalance);
                                  const balanceClass =
                                    netBalance > 0
                                      ? "text-green-700"
                                      : netBalance < 0
                                      ? "text-red-500"
                                      : "text-gray-500";

                                  return (
                                    <div key={idx} className={balanceClass}>
                                      {netBalance != 0 ? `${s.currency}: ${netBalance.toFixed(2)}` : "--"}
                                    </div>
                                  );
                                })
                            ) : (
                              <span>—</span>
                            )}
                          </div>
                        </TableCell>
                      )} */}

                      <TableCell className="border border-gray-500 text-center px-4 py-1 text-sm">
                        <div className={`${party.isActive ? 'text-green-700 dark:text-green-700' : 'text-red-500 dark:text-red-400'}`}>{party.isActive ? 'Yes' : 'No'}</div>
                      </TableCell>

                      <TableCell className="border border-gray-500 text-center px-4 py-1 text-sm text-gray-500 dark:text-gray-400">
                        <button
                          type="submit"
                          className="inline-flex items-center gap-1 rounded-full bg-sky-500 px-2 py-1 text-sm font-semibold text-white hover:bg-sky-700 focus:outline-none"
                          onClick={() => handleLedger(party)}
                        >
                          Ledger
                        </button>
                      </TableCell>

                      <TableCell className="border border-gray-500 text-center px-4 py-1 text-sm overflow-visible">
                        <Menu as="div" className="relative inline-block text-left">
                          <MenuButton className="inline-flex items-center gap-1 rounded-full bg-sky-500 px-2 py-1 text-sm font-semibold text-white hover:bg-sky-700 focus:outline-none">
                            Actions
                            <ChevronDownIcon className="h-4 w-4 text-white" />
                          </MenuButton>

                          <MenuItems className="absolute right-0 z-50 mt-2 w-40 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-sky-500 ring-opacity-5 focus:outline-none">
                            <div className="py-1">
                              <MenuItem>
                                {({ active }) => (
                                  <button
                                    onClick={() => handleView(party)}
                                    className={`${
                                      active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
                                    } flex w-full items-center gap-2 px-4 py-2 text-sm`}
                                  >
                                    <EyeIcon className="h-4 w-4" />
                                    View
                                  </button>
                                )}
                              </MenuItem>
                              <MenuItem>
                                {({ active }) => (
                                  <button
                                    onClick={() => handleEdit(party)}
                                    className={`${
                                      active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
                                    } flex w-full items-center gap-2 px-4 py-2 text-sm`}
                                  >
                                    <PencilIcon className="h-4 w-4" />
                                    Edit
                                  </button>
                                )}
                              </MenuItem>
                              
                                <MenuItem>
                                  {({ active }) => (
                                    <button
                                      onClick={() => {
                                        setSelectedParty(party);
                                        openModal();
                                      }}
                                      className={`${
                                        active ? 'bg-red-100 text-red-700' : 'text-red-600'
                                      } flex w-full items-center gap-2 px-4 py-2 text-sm`}
                                    >
                                      <TrashIcon className="h-4 w-4" />
                                      Delete
                                    </button>
                                  )}
                                </MenuItem>
                              
                            </div>
                          </MenuItems>
                        </Menu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination Controls */}
          <PaginationControl
            currentPage={currentPage}
            totalPages={totalPages || 1}
            itemsPerPage={itemsPerPage}
            onPageChange={(page) => setCurrentPage(page)}
            onItemsPerPageChange={(limit) => {
              setItemsPerPage(limit);
              setCurrentPage(1);
            }}
            showFirstLast={true}
          />
        </div>
      </div>

      <ConfirmationModal
        isOpen={isOpen}
        title="Are you sure you want to delete this user?"
        width="400px"
        onCancel={closeAndResetModal}
        onConfirm={handleDelete}
      />
    </>
  );
}
