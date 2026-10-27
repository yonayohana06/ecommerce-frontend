import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import PageMeta from "@/components/common/PageMeta";
import BarChartOne from "../components/bar/BarChartOne";

export default function BarChartPage() {
  return (
    <div>
      <PageMeta
        title="Bar Chart | FastShop Admin"
        description="Bar Chart page for FastShop Admin Dashboard"
      />
      <PageBreadcrumb pageTitle="Bar Chart" />
      <div className="space-y-6">
        <ComponentCard title="Bar Chart 1">
          <BarChartOne />
        </ComponentCard>
      </div>
    </div>
  );
}
