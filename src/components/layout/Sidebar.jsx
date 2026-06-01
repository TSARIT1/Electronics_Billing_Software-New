import {
  BarChart3,
  Boxes,
  LayoutDashboard,
  LogOut,
  BellRing,
  ReceiptText,
  ShoppingBag,
  ShoppingCart,
} from "lucide-react";
import { NavLink } from "react-router-dom";
import useStore from "../../store/useStore";
import { useNavigate } from "react-router-dom";

const menuSections = [
  {
    title: "MAIN",
    items: [
      { name: "Dashboard", icon: LayoutDashboard, to: "/" },
      { name: "Billing (POS)", icon: ShoppingCart, to: "/billing" },
    ],
  },
  {
    title: "MANAGEMENT",
    items: [
      { name: "Inventory", icon: Boxes, to: "/inventory" },
      { name: "Purchase", icon: ShoppingBag, to: "/purchase" },
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
  const { sidebarCollapsed, sidebarOpen, setSidebarOpen, profile, logout, darkMode } = useStore();
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
      } ${sidebarCollapsed ? "lg:w-24" : "lg:w-72"} lg:translate-x-0 ${
        darkMode
          ? "bg-gradient-to-b from-sidebar-start to-sidebar-end text-white shadow-2xl"
          : "border-r border-card-border bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(247,249,255,0.98))] text-text-main shadow-[0_18px_40px_rgba(15,23,42,0.08)] dark:border-slate-700"
      }`}
    >
      <div className="flex h-full flex-col px-5 pb-6 pt-6">
        <div className="flex items-center gap-3">
          <div className={`flex h-10 w-10 items-center justify-center rounded-2xl text-lg font-semibold ${darkMode ? "bg-white/15" : "bg-gradient-to-br from-primary to-primary-dark text-white shadow-glow"}`}>
            ES
          </div>
          {!sidebarCollapsed && (
            <div>
              <h1 className={`text-lg font-semibold ${darkMode ? "text-white" : "text-text-main"}`}>ElectroShop</h1>
              <p className={`text-xs ${darkMode ? "text-white/70" : "text-text-muted"}`}>Management System</p>
            </div>
          )}
        </div>

        <div className={`mt-8 flex items-center gap-3 rounded-2xl p-3 ${darkMode ? "bg-white/10" : "bg-gradient-to-r from-slate-50 via-white to-indigo-50 ring-1 ring-slate-200/80"}`}>
          {profile.avatarUrl ? (
            <img
              src={profile.avatarUrl}
              alt={profile.name}
              className="h-10 w-10 rounded-full object-cover"
            />
          ) : (
            <div className={`flex h-10 w-10 items-center justify-center rounded-full text-xs font-semibold ${darkMode ? "bg-white/30" : "bg-primary/10 text-primary ring-1 ring-primary/15"}`}>
              {initials}
            </div>
          )}
          {!sidebarCollapsed && (
            <div>
              <p className={`text-sm font-semibold ${darkMode ? "text-white" : "text-text-main"}`}>{profile.name}</p>
              <p className={`text-xs ${darkMode ? "text-white/70" : "text-text-muted"}`}>{profile.role}</p>
            </div>
          )}
        </div>

        <nav className="mt-8 flex-1 space-y-6">
          {menuSections.map((section) => (
            <div key={section.title}>
              {!sidebarCollapsed && (
                <p className={`mb-3 text-xs font-semibold ${darkMode ? "text-white/60" : "text-text-muted"}`}>
                  {section.title}
                </p>
              )}
              <div className="space-y-2">
                {section.items.map((item) => {
                  const Icon = item.icon;
                  return (
                    <NavLink
                      key={item.name}
                      to={item.to}
                      className={({ isActive }) =>
                        `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${
                          isActive
                            ? darkMode
                              ? "bg-gradient-to-r from-primary to-primary-dark text-white shadow-glow"
                              : "bg-primary text-white shadow-glow"
                            : darkMode
                              ? "text-white/75 hover:bg-white/10 hover:text-white"
                              : "text-text-muted hover:bg-white hover:text-text-main hover:shadow-soft"
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

        <button
          type="button"
          onClick={() => {
            logout();
            navigate("/login");
          }}
          className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-white/80 transition hover:bg-white/10 hover:text-white ${
            sidebarCollapsed ? "justify-center" : ""
          } ${darkMode ? "" : "text-text-muted hover:bg-white hover:text-text-main hover:shadow-soft"}`}
        >
          <LogOut size={18} />
          {!sidebarCollapsed && <span>Logout</span>}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
