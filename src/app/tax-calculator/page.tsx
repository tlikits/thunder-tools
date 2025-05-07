"use client";

import AmountInput from "@/components/inputs/AmountInput";
import {
  formatCurrency0,
  formatPercentage1,
  formatPercentage2,
} from "@/lib/formatter";
import {
  Autocomplete,
  Card,
  Checkbox,
  Container,
  FormControl,
  FormControlLabel,
  Grid,
  TextField,
} from "@mui/material";
import { useState } from "react";
import SummaryRow from "./components/SummaryRow";
import { SUPERANNUATION_RATE, VISA_TYPE_OPTIONS } from "./constants";
import styles from "./TaxCalculator.module.css";
import {
  calculateSuperannuation,
  calculateTaxByRange,
  getTaxBracket,
  getYearAutocompleteOptionsByVisaType,
} from "./utils";

export default function TaxCalculator() {
  const [income, setIncome] = useState(0);
  const [selectedVisa, setSelectedVisa] = useState("");
  const visa = selectedVisa?.split(" - ")[0] ?? "";
  const [year, setYear] = useState("");
  const [isIncludeSuperAnnuation, setIsIncludeSuperannuation] = useState(false);

  const superannuation = isIncludeSuperAnnuation
    ? calculateSuperannuation(income)
    : 0;
  const taxableIncome = income - superannuation;
  const taxByRange = calculateTaxByRange(
    taxableIncome,
    getTaxBracket(visa, year)
  );
  const totalTax = taxByRange.reduce((acc, item) => acc + item.tax, 0);

  const onIncomeChange = (value: number) => {
    setIncome(value);
  };

  const onSuperAnnuationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsIncludeSuperannuation(() => {
      const newIsIncludeSuperAnnuation = e.target.checked;
      return newIsIncludeSuperAnnuation;
    });
  };

  return (
    <Container>
      <br />
      <Card>
        <h1 className={styles.title}>Tax Calculator</h1>
        <Grid container spacing={4} paddingInline={6} paddingBlock={2}>
          <Grid size={{ xs: 12, md: 4 }}>
            <FormControl fullWidth>
              <Autocomplete
                disablePortal
                options={VISA_TYPE_OPTIONS}
                onChange={(e, newValue) => {
                  setSelectedVisa(newValue ?? "");
                }}
                value={selectedVisa}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    value={selectedVisa}
                    label="Visa Type"
                  />
                )}
              />
            </FormControl>
            <br />
            <br />
            <FormControl fullWidth>
              <Autocomplete
                disablePortal
                options={getYearAutocompleteOptionsByVisaType(visa)}
                onChange={(e, newValue) => {
                  setYear(newValue ?? "");
                }}
                value={year}
                renderInput={(params) => (
                  <TextField {...params} value={year} label="Year" />
                )}
              />
            </FormControl>
            <br />
            <br />
            <FormControl fullWidth>
              <AmountInput
                label="Net Income"
                value={income}
                onChange={onIncomeChange}
              />
            </FormControl>
            <FormControl fullWidth>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={isIncludeSuperAnnuation}
                    onChange={onSuperAnnuationChange}
                  />
                }
                label="Include Superannuation"
              />
            </FormControl>
          </Grid>
          <Grid size={{ xs: 12, md: 8 }}>
            {totalTax !== null && (
              <>
                {superannuation > 0 && (
                  <>
                    <SummaryRow
                      label={`Superannuation (${formatPercentage1(
                        SUPERANNUATION_RATE
                      )})`}
                      value={superannuation}
                    />
                    <hr />
                  </>
                )}
                <SummaryRow label="Taxable Income" value={taxableIncome} />
                <hr />
                <SummaryRow
                  label="Calculated Tax"
                  bold={true}
                  value={totalTax}
                />
                {taxByRange
                  .filter((item) => item.tax > 0)
                  .map((item) => (
                    <SummaryRow
                      key={`${formatCurrency0(item.min)}-${formatCurrency0(
                        item.max
                      )}`}
                      label={`${formatPercentage2(
                        item.rate
                      )} on income between ${formatCurrency0(
                        item.min
                      )}-${formatCurrency0(item.max)}`}
                      value={item.tax}
                    />
                  ))}
                <hr />
                <SummaryRow
                  label="Leftover Income (Annually)"
                  bold={true}
                  value={taxableIncome - totalTax}
                />
                <SummaryRow
                  label="Leftover Income (Biweekly)"
                  bold={true}
                  value={((taxableIncome - totalTax) / 52) * 2}
                />
                <SummaryRow
                  label="Leftover Income (Weekly)"
                  bold={true}
                  value={(taxableIncome - totalTax) / 52}
                />
              </>
            )}
          </Grid>
        </Grid>
      </Card>
    </Container>
  );
}
