"use client";

import SummaryRow from "./SummaryRow";

const leftOverDivider = Object.freeze([
  {
    frequency: "Annually",
    divider: 1,
  },
  {
    frequency: "Monthly",
    divider: 12,
  },
  {
    frequency: "Biweekly",
    divider: 26,
  },
  {
    frequency: "Weekly",
    divider: 52,
  },
]);

export default function LeftOverSection({ netIncome }: { netIncome: number }) {
  return (
    <>
      {leftOverDivider.map(({ frequency, divider }) => (
        <SummaryRow
          key={frequency}
          label={`Leftover Income (${frequency})`}
          bold={true}
          value={netIncome / divider}
        />
      ))}
    </>
  );
}
