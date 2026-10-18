import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Badge from "@/components/ui/badge/Badge";
import Button from "@/components/ui/button/Button";
import { BoxIcon, EyeIcon, PencilIcon, TrashBinIcon } from "@/icons";
import { formatRupiah } from "@/utils";
import type { Product } from "../types";

interface ProductTableProps {
  products: Product[];
  isLoading: boolean;
  searchKeyword: string;
  selectedCategory: string;
  onView?: (product: Product) => void;
  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
  onClearFilters?: () => void;
}

export default function ProductTable({
  products,
  isLoading,
  searchKeyword,
  selectedCategory,
  onView,
  onEdit,
  onDelete,
  onClearFilters,
}: ProductTableProps) {
  const { t } = useTranslation();
  const [brokenImages, setBrokenImages] = useState<Record<string, boolean>>({});

  const handleImageError = (id: string) => {
    setBrokenImages((prev) => ({ ...prev, [id]: true }));
  };

  const isFiltered = Boolean(searchKeyword || (selectedCategory && selectedCategory !== "all"));

  if (isLoading) {
    return (
      <div className="flex-1 min-h-0 overflow-y-auto overflow-x-auto custom-scrollbar">
        <Table>
          <TableHeader className="sticky top-0 z-10 bg-gray-50/95 dark:bg-gray-800/95 backdrop-blur-xs border-b border-gray-100 dark:border-gray-800">
            <TableRow>
              <TableCell isHeader className="py-3 px-5 text-start">
                <div className="h-4 w-28 rounded bg-gray-200 dark:bg-gray-800 animate-pulse" />
              </TableCell>
              <TableCell isHeader className="py-3 px-5 text-start">
                <div className="h-4 w-20 rounded bg-gray-200 dark:bg-gray-800 animate-pulse" />
              </TableCell>
              <TableCell isHeader className="py-3 px-5 text-start">
                <div className="h-4 w-20 rounded bg-gray-200 dark:bg-gray-800 animate-pulse" />
              </TableCell>
              <TableCell isHeader className="py-3 px-5 text-start">
                <div className="h-4 w-16 rounded bg-gray-200 dark:bg-gray-800 animate-pulse" />
              </TableCell>
              <TableCell isHeader className="py-3 px-5 text-start">
                <div className="h-4 w-16 rounded bg-gray-200 dark:bg-gray-800 animate-pulse" />
              </TableCell>
              <TableCell isHeader className="py-3 px-5 text-end">
                <div className="ms-auto h-4 w-16 rounded bg-gray-200 dark:bg-gray-800 animate-pulse" />
              </TableCell>
            </TableRow>
          </TableHeader>
          <TableBody className="divide-y divide-gray-100 dark:divide-gray-800">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <TableRow key={i} className="animate-pulse">
                <TableCell className="py-4 px-5">
                  <div className="flex items-center gap-3">
                    <div className="size-11 rounded-xl bg-gray-200 dark:bg-gray-800" />
                    <div className="space-y-1.5">
                      <div className="h-4 w-40 rounded bg-gray-200 dark:bg-gray-800" />
                      <div className="h-3 w-24 rounded bg-gray-200 dark:bg-gray-800" />
                    </div>
                  </div>
                </TableCell>
                <TableCell className="py-4 px-5">
                  <div className="h-6 w-20 rounded-full bg-gray-200 dark:bg-gray-800" />
                </TableCell>
                <TableCell className="py-4 px-5">
                  <div className="h-4 w-24 rounded bg-gray-200 dark:bg-gray-800" />
                </TableCell>
                <TableCell className="py-4 px-5">
                  <div className="h-6 w-20 rounded-full bg-gray-200 dark:bg-gray-800" />
                </TableCell>
                <TableCell className="py-4 px-5">
                  <div className="h-5 w-16 rounded-full bg-gray-200 dark:bg-gray-800" />
                </TableCell>
                <TableCell className="py-4 px-5 text-end">
                  <div className="ms-auto flex items-center justify-end gap-2">
                    <div className="size-8 rounded-lg bg-gray-200 dark:bg-gray-800" />
                    <div className="size-8 rounded-lg bg-gray-200 dark:bg-gray-800" />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
        <div className="flex size-14 items-center justify-center rounded-2xl bg-gray-100 text-gray-400 dark:bg-gray-800">
          <BoxIcon className="size-7" />
        </div>
        <h4 className="mt-4 text-base font-semibold text-gray-800 dark:text-white/90">
          {isFiltered
            ? t(
                "products.table.emptyFiltered",
                "Tidak ada produk yang cocok dengan kriteria pencarian/filter.",
              )
            : t("products.table.empty", "Belum ada produk yang ditemukan.")}
        </h4>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 max-w-sm">
          {isFiltered
            ? t(
                "products.table.emptyFilteredDesc",
                "Coba gunakan kata kunci lain atau ubah filter kategori.",
              )
            : t(
                "products.table.emptyDesc",
                "Klik tombol 'Tambah Produk' untuk membuat produk pertama Anda.",
              )}
        </p>
        {isFiltered && onClearFilters && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onClearFilters}
            className="mt-4"
          >
            {t("products.search.resetFilters", "Reset Pencarian & Filter")}
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className="flex-1 min-h-0 overflow-y-auto overflow-x-auto custom-scrollbar">
      <Table>
        <TableHeader className="sticky top-0 z-10 bg-gray-50/95 dark:bg-gray-800/95 backdrop-blur-xs border-b border-gray-100 dark:border-gray-800">
          <TableRow>
            <TableCell
              isHeader
              className="py-3.5 px-5 text-start text-theme-xs font-semibold text-gray-500 dark:text-gray-400"
            >
              {t("products.table.columns.product", "Produk")}
            </TableCell>
            <TableCell
              isHeader
              className="py-3.5 px-5 text-start text-theme-xs font-semibold text-gray-500 dark:text-gray-400"
            >
              {t("products.table.columns.category", "Kategori")}
            </TableCell>
            <TableCell
              isHeader
              className="py-3.5 px-5 text-start text-theme-xs font-semibold text-gray-500 dark:text-gray-400"
            >
              {t("products.table.columns.price", "Harga")}
            </TableCell>
            <TableCell
              isHeader
              className="py-3.5 px-5 text-start text-theme-xs font-semibold text-gray-500 dark:text-gray-400"
            >
              {t("products.table.columns.stock", "Stok")}
            </TableCell>
            <TableCell
              isHeader
              className="py-3.5 px-5 text-start text-theme-xs font-semibold text-gray-500 dark:text-gray-400"
            >
              {t("products.table.columns.status", "Status")}
            </TableCell>
            <TableCell
              isHeader
              className="py-3.5 px-5 text-end text-theme-xs font-semibold text-gray-500 dark:text-gray-400"
            >
              {t("products.table.columns.actions", "Aksi")}
            </TableCell>
          </TableRow>
        </TableHeader>

        <TableBody className="divide-y divide-gray-100 dark:divide-gray-800">
          {products.map((product) => {
            const hasImage = Boolean(
              product.image_url && !brokenImages[product.id],
            );
            const stock = Number(product.stock) || 0;

            // Stock badge logic
            let stockBadgeVariant: "success" | "warning" | "error" = "success";
            let stockBadgeLabel = `${stock} unit`;
            if (stock === 0) {
              stockBadgeVariant = "error";
              stockBadgeLabel = t("products.stock.outOfStock", "Habis");
            } else if (stock <= 10) {
              stockBadgeVariant = "warning";
              stockBadgeLabel = `${stock} unit (${t("products.stock.low", "Menipis")})`;
            }

            const isActive = product.is_active !== false;

            return (
              <TableRow
                key={product.id}
                className="hover:bg-gray-50/75 dark:hover:bg-white/2 transition-colors"
              >
                {/* Product Name & Image */}
                <TableCell className="py-3.5 px-5">
                  <div className="flex items-center gap-3">
                    <div className="size-11 shrink-0 overflow-hidden rounded-xl border border-gray-200 bg-gray-50 flex items-center justify-center dark:border-gray-800 dark:bg-gray-900">
                      {hasImage ? (
                        <img
                          src={product.image_url!}
                          alt={product.name}
                          onError={() => handleImageError(product.id)}
                          className="size-full object-cover"
                        />
                      ) : (
                        <BoxIcon className="size-5 text-gray-400" />
                      )}
                    </div>
                    <div className="min-w-0 max-w-xs sm:max-w-sm">
                      {onView ? (
                        <button
                          type="button"
                          onClick={() => onView(product)}
                          className="truncate text-start text-sm font-medium text-gray-800 hover:text-brand-600 dark:text-white/90 dark:hover:text-brand-400 transition-colors block max-w-full"
                        >
                          {product.name}
                        </button>
                      ) : (
                        <p className="truncate text-sm font-medium text-gray-800 dark:text-white/90">
                          {product.name}
                        </p>
                      )}
                      {product.description && (
                        <p className="truncate text-xs text-gray-400 dark:text-gray-500">
                          {product.description}
                        </p>
                      )}
                    </div>
                  </div>
                </TableCell>

                {/* Category */}
                <TableCell className="py-3.5 px-5 whitespace-nowrap">
                  <Badge variant="light" color="light" size="sm">
                    {product.category_name || t("common.uncategorized", "Tanpa Kategori")}
                  </Badge>
                </TableCell>

                {/* Price */}
                <TableCell className="py-3.5 px-5 whitespace-nowrap text-sm font-semibold text-gray-800 dark:text-white/90">
                  {formatRupiah(product.price)}
                </TableCell>

                {/* Stock */}
                <TableCell className="py-3.5 px-5 whitespace-nowrap">
                  <Badge variant="light" color={stockBadgeVariant} size="sm">
                    {stockBadgeLabel}
                  </Badge>
                </TableCell>

                {/* Status */}
                <TableCell className="py-3.5 px-5 whitespace-nowrap">
                  <span
                    className={`inline-flex items-center gap-1.5 text-xs font-medium ${
                      isActive
                        ? "text-success-600 dark:text-success-400"
                        : "text-gray-400 dark:text-gray-500"
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
                </TableCell>

                {/* Actions */}
                <TableCell className="py-3.5 px-5 text-end whitespace-nowrap">
                  <div className="flex items-center justify-end gap-1.5">
                    {onView && (
                      <button
                        type="button"
                        onClick={() => onView(product)}
                        className="inline-flex size-8 items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100 hover:text-brand-600 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-brand-400 transition-colors"
                        title={t("products.actions.viewDetail", "Lihat Detail")}
                        aria-label={t("products.actions.viewDetail", "Lihat Detail")}
                      >
                        <EyeIcon className="size-4" />
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => onEdit(product)}
                      className="inline-flex size-8 items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100 hover:text-brand-600 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-brand-400 transition-colors"
                      title={t("products.actions.edit", "Ubah Produk")}
                      aria-label={t("products.actions.edit", "Ubah Produk")}
                    >
                      <PencilIcon className="size-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => onDelete(product)}
                      className="inline-flex size-8 items-center justify-center rounded-lg text-gray-500 hover:bg-error-50 hover:text-error-600 dark:text-gray-400 dark:hover:bg-error-500/10 dark:hover:text-error-400 transition-colors"
                      title={t("products.actions.delete", "Hapus Produk")}
                      aria-label={t("products.actions.delete", "Hapus Produk")}
                    >
                      <TrashBinIcon className="size-4" />
                    </button>
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
