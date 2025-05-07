import { ITaxBracketOptions } from "./interface";

export const SUPERANNUATION_RATE = 0.115;
export const TaxBracketOptions: ITaxBracketOptions = {
  "462": {
    "2024": [
      { limit: 45000, rate: 0.15 },
      { limit: 135000, rate: 0.3 },
      { limit: 190000, rate: 0.37 },
      { limit: Infinity, rate: 0.45 },
    ],
    "2020": [
      { limit: 45000, rate: 0.15 },
      { limit: 120000, rate: 0.325 },
      { limit: 180000, rate: 0.37 },
      { limit: Infinity, rate: 0.45 },
    ],
  },
};

export const VISA_TYPE_OPTIONS = ["462 - Work and Holiday Visa"];

export const YearOptionsByVisaType: {
  [year: string]: string[];
} = {
  "462": ["2024", "2020"],
};
