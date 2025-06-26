import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Grid,
  TextField,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  CircularProgress,
} from "@mui/material";
import {
  Palette as PaletteIcon,
  Brightness4 as DarkModeIcon,
  Brightness7 as LightModeIcon,
  RestartAlt as ResetIcon,
  Save as SaveIcon,
  Preview as PreviewIcon,
} from "@mui/icons-material";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "../store/store";
import SettingsService, {
  UpdateUserSettingsDto,
} from "../services/settings.service";
import {
  setThemeSettings,
  updateThemeSettings,
  setThemeLoading,
  setThemeError,
} from "../store/themeSlice";
import { Toast } from "./";

// Predefined color schemes
const colorSchemes = [
  {
    name: "Padrão (Azul/Teal)",
    primary: "#3070FF",
    secondary: "#00E5E0",
    success: "#00D97E",
    error: "#f44336",
  },
  {
    name: "Roxo/Rosa",
    primary: "#9C27B0",
    secondary: "#E91E63",
    success: "#4CAF50",
    error: "#f44336",
  },
  {
    name: "Verde/Laranja",
    primary: "#4CAF50",
    secondary: "#FF9800",
    success: "#8BC34A",
    error: "#f44336",
  },
  {
    name: "Indigo/Cyan",
    primary: "#3F51B5",
    secondary: "#00BCD4",
    success: "#4CAF50",
    error: "#f44336",
  },
  {
    name: "Vermelho/Amarelo",
    primary: "#F44336",
    secondary: "#FFC107",
    success: "#4CAF50",
    error: "#FF5722",
  },
];

interface ThemeSettingsProps {
  onClose?: () => void;
}

