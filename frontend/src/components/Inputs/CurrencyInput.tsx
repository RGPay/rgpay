import React, { useState, useEffect } from "react";
import { TextField, TextFieldProps } from "@mui/material";
import { NumericFormat } from "react-number-format";

interface CustomProps {
  onChange: (event: { target: { name: string; value: string } }) => void;
  name: string;
}

const NumericFormatCustom = React.forwardRef<HTMLInputElement, CustomProps>(
  function NumericFormatCustom(props, ref) {
    const { onChange, ...other } = props;

    return (
      <NumericFormat
        {...other}
        getInputRef={ref}
        onValueChange={(values) => {
          onChange({
            target: {
              name: props.name,
              value: values.value,
            },
          });
        }}
        thousandSeparator="."
        decimalSeparator=","
        valueIsNumericString
        prefix="R$ "
        decimalScale={2}
        fixedDecimalScale
      />
    );
  }
);

interface CurrencyInputProps extends Omit<TextFieldProps, "onChange"> {
  initialValue?: number;
  onChange: (value: number) => void;
}

export default function CurrencyInput({
  initialValue = 0,
  onChange,
  name = "currency-input",
  ...other
}: CurrencyInputProps) {
  const [value, setValue] = useState<string>(initialValue.toString());

  useEffect(() => {
    setValue(initialValue.toString());
  }, [initialValue]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value);
    onChange(parseFloat(event.target.value) || 0);
  };

  return (
    <TextField
      {...other}
      name={name}
      value={value}
      onChange={handleChange}
      InputProps={{
        inputComponent: NumericFormatCustom as any,
      }}
      variant="outlined"
      size="small"
    />
  );
}
