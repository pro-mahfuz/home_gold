import { ChangeEvent, useMemo, useState } from "react";
import PageBreadcrumb from "../../../components/common/PageBreadCrumb";
import PageMeta from "../../../components/common/PageMeta";
import Label from "../../../components/form/Label";
import Input from "../../../components/form/input/InputField";

const BORI_GRAMS = 11.664;

const formatValue = (value: number | null, digits = 3) => {
  if (value === null || !Number.isFinite(value)) return "";
  return value.toFixed(digits);
};

export default function BoriPriceIn() {
  const [formData, setFormData] = useState({
    weightGram: "",
    boriPriceBdt: "",
  });

  const calculations = useMemo(() => {
    const weight = Number(formData.weightGram);
    const boriPrice = Number(formData.boriPriceBdt);

    const hasValidWeight = Number.isFinite(weight) && weight > 0;
    const hasValidBoriPrice = Number.isFinite(boriPrice) && boriPrice >= 0;

    if (!hasValidWeight || !hasValidBoriPrice) {
      return {
        boriEquivalent: null,
        totalPriceBdt: null,
        perGramRateBdt: null,
      };
    }

    const boriEquivalent = weight / BORI_GRAMS;
    const totalPriceBdt = boriEquivalent * boriPrice;
    const perGramRateBdt = totalPriceBdt / weight;

    return {
      boriEquivalent,
      totalPriceBdt,
      perGramRateBdt,
    };
  }, [formData.boriPriceBdt, formData.weightGram]);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const clearAll = () => {
    setFormData({
      weightGram: "",
      boriPriceBdt: "",
    });
  };

  return (
    <>
      <PageMeta
        title="Bori Price In"
        description="Calculate BDT total and per gram rate from bori price."
      />
      <PageBreadcrumb pageTitle="Bori Price In" />

      <div className="space-y-6">
        <div className="rounded-2xl border border-emerald-200 bg-gradient-to-r from-emerald-50 via-white to-teal-50 p-6 shadow-sm dark:border-emerald-500/20 dark:from-emerald-500/10 dark:via-gray-900 dark:to-teal-500/10">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div className="space-y-2">
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-emerald-700 dark:text-emerald-300">
                Header Tool
              </p>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
                Bori price-in calculator
              </h2>
              <p className="max-w-2xl text-sm text-gray-600 dark:text-gray-300">
                Enter the weight in gram and the bori price in BDT to calculate the
                total BDT amount and the per gram rate automatically.
              </p>
            </div>

            <button
              type="button"
              onClick={clearAll}
              className="inline-flex items-center justify-center rounded-full border border-emerald-300 px-5 py-2.5 text-sm font-semibold text-emerald-800 transition hover:bg-emerald-100 dark:border-emerald-400/30 dark:text-emerald-200 dark:hover:bg-emerald-400/10"
            >
              Clear All
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1.1fr_0.9fr]">
          <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-white/[0.05] dark:bg-white/[0.03]">
            <div className="mb-6 space-y-2">
              <span className="inline-flex rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-emerald-700 dark:bg-emerald-400/10 dark:text-emerald-300">
                Input
              </span>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                Enter bori price values
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                The calculation uses `11.664` gram as one bori.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <div>
                <Label htmlFor="weightGram">Weight in Gram</Label>
                <Input
                  id="weightGram"
                  type="number"
                  name="weightGram"
                  min="0"
                  step={0.001}
                  placeholder="Enter weight in gram"
                  value={formData.weightGram}
                  onChange={handleChange}
                />
              </div>

              <div>
                <Label htmlFor="boriPriceBdt">Bori Price in BDT</Label>
                <Input
                  id="boriPriceBdt"
                  type="number"
                  name="boriPriceBdt"
                  min="0"
                  step={0.01}
                  placeholder="Enter bori price in BDT"
                  value={formData.boriPriceBdt}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="mt-6 rounded-2xl bg-gray-50 p-5 dark:bg-gray-900/60">
              <h4 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-700 dark:text-gray-200">
                Formula
              </h4>
              <div className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                <p>Total BDT = (Weight / 11.664) x Bori Price</p>
                <p>Per Gram Rate = Total BDT / Weight</p>
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-white/[0.05] dark:bg-white/[0.03]">
            <div className="mb-6 space-y-2">
              <span className="inline-flex rounded-full bg-teal-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-teal-700 dark:bg-teal-400/10 dark:text-teal-300">
                Result
              </span>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                Calculated values
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                These values update automatically as soon as you enter the inputs.
              </p>
            </div>

            <div className="space-y-5">
              <div>
                <Label htmlFor="boriEquivalent">Bori Equivalent</Label>
                <Input
                  id="boriEquivalent"
                  type="text"
                  value={formatValue(calculations.boriEquivalent, 3)}
                  placeholder="Calculated automatically"
                  readOnly
                  className="bg-white font-semibold dark:bg-gray-900"
                />
              </div>

              <div>
                <Label htmlFor="totalPriceBdt">Total Price in BDT</Label>
                <Input
                  id="totalPriceBdt"
                  type="text"
                  value={formatValue(calculations.totalPriceBdt, 3)}
                  placeholder="Calculated automatically"
                  readOnly
                  className="bg-white font-semibold dark:bg-gray-900"
                />
              </div>

              <div>
                <Label htmlFor="perGramRateBdt">Per Gram Rate in BDT</Label>
                <Input
                  id="perGramRateBdt"
                  type="text"
                  value={formatValue(calculations.perGramRateBdt, 3)}
                  placeholder="Calculated automatically"
                  readOnly
                  className="bg-white font-semibold dark:bg-gray-900"
                />
              </div>
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
