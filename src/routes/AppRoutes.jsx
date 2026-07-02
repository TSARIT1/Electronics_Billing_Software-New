import { Route, Routes } from "react-router-dom";
import MainLayout from "../components/layout/MainLayout";
import Login from "../pages/Auth/Login";
import SuperAdminLogin from "../pages/Auth/SuperAdminLogin";
import Register from "../pages/Auth/Register";
import Landing from "../pages/Landing";
import RequireAuth from "./RequireAuth";
import Dashboard from "../pages/Dashboard";
import Inventory from "../pages/Inventory";
import Billing from "../pages/Billing";
import Purchase from "../pages/Purchase";
import BillHistory from "../pages/BillHistory";
import Reports from "../pages/Reports";
import SalesReport from "../pages/Reports/modules/SalesReport";
import InventoryReport from "../pages/Reports/modules/InventoryReport";
import PurchaseReport from "../pages/Reports/modules/PurchaseReport";
import ProfitLossReport from "../pages/Reports/modules/ProfitLossReport";
import GSTReport from "../pages/Reports/modules/GSTReport";
import CustomerReport from "../pages/Reports/modules/CustomerReport";
import Notifications from "../pages/Notifications";
import Users from "../pages/Users";
import Subscription from "../pages/Subscription";

import Storefront from "../pages/Storefront";

import SuperAdminLayout from "../components/layout/SuperAdminLayout";
import RequireSuperAdmin from "./RequireSuperAdmin";
import SADashboard from "../pages/SuperAdmin/SADashboard";
import SAStores from "../pages/SuperAdmin/SAStores";
import SASubscriptions from "../pages/SuperAdmin/SASubscriptions";
import SATickets from "../pages/SuperAdmin/SATickets";

const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<Landing />} />
    <Route path="/login" element={<Login />} />
    <Route path="/register" element={<Register />} />
    <Route path="/super-admin-login" element={<SuperAdminLogin />} />
    
    <Route path="/super-admin" element={<RequireSuperAdmin><SuperAdminLayout /></RequireSuperAdmin>}>
      <Route index element={<SADashboard />} />
      <Route path="stores" element={<SAStores />} />
      <Route path="subscriptions" element={<SASubscriptions />} />
      <Route path="tickets" element={<SATickets />} />
    </Route>

    <Route element={<RequireAuth><MainLayout /></RequireAuth>}>
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/billing" element={<Billing />} />
      <Route path="/inventory" element={<Inventory />} />
      <Route path="/purchase" element={<Purchase />} />
      <Route path="/bill-history" element={<BillHistory />} />
      <Route path="/reports" element={<Reports />} />
      <Route path="/reports/sales" element={<SalesReport />} />
      <Route path="/reports/inventory" element={<InventoryReport />} />
      <Route path="/reports/purchase" element={<PurchaseReport />} />
      <Route path="/reports/profit-loss" element={<ProfitLossReport />} />
      <Route path="/reports/gst" element={<GSTReport />} />
      <Route path="/reports/customer" element={<CustomerReport />} />
      <Route path="/notifications" element={<Notifications />} />
      <Route path="/users" element={<Users />} />
      <Route path="/subscription" element={<Subscription />} />
    </Route>
    <Route path="/store" element={<RequireAuth><Storefront /></RequireAuth>} />
  </Routes>
);

export default AppRoutes;
