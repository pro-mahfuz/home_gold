import { FormEvent, ChangeEvent, useMemo, useState, useEffect } from "react";

import {
  PencilIcon,
  TrashIcon,
  ChevronDownIcon,
} from '@heroicons/react/20/solid';
import Label from "../../../components/form/Label.tsx";
import Input from "../../../components/form/input/InputField.tsx";
import Select, { SingleValue } from "react-select";
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

import { selectStyles, statusOptions, OptionBooleanType } from "../../types.ts";
import { Unit } from "../features/unitTypes.ts";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../../../store/store.ts";
import { selectUnitStatus, selectAllUnitByBusiness } from "../features/unitSelectors.ts";
import { createUnit, updateUnit, fetchAllUnit, destroyUnit } from "../features/unitThunks.ts";
import { selectUserById } from "../../user/features/userSelectors";
import { selectAuth } from "../../auth/features/authSelectors";

export default function UnitList() {
  const dispatch = useDispatch<AppDispatch>();

  const authUser = useSelector(selectAuth);
  const user = useSelector(selectUserById(Number(authUser.user?.id)));

  const [formData, setFormData] = useState<Unit>({
    businessId: 0,
    name: '',
    isActive: true,
  });

  useEffect(() => {
    if (user?.business?.id) {
      setFormData((prev) => ({
        ...prev,
        businessId: user.business!.id,
      }));
    }
  }, [user]);

  const [filterText, setFilterText] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [unitsPerPage, setUnitsPerPage] = useState<number>(10);

  const { isOpen, openModal, closeModal } = useModal();
  const [selectedUnit, setSelectedUnit] = useState<Unit | null>(null);

  useEffect(() => {
    dispatch(fetchAllUnit());
  }, [dispatch]);

  const units = useSelector(selectAllUnitByBusiness(user?.business?.id || 0));
  const status = useSelector(selectUnitStatus);

  const filteredData = useMemo(() => {
    return units.filter(unit =>
      unit?.name?.toLowerCase().includes(filterText.toLowerCase())
      
    );
  }, [units, filterText]);

  const totalPages = Math.ceil(filteredData.length / unitsPerPage);

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * unitsPerPage;
    return filteredData.slice(start, start + unitsPerPage);
  }, [filteredData, currentPage, unitsPerPage]);

  // Status handler
  const handleStatusChange = (newValue: SingleValue<OptionBooleanType>) => {
    setFormData((prev) => ({
      ...prev,
      isActive: newValue?.value ?? true,
    }));
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const resetForm = () => {
    setFormData({
      businessId: user?.business?.id ?? 0,
      name: '',
      isActive: true,
    });
    setSelectedUnit(null);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      console.log("formData: ", formData);
      if (selectedUnit) {
        await dispatch(updateUnit({ ...formData, id: selectedUnit.id })).unwrap();
        toast.success("Item updated successfully!");
      } else {
        await dispatch(createUnit(formData)).unwrap();
        toast.success("Item created successfully!");
      }
      resetForm();
      dispatch(fetchAllUnit()); // refresh list
    } catch (err) {
      toast.error("Failed to save item.");
    }
  };

  const handleEdit = (unit: Unit) => {
    setSelectedUnit(unit);
    setFormData({
      ...unit
    });
  };

  const handleDelete = async () => {
    if (!selectedUnit) return;
    try {
      await dispatch(destroyUnit(selectedUnit.id!)).unwrap();
      toast.success("Unit deleted successfully");
      closeAndResetModal();
      dispatch(fetchAllUnit()); // refresh list
    } catch (error) {
      toast.error("Failed to delete unit");
    }
  };

  const closeAndResetModal = () => {
    setSelectedUnit(null);
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
        title="Unit List Table"
        description="Unit Table with Search, Sort, Pagination"
      />
      <PageBreadcrumb pageTitle="Unit Create & List" />

      <div className="p-4 mb-4 border border-gray-300 rounded-lg bg-white dark:bg-gray-800 space-y-4">
        <h2 className="text-lg font-semibold">Create Unit</h2>
        <div className="flex">
          <div className="w-full">
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">

                <div>
                  <Label>Unit Name</Label>
                  <Input
                    type="text"
                    name="name"
                    placeholder="Enter name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div>
                  <Label>Select Status</Label>
                  <Select
                    value={
                      statusOptions.find(
                        (option) => option.value === formData.isActive
                      ) || null
                    }
                    options={statusOptions}
                    placeholder="Select status"
                    onChange={handleStatusChange}
                    isClearable
                    styles={selectStyles}
                    classNamePrefix="react-select"
                  />
                </div>

                <div className="flex justify-center mt-6 py-2">
                  <button
                    type="submit"
                    className="rounded-full bg-sky-500 text-white px-4 hover:bg-sky-700"
                  >
                    Submit
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="space-y-6">
        <div className="rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
          <div className="max-w-full">
            <SearchControl value={filterText} onChange={setFilterText} />

            <Table>
              <TableHeader className="border-b border-t border-gray-100 dark:border-white/[0.05] bg-gray-200 text-black text-sm dark:bg-gray-800 dark:text-gray-400">
                <TableRow>
                  <TableCell isHeader className="text-center px-4 py-2">Sl</TableCell>
                  <TableCell isHeader className="text-center px-4 py-2">Unit Name</TableCell>
                  <TableCell isHeader className="text-center px-4 py-2">isActive</TableCell>
                  <TableCell isHeader className="text-center px-4 py-2">Action</TableCell>
                </TableRow>
              </TableHeader>

              <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                {status === 'loading' ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-4 text-gray-500 dark:text-gray-300">
                      Loading data...
                    </TableCell>
                  </TableRow>
                ) : paginatedData.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-4 text-gray-500 dark:text-gray-300">
                      No data found.
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedData.map((unit, index) => (
                    <TableRow key={unit.id} className="border-b border-gray-100 dark:border-white/[0.05]">
                      <TableCell className="text-center px-4 py-2 text-sm text-gray-500 dark:text-gray-400">
                        {(currentPage - 1) * unitsPerPage + index + 1}
                      </TableCell>
                      <TableCell className="text-center px-4 py-2 text-sm text-gray-500 dark:text-gray-400">
                        {unit.name}
                      </TableCell>
                      <TableCell className="text-center px-4 py-2 text-sm text-gray-500 dark:text-gray-400">
                        {unit.isActive ? 'Yes' : 'No'}
                      </TableCell>

                      <TableCell className="text-center px-4 py-2 text-sm overflow-visible">
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
                                    onClick={() => handleEdit(unit)}
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
                                      setSelectedUnit(unit);
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
            itemsPerPage={unitsPerPage}
            onPageChange={setCurrentPage}
            onItemsPerPageChange={setUnitsPerPage}
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
