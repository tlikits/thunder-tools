"use client";

import { formatNumber } from "@/lib/formatter";
import { parseNumber, parseNumberCharacters } from "@/lib/parser";
import { InputAdornment, inputBaseClasses, TextField } from "@mui/material";
import { useMemo, useRef, useState } from "react";

export default function AmountInput({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (value: number) => Promise<void> | void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [currentValue, setCurrentValue] = useState(String(value));
  const [isFocused, setIsFocused] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = parseNumberCharacters(e.target.value);
    setCurrentValue(inputValue);
    onChange(parseNumber(inputValue));
  };

  const handleFocusChange = (focused: boolean) => () => {
    setIsFocused(focused);
    setCurrentValue(String(value));
    if (!focused) {
      return;
    }
    setTimeout(() => {
      const input = inputRef.current;
      if (!input) return;

      const adjustedIndex = String(value).length;
      input.setSelectionRange(adjustedIndex, adjustedIndex);
    }, 0);
  };

  const displayValue = useMemo(
    () => (isFocused ? currentValue : formatNumber(value)),
    [isFocused, value, currentValue]
  );

  const adornmentStyles = {
    opacity: 0,
    pointerEvents: "none",
    [`[data-shrink=true] ~ .${inputBaseClasses.root} > &`]: {
      opacity: 1,
    },
  };

  // if (true) {
  //   return <input
  // }
  return (
    <TextField
      inputRef={inputRef}
      label={label}
      type="text"
      variant="outlined"
      slotProps={{
        input: {
          startAdornment: (
            <InputAdornment position="start" sx={adornmentStyles}>
              $
            </InputAdornment>
          ),
        },
      }}
      value={displayValue}
      onChange={handleInputChange}
      onBlur={handleFocusChange(false)}
      onFocus={handleFocusChange(true)}
    />
  );
}
