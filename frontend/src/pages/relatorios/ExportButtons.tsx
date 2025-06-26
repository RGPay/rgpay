import React from "react";
import {
  Box,
  Button,
  useTheme,
} from "@mui/material";
import {
  FileDownload as FileDownloadIcon,
  PictureAsPdf as PictureAsPdfIcon,
} from "@mui/icons-material";

interface ExportButtonsProps {
  onExportCSV: () => void;
  onExportPDF: () => void;
  loading?: boolean;
  disabled?: boolean;
}

const ExportButtons: React.FC<ExportButtonsProps> = ({
  onExportCSV,
  onExportPDF,
  loading = false,
  disabled = false,
}) => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        display: "flex",
        gap: 2,
        mb: 3,
        justifyContent: "flex-end",
        flexWrap: "wrap",
      }}
    >
      <Button
        variant="outlined"
        startIcon={<FileDownloadIcon />}
        onClick={onExportCSV}
        disabled={loading || disabled}
        sx={{
          borderColor: theme.palette.success.main,
          color: theme.palette.success.main,
          "&:hover": {
            borderColor: theme.palette.success.dark,
            backgroundColor: theme.palette.success.main + "10",
          },
        }}
      >
        Exportar CSV
      </Button>

      <Button
        variant="outlined"
        startIcon={<PictureAsPdfIcon />}
        onClick={onExportPDF}
        disabled={loading || disabled}
        sx={{
          borderColor: theme.palette.error.main,
          color: theme.palette.error.main,
          "&:hover": {
            borderColor: theme.palette.error.dark,
            backgroundColor: theme.palette.error.main + "10",
          },
        }}
      >
        Exportar PDF
      </Button>
    </Box>
  );
};

export default ExportButtons; 