export interface TaxByRangeItem {
  min: number;
  max: number;
  tax: number;
  rate: number;
}

export interface TaxBracketItem {
  limit: number;
  rate: number;
}

export type TaxBracket = TaxBracketItem[];

export interface ITaxBracketOptions {
  [visaType: string]: {
    [year: string]: TaxBracket;
  };
}
