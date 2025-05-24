"use client";

import { formatPercentage1 } from "@/lib/formatter";
import SummaryRow from "./SummaryRow";
import { SUPERANNUATION_RATE } from "../constants";

export default function TaxableIncomeSection({
  superannuation,
  taxableIncome,
}: {
  superannuation: number;
  taxableIncome: number;
}) {
  const hasSuperannuation = superannuation > 0;

  const renderSuperannuation = () => {
    if (!hasSuperannuation) {
      return null;
    }
    return (
      <SummaryRow
        label={`Superannuation (${formatPercentage1(SUPERANNUATION_RATE)})`}
        value={superannuation}
      />
    );
  };

  return (
    <>
      {hasSuperannuation ? renderSuperannuation() : null}
      <SummaryRow label="Taxable Income" value={taxableIncome} />
      <hr />
    </>
  );
}
