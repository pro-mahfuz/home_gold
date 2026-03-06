import { useMemo, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  PencilIcon,
  TrashIcon,
  ChevronDownIcon,
} from '@heroicons/react/20/solid';
import {
  PaginationControl,
  SearchControl,
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../../components/ui/table/index.tsx";
import PageBreadcrumb from "../../../components/common/PageBreadCrumb.tsx";
import PageMeta from "../../../components/common/PageMeta.tsx";
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react';

import { toast } from "react-toastify";
import { useModal } from "../../../hooks/useModal.ts";
import ConfirmationModal from "../../../components/ui/modal/ConfirmationModal.tsx";

import { Container } from "../features/containerTypes.ts";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../../../store/store.ts";
import {
  selectContainerStatus,
  selectAllContainer,
} from "../features/containerSelectors.ts";
import { fetchAll, destroy } from "../features/containerThunks.ts";

export default function ContainerList() {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const containers = useSelector(selectAllContainer);
  const status = useSelector(selectContainerStatus);

  const [filterText, setFilterText] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(10);

  const { isOpen, openModal, closeModal } = useModal();
  const [selectedContainer, setSelectedContainer] = useState<Container | null>(null);

  useEffect(() => {
    dispatch(fetchAll());
  }, [dispatch]);

  const filteredData = useMemo(() => {
  if (!filterText) return containers; // if no search text, return all

  const search = filterText.toLowerCase();

  return containers.filter((c) => {
    return (
      c.containerNo?.toLowerCase().includes(search) ||
      c.oceanVesselName?.toLowerCase().includes(search) ||
      c.blNo?.toLowerCase().includes(search) ||
      c.agentDetails?.toLowerCase().includes(search) ||
      c.sealNo?.toLowerCase().includes(search)
    );
  });
}, [containers, filterText]);


  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredData.slice(start, start + itemsPerPage);
  }, [filteredData, currentPage, itemsPerPage]);

  // const handleView = (container: Container) => {
  //   navigate(`/container/view/${container.id}`);
  // };

  const handleEdit = (container: Container) => {
    navigate(`/container/${container.id}/edit`);
  };

  const handleDelete = async () => {
    if (!selectedContainer) return;

    try {
      // You can implement a deleteSupplier thunk and use it here:
      await dispatch(destroy(selectedContainer.id!)).unwrap();
      toast.success("Invoice deleted successfully");
      closeAndResetModal();
      const categoryId = 0;
      navigate(`/container/${categoryId}/list`);
    } catch (error) {
      toast.error("Failed to delete invoice");
    }
  };

  const closeAndResetModal = () => {
    setSelectedContainer(null);
    closeModal();
  };

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(1);
    }
  }, [totalPages, currentPage]);

  return (
    <>
      <PageMeta
        title="Container List Table"
        description="Container Table with Search, Sort, Pagination"
      />
      <PageBreadcrumb pageTitle="Container List" />

      <div className="mb-4 flex justify-start">
          <div>
              <button
                  onClick={() => navigate(-1)}
                  className="bg-red-400 text-white px-2 py-1 rounded-full hover:bg-red-700 mr-4"
              >
                  Back
              </button>

              <button
                onClick={() => {navigate('/container/create')}}
                className="bg-lime-600 text-white px-2 py-1 rounded-full hover:bg-lime-900 mr-4"
              >
                Create
              </button>
          </div>
      </div>

      <div className="space-y-6">
        <div className="rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
          <div className="max-w-full">
            <SearchControl value={filterText} onChange={setFilterText} />

            <Table>
              <TableHeader className="border-b border-t border-gray-100 dark:border-white/[0.05] bg-gray-200 text-black text-sm dark:bg-gray-800 dark:text-gray-400">
                <TableRow>
                  <TableCell isHeader className="text-center px-4 py-2">Sl</TableCell>
                  <TableCell isHeader className="text-center px-4 py-2">Container No</TableCell>
                  <TableCell isHeader className="text-center px-4 py-2">Description</TableCell>
                  <TableCell isHeader className="text-center px-4 py-2">B.L No</TableCell>
                  <TableCell isHeader className="text-center px-4 py-2">Seal No</TableCell>
                   <TableCell isHeader className="text-center px-4 py-2">Ocean Vessel Name</TableCell>
                  <TableCell isHeader className="text-center px-4 py-2">Agent Name</TableCell>
                  <TableCell isHeader className="text-center px-4 py-2">isActive</TableCell>
                  <TableCell isHeader className="text-center px-4 py-2">Action</TableCell>
                </TableRow>
              </TableHeader>

              <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                {status === 'loading' ? (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center py-4 text-gray-500 dark:text-gray-300">
                      Loading data...
                    </TableCell>
                  </TableRow>
                ) : paginatedData.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center py-4 text-gray-500 dark:text-gray-300">
                      No data found.
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedData.map((container, index) => (
                    <TableRow key={container.id} className="border-b border-gray-100 dark:border-white/[0.05]">
                      <TableCell className="text-center px-4 py-2 text-sm text-gray-500 dark:text-gray-400">
                        {(currentPage - 1) * itemsPerPage + index + 1}
                      </TableCell>
                      <TableCell className="text-center px-4 py-2 text-sm text-gray-500 dark:text-gray-400">
                        {container.containerNo}
                      </TableCell>
                      <TableCell className="text-center px-4 py-2 text-sm text-gray-500 dark:text-gray-400">
                        {container.description}
                      </TableCell>
                      <TableCell className="text-center px-4 py-2 text-sm text-gray-500 dark:text-gray-400">
                        {container.blNo}
                      </TableCell>
                      <TableCell className="text-center px-4 py-2 text-sm text-gray-500 dark:text-gray-400">
                        {container.sealNo}
                      </TableCell>
                      <TableCell className="text-center px-4 py-2 text-sm text-gray-500 dark:text-gray-400">
                        {container.oceanVesselName}
                      </TableCell>
                      <TableCell className="text-center px-4 py-2 text-sm text-gray-500 dark:text-gray-400">
                        {container.agentDetails}
                      </TableCell>
                       <TableCell className="text-center px-4 py-2 text-sm text-gray-500 dark:text-gray-400">
                        {container.isActive ? 'Yes' : 'No'}
                      </TableCell>
                      <TableCell className="text-center px-4 py-2 text-sm overflow-visible">
                        <Menu as="div" className="relative inline-block text-left">
                          <MenuButton className="inline-flex items-center gap-1 rounded-full bg-sky-500 px-2 py-1 text-sm font-semibold text-white hover:bg-sky-700 focus:outline-none">
                            Actions
                            <ChevronDownIcon className="h-4 w-4 text-white" />
                          </MenuButton>

                          <MenuItems className="absolute right-0 z-50 mt-2 w-40 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-sky-500 ring-opacity-5 focus:outline-none">
                            <div className="py-1">
                              {/* <MenuItem>
                                {({ active }) => (
                                  <button
                                    onClick={() => handleView(container)}
                                    className={`${active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'} flex w-full items-center gap-2 px-4 py-2 text-sm`}
                                  >
                                    <EyeIcon className="h-4 w-4" />
                                    View
                                  </button>
                                )}
                              </MenuItem> */}
                              <MenuItem>
                                {({ active }) => (
                                  <button
                                    onClick={() => handleEdit(container)}
                                    className={`${active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'} flex w-full items-center gap-2 px-4 py-2 text-sm`}
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
                                      setSelectedContainer(container);
                                      openModal();
                                    }}
                                    className={`${active ? 'bg-red-100 text-red-700' : 'text-red-600'} flex w-full items-center gap-2 px-4 py-2 text-sm`}
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
            totalPages={totalPages}
            itemsPerPage={itemsPerPage}
            onPageChange={setCurrentPage}
            onItemsPerPageChange={setItemsPerPage}
          />
        </div>
      </div>

      <ConfirmationModal
        isOpen={isOpen}
        title="Are you sure you want to delete this supplier?"
        width="400px"
        onCancel={closeAndResetModal}
        onConfirm={handleDelete}
      />
    </>
  );
}
