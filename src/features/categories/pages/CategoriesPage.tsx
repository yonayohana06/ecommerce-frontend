import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { useTranslation } from "react-i18next";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import PageMeta from "@/components/common/PageMeta";
import Button from "@/components/ui/button/Button";
import Alert from "@/components/ui/alert/Alert";
import { CloseIcon, PlusIcon, SearchIcon } from "@/icons";
import categoryService from "../api/categoryService";
import type { Category } from "../types";
import CategoryTable from "../components/CategoryTable";
import CategoryModal from "../components/CategoryModal";
import DeleteCategoryModal from "../components/DeleteCategoryModal";

export default function CategoriesPage() {
  const { t } = useTranslation();

  const [categories, setCategories] = useState<Category[]>([]);
  // Draft input value typed by user
  const [searchInput, setSearchInput] = useState<string>("");
  // Active search query applied after user presses Enter
  const [activeSearch, setActiveSearch] = useState<string>("");

  // Tracks the last loaded query & refresh key for derived loading state
  const [lastLoaded, setLastLoaded] = useState<{
    query: string;
    key: number;
  } | null>(null);

  const [notification, setNotification] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  // Modal states
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null,
  );

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(
    null,
  );

  const [refreshKey, setRefreshKey] = useState(0);

  // Derived loading state: true during initial load, search query submit, or refresh
  const isLoading =
    lastLoaded === null ||
    lastLoaded.query !== activeSearch ||
    lastLoaded.key !== refreshKey;

  // Unified fetch with AbortController for race condition & stale request prevention
  useEffect(() => {
    const controller = new AbortController();

    categoryService
      .getCategories(activeSearch, { signal: controller.signal })
      .then((res) => {
        setCategories(res.data || []);
        setLastLoaded({
          query: activeSearch,
          key: refreshKey,
        });
      })
      .catch((err: unknown) => {
        // Silently ignore aborted/cancelled requests
        if (
          axios.isCancel(err) ||
          (err instanceof Error &&
            (err.name === "CanceledError" || err.name === "AbortError"))
        ) {
          return;
        }

        const msg =
          err instanceof Error
            ? err.message
            : t("categories.errors.fetchFailed", "Gagal memuat daftar kategori.");
        setNotification({ type: "error", message: msg });
        setLastLoaded({
          query: activeSearch,
          key: refreshKey,
        });
      });

    return () => {
      controller.abort();
    };
  }, [activeSearch, refreshKey, t]);

  // Form submit on Enter (traditional search)
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = searchInput.trim();
    if (trimmed !== activeSearch) {
      setActiveSearch(trimmed);
    }
  };

  // Clear search on X button or Esc
  const handleClearSearch = useCallback(() => {
    setSearchInput("");
    if (activeSearch !== "") {
      setActiveSearch("");
    }
  }, [activeSearch]);

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Escape") {
      handleClearSearch();
    }
  };

  const handleOpenCreateModal = () => {
    setSelectedCategory(null);
    setIsFormModalOpen(true);
  };

  const handleOpenEditModal = (cat: Category) => {
    setSelectedCategory(cat);
    setIsFormModalOpen(true);
  };

  const handleOpenDeleteModal = (cat: Category) => {
    setCategoryToDelete(cat);
    setIsDeleteModalOpen(true);
  };

  const handleActionSuccess = (message: string) => {
    setNotification({ type: "success", message });
    setRefreshKey((prev) => prev + 1);

    // Auto-dismiss notification after 5 seconds
    setTimeout(() => {
      setNotification((prev) => (prev?.message === message ? null : prev));
    }, 5000);
  };

  return (
    <>
      <PageMeta
        title={t("categories.meta.title", "Kategori Produk | FastShop Admin")}
        description={t(
          "categories.meta.description",
          "Kelola taksonomi dan kategori katalog produk toko Anda",
        )}
      />

      <PageBreadcrumb
        pageTitle={t("categories.title", "Kategori Produk")}
      />

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

        {/* Maximized Main Card with internal table scrolling */}
        <div className="flex-1 min-h-0 flex flex-col rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/3 shadow-theme-xs overflow-hidden">
          {/* Card Header & Controls (Pinned at top of card) */}
          <div className="shrink-0 p-4 sm:p-5 border-b border-gray-100 dark:border-gray-800">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              {/* Title & Subtitle */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
                  {t("categories.title", "Kategori Produk")}
                </h3>
                <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
                  {t(
                    "categories.subtitle",
                    "Kelola taksonomi, struktur etalase, dan ikon kategori produk",
                  )}
                </p>
              </div>

              {/* Controls: Search Bar & Add Button */}
              <div className="flex items-center gap-3">
                {/* Search Form with Enter to Submit */}
                <form
                  onSubmit={handleSearchSubmit}
                  className="relative w-full sm:w-72"
                >
                  <span className="pointer-events-none absolute inset-y-0 inset-s-3 flex items-center text-gray-400">
                    <SearchIcon className="size-5" />
                  </span>
                  <input
                    type="text"
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    onKeyDown={handleSearchKeyDown}
                    placeholder={t(
                      "categories.search.placeholder",
                      "Cari kategori lalu tekan Enter...",
                    )}
                    className={`h-10 w-full rounded-lg border border-gray-300 bg-transparent ps-10 ${searchInput ? "pe-9" : "pe-4"
                      } text-sm text-gray-800 placeholder:text-gray-400 shadow-theme-xs focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/20 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800`}
                  />
                  {/* Clear Button */}
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

                {/* Add Category Button: Icon-only on mobile (<sm), Icon + Text on sm+ */}
                <Button
                  type="button"
                  variant="primary"
                  size="sm"
                  onClick={handleOpenCreateModal}
                  startIcon={<PlusIcon className="size-4.5" />}
                  className="shrink-0 size-10 p-0 sm:size-auto sm:h-10 sm:px-4"
                  title={t("categories.actions.addCategory", "Tambah Kategori")}
                  aria-label={t(
                    "categories.actions.addCategory",
                    "Tambah Kategori",
                  )}
                >
                  <span className="hidden sm:inline">
                    {t("categories.actions.addCategory", "Tambah Kategori")}
                  </span>
                </Button>
              </div>
            </div>
          </div>

          {/* Table Container: Fills the remaining card height and scrolls internally */}
          <CategoryTable
            categories={categories}
            isLoading={isLoading}
            searchKeyword={activeSearch}
            onEdit={handleOpenEditModal}
            onDelete={handleOpenDeleteModal}
            onClearSearch={handleClearSearch}
          />

          {/* Card Footer: Summary Count */}
          {!isLoading && categories.length > 0 && (
            <div className="shrink-0 px-5 py-3 border-t border-gray-100 bg-gray-50/50 dark:border-gray-800 dark:bg-white/1 flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
              <span>
                {t("categories.table.showingCount", {
                  count: categories.length,
                  defaultValue: `Menampilkan ${categories.length} kategori`,
                })}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Modal Create & Edit Category */}
      <CategoryModal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        category={selectedCategory}
        onSuccess={handleActionSuccess}
      />

      {/* Modal Confirmation Delete Category */}
      <DeleteCategoryModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        category={categoryToDelete}
        onSuccess={handleActionSuccess}
      />
    </>
  );
}
