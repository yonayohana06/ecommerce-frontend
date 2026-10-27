import { useTranslation } from "react-i18next";
import Badge from "@/components/ui/badge/Badge";
import type { OrderStatus } from "../types";

interface OrderStatusBadgeProps {
  status: OrderStatus;
  size?: "sm" | "md";
}

export default function OrderStatusBadge({
  status,
  size = "sm",
}: OrderStatusBadgeProps) {
  const { t } = useTranslation();

  const getStatusConfig = (
    st: OrderStatus,
  ): {
    color: "primary" | "success" | "error" | "warning" | "info" | "light" | "dark";
    label: string;
  } => {
    switch (st) {
      case "PAID":
        return {
          color: "primary",
          label: t("orders.statuses.paid", "Sudah Dibayar"),
        };
      case "COMPLETED":
        return {
          color: "success",
          label: t("orders.statuses.completed", "Selesai"),
        };
      case "PROCESSING":
        return {
          color: "warning",
          label: t("orders.statuses.processing", "Diproses"),
        };
      case "SHIPPED":
        return {
          color: "info",
          label: t("orders.statuses.shipped", "Dikirim"),
        };
      case "PENDING":
        return {
          color: "light",
          label: t("orders.statuses.pending", "Menunggu Pembayaran"),
        };
      case "CANCELLED":
        return {
          color: "error",
          label: t("orders.statuses.cancelled", "Dibatalkan"),
        };
      case "FAILED":
        return {
          color: "dark",
          label: t("orders.statuses.failed", "Gagal"),
        };
      default:
        return {
          color: "light",
          label: status,
        };
    }
  };

  const config = getStatusConfig(status);

  return (
    <Badge variant="light" color={config.color} size={size}>
      {config.label}
    </Badge>
  );
}
