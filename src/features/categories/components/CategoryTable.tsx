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
import { FolderIcon, PencilIcon, TrashBinIcon } from "@/icons";
import { formatDate } from "@/utils";
import type { Category } from "../types";

interface CategoryTableProps {
  categories: Category[];
  isLoading: boolean;
  searchKeyword: string;
  onEdit: (category: Category) => void;
  onDelete: (category: Category) => void;
  onClearSearch?: () => void;
}

export default function CategoryTable({
  categories,
  isLoading,
  searchKeyword,
  onEdit,
  onDelete,
  onClearSearch,
}: CategoryTableProps) {
  const { t, i18n } = useTranslation();
  const dateLocale = i18n.language === "en" ? "en-US" : "id-ID";

  if (isLoading) {
    return (
      <div className="flex-1 min-h-0 overflow-y-auto overflow-x-auto custom-scrollbar">
        <Table>
          <TableHeader className="sticky top-0 z-10 bg-gray-50/95 dark:bg-gray-800/95 backdrop-blur-xs border-b border-gray-100 dark:border-gray-800">
            <TableRow>
              <TableCell isHeader className="py-3 px-5 text-start">
                <div className="h-4 w-24 rounded bg-gray-200 dark:bg-gray-800 animate-pulse" />
              </TableCell>
              <TableCell isHeader className="py-3 px-5 text-start">
                <div className="h-4 w-16 rounded bg-gray-200 dark:bg-gray-800 animate-pulse" />
              </TableCell>
              <TableCell isHeader className="py-3 px-5 text-start">
                <div className="h-4 w-20 rounded bg-gray-200 dark:bg-gray-800 animate-pulse" />
              </TableCell>
              <TableCell isHeader className="py-3 px-5 text-start">
                <div className="h-4 w-24 rounded bg-gray-200 dark:bg-gray-800 animate-pulse" />
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
                    <div className="size-10 rounded-xl bg-gray-200 dark:bg-gray-800" />
                    <div className="h-4 w-32 rounded bg-gray-200 dark:bg-gray-800" />
                  </div>
                </TableCell>
                <TableCell className="py-4 px-5">
                  <div className="h-4 w-20 rounded bg-gray-200 dark:bg-gray-800" />
                </TableCell>
                <TableCell className="py-4 px-5">
                  <div className="h-6 w-16 rounded-full bg-gray-200 dark:bg-gray-800" />
                </TableCell>
                <TableCell className="py-4 px-5">
                  <div className="h-4 w-28 rounded bg-gray-200 dark:bg-gray-800" />
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

  if (categories.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
        <div className="flex size-14 items-center justify-center rounded-2xl bg-gray-100 text-gray-400 dark:bg-gray-800">
          <FolderIcon className="size-7" />
        </div>
        <h4 className="mt-4 text-base font-semibold text-gray-800 dark:text-white/90">
          {searchKeyword
            ? t("categories.table.emptySearch", {
              keyword: searchKeyword,
              defaultValue: `Tidak ada kategori yang cocok dengan "${searchKeyword}".`,
            })
            : t("categories.table.empty", "Belum ada kategori yang ditemukan.")}
        </h4>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 max-w-sm">
          {searchKeyword
            ? t(
              "categories.table.emptySearchDesc",
              "Coba gunakan kata kunci pencarian yang lain.",
            )
            : t(
              "categories.table.emptyDesc",
              "Klik tombol 'Tambah Kategori' di atas untuk membuat kategori baru.",
            )}
        </p>
        {searchKeyword && onClearSearch && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onClearSearch}
            className="mt-4"
          >
            {t("categories.search.resetSearch", "Reset Pencarian")}
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
              {t("categories.table.columns.category", "Kategori")}
            </TableCell>
            <TableCell
              isHeader
              className="py-3.5 px-5 text-start text-theme-xs font-semibold text-gray-500 dark:text-gray-400"
            >
              {t("categories.table.columns.slug", "Slug")}
            </TableCell>
            <TableCell
              isHeader
              className="py-3.5 px-5 text-start text-theme-xs font-semibold text-gray-500 dark:text-gray-400"
            >
              {t("categories.table.columns.productCount", "Jumlah Produk")}
            </TableCell>
            <TableCell
              isHeader
              className="py-3.5 px-5 text-start text-theme-xs font-semibold text-gray-500 dark:text-gray-400"
            >
              {t("categories.table.columns.createdAt", "Dibuat Pada")}
            </TableCell>
            <TableCell
              isHeader
              className="py-3.5 px-5 text-end text-theme-xs font-semibold text-gray-500 dark:text-gray-400"
            >
              {t("categories.table.columns.actions", "Aksi")}
            </TableCell>
          </TableRow>
        </TableHeader>

        <TableBody className="divide-y divide-gray-100 dark:divide-gray-800">
          {categories.map((category) => {
            const productCount = category.product_count ?? 0;

            return (
              <TableRow
                key={category.id}
                className="hover:bg-gray-50/60 dark:hover:bg-white/2 transition-colors"
              >
                {/* 1. Category Icon + Name */}
                <TableCell className="py-3.5 px-5">
                  <div className="flex items-center gap-3">
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300 overflow-hidden">
                      {category.icon_url ? (
                        <img
                          src={category.icon_url}
                          alt={category.name}
                          className="size-6 object-contain"
                          onError={(e) => {
                            (e.target as HTMLElement).style.display = "none";
                          }}
                        />
                      ) : (
                        <FolderIcon className="size-5 text-gray-400" />
                      )}
                    </div>
                    <div>
                      <p className="text-theme-sm font-semibold text-gray-800 dark:text-white/90">
                        {category.name}
                      </p>
                      <span className="text-theme-xs text-gray-400 dark:text-gray-500">
                        ID: #{category.id}
                      </span>
                    </div>
                  </div>
                </TableCell>

                {/* 2. Slug */}
                <TableCell className="py-3.5 px-5 text-theme-xs font-mono text-gray-600 dark:text-gray-400">
                  <span className="rounded-md bg-gray-100 px-2.5 py-1 text-gray-700 dark:bg-gray-800 dark:text-gray-300">
                    /{category.slug}
                  </span>
                </TableCell>

                {/* 3. Product Count Badge */}
                <TableCell className="py-3.5 px-5">
                  <Badge
                    size="sm"
                    color={productCount > 0 ? "info" : "light"}
                  >
                    {productCount}{" "}
                    {t("categories.table.productCountSuffix", "produk")}
                  </Badge>
                </TableCell>

                {/* 4. Created At */}
                <TableCell className="py-3.5 px-5 text-theme-xs text-gray-500 dark:text-gray-400">
                  {formatDate(category.created_at, dateLocale)}
                </TableCell>

                {/* 5. Actions */}
                <TableCell className="py-3.5 px-5 text-end">
                  <div className="flex items-center justify-end gap-1.5">
                    {/* Edit Button */}
                    <button
                      type="button"
                      onClick={() => onEdit(category)}
                      title={t("categories.actions.edit", "Ubah")}
                      className="flex size-8 items-center justify-center rounded-lg text-gray-500 transition-colors hover:bg-gray-100 hover:text-brand-500 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-brand-400"
                    >
                      <PencilIcon className="size-4" />
                    </button>

                    {/* Delete Button */}
                    <button
                      type="button"
                      onClick={() => onDelete(category)}
                      title={t("categories.actions.delete", "Hapus")}
                      className="flex size-8 items-center justify-center rounded-lg text-gray-500 transition-colors hover:bg-error-50 hover:text-error-600 dark:text-gray-400 dark:hover:bg-error-500/10 dark:hover:text-error-400"
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
