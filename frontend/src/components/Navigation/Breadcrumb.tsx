import React, { useEffect, useState } from "react";
import { Breadcrumbs, Link, Typography, Box } from "@mui/material";
import { Link as RouterLink, useLocation } from "react-router-dom";
import { NavigateNext as NavigateNextIcon } from "@mui/icons-material";
import maquinetasService from "../../services/maquinetas.service";
import produtosService from "../../services/produtos.service";
import eventosService from "../../services/eventos.service";
import unidadesService from "../../services/unidades.service";

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
    label: "Home",
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
  "/settings": {
    path: "/settings",
    label: "Configurações",
  },
  "/categories": {
    path: "/categories",
    label: "Categorias",
  },
  "/categories/new": {
    path: "/categories/new",
    label: "Nova Categoria",
    parent: "/categories",
  },
};

const Breadcrumb: React.FC = () => {
  const location = useLocation();
  const pathnames = location.pathname.split("/").filter((x) => x);
  const [maquinetaSerie, setMaquinetaSerie] = useState<string | null>(null);
  const [produtoNome, setProdutoNome] = useState<string | null>(null);
  const [eventoNome, setEventoNome] = useState<string | null>(null);
  const [unidadeNome, setUnidadeNome] = useState<string | null>(null);

  // Fetch serial number for breadcrumb when editing maquineta
  useEffect(() => {
    setMaquinetaSerie(null);
    setProdutoNome(null);
    setEventoNome(null);
    setUnidadeNome(null);
    if (
      pathnames.length >= 3 &&
      pathnames[0] === "maquinetas" &&
      pathnames[1] === "editar"
    ) {
      const id = Number(pathnames[2]);
      if (!Number.isNaN(id)) {
        maquinetasService
          .getById(id)
          .then((m) => setMaquinetaSerie(m.numero_serie))
          .catch(() => setMaquinetaSerie(null));
      }
    }
    if (
      pathnames.length >= 3 &&
      pathnames[0] === "produtos" &&
      pathnames[1] === "editar"
    ) {
      const id = Number(pathnames[2]);
      if (!Number.isNaN(id)) {
        produtosService
          .getById(id)
          .then((p) => setProdutoNome(p.nome))
          .catch(() => setProdutoNome(null));
      }
    }
    if (
      pathnames.length >= 3 &&
      pathnames[0] === "eventos" &&
      pathnames[1] === "editar"
    ) {
      const id = Number(pathnames[2]);
      if (!Number.isNaN(id)) {
        eventosService
          .getById(id)
          .then((e) => setEventoNome(e.nome))
          .catch(() => setEventoNome(null));
      }
    }
    if (
      pathnames.length >= 3 &&
      pathnames[0] === "unidades" &&
      pathnames[1] === "editar"
    ) {
      const id = Number(pathnames[2]);
      if (!Number.isNaN(id)) {
        unidadesService
          .getById(id)
          .then((u) => setUnidadeNome(u.nome))
          .catch(() => setUnidadeNome(null));
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

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
        const segmentLabelMap: Record<string, string> = {
          categories: "Categorias",
          new: "Novo",
          edit: "Editar",
          settings: "Configurações",
          relatorios: "Relatórios",
          profile: "Perfil",
        };
        const raw = pathnames[i];
        const friendly = segmentLabelMap[raw] || raw.charAt(0).toUpperCase() + raw.slice(1);
        breadcrumbPaths.push({
          path: currentPath,
          label: friendly,
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
          let label = item.label;
          // Replace last label on edit routes with entity human-readable name
          if (
            isLast &&
            pathnames.length >= 3
          ) {
            if (
              pathnames[0] === "maquinetas" &&
              pathnames[1] === "editar" &&
              maquinetaSerie
            ) {
              label = maquinetaSerie;
            } else if (
              pathnames[0] === "produtos" &&
              pathnames[1] === "editar" &&
              produtoNome
            ) {
              label = produtoNome;
            } else if (
              pathnames[0] === "eventos" &&
              pathnames[1] === "editar" &&
              eventoNome
            ) {
              label = eventoNome;
            } else if (
              pathnames[0] === "unidades" &&
              pathnames[1] === "editar" &&
              unidadeNome
            ) {
              label = unidadeNome;
            }
          }

          return isLast ? (
            <Typography color="text.primary" key={item.path}>
              {label}
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
