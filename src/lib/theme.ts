import { createTheme } from "@mui/material/styles";

export const getTheme = (mode: "light" | "dark" = "dark") =>
  createTheme({
    palette: {
      mode,
      primary: {
        main: "#1976d2",
      },
    },
    typography: {
      fontFamily: "Roboto, sans-serif",
    },
  });
