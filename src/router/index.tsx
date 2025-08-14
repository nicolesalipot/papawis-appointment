import { createBrowserRouter, Navigate, Outlet } from "react-router-dom";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { UnifiedLoginPage } from "@/pages/auth/UnifiedLoginPage";
import { DashboardPage } from "@/pages/dashboard/DashboardPage";
import { FacilitiesPage } from "@/pages/facilities/FacilitiesPage";
import { BookingsPageEnhanced } from "@/pages/bookings/BookingsPageEnhanced";
import { UsersPage } from "@/pages/users/UsersPage";
import { ReportsPage } from "@/pages/reports/ReportsPage";
import { SettingsPage } from "@/pages/settings/SettingsPage";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";

// Customer pages
import { CustomerRegisterPage } from "@/pages/customer/CustomerRegisterPage";
import { CustomerDashboardPage } from "@/pages/customer/CustomerDashboardPage";
import { CustomerBookingsPage } from "@/pages/customer/CustomerBookingsPage";
import { CustomerBookingPage } from "@/pages/customer/CustomerBookingPage";
import { CustomerBookingDetailPage } from "@/pages/customer/CustomerBookingDetailPage";
import { CustomerProfilePage } from "@/pages/customer/CustomerProfilePage";
import { CustomerFacilitiesPage } from "@/pages/customer/CustomerFacilitiesPage";

export const router = createBrowserRouter([
  {
    path: "/login",
    element: <UnifiedLoginPage />,
  },
  {
    path: "/register",
    element: <CustomerRegisterPage />,
  },
  {
    path: "/admin",
    element: (
      <ProtectedRoute allowedRoles={["super_admin", "facility_manager"]}>
        <AdminLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <Navigate to="/admin/dashboard" replace />,
      },
      {
        path: "dashboard",
        element: <DashboardPage />,
      },
      {
        path: "facilities",
        element: <FacilitiesPage />,
      },
      {
        path: "bookings",
        element: <BookingsPageEnhanced />,
      },
      {
        path: "users",
        element: <UsersPage />,
      },
      {
        path: "reports",
        element: <ReportsPage />,
      },
      {
        path: "settings",
        element: <SettingsPage />,
      },
    ],
  },
  {
    path: "/customer",
    element: (
      <ProtectedRoute allowedRoles={["member"]}>
        <Outlet />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <Navigate to="/customer/dashboard" replace />,
      },
      {
        path: "dashboard",
        element: <CustomerDashboardPage />,
      },
      {
        path: "bookings",
        element: <CustomerBookingsPage />,
      },
      {
        path: "bookings/:bookingId",
        element: <CustomerBookingDetailPage />,
      },
      {
        path: "book",
        element: <CustomerBookingPage />,
      },
      {
        path: "profile",
        element: <CustomerProfilePage />,
      },
      {
        path: "facilities",
        element: <CustomerFacilitiesPage />,
      },
    ],
  },
  {
    path: "/",
    element: <Navigate to="/login" replace />,
  },
]);
