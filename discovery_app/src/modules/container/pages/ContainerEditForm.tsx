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

import { statusOptions } from "../../types.ts";
import { fetchAllItem } from "../../item/features/itemThunks.ts";
import { fetchAllCategory } from "../../category/features/categoryThunks.ts";
import { update } from "..//features/containerThunks";
import { AppDispatch } from "../../../store/store";
import { selectUserById } from "../../user/features/userSelectors";
import { selectAuth } from "../../auth/features/authSelectors";
import { Container } from "../features/containerTypes.ts";
import { selectContainerById } from "../features/containerSelectors";


export default function ContainerFormForm() {
    const { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>();

    const authUser = useSelector(selectAuth);
    const user = useSelector(selectUserById(Number(authUser.user?.id)));

    const container = useSelector(selectContainerById(Number(id)));

    useEffect(() => {
        dispatch(fetchAllItem());
        dispatch(fetchAllCategory());
    }, [dispatch]);

    const [formData, setFormData] = useState<Container>({
        id: container?.id,
        businessId: user?.business?.id ?? 0,
        date: container?.date ?? '',
        blNo: container?.blNo ?? '',
        soNo: container?.soNo,
        oceanVesselName: container?.oceanVesselName,
        voyageNo: container?.voyageNo,
        agentDetails: container?.agentDetails,
        placeOfReceipt: container?.placeOfReceipt,
        portOfLoading: container?.portOfLoading,
        portOfDischarge: container?.portOfDischarge,
        placeOfDelivery: container?.placeOfDelivery,
        containerNo: container?.containerNo ?? '',
        sealNo: container?.sealNo,
        description: '',
        isActive: true,
        createdUserId: user?.id
    });


    const handleStatusChange = (value: boolean) => {
        setFormData((prev) => ({
            ...prev,
            isActive: value,
        }));
    };

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        
        try {

            await dispatch(update(formData));
            toast.success("Container updated successfully!");
            
            const categoryId = 0;
            navigate(`/container/${categoryId}/list`);
        } catch (err) {
            toast.error("Failed to create container.");
        }
    };


    return (
        <div>
        <PageMeta title="Container Update" description="Form to update a container" />
        <PageBreadcrumb pageTitle="Container Update" />

        <div className="mb-4 flex justify-start">
            <div>
                <button
                    onClick={() => navigate(-1)}
                    className="bg-red-400 text-white px-2 py-1 rounded-full hover:bg-red-700 mr-4"
                >
                    Back
                </button>

                <button
                    onClick={() => navigate('/container/0/list')}
                    className="bg-fuchsia-400 text-white px-2 py-1 rounded-full hover:bg-fuchsia-700 mr-4"
                >
                    Container List
                </button>
            </div>
        </div>

        <ComponentCard title="Fill up all fields to update a container">
            <form className="space-y-5" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">

                {/* Date */}
                <div>
                    <DatePicker
                        id="date-picker"
                        label="Date"
                        placeholder="Select a date"
                        defaultDate={formData.date}
                        onChange={(dates, currentDateString) => {
                            // Handle your logic
                            console.log({ dates, currentDateString });
                            setFormData((prev) => ({
                                ...prev!,
                                date: currentDateString,
                            }))
                        }}
                    />
                </div>

                {/* B.L No */}
                <div>
                    <Label>B.L No</Label>
                    <Input
                        type="text"
                        name="blNo"
                        placeholder="Enter B.L No"
                        value={formData.blNo}
                        onChange={handleChange}
                    />
                </div>

                
                <div>
                    <Label>S.O No</Label>
                    <Input
                        type="text"
                        name="soNo"
                        placeholder="Enter S.O No"
                        value={formData.soNo}
                        onChange={handleChange}
                    />
                </div>

                <div>
                    <Label>Occean Vessel Name</Label>
                    <Input
                        type="text"
                        name="oceanVesselName"
                        placeholder="Enter Vessel Name"
                        value={formData.oceanVesselName}
                        onChange={handleChange}
                    />
                </div>

                <div>
                    <Label>Voyage No</Label>
                    <Input
                        type="text"
                        name="voyageNo"
                        placeholder="Enter Voyage No"
                        value={formData.voyageNo}
                        onChange={handleChange}
                    />
                </div>

                <div>
                    <Label>Agent</Label>
                    <Input
                        type="text"
                        name="agentDetails"
                        placeholder="Enter Agent"
                        value={formData.agentDetails}
                        onChange={handleChange}
                    />
                </div>

                <div>
                    <Label>Container No</Label>
                    <Input
                        type="text"
                        name="containerNo"
                        placeholder="Enter Container No"
                        value={formData.containerNo}
                        onChange={handleChange}
                    />
                </div>

                <div>
                    <Label>Seal No</Label>
                    <Input
                        type="text"
                        name="sealNo"
                        placeholder="Enter Seal No"
                        value={formData.sealNo}
                        onChange={handleChange}
                    />
                </div>

                <div className="md:col-span-2">
                    <Label>Description</Label>
                    <Input
                    type="text"
                    name="description"
                    placeholder="Description"
                    value={formData.description}
                    onChange={handleChange}
                    />
                    
                </div>

                <div>
                    <Label>Select Status</Label>
                    <Select
                        options={statusOptions}
                        placeholder="Select status"
                        value={statusOptions.find(option => option.value === formData.isActive)}
                        onChange={(selected)=> handleStatusChange(selected?.value ?? false)}
                        className="dark:bg-dark-900"
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
