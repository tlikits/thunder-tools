"use child";

import { formatCurrency0, formatPercentage2 } from "@/lib/formatter";
import { TaxByRangeItem } from "../interface";
import SummaryRow from "./SummaryRow";

export default function CalculatedTaxSection({
  totalTax,
  taxByRange,
}: {
  totalTax: number;
  taxByRange: TaxByRangeItem[];
}) {
  const getLabel = (item: TaxByRangeItem) => {
    const { rate, min, max } = item;
    const percentage = formatPercentage2(rate);
    const minCurrency = formatCurrency0(min);
    const maxCurrency = formatCurrency0(max);

    if (max === Infinity) {
      return `${percentage} on income from ${minCurrency}`;
    }
    return `${percentage} on income between ${minCurrency}-${maxCurrency}`;
  };

  const renderTaxByRangeRow = (item: TaxByRangeItem) => {
    const label = getLabel(item);
    return <SummaryRow key={label} label={label} value={item.tax} />;
  };

  const renderTaxByRange = (items: TaxByRangeItem[]) =>
    items.filter((item) => item.tax > 0).map(renderTaxByRangeRow);

  return (
    <>
      <SummaryRow label="Calculated Tax" bold={true} value={totalTax} />
      {renderTaxByRange(taxByRange)}
      <hr />
    </>
  );
}
