import React from "react";
import {
  Card,
  CardContent,
  Typography,
  Box,
  SvgIconProps,
} from "@mui/material";

interface InfoCardProps {
  title: string;
  value: string | number;
  icon?: React.ReactElement<SvgIconProps>;
  color?: string;
  subtitle?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  onClick?: () => void;
}

const InfoCard: React.FC<InfoCardProps> = ({
  title,
  value,
  icon,
  color = "#0a56a5",
  subtitle,
  trend,
  onClick,
}) => {
  return (
    <Card
      sx={{
        borderRadius: 2,
        cursor: onClick ? "pointer" : "default",
        transition: "transform 0.2s, box-shadow 0.2s",
        "&:hover": onClick
          ? {
              transform: "translateY(-4px)",
              boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
            }
          : {},
      }}
      onClick={onClick}
      elevation={3}
    >
      <CardContent sx={{ p: 3 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
          }}
        >
          <Box>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              {title}
            </Typography>
            <Typography
              variant="h4"
              component="div"
              sx={{ fontWeight: "bold", mb: 1 }}
            >
              {value}
            </Typography>
            {subtitle && (
              <Typography variant="body2" color="text.secondary">
                {subtitle}
              </Typography>
            )}
            {trend && (
              <Box sx={{ display: "flex", alignItems: "center", mt: 1 }}>
                <Typography
                  variant="body2"
                  sx={{
                    color: trend.isPositive ? "success.main" : "error.main",
                    fontWeight: "medium",
                  }}
                >
                  {trend.isPositive ? "+" : ""}
                  {trend.value}%
                </Typography>
              </Box>
            )}
          </Box>
          {icon && (
            <Box
              sx={{
                backgroundColor: `${color}20`,
                p: 1.5,
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {React.cloneElement(icon, { sx: { color, fontSize: 32 } })}
            </Box>
          )}
        </Box>
      </CardContent>
    </Card>
  );
};

export default InfoCard;
