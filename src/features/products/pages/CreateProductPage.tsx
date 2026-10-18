import { useNavigate } from "react-router";
import { useTranslation } from "react-i18next";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import PageMeta from "@/components/common/PageMeta";
import ComponentCard from "@/components/common/ComponentCard";
import ProductForm from "../components/ProductForm";

export default function CreateProductPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();

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
        title={t("products.meta.createTitle", "Tambah Produk | FastShop Admin")}
        description={t(
          "products.meta.createDescription",
          "Tambah produk baru ke dalam katalog dan inventaris etalase toko Anda",
        )}
      />
      <PageBreadcrumb
        pageTitle={t("products.actions.addProduct", "Tambah Produk")}
      />

      <div className="space-y-6">
        <ComponentCard
          title={t("products.form.createTitle", "Tambah Produk Baru")}
          desc={t(
            "products.form.createDesc",
            "Lengkapi formulir berikut untuk mendaftarkan produk baru ke katalog",
          )}
        >
          <ProductForm onSuccess={handleSuccess} onCancel={handleCancel} />
        </ComponentCard>
      </div>
    </>
  );
}
