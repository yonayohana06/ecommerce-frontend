import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import PageMeta from "@/components/common/PageMeta";
import BasicTableOne from "../components/BasicTableOne";

export default function BasicTablesPage() {
  return (
    <>
      <PageMeta
        title="Basic Tables | FastShop Admin"
        description="Basic Tables page for FastShop Admin Dashboard"
      />
      <PageBreadcrumb pageTitle="Basic Tables" />
      <div className="space-y-6">
        <ComponentCard title="Basic Table 1">
          <BasicTableOne />
        </ComponentCard>
      </div>
    </>
  );
}
