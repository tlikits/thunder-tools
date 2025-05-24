import { ExtendedAutoCompleteOptions } from "@/components/inputs/ExtendedAutoComplete";
import {
  SUPERANNUATION_RATE,
  TaxBracketOptions,
  YearOptionsByVisaType,
} from "./constants";
import { TaxBracket, TaxByRangeItem } from "./interface";

export function calculateSuperannuation(income: number, isInclude: boolean) {
  if (!isInclude) {
    return 0;
  }
  return income * SUPERANNUATION_RATE;
}

export function calculateBaseIncome(
  income: number,
  isIncludeSuperannuation: boolean
) {
  if (isIncludeSuperannuation) {
    return income - income * SUPERANNUATION_RATE;
  }
  return income;
}

export function calculateTax(
  taxableIncome: number,
  visa: string,
  year: string
): {
  taxByRange: TaxByRangeItem[];
  totalTax: number;
} {
  const taxByRange = calculateTaxByRange(taxableIncome, visa, year);
  const totalTax = taxByRange.reduce((total, item) => total + item.tax, 0);
  return { taxByRange, totalTax };
}

export function calculateTaxByRange(
  income: number,
  visa: string,
  year: string
): TaxByRangeItem[] {
  const taxBracket = getTaxBracket(visa, year);
  let remainingIncome = income;
  const taxByRange: TaxByRangeItem[] = [];

  for (let i = 0; i < taxBracket.length; i++) {
    const { limit, rate } = taxBracket[i];
    const previousLimit = i === 0 ? 0 : taxBracket[i - 1].limit;

    if (remainingIncome > 0) {
      const taxableIncome = Math.min(remainingIncome, limit - previousLimit);
      taxByRange.push({
        min: previousLimit + 1,
        max: limit,
        tax: taxableIncome * rate,
        rate: rate,
      });
      remainingIncome -= taxableIncome;
    } else {
      taxByRange.push({
        min: previousLimit + 1,
        max: limit,
        tax: 0,
        rate: rate,
      });
    }
  }

  return taxByRange;
}

export function getTaxBracket(visaType: string, year: string): TaxBracket {
  const taxBracket = TaxBracketOptions[visaType]?.[year];
  return taxBracket ?? [];
}

export function getYearAutocompleteOptionsByVisaType(
  visaType: string
): ExtendedAutoCompleteOptions {
  return YearOptionsByVisaType[visaType] ?? [];
}
