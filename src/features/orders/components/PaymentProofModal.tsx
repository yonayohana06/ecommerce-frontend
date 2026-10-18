import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Modal } from "@/components/ui/modal";
import Button from "@/components/ui/button/Button";
import { BoxIcon, DownloadIcon } from "@/icons";
import { formatDate } from "@/utils";

interface PaymentProofModalProps {
  isOpen: boolean;
  onClose: () => void;
  paymentProofUrl: string | null;
  orderId: string | number;
  userName?: string;
  paymentSubmittedAt?: string | null;
}

export default function PaymentProofModal({
  isOpen,
  onClose,
  paymentProofUrl,
  orderId,
  userName,
  paymentSubmittedAt,
}: PaymentProofModalProps) {
  const { t, i18n } = useTranslation();
  const [imageError, setImageError] = useState(false);
  const dateLocale = i18n.language === "en" ? "en-US" : "id-ID";

  if (!isOpen) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      showCloseButton={false}
      className="max-w-xl p-6"
    >
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 pb-3 dark:border-gray-800">
          <div>
            <h3 className="text-base font-semibold text-gray-900 dark:text-white">
              {t("orders.paymentProof.title", "Bukti Pembayaran")}
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {t("orders.table.columns.orderId", "Pesanan")} #{orderId}
              {userName ? ` • ${userName}` : ""}
            </p>
          </div>

          {paymentSubmittedAt && (
            <span className="text-xs text-gray-400 dark:text-gray-500">
              {formatDate(paymentSubmittedAt, dateLocale)}
            </span>
          )}
        </div>

        {/* Image Preview Container */}
        <div className="relative flex min-h-64 max-h-[70vh] w-full items-center justify-center overflow-hidden rounded-xl border border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-900/60">
          {paymentProofUrl && !imageError ? (
            <img
              src={paymentProofUrl}
              alt={`Bukti Pembayaran #${orderId}`}
              onError={() => setImageError(true)}
              className="max-h-[65vh] w-auto max-w-full object-contain p-2"
            />
          ) : (
            <div className="flex flex-col items-center justify-center gap-2 p-8 text-gray-400">
              <BoxIcon className="size-12 text-gray-300 dark:text-gray-600" />
              <p className="text-xs">
                {imageError
                  ? t("orders.paymentProof.loadError", "Gagal memuat gambar bukti transfer.")
                  : t("orders.paymentProof.notUploaded", "Belum ada bukti pembayaran yang diunggah.")}
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-2">
          {paymentProofUrl && !imageError ? (
            <a
              href={paymentProofUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-medium text-brand-600 hover:text-brand-700 dark:text-brand-400"
            >
              <DownloadIcon className="size-4" />
              <span>{t("orders.paymentProof.openOriginal", "Buka Gambar Asli")}</span>
            </a>
          ) : (
            <div />
          )}

          <Button type="button" variant="outline" size="sm" onClick={onClose}>
            {t("common.close", "Tutup")}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
