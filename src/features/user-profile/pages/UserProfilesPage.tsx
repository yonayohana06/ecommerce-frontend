import { useTranslation } from "react-i18next";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import PageMeta from "@/components/common/PageMeta";
import UserMetaCard from "../components/UserMetaCard";
// Komponen berikut di-hide sementara karena belum tersedia endpoint API backend:
// import DangerZone from "../components/DangerZone";
// import Security from "../components/Security";
// import UserAddressCard from "../components/UserAddressCard";

export default function UserProfilesPage() {
  const { t } = useTranslation();

  return (
    <>
      <PageMeta
        title={t("profile.meta.title", "Profil | FastShop Admin")}
        description={t(
          "profile.meta.description",
          "Halaman profil administrator FastShop",
        )}
      />
      <PageBreadcrumb pageTitle={t("profile.title", "Profil")} />
      <div className="rounded-2xl border border-gray-200 bg-white p-5 lg:p-6 dark:border-gray-800 dark:bg-white/3">
        <h3 className="mb-5 text-lg font-semibold text-gray-800 lg:mb-7 dark:text-white/90">
          {t("profile.title", "Profil")}
        </h3>
        <div className="space-y-6">
          <UserMetaCard />
          {/* Komponen berikut di-hide sementara karena belum tersedia endpoint API backend: */}
          {/* <UserAddressCard /> */}
          {/* <Security /> */}
          {/* <DangerZone /> */}
        </div>
      </div>
    </>
  );
}
