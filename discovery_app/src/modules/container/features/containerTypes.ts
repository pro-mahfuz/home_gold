import { User } from "../../user/features/userTypes";
import { Stock } from "../../stock/features/stockTypes";

// Item interface
export interface Container {
  id?: number;
  businessId?: number;
  date: string;
  blNo: string;
  soNo?: string;
  oceanVesselName?: string;
  description?: string;
  voyageNo?: string;
  agentDetails?: string;
  placeOfReceipt?: string;
  portOfLoading?: string;
  portOfDischarge?: string;
  placeOfDelivery?: string;
  containerNo: string;
  sealNo?: string;
  stock?: Stock[];
  user?: User;
  isActive: boolean;
  createdUserId?: number;
  updatedUserId?: number;
}


export interface ContainerState {
  data: Container[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}
