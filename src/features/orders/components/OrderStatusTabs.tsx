import { useTranslation } from "react-i18next";
import type { DashboardSummaryData } from "@/features/dashboard/types";
import type { OrderStatus } from "../types";

interface OrderStatusTabsProps {
  selectedStatus: OrderStatus | "ALL";
  onSelectStatus: (status: OrderStatus | "ALL") => void;
  summary?: DashboardSummaryData;
}

interface TabOption {
  key: OrderStatus | "ALL";
  labelKey: string;
  defaultLabel: string;
  countKey?: keyof DashboardSummaryData["ordersByStatus"];
}

const TABS: TabOption[] = [
  {
    key: "ALL",
    labelKey: "orders.tabs.all",
    defaultLabel: "Semua",
  },
  {
    key: "PENDING",
    labelKey: "orders.statuses.pending",
    defaultLabel: "Menunggu Pembayaran",
    countKey: "PENDING",
  },
  {
    key: "PROCESSING",
    labelKey: "orders.statuses.processing",
    defaultLabel: "Diproses",
    countKey: "PROCESSING",
  },
  {
    key: "PAID",
    labelKey: "orders.statuses.paid",
    defaultLabel: "Sudah Dibayar",
    countKey: "PAID",
  },
  {
    key: "SHIPPED",
    labelKey: "orders.statuses.shipped",
    defaultLabel: "Dikirim",
    countKey: "SHIPPED",
  },
  {
    key: "COMPLETED",
    labelKey: "orders.statuses.completed",
    defaultLabel: "Selesai",
    countKey: "COMPLETED",
  },
  {
    key: "CANCELLED",
    labelKey: "orders.statuses.cancelled",
    defaultLabel: "Dibatalkan",
    countKey: "CANCELLED",
  },
];

export default function OrderStatusTabs({
  selectedStatus,
  onSelectStatus,
  summary,
}: OrderStatusTabsProps) {
  const { t } = useTranslation();

  const getCount = (tab: TabOption): number | null => {
    if (!summary) return null;
    if (tab.key === "ALL") {
      return summary.totalOrders ?? null;
    }
    if (tab.countKey && summary.ordersByStatus) {
      return summary.ordersByStatus[tab.countKey] ?? 0;
    }
    return null;
  };

  return (
    <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar border-b border-gray-100 dark:border-gray-800">
      {TABS.map((tab) => {
        const isSelected = selectedStatus === tab.key;
        const count = getCount(tab);

        return (
          <button
            key={tab.key}
            type="button"
            onClick={() => onSelectStatus(tab.key)}
            className={`flex shrink-0 items-center gap-2 rounded-lg px-3.5 py-2 text-xs font-medium transition-colors ${
              isSelected
                ? "bg-brand-50 text-brand-600 dark:bg-brand-500/15 dark:text-brand-400"
                : "text-gray-500 hover:bg-gray-100 hover:text-gray-800 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-white"
            }`}
          >
            <span>{t(tab.labelKey, tab.defaultLabel)}</span>
            {count !== null && (
              <span
                className={`rounded-full px-2 py-0.5 text-theme-xs font-semibold ${
                  isSelected
                    ? "bg-brand-600 text-white dark:bg-brand-500 dark:text-white"
                    : "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400"
                }`}
              >
                {count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
