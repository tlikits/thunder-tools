"use client";

import { Autocomplete, TextField } from "@mui/material";
import { useMemo } from "react";
import { ExtendedAutoCompleteOptions } from "./types";

export default function ExtendedAutoComplete({
  onChange,
  label,
  options = [],
  value,
}: {
  onChange: (value: string) => void;
  label: string;
  options: ExtendedAutoCompleteOptions;
  value: string;
}) {
  const autoCompleteValue = useMemo(
    () => options.find((option) => option.value === value)?.label ?? "",
    [options, value]
  );
  const autoCompleteOptions = useMemo(
    () => options.map((option) => option.label),
    [options]
  );

  const handleOnChange = (
    _: React.SyntheticEvent<Element, Event>,
    value: string | null
  ) => {
    const mappedValue =
      options.find((option) => option.label === value)?.value ?? "";
    onChange(mappedValue);
  };

  return (
    <Autocomplete
      disablePortal
      options={autoCompleteOptions}
      onChange={handleOnChange}
      value={autoCompleteValue}
      renderInput={(params) => (
        <TextField {...params} value={autoCompleteValue} label={label} />
      )}
    />
  );
}
