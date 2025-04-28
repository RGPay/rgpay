import { createTheme } from "@mui/material/styles";
import { red, blue, orange } from "@mui/material/colors";

// Create a theme instance with dark theme and vibrant accent colors
const theme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#3070FF", // Vibrant blue for primary actions
      light: "#5A8FFF",
      dark: "#1A54E5",
      contrastText: "#ffffff",
    },
    secondary: {
      main: "#00E5E0", // Teal as secondary color
      light: "#44FFFA",
      dark: "#00B3B0",
      contrastText: "#121212",
    },
    error: {
      main: red[500],
    },
    warning: {
      main: orange[500],
    },
    info: {
      main: blue[400],
    },
    success: {
      main: "#00D97E", // Vibrant green
      light: "#33FFAA",
      dark: "#00A562",
    },
    background: {
      default: "#111827", // Dark background
      paper: "#1F2937", // Slightly lighter card background
    },
    text: {
      primary: "#FFFFFF",
      secondary: "#94A3B8",
    },
  },
  typography: {
    fontFamily: [
      '"Inter"',
      '"Roboto"',
      '"Helvetica Neue"',
      "Arial",
      "sans-serif",
    ].join(","),
    h1: {
      fontSize: "2.5rem",
      fontWeight: 600,
      lineHeight: 1.2,
    },
    h2: {
      fontSize: "2rem",
      fontWeight: 600,
      lineHeight: 1.2,
    },
    h3: {
      fontSize: "1.75rem",
      fontWeight: 600,
      lineHeight: 1.2,
    },
    h4: {
      fontSize: "1.5rem",
      fontWeight: 600,
      lineHeight: 1.2,
    },
    h5: {
      fontSize: "1.25rem",
      fontWeight: 600,
      lineHeight: 1.2,
    },
    h6: {
      fontSize: "1rem",
      fontWeight: 600,
      lineHeight: 1.2,
    },
    button: {
      textTransform: "none", // Avoid uppercase text in buttons
      fontWeight: 500,
    },
    subtitle1: {
      fontSize: "1rem",
      fontWeight: 500,
    },
    subtitle2: {
      fontSize: "0.875rem",
      fontWeight: 500,
    },
  },
  shape: {
    borderRadius: 12,
  },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 960,
      lg: 1280,
      xl: 1920,
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          scrollbarWidth: "thin",
          "&::-webkit-scrollbar": {
            width: "8px",
            height: "8px",
          },
          "&::-webkit-scrollbar-track": {
            background: "#1F2937",
          },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: "#4B5563",
            borderRadius: "4px",
          },
        },
      },
    },
    MuiButton: {
      defaultProps: {
        disableElevation: true,
      },
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: "10px 20px",
          fontWeight: 500,
          textTransform: "none",
          transition: "all 0.2s ease-in-out",
          "&:hover": {
            transform: "translateY(-2px)",
            boxShadow: "0 5px 15px rgba(0, 0, 0, 0.3)",
          },
        },
        containedPrimary: {
          background: "linear-gradient(45deg, #3070FF 30%, #5A8FFF 90%)",
        },
        containedSecondary: {
          background: "linear-gradient(45deg, #00E5E0 30%, #44FFFA 90%)",
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: "0 8px 32px rgba(0, 0, 0, 0.2)",
          background: "rgba(31, 41, 55, 0.9)",
          backdropFilter: "blur(8px)",
          border: "1px solid rgba(255, 255, 255, 0.05)",
          overflow: "hidden",
          transition: "transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out",
          "&:hover": {
            transform: "translateY(-5px)",
            boxShadow: "0 12px 40px rgba(0, 0, 0, 0.3)",
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          background: "rgba(17, 24, 39, 0.8)",
          backdropFilter: "blur(8px)",
          boxShadow: "0 2px 10px rgba(0, 0, 0, 0.2)",
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: "#1F2937",
          borderRight: "1px solid rgba(255, 255, 255, 0.05)",
        },
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          margin: "4px 8px",
          "&.Mui-selected": {
            backgroundColor: "rgba(48, 112, 255, 0.15)",
            "&:hover": {
              backgroundColor: "rgba(48, 112, 255, 0.25)",
            },
          },
          "&:hover": {
            backgroundColor: "rgba(255, 255, 255, 0.05)",
          },
        },
      },
    },
    MuiDivider: {
      styleOverrides: {
        root: {
          borderColor: "rgba(255, 255, 255, 0.05)",
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          borderColor: "rgba(255, 255, 255, 0.05)",
        },
        head: {
          fontWeight: 600,
        },
      },
    },
  },
});

export default theme;
