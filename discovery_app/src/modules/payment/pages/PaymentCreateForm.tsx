import { FormEvent, ChangeEvent, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

import PageBreadcrumb from "../../../components/common/PageBreadCrumb";
import PageMeta from "../../../components/common/PageMeta";
import ComponentCard from "../../../components/common/ComponentCard";
import Label from "../../../components/form/Label";
import Input from "../../../components/form/input/InputField";
import DatePicker from "../../../components/form/date-picker.tsx";
import Button from "../../../components/ui/button/Button";
import Select from "react-select";
import AsyncSelect from "react-select/async";

import { AppDispatch } from "../../../store/store";
import { OptionStringType, CurrencyOptions, selectStyles } from "../../types.ts";
import { Payment, paymentOptions } from "../features/paymentTypes.ts";

import { create } from "../features/paymentThunks";
import { fetchAll as fetchPayment } from "../../payment/features/paymentThunks.ts";
import { fetchParty } from "../../party/features/partyThunks.ts";
import { fetchAllInvoicePagination } from "../../invoice/features/invoiceThunks.ts";
import { fetchAllAccount } from "../../account/features/accountThunks.ts";

import { selectAuth } from "../../auth/features/authSelectors";
import { selectUserById } from "../../user/features/userSelectors";
import { selectAllParties } from "../../party/features/partySelectors";
import { selectAllInvoicePagination } from "../../invoice/features/invoiceSelectors.ts";
import { selectAllAccount } from "../../account/features/accountSelectors.ts";

export default function PaymentCreateForm() {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const authUser = useSelector(selectAuth);
  const user = useSelector(selectUserById(Number(authUser.user?.id)));

  

  const [loading, setLoading] = useState(false);
  const [selectedParty, setSelectedParty] = useState<{ label: string; value: number } | null>(null);

  const [formData, setFormData] = useState<Payment>({
    businessId: 0,
    invoiceId: null,
    categoryId: null,
    partyId: null,
    paymentType: "",
    paymentDate: "",
    note: "",
    amountPaid: 0,
    paymentMethod: "",
    bankId: null,
    system: 1,
    currency: "",
    createdBy: 0,
  });

  // Load required data once
  useEffect(() => {
    dispatch(fetchPayment());
    dispatch(fetchAllInvoicePagination({ page: 1, limit: 10, type: "all", filterText: "" }));
    dispatch(fetchAllAccount());
    //dispatch(fetchPartyPaginated({ page: 1, limit: 10, type: "all", filterText: "" }));
    if ( matchingParties.length === 0) dispatch(fetchParty({ type: "all" }));
  }, [dispatch]);

  // Update form with user info
  useEffect(() => {
    if (user?.business?.id) {
      setFormData((prev) => ({
        ...prev,
        businessId: user?.business?.id,
        createdBy: user.id,
      }));
    }
  }, [user]);

  const matchingParties = useSelector(selectAllParties);
  const invoices = useSelector(selectAllInvoicePagination);
  const paymentAccounts = useSelector(selectAllAccount);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "partyId" || name === "categoryId" ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      await dispatch(create(formData));
      toast.success("Payment created successfully!");
      navigate(`/payment/list`);
    } catch {
      toast.error("Failed to create payment.");
    } finally {
      setLoading(false);
    }
  };

  // Async party loader (only fetch when searching)
  // const loadParties = async (inputValue: string) => {
  //   console.log("inputValue- ", inputValue);
  //   await dispatch(fetchPartyPaginated({ page: 1, limit: 10, type: "all", filterText: inputValue }));
  //   console.log(matchingParties.length);
  //   //const parties = useSelector(selectAllParties); // safe since Redux updated
  //   return matchingParties.map((p) => ({
  //     label: p.name,
  //     value: Number(p.id),
  //   }));
  // };

  const loadInvoices = async (inputValue: string) => {
    await dispatch(fetchAllInvoicePagination({ page: 1, limit: 10, type: "all", filterText: inputValue }));
    //const parties = useSelector(selectAllParties); // safe since Redux updated
    return invoices.map((i) => ({
        label: i.invoiceNo,
        value: i.id,
        invoiceType: i.invoiceType,
        categoryId: i.categoryId,
        partyId: i.partyId,
        partyName: i.party?.name,
    }));
  };

  return (
    <div>
      <PageMeta title="Payment Create" description="Form to create a new payment" />
      <PageBreadcrumb pageTitle="Payment Create" />

      <div className="mb-4 flex justify-start">
        <div>
          <button
            onClick={() => navigate(-1)}
            className="bg-red-400 text-white px-2 py-1 rounded-full hover:bg-red-700 mr-4"
          >
            Back
          </button>

          <button
            onClick={() => navigate('/payment/list')}
            className="bg-fuchsia-400 text-white px-2 py-1 rounded-full hover:bg-fuchsia-700 mr-4"
          >
            Payment List
          </button>
        </div>
      </div>

      <ComponentCard title="Fill up all fields to create a new payment">
        <form className="space-y-5" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Invoice */}
            <div>
              <Label>Select Invoice Ref (if have)</Label>
              <AsyncSelect
                cacheOptions
                defaultOptions={invoices.map((i) => ({
                  label: `#${i.invoiceNo}`,
                  value: i.id,
                  invoiceType: i.invoiceType,
                  categoryId: i.categoryId,
                  partyId: i.partyId,
                  partyName: i.party?.name,
                }))}
                loadOptions={loadInvoices}
                placeholder="Search invoice"
                onChange={(selectedOption) => {
                  setFormData((prev) => ({
                    ...prev,
                    invoiceId: Number(selectedOption?.value),
                    invoiceType: selectedOption?.invoiceType,
                    categoryId: Number(selectedOption?.categoryId),
                    partyId: Number(selectedOption?.partyId),
                  }));

                  // Update selected party without triggering re-fetch
                  if (selectedOption?.partyId && selectedOption?.partyName) {
                    setSelectedParty({
                      label: selectedOption.partyName,
                      value: Number(selectedOption.partyId),
                    });
                  }
                }}
                isClearable
                isSearchable
                styles={selectStyles}
                classNamePrefix="react-select"
              />
            </div>

            {/* Party */}
            <div>
              <Label>Select Party</Label>
              <Select
                options={matchingParties.map((p) => ({
                  label: p.name,
                  value: Number(p.id),
                }))}
                placeholder="Search and select party"
                value={selectedParty}
                onChange={(selectedOption) => {
                  // Update selected party
                  setSelectedParty(selectedOption);

                  // Update form data: set partyId and reset invoiceId
                  setFormData((prev) => ({
                    ...prev,
                    partyId: selectedOption?.value ?? 0,
                  }));
                }}
                isClearable
                styles={selectStyles}
                classNamePrefix="react-select"
              />
            </div>

            {/* Date */}
            <div>
              <DatePicker
                id="date-picker"
                label="Date"
                placeholder="Select a date"
                defaultDate={formData.paymentDate}
                onChange={(dates, currentDateString) => {
                  console.log(dates);
                  setFormData((prev) => ({
                    ...prev!,
                    paymentDate: currentDateString,
                  }));
                }}
              />
            </div>

            {/* Payment Type */}
            <div>
              <Label>Select Payment Type</Label>
              <Select<OptionStringType>
                options={paymentOptions}
                placeholder="Select Payment type"
                value={paymentOptions.find((o) => o.value === formData.paymentType) || null}
                onChange={(selectedOption) => {
                  if (selectedOption) {
                    setFormData((prev) => ({
                      ...prev,
                      paymentType: selectedOption.value,
                    }));
                  }
                }}
                styles={selectStyles}
                classNamePrefix="react-select"
                required
              />
            </div>

            {/* Currency */}
            <div>
              <Label>Select Currency</Label>
              <Select<OptionStringType>
                options={CurrencyOptions}
                placeholder="Select Currency"
                value={
                  formData
                    ? CurrencyOptions.find((o) => o.value === formData.currency)
                    : null
                }
                onChange={(selectedOption) => {
                  setFormData((prev) => ({
                    ...prev!,
                    currency: selectedOption!.value,
                  }));
                }}
                styles={selectStyles}
                classNamePrefix="react-select"
                required
              />
            </div>

            {/* Amount */}
            <div>
              <Label>Amount</Label>
              <Input
                type="number"
                name="amountPaid"
                placeholder="0"
                onChange={handleChange}
                step={0.01}
                required
              />
            </div>

            {/* Note */}
            <div className="md:col-span-2">
              <Label>Note</Label>
              <Input
                type="text"
                name="note"
                placeholder="Optional note"
                value={formData.note}
                onChange={handleChange}
              />
            </div>

            {/* Account */}
            {
              formData.paymentType !== "payable" && formData.paymentType !== "receivable" && (
                <div>
                  <Label>Select Payment Account</Label>
                  <Select
                    options={
                      paymentAccounts.map((b) => ({
                        label: b.accountName,
                        value: b.id,
                      })) || []
                    }
                    placeholder="Select Payment Account"
                    value={
                      paymentAccounts
                        ?.filter((b) => b.id === formData.bankId)
                        .map((b) => ({ label: b.accountName, value: b.id }))[0] || null
                    }
                    onChange={(selectedOption) =>
                      setFormData((prev) => ({
                        ...prev,
                        bankId: selectedOption?.value ?? 0,
                      }))
                    }
                    isClearable
                    styles={selectStyles}
                    classNamePrefix="react-select"
                    required
                  />
                </div>
              )
            }
            

            {/* Payment Details */}
            <div className="md:col-span-2">
              <Label>Payment Details (if have)</Label>
              <Input
                type="text"
                name="paymentDetails"
                placeholder="Optional payment details"
                value={formData.paymentDetails}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="flex justify-end">
            <Button type="submit" variant="success" disabled={loading}>
              {loading ? "Submitting..." : "Submit"}
            </Button>
          </div>
        </form>
      </ComponentCard>
    </div>
  );
}
