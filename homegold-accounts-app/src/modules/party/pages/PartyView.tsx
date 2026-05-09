import PageBreadcrumb from "../../../components/common/PageBreadCrumb.tsx";
import PageMeta from "../../../components/common/PageMeta.tsx";

import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchPartyById } from "../features/partyThunks.ts";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../../../store/store.ts";
import { selectPartyById } from "../features/partySelectors.ts";


export default function PartyView() {
  const { id } = useParams();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const party = useSelector(selectPartyById(Number(id)));
  
  useEffect(() => {
    dispatch(fetchPartyById(Number(id)));
  }, [id, dispatch]);

  const handleEdit = () => {
    console.log("Editing profile:", id);
    navigate(`/party/edit/${Number(id)}`);
  };

  return (
    <>
      <PageMeta
        title="React.js Profile Dashboard | TailAdmin - Next.js Admin Dashboard Template"
        description="This is React.js Profile Dashboard page for TailAdmin - React.js Tailwind CSS Admin Dashboard Template"
      />
      <PageBreadcrumb pageTitle="Profile" />

      <div className="mb-4 flex justify-start">
        <div>
          <button
            onClick={() => navigate(-1)}
            className="bg-red-400 text-white px-2 py-1 rounded-full hover:bg-red-700 mr-4"
          >
              Back
          </button>

          {/* <button
            onClick={() => {!partyType && partyType === "all" ? navigate('/party/list') : partyType === "supplier" ? navigate('/party/supplier/list') : navigate('/party/customer/list')}}
            className="bg-fuchsia-400 text-white px-2 py-1 rounded-full hover:bg-fuchsia-700 mr-4"
          >
            {`${!partyType && partyType === "all" ? "Party List" : partyType.charAt(0).toUpperCase() + partyType.slice(1).toLowerCase() + ' List'}`}
          </button> */}

          <button
            onClick={() => {navigate(`/party/edit/${id}`)}}
            className="bg-blue-600 text-white px-2 py-1 rounded-full hover:bg-blue-700"
          >
            Update
          </button>
            
        </div>
      </div>
      
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
        <div className="space-y-6">
          <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
            <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
            <div className="flex flex-col items-center w-full gap-6 xl:flex-row">
                {/* <div className="w-20 h-20 overflow-hidden border border-gray-200 rounded-full dark:border-gray-800">
                    <img src={userProfile?.Profile?.profilePicture
                        ? `http://localhost:5000/api${userProfile?.Profile?.profilePicture}`
                        : "http://localhost:5173/public/images/user/owner.jpeg"
                        }
                        alt="user" 
                    />
                </div> */}

                <div className="order-3 xl:order-2">
                <h4 className="mb-2 text-lg font-semibold text-center text-gray-800 dark:text-white/90 xl:text-left">
                    {party?.name}
                </h4>
                <div className="flex flex-col items-center gap-1 text-center xl:flex-row xl:gap-3 xl:text-left">
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                    {party?.isActive === true ? 'Active' : 'Disable'}
                    </p>
                </div>
                </div>
            
            </div>
            <button
                onClick={handleEdit}
                className="flex w-full items-center justify-center gap-2 rounded-full border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200 lg:inline-flex lg:w-auto"
            >
                <svg
                className="fill-current"
                width="18"
                height="18"
                viewBox="0 0 18 18"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                >
                <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M15.0911 2.78206C14.2125 1.90338 12.7878 1.90338 11.9092 2.78206L4.57524 10.116C4.26682 10.4244 4.0547 10.8158 3.96468 11.2426L3.31231 14.3352C3.25997 14.5833 3.33653 14.841 3.51583 15.0203C3.69512 15.1996 3.95286 15.2761 4.20096 15.2238L7.29355 14.5714C7.72031 14.4814 8.11172 14.2693 8.42013 13.9609L15.7541 6.62695C16.6327 5.74827 16.6327 4.32365 15.7541 3.44497L15.0911 2.78206ZM12.9698 3.84272C13.2627 3.54982 13.7376 3.54982 14.0305 3.84272L14.6934 4.50563C14.9863 4.79852 14.9863 5.2734 14.6934 5.56629L14.044 6.21573L12.3204 4.49215L12.9698 3.84272ZM11.2597 5.55281L5.6359 11.1766C5.53309 11.2794 5.46238 11.4099 5.43238 11.5522L5.01758 13.5185L6.98394 13.1037C7.1262 13.0737 7.25666 13.003 7.35947 12.9002L12.9833 7.27639L11.2597 5.55281Z"
                    fill=""
                />
                </svg>
                Edit
            </button>
            </div>
        </div>


        <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
              <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                <div>
                  <h4 className="text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-6">
                    Detail Information
                  </h4>
        
                  <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-7 2xl:gap-x-32">
                    <div>
                      <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                        User Name
                      </p>
                      <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                        {party?.name}
                      </p>
                    </div>

                    <div>
                      <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                        Company Name
                      </p>
                      <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                        {party?.company}
                      </p>
                    </div>
        
                    <div>
                      <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                        Email
                      </p>
                      <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                        {party?.email}
                      </p>
                    </div>

                    <div>
                      <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                        Phone
                      </p>
                      <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                        {party?.phoneNumber}
                      </p>
                    </div>

                    <div>
                      <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                        Trade License
                      </p>
                      <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                        {party?.tradeLicense}
                      </p>
                    </div>
                    
                    <div>
                      <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                        TRN No
                      </p>
                      <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                        {party?.trnNo}
                      </p>
                    </div>

                    <div>
                      <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                        EID/Passport No
                      </p>
                      <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                        {party?.nationalId}
                      </p>
                    </div>
        
                    
        
                    <div>
                      <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                        Opening Balance
                      </p>
                      <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                        {party?.openingBalance}
                      </p>
                    </div>
        
                    {/* <div>
                      <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                        Role
                      </p>
                      <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                        {profile?.Role?.name.toUpperCase()}
                      </p>
                    </div> */}
                  </div>
                </div>
              </div>
            </div>
          
            <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
                <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                    <div>
                        <h4 className="text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-6">
                            Address
                        </h4>

                        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-7 2xl:gap-x-32">
                            <div className="md:col-span-2">
                                <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                                    Address
                                </p>
                                <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                                    {party?.address}
                                </p>
                            </div>

                            <div>
                                <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                                    City/State
                                </p>
                                <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                                    {party?.city}
                                </p>
                            </div>

                            <div>
                                <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                                    Country
                                </p>
                                <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                                    {party?.country}
                                </p>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </>
  );
}
