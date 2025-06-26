import React, { useState, ReactNode, useEffect } from "react";
import {
  AppBar,
  Box,
  Drawer,
  IconButton,
  Toolbar,
  Typography,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  useMediaQuery,
  Avatar,
  Menu,
  MenuItem,
  Tooltip,
  Container,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  ShoppingCart as ShoppingCartIcon,
  Restaurant as RestaurantIcon,
  LocationOn as LocationOnIcon,
  Logout as LogoutIcon,
  Person as PersonIcon,
  Settings as SettingsIcon,
  Event as EventIcon,
  Category as CategoryIcon,
  Assessment as AssessmentIcon,
  Memory as MemoryIcon,
} from "@mui/icons-material";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../store/authSlice";
import type { RootState } from "../../store/store";
import { Breadcrumb } from "../Navigation";
import UnidadeSelect from "../Inputs/UnidadeSelect";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import AuthService from "../../services/auth.service";

const drawerWidth = 260;

// Map of routes to page titles
const pageTitles: Record<string, string> = {
  "/": "Dashboard",
  "/about": "Sobre",
  "/produtos": "Produtos",
  "/produtos/novo": "Novo Produto",
  "/pedidos": "Pedidos",
  "/maquinetas": "Maquinetas",
  "/maquinetas/nova": "Nova Maquineta",
  "/unidades": "Unidades",
  "/unidades/nova": "Nova Unidade",
  "/relatorios": "Relatórios",
  "/profile": "Perfil",
  "/settings": "Configurações",
};

