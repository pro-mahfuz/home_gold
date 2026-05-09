import { ChangeEvent, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import PageBreadcrumb from "../../../components/common/PageBreadCrumb";
import PageMeta from "../../../components/common/PageMeta";
import ComponentCard from "../../../components/common/ComponentCard";
import Label from "../../../components/form/Label";
import Select from "../../../components/form/Select";
import Input from "../../../components/form/input/InputField";
import Button from "../../../components/ui/button/Button";
import { CurrencyOptions } from "../../types";
import { AppDispatch } from "../../../store/store";
import { selectAuth } from "../../auth/features/authSelectors";
import { update as updateBusiness } from "../../business/features/businessThunks";
import { Business } from "../../business/features/businessTypes";
import { selectUserById } from "../../user/features/userSelectors";
import { fetchUserById } from "../../user/features/userThunks";

type CurrencyRateMap = Record<string, string>;

const formatRateValue = (value: string | number) => {
  const numericValue = Number(value);
  return Number.isFinite(numericValue) ? numericValue.toFixed(4) : value;
};

export default function BaseCurrencySettings() {
  const dispatch = useDispatch<AppDispatch>();
  const auth = useSelector(selectAuth);
  const user = useSelector(selectUserById(Number(auth.user?.id)));

  const [baseCurrency, setBaseCurrency] = useState("AED");
  const [rates, setRates] = useState<CurrencyRateMap>({});
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (auth.user?.id && !user) {
      dispatch(fetchUserById(Number(auth.user.id)));
    }
  }, [auth.user?.id, dispatch, user]);

  useEffect(() => {
    const business = user?.business;

    if (!business) {
      return;
    }

    setBaseCurrency(business.baseCurrency || "AED");

    if (
      business.currencyRates &&
      typeof business.currencyRates === "object" &&
      !Array.isArray(business.currencyRates)
    ) {
      setRates(
        Object.entries(business.currencyRates).reduce<CurrencyRateMap>(
          (accumulator, [currencyCode, value]) => {
            accumulator[currencyCode] = String(value ?? "");
            return accumulator;
          },
          {}
        )
      );
      return;
    }

    setRates({});
  }, [user?.business]);

  const otherCurrencies = useMemo(
    () => CurrencyOptions.filter((currency) => currency.value !== baseCurrency),
    [baseCurrency]
  );

  const handleRateChange =
    (currencyCode: string) => (event: ChangeEvent<HTMLInputElement>) => {
      const { value } = event.target;

      setRates((prev) => ({
        ...prev,
        [currencyCode]: value,
      }));
    };

  const handleSave = async () => {
    const business = user?.business;

    if (!business?.id) {
      toast.error("Business information is not available");
      return;
    }

    const completeBusiness: Business = {
      ...business,
      baseCurrency,
      currencyRates: rates,
    };

    const formData = new FormData();
    formData.append("id", String(completeBusiness.id));
    formData.append("businessName", completeBusiness.businessName ?? "");
    formData.append("ownerName", completeBusiness.ownerName ?? "");
    formData.append("email", completeBusiness.email ?? "");
    formData.append("countryCode", completeBusiness.countryCode ?? "");
    formData.append("phoneCode", completeBusiness.phoneCode ?? "");
    formData.append("phoneNumber", completeBusiness.phoneNumber ?? "");
    formData.append("trnNo", completeBusiness.trnNo ?? "");
    formData.append("vatPercentage", String(completeBusiness.vatPercentage ?? 0));
    formData.append("address", completeBusiness.address ?? "");
    formData.append("city", completeBusiness.city ?? "");
    formData.append("country", completeBusiness.country ?? "");
    formData.append("postalCode", completeBusiness.postalCode ?? "");
    formData.append("isActive", String(completeBusiness.isActive ?? true));
    formData.append("baseCurrency", completeBusiness.baseCurrency ?? "AED");
    formData.append("currencyRates", JSON.stringify(completeBusiness.currencyRates ?? {}));

    if (completeBusiness.businessLicenseNo) {
      formData.append("businessLicenseNo", completeBusiness.businessLicenseNo);
    }

    try {
      setIsSaving(true);
      await dispatch(updateBusiness({ updatedData: formData })).unwrap();
      await dispatch(fetchUserById(Number(auth.user?.id))).unwrap();
      toast.success("Currency settings saved to database");
    } catch (error) {
      toast.error(
        typeof error === "string" ? error : "Failed to save currency settings"
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = () => {
    const business = user?.business;

    setBaseCurrency(business?.baseCurrency || "AED");

    if (
      business?.currencyRates &&
      typeof business.currencyRates === "object" &&
      !Array.isArray(business.currencyRates)
    ) {
      setRates(
        Object.entries(business.currencyRates).reduce<CurrencyRateMap>(
          (accumulator, [currencyCode, value]) => {
            accumulator[currencyCode] = String(value ?? "");
            return accumulator;
          },
          {}
        )
      );
    } else {
      setRates({});
    }

    toast.info("Saved database values restored");
  };

  return (
    <>
      <PageMeta
        title="Base Currency Settings"
        description="Configure the base currency and comparison rates for other currencies."
      />
      <PageBreadcrumb pageTitle="Base Currency Settings" />

      <div className="space-y-6">
        <ComponentCard
          title="Base Currency"
          desc="Choose the default base currency and define how the other currencies compare against it."
        >
          <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
            <div>
              <Label>Base Currency</Label>
              <Select
                options={CurrencyOptions}
                value={baseCurrency}
                onChange={(value) => setBaseCurrency(String(value))}
              />
            </div>

            <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-4 dark:border-amber-500/20 dark:bg-amber-500/10">
              <p className="text-sm font-semibold text-amber-800 dark:text-amber-200">
                Comparison Rule
              </p>
              <p className="mt-2 text-sm text-amber-700 dark:text-amber-100/90">
                Enter each rate as: <span className="font-semibold">1 {baseCurrency}</span> =
                {" "}
                <span className="font-semibold">X other currency</span>
              </p>
              <p className="mt-2 text-xs text-amber-700 dark:text-amber-100/80">
                These values are stored on the business record in the database.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {otherCurrencies.map((currency) => (
              <div key={currency.value}>
                <Label>{currency.label} Rate</Label>
                <Input
                  type="number"
                  min="0"
                  step={0.0001}
                  placeholder={`1 ${baseCurrency} = ? ${currency.label}`}
                  value={rates[currency.value] ?? ""}
                  onChange={handleRateChange(currency.value)}
                />
              </div>
            ))}
          </div>

          <div className="flex flex-wrap gap-3">
            <Button onClick={handleSave} disabled={isSaving}>
              {isSaving ? "Saving..." : "Save Settings"}
            </Button>
            <Button variant="outline" onClick={handleReset}>
              Restore Saved
            </Button>
          </div>
        </ComponentCard>

        <ComponentCard
          title="Saved Overview"
          desc="Quick snapshot of the active base currency and the currently entered comparison rates."
        >
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            <div className="rounded-xl border border-gray-200 px-4 py-4 dark:border-gray-800">
              <p className="text-sm text-gray-500 dark:text-gray-400">Base Currency</p>
              <p className="mt-2 text-xl font-semibold text-gray-900 dark:text-white/90">
                {baseCurrency}
              </p>
            </div>

            {otherCurrencies.map((currency) => (
              <div
                key={`summary-${currency.value}`}
                className="rounded-xl border border-gray-200 px-4 py-4 dark:border-gray-800"
              >
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  1 {baseCurrency} in {currency.label}
                </p>
                <p className="mt-2 text-xl font-semibold text-gray-900 dark:text-white/90">
                  {rates[currency.value]
                    ? formatRateValue(rates[currency.value])
                    : "Not set"}
                </p>
              </div>
            ))}
          </div>
        </ComponentCard>
      </div>
    </>
  );
}
