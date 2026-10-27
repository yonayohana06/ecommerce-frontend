import { useNavigate, useParams } from "react-router";
import { useTranslation } from "react-i18next";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import PageMeta from "@/components/common/PageMeta";
import ComponentCard from "@/components/common/ComponentCard";
import Alert from "@/components/ui/alert/Alert";
import Button from "@/components/ui/button/Button";
import { useProduct } from "../hooks/useProducts";
import ProductForm from "../components/ProductForm";

export default function EditProductPage() {
  const { t } = useTranslation();
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
            "Gagal memuat detail data produk.",
          )
        : null;

  const handleSuccess = (message: string) => {
    navigate("/products", {
      state: {
        notification: {
          type: "success",
          message,
        },
      },
    });
  };

  const handleCancel = () => {
    navigate("/products");
  };

  return (
    <>
      <PageMeta
        title={t(
          "products.meta.editTitle",
          "Ubah Produk | FastShop Admin",
        )}
        description={t(
          "products.meta.editDescription",
          "Perbarui data katalog, harga, stok, dan spesifikasi produk toko Anda",
        )}
      />
      <PageBreadcrumb
        pageTitle={t("products.actions.editProduct", "Ubah Produk")}
      />

      <div className="space-y-6">
        {isLoading ? (
          <ComponentCard
            title={t("products.form.editTitle", "Ubah Data Produk")}
          >
            <div className="space-y-4 animate-pulse p-4">
              <div className="h-4 w-48 rounded bg-gray-200 dark:bg-gray-800" />
              <div className="h-11 w-full rounded-lg bg-gray-200 dark:bg-gray-800" />
              <div className="h-4 w-36 rounded bg-gray-200 dark:bg-gray-800" />
              <div className="h-11 w-full rounded-lg bg-gray-200 dark:bg-gray-800" />
              <div className="h-32 w-full rounded-lg bg-gray-200 dark:bg-gray-800" />
            </div>
          </ComponentCard>
        ) : error || !product ? (
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
            >
              {t("products.actions.backToList", "Kembali ke Daftar Produk")}
            </Button>
          </div>
        ) : (
          <ComponentCard
            title={t("products.form.editTitle", "Ubah Data Produk")}
            desc={t(
              "products.form.editDesc",
              "Perbarui informasi, harga, stok, dan kategori produk",
            )}
          >
            <ProductForm
              product={product}
              onSuccess={handleSuccess}
              onCancel={handleCancel}
            />
          </ComponentCard>
        )}
      </div>
    </>
  );
}
