export interface Business {
  id?: number;
  businessName?:string;
  businessShortName?: string;
  businessLogo?: string | File;
  businessLicenseNo?: string;
  businessLicenseCopy?: string | File;
  ownerName?: string;
  email?: string;
  countryCode?: string;
  phoneCode?: string;
  phoneNumber?: string;
  trnNo?: string;
  vatPercentage: number;
  baseCurrency?: string;
  currencyRates?: Record<string, string> | null;
  address?: string;
  city?: string;
  country?: string;
  postalCode?: string;
  isActive?: boolean;
}

export interface BusinessState {
  data: Business[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}
