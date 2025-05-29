import { ExtendedAutoCompleteOptions } from "@/components/inputs/types";

export function generateExtendedAutoCompleteOptions(
  options: string[]
): ExtendedAutoCompleteOptions {
  return options.map((option) => ({
    label: option,
    value: option,
  }));
}
