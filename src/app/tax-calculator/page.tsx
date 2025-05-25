"use client";

import { Card, Container, Grid } from "@mui/material";
import { useState } from "react";
import CalculatedTaxSection from "./components/CalculatedTaxSection";
import LeftOverSection from "./components/LeftOverSection";
import TaxableIncomeSection from "./components/TaxableIncomeSection";
import {
  DEFAULT_TAX_CALCULATOR_FORM_VALUES,
  TaxCalculatorForm,
  TaxCalculatorFormValues,
} from "./components/TaxCalculatorForm";
import styles from "./TaxCalculator.module.css";
import { calculateSuperannuation, calculateTax } from "./utils";

export default function TaxCalculator() {
  const [formValues, setFormValues] = useState<TaxCalculatorFormValues>(
    DEFAULT_TAX_CALCULATOR_FORM_VALUES
  );
  const { income, visa, year, isIncludeSuper } = formValues;

  const superannuation = calculateSuperannuation(income, isIncludeSuper);
  const taxableIncome = income - superannuation;
  const { taxByRange, totalTax } = calculateTax(taxableIncome, visa, year);
  const netIncome = taxableIncome - totalTax;

  const handleOnTaxCalculatorFormChange = (
    newFormValues: TaxCalculatorFormValues
  ) => {
    setFormValues(newFormValues);
  };

  return (
    <Container className={styles.container}>
      <Card>
        <h1 className={styles.title}>Tax Calculator</h1>
        <Grid container spacing={4} paddingInline={6} paddingBlock={2}>
          <Grid size={{ xs: 12, md: 4 }}>
            <TaxCalculatorForm onFormChange={handleOnTaxCalculatorFormChange} />
          </Grid>
          <Grid size={{ xs: 12, md: 8 }}>
            <TaxableIncomeSection
              superannuation={superannuation}
              taxableIncome={taxableIncome}
            />
            <CalculatedTaxSection taxByRange={taxByRange} totalTax={totalTax} />
            <LeftOverSection netIncome={netIncome} />
          </Grid>
        </Grid>
      </Card>
    </Container>
  );
}
