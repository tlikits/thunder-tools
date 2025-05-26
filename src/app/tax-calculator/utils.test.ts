import {
  calculateSuperannuation,
  calculateBaseIncome,
  calculateTax,
  calculateTaxByRange,
  getTaxBracket,
  getYearAutocompleteOptionsByVisaType,
} from "./utils";
import {
  SUPERANNUATION_RATE,
  TaxBracketOptions,
  YearOptionsByVisaType,
} from "./constants";

describe("calculateSuperannuation", () => {
  it("returns 0 if isInclude is false", () => {
    expect(calculateSuperannuation(1000, false)).toBe(0);
  });
  it("calculates superannuation if isInclude is true", () => {
    expect(calculateSuperannuation(1000, true)).toBe(
      1000 * SUPERANNUATION_RATE
    );
  });
});

describe("calculateBaseIncome", () => {
  it("returns income if isIncludeSuperannuation is false", () => {
    expect(calculateBaseIncome(1000, false)).toBe(1000);
  });
  it("subtracts superannuation if isIncludeSuperannuation is true", () => {
    expect(calculateBaseIncome(1000, true)).toBe(
      1000 - 1000 * SUPERANNUATION_RATE
    );
  });
});

describe("getTaxBracket", () => {
  it("returns correct bracket for valid visa/year", () => {
    const visa = Object.keys(TaxBracketOptions)[0];
    const year = Object.keys(TaxBracketOptions[visa])[0];
    expect(getTaxBracket(visa, year)).toBe(TaxBracketOptions[visa][year]);
  });
  it("returns [] for invalid visa/year", () => {
    expect(getTaxBracket("invalid", "invalid")).toEqual([]);
  });
});

describe("calculateTaxByRange", () => {
  it("returns correct tax by range for a known bracket", () => {
    const visa = Object.keys(TaxBracketOptions)[0];
    const year = Object.keys(TaxBracketOptions[visa])[0];
    const bracket = TaxBracketOptions[visa][year];
    const income = bracket[0].limit + 1000;
    const result = calculateTaxByRange(income, visa, year);
    expect(result.length).toBe(bracket.length);
    expect(result[0].tax).toBe(bracket[0].limit * bracket[0].rate);
  });
  it("returns all zero tax if income is 0", () => {
    const visa = Object.keys(TaxBracketOptions)[0];
    const year = Object.keys(TaxBracketOptions[visa])[0];
    const result = calculateTaxByRange(0, visa, year);
    expect(result.every((r) => r.tax === 0)).toBe(true);
  });
});

describe("calculateTax", () => {
  it("returns totalTax as sum of taxByRange", () => {
    const visa = Object.keys(TaxBracketOptions)[0];
    const year = Object.keys(TaxBracketOptions[visa])[0];
    const income = 50000;
    const { taxByRange, totalTax } = calculateTax(income, visa, year);
    expect(totalTax).toBe(taxByRange.reduce((sum, item) => sum + item.tax, 0));
  });
});

describe("getYearAutocompleteOptionsByVisaType", () => {
  it("returns options for valid visaType", () => {
    const visa = Object.keys(YearOptionsByVisaType)[0];
    expect(getYearAutocompleteOptionsByVisaType(visa)).toBe(
      YearOptionsByVisaType[visa]
    );
  });
  it("returns [] for invalid visaType", () => {
    expect(getYearAutocompleteOptionsByVisaType("invalid")).toEqual([]);
  });
});
