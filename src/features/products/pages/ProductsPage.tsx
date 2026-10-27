import React, { useEffect, useState, useCallback, useMemo } from "react";
import { useLocation, useNavigate } from "react-router";
import { useTranslation } from "react-i18next";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import PageMeta from "@/components/common/PageMeta";
import Button from "@/components/ui/button/Button";
import Alert from "@/components/ui/alert/Alert";
import {
  ChevronDownIcon,
  ChevronLeftIcon,
  CloseIcon,
  PlusIcon,
  RegenerateIcon,
  SearchIcon,
} from "@/icons";
import categoryService from "@/features/categories/api/categoryService";
import type { Category } from "@/features/categories/types";
import { useProducts } from "../hooks/useProducts";
import type { Product, ProductFilterParams } from "../types";
import ProductTable from "../components/ProductTable";
import DeleteProductModal from "../components/DeleteProductModal";

interface LocationState {
  notification?: {
    type: "success" | "error";
    message: string;
  };
}

export default function ProductsPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();

  // Filter & Search states
  const [searchInput, setSearchInput] = useState<string>("");
  const [activeSearch, setActiveSearch] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const pageSize = 10;

  // Categories list for category filter dropdown
  const [categories, setCategories] = useState<Category[]>([]);

  // Flash notification state
  const [notification, setNotification] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(() => {
    const state = location.state as LocationState | null;
    return state?.notification ?? null;
  });

  // Delete modal state
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);

  // Auto-dismiss notification from navigation state
  useEffect(() => {
    if (notification) {
      window.history.replaceState({}, document.title);

      const timer = setTimeout(() => {
        setNotification(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  // Fetch categories once for the filter dropdown
  useEffect(() => {
    let isMounted = true;
    categoryService
      .getCategories()
      .then((res) => {
        if (isMounted) {
          setCategories(res.data || []);
        }
      })
      .catch(() => {
        // Silently catch category loading error in filter
      });

    return () => {
      isMounted = false;
    };
  }, []);

  // Memoized query params for TanStack Query
  const queryParams: ProductFilterParams = useMemo(
    () => ({
      search: activeSearch || undefined,
      category_id:
        selectedCategory !== "all" && selectedCategory !== ""
          ? selectedCategory
          : undefined,
      page: currentPage,
      limit: pageSize,
    }),
    [activeSearch, selectedCategory, currentPage, pageSize],
  );

  // TanStack Query manages caching, instant rehydration, and background updates
  const {
    data: productsResponse,
    isLoading,
    isFetching,
    error: queryError,
    refetch,
  } = useProducts(queryParams);

  const products = productsResponse?.data ?? [];
  const pagination = productsResponse?.pagination ?? null;

  // Traditional Search Handlers
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = searchInput.trim();
    if (trimmed !== activeSearch) {
      setActiveSearch(trimmed);
      setCurrentPage(1);
    }
  };

  const handleClearSearch = useCallback(() => {
    setSearchInput("");
    if (activeSearch !== "") {
      setActiveSearch("");
      setCurrentPage(1);
    }
  }, [activeSearch]);

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Escape") {
      handleClearSearch();
    }
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCategory(e.target.value);
    setCurrentPage(1);
  };

  const handleResetFilters = useCallback(() => {
    setSearchInput("");
    setActiveSearch("");
    setSelectedCategory("all");
    setCurrentPage(1);
  }, []);

  // Action handlers
  const handleViewProduct = (product: Product) => {
    navigate(`/products/${product.id}`);
  };

  const handleEditProduct = (product: Product) => {
    navigate(`/products/${product.id}/edit`);
  };

  const handleDeleteProduct = (product: Product) => {
    setProductToDelete(product);
    setIsDeleteModalOpen(true);
  };

  const handleActionSuccess = (message: string) => {
    setNotification({ type: "success", message });

    setTimeout(() => {
      setNotification((prev) => (prev?.message === message ? null : prev));
    }, 5000);
  };

  // Pagination navigation
  const handlePreviousPage = () => {
    if (pagination?.hasPreviousPage || currentPage > 1) {
      setCurrentPage((prev) => Math.max(1, prev - 1));
    }
  };

  const handleNextPage = () => {
    if (
      pagination?.hasNextPage ||
      (pagination?.totalPages && currentPage < pagination.totalPages)
    ) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const totalPages = pagination?.totalPages || 1;
  const totalItems = pagination?.totalItems ?? products.length;

  return (
    <>
      <PageMeta
        title={t("products.meta.title", "Katalog Produk | FastShop Admin")}
        description={t(
          "products.meta.description",
          "Kelola inventaris, harga, stok, dan etalase produk toko Anda",
        )}
      />

      <PageBreadcrumb pageTitle={t("products.title", "Daftar Produk")} />

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

        {/* API Query Error Banner */}
        {queryError && (
          <div className="shrink-0 mb-4">
            <Alert
              variant="error"
              title={t("common.error", "Gagal")}
              message={
                queryError instanceof Error
                  ? queryError.message
                  : t("products.errors.fetchFailed", "Gagal memuat daftar produk.")
              }
            />
          </div>
        )}

        {/* Maximized Main Card with internal table scrolling */}
        <div className="flex-1 min-h-0 flex flex-col rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/3 shadow-theme-xs overflow-hidden">
          {/* Card Header & Controls (Pinned at top of card) */}
          <div className="shrink-0 p-4 sm:p-5 border-b border-gray-100 dark:border-gray-800">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              {/* Title & Subtitle */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
                  {t("products.title", "Daftar Produk")}
                </h3>
                <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
                  {t(
                    "products.subtitle",
                    "Kelola inventaris produk, penetapan harga, stok, dan kategori",
                  )}
                </p>
              </div>

              {/* Controls: Category Filter, Search Bar, Refresh & Add Button */}
              <div className="flex flex-wrap items-center gap-3">
                {/* Category Filter Dropdown */}
                <div className="relative w-full sm:w-48">
                  <select
                    value={selectedCategory}
                    onChange={handleCategoryChange}
                    className="h-10 w-full appearance-none rounded-lg border border-gray-300 bg-transparent px-3 py-2 pe-9 text-xs sm:text-sm text-gray-800 shadow-theme-xs focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/20 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:focus:border-brand-800"
                  >
                    <option value="all" className="dark:bg-gray-900">
                      {t("products.filter.allCategories", "Semua Kategori")}
                    </option>
                    {categories.map((cat) => (
                      <option
                        key={cat.id}
                        value={cat.id}
                        className="dark:bg-gray-900"
                      >
                        {cat.name}
                      </option>
                    ))}
                  </select>
                  <span className="pointer-events-none absolute inset-y-0 inset-e-3 flex items-center text-gray-400">
                    <ChevronDownIcon className="size-4" />
                  </span>
                </div>

                {/* Search Form with Enter to Submit */}
                <form
                  onSubmit={handleSearchSubmit}
                  className="relative flex-1 sm:w-64"
                >
                  <span className="pointer-events-none absolute inset-y-0 inset-s-3 flex items-center text-gray-400">
                    <SearchIcon className="size-4.5" />
                  </span>
                  <input
                    type="text"
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    onKeyDown={handleSearchKeyDown}
                    placeholder={t(
                      "products.search.placeholder",
                      "Cari produk lalu tekan Enter...",
                    )}
                    className={`h-10 w-full rounded-lg border border-gray-300 bg-transparent ps-9 ${
                      searchInput ? "pe-9" : "pe-3"
                    } text-xs sm:text-sm text-gray-800 placeholder:text-gray-400 shadow-theme-xs focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/20 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800`}
                  />
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

                {/* Manual Refresh Button */}
                <button
                  type="button"
                  onClick={() => refetch()}
                  className="inline-flex size-10 shrink-0 items-center justify-center rounded-lg border border-gray-300 bg-white text-gray-500 shadow-theme-xs hover:bg-gray-50 hover:text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-white transition-colors"
                  title={t("common.refresh", "Muat Ulang Data")}
                  aria-label={t("common.refresh", "Muat Ulang Data")}
                >
                  <RegenerateIcon
                    className={`size-4.5 ${
                      isFetching ? "animate-spin text-brand-500" : ""
                    }`}
                  />
                </button>

                {/* Add Product Button: Icon-only on mobile (<sm), Icon + Text on sm+ */}
                <Button
                  type="button"
                  variant="primary"
                  size="sm"
                  onClick={() => navigate("/products/create")}
                  startIcon={<PlusIcon className="size-4.5" />}
                  className="shrink-0 size-10 p-0 sm:size-auto sm:h-10 sm:px-4"
                  title={t("products.actions.addProduct", "Tambah Produk")}
                  aria-label={t("products.actions.addProduct", "Tambah Produk")}
                >
                  <span className="hidden sm:inline">
                    {t("products.actions.addProduct", "Tambah Produk")}
                  </span>
                </Button>
              </div>
            </div>
          </div>

          {/* Table Container: Fills the remaining card height and scrolls internally */}
          <ProductTable
            products={products}
            isLoading={isLoading}
            searchKeyword={activeSearch}
            selectedCategory={selectedCategory}
            onView={handleViewProduct}
            onEdit={handleEditProduct}
            onDelete={handleDeleteProduct}
            onClearFilters={handleResetFilters}
          />

          {/* Card Footer: Pagination & Summary */}
          {!isLoading && products.length > 0 && (
            <div className="shrink-0 px-5 py-3 border-t border-gray-100 bg-gray-50/50 dark:border-gray-800 dark:bg-white/1 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-500 dark:text-gray-400">
              <span>
                {t("products.table.showingSummary", {
                  from: (currentPage - 1) * pageSize + 1,
                  to: Math.min(currentPage * pageSize, totalItems),
                  total: totalItems,
                  defaultValue: `Menampilkan ${
                    (currentPage - 1) * pageSize + 1
                  }-${Math.min(
                    currentPage * pageSize,
                    totalItems,
                  )} dari ${totalItems} produk`,
                })}
              </span>

              {/* Pagination controls */}
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handlePreviousPage}
                  disabled={currentPage <= 1}
                  className="h-8 px-2.5 text-xs"
                  aria-label={t("common.previous", "Sebelumnya")}
                >
                  <ChevronLeftIcon className="size-4 rtl:rotate-180" />
                  <span className="hidden sm:inline ms-1">
                    {t("common.previous", "Sebelumnya")}
                  </span>
                </Button>

                <span className="px-2 text-xs font-medium text-gray-700 dark:text-gray-300">
                  {t("products.table.pageIndicator", {
                    current: currentPage,
                    total: totalPages,
                    defaultValue: `Hal ${currentPage} / ${totalPages}`,
                  })}
                </span>

                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleNextPage}
                  disabled={currentPage >= totalPages}
                  className="h-8 px-2.5 text-xs"
                  aria-label={t("common.next", "Berikutnya")}
                >
                  <span className="hidden sm:inline me-1">
                    {t("common.next", "Berikutnya")}
                  </span>
                  <ChevronLeftIcon className="size-4 rotate-180 rtl:rotate-0" />
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modal Confirmation Delete Product */}
      <DeleteProductModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        product={productToDelete}
        onSuccess={handleActionSuccess}
      />
    </>
  );
}
