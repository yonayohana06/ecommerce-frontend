import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import Button from "@/components/ui/button/Button";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import Alert from "@/components/ui/alert/Alert";
import { BoxIcon, ChevronDownIcon } from "@/icons";
import { formatRupiah } from "@/utils";
import categoryService from "@/features/categories/api/categoryService";
import type { Category } from "@/features/categories/types";
import { useQueryClient } from "@tanstack/react-query";
import { PRODUCT_QUERY_KEYS } from "../hooks/useProducts";
import productService from "../api/productService";
import type { Product, ProductPayload } from "../types";

interface ProductFormProps {
  product?: Product | null;
  onSuccess: (message: string) => void;
  onCancel: () => void;
}

export default function ProductForm({
  product,
  onSuccess,
  onCancel,
}: ProductFormProps) {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const isEditing = Boolean(product);

  // Form states initialized with product values if editing
  const [name, setName] = useState(product?.name ?? "");
  const [categoryId, setCategoryId] = useState<number | "">(
    product?.category_id ?? "",
  );
  const [price, setPrice] = useState<string>(
    product?.price !== undefined ? String(product.price) : "",
  );
  const [stock, setStock] = useState<string>(
    product?.stock !== undefined ? String(product.stock) : "",
  );
  const [imageUrl, setImageUrl] = useState(product?.image_url ?? "");
  const [description, setDescription] = useState(product?.description ?? "");

  // Image load error state for live preview
  const [imageError, setImageError] = useState(false);

  // Categories list loaded from API
  const [categories, setCategories] = useState<Category[]>([]);
  const [isCategoriesLoading, setIsCategoriesLoading] = useState(true);

  // Submission & validation states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Fetch categories on mount for the category selector dropdown
  useEffect(() => {
    let isMounted = true;
    categoryService
      .getCategories()
      .then((res) => {
        if (isMounted) {
          setCategories(res.data || []);
          setIsCategoriesLoading(false);
        }
      })
      .catch(() => {
        if (isMounted) {
          setIsCategoriesLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const handleImageUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setImageUrl(e.target.value);
    setImageError(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      setErrorMessage(
        t("products.form.validation.nameRequired", "Nama produk wajib diisi."),
      );
      return;
    }

    if (categoryId === "" || Number(categoryId) <= 0) {
      setErrorMessage(
        t(
          "products.form.validation.categoryRequired",
          "Silakan pilih kategori produk.",
        ),
      );
      return;
    }

    const parsedPrice = parseFloat(price);
    if (isNaN(parsedPrice) || parsedPrice < 0) {
      setErrorMessage(
        t(
          "products.form.validation.priceInvalid",
          "Harga produk harus berupa angka yang valid (>= 0).",
        ),
      );
      return;
    }

    const parsedStock = parseInt(stock, 10);
    if (isNaN(parsedStock) || parsedStock < 0) {
      setErrorMessage(
        t(
          "products.form.validation.stockInvalid",
          "Jumlah stok harus berupa angka bulat yang valid (>= 0).",
        ),
      );
      return;
    }

    const payload: ProductPayload = {
      name: name.trim(),
      category_id: Number(categoryId),
      price: parsedPrice,
      stock: parsedStock,
      description: description.trim() || undefined,
      image_url: imageUrl.trim() || undefined,
    };

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      if (isEditing && product) {
        await productService.updateProduct(product.id, payload);
        await queryClient.invalidateQueries({
          queryKey: PRODUCT_QUERY_KEYS.all,
        });
        onSuccess(
          t("products.notifications.updateSuccess", {
            name: payload.name,
            defaultValue: `Produk "${payload.name}" berhasil diperbarui.`,
          }),
        );
      } else {
        await productService.createProduct(payload);
        await queryClient.invalidateQueries({
          queryKey: PRODUCT_QUERY_KEYS.all,
        });
        onSuccess(
          t("products.notifications.createSuccess", {
            name: payload.name,
            defaultValue: `Produk "${payload.name}" berhasil ditambahkan.`,
          }),
        );
      }
    } catch (err: unknown) {
      const msg =
        err instanceof Error
          ? err.message
          : t(
              "products.notifications.saveError",
              "Gagal menyimpan data produk. Silakan periksa kembali input Anda.",
            );
      setErrorMessage(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {errorMessage && (
        <Alert
          variant="error"
          title={t("common.error", "Gagal")}
          message={errorMessage}
        />
      )}

      {/* Grid: Left Column for Information, Right Column for Media / Preview */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Main Details (2 cols on large screen) */}
        <div className="space-y-5 lg:col-span-2">
          {/* Product Name */}
          <div>
            <Label htmlFor="product-name">
              {t("products.form.nameLabel", "Nama Produk")} *
            </Label>
            <Input
              id="product-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t(
                "products.form.namePlaceholder",
                "Contoh: Sepatu Running Adidas Ultraboost",
              )}
              disabled={isSubmitting}
            />
          </div>

          {/* Category Dropdown */}
          <div>
            <Label htmlFor="product-category">
              {t("products.form.categoryLabel", "Kategori")} *
            </Label>
            <div className="relative">
              <select
                id="product-category"
                value={categoryId}
                onChange={(e) =>
                  setCategoryId(
                    e.target.value ? Number(e.target.value) : "",
                  )
                }
                disabled={isSubmitting || isCategoriesLoading}
                className="h-11 w-full appearance-none rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 pe-10 text-sm shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:ring-3 focus:ring-brand-500/10 focus:outline-hidden dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:focus:border-brand-800 disabled:opacity-50"
              >
                <option value="" disabled className="dark:bg-gray-900">
                  {isCategoriesLoading
                    ? t("common.loading", "Memuat kategori...")
                    : t(
                        "products.form.categoryPlaceholder",
                        "Pilih Kategori Produk",
                      )}
                </option>
                {categories.map((cat) => (
                  <option
                    key={cat.id}
                    value={cat.id}
                    className="text-gray-800 dark:bg-gray-900 dark:text-white/90"
                  >
                    {cat.name}
                  </option>
                ))}
              </select>
              <span className="pointer-events-none absolute inset-y-0 inset-e-3 flex items-center text-gray-500 dark:text-gray-400">
                <ChevronDownIcon className="size-4" />
              </span>
            </div>
          </div>

          {/* Price & Stock Row */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="product-price">
                {t("products.form.priceLabel", "Harga (Rp)")} *
              </Label>
              <Input
                id="product-price"
                type="number"
                min={0}
                step={500}
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="0"
                disabled={isSubmitting}
              />
              {price && !isNaN(parseFloat(price)) && (
                <p className="mt-1.5 text-xs font-medium text-brand-600 dark:text-brand-400">
                  {t("products.form.pricePreview", "Format")}:{" "}
                  {formatRupiah(parseFloat(price))}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="product-stock">
                {t("products.form.stockLabel", "Jumlah Stok")} *
              </Label>
              <Input
                id="product-stock"
                type="number"
                min={0}
                step={1}
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                placeholder="0"
                disabled={isSubmitting}
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <Label htmlFor="product-description">
              {t("products.form.descriptionLabel", "Deskripsi Produk")} (
              {t("common.optional", "Opsional")})
            </Label>
            <textarea
              id="product-description"
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={t(
                "products.form.descriptionPlaceholder",
                "Tuliskan detail spesifikasi, fitur, dan informasi produk...",
              )}
              disabled={isSubmitting}
              className="w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 placeholder:text-gray-400 shadow-theme-xs focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/20 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
            />
          </div>
        </div>

        {/* Media / Image URL & Live Preview (1 col on large screen) */}
        <div className="space-y-4">
          <Label htmlFor="product-image-url">
            {t("products.form.imageUrlLabel", "URL Gambar Produk")}
          </Label>
          <Input
            id="product-image-url"
            type="url"
            value={imageUrl}
            onChange={handleImageUrlChange}
            placeholder={t(
              "products.form.imageUrlPlaceholder",
              "https://images.unsplash.com/...",
            )}
            disabled={isSubmitting}
          />
          <p className="text-xs text-gray-400 dark:text-gray-500">
            {t(
              "products.form.imageUrlHint",
              "Masukkan tautan gambar langsung (HTTPS) berformat JPG, PNG, atau WebP.",
            )}
          </p>

          {/* Live Image Preview Card */}
          <div className="rounded-xl border border-gray-200 bg-gray-50/50 p-4 text-center dark:border-gray-800 dark:bg-gray-900/50">
            <span className="text-xs font-medium text-gray-500 dark:text-gray-400 block mb-2">
              {t("products.form.imagePreview", "Pratinjau Gambar")}
            </span>
            <div className="relative mx-auto flex h-48 w-full max-w-xs items-center justify-center overflow-hidden rounded-lg border border-dashed border-gray-300 bg-white dark:border-gray-700 dark:bg-gray-900">
              {imageUrl.trim() && !imageError ? (
                <img
                  src={imageUrl.trim()}
                  alt={name || "Product Preview"}
                  onError={() => setImageError(true)}
                  className="h-full w-full object-contain p-2"
                />
              ) : (
                <div className="flex flex-col items-center justify-center gap-2 p-4 text-gray-400 dark:text-gray-500">
                  <BoxIcon className="size-10 text-gray-300 dark:text-gray-600" />
                  <span className="text-xs">
                    {imageError
                      ? t(
                          "products.form.imageLoadError",
                          "Gambar gagal dimuat dari tautan",
                        )
                      : t(
                          "products.form.noImagePreview",
                          "Belum ada gambar yang dimasukkan",
                        )}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Form Action Buttons */}
      <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100 dark:border-gray-800">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          {t("common.cancel", "Batal")}
        </Button>
        <Button
          type="submit"
          variant="primary"
          size="sm"
          disabled={isSubmitting}
        >
          {isSubmitting
            ? t("common.saving", "Menyimpan...")
            : isEditing
              ? t("products.actions.saveChanges", "Simpan Perubahan")
              : t("products.actions.createProduct", "Tambah Produk")}
        </Button>
      </div>
    </form>
  );
}
