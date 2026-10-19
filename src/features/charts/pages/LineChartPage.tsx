import LineChartOne from "../components/line/LineChartOne";
import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import PageMeta from "@/components/common/PageMeta";

export default function LineChartPage() {
  return (
    <div>
      <PageMeta
        title="Line Chart | FastShop Admin"
        description="Line Chart page for FastShop Admin Dashboard"
      />
      <PageBreadcrumb pageTitle="Line Chart" />
      <div className="space-y-6">
        <ComponentCard title="Line Chart 1">
          <LineChartOne />
        </ComponentCard>
      </div>
    </div>
  );
}
