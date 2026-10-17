import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import PageMeta from "@/components/common/PageMeta";
import ComponentCard from "@/components/common/ComponentCard";
import { useTranslation } from "react-i18next";

export default function CategoriesPage() {
  const { t } = useTranslation();

  return (
    <>
      <PageMeta
        title="Categories | FastShop Admin"
        description="Manage product categories and taxonomy"
      />
      <PageBreadcrumb pageTitle={t("sidebar.items.categories", "Categories")} />

      <div className="space-y-6">
        <ComponentCard title={t("sidebar.items.categories", "Categories Management")}>
          <div className="rounded-lg border border-dashed border-gray-300 p-8 text-center dark:border-gray-700">
            <p className="text-gray-500 dark:text-gray-400">
              Daftar Kategori Produk (Segera Diintegrasikan)
            </p>
          </div>
        </ComponentCard>
      </div>
    </>
  );
}
