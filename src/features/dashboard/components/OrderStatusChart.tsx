import type { ApexOptions } from "apexcharts";
import ReactApexChart from "react-apexcharts";
import { useTranslation } from "react-i18next";
import useDashboardSummary from "../hooks/useDashboardSummary";

export default function OrderStatusChart() {
  const { t } = useTranslation();
  const { data, isLoading } = useDashboardSummary();

  const ordersByStatus = data?.ordersByStatus;
  const totalOrders = data?.totalOrders ?? 0;

  const statusConfigs = [
    {
      key: "PAID",
      label: t("ecommerce.orderStatus.labels.paid", "Lunas (Paid)"),
      count: (ordersByStatus?.PAID ?? 0) + (ordersByStatus?.COMPLETED ?? 0),
      color: "#12B76A", // success-500
      badgeBg: "bg-success-50 text-success-600 dark:bg-success-500/15 dark:text-success-400",
    },
    {
      key: "PROCESSING",
      label: t("ecommerce.orderStatus.labels.processing", "Diproses"),
      count: ordersByStatus?.PROCESSING ?? 0,
      color: "#0BA5EC", // blue-light-500
      badgeBg: "bg-blue-light-50 text-blue-light-600 dark:bg-blue-light-500/15 dark:text-blue-light-400",
    },
    {
      key: "PENDING",
      label: t("ecommerce.orderStatus.labels.pending", "Menunggu"),
      count: ordersByStatus?.PENDING ?? 0,
      color: "#F79009", // warning-500
      badgeBg: "bg-warning-50 text-warning-600 dark:bg-warning-500/15 dark:text-warning-400",
    },
    {
      key: "SHIPPED",
      label: t("ecommerce.orderStatus.labels.shipped", "Dikirim"),
      count: ordersByStatus?.SHIPPED ?? 0,
      color: "#465FFF", // brand-500
      badgeBg: "bg-brand-50 text-brand-600 dark:bg-brand-500/15 dark:text-brand-400",
    },
    {
      key: "CANCELLED",
      label: t("ecommerce.orderStatus.labels.cancelled", "Dibatalkan"),
      count: (ordersByStatus?.CANCELLED ?? 0) + (ordersByStatus?.FAILED ?? 0),
      color: "#F04438", // error-500
      badgeBg: "bg-error-50 text-error-600 dark:bg-error-500/15 dark:text-error-400",
    },
  ];

  const series = statusConfigs.map((s) => s.count);
  const labels = statusConfigs.map((s) => s.label);
  const colors = statusConfigs.map((s) => s.color);

  const hasData = series.some((count) => count > 0);

  const options: ApexOptions = {
    chart: {
      type: "donut",
      fontFamily: "Outfit, sans-serif",
    },
    colors: colors,
    labels: labels,
    legend: {
      show: false, // Custom legend below for better responsive styling
    },
    plotOptions: {
      pie: {
        donut: {
          size: "72%",
          labels: {
            show: true,
            total: {
              show: true,
              label: t("ecommerce.orderStatus.totalOrders", "Total Pesanan"),
              fontSize: "13px",
              fontFamily: "Outfit, sans-serif",
              color: "#667085",
              formatter: () => String(totalOrders),
            },
            value: {
              fontSize: "26px",
              fontWeight: 700,
              fontFamily: "Outfit, sans-serif",
              color: "#1D2939",
            },
          },
        },
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      show: true,
      colors: ["transparent"],
      width: 2,
    },
    tooltip: {
      theme: "light",
      y: {
        formatter: (val: number) =>
          t("ecommerce.orderStatus.orderCount", "{{count}} pesanan", {
            count: val,
          }),
      },
    },
  };

  if (isLoading) {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white p-5 sm:p-6 dark:border-gray-800 dark:bg-white/3">
        <div className="h-6 w-44 animate-pulse rounded bg-gray-200 dark:bg-gray-800" />
        <div className="mt-6 flex h-60 items-center justify-center">
          <div className="size-44 animate-pulse rounded-full border-8 border-gray-200 dark:border-gray-800" />
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 sm:p-6 dark:border-gray-800 dark:bg-white/3">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            {t("ecommerce.orderStatus.title", "Status Pesanan")}
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {t(
              "ecommerce.orderStatus.subtitle",
              "Distribusi seluruh status transaksi saat ini",
            )}
          </p>
        </div>
      </div>

      {!hasData ? (
        <div className="flex h-56 items-center justify-center text-sm text-gray-500 dark:text-gray-400">
          {t("ecommerce.orderStatus.noData", "Belum ada data transaksi")}
        </div>
      ) : (
        <>
          <div className="relative flex items-center justify-center">
            <ReactApexChart
              options={options}
              series={series}
              type="donut"
              height={260}
            />
          </div>

          {/* Custom Status Legend List */}
          <div className="mt-4 space-y-2 border-t border-gray-100 pt-4 dark:border-gray-800">
            {statusConfigs
              .filter((s) => s.count > 0)
              .map((item) => {
                const percentage = totalOrders > 0
                  ? Math.round((item.count / totalOrders) * 100)
                  : 0;

                return (
                  <div
                    key={item.key}
                    className="flex items-center justify-between text-theme-sm"
                  >
                    <div className="flex items-center gap-2">
                      <span
                        className="size-2.5 rounded-full"
                        style={{ backgroundColor: item.color }}
                      />
                      <span className="font-medium text-gray-700 dark:text-gray-300">
                        {item.label}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-400">
                        {percentage}%
                      </span>
                      <span
                        className={`rounded-full px-2 py-0.5 text-xs font-semibold ${item.badgeBg}`}
                      >
                        {item.count}
                      </span>
                    </div>
                  </div>
                );
              })}
          </div>
        </>
      )}
    </div>
  );
}
