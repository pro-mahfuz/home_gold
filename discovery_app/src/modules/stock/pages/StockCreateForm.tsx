import { FormEvent, ChangeEvent, useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import PageBreadcrumb from "../../../components/common/PageBreadCrumb.tsx";
import PageMeta from "../../../components/common/PageMeta.tsx";
import ComponentCard from "../../../components/common/ComponentCard.tsx";
import Label from "../../../components/form/Label.tsx";
import Input from "../../../components/form/input/InputField.tsx";
import DatePicker from "../../../components/form/date-picker.tsx";
import Button from "../../../components/ui/button/Button.tsx";
import Select from "react-select";

import { AppDispatch } from "../../../store/store.ts";
import { OptionStringType, MovementTypeOptions, selectStyles } from "../../types.ts";
import { Stock } from "../features/stockTypes.ts";

import { create } from "../features/stockThunks.ts";
import { fetchAllInvoice } from "../../invoice/features/invoiceThunks.ts";
import { fetchAll as fetchContainer } from "../../container/features/containerThunks.ts";
import { fetchAllItem } from "../../item/features/itemThunks.ts";
import { fetchAllWarehouse } from "../../warehouse/features/warehouseThunks.ts";
import { fetchAllCategory } from "../../category/features/categoryThunks.ts";
import { fetchAllAccount } from "../../account/features/accountThunks.ts";
import { selectAllUnitByBusiness } from "../../unit/features/unitSelectors.ts";
import { fetchAllUnit } from "../../unit/features/unitThunks.ts";
import { fetchParty } from "../../party/features/partyThunks.ts";

import { selectAuth } from "../../auth/features/authSelectors.ts";
import { selectUserById } from "../../user/features/userSelectors.ts";
import { selectAllInvoice } from "../../invoice/features/invoiceSelectors.ts";
import { selectAllItem } from "../../item/features/itemSelectors.ts";
import { selectAllWarehouse } from "../../warehouse/features/warehouseSelectors.ts";
import { selectAllContainer } from "../../container/features/containerSelectors";
import { selectAllCategory } from "../../category/features/categorySelectors";
import { selectAllAccount } from "../../account/features/accountSelectors.ts";
import { selectAllParties } from "../../party/features/partySelectors.ts";


export default function StockCreateForm() {
    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>();

    useEffect(() => {
        if(invoices.length === 0){
            dispatch(fetchAllInvoice());
        }
        dispatch(fetchContainer());
        dispatch(fetchAllWarehouse());
        dispatch(fetchAllCategory());
        dispatch(fetchAllItem());
        dispatch(fetchAllAccount());
        dispatch(fetchAllUnit());
        dispatch(fetchParty({ type: "all" }));
    }, [dispatch]);

    const authUser = useSelector(selectAuth);
    const user = useSelector(selectUserById(Number(authUser.user?.id)));
    // console.log("Invoice authUser: ", authUser);
    // console.log("Invoice user: ", user);

    const items = useSelector(selectAllItem);
    const invoices = useSelector(selectAllInvoice);
    const warehouses = useSelector(selectAllWarehouse);
    const categories = useSelector(selectAllCategory);
    const paymentAccounts = useSelector(selectAllAccount);
    const UnitOptions = useSelector(selectAllUnitByBusiness(Number(user?.business?.id)));
    const parties = useSelector(selectAllParties);

    

    const [formData, setFormData] = useState<Stock>({
        businessId: 0,
        date: '',
        invoiceType: undefined,        
        invoiceId: undefined,
        partyId: undefined,
        categoryId: 0,
        itemId: 0,
        containerId: null,
        movementType: '',
        warehouseId: null,
        toWarehouseId: null,
        bankId: null,
        quantity: 0,
        unit: ''
    });

    const containers = useSelector(selectAllContainer);

    useEffect(() => {
        if (user?.business?.id) {
          setFormData((prev) => ({
            ...prev,
            businessId: user?.business?.id,
            createdBy: user.id
          }));
        }

    }, [user, formData.categoryId]);


    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: name === "partyId" || name === "categoryId" ? Number(value) : value,
        }));
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (formData.movementType === "stock_transfer") {
            if (!(Number(formData.warehouseId) > 0)) {
                toast.error("Please select From Warehouse for stock transfer.");
                return;
            }
            
        }
       
        try {
            // Dispatch create action, including totalAmount
            console.log("Stock formData: ", formData);
            await dispatch(create(formData));
            toast.success("Stock created successfully!");

            navigate(`/stock/list`);
        } catch (err) {
            toast.error("Failed to create stock.");
        }
    };

    const handleList = () => {
        navigate(`/stock/list`);
    };

    return (
        <div>
        <PageMeta title="Stock Create" description="Form to create a new stock" />
        <PageBreadcrumb pageTitle="Stock Create" />

        <div className="mb-4 flex justify-start">
            <div>
                <button
                    onClick={() => navigate(-1)}
                    className="bg-red-400 text-white px-2 py-1 rounded-full hover:bg-red-700 mr-4"
                >
                    Back
                </button>

                <button
                    onClick={() => {handleList()}}
                    className="bg-fuchsia-400 text-white px-2 py-1 rounded-full hover:bg-fuchsia-700 mr-4"
                >
                    Stock List
                </button>
                
            </div>
        </div>

        <ComponentCard title="Fill up all fields to create a new stock">
            <form className="space-y-5" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                

                {/* Invoice Type */}
                <div>
                    <Label>Select Invoice Ref</Label>
                    <Select
                        options={invoices.map((i) => ({
                            label: `#${i.invoiceNo ?? "No name"}`,
                            value: i.id,
                            invoiceType: i.invoiceType,
                            categoryId: i.categoryId,
                            partyId: i.partyId
                        }))}
                        placeholder="Select invoice type"
                        isClearable

                        onChange={(selectedOption) => {
                            if (!selectedOption) {
                                setFormData(prev => ({
                                    ...prev,
                                    invoiceId: undefined,
                                    invoiceType: undefined,
                                }));
                                return;
                            }

                            setFormData(prev => ({
                                ...prev,
                                invoiceId: Number(selectedOption.value),
                                invoiceType: selectedOption?.invoiceType,
                                categoryId: Number(selectedOption?.categoryId) || prev.categoryId,
                                partyId: selectedOption?.partyId ? Number(selectedOption.partyId) : prev.partyId
                                
                            }));
                        }}
                        styles={selectStyles}
                        classNamePrefix="react-select"
                    />
                </div>

                <div>
                    <Label>Select Party (Optional)</Label>
                    <Select
                        options={parties.map((p) => ({
                            label: `${p.name}`,
                            value: p.id,
                        }))}
                        placeholder="Select party"
                        isClearable
                        value={
                            parties
                                .filter((p) => p.id === formData.partyId)
                                .map((p) => ({ label: p.name, value: p.id }))[0] || null
                        }
                        onChange={(selectedOption) => {
                            setFormData((prev) => ({
                                ...prev,
                                partyId: selectedOption?.value,
                            }));
                        }}
                        styles={selectStyles}
                        classNamePrefix="react-select"
                    />
                </div>

                {/* Invoice Type */}
                <div>
                    <Label>Select Movement Type</Label>
                    <Select<OptionStringType>
                        options={MovementTypeOptions}
                        placeholder="Select movement type"
                        value={MovementTypeOptions.find(option => option.value === formData.movementType)}
                        onChange={(selectedOption) => {
                            setFormData(prev => ({
                                ...prev,
                                movementType: selectedOption!.value,
                            }));
                        }}
                        styles={selectStyles}
                        classNamePrefix="react-select"
                        required
                    />
                </div>

                {/* Date */}
                <div>
                    <DatePicker
                        id="date-picker"
                        label="Date"
                        placeholder="Select a date"
                        defaultDate={formData.date}
                        onChange={(dates, currentDateString) => {
                            console.log({ dates, currentDateString });
                            setFormData((prev) => ({
                                ...prev!,
                                date: currentDateString, 
                            }));
                        }}
                    />
                </div>

                <div>
                    <Label>Select Item</Label>
                    <Select
                        options={
                        items?.map(i => ({
                            label: i.name,
                            value: i.id,
                        })) || []
                        }
                        placeholder="Search and select item"
                        value={
                        items
                            ?.filter(i => i.id === formData.itemId)
                            .map(i => ({ label: i.name, value: i.id }))[0] || null
                        }
                        onChange={(selectedOption) =>
                        setFormData((prev) => ({
                            ...prev,
                            itemId: Number(selectedOption?.value) || 0,
                        }))
                        }
                        isClearable
                        styles={selectStyles}
                        classNamePrefix="react-select"
                        required
                    />
                </div>

                {!categories.find((c) => ["currency", "gold"].includes(c.name.toLowerCase()) ) && (
                    <div>
                        <Label>Select Container</Label>
                        <Select
                            options={containers.map((i) => ({
                                label: `${i.containerNo}`,
                                value: i.id,
                            })) || []}
                            placeholder="Search and select item"
                            value={
                                containers
                                .map((i) => ({
                                    label: `${i.containerNo}`,
                                    value: i.id,
                                }))
                                .find((opt) => opt.value === formData.containerId) || null
                            }
                            onChange={(selectedOption) =>
                                setFormData((prev) => ({
                                    ...prev,
                                    containerId: Number(selectedOption!.value) ?? null,
                                }))
                            }
                            isClearable
                            styles={selectStyles}
                            classNamePrefix="react-select"
                            required
                        />

                    </div>
                )}

                {/* Paid Amount */}
                <div>
                <Label>Quantity</Label>
                <Input
                    type="number"
                    name="quantity"
                    placeholder="0"
                    onChange={handleChange}
                    step={0.01}
                    required
                />
                </div>

                <div>
                    <Label>Unit</Label>
                    <Select
                        options={
                        UnitOptions
                            .map((i) => ({
                                label: `${i.name}`,
                                value: i.name,
                            })) || []
                        }
                        placeholder="Select Unit"
                        
                        onChange={(selectedOption) =>
                            setFormData((prev) => ({
                                ...prev,
                                unit: selectedOption?.value ?? '',
                            }))
                        }
                        isClearable
                        styles={selectStyles}
                        classNamePrefix="react-select"
                        required
                    />
                </div>

                { formData.movementType === "stock_transfer" && (
                    <>
                        <div>
                            <Label>Select From Warehouse</Label>
                            <Select
                                options={
                                warehouses
                                    .map((w) => ({
                                        label: `${w.name}`,
                                        value: w.id,
                                    })) || []
                                }
                                placeholder="Search and select warehouse"
                                value={
                                    warehouses
                                    ?.filter((w) => w.id === formData.warehouseId)
                                    .map((w) => ({ label: w.name, value: w.id }))[0] || null
                                }
                                onChange={(selectedOption) =>
                                    setFormData((prev) => ({
                                        ...prev,
                                        warehouseId: selectedOption?.value ?? null,
                                    }))
                                }
                                isClearable
                                styles={selectStyles}
                                classNamePrefix="react-select"
                                required
                            />
                        </div>

                        
                    </>
                )}

                { formData.movementType !== "stock_transfer" && categories.find(c => c.id === formData.categoryId)?.name.toLowerCase() != "currency" && (
                    <div>
                        <Label>Select Warehouse</Label>
                        <Select
                            options={
                            warehouses
                                .map((w) => ({
                                    label: `${w.name}`,
                                    value: w.id,
                                })) || []
                            }
                            placeholder="Search and select warehouse"
                            value={
                                warehouses
                                ?.filter((w) => w.id === formData.warehouseId)
                                .map((w) => ({ label: w.name, value: w.id }))[0] || null
                            }
                            onChange={(selectedOption) =>
                                setFormData((prev) => ({
                                    ...prev,
                                    warehouseId: selectedOption?.value ?? 0,
                                }))
                            }
                            isClearable
                            styles={selectStyles}
                            classNamePrefix="react-select"
                            required
                        />
                    </div>
                )}

                {formData.movementType !== "stock_transfer" && categories.find(c => c.id === formData.categoryId)?.name.toLowerCase() === "currency" && (
                    <div>
                        <Label>Select Stock Account</Label>
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
                )}
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
