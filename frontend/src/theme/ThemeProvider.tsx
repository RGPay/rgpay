import React, { useMemo, useEffect } from "react";
import { ThemeProvider as MUIThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { createTheme } from "@mui/material/styles";
import { blue, orange } from "@mui/material/colors";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "../store/store";
import SettingsService, { UserSettings } from "../services/settings.service";
import { setThemeSettings } from "../store/themeSlice";

interface ThemeProviderProps {
  children: React.ReactNode;
}

const createCustomTheme = (settings: UserSettings | null) => {
  const themeMode = settings?.theme_mode || "dark";
  const primaryColor = settings?.primary_color || "#3070FF";
  const secondaryColor = settings?.secondary_color || "#00E5E0";
  const successColor = settings?.success_color || "#00D97E";
  const errorColor = settings?.error_color || "#f44336";

  // Helper function to adjust color brightness for light/dark theme
  const adjustColorForTheme = (
    color: string,
    lightVariant: string,
    darkVariant: string
  ) => {
    return themeMode === "dark" ? darkVariant : lightVariant;
  };

  return createTheme({
    palette: {
      mode: themeMode,
      primary: {
        main: primaryColor,
        light: adjustColorForTheme(primaryColor, "#6B9AFF", "#5A8FFF"),
        dark: adjustColorForTheme(primaryColor, "#1A4BCC", "#1A54E5"),
        contrastText: "#ffffff",
      },
      secondary: {
        main: secondaryColor,
        light: adjustColorForTheme(secondaryColor, "#33F0EB", "#44FFFA"),
        dark: adjustColorForTheme(secondaryColor, "#008B87", "#00B3B0"),
        contrastText: themeMode === "dark" ? "#121212" : "#ffffff",
      },
      error: {
        main: errorColor,
        light: themeMode === "dark" ? "#ff6b6b" : "#ffebee",
        dark: themeMode === "dark" ? "#d32f2f" : "#c62828",
      },
      warning: {
        main: orange[500],
        light: themeMode === "dark" ? orange[300] : orange[100],
        dark: themeMode === "dark" ? orange[700] : orange[800],
      },
      info: {
        main: blue[400],
        light: themeMode === "dark" ? blue[300] : blue[100],
        dark: themeMode === "dark" ? blue[600] : blue[800],
      },
      success: {
        main: successColor,
        light: adjustColorForTheme(successColor, "#4AE584", "#33FFAA"),
        dark: adjustColorForTheme(successColor, "#00A554", "#00A562"),
      },
      background: {
        default: themeMode === "dark" ? "#111827" : "#fafafa",
        paper: themeMode === "dark" ? "#1F2937" : "#ffffff",
      },
      text: {
        primary: themeMode === "dark" ? "#FFFFFF" : "#4A5568",
        secondary: themeMode === "dark" ? "#94A3B8" : "#757575",
      },
      divider:
        themeMode === "dark"
          ? "rgba(255, 255, 255, 0.12)"
          : "rgba(0, 0, 0, 0.12)",
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
        textTransform: "none",
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
              background: themeMode === "dark" ? "#1F2937" : "#f1f1f1",
            },
            "&::-webkit-scrollbar-thumb": {
              backgroundColor: themeMode === "dark" ? "#4B5563" : "#bdbdbd",
              borderRadius: "4px",
              "&:hover": {
                backgroundColor: themeMode === "dark" ? "#6B7280" : "#9e9e9e",
              },
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
              boxShadow:
                themeMode === "dark"
                  ? "0 5px 15px rgba(0, 0, 0, 0.3)"
                  : "0 5px 15px rgba(0, 0, 0, 0.15)",
            },
          },
          containedPrimary: {
            background: `linear-gradient(45deg, ${primaryColor} 30%, ${primaryColor}CC 90%)`,
          },
          containedSecondary: {
            background: `linear-gradient(45deg, ${secondaryColor} 30%, ${secondaryColor}CC 90%)`,
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 16,
            boxShadow:
              themeMode === "dark"
                ? "0 8px 32px rgba(0, 0, 0, 0.2)"
                : "0 8px 25px rgba(0, 0, 0, 0.08)",
            background:
              themeMode === "dark"
                ? "rgba(31, 41, 55, 0.9)"
                : "rgba(255, 255, 255, 0.95)",
            backdropFilter: "blur(8px)",
            border:
              themeMode === "dark"
                ? "1px solid rgba(255, 255, 255, 0.05)"
                : "1px solid rgba(255, 255, 255, 0.3)",
            overflow: "hidden",
            transition:
              "transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out",
            "&:hover": {
              transform: "translateY(-5px)",
              boxShadow:
                themeMode === "dark"
                  ? "0 12px 40px rgba(0, 0, 0, 0.3)"
                  : "0 15px 35px rgba(0, 0, 0, 0.15)",
            },
          },
        },
      },
      MuiAppBar: {
        styleOverrides: {
          root: {
            background:
              themeMode === "dark"
                ? "rgba(17, 24, 39, 0.8)"
                : "rgba(255, 255, 255, 0.95)",
            backdropFilter: "blur(8px)",
            color: themeMode === "dark" ? "#ffffff" : "#4A5568",
            boxShadow:
              themeMode === "dark"
                ? "0 2px 10px rgba(0, 0, 0, 0.2)"
                : "0 2px 10px rgba(0, 0, 0, 0.1)",
            borderBottom:
              themeMode === "dark"
                ? "1px solid rgba(255, 255, 255, 0.05)"
                : "1px solid rgba(0, 0, 0, 0.08)",
            "& .MuiIconButton-root": {
              color: themeMode === "dark" ? "#ffffff" : "#4A5568",
              "&:hover": {
                backgroundColor:
                  themeMode === "dark"
                    ? "rgba(255, 255, 255, 0.1)"
                    : "rgba(74, 85, 104, 0.08)",
              },
            },
            "& .MuiTypography-root": {
              color: themeMode === "dark" ? "#ffffff" : "#4A5568",
            },
          },
        },
      },
      MuiDrawer: {
        styleOverrides: {
          paper: {
            backgroundColor: themeMode === "dark" ? "#1F2937" : "#ffffff",
            borderRight:
              themeMode === "dark"
                ? "1px solid rgba(255, 255, 255, 0.05)"
                : "1px solid rgba(0, 0, 0, 0.12)",
          },
        },
      },
      MuiListItemButton: {
        styleOverrides: {
          root: {
            borderRadius: 8,
            margin: "4px 8px",
            "&.Mui-selected": {
              backgroundColor:
                themeMode === "dark"
                  ? `${primaryColor}26`
                  : `${primaryColor}15`,
              "&:hover": {
                backgroundColor:
                  themeMode === "dark"
                    ? `${primaryColor}40`
                    : `${primaryColor}25`,
              },
            },
            "&:hover": {
              backgroundColor:
                themeMode === "dark"
                  ? "rgba(255, 255, 255, 0.05)"
                  : "rgba(0, 0, 0, 0.05)",
            },
          },
        },
      },
      MuiDivider: {
        styleOverrides: {
          root: {
            borderColor:
              themeMode === "dark"
                ? "rgba(255, 255, 255, 0.05)"
                : "rgba(0, 0, 0, 0.12)",
          },
        },
      },
      MuiTableCell: {
        styleOverrides: {
          root: {
            borderColor:
              themeMode === "dark"
                ? "rgba(255, 255, 255, 0.05)"
                : "rgba(0, 0, 0, 0.12)",
          },
          head: {
            fontWeight: 600,
          },
        },
      },
      MuiMenu: {
        styleOverrides: {
          paper: {
            borderRadius: 12,
            boxShadow:
              themeMode === "dark"
                ? "0 8px 32px rgba(0, 0, 0, 0.2)"
                : "0 8px 32px rgba(0, 0, 0, 0.15)",
            background:
              themeMode === "dark"
                ? "rgba(31, 41, 55, 0.9)"
                : "rgba(255, 255, 255, 0.95)",
            backdropFilter: "blur(8px)",
            border:
              themeMode === "dark"
                ? "1px solid rgba(255, 255, 255, 0.05)"
                : "1px solid rgba(0, 0, 0, 0.08)",
          },
        },
      },
      MuiMenuItem: {
        styleOverrides: {
          root: {
            borderRadius: 8,
            margin: "4px 8px",
            "&:hover": {
              backgroundColor:
                themeMode === "dark"
                  ? "rgba(255, 255, 255, 0.08)"
                  : "rgba(0, 0, 0, 0.05)",
            },
          },
        },
      },
      MuiTooltip: {
        styleOverrides: {
          tooltip: {
            backgroundColor:
              themeMode === "dark"
                ? "rgba(55, 65, 81, 0.95)"
                : "rgba(75, 85, 99, 0.95)",
            color: "#ffffff",
            fontSize: "0.75rem",
            borderRadius: 8,
            backdropFilter: "blur(8px)",
          },
        },
      },
    },
  });
};

