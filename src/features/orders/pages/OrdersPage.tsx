import React, { useState, useCallback, useMemo } from "react";
import { useNavigate } from "react-router";
import { useTranslation } from "react-i18next";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import PageMeta from "@/components/common/PageMeta";
import Button from "@/components/ui/button/Button";
import Alert from "@/components/ui/alert/Alert";
import {
  ChevronLeftIcon,
  CloseIcon,
  RegenerateIcon,
  SearchIcon,
} from "@/icons";
import { useOrders, useOrderSummary } from "../hooks/useOrders";
import OrderTable from "../components/OrderTable";
import OrderStatusTabs from "../components/OrderStatusTabs";
import UpdateOrderStatusModal from "../components/UpdateOrderStatusModal";
import PaymentProofModal from "../components/PaymentProofModal";
import type { OrderFilterParams, OrderListItem, OrderStatus } from "../types";

export default function OrdersPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  // Filter & Search states
  const [searchInput, setSearchInput] = useState<string>("");
  const [activeSearch, setActiveSearch] = useState<string>("");
  const [selectedStatus, setSelectedStatus] = useState<OrderStatus | "ALL">("ALL");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const pageSize = 10;

  // Flash notification state
  const [notification, setNotification] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  // Modal states
  const [statusModalOrder, setStatusModalOrder] = useState<OrderListItem | null>(
    null,
  );
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);

  const [proofModalOrder, setProofModalOrder] = useState<OrderListItem | null>(
    null,
  );
  const [isProofModalOpen, setIsProofModalOpen] = useState(false);

  // TanStack Query: Order Summary (for tab counters)
  const { data: summaryResponse, refetch: refetchSummary } = useOrderSummary();
  const summary = summaryResponse?.data;

  // TanStack Query: Orders List
  const queryParams: OrderFilterParams = useMemo(
    () => ({
      search: activeSearch || undefined,
      status: selectedStatus,
      page: currentPage,
      limit: pageSize,
    }),
    [activeSearch, selectedStatus, currentPage, pageSize],
  );

  const {
    data: ordersResponse,
    isLoading,
    isFetching,
    error: queryError,
    refetch: refetchOrders,
  } = useOrders(queryParams);

  const orders = ordersResponse?.data ?? [];
  const pagination = ordersResponse?.pagination ?? null;

  // Manual Reload Handler
  const handleRefresh = () => {
    refetchOrders();
    refetchSummary();
  };

  // Traditional Search Handlers
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = searchInput.trim();
    if (trimmed !== activeSearch) {
      setActiveSearch(trimmed);
      setCurrentPage(1);
    }
  };

  const handleClearSearch = useCallback(() => {
    setSearchInput("");
    if (activeSearch !== "") {
      setActiveSearch("");
      setCurrentPage(1);
    }
  }, [activeSearch]);

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Escape") {
      handleClearSearch();
    }
  };

  const handleStatusChange = (status: OrderStatus | "ALL") => {
    setSelectedStatus(status);
    setCurrentPage(1);
  };

  const handleResetFilters = useCallback(() => {
    setSearchInput("");
    setActiveSearch("");
    setSelectedStatus("ALL");
    setCurrentPage(1);
  }, []);

  // Action handlers
  const handleViewOrder = (order: OrderListItem) => {
    navigate(`/orders/${order.order_id}`);
  };

  const handleOpenStatusModal = (order: OrderListItem) => {
    setStatusModalOrder(order);
    setIsStatusModalOpen(true);
  };

  const handleOpenProofModal = (order: OrderListItem) => {
    setProofModalOrder(order);
    setIsProofModalOpen(true);
  };

  const handleActionSuccess = (message: string) => {
    setNotification({ type: "success", message });
    refetchSummary();

    setTimeout(() => {
      setNotification((prev) => (prev?.message === message ? null : prev));
    }, 5000);
  };

  // Pagination navigation
  const handlePreviousPage = () => {
    if (pagination?.hasPreviousPage || currentPage > 1) {
      setCurrentPage((prev) => Math.max(1, prev - 1));
    }
  };

  const handleNextPage = () => {
    if (
      pagination?.hasNextPage ||
      (pagination?.totalPages && currentPage < pagination.totalPages)
    ) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const totalPages = pagination?.totalPages || 1;
  const totalItems = pagination?.totalItems ?? orders.length;

  return (
    <>
      <PageMeta
        title={t("orders.meta.title", "Manajemen Pesanan | FastShop Admin")}
        description={t(
          "orders.meta.description",
          "Kelola pesanan pelanggan, verifikasi bukti transfer, dan pembaruan status transaksi",
        )}
      />

      <PageBreadcrumb pageTitle={t("orders.title", "Manajemen Pesanan")} />

      {/* Full-height container maximizing screen viewport */}
      <div className="flex flex-col h-[calc(100dvh-160px)] md:h-[calc(100dvh-180px)] min-h-115">
        {/* Notification Banner */}
        {notification && (
          <div className="shrink-0 mb-4 transition-all duration-300">
            <Alert
              variant={notification.type}
              title={
                notification.type === "success"
                  ? t("common.success", "Berhasil")
                  : t("common.error", "Gagal")
              }
              message={notification.message}
            />
          </div>
        )}

        {/* API Error Banner */}
        {queryError && (
          <div className="shrink-0 mb-4">
            <Alert
              variant="error"
              title={t("common.error", "Gagal")}
              message={
                queryError instanceof Error
                  ? queryError.message
                  : t("orders.errors.fetchFailed", "Gagal memuat daftar pesanan.")
              }
            />
          </div>
        )}

        {/* Maximized Main Card with internal table scrolling */}
        <div className="flex-1 min-h-0 flex flex-col rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/3 shadow-theme-xs overflow-hidden">
          {/* Card Header & Controls */}
          <div className="shrink-0 p-4 sm:p-5 border-b border-gray-100 dark:border-gray-800 space-y-4">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              {/* Title & Subtitle */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
                  {t("orders.title", "Daftar Pesanan")}
                </h3>
                <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
                  {t(
                    "orders.subtitle",
                    "Pantau pesanan masuk, verifikasi bukti pembayaran, dan atur alur pengiriman",
                  )}
                </p>
              </div>

              {/* Controls: Search Bar & Reload Button */}
              <div className="flex items-center gap-3">
                {/* Search Form with Enter to Submit */}
                <form
                  onSubmit={handleSearchSubmit}
                  className="relative w-full sm:w-72"
                >
                  <span className="pointer-events-none absolute inset-y-0 inset-s-3 flex items-center text-gray-400">
                    <SearchIcon className="size-4.5" />
                  </span>
                  <input
                    type="text"
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    onKeyDown={handleSearchKeyDown}
                    placeholder={t(
                      "orders.search.placeholder",
                      "Cari no pesanan / pelanggan...",
                    )}
                    className={`h-10 w-full rounded-lg border border-gray-300 bg-transparent ps-9 ${
                      searchInput ? "pe-9" : "pe-3"
                    } text-xs sm:text-sm text-gray-800 placeholder:text-gray-400 shadow-theme-xs focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/20 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800`}
                  />
                  {searchInput && (
                    <button
                      type="button"
                      onClick={handleClearSearch}
                      className="absolute inset-y-0 inset-e-0 flex items-center pe-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
                      title={t("common.clear", "Hapus")}
                    >
                      <CloseIcon className="size-4" />
                    </button>
                  )}
                </form>

                {/* Manual Reload Button */}
                <button
                  type="button"
                  onClick={handleRefresh}
                  className="inline-flex size-10 shrink-0 items-center justify-center rounded-lg border border-gray-300 bg-white text-gray-500 shadow-theme-xs hover:bg-gray-50 hover:text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-white transition-colors"
                  title={t("common.refresh", "Muat Ulang Data")}
                  aria-label={t("common.refresh", "Muat Ulang Data")}
                >
                  <RegenerateIcon
                    className={`size-4.5 ${
                      isFetching ? "animate-spin text-brand-500" : ""
                    }`}
                  />
                </button>
              </div>
            </div>

            {/* Quick Status Tabs with Badge Counters */}
            <OrderStatusTabs
              selectedStatus={selectedStatus}
              onSelectStatus={handleStatusChange}
              summary={summary}
            />
          </div>

          {/* Table Container: Fills remaining height and scrolls internally */}
          <OrderTable
            orders={orders}
            isLoading={isLoading}
            searchKeyword={activeSearch}
            selectedStatus={selectedStatus}
            onView={handleViewOrder}
            onUpdateStatus={handleOpenStatusModal}
            onViewPaymentProof={handleOpenProofModal}
            onClearFilters={handleResetFilters}
          />

          {/* Card Footer: Pagination Controls */}
          {!isLoading && orders.length > 0 && (
            <div className="shrink-0 px-5 py-3 border-t border-gray-100 bg-gray-50/50 dark:border-gray-800 dark:bg-white/1 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-500 dark:text-gray-400">
              <span>
                {t("orders.table.showingSummary", {
                  from: (currentPage - 1) * pageSize + 1,
                  to: Math.min(currentPage * pageSize, totalItems),
                  total: totalItems,
                  defaultValue: `Menampilkan ${
                    (currentPage - 1) * pageSize + 1
                  }-${Math.min(
                    currentPage * pageSize,
                    totalItems,
                  )} dari ${totalItems} pesanan`,
                })}
              </span>

              {/* Pagination controls */}
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handlePreviousPage}
                  disabled={currentPage <= 1}
                  className="h-8 px-2.5 text-xs"
                  aria-label={t("common.previous", "Sebelumnya")}
                >
                  <ChevronLeftIcon className="size-4 rtl:rotate-180" />
                  <span className="hidden sm:inline ms-1">
                    {t("common.previous", "Sebelumnya")}
                  </span>
                </Button>

                <span className="px-2 text-xs font-medium text-gray-700 dark:text-gray-300">
                  {t("orders.table.pageIndicator", {
                    current: currentPage,
                    total: totalPages,
                    defaultValue: `Hal ${currentPage} / ${totalPages}`,
                  })}
                </span>

                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleNextPage}
                  disabled={currentPage >= totalPages}
                  className="h-8 px-2.5 text-xs"
                  aria-label={t("common.next", "Berikutnya")}
                >
                  <span className="hidden sm:inline me-1">
                    {t("common.next", "Berikutnya")}
                  </span>
                  <ChevronLeftIcon className="size-4 rotate-180 rtl:rotate-0" />
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modal Update Status */}
      <UpdateOrderStatusModal
        isOpen={isStatusModalOpen}
        onClose={() => setIsStatusModalOpen(false)}
        order={
          statusModalOrder
            ? {
                id: statusModalOrder.order_id,
                user_name: statusModalOrder.user_name,
                status: statusModalOrder.status,
              }
            : null
        }
        onSuccess={handleActionSuccess}
      />

      {/* Modal Payment Proof Fullsize Preview */}
      <PaymentProofModal
        isOpen={isProofModalOpen}
        onClose={() => setIsProofModalOpen(false)}
        paymentProofUrl={proofModalOrder?.payment_proof_url ?? null}
        orderId={proofModalOrder?.order_id ?? ""}
        userName={proofModalOrder?.user_name}
        paymentSubmittedAt={proofModalOrder?.payment_submitted_at}
      />
    </>
  );
}
