import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  IconButton,
  Typography,
  Box,
} from "@mui/material";
import { Close as CloseIcon } from "@mui/icons-material";

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  message: string | React.ReactNode;
  confirmButtonText?: string;
  cancelButtonText?: string;
  confirmButtonColor?:
    | "primary"
    | "secondary"
    | "success"
    | "error"
    | "info"
    | "warning";
  onConfirm: () => void;
  onCancel: () => void;
  maxWidth?: "xs" | "sm" | "md" | "lg" | "xl";
  loading?: boolean;
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  open,
  title,
  message,
  confirmButtonText = "Confirmar",
  cancelButtonText = "Cancelar",
  confirmButtonColor = "primary",
  onConfirm,
  onCancel,
  maxWidth = "sm",
  loading = false,
}) => {
  return (
    <Dialog
      open={open}
      onClose={onCancel}
      maxWidth={maxWidth}
      fullWidth
      aria-labelledby="confirm-dialog-title"
      aria-describedby="confirm-dialog-description"
    >
      <DialogTitle id="confirm-dialog-title">
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Typography variant="h6">{title}</Typography>
          <IconButton
            edge="end"
            color="inherit"
            onClick={onCancel}
            aria-label="close"
            disabled={loading}
          >
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent>
        {typeof message === "string" ? (
          <DialogContentText id="confirm-dialog-description">
            {message}
          </DialogContentText>
        ) : (
          message
        )}
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button
          onClick={onCancel}
          color="inherit"
          variant="outlined"
          disabled={loading}
        >
          {cancelButtonText}
        </Button>
        <Button
          onClick={onConfirm}
          color={confirmButtonColor}
          variant="contained"
          autoFocus
          disabled={loading}
        >
          {confirmButtonText}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmDialog;
