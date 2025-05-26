import React, { useState } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Switch,
  FormControlLabel,
  Button,
  TextField,
  MenuItem,
  Alert,
  Chip,
} from "@mui/material";
import {
  Notifications as NotificationsIcon,
  Security as SecurityIcon,
  Palette as PaletteIcon,
  Storage as StorageIcon,
  Save as SaveIcon,
  RestartAlt as RestartIcon,
} from "@mui/icons-material";
import { Toast } from "../components";

const SettingsPage: React.FC = () => {
  const [settings, setSettings] = useState({
    notifications: {
      email: true,
      push: false,
      orderAlerts: true,
      lowStock: true,
    },
    appearance: {
      theme: "light",
      language: "pt-BR",
      compactMode: false,
    },
    system: {
      autoBackup: true,
      backupFrequency: "daily",
      sessionTimeout: 30,
    },
  });

  const [toast, setToast] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error",
  });

  const handleCloseToast = () => {
    setToast({ ...toast, open: false });
  };

  const handleSettingChange = (
    category: string,
    setting: string,
    value: string | number | boolean
  ) => {
    setSettings((prev) => ({
      ...prev,
      [category]: {
        ...prev[category as keyof typeof prev],
        [setting]: value,
      },
    }));
  };

  const handleSaveSettings = () => {
    try {
      // Here you would save settings to backend
      // await settingsService.updateSettings(settings);
      console.log("Saving settings:", settings);

      setToast({
        open: true,
        message: "Configurações salvas com sucesso",
        severity: "success",
      });
    } catch {
      setToast({
        open: true,
        message: "Erro ao salvar configurações",
        severity: "error",
      });
    }
  };

  const handleResetSettings = () => {
    setSettings({
      notifications: {
        email: true,
        push: false,
        orderAlerts: true,
        lowStock: true,
      },
      appearance: {
        theme: "light",
        language: "pt-BR",
        compactMode: false,
      },
      system: {
        autoBackup: true,
        backupFrequency: "daily",
        sessionTimeout: 30,
      },
    });

    setToast({
      open: true,
      message: "Configurações restauradas para o padrão",
      severity: "success",
    });
  };

  return (
    <Box>
      <Typography variant="h5" component="h1" gutterBottom>
        Configurações
      </Typography>

      <Grid container spacing={3}>
        {/* Notifications Settings */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <NotificationsIcon sx={{ mr: 1, color: "primary.main" }} />
                <Typography variant="h6">Notificações</Typography>
              </Box>

              <FormControlLabel
                control={
                  <Switch
                    checked={settings.notifications.email}
                    onChange={(e) =>
                      handleSettingChange(
                        "notifications",
                        "email",
                        e.target.checked
                      )
                    }
                  />
                }
                label="Notificações por Email"
              />

              <FormControlLabel
                control={
                  <Switch
                    checked={settings.notifications.push}
                    onChange={(e) =>
                      handleSettingChange(
                        "notifications",
                        "push",
                        e.target.checked
                      )
                    }
                  />
                }
                label="Notificações Push"
              />

              <FormControlLabel
                control={
                  <Switch
                    checked={settings.notifications.orderAlerts}
                    onChange={(e) =>
                      handleSettingChange(
                        "notifications",
                        "orderAlerts",
                        e.target.checked
                      )
                    }
                  />
                }
                label="Alertas de Pedidos"
              />

              <FormControlLabel
                control={
                  <Switch
                    checked={settings.notifications.lowStock}
                    onChange={(e) =>
                      handleSettingChange(
                        "notifications",
                        "lowStock",
                        e.target.checked
                      )
                    }
                  />
                }
                label="Alertas de Estoque Baixo"
              />
            </CardContent>
          </Card>
        </Grid>

        {/* Appearance Settings */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <PaletteIcon sx={{ mr: 1, color: "primary.main" }} />
                <Typography variant="h6">Aparência</Typography>
              </Box>

              <TextField
                fullWidth
                select
                label="Tema"
                value={settings.appearance.theme}
                onChange={(e) =>
                  handleSettingChange("appearance", "theme", e.target.value)
                }
                sx={{ mb: 2 }}
              >
                <MenuItem value="light">Claro</MenuItem>
                <MenuItem value="dark">Escuro</MenuItem>
                <MenuItem value="auto">Automático</MenuItem>
              </TextField>

              <TextField
                fullWidth
                select
                label="Idioma"
                value={settings.appearance.language}
                onChange={(e) =>
                  handleSettingChange("appearance", "language", e.target.value)
                }
                sx={{ mb: 2 }}
              >
                <MenuItem value="pt-BR">Português (Brasil)</MenuItem>
                <MenuItem value="en-US">English (US)</MenuItem>
                <MenuItem value="es-ES">Español</MenuItem>
              </TextField>

              <FormControlLabel
                control={
                  <Switch
                    checked={settings.appearance.compactMode}
                    onChange={(e) =>
                      handleSettingChange(
                        "appearance",
                        "compactMode",
                        e.target.checked
                      )
                    }
                  />
                }
                label="Modo Compacto"
              />
            </CardContent>
          </Card>
        </Grid>

        {/* System Settings */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <SecurityIcon sx={{ mr: 1, color: "primary.main" }} />
                <Typography variant="h6">Sistema e Segurança</Typography>
              </Box>

              <Grid container spacing={3}>
                <Grid item xs={12} sm={6} md={4}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.system.autoBackup}
                        onChange={(e) =>
                          handleSettingChange(
                            "system",
                            "autoBackup",
                            e.target.checked
                          )
                        }
                      />
                    }
                    label="Backup Automático"
                  />
                </Grid>

                <Grid item xs={12} sm={6} md={4}>
                  <TextField
                    fullWidth
                    select
                    label="Frequência do Backup"
                    value={settings.system.backupFrequency}
                    onChange={(e) =>
                      handleSettingChange(
                        "system",
                        "backupFrequency",
                        e.target.value
                      )
                    }
                    disabled={!settings.system.autoBackup}
                  >
                    <MenuItem value="hourly">A cada hora</MenuItem>
                    <MenuItem value="daily">Diário</MenuItem>
                    <MenuItem value="weekly">Semanal</MenuItem>
                    <MenuItem value="monthly">Mensal</MenuItem>
                  </TextField>
                </Grid>

                <Grid item xs={12} sm={6} md={4}>
                  <TextField
                    fullWidth
                    type="number"
                    label="Timeout da Sessão (min)"
                    value={settings.system.sessionTimeout}
                    onChange={(e) =>
                      handleSettingChange(
                        "system",
                        "sessionTimeout",
                        parseInt(e.target.value)
                      )
                    }
                    inputProps={{ min: 5, max: 480 }}
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Storage Information */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <StorageIcon sx={{ mr: 1, color: "primary.main" }} />
                <Typography variant="h6">Armazenamento</Typography>
              </Box>

              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Uso do Banco de Dados
                </Typography>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Chip label="2.3 GB" color="primary" size="small" />
                  <Typography variant="body2" color="text.secondary">
                    de 10 GB disponíveis
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Imagens de Produtos
                </Typography>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Chip label="456 MB" color="secondary" size="small" />
                  <Typography variant="body2" color="text.secondary">
                    em 1.2k imagens
                  </Typography>
                </Box>
              </Box>

              <Button variant="outlined" size="small">
                Limpar Cache
              </Button>
            </CardContent>
          </Card>
        </Grid>

        {/* System Information */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Informações do Sistema
              </Typography>

              <Box sx={{ mb: 1 }}>
                <Typography variant="body2" color="text.secondary">
                  Versão: <strong>1.0.0</strong>
                </Typography>
              </Box>

              <Box sx={{ mb: 1 }}>
                <Typography variant="body2" color="text.secondary">
                  Última Atualização: <strong>15/01/2024</strong>
                </Typography>
              </Box>

              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Uptime: <strong>7 dias, 14 horas</strong>
                </Typography>
              </Box>

              <Alert severity="info" sx={{ mb: 2 }}>
                Sistema funcionando normalmente
              </Alert>

              <Button variant="outlined" size="small">
                Verificar Atualizações
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Action Buttons */}
      <Box sx={{ mt: 4, display: "flex", gap: 2, justifyContent: "flex-end" }}>
        <Button
          variant="outlined"
          startIcon={<RestartIcon />}
          onClick={handleResetSettings}
        >
          Restaurar Padrão
        </Button>
        <Button
          variant="contained"
          startIcon={<SaveIcon />}
          onClick={handleSaveSettings}
        >
          Salvar Configurações
        </Button>
      </Box>

      <Toast
        open={toast.open}
        message={toast.message}
        severity={toast.severity}
        onClose={handleCloseToast}
      />
    </Box>
  );
};

export default SettingsPage;
