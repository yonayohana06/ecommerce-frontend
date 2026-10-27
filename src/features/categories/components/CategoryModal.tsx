import type React from "react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Modal } from "@/components/ui/modal";
import Button from "@/components/ui/button/Button";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import Alert from "@/components/ui/alert/Alert";
import categoryService from "../api/categoryService";
import type { Category, CategoryPayload } from "../types";

interface CategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  category: Category | null;
  onSuccess: (message: string) => void;
}

// Inner form component mounted freshly when modal opens
function CategoryForm({
  category,
  onClose,
  onSuccess,
}: {
  category: Category | null;
  onClose: () => void;
  onSuccess: (message: string) => void;
}) {
  const { t } = useTranslation();
  const isEditing = Boolean(category);

  const [name, setName] = useState(category?.name ?? "");
  const [slug, setSlug] = useState(category?.slug ?? "");
  const [iconUrl, setIconUrl] = useState(category?.icon_url ?? "");
  const [isSlugManuallyEdited, setIsSlugManuallyEdited] = useState(
    Boolean(category),
  );

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Helper to generate URL-safe slug from title
  const generateSlug = (text: string) => {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_-]+/g, "-")
      .replace(/^-+|-+$/g, "");
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setName(val);
    if (!isSlugManuallyEdited) {
      setSlug(generateSlug(val));
    }
  };

  const handleSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsSlugManuallyEdited(true);
    setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "-"));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      setErrorMessage(
        t("categories.form.validation.nameRequired", "Nama kategori wajib diisi."),
      );
      return;
    }

    const finalSlug = slug.trim() || generateSlug(name);
    const payload: CategoryPayload = {
      name: name.trim(),
      slug: finalSlug,
      icon_url: iconUrl.trim() || null,
    };

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      if (isEditing && category) {
        await categoryService.updateCategory(category.id, payload);
        onSuccess(
          t("categories.notifications.updateSuccess", {
            name: payload.name,
            defaultValue: `Kategori "${payload.name}" berhasil diperbarui.`,
          }),
        );
      } else {
        await categoryService.createCategory(payload);
        onSuccess(
          t("categories.notifications.createSuccess", {
            name: payload.name,
            defaultValue: `Kategori "${payload.name}" berhasil ditambahkan.`,
          }),
        );
      }
      onClose();
    } catch (err: unknown) {
      const errorMsg =
        err instanceof Error
          ? err.message
          : t("categories.notifications.saveError", "Gagal menyimpan kategori.");
      setErrorMessage(errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <h3 className="text-xl font-bold text-gray-800 dark:text-white/90">
        {isEditing
          ? t("categories.form.editTitle", "Ubah Kategori")
          : t("categories.form.createTitle", "Tambah Kategori Baru")}
      </h3>
      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
        {isEditing
          ? t(
            "categories.form.editSubtitle",
            "Perbarui nama, slug, atau ikon kategori produk ini.",
          )
          : t(
            "categories.form.createSubtitle",
            "Lengkapi informasi kategori baru untuk katalog toko Anda.",
          )}
      </p>

      {errorMessage && (
        <div className="mt-4">
          <Alert
            variant="error"
            title={t("categories.notifications.saveError", "Gagal")}
            message={errorMessage}
          />
        </div>
      )}

      <form onSubmit={handleSubmit} className="mt-6 space-y-5">
        {/* Category Name */}
        <div>
          <Label htmlFor="category-name">
            {t("categories.form.nameLabel", "Nama Kategori")}{" "}
            <span className="text-error-500">*</span>
          </Label>
          <Input
            id="category-name"
            name="name"
            type="text"
            value={name}
            onChange={handleNameChange}
            placeholder={t(
              "categories.form.namePlaceholder",
              "Contoh: Sepatu & Olahraga",
            )}
            disabled={isSubmitting}
            autoFocus
          />
        </div>

        {/* Slug URL */}
        <div>
          <Label htmlFor="category-slug">
            {t("categories.form.slugLabel", "Slug URL")}
          </Label>
          <Input
            id="category-slug"
            name="slug"
            type="text"
            value={slug}
            onChange={handleSlugChange}
            placeholder={t(
              "categories.form.slugPlaceholder",
              "sepatu-olahraga",
            )}
            disabled={isSubmitting}
          />
          <p className="mt-1.5 text-xs text-gray-500 dark:text-gray-400">
            {t(
              "categories.form.slugHint",
              "Slug digunakan untuk identifikasi URL dan dihasilkan otomatis dari nama.",
            )}
          </p>
        </div>

        {/* Icon URL */}
        <div>
          <Label htmlFor="category-icon">
            {t("categories.form.iconUrlLabel", "URL Ikon (Opsional)")}
          </Label>
          <div className="flex items-center gap-3">
            <div className="flex-1">
              <Input
                id="category-icon"
                name="icon_url"
                type="url"
                value={iconUrl}
                onChange={(e) => setIconUrl(e.target.value)}
                placeholder={t(
                  "categories.form.iconUrlPlaceholder",
                  "https://example.com/icons/category.png",
                )}
                disabled={isSubmitting}
              />
            </div>

            {/* Icon Preview */}
            <div className="flex size-11 shrink-0 items-center justify-center rounded-lg border border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-800">
              {iconUrl ? (
                <img
                  src={iconUrl}
                  alt="Preview"
                  className="size-7 object-contain"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = "none";
                  }}
                />
              ) : (
                <span className="text-xs text-gray-400">Preview</span>
              )}
            </div>
          </div>
          <p className="mt-1.5 text-xs text-gray-500 dark:text-gray-400">
            {t(
              "categories.form.iconUrlHint",
              "Tautan gambar icon atau SVG untuk etalase aplikasi.",
            )}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-100 dark:border-gray-800">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onClose}
            disabled={isSubmitting}
          >
            {t("categories.actions.cancel", "Batal")}
          </Button>
          <Button
            type="submit"
            variant="primary"
            size="sm"
            disabled={isSubmitting || !name.trim()}
          >
            {isSubmitting
              ? t("categories.actions.saving", "Menyimpan...")
              : t("categories.actions.save", "Simpan")}
          </Button>
        </div>
      </form>
    </div>
  );
}

export default function CategoryModal({
  isOpen,
  onClose,
  category,
  onSuccess,
}: CategoryModalProps) {
  if (!isOpen) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      className="max-w-135 p-6 lg:p-8"
    >
      <CategoryForm
        key={category ? `edit-${category.id}` : "create"}
        category={category}
        onClose={onClose}
        onSuccess={onSuccess}
      />
    </Modal>
  );
}
