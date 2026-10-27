import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Modal } from "@/components/ui/modal";
import Button from "@/components/ui/button/Button";
import Alert from "@/components/ui/alert/Alert";
import { TrashBinIcon } from "@/icons";
import categoryService from "../api/categoryService";
import type { Category } from "../types";

interface DeleteCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  category: Category | null;
  onSuccess: (message: string) => void;
}

export default function DeleteCategoryModal({
  isOpen,
  onClose,
  category,
  onSuccess,
}: DeleteCategoryModalProps) {
  const { t } = useTranslation();
  const [isDeleting, setIsDeleting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!category) return null;

  const productCount = category.product_count ?? 0;

  const handleDelete = async () => {
    setIsDeleting(true);
    setErrorMessage(null);

    try {
      await categoryService.deleteCategory(category.id);
      onSuccess(
        t("categories.notifications.deleteSuccess", {
          name: category.name,
          defaultValue: `Kategori "${category.name}" berhasil dihapus.`,
        }),
      );
      onClose();
    } catch (err: unknown) {
      const msg =
        err instanceof Error
          ? err.message
          : t("categories.notifications.deleteError", "Gagal menghapus kategori.");
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
          {t("categories.deleteModal.title", "Hapus Kategori")}
        </h3>

        <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
          {t("categories.deleteModal.warning", {
            name: category.name,
            defaultValue: `Apakah Anda yakin ingin menghapus kategori "${category.name}"?`,
          })}
        </p>

        {productCount > 0 && (
          <div className="mt-4 w-full text-start">
            <Alert
              variant="warning"
              title={t("categories.deleteModal.title", "Perhatian")}
              message={t("categories.deleteModal.affectedProductsWarning", {
                count: productCount,
                defaultValue: `Perhatian: Ada ${productCount} produk yang saat ini berada di dalam kategori ini. Menghapus kategori dapat melepaskan relasi produk tersebut.`,
              })}
            />
          </div>
        )}

        <p className="mt-3 text-xs text-gray-400">
          {t("categories.deleteModal.irreversible", "Tindakan ini tidak dapat dibatalkan.")}
        </p>

        {errorMessage && (
          <div className="mt-4 w-full text-start">
            <Alert
              variant="error"
              title={t("categories.notifications.deleteError", "Gagal")}
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
            {t("categories.actions.cancel", "Batal")}
          </Button>

          <button
            type="button"
            onClick={handleDelete}
            disabled={isDeleting}
            className="flex-1 inline-flex items-center justify-center rounded-lg bg-error-600 px-4 py-3 text-sm font-medium text-white shadow-theme-xs hover:bg-error-700 disabled:opacity-50 transition"
          >
            {isDeleting
              ? t("categories.actions.deleting", "Menghapus...")
              : t("categories.actions.confirmDelete", "Hapus Kategori")}
          </button>
        </div>
      </div>
    </Modal>
  );
}
