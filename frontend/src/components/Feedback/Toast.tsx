import React from "react";
import { Snackbar, Alert, AlertColor } from "@mui/material";

interface ToastProps {
  open: boolean;
  message: string;
  severity?: AlertColor;
  duration?: number;
  onClose: () => void;
  vertical?: "top" | "bottom";
  horizontal?: "left" | "center" | "right";
}

const Toast: React.FC<ToastProps> = ({
  open,
  message,
  severity = "success",
  duration = 5000,
  onClose,
  vertical = "bottom",
  horizontal = "center",
}) => {
  return (
    <Snackbar
      open={open}
      autoHideDuration={duration}
      onClose={onClose}
      anchorOrigin={{ vertical, horizontal }}
    >
      <Alert
        onClose={onClose}
        severity={severity}
        variant="filled"
        sx={{ width: "100%" }}
      >
        {message}
      </Alert>
    </Snackbar>
  );
};

export default Toast;
