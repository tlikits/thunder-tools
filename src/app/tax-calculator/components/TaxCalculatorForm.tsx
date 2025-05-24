"use client";

import AmountInput from "@/components/inputs/AmountInput";
import ExtendedAutoComplete from "@/components/inputs/ExtendedAutoComplete";
import { Checkbox, FormControl, FormControlLabel } from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import { VISA_TYPE_OPTIONS } from "../constants";
import { getYearAutocompleteOptionsByVisaType } from "../utils";

export interface TaxCalculatorFormValues {
  income: number;
  visa: string;
  year: string;
  isIncludeSuper: boolean;
}

export const DEFAULT_TAX_CALCULATOR_FORM_VALUES: TaxCalculatorFormValues =
  Object.freeze({
    income: 0,
    visa: "",
    year: "",
    isIncludeSuper: false,
  });

export function TaxCalculatorForm({
  onFormChange,
}: {
  onFormChange: (formValues: TaxCalculatorFormValues) => void;
}) {
  const [formValues, setFormValues] = useState(
    DEFAULT_TAX_CALCULATOR_FORM_VALUES
  );

  const yearOptions = useMemo(() => {
    const visaType = formValues.visa?.split(" - ")[0] ?? "";
    return getYearAutocompleteOptionsByVisaType(visaType);
  }, [formValues.visa]);

  useEffect(() => {
    onFormChange(formValues);
  }, [onFormChange, formValues]);

  const handleSuperAnnuationChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    checked: boolean
  ) => {
    setFormValues({
      ...formValues,
      isIncludeSuper: checked,
    });
  };

  const handleIncomeChange = (value: number) => {
    setFormValues({
      ...formValues,
      income: value,
    });
  };

  const handleYearChange = (value: string | null) => {
    setFormValues({
      ...formValues,
      year: value ?? "",
    });
  };

  const handleVisaChange = (value: string | null) => {
    setFormValues({
      ...formValues,
      visa: value ?? "",
    });
  };

  return (
    <>
      <FormControl fullWidth>
        <ExtendedAutoComplete
          label="Visa Type"
          options={VISA_TYPE_OPTIONS}
          onChange={handleVisaChange}
          value={formValues.visa}
        />
      </FormControl>
      <br />
      <br />
      <FormControl fullWidth>
        <ExtendedAutoComplete
          label="Year"
          options={yearOptions}
          onChange={handleYearChange}
          value={formValues.year}
        />
      </FormControl>
      <br />
      <br />
      <FormControl fullWidth>
        <AmountInput
          label="Net Income"
          value={formValues.income}
          onChange={handleIncomeChange}
        />
      </FormControl>
      <FormControl fullWidth>
        <FormControlLabel
          control={
            <Checkbox
              checked={formValues.isIncludeSuper}
              onChange={handleSuperAnnuationChange}
            />
          }
          label="Include Superannuation"
        />
      </FormControl>
    </>
  );
}
