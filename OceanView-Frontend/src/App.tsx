import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "sonner";

import { useAuth } from "./utils/AuthContext";

// Layouts
import { AdminLayout } from "./components/layout/AdminLayout";
import { StaffLayout } from "./components/layout/StaffLayout";
import { CustomerLayout } from "./components/layout/CustomerLayout";

// Pages
import { Login } from "./pages/Login";
import { Register } from "./pages/Register";

// Admin Pages
import { AdminDashboard } from "./pages/admin/Dashboard";
import { UserManagement } from "./pages/admin/UserManagement";
import { ReservationManagement } from "./pages/admin/ReservationManagement";
import { Settings } from "./pages/admin/Settings";
import { RoomManagement } from "./pages/admin/RoomManagement";
import { AdminReports } from "./pages/admin/Reports";

// Staff Pages
import { StaffDashboard } from "./pages/staff/Dashboard";
import { NewReservation } from "./pages/staff/NewReservation";
import { ReservationSearch } from "./pages/staff/ReservationSearch";
import { Billing } from "./pages/staff/Billing";
import { StaffProfile } from "./pages/staff/Profile";
import { StaffHelp } from "./pages/staff/Help";

// Customer Pages
import { CustomerHome } from "./pages/customer/Home";
import { RoomDetail } from "./pages/customer/RoomDetail";
import { MyBookings } from "./pages/customer/MyBookings";
import { RoomSearch } from "./pages/customer/RoomSearch";
import Contact from "./pages/customer/contact";
import { SystemLogs } from "./pages/admin/SystemLogs";

function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white text-xl">
        Loading...
      </div>
    );
  }

  const ProtectedRoute = ({ children, roles }: { children: JSX.Element; roles: string[] }) => {
    if (!user) return <Navigate to="/login" replace />;
    if (!roles.includes(user.role)) return <Navigate to="/login" replace />;
    return children;
  };

  return (
    <BrowserRouter>
      <Toaster position="top-right" richColors />
      <Routes>
        <Route path="/" element={<Navigate to="/customer" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Admin Routes */}
        <Route
          path="/admin/*"
          element={
            <ProtectedRoute roles={['ADMIN']}>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="rooms" element={<RoomManagement />} />
          <Route path="users" element={<UserManagement />} />
          <Route path="reservations" element={<ReservationManagement />} />
         
          <Route path="logs" element={<SystemLogs />} />
          <Route path="settings" element={<Settings />} />
          <Route path="Reports" element={<AdminReports />} />
        </Route>

        {/* Staff Routes */}
        <Route
          path="/staff/*"
          element={
            <ProtectedRoute roles={['STAFF']}>
              <StaffLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/staff/dashboard" replace />} />
          <Route path="dashboard" element={<StaffDashboard />} />
          <Route path="new-reservation" element={<NewReservation />} />
          <Route path="search" element={<ReservationSearch />} />
          <Route path="billing" element={<Billing />} />
          <Route path="help" element={<StaffHelp />} />
          <Route path="profile" element={<StaffProfile />} />
        </Route>

        {/* Customer Routes */}
        <Route
          path="/customer/*"
          element={
            <ProtectedRoute roles={['CUSTOMER']}>
              <CustomerLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<CustomerHome />} />
          <Route path="rooms" element={<RoomSearch />} />
          <Route path="rooms/:id" element={<RoomDetail />} />
          <Route path="my-bookings" element={<MyBookings />} />
          <Route path="contact" element={<Contact />} />
        </Route>

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export { App };
