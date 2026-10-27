import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import { useTranslation } from "react-i18next";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import PageMeta from "@/components/common/PageMeta";
import ComponentCard from "@/components/common/ComponentCard";
import Button from "@/components/ui/button/Button";
import Badge from "@/components/ui/badge/Badge";
import Alert from "@/components/ui/alert/Alert";
import {
  BoxIcon,
  CheckSmIcon,
  ChevronLeftIcon,
  CopyIcon,
  FolderIcon,
  PencilIcon,
  TrashBinIcon,
} from "@/icons";
import { formatDate, formatRupiah } from "@/utils";
import { useProduct } from "../hooks/useProducts";
import DeleteProductModal from "../components/DeleteProductModal";

export default function ProductDetailPage() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const { data, isLoading, error: queryError } = useProduct(id);
  const product = data?.data ?? null;
  const error =
    queryError instanceof Error
      ? queryError.message
      : queryError
        ? t(
            "products.notifications.loadDetailError",
            "Gagal memuat data detail produk.",
          )
        : null;

  const [isCopied, setIsCopied] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const dateLocale = i18n.language === "en" ? "en-US" : "id-ID";

  const handleCopyId = () => {
    if (product && navigator?.clipboard) {
      navigator.clipboard.writeText(String(product.id));
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  const handleDeleteSuccess = (message: string) => {
    navigate("/products", {
      state: {
        notification: {
          type: "success",
          message,
        },
      },
    });
  };

  if (isLoading) {
    return (
      <>
        <PageMeta
          title="Detail Produk | FastShop Admin"
          description="Memuat detail produk..."
        />
        <PageBreadcrumb pageTitle={t("products.detail.title", "Detail Produk")} />

        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="h-10 w-32 rounded-lg bg-gray-200 dark:bg-gray-800 animate-pulse" />
            <div className="flex gap-2">
              <div className="h-10 w-28 rounded-lg bg-gray-200 dark:bg-gray-800 animate-pulse" />
              <div className="h-10 w-28 rounded-lg bg-gray-200 dark:bg-gray-800 animate-pulse" />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
            <div className="lg:col-span-5 h-80 rounded-2xl bg-gray-200 dark:bg-gray-800 animate-pulse" />
            <div className="lg:col-span-7 space-y-4">
              <div className="h-8 w-64 rounded bg-gray-200 dark:bg-gray-800 animate-pulse" />
              <div className="h-6 w-36 rounded bg-gray-200 dark:bg-gray-800 animate-pulse" />
              <div className="h-32 w-full rounded-xl bg-gray-200 dark:bg-gray-800 animate-pulse" />
            </div>
          </div>
        </div>
      </>
    );
  }

  if (error || !product) {
    return (
      <>
        <PageMeta
          title="Produk Tidak Ditemukan | FastShop Admin"
          description="Produk tidak ditemukan atau telah dihapus."
        />
        <PageBreadcrumb pageTitle={t("products.detail.title", "Detail Produk")} />

        <div className="space-y-4">
          <Alert
            variant="error"
            title={t("common.error", "Gagal")}
            message={
              error ||
              t(
                "products.notifications.notFound",
                "Produk tidak ditemukan atau telah dihapus.",
              )
            }
          />
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => navigate("/products")}
            startIcon={<ChevronLeftIcon className="size-4 rtl:rotate-180" />}
          >
            {t("products.actions.backToList", "Kembali ke Daftar Produk")}
          </Button>
        </div>
      </>
    );
  }

  const stock = Number(product.stock) || 0;
  const isActive = product.is_active !== false;

  let stockBadgeVariant: "success" | "warning" | "error" = "success";
  let stockBadgeLabel = `${stock} unit`;
  if (stock === 0) {
    stockBadgeVariant = "error";
    stockBadgeLabel = t("products.stock.outOfStock", "Habis");
  } else if (stock <= 10) {
    stockBadgeVariant = "warning";
    stockBadgeLabel = `${stock} unit (${t("products.stock.low", "Menipis")})`;
  }

  return (
    <>
      <PageMeta
        title={`${product.name} | FastShop Admin`}
        description={
          product.description ||
          t(
            "products.meta.detailDescription",
            "Lihat informasi lengkap, spesifikasi harga, stok, dan kategori produk",
          )
        }
      />

      <PageBreadcrumb
        pageTitle={product.name || t("products.detail.title", "Detail Produk")}
      />

      <div className="space-y-6">
        {/* Top Action Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Link
            to="/products"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white transition-colors"
          >
            <ChevronLeftIcon className="size-4 rtl:rotate-180" />
            <span>
              {t("products.actions.backToList", "Kembali ke Daftar Produk")}
            </span>
          </Link>

          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              startIcon={<PencilIcon className="size-4" />}
              onClick={() => navigate(`/products/${product.id}/edit`)}
            >
              {t("products.actions.editProduct", "Ubah Produk")}
            </Button>

            <Button
              type="button"
              variant="outline"
              size="sm"
              startIcon={<TrashBinIcon className="size-4" />}
              onClick={() => setIsDeleteModalOpen(true)}
              className="text-error-600 hover:bg-error-50 hover:text-error-700 dark:text-error-400 dark:hover:bg-error-500/10"
            >
              {t("products.actions.delete", "Hapus")}
            </Button>
          </div>
        </div>

        {/* Main Details Grid */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 items-start">
          {/* Left Column: Product Image & Badges Card */}
          <div className="lg:col-span-5 space-y-4">
            <ComponentCard title={t("products.form.imagePreview", "Gambar Produk")}>
              <div className="flex flex-col items-center">
                <div className="relative flex aspect-square w-full max-w-sm items-center justify-center overflow-hidden rounded-2xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-800 dark:bg-gray-900/60">
                  {product.image_url && !imageError ? (
                    <img
                      src={product.image_url}
                      alt={product.name}
                      onError={() => setImageError(true)}
                      className="size-full object-contain"
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center gap-2 text-gray-400">
                      <BoxIcon className="size-16 text-gray-300 dark:text-gray-600" />
                      <span className="text-xs">
                        {t("products.table.noImage", "Tidak ada gambar")}
                      </span>
                    </div>
                  )}
                </div>

                {/* Badge tags beneath image */}
                <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
                  <Badge variant="light" color="light" size="sm">
                    <FolderIcon className="size-3.5 me-1 text-gray-500" />
                    {product.category_name || t("common.uncategorized", "Tanpa Kategori")}
                  </Badge>

                  <Badge variant="light" color={stockBadgeVariant} size="sm">
                    {stockBadgeLabel}
                  </Badge>

                  <span
                    className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      isActive
                        ? "bg-success-50 text-success-600 dark:bg-success-500/15 dark:text-success-400"
                        : "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400"
                    }`}
                  >
                    <span
                      className={`size-1.5 rounded-full ${
                        isActive ? "bg-success-500" : "bg-gray-400"
                      }`}
                    />
                    {isActive
                      ? t("common.active", "Aktif")
                      : t("common.inactive", "Non-aktif")}
                  </span>
                </div>
              </div>
            </ComponentCard>
          </div>

          {/* Right Column: Key Details & Specifications */}
          <div className="lg:col-span-7 space-y-6">
            <ComponentCard
              title={t("products.detail.overview", "Informasi Utama")}
            >
              <div className="space-y-6">
                {/* Title & Product ID */}
                <div>
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5 text-xs text-gray-400 dark:text-gray-500">
                      <span>ID Produk:</span>
                      <code className="rounded bg-gray-100 px-2 py-0.5 font-mono text-xs text-gray-800 dark:bg-gray-800 dark:text-gray-200">
                        {product.id}
                      </code>
                      <button
                        type="button"
                        onClick={handleCopyId}
                        className="inline-flex size-6 items-center justify-center rounded text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-800 dark:hover:text-gray-200"
                        title={
                          isCopied
                            ? t("common.copied", "Tersalin!")
                            : t("common.copy", "Salin ID")
                        }
                      >
                        {isCopied ? (
                          <CheckSmIcon className="size-3.5 text-success-500" />
                        ) : (
                          <CopyIcon className="size-3.5" />
                        )}
                      </button>
                    </div>
                  </div>

                  <h1 className="mt-2 text-2xl font-bold text-gray-900 dark:text-white">
                    {product.name}
                  </h1>
                </div>

                {/* Price Display */}
                <div className="rounded-2xl border border-brand-100 bg-brand-50/40 p-4 dark:border-brand-900/30 dark:bg-brand-500/5">
                  <span className="text-xs font-medium uppercase tracking-wider text-brand-600 dark:text-brand-400">
                    {t("products.table.columns.price", "Harga Produk")}
                  </span>
                  <p className="mt-1 text-3xl font-extrabold text-brand-600 dark:text-brand-400">
                    {formatRupiah(product.price)}
                  </p>
                </div>

                {/* Specification Table */}
                <div className="divide-y divide-gray-100 dark:divide-gray-800 rounded-xl border border-gray-100 dark:border-gray-800 overflow-hidden">
                  <div className="flex items-center justify-between p-3.5 bg-gray-50/50 dark:bg-white/1">
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {t("products.table.columns.category", "Kategori")}
                    </span>
                    <span className="text-sm font-semibold text-gray-900 dark:text-white">
                      {product.category_name || "-"}
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-3.5">
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {t("products.detail.categoryId", "ID Kategori")}
                    </span>
                    <span className="text-sm font-mono text-gray-700 dark:text-gray-300">
                      {product.category_id ?? "-"}
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-3.5 bg-gray-50/50 dark:bg-white/1">
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {t("products.table.columns.stock", "Stok Tersedia")}
                    </span>
                    <span className="text-sm font-semibold text-gray-900 dark:text-white">
                      {stock} unit
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-3.5">
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {t("products.table.columns.status", "Status Etalase")}
                    </span>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {isActive
                        ? t("common.active", "Aktif (Dapat Dipesan)")
                        : t("common.inactive", "Non-aktif (Disembunyikan)")}
                    </span>
                  </div>

                  {product.created_at && (
                    <div className="flex items-center justify-between p-3.5 bg-gray-50/50 dark:bg-white/1">
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {t("products.detail.createdAt", "Waktu Ditambahkan")}
                      </span>
                      <span className="text-sm text-gray-700 dark:text-gray-300">
                        {formatDate(product.created_at, dateLocale)}
                      </span>
                    </div>
                  )}

                  {product.updated_at && (
                    <div className="flex items-center justify-between p-3.5">
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {t("products.detail.updatedAt", "Terakhir Diperbarui")}
                      </span>
                      <span className="text-sm text-gray-700 dark:text-gray-300">
                        {formatDate(product.updated_at, dateLocale)}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </ComponentCard>

            {/* Description Card */}
            <ComponentCard
              title={t("products.form.descriptionLabel", "Deskripsi Produk")}
            >
              {product.description?.trim() ? (
                <div className="text-sm leading-relaxed text-gray-700 dark:text-gray-300 whitespace-pre-line">
                  {product.description}
                </div>
              ) : (
                <p className="italic text-sm text-gray-400 dark:text-gray-500">
                  {t(
                    "products.detail.noDescription",
                    "Tidak ada deskripsi yang ditambahkan untuk produk ini.",
                  )}
                </p>
              )}
            </ComponentCard>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <DeleteProductModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        product={product}
        onSuccess={handleDeleteSuccess}
      />
    </>
  );
}
