import { FormEvent, ChangeEvent, useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
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
//import AsyncSelect from "react-select/async";

import { AppDispatch } from "../../../store/store";
import { OptionStringType, CurrencyOptions } from "../../types.ts";
import { Payment, paymentOptions } from "../features/paymentTypes.ts";

import { update } from "../features/paymentThunks";
import { fetchAll as fetchPayment } from "../../payment/features/paymentThunks.ts";
import { fetchParty } from "../../party/features/partyThunks.ts";
import { fetchAllInvoice } from "../../invoice/features/invoiceThunks.ts";
import { fetchAllAccount } from "../../account/features/accountThunks.ts";

import { selectAuth } from "../../auth/features/authSelectors";
import { selectUserById } from "../../user/features/userSelectors";
import { selectAllPartyPagination } from "../../party/features/partySelectors";
import { selectPaymentById } from "../../payment/features/paymentSelectors.ts";
import { selectAllInvoice } from "../../invoice/features/invoiceSelectors.ts";
import { selectAllAccount } from "../../account/features/accountSelectors.ts";

export default function PaymentEditForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const [loading, setLoading] = useState(false);
  const [selectedParty, setSelectedParty] = useState<{ label: string; value: number } | null>(null);

  const authUser = useSelector(selectAuth);
  const user = useSelector(selectUserById(Number(authUser.user?.id)));
  const matchingParties = useSelector(selectAllPartyPagination);
  const invoices = useSelector(selectAllInvoice);
  const payment = useSelector(selectPaymentById(Number(id)));
  const paymentAccounts = useSelector(selectAllAccount);

  // Initial data load
  useEffect(() => {
    //dispatch(fetchPartyPaginated({ page: 1, limit: 10, type: "all", filterText: "" }));
    if ( matchingParties.length === 0) dispatch(fetchParty({ type: "all" }));
    dispatch(fetchPayment());
    if (invoices.length === 0) dispatch(fetchAllInvoice());
    dispatch(fetchAllAccount());
  }, [dispatch]);

  const [formData, setFormData] = useState<Payment>({
    businessId: 0,
    invoiceId: null,
    categoryId: null,
    partyId: null,
    paymentType: "",
    paymentDate: "",
    note: "",
    amountPaid: 0,
    bankId: 0,
    paymentDetails: "",
    currency: "",
    system: 1,
    createdBy: 0,
    updatedBy: 0,
  });

  // Populate form data when payment is loaded
  useEffect(() => {
    if (user?.business?.id && payment) {
      setFormData({
        id: payment.id,
        businessId: user?.business?.id,
        invoiceId: payment.invoiceId,
        categoryId: payment.categoryId,
        partyId: payment.partyId,
        paymentType: payment.paymentType,
        paymentDate: payment.paymentDate,
        note: payment.note,
        amountPaid: payment.amountPaid,
        bankId: payment.bankId,
        paymentDetails: payment.paymentDetails,
        system: 1,
        currency: payment.currency,
        createdBy: payment.createdBy,
        updatedBy: user.id,
      });

      if (payment.party) {
        setSelectedParty({ label: payment.party.name, value: Number(payment.partyId) });
      }
    }
  }, [user, payment]);

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
      await dispatch(update(formData));
      toast.success("Payment updated successfully!");
      dispatch(fetchPayment());
      navigate(`/payment/list`);
    } catch {
      toast.error("Failed to update payment.");
    } finally {
      setLoading(false);
    }
  };

  // Styles for react-select
  const selectStyles = {
    control: (base: any, state: any) => ({
      ...base,
      borderColor: state.isFocused ? "#72a4f5ff" : "#d1d5db",
      boxShadow: state.isFocused ? "0 0 0 1px #8eb8fcff" : "none",
      padding: "0.25rem 0.5rem",
      borderRadius: "0.375rem",
      minHeight: "38px",
      fontSize: "0.875rem",
      "&:hover": { borderColor: "#3b82f6" },
    }),
    menu: (base: any) => ({
      ...base,
      zIndex: 20,
    }),
    option: (base: any, state: any) => ({
      ...base,
      backgroundColor: state.isFocused ? "#e0f2fe" : "white",
      color: "#1f2937",
      fontSize: "0.875rem",
      padding: "0.5rem 0.75rem",
    }),
  };

  // Load party options
  // const loadParties = async (inputValue: string) => {
  //   console.log("inputValue- ", inputValue);
  //   if (inputValue.length > 1) {
  //     await dispatch(fetchPartyPaginated({ page: 1, limit: 10, type: "all", filterText: inputValue }));
  //   }
  //   //const parties = useSelector(selectAllParties);
  //   console.log("parties- ", matchingParties.length);
  //   return matchingParties.map((p) => ({
  //     label: p.name,
  //     value: Number(p.id),
  //     type: p.type,
  //     phoneNumber: p.phoneNumber,
  //   }));
  // };

  const handleView = (payment: Payment) => {
    navigate(`/payment/${payment.id}/view`);
  };
  
  const handleList = () => {
    navigate(`/payment/list`);
  };

  return (
    <div>
      <PageMeta title="Payment Update" description="Form to create a payment" />
      <PageBreadcrumb pageTitle="Payment Update" />

      <div className="mb-4 flex justify-start">
        <div>
          <button
            onClick={() => navigate(-1)}
            className="bg-red-400 text-white px-2 py-1 rounded-full hover:bg-red-700 mr-4"
          >
            Back
          </button>

          <button
            onClick={() => handleList()}
            className="bg-fuchsia-400 text-white px-2 py-1 rounded-full hover:bg-fuchsia-700 mr-4"
          >
            Payment List
          </button>

          <button
            onClick={() => {
              if (payment) handleView(payment);
            }}
            className="bg-blue-600 text-white px-2 py-1 rounded-full hover:bg-blue-700"
          >
            View
          </button>
        </div>
      </div>

      <ComponentCard title="Modify fields to update a payment">
        <form className="space-y-5" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Invoice Select */}
            <div>
              <Label>Select Invoice Ref (if have)</Label>
              <Select
                options={invoices.map((i) => ({
                  label: `#${i.invoiceNo}`,
                  value: i.id,
                  invoiceType: i.invoiceType,
                  categoryId: i.categoryId,
                  partyId: i.partyId,
                  partyName: i.party?.name,
                }))}
                placeholder="Select invoice"
                value={
                  invoices
                    .map((i) => ({
                      label: `#${i.invoiceNo}`,
                      value: i.id,
                      invoiceType: i.invoiceType,
                      categoryId: i.categoryId,
                      partyId: i.partyId,
                      partyName: i.party?.name,
                    }))
                    .find((option) => option.value === formData.invoiceId) || null
                }
                onChange={(selectedOption) => {
                  setFormData((prev) => ({
                    ...prev,
                    invoiceId: Number(selectedOption?.value),
                    invoiceType: selectedOption?.invoiceType,
                    categoryId: Number(selectedOption?.categoryId),
                    partyId: Number(selectedOption?.partyId),
                  }));

                  // set selected party locally (no re-fetch)
                  if (selectedOption?.partyName && selectedOption?.partyId) {
                    setSelectedParty({
                      label: selectedOption.partyName,
                      value: Number(selectedOption.partyId),
                    });
                  }
                }}
                styles={selectStyles}
                isClearable
                classNamePrefix="react-select"
              />
            </div>

            {/* Party Select */}
            {/* <div>
              <Label>Search & Select Party (if have)</Label>
              <AsyncSelect
                cacheOptions
                defaultOptions={matchingParties.map((p) => ({
                  label: p.name,
                  value: Number(p.id),
                }))}
                loadOptions={loadParties}
                placeholder="Search and select party"
                value={selectedParty}
                onChange={(selectedOption) => {
                  setSelectedParty(selectedOption);
                  setFormData((prev) => ({
                    ...prev,
                    partyId: selectedOption ? Number(selectedOption.value) : null,
                  }));
                }}
                isClearable
                isSearchable
                styles={selectStyles}
                classNamePrefix="react-select"
              />
            </div> */}
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
                placeholder="Select payment type"
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
                    ? CurrencyOptions.find((option) => option.value === formData.currency)
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
              />
            </div>

            {/* Amount */}
            <div>
              <Label>Amount</Label>
              <Input
                type="number"
                name="amountPaid"
                placeholder="Enter amount"
                value={formData.amountPaid}
                onChange={handleChange}
                step={0.01}
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

            {/* Payment Account */}
            {
              formData.paymentType !== "payable" && formData.paymentType !== "receivable" && (
                <div>
                  <Label>Select Payment Account</Label>
                  <Select
                    options={
                      paymentAccounts.map((b) => ({
                        label: `${b.accountName}`,
                        value: b.id,
                      })) || []
                    }
                    placeholder="Select account"
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
