import { Route, Routes } from "react-router-dom";
import MainLayout from "../components/layout/MainLayout";
import Login from "../pages/Auth/Login";
import Register from "../pages/Auth/Register";
import RequireAuth from "./RequireAuth";
import AuthRedirect from "./AuthRedirect";
import Dashboard from "../pages/Dashboard";
import Inventory from "../pages/Inventory";
import Billing from "../pages/Billing";
import Purchase from "../pages/Purchase";
import BillHistory from "../pages/BillHistory";
import Reports from "../pages/Reports";

const AppRoutes = () => (
  <Routes>
    <Route path="/login" element={<AuthRedirect><Login /></AuthRedirect>} />
    <Route path="/register" element={<AuthRedirect><Register /></AuthRedirect>} />
    <Route element={<RequireAuth><MainLayout /></RequireAuth>}>
      <Route path="/" element={<Dashboard />} />
      <Route path="/billing" element={<Billing />} />
      <Route path="/inventory" element={<Inventory />} />
      <Route path="/purchase" element={<Purchase />} />
      <Route path="/bill-history" element={<BillHistory />} />
      <Route path="/reports" element={<Reports />} />
    </Route>
  </Routes>
);

export default AppRoutes;
