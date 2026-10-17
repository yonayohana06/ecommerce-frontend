import PageMeta from "@/components/common/PageMeta";
import EcommerceMetrics from "../components/EcommerceMetrics";
import RecentOrders from "../components/RecentOrders";
import OrderStatusChart from "../components/OrderStatusChart";
import QuickActionsCard from "../components/QuickActionsCard";

export default function EcommerceDashboardPage() {
  return (
    <>
      <PageMeta
        title="FastShop Admin Dashboard"
        description="FastShop Ecommerce Admin Dashboard Overview"
      />

      <div className="space-y-6">
        {/* 1. Baris Metrik Utama: 4 Kartu Ringkasan Riil */}
        <EcommerceMetrics />

        {/* 2. Baris Utama: Tabel Pesanan Terbaru & Analisis Status Pesanan */}
        <div className="grid grid-cols-12 gap-4 md:gap-6">
          {/* Kolom Kiri: Tabel 5 Pesanan Terbaru */}
          <div className="col-span-12 xl:col-span-7">
            <RecentOrders />
          </div>

          {/* Kolom Kanan: Chart Status Pesanan & Pintasan Aksi Cepat */}
          <div className="col-span-12 space-y-6 xl:col-span-5">
            <OrderStatusChart />
            <QuickActionsCard />
          </div>
        </div>
      </div>
    </>
  );
}