interface MainLayoutProps {
  children: ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [open, setOpen] = useState(!isMobile);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.auth.user);
  const location = useLocation();
  const [revokeDialogOpen, setRevokeDialogOpen] = useState(false);

  // Close drawer on mobile when route changes
  useEffect(() => {
    if (isMobile) {
      setOpen(false);
    }
  }, [location.pathname, isMobile]);

  // Determine page title based on current route
  const getPageTitle = () => {
    const path = location.pathname;

    // First check for exact matches
    if (pageTitles[path]) {
      return pageTitles[path];
    }

    // Then check for nested routes with params
    if (path.match(/\/produtos\/editar\/\d+/)) {
      return "Editar Produto";
    }

    if (path.match(/\/pedidos\/detalhes\/\d+/)) {
      return "Detalhes do Pedido";
    }

    if (path.match(/\/maquinetas\/editar\/\d+/)) {
      return "Editar Maquineta";
    }

    if (path.match(/\/unidades\/editar\/\d+/)) {
      return "Editar Unidade";
    }

    // Default title if no match found
    return "RGPay";
  };

  const handleDrawerToggle = () => {
    setOpen(!open);
  };

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  const handleRevokeAutoLogin = async () => {
    if (user && user.sub) {
      try {
        await AuthService.revokeRefreshTokens(user.sub);
      } catch {
        // Ignore errors when revoking tokens
      }
    }
    localStorage.removeItem("token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("user");
    setRevokeDialogOpen(false);
  };

  const menuItems = [
    { text: "Dashboard", icon: <DashboardIcon />, path: "/" },
    { text: "Produtos", icon: <RestaurantIcon />, path: "/produtos" },
    { text: "Categorias", icon: <CategoryIcon />, path: "/categories" },
    { text: "Pedidos", icon: <ShoppingCartIcon />, path: "/pedidos" },
    { text: "Maquinetas", icon: <MemoryIcon />, path: "/maquinetas" },
    { text: "Eventos", icon: <EventIcon />, path: "/eventos" },
    { text: "Relatórios", icon: <AssessmentIcon />, path: "/relatorios" },
    { text: "Unidades", icon: <LocationOnIcon />, path: "/unidades" },
  ];

  const isActiveRoute = (path: string) => {
    return (
      location.pathname === path || location.pathname.startsWith(`${path}/`)
    );
  };

  // Logo component with gradient text
  const Logo = () => (
    <Box sx={{ display: "flex", alignItems: "center", py: 2 }}>
      <Typography
        variant="h5"
        sx={{
          fontWeight: 700,
          background: "linear-gradient(45deg, #3070FF 30%, #00E5E0 90%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          textAlign: "center",
          width: "100%",
        }}
      >
        RGPay
      </Typography>
    </Box>
  );

  return (
    <Box sx={{ display: "flex", height: "100vh" }}>
      {/* AppBar */}
      <AppBar
        position="fixed"
        sx={{
          zIndex: theme.zIndex.drawer + 1,
          transition: theme.transitions.create(["width", "margin"], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{
              flexGrow: 1,
              fontWeight: 600,
            }}
          >
            {getPageTitle()}
          </Typography>

          {/* Unidade Select */}
          <UnidadeSelect />

          {/* Settings */}
          <Tooltip title="Configurações">
            <IconButton
              color="inherit"
              sx={{ mr: 1 }}
              onClick={() => navigate("/settings")}
            >
              <SettingsIcon />
            </IconButton>
          </Tooltip>

          {/* User Profile */}
          <Tooltip title="Perfil">
            <IconButton
              edge="end"
              aria-label="account of current user"
              aria-haspopup="true"
              onClick={handleProfileMenuOpen}
              color="inherit"
              sx={{
                border: "2px solid rgba(255, 255, 255, 0.2)",
                padding: "4px",
              }}
            >
              <Avatar
                alt={user?.name || "User"}
                src={user?.avatar || ""}
                sx={{
                  width: 32,
                  height: 32,
                  background:
                    "linear-gradient(45deg, #3070FF 30%, #00E5E0 90%)",
                }}
              />
            </IconButton>
          </Tooltip>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleProfileMenuClose}
            keepMounted
            transformOrigin={{ horizontal: "right", vertical: "top" }}
            anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
            PaperProps={{
              sx: {
                minWidth: 200,
                mt: 1,
              },
            }}
          >
            <Box
              sx={{
                p: 2,
                pt: 1.5,
                pb: 1.5,
                borderBottom: 1,
                borderColor: "divider",
              }}
            >
              <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                {user?.name || "Usuário"}
              </Typography>
              <Typography variant="body2" sx={{ color: "text.secondary" }}>
                {user?.email || "usuario@exemplo.com"}
              </Typography>
            </Box>
            <MenuItem
              onClick={() => {
                handleProfileMenuClose();
                navigate("/profile");
              }}
              sx={{ py: 1.5 }}
            >
              <ListItemIcon>
                <PersonIcon fontSize="small" color="primary" />
              </ListItemIcon>
              <ListItemText>Perfil</ListItemText>
            </MenuItem>
            <MenuItem onClick={handleLogout} sx={{ py: 1.5 }}>
              <ListItemIcon>
                <LogoutIcon fontSize="small" color="error" />
              </ListItemIcon>
              <ListItemText>Sair</ListItemText>
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      {/* Drawer */}
      {((isMobile && open) || !isMobile) && (
        <Drawer
          variant={isMobile ? "temporary" : "permanent"}
          open={open}
          onClose={isMobile ? handleDrawerToggle : undefined}
          sx={{
            display: open || isMobile ? "block" : "none",
            width: drawerWidth,
            flexShrink: 0,
            [`& .MuiDrawer-paper`]: {
              width: drawerWidth,
              boxSizing: "border-box",
              border: "none",
              background: theme.palette.background.paper,
              boxShadow: "0 8px 32px rgba(0, 0, 0, 0.2)",
              ...(isMobile
                ? {}
                : {
                    position: "relative",
                    transition: theme.transitions.create("width", {
                      easing: theme.transitions.easing.sharp,
                      duration: theme.transitions.duration.enteringScreen,
                    }),
                  }),
            },
          }}
        >
          <Logo />
          <Divider sx={{ opacity: 0.1 }} />
          {/* Remove the close button for Drawer on all devices */}
          {/* (No close button here) */}
          <Box sx={{ overflow: "auto", p: 1 }}>
            <Typography
              variant="overline"
              sx={{
                px: 2,
                py: 1,
                display: "block",
                color: "text.secondary",
                fontWeight: 600,
              }}
            >
              Menu Principal
            </Typography>
            <List>
              {menuItems.map((item) => (
                <ListItem key={item.text} disablePadding sx={{ mb: 0.5 }}>
                  <ListItemButton
                    onClick={() => navigate(item.path)}
                    selected={isActiveRoute(item.path)}
                    sx={{
                      borderRadius: 2,
                      py: 1.2,
                    }}
                  >
                    <ListItemIcon
                      sx={{
                        color: isActiveRoute(item.path)
                          ? "primary.main"
                          : "text.secondary",
                        minWidth: 40,
                      }}
                    >
                      {item.icon}
                    </ListItemIcon>
                    <ListItemText
                      primary={item.text}
                      primaryTypographyProps={{
                        fontWeight: isActiveRoute(item.path) ? 600 : 400,
                        fontSize: "0.95rem",
                      }}
                    />
                    {isActiveRoute(item.path) && (
                      <Box
                        sx={{
                          width: 4,
                          height: 20,
                          borderRadius: 4,
                          background:
                            "linear-gradient(to bottom, #3070FF, #00E5E0)",
                        }}
                      />
                    )}
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
            <Divider sx={{ my: 2, opacity: 0.1 }} />
            <Typography
              variant="overline"
              sx={{
                px: 2,
                py: 1,
                display: "block",
                color: "text.secondary",
                fontWeight: 600,
              }}
            >
              Conta
            </Typography>
            <List>
              <ListItem disablePadding sx={{ mb: 0.5 }}>
                <ListItemButton
                  onClick={() => navigate("/profile")}
                  selected={isActiveRoute("/profile")}
                  sx={{
                    borderRadius: 2,
                    py: 1.2,
                  }}
                >
                  <ListItemIcon sx={{ color: "text.secondary", minWidth: 40 }}>
                    <PersonIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary="Perfil"
                    primaryTypographyProps={{
                      fontWeight: isActiveRoute("/profile") ? 600 : 400,
                      fontSize: "0.95rem",
                    }}
                  />
                </ListItemButton>
              </ListItem>
              {user?.tipo_usuario === "master" && (
                <ListItem disablePadding sx={{ mb: 0.5 }}>
                  <ListItemButton
                    onClick={() => navigate("/settings")}
                    selected={isActiveRoute("/settings")}
                    sx={{
                      borderRadius: 2,
                      py: 1.2,
                    }}
                  >
                    <ListItemIcon
                      sx={{ color: "text.secondary", minWidth: 40 }}
                    >
                      <SettingsIcon />
                    </ListItemIcon>
                    <ListItemText
                      primary="Configurações"
                      primaryTypographyProps={{
                        fontWeight: isActiveRoute("/settings") ? 600 : 400,
                        fontSize: "0.95rem",
                      }}
                    />
                  </ListItemButton>
                </ListItem>
              )}
              <ListItem disablePadding sx={{ mb: 0.5 }}>
                <ListItemButton
                  onClick={handleLogout}
                  sx={{
                    borderRadius: 2,
                    py: 1.2,
                  }}
                >
                  <ListItemIcon sx={{ color: "error.main", minWidth: 40 }}>
                    <LogoutIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary="Sair"
                    primaryTypographyProps={{
                      fontWeight: 400,
                      fontSize: "0.95rem",
                    }}
                  />
                </ListItemButton>
              </ListItem>
            </List>
          </Box>
        </Drawer>
      )}

      {/* Main content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: { xs: 2, sm: 3 },
          transition: "min-width 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          display: "flex",
          flexDirection: "column",
          overflow: "auto",
          backgroundColor: theme.palette.background.default,
        }}
      >
        <Toolbar /> {/* This is to push content below AppBar */}
        <Container
          maxWidth="xl"
          sx={{
            flexGrow: 1,
            px: { xs: 1, sm: 2, md: 3 },
            py: { xs: 1, sm: 2 },
          }}
        >
          <Breadcrumb />
          {children}
        </Container>
      </Box>

      <Dialog
        open={revokeDialogOpen}
        onClose={() => setRevokeDialogOpen(false)}
      >
        <DialogTitle>Esquecer login</DialogTitle>
        <DialogContent>
          Tem certeza que deseja esquecer este login neste dispositivo? Você
          será desconectado imediatamente e precisará digitar seu login e senha
          novamente.
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setRevokeDialogOpen(false)} color="primary">
            Cancelar
          </Button>
          <Button
            onClick={async () => {
              await handleRevokeAutoLogin();
              dispatch(logout());
              navigate("/login");
            }}
            color="warning"
            variant="contained"
          >
            Esquecer
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default MainLayout;
