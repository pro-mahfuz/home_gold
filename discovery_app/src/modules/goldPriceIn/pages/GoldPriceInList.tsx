import { ChangeEvent, FormEvent, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { ChevronDownIcon, PencilIcon, TrashIcon } from "@heroicons/react/20/solid";
import { toast } from "react-toastify";
import PageBreadcrumb from "../../../components/common/PageBreadCrumb";
import PageMeta from "../../../components/common/PageMeta";
import Label from "../../../components/form/Label";
import Input from "../../../components/form/input/InputField";
import ConfirmationModal from "../../../components/ui/modal/ConfirmationModal";
import {
  PaginationControl,
  SearchControl,
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../../components/ui/table";
import { useModal } from "../../../hooks/useModal";
import { AppDispatch } from "../../../store/store";
import { selectAuth } from "../../auth/features/authSelectors";
import { selectUserById } from "../../user/features/userSelectors";
import {
  selectAllGoldPriceInByBusiness,
  selectGoldPriceInStatus,
  selectLatestGoldPriceIn,
} from "../features/goldPriceInSelectors";
import {
  createGoldPriceIn,
  destroyGoldPriceIn,
  fetchAllGoldPriceIn,
  fetchLatestGoldPriceIn,
  updateGoldPriceIn,
} from "../features/goldPriceInThunks";
import { GoldPriceIn } from "../features/goldPriceInTypes";

type FieldConfig = {
  name: keyof GoldPriceIn;
  label: string;
};

const fieldGroups: { title: string; fields: FieldConfig[] }[] = [
  {
    title: "Market Base",
    fields: [
      { name: "goldSpotRate", label: "Gold Spot Rate" },
      { name: "dollarRate", label: "Dollar Rate" },
      { name: "ounceRateDirham", label: "Ounce Rate Dirham" },
      { name: "ounceGram", label: "Ounce Gram" },
      { name: "999_rateGram", label: "999 Rate / Gram" },
      { name: "995_rateGram", label: "995 Rate / Gram" },
      { name: "992_rateGram", label: "992 Rate / Gram" },
    ],
  },
  {
    title: "Rate Matrix",
    fields: [
      { name: "buyRate", label: "Buy Rate" },
      { name: "sellRate", label: "Sell Rate" },
      { name: "carretRate", label: "Carret Rate" },
      { name: "buy_MC", label: "Buy MC" },
      { name: "sell_MC", label: "Sell MC" },
      { name: "carret_MC", label: "Carret MC" },
      { name: "buy_CC", label: "Buy CC" },
      { name: "sell_CC", label: "Sell CC" },
      { name: "carret_CC", label: "Carret CC" },
    ],
  },
  {
    title: "Profit and Gram",
    fields: [
      { name: "buyAddProfit", label: "Buy Add Profit" },
      { name: "sellAddProfit", label: "Sell Add Profit" },
      { name: "carretAddProfit", label: "Carret Add Profit" },
      { name: "buyPricePerGram", label: "Buy Price / Gram" },
      { name: "sellPricePerGram", label: "Sell Price / Gram" },
      { name: "carretPricePerGram", label: "Carret Price / Gram" },
      { name: "boriGram", label: "Bori Gram" },
    ],
  },
  {
    title: "Totals",
    fields: [
      { name: "buyTotalDirham", label: "Buy Total Dirham" },
      { name: "sellTotalDirham", label: "Sell Total Dirham" },
      { name: "carretTotalDirham", label: "Carret Total Dirham" },
      { name: "buyBdtRate", label: "Buy BDT Rate" },
      { name: "sellBdtRate", label: "Sell BDT Rate" },
      { name: "carretBdtRate", label: "Carret BDT Rate" },
      { name: "buyTotalBdtBori", label: "Buy Total BDT / Bori" },
      { name: "sellTotalBdtBori", label: "Sell Total BDT / Bori" },
      { name: "carretTotalBdtBori", label: "Carret Total BDT / Bori" },
    ],
  },
];

const createInitialFormData = (businessId = 0): GoldPriceIn => ({
  businessId,
  goldSpotRate: "",
  dollarRate: "",
  ounceRateDirham: "",
  ounceGram: "",
  "999_rateGram": "",
  "995_rateGram": "",
  "992_rateGram": "",
  buyRate: "",
  sellRate: "",
  carretRate: "",
  buy_MC: "",
  sell_MC: "",
  carret_MC: "",
  buy_CC: "",
  sell_CC: "",
  carret_CC: "",
  buyAddProfit: "",
  sellAddProfit: "",
  carretAddProfit: "",
  buyPricePerGram: "",
  sellPricePerGram: "",
  carretPricePerGram: "",
  boriGram: "",
  buyTotalDirham: "",
  sellTotalDirham: "",
  carretTotalDirham: "",
  buyBdtRate: "",
  sellBdtRate: "",
  carretBdtRate: "",
  buyTotalBdtBori: "",
  sellTotalBdtBori: "",
  carretTotalBdtBori: "",
});

const formatNumeric = (value?: string | number | null) => {
  if (value === null || value === undefined || value === "") return "-";
  return value;
};

const formatDateTime = (value?: string) => {
  if (!value) return "-";
  return new Date(value).toLocaleString();
};

export default function GoldPriceInList() {
  const dispatch = useDispatch<AppDispatch>();
  const authUser = useSelector(selectAuth);
  const user = useSelector(selectUserById(Number(authUser.user?.id)));
  const businessId = Number(user?.business?.id ?? 0);

  const [formData, setFormData] = useState<GoldPriceIn>(createInitialFormData(businessId));
  const [selectedEntry, setSelectedEntry] = useState<GoldPriceIn | null>(null);
  const [filterText, setFilterText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const { isOpen, openModal, closeModal } = useModal();

  const goldPrices = useSelector(selectAllGoldPriceInByBusiness(businessId));
  const latestGoldPrice = useSelector(selectLatestGoldPriceIn);
  const status = useSelector(selectGoldPriceInStatus);

  useEffect(() => {
    dispatch(fetchAllGoldPriceIn());
    dispatch(fetchLatestGoldPriceIn());
  }, [dispatch]);

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      businessId,
    }));
  }, [businessId]);

  const filteredData = useMemo(() => {
    const search = filterText.toLowerCase().trim();
    if (!search) return goldPrices;

    return goldPrices.filter((entry) =>
      [
        entry.goldSpotRate,
        entry.dollarRate,
        entry.buyRate,
        entry.sellRate,
        entry.carretRate,
        entry.createdAt,
      ]
        .map((value) => String(value ?? "").toLowerCase())
        .some((value) => value.includes(search))
    );
  }, [goldPrices, filterText]);

  const totalPages = Math.max(1, Math.ceil(filteredData.length / itemsPerPage));

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredData.slice(start, start + itemsPerPage);
  }, [filteredData, currentPage, itemsPerPage]);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(1);
    }
  }, [currentPage, totalPages]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const resetForm = () => {
    setFormData(createInitialFormData(businessId));
    setSelectedEntry(null);
  };

  const handleEdit = (entry: GoldPriceIn) => {
    setSelectedEntry(entry);
    setFormData({
      ...createInitialFormData(businessId),
      ...entry,
      businessId,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      if (selectedEntry?.id) {
        await dispatch(updateGoldPriceIn({ ...formData, id: selectedEntry.id })).unwrap();
        toast.success("Gold price data updated successfully");
      } else {
        await dispatch(createGoldPriceIn(formData)).unwrap();
        toast.success("Gold price data created successfully");
      }

      resetForm();
      dispatch(fetchAllGoldPriceIn());
      dispatch(fetchLatestGoldPriceIn());
    } catch (error: any) {
      toast.error(error || "Failed to save gold price data");
    }
  };

  const handleDelete = async () => {
    if (!selectedEntry?.id) return;

    try {
      await dispatch(destroyGoldPriceIn(selectedEntry.id)).unwrap();
      toast.success("Gold price data deleted successfully");
      dispatch(fetchAllGoldPriceIn());
      dispatch(fetchLatestGoldPriceIn());
      closeModal();
      resetForm();
    } catch (error: any) {
      toast.error(error || "Failed to delete gold price data");
    }
  };

  return (
    <>
      <PageMeta title="Gold Price In" description="Gold price create and list module" />
      <PageBreadcrumb pageTitle="Gold Price In" />

      <div className="space-y-6">
        <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-white/[0.05] dark:bg-white/[0.03]">
          <div className="mb-5 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white/90">
                {selectedEntry ? "Update Gold Price Snapshot" : "Create Gold Price Snapshot"}
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Store market rates, margin values, and total calculations in one place.
              </p>
            </div>
            <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-200">
              Latest saved:
              {" "}
              <span className="font-semibold">
                Spot {formatNumeric(latestGoldPrice?.goldSpotRate)}
              </span>
              {" | "}
              <span className="font-semibold">
                Dollar {formatNumeric(latestGoldPrice?.dollarRate)}
              </span>
              {" | "}
              <span>{formatDateTime(latestGoldPrice?.createdAt)}</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {fieldGroups.map((group) => (
              <div key={group.title}>
                <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-600 dark:text-gray-300">
                  {group.title}
                </h3>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
                  {group.fields.map((field) => (
                    <div key={String(field.name)}>
                      <Label>{field.label}</Label>
                      <Input
                        type="number"
                        step={0.000001}
                        name={String(field.name)}
                        placeholder="0"
                        value={(formData[field.name] as string | number | undefined) ?? ""}
                        onChange={handleChange}
                      />
                    </div>
                  ))}
                </div>
              </div>
            ))}

            <div className="flex flex-wrap gap-3">
              <button
                type="submit"
                className="rounded-full bg-sky-500 px-5 py-2 text-sm font-semibold text-white hover:bg-sky-700"
              >
                {selectedEntry ? "Update Snapshot" : "Save Snapshot"}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="rounded-full border border-gray-300 px-5 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-100 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
              >
                Reset
              </button>
            </div>
          </form>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
          <div className="max-w-full">
            <SearchControl value={filterText} onChange={setFilterText} placeHolder="Search saved snapshots..." />

            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="border-b border-t border-gray-100 bg-gray-200 text-sm text-black dark:border-white/[0.05] dark:bg-gray-800 dark:text-gray-400">
                  <TableRow>
                    <TableCell isHeader className="px-4 py-2 text-center">Sl</TableCell>
                    <TableCell isHeader className="px-4 py-2 text-center">Created</TableCell>
                    <TableCell isHeader className="px-4 py-2 text-center">Spot</TableCell>
                    <TableCell isHeader className="px-4 py-2 text-center">Dollar</TableCell>
                    <TableCell isHeader className="px-4 py-2 text-center">Buy Rate</TableCell>
                    <TableCell isHeader className="px-4 py-2 text-center">Sell Rate</TableCell>
                    <TableCell isHeader className="px-4 py-2 text-center">Carret Rate</TableCell>
                    <TableCell isHeader className="px-4 py-2 text-center">Buy AED</TableCell>
                    <TableCell isHeader className="px-4 py-2 text-center">Sell AED</TableCell>
                    <TableCell isHeader className="px-4 py-2 text-center">Buy BDT</TableCell>
                    <TableCell isHeader className="px-4 py-2 text-center">Sell BDT</TableCell>
                    <TableCell isHeader className="px-4 py-2 text-center">Action</TableCell>
                  </TableRow>
                </TableHeader>

                <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                  {status === "loading" ? (
                    <TableRow>
                      <TableCell colSpan={12} className="py-4 text-center text-gray-500 dark:text-gray-300">
                        Loading data...
                      </TableCell>
                    </TableRow>
                  ) : paginatedData.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={12} className="py-4 text-center text-gray-500 dark:text-gray-300">
                        No data found.
                      </TableCell>
                    </TableRow>
                  ) : (
                    paginatedData.map((entry, index) => (
                      <TableRow key={entry.id} className="border-b border-gray-100 dark:border-white/[0.05]">
                        <TableCell className="px-4 py-2 text-center text-sm text-gray-500 dark:text-gray-400">
                          {(currentPage - 1) * itemsPerPage + index + 1}
                        </TableCell>
                        <TableCell className="px-4 py-2 text-center text-sm text-gray-500 dark:text-gray-400">
                          {formatDateTime(entry.createdAt)}
                        </TableCell>
                        <TableCell className="px-4 py-2 text-center text-sm text-gray-500 dark:text-gray-400">
                          {formatNumeric(entry.goldSpotRate)}
                        </TableCell>
                        <TableCell className="px-4 py-2 text-center text-sm text-gray-500 dark:text-gray-400">
                          {formatNumeric(entry.dollarRate)}
                        </TableCell>
                        <TableCell className="px-4 py-2 text-center text-sm text-gray-500 dark:text-gray-400">
                          {formatNumeric(entry.buyRate)}
                        </TableCell>
                        <TableCell className="px-4 py-2 text-center text-sm text-gray-500 dark:text-gray-400">
                          {formatNumeric(entry.sellRate)}
                        </TableCell>
                        <TableCell className="px-4 py-2 text-center text-sm text-gray-500 dark:text-gray-400">
                          {formatNumeric(entry.carretRate)}
                        </TableCell>
                        <TableCell className="px-4 py-2 text-center text-sm text-gray-500 dark:text-gray-400">
                          {formatNumeric(entry.buyTotalDirham)}
                        </TableCell>
                        <TableCell className="px-4 py-2 text-center text-sm text-gray-500 dark:text-gray-400">
                          {formatNumeric(entry.sellTotalDirham)}
                        </TableCell>
                        <TableCell className="px-4 py-2 text-center text-sm text-gray-500 dark:text-gray-400">
                          {formatNumeric(entry.buyTotalBdtBori)}
                        </TableCell>
                        <TableCell className="px-4 py-2 text-center text-sm text-gray-500 dark:text-gray-400">
                          {formatNumeric(entry.sellTotalBdtBori)}
                        </TableCell>
                        <TableCell className="overflow-visible px-4 py-2 text-center text-sm">
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
                                      onClick={() => handleEdit(entry)}
                                      className={`${active ? "bg-gray-100 text-gray-900" : "text-gray-700"} flex w-full items-center gap-2 px-4 py-2 text-sm`}
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
                                        setSelectedEntry(entry);
                                        openModal();
                                      }}
                                      className={`${active ? "bg-red-100 text-red-700" : "text-red-600"} flex w-full items-center gap-2 px-4 py-2 text-sm`}
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
          </div>

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
        title="Are you sure you want to delete this gold price snapshot?"
        width="400px"
        onCancel={closeModal}
        onConfirm={handleDelete}
      />
    </>
  );
}
