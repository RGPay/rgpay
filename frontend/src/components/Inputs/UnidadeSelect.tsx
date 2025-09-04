import React, { useEffect, useState } from "react";
import {
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  CircularProgress,
  SelectChangeEvent,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { setSelectedUnidade } from "../../store/unidadeSlice";
import type { RootState } from "../../store/store";
import unidadesService, { Unidade } from "../../services/unidades.service";

const UnidadeSelect: React.FC = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const selectedUnidade = useSelector(
    (state: RootState) => state.unidade.selectedUnidade
  );
  const [unidades, setUnidades] = useState<Unidade[]>([]);
  const [loading, setLoading] = useState(false);

  const loadUnidades = () => {
    setLoading(true);
    unidadesService
      .getAll()
      .then((data) => setUnidades(data || []))
      .finally(() => setLoading(false));
  };

  // Load on mount and whenever the route changes (e.g., after creating a unidade)
  useEffect(() => {
    loadUnidades();
    // Also refresh when the window regains focus (user returns from another tab)
    const onFocus = () => loadUnidades();
    window.addEventListener("focus", onFocus);
    return () => window.removeEventListener("focus", onFocus);
  }, [location.key]);

  const handleChange = (event: SelectChangeEvent<string>) => {
    const value = event.target.value;
    dispatch(setSelectedUnidade(value ? parseInt(value, 10) : null));
  };

  return (
    <FormControl size="small" sx={{ minWidth: 160, mr: 2 }}>
      <InputLabel id="unidade-select-label">Unidade</InputLabel>
      {loading ? (
        <CircularProgress size={24} />
      ) : (
        <Select
          labelId="unidade-select-label"
          value={selectedUnidade ? String(selectedUnidade) : ""}
          label="Unidade"
          onChange={handleChange}
        >
          <MenuItem value="">Todas</MenuItem>
          {unidades.map((unidade) => (
            <MenuItem
              key={unidade.id_unidade}
              value={String(unidade.id_unidade)}
            >
              {unidade.nome}
            </MenuItem>
          ))}
        </Select>
      )}
    </FormControl>
  );
};

export default UnidadeSelect;
