import { useEffect, useState } from "react";
import { Link } from "react-router";
import { useTranslation } from "react-i18next";
import Badge from "@/components/ui/badge/Badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatDate, formatRupiah } from "@/utils";
import dashboardService from "../api/dashboardService";
import type { OrderStatus, RecentOrderItem } from "../types";

export default function RecentOrders() {
  const { t, i18n } = useTranslation();
  const [orders, setOrders] = useState<RecentOrderItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const dateLocale = i18n.language === "en" ? "en-US" : "id-ID";

  useEffect(() => {
    let isMounted = true;

    dashboardService
      .getRecentOrders(5)
      .then((res) => {
        if (isMounted) {
          setOrders(res.data || []);
          setError(null);
          setIsLoading(false);
        }
      })
      .catch((err: unknown) => {
        if (isMounted) {
          const msg =
            err instanceof Error
              ? err.message
              : t("ecommerce.recentOrders.error", "Gagal memuat pesanan terbaru.");
          setError(msg);
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [t]);

  const getStatusBadge = (status: OrderStatus) => {
    const statusKey = status.toLowerCase();
    const label = t(`ecommerce.recentOrders.statuses.${statusKey}`, status);

    switch (status) {
      case "PAID":
      case "COMPLETED":
        return <Badge size="sm" color="success">{label}</Badge>;
      case "PROCESSING":
        return <Badge size="sm" color="info">{label}</Badge>;
      case "SHIPPED":
        return <Badge size="sm" color="primary">{label}</Badge>;
      case "PENDING":
        return <Badge size="sm" color="warning">{label}</Badge>;
      case "CANCELLED":
      case "FAILED":
        return <Badge size="sm" color="error">{label}</Badge>;
      default:
        return <Badge size="sm" color="light">{label}</Badge>;
    }
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-4 pt-4 pb-3 sm:px-6 dark:border-gray-800 dark:bg-white/3">
      <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            {t("ecommerce.recentOrders.title", "Pesanan Terbaru")}
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {t(
              "ecommerce.recentOrders.subtitle",
              "5 transaksi pesanan terakhir yang masuk",
            )}
          </p>
        </div>

        <Link
          to="/orders"
          className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-theme-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/3 dark:hover:text-gray-200"
        >
          {t("common.seeAll", "Lihat Semua")}
        </Link>
      </div>

      <div className="max-w-full overflow-x-auto">
        <Table>
          <TableHeader className="border-y border-gray-100 dark:border-gray-800">
            <TableRow>
              <TableCell
                isHeader
                className="py-3 text-start text-theme-xs font-medium text-gray-500 dark:text-gray-400"
              >
                {t("ecommerce.recentOrders.columns.orderId", "No. Pesanan")}
              </TableCell>
              <TableCell
                isHeader
                className="py-3 text-start text-theme-xs font-medium text-gray-500 dark:text-gray-400"
              >
                {t("ecommerce.recentOrders.columns.customer", "Pelanggan")}
              </TableCell>
              <TableCell
                isHeader
                className="py-3 text-start text-theme-xs font-medium text-gray-500 dark:text-gray-400"
              >
                {t("ecommerce.recentOrders.columns.total", "Total")}
              </TableCell>
              <TableCell
                isHeader
                className="py-3 text-start text-theme-xs font-medium text-gray-500 dark:text-gray-400"
              >
                {t("ecommerce.recentOrders.columns.status", "Status")}
              </TableCell>
              <TableCell
                isHeader
                className="py-3 text-start text-theme-xs font-medium text-gray-500 dark:text-gray-400"
              >
                {t("ecommerce.recentOrders.columns.date", "Tanggal")}
              </TableCell>
            </TableRow>
          </TableHeader>

          <TableBody className="divide-y divide-gray-100 dark:divide-gray-800">
            {isLoading ? (
              [1, 2, 3].map((i) => (
                <TableRow key={i} className="animate-pulse">
                  <TableCell className="py-3.5">
                    <div className="h-4 w-12 rounded bg-gray-200 dark:bg-gray-800" />
                  </TableCell>
                  <TableCell className="py-3.5">
                    <div className="space-y-1">
                      <div className="h-4 w-28 rounded bg-gray-200 dark:bg-gray-800" />
                      <div className="h-3 w-36 rounded bg-gray-200 dark:bg-gray-800" />
                    </div>
                  </TableCell>
                  <TableCell className="py-3.5">
                    <div className="h-4 w-20 rounded bg-gray-200 dark:bg-gray-800" />
                  </TableCell>
                  <TableCell className="py-3.5">
                    <div className="h-5 w-16 rounded-full bg-gray-200 dark:bg-gray-800" />
                  </TableCell>
                  <TableCell className="py-3.5">
                    <div className="h-4 w-24 rounded bg-gray-200 dark:bg-gray-800" />
                  </TableCell>
                </TableRow>
              ))
            ) : error ? (
              <TableRow>
                <TableCell
                  className="py-6 text-center text-sm text-error-500"
                  colSpan={5}
                >
                  {error}
                </TableCell>
              </TableRow>
            ) : orders.length === 0 ? (
              <TableRow>
                <TableCell
                  className="py-6 text-center text-sm text-gray-500 dark:text-gray-400"
                  colSpan={5}
                >
                  {t(
                    "ecommerce.recentOrders.empty",
                    "Belum ada pesanan terbaru.",
                  )}
                </TableCell>
              </TableRow>
            ) : (
              orders.map((order) => (
                <TableRow key={order.order_id} className="hover:bg-gray-50/50 dark:hover:bg-white/2">
                  <TableCell className="py-3.5 text-theme-sm font-semibold text-brand-500">
                    #{order.order_id}
                  </TableCell>
                  <TableCell className="py-3.5">
                    <div>
                      <p className="text-theme-sm font-medium text-gray-800 dark:text-white/90">
                        {order.user_name ||
                          t(
                            "ecommerce.recentOrders.customerFallback",
                            "Pelanggan",
                          )}
                      </p>
                      <span className="text-theme-xs text-gray-500 dark:text-gray-400">
                        {order.email}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="py-3.5 text-theme-sm font-semibold text-gray-800 dark:text-white/90">
                    {formatRupiah(order.total_amount)}
                  </TableCell>
                  <TableCell className="py-3.5">
                    {getStatusBadge(order.status)}
                  </TableCell>
                  <TableCell className="py-3.5 text-theme-xs text-gray-500 dark:text-gray-400">
                    {formatDate(order.created_at, dateLocale)}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
