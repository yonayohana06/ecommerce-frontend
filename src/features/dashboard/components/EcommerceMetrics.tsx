import { useTranslation } from "react-i18next";
import { BoxCubeIcon, CheckCircleIcon, DollarLineIcon, TimeIcon } from "@/icons";
import { formatRupiah } from "@/utils";
import Badge from "@/components/ui/badge/Badge";
import useDashboardSummary from "../hooks/useDashboardSummary";

export default function EcommerceMetrics() {
  const { t } = useTranslation();
  const { data, isLoading } = useDashboardSummary();

  const totalRevenue = data?.totalRevenue ?? 0;
  const totalOrders = data?.totalOrders ?? 0;
  const completedOrders = data?.ordersByStatus.COMPLETED ?? 0;
  const pendingOrders = data?.ordersByStatus.PENDING ?? 0;

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4 md:gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="animate-pulse rounded-2xl border border-gray-200 bg-white p-5 md:p-6 dark:border-gray-800 dark:bg-white/3"
          >
            <div className="flex items-center justify-between">
              <div className="h-12 w-12 rounded-xl bg-gray-200 dark:bg-gray-800" />
              <div className="h-6 w-14 rounded-full bg-gray-200 dark:bg-gray-800" />
            </div>
            <div className="mt-5 space-y-2">
              <div className="h-4 w-24 rounded bg-gray-200 dark:bg-gray-800" />
              <div className="h-7 w-32 rounded bg-gray-200 dark:bg-gray-800" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4 md:gap-6">
      {/* 1. Total Revenue */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 md:p-6 dark:border-gray-800 dark:bg-white/3">
        <div className="flex items-center justify-between">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-50 text-brand-600 dark:bg-brand-500/15 dark:text-brand-400">
            <DollarLineIcon className="size-6" />
          </div>
          <Badge color="success" size="sm">
            {t("ecommerce.metrics.revenueBadge", "IDR")}
          </Badge>
        </div>

        <div className="mt-5">
          <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
            {t("ecommerce.metrics.totalRevenue", "Total Pendapatan")}
          </span>
          <h4
            className="mt-1 text-title-sm font-bold text-gray-800 dark:text-white/90 truncate"
            title={formatRupiah(totalRevenue)}
          >
            {formatRupiah(totalRevenue)}
          </h4>
        </div>
      </div>

      {/* 2. Total Orders */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 md:p-6 dark:border-gray-800 dark:bg-white/3">
        <div className="flex items-center justify-between">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-light-50 text-blue-light-600 dark:bg-blue-light-500/15 dark:text-blue-light-400">
            <BoxCubeIcon className="size-6" />
          </div>
          <Badge color="info" size="sm">
            {t("ecommerce.metrics.allBadge", "Semua")}
          </Badge>
        </div>

        <div className="mt-5">
          <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
            {t("ecommerce.metrics.totalOrders", "Total Pesanan")}
          </span>
          <h4
            className="mt-1 text-title-sm font-bold text-gray-800 dark:text-white/90 truncate"
            title={totalOrders.toLocaleString("id-ID")}
          >
            {totalOrders.toLocaleString("id-ID")}
          </h4>
        </div>
      </div>

      {/* 3. Completed Orders */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 md:p-6 dark:border-gray-800 dark:bg-white/3">
        <div className="flex items-center justify-between">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-success-50 text-success-600 dark:bg-success-500/15 dark:text-success-400">
            <CheckCircleIcon className="size-6" />
          </div>
          <Badge color="success" size="sm">
            {t("ecommerce.metrics.completedBadge", "Selesai")}
          </Badge>
        </div>

        <div className="mt-5">
          <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
            {t("ecommerce.metrics.completedOrders", "Pesanan Selesai")}
          </span>
          <h4
            className="mt-1 text-title-sm font-bold text-gray-800 dark:text-white/90 truncate"
            title={completedOrders.toLocaleString("id-ID")}
          >
            {completedOrders.toLocaleString("id-ID")}
          </h4>
        </div>
      </div>

      {/* 4. Pending Orders */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 md:p-6 dark:border-gray-800 dark:bg-white/3">
        <div className="flex items-center justify-between">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-warning-50 text-warning-600 dark:bg-warning-500/15 dark:text-warning-400">
            <TimeIcon className="size-6" />
          </div>
          <Badge color="warning" size="sm">
            {t("ecommerce.metrics.pendingBadge", "Menunggu")}
          </Badge>
        </div>

        <div className="mt-5">
          <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
            {t("ecommerce.metrics.pendingOrders", "Pesanan Menunggu")}
          </span>
          <h4
            className="mt-1 text-title-sm font-bold text-gray-800 dark:text-white/90 truncate"
            title={pendingOrders.toLocaleString("id-ID")}
          >
            {pendingOrders.toLocaleString("id-ID")}
          </h4>
        </div>
      </div>
    </div>
  );
}
