import React from "react";
import { Checkbox, FormControlLabel } from "@mui/material";
import { useField } from "formik";

interface AutoLoginCheckboxProps {
  name?: string;
  label?: string;
}

export default function AutoLoginCheckbox({
  name = "autoLogin",
  label = "Login automático",
}: AutoLoginCheckboxProps) {
  const [field] = useField({ name, type: "checkbox" });
  return (
    <FormControlLabel
      control={<Checkbox {...field} checked={field.value} color="primary" />}
      label={label}
    />
  );
} 