const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const dispatch = useDispatch();
  const themeSettings = useSelector((state: RootState) => state.theme.settings);
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated
  );

  // Load user settings on mount if authenticated
  useEffect(() => {
    if (isAuthenticated && !themeSettings) {
      SettingsService.getUserSettings()
        .then((settings) => {
          dispatch(setThemeSettings(settings));
        })
        .catch((error) => {
          console.error("Failed to load theme settings:", error);
          // Use default settings if loading fails
          const defaultSettings: UserSettings = {
            id_setting: 0,
            id_usuario: 0,
            theme_mode: "dark",
            primary_color: "#3070FF",
            secondary_color: "#00E5E0",
            success_color: "#00D97E",
            error_color: "#f44336",
          };
          dispatch(setThemeSettings(defaultSettings));
        });
    }
  }, [isAuthenticated, themeSettings, dispatch]);

  // Update body data-theme attribute when theme changes
  useEffect(() => {
    const themeMode = themeSettings?.theme_mode || "dark";
    document.body.setAttribute("data-theme", themeMode);
  }, [themeSettings?.theme_mode]);

  // Set initial theme on mount
  useEffect(() => {
    if (!document.body.getAttribute("data-theme")) {
      document.body.setAttribute("data-theme", "dark");
    }
  }, []);

  const theme = useMemo(
    () => createCustomTheme(themeSettings),
    [themeSettings]
  );

  return (
    <MUIThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </MUIThemeProvider>
  );
};

export default ThemeProvider;
