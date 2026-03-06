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
import { OptionStringType, CurrencyOptions, selectStyles} from "../../types.ts";
import { Payment, paymentOptions } from "../features/paymentTypes.ts";

import { create } from "../features/paymentThunks";
import { fetchParty } from "../../party/features/partyThunks.ts";
import { fetchAllInvoice } from "../../invoice/features/invoiceThunks.ts";
import { fetchAllAccount } from "../../account/features/accountThunks.ts";

import { selectAuth } from "../../auth/features/authSelectors";
import { selectUserById } from "../../user/features/userSelectors";
import { selectAllParties } from "../../party/features/partySelectors";
import { selectAllInvoice } from "../../invoice/features/invoiceSelectors.ts";
import { selectAllAccount } from "../../account/features/accountSelectors.ts";


export default function PaymentSys2CreateForm() {
    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>();
    const [filterText, setFilterText] = useState('');

    const authUser = useSelector(selectAuth);
    const user = useSelector(selectUserById(Number(authUser.user?.id)));

    useEffect(() => {
        dispatch(fetchParty({ type: "all" }))
        dispatch(fetchAllInvoice());
        dispatch(fetchAllAccount());
    }, [dispatch]);

    useEffect(() => {
        dispatch(fetchParty({ type: "all" }))
    }, [filterText]);

    const matchingParties = useSelector(selectAllParties);
    const invoices = useSelector(selectAllInvoice);
    const paymentAccounts = useSelector(selectAllAccount);

    const [formData, setFormData] = useState<Payment>({
        businessId: 0,
        invoiceId: null,
        categoryId: null,
        partyId: null,
        paymentType: '',
        paymentDate: "",
        note: "",
        amountPaid: 0,
        paymentMethod: "",
        bankId: 0,
        system: 2,
        currency: "",
        createdBy: 0,
    });

    useEffect(() => {
        if (user?.business?.id) {
          setFormData((prev) => ({
            ...prev,
            businessId: user?.business?.id,
            createdBy: user.id
          }));
        }
    }, [user]);


    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: name === "partyId" || name === "categoryId" ? Number(value) : value,
        }));
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
       
        try {
            // Dispatch create action, including totalAmount
            
            await dispatch(create(formData));
            toast.success("Payment created successfully!");

            navigate(`/paymentSys2/list`);
        } catch (err) {
            toast.error("Failed to create payment.");
        }
    };

    const loadParties = async (inputValue: any) => {
        try {
            setFilterText(inputValue);

            const parties = matchingParties || [];

            return parties.map((p) => ({
                label: p.name,
                value: p.id,
                type: p.type,
                phoneNumber: p.phoneNumber,
            }));
        } catch (err) {
            console.error("Error fetching parties:", err);
            return [];
        }
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
            onClick={() => navigate('/paymentSys2/list')}
            className="bg-fuchsia-400 text-white px-2 py-1 rounded-full hover:bg-fuchsia-700 mr-4"
          >
            Payment List
          </button>
        </div>
      </div>

        <ComponentCard title="Fill up all fields to create a new invoice">
            <form className="space-y-5" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                

                {/* Invoice Type */}
                <div>
                    <Label>Select Invoice Ref (if have)</Label>
                    <Select
                        options={invoices.filter(i => i.vatInvoiceRefNo).map((i) => ({
                            label: `#${i.vatInvoiceRefNo}`,
                            value: i.id,
                            invoiceType: i.invoiceType,
                            categoryId: i.categoryId,
                            partyId: i.partyId,
                            partyName: i.party?.name
                        }))}
                        placeholder="Select invoice type"

                        onChange={(selectedOption) => {
                            setFormData(prev => ({
                                ...prev,
                                invoiceId: Number(selectedOption!.value),
                                invoiceType: selectedOption?.invoiceType,
                                categoryId: Number(selectedOption?.categoryId),
                                partyId: Number(selectedOption?.partyId)
                            }));
                            setFilterText(selectedOption?.partyName ?? "");
                        }}
                        styles={selectStyles}
                        classNamePrefix="react-select"
                    />
                </div>

                {/* Search Party */}
                <div>
                    <Label>Search & Select Party (if have)</Label>
                    <AsyncSelect
                        cacheOptions
                        defaultOptions={matchingParties.map((p) => ({ label: p.name, value: p.id })) || null}
                        loadOptions={loadParties}
                        placeholder="Search and select party"
                        value={
                            matchingParties
                                .filter((p) => p.id === formData.partyId)
                                .map((p) => ({ label: p.name, value: p.id }))[0] || null
                        }
                        onChange={(selectedOption) =>{
                            if (!selectedOption) {
                                setFormData((prev) => ({ ...prev, partyId: null }));
                                return;
                            }

                                setFormData((prev) => ({
                                ...prev,
                                partyId: Number(selectedOption.value),
                            }));
                        }}
                        isClearable
                        isSearchable
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
                            console.log({ dates, currentDateString });
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
                        value={paymentOptions.find(option => option.value === formData.paymentType) || null}
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
                        required
                    />
                </div>

                {/* Paid Amount */}
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

                <div>
                    <Label>Select Payment Account</Label>
                    <Select
                        options={
                        paymentAccounts
                            .map((b) => ({
                                label: `${b.accountName}`,
                                value: b.id,
                            })) || []
                        }
                        placeholder="select Stock Accounts"
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

                {/* Note */}
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
                <Button type="submit" variant="success">
                Submit
                </Button>
            </div>
            </form>
        </ComponentCard>
        </div>
    );
}
