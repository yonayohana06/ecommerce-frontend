import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Modal } from "@/components/ui/modal";
import Button from "@/components/ui/button/Button";
import Alert from "@/components/ui/alert/Alert";
import Label from "@/components/form/Label";
import { ChevronDownIcon } from "@/icons";
import { useUpdateOrderStatus } from "../hooks/useOrders";
import OrderStatusBadge from "./OrderStatusBadge";
import type { OrderStatus } from "../types";

interface OrderTarget {
  id: string | number;
  user_name?: string;
  status: OrderStatus;
}

interface UpdateOrderStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: OrderTarget | null;
  onSuccess?: (message: string) => void;
}

const ORDER_STATUS_OPTIONS: OrderStatus[] = [
  "PENDING",
  "PROCESSING",
  "PAID",
  "SHIPPED",
  "COMPLETED",
  "CANCELLED",
];

interface FormProps {
  order: OrderTarget;
  onClose: () => void;
  onSuccess?: (message: string) => void;
}

function UpdateOrderStatusForm({ order, onClose, onSuccess }: FormProps) {
  const { t } = useTranslation();
  const updateStatusMutation = useUpdateOrderStatus();

  const [selectedStatus, setSelectedStatus] = useState<OrderStatus>(order.status);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedStatus === order.status) {
      onClose();
      return;
    }

    setErrorMessage(null);
    try {
      const res = await updateStatusMutation.mutateAsync({
        orderId: order.id,
        payload: { status: selectedStatus },
      });

      const successMsg =
        res.message ||
        t("orders.notifications.statusUpdateSuccess", {
          id: order.id,
          status: selectedStatus,
          defaultValue: `Status pesanan #${order.id} berhasil diubah ke ${selectedStatus}.`,
        });

      if (onSuccess) {
        onSuccess(successMsg);
      }
      onClose();
    } catch (err: unknown) {
      const msg =
        err instanceof Error
          ? err.message
          : t(
              "orders.notifications.statusUpdateError",
              "Gagal memperbarui status pesanan.",
            );
      setErrorMessage(msg);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Header */}
      <div className="border-b border-gray-100 pb-3 dark:border-gray-800">
        <h3 className="text-base font-semibold text-gray-900 dark:text-white">
          {t("orders.updateStatus.title", "Ubah Status Pesanan")}
        </h3>
        <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
          {t("orders.table.columns.orderId", "Pesanan")} #{order.id}
          {order.user_name ? ` • ${order.user_name}` : ""}
        </p>
      </div>

      {errorMessage && (
        <Alert
          variant="error"
          title={t("common.error", "Gagal")}
          message={errorMessage}
        />
      )}

      {/* Current Status */}
      <div className="rounded-lg border border-gray-100 bg-gray-50/70 p-3 dark:border-gray-800 dark:bg-white/2">
        <span className="text-xs text-gray-400 block mb-1">
          {t("orders.updateStatus.currentStatus", "Status Saat Ini")}:
        </span>
        <OrderStatusBadge status={order.status} size="sm" />
      </div>

      {/* New Status Selector */}
      <div>
        <Label htmlFor="order-new-status">
          {t("orders.updateStatus.newStatusLabel", "Pilih Status Baru")}
        </Label>
        <div className="relative">
          <select
            id="order-new-status"
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value as OrderStatus)}
            disabled={updateStatusMutation.isPending}
            className="h-11 w-full appearance-none rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 pe-10 text-sm shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:ring-3 focus:ring-brand-500/10 focus:outline-hidden dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:focus:border-brand-800"
          >
            {ORDER_STATUS_OPTIONS.map((st) => (
              <option key={st} value={st} className="dark:bg-gray-900">
                {t(`orders.statuses.${st.toLowerCase()}`, st)}
              </option>
            ))}
          </select>
          <span className="pointer-events-none absolute inset-y-0 inset-e-3 flex items-center text-gray-500 dark:text-gray-400">
            <ChevronDownIcon className="size-4" />
          </span>
        </div>
      </div>

      {/* Status Guide Info */}
      <p className="text-xs text-gray-400 dark:text-gray-500">
        {selectedStatus === "PAID" &&
          t(
            "orders.updateStatus.paidNote",
            "Status 'Sudah Dibayar' menandakan pembayaran telah diverifikasi dan pesanan siap diproses.",
          )}
        {selectedStatus === "SHIPPED" &&
          t(
            "orders.updateStatus.shippedNote",
            "Status 'Dikirim' menandakan paket telah diserahkan ke jasa ekspedisi pengiriman.",
          )}
        {selectedStatus === "CANCELLED" &&
          t(
            "orders.updateStatus.cancelledNote",
            "Perhatian: Pembatalan pesanan akan menghentikan proses pemenuhan pesanan.",
          )}
        {selectedStatus === "COMPLETED" &&
          t(
            "orders.updateStatus.completedNote",
            "Pesanan selesai setelah paket diterima dengan baik oleh pelanggan.",
          )}
      </p>

      {/* Buttons */}
      <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-gray-100 dark:border-gray-800">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onClose}
          disabled={updateStatusMutation.isPending}
        >
          {t("common.cancel", "Batal")}
        </Button>

        <Button
          type="submit"
          variant="primary"
          size="sm"
          disabled={updateStatusMutation.isPending}
        >
          {updateStatusMutation.isPending
            ? t("common.saving", "Menyimpan...")
            : t("orders.updateStatus.submitButton", "Perbarui Status")}
        </Button>
      </div>
    </form>
  );
}

export default function UpdateOrderStatusModal({
  isOpen,
  onClose,
  order,
  onSuccess,
}: UpdateOrderStatusModalProps) {
  if (!isOpen || !order) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-md p-6">
      <UpdateOrderStatusForm
        key={order.id}
        order={order}
        onClose={onClose}
        onSuccess={onSuccess}
      />
    </Modal>
  );
}
