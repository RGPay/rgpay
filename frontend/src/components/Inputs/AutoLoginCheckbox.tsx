import React from "react";
import { Checkbox, FormControlLabel, Tooltip, IconButton } from "@mui/material";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { useField } from "formik";

interface AutoLoginCheckboxProps {
  name?: string;
  label?: string;
}

export default function AutoLoginCheckbox({
  name = "autoLogin",
  label = "Manter logado",
}: AutoLoginCheckboxProps) {
  const [field] = useField({ name, type: "checkbox" });
  return (
    <FormControlLabel
      control={<Checkbox {...field} checked={field.value} color="primary" />}
      label={
        <span style={{ display: "flex", alignItems: "center" }}>
          {label}
          <Tooltip
            title="Se ativado, você permanecerá conectado automaticamente neste dispositivo."
            placement="right"
            arrow
          >
            <IconButton size="small" sx={{ ml: 0.5 }}>
              <InfoOutlinedIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </span>
      }
    />
  );
} 