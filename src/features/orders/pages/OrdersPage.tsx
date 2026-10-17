import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import PageMeta from "@/components/common/PageMeta";
import ComponentCard from "@/components/common/ComponentCard";
import { useTranslation } from "react-i18next";

export default function OrdersPage() {
  const { t } = useTranslation();

  return (
    <>
      <PageMeta
        title="Orders | FastShop Admin"
        description="Manage customer orders and transactions"
      />
      <PageBreadcrumb pageTitle={t("sidebar.items.orders", "Orders")} />

      <div className="space-y-6">
        <ComponentCard title={t("sidebar.items.orders", "Orders Management")}>
          <div className="rounded-lg border border-dashed border-gray-300 p-8 text-center dark:border-gray-700">
            <p className="text-gray-500 dark:text-gray-400">
              Daftar Pesanan Admin (Segera Diintegrasikan)
            </p>
          </div>
        </ComponentCard>
      </div>
    </>
  );
}
