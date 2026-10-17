import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import PageMeta from "@/components/common/PageMeta";
import ComponentCard from "@/components/common/ComponentCard";
import { useTranslation } from "react-i18next";

export default function CreateProductPage() {
  const { t } = useTranslation();

  return (
    <>
      <PageMeta
        title="Add Product | FastShop Admin"
        description="Add a new product to inventory"
      />
      <PageBreadcrumb pageTitle={t("sidebar.items.addProduct", "Add Product")} />

      <div className="space-y-6">
        <ComponentCard title={t("sidebar.items.addProduct", "Add New Product")}>
          <div className="rounded-lg border border-dashed border-gray-300 p-8 text-center dark:border-gray-700">
            <p className="text-gray-500 dark:text-gray-400">
              Formulir Tambah Produk (Segera Diintegrasikan)
            </p>
          </div>
        </ComponentCard>
      </div>
    </>
  );
}
