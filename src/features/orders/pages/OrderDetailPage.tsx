import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import { useTranslation } from "react-i18next";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import PageMeta from "@/components/common/PageMeta";
import ComponentCard from "@/components/common/ComponentCard";
import Button from "@/components/ui/button/Button";
import Alert from "@/components/ui/alert/Alert";
import {
  BoxIcon,
  ChevronLeftIcon,
  CopyIcon,
  CheckSmIcon,
  PencilIcon,
  UserIcon,
} from "@/icons";
import { formatDate, formatRupiah } from "@/utils";
import { useOrderDetail } from "../hooks/useOrders";
import OrderStatusBadge from "../components/OrderStatusBadge";
import UpdateOrderStatusModal from "../components/UpdateOrderStatusModal";
import PaymentProofModal from "../components/PaymentProofModal";

export default function OrderDetailPage() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const dateLocale = i18n.language === "en" ? "en-US" : "id-ID";

  const { data: orderResponse, isLoading, error: queryError } = useOrderDetail(id);
  const order = orderResponse?.data ?? null;

  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [isProofModalOpen, setIsProofModalOpen] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  const handleCopy = (text: string) => {
    if (navigator?.clipboard) {
      navigator.clipboard.writeText(text);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  const handleStatusUpdateSuccess = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 5000);
  };

  if (isLoading) {
    return (
      <>
        <PageMeta
          title="Detail Pesanan | FastShop Admin"
          description="Memuat detail pesanan..."
        />
        <PageBreadcrumb pageTitle={t("orders.detail.title", "Detail Pesanan")} />

        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="h-10 w-32 rounded-lg bg-gray-200 dark:bg-gray-800 animate-pulse" />
            <div className="h-10 w-28 rounded-lg bg-gray-200 dark:bg-gray-800 animate-pulse" />
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
            <div className="lg:col-span-8 space-y-6">
              <div className="h-64 rounded-2xl bg-gray-200 dark:bg-gray-800 animate-pulse" />
              <div className="h-40 rounded-2xl bg-gray-200 dark:bg-gray-800 animate-pulse" />
            </div>
            <div className="lg:col-span-4 space-y-6">
              <div className="h-64 rounded-2xl bg-gray-200 dark:bg-gray-800 animate-pulse" />
              <div className="h-48 rounded-2xl bg-gray-200 dark:bg-gray-800 animate-pulse" />
            </div>
          </div>
        </div>
      </>
    );
  }

  if (queryError || !order) {
    return (
      <>
        <PageMeta
          title="Pesanan Tidak Ditemukan | FastShop Admin"
          description="Pesanan tidak ditemukan atau ID tidak valid."
        />
        <PageBreadcrumb pageTitle={t("orders.detail.title", "Detail Pesanan")} />

        <div className="space-y-4">
          <Alert
            variant="error"
            title={t("common.error", "Gagal")}
            message={
              queryError instanceof Error
                ? queryError.message
                : t(
                    "orders.notifications.notFound",
                    "Pesanan tidak ditemukan atau telah dihapus.",
                  )
            }
          />
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => navigate("/orders")}
            startIcon={<ChevronLeftIcon className="size-4 rtl:rotate-180" />}
          >
            {t("orders.actions.backToList", "Kembali ke Daftar Pesanan")}
          </Button>
        </div>
      </>
    );
  }

  return (
    <>
      <PageMeta
        title={`Pesanan #${order.id} | FastShop Admin`}
        description={`Detail pesanan #${order.id} oleh ${order.user_name}`}
      />

      <PageBreadcrumb
        pageTitle={`${t("orders.detail.title", "Detail Pesanan")} #${order.id}`}
      />

      <div className="space-y-6">
        {notification && (
          <Alert
            variant="success"
            title={t("common.success", "Berhasil")}
            message={notification}
          />
        )}

        {/* Top Action Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Link
            to="/orders"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white transition-colors"
          >
            <ChevronLeftIcon className="size-4 rtl:rotate-180" />
            <span>
              {t("orders.actions.backToList", "Kembali ke Daftar Pesanan")}
            </span>
          </Link>

          <Button
            type="button"
            variant="primary"
            size="sm"
            startIcon={<PencilIcon className="size-4" />}
            onClick={() => setIsStatusModalOpen(true)}
          >
            {t("orders.actions.updateStatus", "Ubah Status Pesanan")}
          </Button>
        </div>

        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 items-start">
          {/* Left Column: Order Items & Shipping Address (8 cols) */}
          <div className="lg:col-span-8 space-y-6">
            {/* Order Items Table Card */}
            <ComponentCard
              title={t("orders.detail.itemsTitle", "Daftar Produk Dipesan")}
              desc={t(
                "orders.detail.itemsDesc",
                "Rincian item produk yang dibeli pada transaksi ini",
              )}
            >
              <div className="divide-y divide-gray-100 dark:divide-gray-800">
                {order.items?.map((item) => (
                  <div
                    key={item.order_item_id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-4 first:pt-0 last:pb-0"
                  >
                    <div className="flex items-center gap-3.5 min-w-0">
                      <div className="size-14 shrink-0 overflow-hidden rounded-xl border border-gray-200 bg-gray-50 flex items-center justify-center dark:border-gray-800 dark:bg-gray-900">
                        {item.product_image ? (
                          <img
                            src={item.product_image}
                            alt={item.product_name}
                            className="size-full object-cover"
                          />
                        ) : (
                          <BoxIcon className="size-6 text-gray-400" />
                        )}
                      </div>

                      <div className="min-w-0">
                        <Link
                          to={`/products/${item.product_id}`}
                          className="truncate text-sm font-semibold text-gray-900 hover:text-brand-600 dark:text-white dark:hover:text-brand-400 transition-colors block"
                        >
                          {item.product_name}
                        </Link>
                        <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
                          {formatRupiah(item.price_at_purchase)} × {item.quantity} unit
                        </p>
                      </div>
                    </div>

                    <div className="text-start sm:text-end shrink-0">
                      <span className="text-xs text-gray-400 block sm:hidden">
                        Subtotal:
                      </span>
                      <p className="text-sm font-bold text-gray-900 dark:text-white">
                        {formatRupiah(item.subtotal)}
                      </p>
                    </div>
                  </div>
                ))}

                {(!order.items || order.items.length === 0) && (
                  <div className="py-6 text-center text-sm text-gray-500 dark:text-gray-400">
                    {t("orders.detail.noItems", "Tidak ada item produk dalam pesanan ini.")}
                  </div>
                )}
              </div>

              {/* Total Calculation Footer */}
              <div className="mt-6 border-t border-gray-100 pt-4 dark:border-gray-800 space-y-2">
                <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                  <span>{t("orders.detail.subtotal", "Subtotal Produk")}</span>
                  <span>{formatRupiah(order.total_amount)}</span>
                </div>
                <div className="flex items-center justify-between text-base font-bold text-gray-900 dark:text-white pt-2 border-t border-dashed border-gray-200 dark:border-gray-800">
                  <span>{t("orders.detail.totalAmount", "Total Pembayaran")}</span>
                  <span className="text-xl font-extrabold text-brand-600 dark:text-brand-400">
                    {formatRupiah(order.total_amount)}
                  </span>
                </div>
              </div>
            </ComponentCard>

            {/* Shipping Address Card */}
            <ComponentCard
              title={t("orders.detail.shippingTitle", "Informasi Pengiriman")}
            >
              <div className="space-y-3">
                <div className="rounded-xl border border-gray-100 bg-gray-50/70 p-4 dark:border-gray-800 dark:bg-white/2">
                  <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider block mb-1">
                    {t("orders.detail.addressLabel", "Alamat Tujuan")}
                  </span>
                  <p className="text-sm leading-relaxed text-gray-800 dark:text-gray-200">
                    {order.shipping_address || (
                      <span className="italic text-gray-400">
                        {t("orders.detail.noAddress", "Tidak ada alamat pengiriman.")}
                      </span>
                    )}
                  </p>
                </div>
              </div>
            </ComponentCard>
          </div>

          {/* Right Column: Status, Payment Proof & Customer (4 cols) */}
          <div className="lg:col-span-4 space-y-6">
            {/* Status & Timing Overview Card */}
            <ComponentCard
              title={t("orders.detail.statusOverview", "Status Pesanan")}
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {t("orders.table.columns.status", "Status")}:
                  </span>
                  <OrderStatusBadge status={order.status} size="md" />
                </div>

                <div className="divide-y divide-gray-100 dark:divide-gray-800 text-xs">
                  <div className="flex items-center justify-between py-2">
                    <span className="text-gray-500 dark:text-gray-400">
                      {t("orders.detail.createdAt", "Waktu Dibuat")}:
                    </span>
                    <span className="font-medium text-gray-800 dark:text-gray-200">
                      {formatDate(order.created_at, dateLocale)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between py-2">
                    <span className="text-gray-500 dark:text-gray-400">
                      {t("orders.detail.updatedAt", "Terakhir Diperbarui")}:
                    </span>
                    <span className="font-medium text-gray-800 dark:text-gray-200">
                      {formatDate(order.updated_at, dateLocale)}
                    </span>
                  </div>
                </div>
              </div>
            </ComponentCard>

            {/* Payment Proof Card */}
            <ComponentCard
              title={t("orders.paymentProof.title", "Bukti Transfer")}
            >
              {order.payment_proof_url ? (
                <div className="space-y-3">
                  <div
                    onClick={() => setIsProofModalOpen(true)}
                    className="group relative flex aspect-4/3 w-full cursor-pointer items-center justify-center overflow-hidden rounded-xl border border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-900"
                  >
                    <img
                      src={order.payment_proof_url}
                      alt={`Bukti #${order.id}`}
                      className="size-full object-contain p-2 transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-semibold">
                      {t("orders.paymentProof.clickToEnlarge", "Klik untuk Memperbesar")}
                    </div>
                  </div>

                  {order.payment_submitted_at && (
                    <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                      {t("orders.paymentProof.submittedAt", "Diunggah pada")}:{" "}
                      <span className="font-medium text-gray-700 dark:text-gray-300">
                        {formatDate(order.payment_submitted_at, dateLocale)}
                      </span>
                    </p>
                  )}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center gap-2 p-6 text-center text-gray-400 dark:text-gray-500">
                  <BoxIcon className="size-10 text-gray-300 dark:text-gray-600" />
                  <p className="text-xs">
                    {t(
                      "orders.paymentProof.notUploaded",
                      "Pelanggan belum mengunggah bukti pembayaran.",
                    )}
                  </p>
                </div>
              )}
            </ComponentCard>

            {/* Customer Information Card */}
            <ComponentCard
              title={t("orders.detail.customerTitle", "Informasi Pelanggan")}
            >
              <div className="space-y-3.5 text-xs">
                <div className="flex items-center gap-3">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400">
                    <UserIcon className="size-5" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                      {order.user_name || "-"}
                    </p>
                    <p className="text-gray-400 truncate">{order.email}</p>
                  </div>
                </div>

                <div className="rounded-lg border border-gray-100 bg-gray-50/50 p-2.5 dark:border-gray-800 dark:bg-white/2 flex items-center justify-between">
                  <span className="text-gray-400">User ID:</span>
                  <div className="flex items-center gap-1.5 font-mono text-gray-700 dark:text-gray-300">
                    <span>{order.user_id}</span>
                    <button
                      type="button"
                      onClick={() => handleCopy(order.user_id)}
                      className="text-gray-400 hover:text-gray-600 dark:hover:text-white"
                      title={isCopied ? "Tersalin!" : "Salin User ID"}
                    >
                      {isCopied ? (
                        <CheckSmIcon className="size-3.5 text-success-500" />
                      ) : (
                        <CopyIcon className="size-3.5" />
                      )}
                    </button>
                  </div>
                </div>

                {order.phone_number && (
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-gray-400">
                      {t("orders.detail.phone", "No. Telepon")}:
                    </span>
                    <span className="font-medium text-gray-800 dark:text-gray-200">
                      {order.phone_number}
                    </span>
                  </div>
                )}
              </div>
            </ComponentCard>
          </div>
        </div>
      </div>

      {/* Modal Update Order Status */}
      <UpdateOrderStatusModal
        isOpen={isStatusModalOpen}
        onClose={() => setIsStatusModalOpen(false)}
        order={{
          id: order.id,
          user_name: order.user_name,
          status: order.status,
        }}
        onSuccess={handleStatusUpdateSuccess}
      />

      {/* Modal Payment Proof Fullsize Preview */}
      <PaymentProofModal
        isOpen={isProofModalOpen}
        onClose={() => setIsProofModalOpen(false)}
        paymentProofUrl={order.payment_proof_url}
        orderId={order.id}
        userName={order.user_name}
        paymentSubmittedAt={order.payment_submitted_at}
      />
    </>
  );
}
