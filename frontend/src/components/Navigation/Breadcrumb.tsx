import React from "react";
import { Breadcrumbs, Link, Typography, Box } from "@mui/material";
import { Link as RouterLink, useLocation } from "react-router-dom";
import { NavigateNext as NavigateNextIcon } from "@mui/icons-material";

interface RouteMapping {
  [key: string]: {
    path: string;
    label: string;
    parent?: string;
  };
}

// Define route mappings for breadcrumb paths
const routeMap: RouteMapping = {
  "/": {
    path: "/",
    label: "Dashboard",
  },
  "/produtos": {
    path: "/produtos",
    label: "Produtos",
  },
  "/produtos/novo": {
    path: "/produtos/novo",
    label: "Novo Produto",
    parent: "/produtos",
  },
  "/produtos/editar": {
    path: "/produtos/editar",
    label: "Editar Produto",
    parent: "/produtos",
  },
  "/pedidos": {
    path: "/pedidos",
    label: "Pedidos",
  },
  "/pedidos/novo": {
    path: "/pedidos/novo",
    label: "Novo Pedido",
    parent: "/pedidos",
  },
  "/pedidos/detalhes": {
    path: "/pedidos/detalhes",
    label: "Detalhes do Pedido",
    parent: "/pedidos",
  },
  "/unidades": {
    path: "/unidades",
    label: "Unidades",
  },
  "/unidades/nova": {
    path: "/unidades/nova",
    label: "Nova Unidade",
    parent: "/unidades",
  },
  "/unidades/editar": {
    path: "/unidades/editar",
    label: "Editar Unidade",
    parent: "/unidades",
  },
  "/profile": {
    path: "/profile",
    label: "Perfil",
  },
};

const Breadcrumb: React.FC = () => {
  const location = useLocation();
  const pathnames = location.pathname.split("/").filter((x) => x);

  // Build the breadcrumb paths dynamically
  const breadcrumbPaths: { path: string; label: string }[] = [];

  // Always include home
  breadcrumbPaths.push({ path: "/", label: "Home" });

  // Add paths based on current location and defined mappings
  if (pathnames.length > 0) {
    let currentPath = "";

    for (let i = 0; i < pathnames.length; i++) {
      currentPath += `/${pathnames[i]}`;

      // Check if this path exists in our map
      if (routeMap[currentPath]) {
        breadcrumbPaths.push({
          path: routeMap[currentPath].path,
          label: routeMap[currentPath].label,
        });
      } else {
        // If not in map, use the path segment as label (capitalized)
        breadcrumbPaths.push({
          path: currentPath,
          label: pathnames[i].charAt(0).toUpperCase() + pathnames[i].slice(1),
        });
      }
    }
  }

  return (
    <Box sx={{ mb: 2, mt: 1 }}>
      <Breadcrumbs
        separator={<NavigateNextIcon fontSize="small" />}
        aria-label="breadcrumb"
      >
        {breadcrumbPaths.map((item, index) => {
          const isLast = index === breadcrumbPaths.length - 1;

          return isLast ? (
            <Typography color="text.primary" key={item.path}>
              {item.label}
            </Typography>
          ) : (
            <Link
              component={RouterLink}
              underline="hover"
              to={item.path}
              color="inherit"
              key={item.path}
            >
              {item.label}
            </Link>
          );
        })}
      </Breadcrumbs>
    </Box>
  );
};

export default Breadcrumb;
