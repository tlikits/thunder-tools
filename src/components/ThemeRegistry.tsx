"use client";

import { getTheme } from "@/lib/theme";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { ReactNode } from "react";

const THEME = process.env.THEME as "light" | "dark";

export default function ThemeRegistry({ children }: { children: ReactNode }) {
  const theme = getTheme(THEME);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
}
