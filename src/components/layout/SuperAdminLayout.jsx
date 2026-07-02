import { NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Store,
  CreditCard,
  TicketCheck,
  LogOut,
  Sparkles,
  Menu,
  X,
} from "lucide-react";
import { useState } from "react";
import { logout } from "../../services/auth";

const menuItems = [
  { name: "Dashboard", icon: LayoutDashboard, to: "/super-admin" },
  { name: "Stores", icon: Store, to: "/super-admin/stores" },
  { name: "Subscriptions", icon: CreditCard, to: "/super-admin/subscriptions" },
  { name: "Tickets", icon: TicketCheck, to: "/super-admin/tickets" },
];

const SuperAdminLayout = () => {
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-[#020717] text-slate-100 flex">
      {/* Mobile overlay */}
      {mobileOpen && (
        <button
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setMobileOpen(false)}
          type="button"
          aria-label="Close menu"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 z-50 h-screen w-64 transition-transform duration-300 lg:translate-x-0 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        } flex flex-col border-r border-amber-500/20 bg-slate-950/90 backdrop-blur-xl shadow-[0_0_40px_rgba(245,158,11,0.05)]`}
      >
        {/* Brand */}
        <div className="px-6 pt-7 pb-2">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-[#f59e0b] to-[#ef4444] shadow-[0_0_25px_rgba(245,158,11,0.4)]">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-sm font-bold tracking-[0.15em] uppercase text-white">
                Super Admin
              </p>
              <p className="text-[10px] uppercase tracking-widest text-amber-300/70">
                System Management
              </p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="mt-8 flex-1 px-4 space-y-1.5 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.name}
                to={item.to}
                end={item.to === "/super-admin"}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-300 ${
                    isActive
                      ? "bg-gradient-to-r from-amber-500/20 to-orange-500/10 text-amber-300 shadow-[0_0_20px_rgba(245,158,11,0.1)] ring-1 ring-amber-500/30"
                      : "text-slate-400 hover:bg-white/5 hover:text-slate-200"
                  }`
                }
                onClick={() => setMobileOpen(false)}
              >
                <Icon size={18} />
                <span>{item.name}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="px-4 pb-6 pt-4 border-t border-amber-500/10">
          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-red-400 transition-all duration-300 hover:bg-red-500/10 hover:text-red-300"
          >
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 lg:ml-64 min-h-screen">
        {/* Mobile header */}
        <div className="sticky top-0 z-30 flex items-center gap-3 px-4 py-3 border-b border-amber-500/10 bg-slate-950/80 backdrop-blur-xl lg:hidden">
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/5"
            type="button"
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
          <p className="text-sm font-bold tracking-wider uppercase text-white">
            Super Admin
          </p>
        </div>

        <main className="p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default SuperAdminLayout;
