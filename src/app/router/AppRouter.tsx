import React from "react";
import { Route, Routes } from "react-router";
import AppLayout from "@/layout/AppLayout";
import { ProtectedRoute, PublicRoute } from "./guards";

// Feature page imports
import { SignInPage, SignUpPage } from "@/features/auth";
import { EcommerceDashboardPage } from "@/features/dashboard";
import { OrdersPage, OrderDetailPage } from "@/features/orders";
import {
  ProductsPage,
  CreateProductPage,
  EditProductPage,
  ProductDetailPage,
} from "@/features/products";
import { CategoriesPage } from "@/features/categories";
import { CalendarPage } from "@/features/calendar";
import { UserProfilesPage } from "@/features/user-profile";
import { FormElementsPage } from "@/features/forms";
import { BasicTablesPage } from "@/features/tables";
import { BarChartPage, LineChartPage } from "@/features/charts";
import {
  AlertsPage,
  AvatarsPage,
  BadgesPage,
  ButtonsPage,
  ImagesPage,
  VideosPage,
} from "@/features/ui-elements";
import { BlankPage, NotFoundPage } from "@/features/other-pages";

export const AppRouter: React.FC = () => {
  return (
    <Routes>
      {/* Protected Dashboard Routes */}
      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          <Route index path="/" element={<EcommerceDashboardPage />} />

          {/* E-Commerce Core Routes */}
          <Route path="/orders" element={<OrdersPage />} />
          <Route path="/orders/:id" element={<OrderDetailPage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/products/create" element={<CreateProductPage />} />
          <Route path="/products/:id/edit" element={<EditProductPage />} />
          <Route path="/products/:id" element={<ProductDetailPage />} />
          <Route path="/categories" element={<CategoriesPage />} />

          {/* User Profile */}
          <Route path="/profile" element={<UserProfilesPage />} />

          {/* Calendar */}
          <Route path="/calendar" element={<CalendarPage />} />

          {/* Blank */}
          <Route path="/blank" element={<BlankPage />} />

          {/* Forms */}
          <Route path="/form-elements" element={<FormElementsPage />} />

          {/* Tables */}
          <Route path="/basic-tables" element={<BasicTablesPage />} />

          {/* UI Elements */}
          <Route path="/alerts" element={<AlertsPage />} />
          <Route path="/avatars" element={<AvatarsPage />} />
          <Route path="/badge" element={<BadgesPage />} />
          <Route path="/buttons" element={<ButtonsPage />} />
          <Route path="/images" element={<ImagesPage />} />
          <Route path="/videos" element={<VideosPage />} />

          {/* Charts */}
          <Route path="/line-chart" element={<LineChartPage />} />
          <Route path="/bar-chart" element={<BarChartPage />} />
        </Route>
      </Route>

      {/* Public Authentication Routes */}
      <Route element={<PublicRoute />}>
        <Route path="/signin" element={<SignInPage />} />
        <Route path="/signup" element={<SignUpPage />} />
      </Route>

      {/* Fallback Route */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default AppRouter;
