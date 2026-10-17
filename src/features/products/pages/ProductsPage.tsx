import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import PageMeta from "@/components/common/PageMeta";
import ComponentCard from "@/components/common/ComponentCard";
import { useTranslation } from "react-i18next";

export default function ProductsPage() {
  const { t } = useTranslation();

  return (
    <>
      <PageMeta
        title="Products | FastShop Admin"
        description="Manage products, catalog, and inventory"
      />
      <PageBreadcrumb pageTitle={t("sidebar.items.products", "Products")} />

      <div className="space-y-6">
        <ComponentCard title={t("sidebar.items.productList", "Product List")}>
          <div className="rounded-lg border border-dashed border-gray-300 p-8 text-center dark:border-gray-700">
            <p className="text-gray-500 dark:text-gray-400">
              Daftar Produk Admin (Segera Diintegrasikan)
            </p>
          </div>
        </ComponentCard>
      </div>
    </>
  );
}
