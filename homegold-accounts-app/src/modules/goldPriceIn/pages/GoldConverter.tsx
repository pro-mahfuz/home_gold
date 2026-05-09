import { ChangeEvent, useMemo, useState } from "react";
import PageBreadcrumb from "../../../components/common/PageBreadCrumb";
import PageMeta from "../../../components/common/PageMeta";
import Label from "../../../components/form/Label";
import Input from "../../../components/form/input/InputField";

type PurityKey = "999" | "995" | "920";

type ConverterState = Record<PurityKey, string>;

type ConverterCard = {
  from: PurityKey;
  title: string;
  description: string;
  outputs: PurityKey[];
};

const PURITY_VALUES: Record<PurityKey, number> = {
  "999": 1,
  "995": 0.995,
  "920": 0.92,
};

const converterCards: ConverterCard[] = [
  {
    from: "999",
    title: "999 Converter",
    description: "Convert pure gold weight into equivalent 995 and 920 values.",
    outputs: ["995", "920"],
  },
  {
    from: "995",
    title: "995 Converter",
    description: "Convert 995 gold weight into equivalent 999 and 920 values.",
    outputs: ["999", "920"],
  },
  {
    from: "920",
    title: "920 Converter",
    description: "Convert 920 gold weight into equivalent 999 and 995 values.",
    outputs: ["999", "995"],
  },
];

const formatValue = (value: number) => value.toFixed(3);

const convertPurity = (amount: number, from: PurityKey, to: PurityKey) =>
  (amount * PURITY_VALUES[from]) / PURITY_VALUES[to];

export default function GoldConverter() {
  const [values, setValues] = useState<ConverterState>({
    "999": "",
    "995": "",
    "920": "",
  });

  const handleChange =
    (purity: PurityKey) => (event: ChangeEvent<HTMLInputElement>) => {
      const nextValue = event.target.value;

      setValues((prev) => ({
        ...prev,
        [purity]: nextValue,
      }));
    };

  const convertedValues = useMemo(() => {
    return converterCards.reduce<Record<PurityKey, Record<PurityKey, string>>>(
      (accumulator, card) => {
        const amount = Number(values[card.from]);
        const isValid = Number.isFinite(amount) && amount >= 0;

        accumulator[card.from] = card.outputs.reduce<Record<PurityKey, string>>(
          (outputAccumulator, outputPurity) => {
            outputAccumulator[outputPurity] = isValid
              ? formatValue(convertPurity(amount, card.from, outputPurity))
              : "";

            return outputAccumulator;
          },
          { "999": "", "995": "", "920": "" }
        );

        return accumulator;
      },
      {
        "999": { "999": "", "995": "", "920": "" },
        "995": { "999": "", "995": "", "920": "" },
        "920": { "999": "", "995": "", "920": "" },
      }
    );
  }, [values]);

  const clearAll = () => {
    setValues({
      "999": "",
      "995": "",
      "920": "",
    });
  };

  return (
    <>
      <PageMeta
        title="Gold Converter"
        description="Convert gold purity weights between 999, 995, and 920."
      />
      <PageBreadcrumb pageTitle="Gold Converter" />

      <div className="space-y-6">
        <div className="rounded-2xl border border-amber-200 bg-gradient-to-r from-amber-50 via-white to-yellow-50 p-6 shadow-sm dark:border-amber-500/20 dark:from-amber-500/10 dark:via-gray-900 dark:to-yellow-500/10">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div className="space-y-2">
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-amber-700 dark:text-amber-300">
                Gold Purity Tools
              </p>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
                999, 995, and 920 conversion
              </h2>
              <p className="max-w-2xl text-sm text-gray-600 dark:text-gray-300">
                Enter a weight in any purity card to instantly see the equivalent
                weight in the other two purities.
              </p>
            </div>

            <button
              type="button"
              onClick={clearAll}
              className="inline-flex items-center justify-center rounded-full border border-amber-300 px-5 py-2.5 text-sm font-semibold text-amber-800 transition hover:bg-amber-100 dark:border-amber-400/30 dark:text-amber-200 dark:hover:bg-amber-400/10"
            >
              Clear All
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
          {converterCards.map((card) => (
            <section
              key={card.from}
              className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-white/[0.05] dark:bg-white/[0.03]"
            >
              <div className="mb-6 space-y-2">
                <span className="inline-flex rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-amber-700 dark:bg-amber-400/10 dark:text-amber-300">
                  Purity {card.from}
                </span>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  {card.title}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {card.description}
                </p>
              </div>

              <div className="space-y-5">
                <div>
                  <Label htmlFor={`purity-${card.from}`}>{card.from} Weight</Label>
                  <Input
                    id={`purity-${card.from}`}
                    type="number"
                    min="0"
                    step={0.000001}
                    placeholder={`Enter ${card.from} weight`}
                    value={values[card.from]}
                    onChange={handleChange(card.from)}
                  />
                </div>

                <div className="space-y-4 rounded-2xl bg-gray-50 p-4 dark:bg-gray-900/60">
                  {card.outputs.map((outputPurity) => (
                    <div key={`${card.from}-${outputPurity}`}>
                      <Label htmlFor={`${card.from}-${outputPurity}`}>
                        {card.from} to {outputPurity}
                      </Label>
                      <Input
                        id={`${card.from}-${outputPurity}`}
                        type="text"
                        value={convertedValues[card.from][outputPurity]}
                        placeholder="Calculated automatically"
                        readOnly
                        className="bg-white font-semibold dark:bg-gray-900"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </section>
          ))}
        </div>
      </div>
    </>
  );
}
