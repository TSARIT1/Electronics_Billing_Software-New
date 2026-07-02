import {
  BarChart3,
  Boxes,
  LayoutDashboard,
  LogOut,
  BellRing,
  ReceiptText,
  ShoppingBag,
  ShoppingCart,
  Users,
  CreditCard,
} from "lucide-react";
import { NavLink } from "react-router-dom";
import useStore from "../../store/useStore";
import { useNavigate } from "react-router-dom";

const menuSections = [
  {
    title: "MAIN",
    items: [
      { name: "Dashboard", icon: LayoutDashboard, to: "/dashboard" },
      { name: "Billing (POS)", icon: ShoppingCart, to: "/billing" },
    ],
  },
  {
    title: "MANAGEMENT",
    items: [
      { name: "Inventory", icon: Boxes, to: "/inventory" },
      { name: "Purchase", icon: ShoppingBag, to: "/purchase" },
      { name: "User Management", icon: Users, to: "/users", roleRequired: "ADMIN" },
      { name: "Subscription", icon: CreditCard, to: "/subscription", roleRequired: "ADMIN" },
    ],
  },
  {
    title: "RECORDS",
    items: [
      { name: "Bill History", icon: ReceiptText, to: "/bill-history" },
      { name: "Reports", icon: BarChart3, to: "/reports" },
      { name: "Notifications", icon: BellRing, to: "/notifications" },
    ],
  },
];

const Sidebar = () => {
  const { sidebarCollapsed, sidebarOpen, setSidebarOpen, profile, logout } = useStore();
  const navigate = useNavigate();
  const initials = profile.name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <aside
      className={`fixed left-0 top-0 z-40 h-screen transition-all duration-300 ${
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      } ${sidebarCollapsed ? "lg:w-24" : "lg:w-72"} lg:translate-x-0 border-r border-amber-500/20 bg-slate-950/80 backdrop-blur-xl text-slate-100 shadow-[0_0_40px_rgba(245,158,11,0.05)]`}
    >
      <div className="flex h-full flex-col px-5 pb-6 pt-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl text-lg font-semibold bg-gradient-to-br from-[#f59e0b] to-[#ef4444] text-white shadow-[0_0_20px_rgba(245,158,11,0.4)]">
            ES
          </div>
          {!sidebarCollapsed && (
            <div>
              <h1 className="text-lg font-semibold tracking-[0.1em] text-white">ElectroShop</h1>
              <p className="text-[10px] uppercase tracking-widest text-amber-300/70">Luxury Retail</p>
            </div>
          )}
        </div>

        <div className="mt-8 flex items-center gap-3 rounded-2xl border border-amber-500/10 bg-slate-900/50 p-3 shadow-inner shadow-amber-500/5">
          {profile.avatarUrl ? (
            <img
              src={profile.avatarUrl}
              alt={profile.name}
              className="h-10 w-10 rounded-full object-cover border border-amber-500/30"
            />
          ) : (
            <div className="flex h-10 w-10 items-center justify-center rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 ring-1 ring-amber-500/30 shadow-[0_0_15px_rgba(245,158,11,0.15)]">
              {initials}
            </div>
          )}
          {!sidebarCollapsed && (
            <div>
              <p className="text-sm font-semibold text-white">{profile.name}</p>
              <p className="text-[10px] uppercase tracking-wider text-slate-400">{profile.role}</p>
            </div>
          )}
        </div>

        <nav className="mt-8 flex-1 space-y-6 overflow-y-auto pr-2 pb-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          {menuSections.map((section) => (
            <div key={section.title}>
              {!sidebarCollapsed && (
                <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-500">
                  {section.title}
                </p>
              )}
              <div className="space-y-2">
                {section.items
                  .filter((item) => !item.roleRequired || profile.role === item.roleRequired)
                  .map((item) => {
                    const Icon = item.icon;
                    return (
                      <NavLink
                        key={item.name}
                        to={item.to}
                        className={({ isActive }) =>
                          `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition duration-300 ${
                            isActive
                              ? "bg-gradient-to-r from-amber-500/20 to-orange-500/10 text-amber-300 shadow-[0_0_20px_rgba(245,158,11,0.1)] ring-1 ring-amber-500/30"
                              : "text-slate-400 hover:bg-white/5 hover:text-slate-200"
                          } ${sidebarCollapsed ? "justify-center" : ""}`
                        }
                        onClick={() => setSidebarOpen(false)}
                      >
                        <Icon size={18} />
                        {!sidebarCollapsed && <span>{item.name}</span>}
                      </NavLink>
                    );
                  })}
              </div>
            </div>
          ))}
        </nav>

        <div className="mt-auto pt-4 border-t border-amber-500/10">
          <button
            type="button"
            onClick={() => {
              logout();
              navigate("/login");
            }}
            className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition duration-300 ${
              sidebarCollapsed ? "justify-center" : ""
            } text-red-400 hover:bg-red-500/10 hover:text-red-300 hover:shadow-[0_0_20px_rgba(239,68,68,0.1)]`}
          >
            <LogOut size={18} />
            {!sidebarCollapsed && <span>Secure Logout</span>}
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