const ThemeSettings: React.FC<ThemeSettingsProps> = ({ onClose }) => {
  const dispatch = useDispatch();
  const { settings, loading, error } = useSelector(
    (state: RootState) => state.theme
  );

  const [localSettings, setLocalSettings] = useState({
    theme_mode: settings?.theme_mode || "dark",
    primary_color: settings?.primary_color || "#3070FF",
    secondary_color: settings?.secondary_color || "#00E5E0",
    success_color: settings?.success_color || "#00D97E",
    error_color: settings?.error_color || "#f44336",
  });

  const [previewDialogOpen, setPreviewDialogOpen] = useState(false);
  const [resetDialogOpen, setResetDialogOpen] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [toast, setToast] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error",
  });

  // Update local settings when Redux settings change
  useEffect(() => {
    if (settings) {
      setLocalSettings({
        theme_mode: settings.theme_mode,
        primary_color: settings.primary_color,
        secondary_color: settings.secondary_color,
        success_color: settings.success_color,
        error_color: settings.error_color,
      });
    }
  }, [settings]);

  // Check for changes
  useEffect(() => {
    if (settings) {
      const changed =
        localSettings.theme_mode !== settings.theme_mode ||
        localSettings.primary_color !== settings.primary_color ||
        localSettings.secondary_color !== settings.secondary_color ||
        localSettings.success_color !== settings.success_color ||
        localSettings.error_color !== settings.error_color;
      setHasChanges(changed);
    }
  }, [localSettings, settings]);

  const handleColorSchemeSelect = (scheme: (typeof colorSchemes)[0]) => {
    setLocalSettings({
      ...localSettings,
      primary_color: scheme.primary,
      secondary_color: scheme.secondary,
      success_color: scheme.success,
      error_color: scheme.error,
    });
  };

  const handleSave = async () => {
    try {
      dispatch(setThemeLoading(true));

      const updateData: UpdateUserSettingsDto = {
        theme_mode: localSettings.theme_mode as "light" | "dark",
        primary_color: localSettings.primary_color,
        secondary_color: localSettings.secondary_color,
        success_color: localSettings.success_color,
        error_color: localSettings.error_color,
      };

      const updatedSettings = await SettingsService.updateUserSettings(
        updateData
      );
      dispatch(setThemeSettings(updatedSettings));

      setToast({
        open: true,
        message: "Configurações de tema salvas com sucesso!",
        severity: "success",
      });

      if (onClose) onClose();
    } catch (error) {
      dispatch(setThemeError("Erro ao salvar configurações de tema"));
      setToast({
        open: true,
        message: "Erro ao salvar configurações de tema",
        severity: "error",
      });
    }
  };

  const handleReset = async () => {
    try {
      dispatch(setThemeLoading(true));
      const defaultSettings = await SettingsService.resetUserSettings();
      dispatch(setThemeSettings(defaultSettings));

      setToast({
        open: true,
        message: "Tema restaurado para o padrão!",
        severity: "success",
      });

      setResetDialogOpen(false);
    } catch (error) {
      dispatch(setThemeError("Erro ao restaurar tema padrão"));
      setToast({
        open: true,
        message: "Erro ao restaurar tema padrão",
        severity: "error",
      });
    }
  };

  const handlePreview = () => {
    // Temporarily update the theme for preview
    dispatch(updateThemeSettings(localSettings));
    setPreviewDialogOpen(true);
  };

  const handlePreviewClose = () => {
    // Restore original settings
    if (settings) {
      dispatch(setThemeSettings(settings));
    }
    setPreviewDialogOpen(false);
  };

  const isValidHexColor = (color: string) => {
    return /^#[0-9A-Fa-f]{6}$/.test(color);
  };

  return (
    <Box>
      <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
        <PaletteIcon sx={{ mr: 1, color: "primary.main" }} />
        <Typography variant="h6" component="h2">
          Configurações de Tema
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* Theme Mode */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <FormControl component="fieldset">
                <FormLabel component="legend">
                  <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                    {localSettings.theme_mode === "dark" ? (
                      <DarkModeIcon sx={{ mr: 1 }} />
                    ) : (
                      <LightModeIcon sx={{ mr: 1 }} />
                    )}
                    Modo do Tema
                  </Box>
                </FormLabel>
                <RadioGroup
                  row
                  value={localSettings.theme_mode}
                  onChange={(e) =>
                    setLocalSettings({
                      ...localSettings,
                      theme_mode: e.target.value as "light" | "dark",
                    })
                  }
                >
                  <FormControlLabel
                    value="dark"
                    control={<Radio />}
                    label="Escuro"
                  />
                  <FormControlLabel
                    value="light"
                    control={<Radio />}
                    label="Claro"
                  />
                </RadioGroup>
              </FormControl>
            </CardContent>
          </Card>
        </Grid>

        {/* Predefined Color Schemes */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="subtitle1" gutterBottom>
                Esquemas de Cores Predefinidos
              </Typography>
              <Grid container spacing={1}>
                {colorSchemes.map((scheme, index) => (
                  <Grid item key={index}>
                    <Chip
                      label={scheme.name}
                      onClick={() => handleColorSchemeSelect(scheme)}
                      variant={
                        localSettings.primary_color === scheme.primary &&
                        localSettings.secondary_color === scheme.secondary
                          ? "filled"
                          : "outlined"
                      }
                      sx={{
                        background:
                          localSettings.primary_color === scheme.primary &&
                          localSettings.secondary_color === scheme.secondary
                            ? `linear-gradient(45deg, ${scheme.primary}, ${scheme.secondary})`
                            : undefined,
                        color:
                          localSettings.primary_color === scheme.primary &&
                          localSettings.secondary_color === scheme.secondary
                            ? "white"
                            : undefined,
                      }}
                    />
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Custom Colors */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="subtitle1" gutterBottom>
                Cores Personalizadas
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6} md={3}>
                  <TextField
                    fullWidth
                    label="Cor Primária"
                    type="color"
                    value={localSettings.primary_color}
                    onChange={(e) =>
                      setLocalSettings({
                        ...localSettings,
                        primary_color: e.target.value,
                      })
                    }
                    error={!isValidHexColor(localSettings.primary_color)}
                    helperText={
                      !isValidHexColor(localSettings.primary_color)
                        ? "Cor inválida"
                        : ""
                    }
                    InputProps={{
                      startAdornment: (
                        <Box
                          sx={{
                            width: 20,
                            height: 20,
                            backgroundColor: localSettings.primary_color,
                            borderRadius: 1,
                            mr: 1,
                            border: "1px solid",
                            borderColor: "divider",
                          }}
                        />
                      ),
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <TextField
                    fullWidth
                    label="Cor Secundária"
                    type="color"
                    value={localSettings.secondary_color}
                    onChange={(e) =>
                      setLocalSettings({
                        ...localSettings,
                        secondary_color: e.target.value,
                      })
                    }
                    error={!isValidHexColor(localSettings.secondary_color)}
                    helperText={
                      !isValidHexColor(localSettings.secondary_color)
                        ? "Cor inválida"
                        : ""
                    }
                    InputProps={{
                      startAdornment: (
                        <Box
                          sx={{
                            width: 20,
                            height: 20,
                            backgroundColor: localSettings.secondary_color,
                            borderRadius: 1,
                            mr: 1,
                            border: "1px solid",
                            borderColor: "divider",
                          }}
                        />
                      ),
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <TextField
                    fullWidth
                    label="Cor de Sucesso"
                    type="color"
                    value={localSettings.success_color}
                    onChange={(e) =>
                      setLocalSettings({
                        ...localSettings,
                        success_color: e.target.value,
                      })
                    }
                    error={!isValidHexColor(localSettings.success_color)}
                    helperText={
                      !isValidHexColor(localSettings.success_color)
                        ? "Cor inválida"
                        : ""
                    }
                    InputProps={{
                      startAdornment: (
                        <Box
                          sx={{
                            width: 20,
                            height: 20,
                            backgroundColor: localSettings.success_color,
                            borderRadius: 1,
                            mr: 1,
                            border: "1px solid",
                            borderColor: "divider",
                          }}
                        />
                      ),
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <TextField
                    fullWidth
                    label="Cor de Erro"
                    type="color"
                    value={localSettings.error_color}
                    onChange={(e) =>
                      setLocalSettings({
                        ...localSettings,
                        error_color: e.target.value,
                      })
                    }
                    error={!isValidHexColor(localSettings.error_color)}
                    helperText={
                      !isValidHexColor(localSettings.error_color)
                        ? "Cor inválida"
                        : ""
                    }
                    InputProps={{
                      startAdornment: (
                        <Box
                          sx={{
                            width: 20,
                            height: 20,
                            backgroundColor: localSettings.error_color,
                            borderRadius: 1,
                            mr: 1,
                            border: "1px solid",
                            borderColor: "divider",
                          }}
                        />
                      ),
                    }}
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Action Buttons */}
        <Grid item xs={12}>
          <Box sx={{ display: "flex", gap: 2, justifyContent: "flex-end" }}>
            <Button
              variant="outlined"
              startIcon={<ResetIcon />}
              onClick={() => setResetDialogOpen(true)}
              disabled={loading}
            >
              Restaurar Padrão
            </Button>
            <Button
              variant="outlined"
              startIcon={<PreviewIcon />}
              onClick={handlePreview}
              disabled={!hasChanges || loading}
            >
              Visualizar
            </Button>
            <Button
              variant="contained"
              startIcon={
                loading ? <CircularProgress size={20} /> : <SaveIcon />
              }
              onClick={handleSave}
              disabled={!hasChanges || loading}
            >
              Salvar Alterações
            </Button>
          </Box>
        </Grid>
      </Grid>

      {/* Preview Dialog */}
      <Dialog
        open={previewDialogOpen}
        onClose={handlePreviewClose}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Visualização do Tema</DialogTitle>
        <DialogContent>
          <Typography paragraph>
            Esta é uma prévia de como o tema ficará. As cores e o modo foram
            aplicados temporariamente.
          </Typography>
          <Box sx={{ display: "flex", gap: 1, mb: 2 }}>
            <Button variant="contained" size="small">
              Primária
            </Button>
            <Button variant="contained" color="secondary" size="small">
              Secundária
            </Button>
            <Button variant="contained" color="success" size="small">
              Sucesso
            </Button>
            <Button variant="contained" color="error" size="small">
              Erro
            </Button>
          </Box>
          <Card sx={{ p: 2 }}>
            <Typography variant="h6">Exemplo de Card</Typography>
            <Typography variant="body2" color="text.secondary">
              Este é um exemplo de como os cards ficarão com o novo tema.
            </Typography>
          </Card>
        </DialogContent>
        <DialogActions>
          <Button onClick={handlePreviewClose}>Fechar Prévia</Button>
          <Button
            variant="contained"
            onClick={() => {
              handlePreviewClose();
              handleSave();
            }}
          >
            Aplicar Tema
          </Button>
        </DialogActions>
      </Dialog>

      {/* Reset Confirmation Dialog */}
      <Dialog open={resetDialogOpen} onClose={() => setResetDialogOpen(false)}>
        <DialogTitle>Restaurar Tema Padrão</DialogTitle>
        <DialogContent>
          <Typography>
            Tem certeza que deseja restaurar o tema para as configurações
            padrão? Todas as personalizações serão perdidas.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setResetDialogOpen(false)}>Cancelar</Button>
          <Button onClick={handleReset} color="error" variant="contained">
            Restaurar
          </Button>
        </DialogActions>
      </Dialog>

      <Toast
        open={toast.open}
        message={toast.message}
        severity={toast.severity}
        onClose={() => setToast({ ...toast, open: false })}
      />
    </Box>
  );
};

export default ThemeSettings;
