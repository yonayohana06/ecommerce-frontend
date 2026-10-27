import { Link } from "react-router";
import { useTranslation } from "react-i18next";
import { ListIcon, PlusIcon, TruckDelivery } from "@/icons";

export default function QuickActionsCard() {
  const { t } = useTranslation();

  const actions = [
    {
      title: t("ecommerce.quickActions.addProduct", "Tambah Produk"),
      description: t(
        "ecommerce.quickActions.addProductDesc",
        "Input katalog produk dan stok baru",
      ),
      href: "/products/create",
      icon: PlusIcon,
      color: "bg-brand-50 text-brand-600 dark:bg-brand-500/15 dark:text-brand-400",
    },
    {
      title: t("ecommerce.quickActions.manageOrders", "Kelola Pesanan"),
      description: t(
        "ecommerce.quickActions.manageOrdersDesc",
        "Cek pembayaran & update pengiriman",
      ),
      href: "/orders",
      icon: TruckDelivery,
      color: "bg-success-50 text-success-600 dark:bg-success-500/15 dark:text-success-400",
    },
    {
      title: t("ecommerce.quickActions.productCategories", "Kategori Produk"),
      description: t(
        "ecommerce.quickActions.productCategoriesDesc",
        "Atur struktur kategori etalase toko",
      ),
      href: "/categories",
      icon: ListIcon,
      color: "bg-blue-light-50 text-blue-light-600 dark:bg-blue-light-500/15 dark:text-blue-light-400",
    },
  ];

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 sm:p-6 dark:border-gray-800 dark:bg-white/3">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
          {t("ecommerce.quickActions.title", "Aksi Cepat")}
        </h3>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          {t(
            "ecommerce.quickActions.subtitle",
            "Pintasan operasional toko yang sering digunakan",
          )}
        </p>
      </div>

      <div className="flex flex-col gap-3">
        {actions.map((action) => {
          const Icon = action.icon;
          return (
            <Link
              key={action.href}
              to={action.href}
              className="group flex items-center gap-3.5 rounded-xl border border-gray-100 p-3 transition-colors hover:border-gray-200 hover:bg-gray-50 dark:border-gray-800 dark:hover:border-gray-700 dark:hover:bg-white/5"
            >
              <div
                className={`flex size-10 shrink-0 items-center justify-center rounded-lg transition-transform group-hover:scale-105 ${action.color}`}
              >
                <Icon className="size-5" />
              </div>

              <div className="flex flex-1 flex-col">
                <span className="text-sm font-semibold text-gray-800 group-hover:text-brand-500 dark:text-white/90 dark:group-hover:text-brand-400">
                  {action.title}
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {action.description}
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
