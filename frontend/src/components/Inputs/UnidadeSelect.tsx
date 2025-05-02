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
import { setSelectedUnidade } from "../../store/unidadeSlice";
import type { RootState } from "../../store/store";
import unidadesService, { Unidade } from "../../services/unidades.service";

const UnidadeSelect: React.FC = () => {
  const dispatch = useDispatch();
  const selectedUnidade = useSelector(
    (state: RootState) => state.unidade.selectedUnidade
  );
  const [unidades, setUnidades] = useState<Unidade[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    unidadesService
      .getAll()
      .then((data) => {
        setUnidades(data || []);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleChange = (event: SelectChangeEvent<string>) => {
    dispatch(setSelectedUnidade(event.target.value as string));
  };

  return (
    <FormControl size="small" sx={{ minWidth: 160, mr: 2 }}>
      <InputLabel id="unidade-select-label">Unidade</InputLabel>
      {loading ? (
        <CircularProgress size={24} />
      ) : (
        <Select
          labelId="unidade-select-label"
          value={selectedUnidade || ""}
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
