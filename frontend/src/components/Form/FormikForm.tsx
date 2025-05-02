import React from "react";
import {
  Formik,
  Form,
  Field,
  FieldProps,
  FormikHelpers,
  FormikProps,
} from "formik";
import {
  TextField,
  Button,
  Box,
  Grid,
  FormControl,
  FormLabel,
  RadioGroup,
  Radio,
  FormControlLabel,
  Checkbox,
  MenuItem,
  FormHelperText,
  CircularProgress,
  Typography,
  Paper,
} from "@mui/material";
import { SchemaOf } from "yup";

export type FormikFieldConfig = {
  name: string;
  label: string;
  type?:
    | "text"
    | "email"
    | "password"
    | "number"
    | "tel"
    | "date"
    | "select"
    | "radio"
    | "checkbox"
    | "textarea";
  placeholder?: string;
  required?: boolean;
  fullWidth?: boolean;
  disabled?: boolean;
  options?: Array<{ value: string | number; label: string }>;
  xs?: number;
  sm?: number;
  md?: number;
  lg?: number;
  xl?: number;
  autoFocus?: boolean;
  rows?: number;
  helperText?: string;
};

interface FormikFormProps<T> {
  title?: string;
  initialValues: T;
  validationSchema: SchemaOf<T>;
  onSubmit: (values: T, formikHelpers: FormikHelpers<T>) => void | Promise<any>;
  fields: FormikFieldConfig[];
  submitButtonText?: string;
  cancelButtonText?: string;
  onCancel?: () => void;
  loading?: boolean;
}

function FormikForm<T>({
  title,
  initialValues,
  validationSchema,
  onSubmit,
  fields,
  submitButtonText = "Salvar",
  cancelButtonText = "Cancelar",
  onCancel,
  loading = false,
}: FormikFormProps<T>): React.ReactElement {
  const renderField = (field: FormikFieldConfig, form: FormikProps<T>) => {
    const {
      name,
      label,
      type = "text",
      placeholder,
      required = false,
      fullWidth = true,
      disabled = false,
      options,
      xs = 12,
      sm,
      md,
      lg,
      xl,
      autoFocus = false,
      rows,
      helperText,
    } = field;

    const touched = form.touched[name as keyof T];
    const error = form.errors[name as keyof T];
    const fieldError = touched && error ? String(error) : "";

    switch (type) {
      case "select":
        return (
          <Field name={name}>
            {({ field: fieldProps }: FieldProps) => (
              <TextField
                {...fieldProps}
                select
                label={label}
                placeholder={placeholder}
                fullWidth={fullWidth}
                required={required}
                disabled={disabled || loading}
                error={!!fieldError}
                helperText={fieldError || helperText}
                autoFocus={autoFocus}
                size="small"
              >
                {options?.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
            )}
          </Field>
        );

      case "radio":
        return (
          <Field name={name}>
            {({ field: fieldProps }: FieldProps) => (
              <FormControl
                required={required}
                error={!!fieldError}
                disabled={disabled || loading}
              >
                <FormLabel>{label}</FormLabel>
                <RadioGroup {...fieldProps}>
                  {options?.map((option) => (
                    <FormControlLabel
                      key={option.value}
                      value={option.value}
                      control={<Radio />}
                      label={option.label}
                    />
                  ))}
                </RadioGroup>
                {fieldError && <FormHelperText>{fieldError}</FormHelperText>}
                {!fieldError && helperText && (
                  <FormHelperText>{helperText}</FormHelperText>
                )}
              </FormControl>
            )}
          </Field>
        );

      case "checkbox":
        return (
          <Field name={name}>
            {({ field: fieldProps }: FieldProps) => (
              <FormControl
                required={required}
                error={!!fieldError}
                disabled={disabled || loading}
              >
                <FormControlLabel
                  control={
                    <Checkbox {...fieldProps} checked={!!fieldProps.value} />
                  }
                  label={label}
                />
                {fieldError && <FormHelperText>{fieldError}</FormHelperText>}
                {!fieldError && helperText && (
                  <FormHelperText>{helperText}</FormHelperText>
                )}
              </FormControl>
            )}
          </Field>
        );

      case "textarea":
        return (
          <Field name={name}>
            {({ field: fieldProps }: FieldProps) => (
              <TextField
                {...fieldProps}
                label={label}
                placeholder={placeholder}
                multiline
                rows={rows || 4}
                fullWidth={fullWidth}
                required={required}
                disabled={disabled || loading}
                error={!!fieldError}
                helperText={fieldError || helperText}
                autoFocus={autoFocus}
                size="small"
              />
            )}
          </Field>
        );

      default:
        return (
          <Field name={name}>
            {({ field: fieldProps }: FieldProps) => (
              <TextField
                {...fieldProps}
                type={type}
                label={label}
                {...(type !== "date" && { placeholder })}
                fullWidth={fullWidth}
                required={required}
                disabled={disabled || loading}
                error={!!fieldError}
                helperText={fieldError || helperText}
                autoFocus={autoFocus}
                size="small"
                InputLabelProps={type === "date" ? { shrink: true } : undefined}
              />
            )}
          </Field>
        );
    }
  };

  return (
    <Paper elevation={2} sx={{ p: 3, borderRadius: 2 }}>
      {title && (
        <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
          {title}
        </Typography>
      )}

      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
        enableReinitialize
      >
        {(formProps) => (
          <Form>
            <Grid container spacing={2}>
              {fields.map((field) => (
                <Grid
                  item
                  key={field.name}
                  xs={field.xs}
                  sm={field.sm}
                  md={field.md}
                  lg={field.lg}
                  xl={field.xl}
                >
                  {renderField(field, formProps)}
                </Grid>
              ))}

              <Grid item xs={12}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "flex-end",
                    mt: 2,
                    gap: 1,
                  }}
                >
                  {onCancel && (
                    <Button
                      variant="outlined"
                      color="inherit"
                      onClick={onCancel}
                      disabled={loading}
                    >
                      {cancelButtonText}
                    </Button>
                  )}
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    disabled={loading || !formProps.dirty || !formProps.isValid}
                    startIcon={
                      loading ? (
                        <CircularProgress size={20} color="inherit" />
                      ) : null
                    }
                  >
                    {submitButtonText}
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </Form>
        )}
      </Formik>
    </Paper>
  );
}

export default FormikForm;
