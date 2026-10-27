import { useTranslation } from "react-i18next";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Button from "@/components/ui/button/Button";
import { EyeIcon, PencilIcon, BoxIcon } from "@/icons";
import { formatDate, formatRupiah } from "@/utils";
import OrderStatusBadge from "./OrderStatusBadge";
import type { OrderListItem, OrderStatus } from "../types";

interface OrderTableProps {
  orders: OrderListItem[];
  isLoading: boolean;
  searchKeyword: string;
  selectedStatus: OrderStatus | "ALL" | "";
  onView: (order: OrderListItem) => void;
  onUpdateStatus: (order: OrderListItem) => void;
  onViewPaymentProof: (order: OrderListItem) => void;
  onClearFilters?: () => void;
}

export default function OrderTable({
  orders,
  isLoading,
  searchKeyword,
  selectedStatus,
  onView,
  onUpdateStatus,
  onViewPaymentProof,
  onClearFilters,
}: OrderTableProps) {
  const { t, i18n } = useTranslation();
  const dateLocale = i18n.language === "en" ? "en-US" : "id-ID";

  const isFiltered = Boolean(
    searchKeyword || (selectedStatus && selectedStatus !== "ALL"),
  );

  if (isLoading) {
    return (
      <div className="flex-1 min-h-0 overflow-y-auto overflow-x-auto custom-scrollbar">
        <Table>
          <TableHeader className="sticky top-0 z-10 bg-gray-50/95 dark:bg-gray-800/95 backdrop-blur-xs border-b border-gray-100 dark:border-gray-800">
            <TableRow>
              <TableCell isHeader className="py-3 px-5 text-start">
                <div className="h-4 w-16 rounded bg-gray-200 dark:bg-gray-800 animate-pulse" />
              </TableCell>
              <TableCell isHeader className="py-3 px-5 text-start">
                <div className="h-4 w-28 rounded bg-gray-200 dark:bg-gray-800 animate-pulse" />
              </TableCell>
              <TableCell isHeader className="py-3 px-5 text-start">
                <div className="h-4 w-24 rounded bg-gray-200 dark:bg-gray-800 animate-pulse" />
              </TableCell>
              <TableCell isHeader className="py-3 px-5 text-start">
                <div className="h-4 w-20 rounded bg-gray-200 dark:bg-gray-800 animate-pulse" />
              </TableCell>
              <TableCell isHeader className="py-3 px-5 text-start">
                <div className="h-4 w-24 rounded bg-gray-200 dark:bg-gray-800 animate-pulse" />
              </TableCell>
              <TableCell isHeader className="py-3 px-5 text-start">
                <div className="h-4 w-24 rounded bg-gray-200 dark:bg-gray-800 animate-pulse" />
              </TableCell>
              <TableCell isHeader className="py-3 px-5 text-end">
                <div className="ms-auto h-4 w-16 rounded bg-gray-200 dark:bg-gray-800 animate-pulse" />
              </TableCell>
            </TableRow>
          </TableHeader>
          <TableBody className="divide-y divide-gray-100 dark:divide-gray-800">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <TableRow key={i} className="animate-pulse">
                <TableCell className="py-4 px-5">
                  <div className="h-4 w-12 rounded bg-gray-200 dark:bg-gray-800" />
                </TableCell>
                <TableCell className="py-4 px-5">
                  <div className="space-y-1.5">
                    <div className="h-4 w-32 rounded bg-gray-200 dark:bg-gray-800" />
                    <div className="h-3 w-40 rounded bg-gray-200 dark:bg-gray-800" />
                  </div>
                </TableCell>
                <TableCell className="py-4 px-5">
                  <div className="h-4 w-24 rounded bg-gray-200 dark:bg-gray-800" />
                </TableCell>
                <TableCell className="py-4 px-5">
                  <div className="h-6 w-20 rounded-full bg-gray-200 dark:bg-gray-800" />
                </TableCell>
                <TableCell className="py-4 px-5">
                  <div className="h-8 w-20 rounded-lg bg-gray-200 dark:bg-gray-800" />
                </TableCell>
                <TableCell className="py-4 px-5">
                  <div className="h-4 w-28 rounded bg-gray-200 dark:bg-gray-800" />
                </TableCell>
                <TableCell className="py-4 px-5 text-end">
                  <div className="ms-auto flex items-center justify-end gap-2">
                    <div className="size-8 rounded-lg bg-gray-200 dark:bg-gray-800" />
                    <div className="size-8 rounded-lg bg-gray-200 dark:bg-gray-800" />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
        <div className="flex size-14 items-center justify-center rounded-2xl bg-gray-100 text-gray-400 dark:bg-gray-800">
          <BoxIcon className="size-7" />
        </div>
        <h4 className="mt-4 text-base font-semibold text-gray-800 dark:text-white/90">
          {isFiltered
            ? t(
                "orders.table.emptyFiltered",
                "Tidak ada pesanan yang cocok dengan kriteria pencarian/filter.",
              )
            : t("orders.table.empty", "Belum ada pesanan yang masuk.")}
        </h4>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 max-w-sm">
          {isFiltered
            ? t(
                "orders.table.emptyFilteredDesc",
                "Coba gunakan kata kunci pencarian lain atau pilih tab status yang berbeda.",
              )
            : t(
                "orders.table.emptyDesc",
                "Pesanan yang dilakukan oleh pelanggan akan muncul di sini secara otomatis.",
              )}
        </p>
        {isFiltered && onClearFilters && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onClearFilters}
            className="mt-4"
          >
            {t("orders.search.resetFilters", "Reset Pencarian & Filter")}
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className="flex-1 min-h-0 overflow-y-auto overflow-x-auto custom-scrollbar">
      <Table>
        <TableHeader className="sticky top-0 z-10 bg-gray-50/95 dark:bg-gray-800/95 backdrop-blur-xs border-b border-gray-100 dark:border-gray-800">
          <TableRow>
            <TableCell
              isHeader
              className="py-3.5 px-5 text-start text-theme-xs font-semibold text-gray-500 dark:text-gray-400"
            >
              {t("orders.table.columns.orderId", "No. Pesanan")}
            </TableCell>
            <TableCell
              isHeader
              className="py-3.5 px-5 text-start text-theme-xs font-semibold text-gray-500 dark:text-gray-400"
            >
              {t("orders.table.columns.customer", "Pelanggan")}
            </TableCell>
            <TableCell
              isHeader
              className="py-3.5 px-5 text-start text-theme-xs font-semibold text-gray-500 dark:text-gray-400"
            >
              {t("orders.table.columns.totalAmount", "Total Belanja")}
            </TableCell>
            <TableCell
              isHeader
              className="py-3.5 px-5 text-start text-theme-xs font-semibold text-gray-500 dark:text-gray-400"
            >
              {t("orders.table.columns.status", "Status")}
            </TableCell>
            <TableCell
              isHeader
              className="py-3.5 px-5 text-start text-theme-xs font-semibold text-gray-500 dark:text-gray-400"
            >
              {t("orders.table.columns.paymentProof", "Bukti Transfer")}
            </TableCell>
            <TableCell
              isHeader
              className="py-3.5 px-5 text-start text-theme-xs font-semibold text-gray-500 dark:text-gray-400"
            >
              {t("orders.table.columns.createdAt", "Waktu Transaksi")}
            </TableCell>
            <TableCell
              isHeader
              className="py-3.5 px-5 text-end text-theme-xs font-semibold text-gray-500 dark:text-gray-400"
            >
              {t("orders.table.columns.actions", "Aksi")}
            </TableCell>
          </TableRow>
        </TableHeader>

        <TableBody className="divide-y divide-gray-100 dark:divide-gray-800">
          {orders.map((order) => {
            const hasProof = Boolean(order.payment_proof_url);

            return (
              <TableRow
                key={order.order_id}
                className="hover:bg-gray-50/75 dark:hover:bg-white/2 transition-colors"
              >
                {/* Order ID */}
                <TableCell className="py-3.5 px-5 whitespace-nowrap">
                  <button
                    type="button"
                    onClick={() => onView(order)}
                    className="font-mono text-sm font-semibold text-brand-600 hover:text-brand-700 dark:text-brand-400 dark:hover:text-brand-300 transition-colors"
                  >
                    #{order.order_id}
                  </button>
                </TableCell>

                {/* Customer Info */}
                <TableCell className="py-3.5 px-5">
                  <div className="min-w-0 max-w-xs">
                    <p className="truncate text-sm font-medium text-gray-900 dark:text-white">
                      {order.user_name || "-"}
                    </p>
                    <p className="truncate text-xs text-gray-400 dark:text-gray-500">
                      {order.email}
                    </p>
                  </div>
                </TableCell>

                {/* Total Amount */}
                <TableCell className="py-3.5 px-5 whitespace-nowrap text-sm font-semibold text-gray-900 dark:text-white">
                  {formatRupiah(order.total_amount)}
                </TableCell>

                {/* Status */}
                <TableCell className="py-3.5 px-5 whitespace-nowrap">
                  <OrderStatusBadge status={order.status} size="sm" />
                </TableCell>

                {/* Payment Proof Thumbnail / Button */}
                <TableCell className="py-3.5 px-5 whitespace-nowrap">
                  {hasProof ? (
                    <button
                      type="button"
                      onClick={() => onViewPaymentProof(order)}
                      className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-2 py-1 text-xs font-medium text-gray-700 shadow-theme-xs hover:border-brand-300 hover:text-brand-600 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300 dark:hover:border-brand-700 dark:hover:text-brand-400 transition"
                      title={t("orders.paymentProof.view", "Lihat Bukti Transfer")}
                    >
                      <img
                        src={order.payment_proof_url!}
                        alt={`Bukti #${order.order_id}`}
                        className="size-5 rounded object-cover"
                      />
                      <span>{t("orders.paymentProof.uploaded", "Lihat Bukti")}</span>
                    </button>
                  ) : (
                    <span className="text-xs text-gray-400 dark:text-gray-500">
                      {t("orders.paymentProof.none", "Belum Diunggah")}
                    </span>
                  )}
                </TableCell>

                {/* Date */}
                <TableCell className="py-3.5 px-5 whitespace-nowrap text-xs text-gray-500 dark:text-gray-400">
                  {formatDate(order.created_at, dateLocale)}
                </TableCell>

                {/* Actions */}
                <TableCell className="py-3.5 px-5 text-end whitespace-nowrap">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => onView(order)}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-2.5 py-1.5 text-xs font-medium text-gray-700 shadow-theme-xs hover:border-brand-300 hover:bg-brand-50 hover:text-brand-600 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300 dark:hover:border-brand-700 dark:hover:bg-brand-500/10 dark:hover:text-brand-400 transition"
                      title={t("orders.actions.viewDetail", "Lihat Detail Pesanan")}
                      aria-label={t("orders.actions.viewDetail", "Lihat Detail Pesanan")}
                    >
                      <EyeIcon className="size-4" />
                      <span>{t("common.detail", "Detail")}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => onUpdateStatus(order)}
                      className="inline-flex size-8 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-500 shadow-theme-xs hover:border-brand-300 hover:bg-brand-50 hover:text-brand-600 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-400 dark:hover:border-brand-700 dark:hover:bg-brand-500/10 dark:hover:text-brand-400 transition"
                      title={t("orders.actions.updateStatus", "Ubah Status")}
                      aria-label={t("orders.actions.updateStatus", "Ubah Status")}
                    >
                      <PencilIcon className="size-4" />
                    </button>
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
