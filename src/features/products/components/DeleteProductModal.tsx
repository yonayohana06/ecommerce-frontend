import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useQueryClient } from "@tanstack/react-query";
import { Modal } from "@/components/ui/modal";
import Button from "@/components/ui/button/Button";
import Alert from "@/components/ui/alert/Alert";
import { TrashBinIcon } from "@/icons";
import { PRODUCT_QUERY_KEYS } from "../hooks/useProducts";
import productService from "../api/productService";
import type { Product } from "../types";

interface DeleteProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
  onSuccess: (message: string) => void;
}

export default function DeleteProductModal({
  isOpen,
  onClose,
  product,
  onSuccess,
}: DeleteProductModalProps) {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [isDeleting, setIsDeleting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!product) return null;

  const handleDelete = async () => {
    setIsDeleting(true);
    setErrorMessage(null);

    try {
      const res = await productService.deleteProduct(product.id);
      await queryClient.invalidateQueries({
        queryKey: PRODUCT_QUERY_KEYS.all,
      });
      const successMsg =
        res.message ||
        t("products.notifications.deleteSuccess", {
          name: product.name,
          defaultValue: `Produk "${product.name}" berhasil dihapus.`,
        });
      onSuccess(successMsg);
      onClose();
    } catch (err: unknown) {
      const msg =
        err instanceof Error
          ? err.message
          : t("products.notifications.deleteError", "Gagal menghapus produk.");
      setErrorMessage(msg);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      className="max-w-120 p-6 lg:p-8"
    >
      <div className="flex flex-col items-center text-center">
        {/* Warning Icon Badge */}
        <div className="flex size-14 items-center justify-center rounded-2xl bg-error-50 text-error-600 dark:bg-error-500/15 dark:text-error-400">
          <TrashBinIcon className="size-7" />
        </div>

        <h3 className="mt-4 text-xl font-bold text-gray-800 dark:text-white/90">
          {t("products.deleteModal.title", "Hapus Produk")}
        </h3>

        <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
          {t("products.deleteModal.warning", {
            name: product.name,
            defaultValue: `Apakah Anda yakin ingin menghapus produk "${product.name}"?`,
          })}
        </p>

        <p className="mt-2 text-xs text-gray-400 dark:text-gray-500">
          {t(
            "products.deleteModal.note",
            "Catatan: Produk yang sudah pernah masuk transaksi akan dinonaktifkan secara otomatis dan tidak dihapus permanen.",
          )}
        </p>

        {errorMessage && (
          <div className="mt-4 w-full text-start">
            <Alert
              variant="error"
              title={t("products.notifications.deleteError", "Gagal")}
              message={errorMessage}
            />
          </div>
        )}

        {/* Buttons */}
        <div className="mt-6 flex w-full items-center justify-center gap-3">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onClose}
            disabled={isDeleting}
            className="flex-1"
          >
            {t("products.actions.cancel", "Batal")}
          </Button>

          <button
            type="button"
            onClick={handleDelete}
            disabled={isDeleting}
            className="flex-1 inline-flex items-center justify-center rounded-lg bg-error-600 px-4 py-3 text-sm font-medium text-white shadow-theme-xs hover:bg-error-700 disabled:opacity-50 transition"
          >
            {isDeleting
              ? t("products.actions.deleting", "Menghapus...")
              : t("products.actions.confirmDelete", "Hapus Produk")}
          </button>
        </div>
      </div>
    </Modal>
  );
}
