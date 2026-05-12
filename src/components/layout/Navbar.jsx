import {
  Bell,
  ChevronDown,
  Menu,
  Moon,
  Search,
  Sun,
} from "lucide-react";
import { useLocation } from "react-router-dom";
import useStore from "../../store/useStore";
import { useState } from "react";
import ProfileModal from "../modals/ProfileModal";

const pageMeta = {
  "/": { title: "Dashboard", subtitle: "Overview & Statistics" },
  "/billing": { title: "Billing (POS)", subtitle: "Fast billing workspace" },
  "/inventory": { title: "Inventory", subtitle: "Manage stock items" },
  "/purchase": { title: "Purchase", subtitle: "Supplier orders" },
  "/bill-history": { title: "Bill History", subtitle: "Invoices & returns" },
  "/reports": { title: "Reports", subtitle: "Business analytics" },
};

const Navbar = () => {
  const location = useLocation();
  const {
    sidebarCollapsed,
    toggleCollapse,
    toggleSidebar,
    darkMode,
    toggleDarkMode,
    profile,
    updateProfile,
  } = useStore();
  const [profileOpen, setProfileOpen] = useState(false);
  const meta = pageMeta[location.pathname] || pageMeta["/"];
  const initials = profile.name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <header className="sticky top-0 z-20 bg-app-bg/90 px-6 py-4 backdrop-blur lg:px-8">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-3">
          <button
            type="button"
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-card-border bg-white text-text-main shadow-soft lg:hidden"
            onClick={toggleSidebar}
          >
            <Menu size={18} />
          </button>
          <button
            type="button"
            className="hidden h-10 w-10 items-center justify-center rounded-xl border border-card-border bg-white text-text-main shadow-soft lg:flex"
            onClick={toggleCollapse}
          >
            <Menu size={18} className={sidebarCollapsed ? "rotate-180" : ""} />
          </button>
          <div>
            <h2 className="text-xl font-semibold text-text-main">{meta.title}</h2>
            <p className="text-sm text-text-muted">{meta.subtitle}</p>
          </div>
        </div>

        <div className="flex flex-1 items-center gap-3 lg:justify-end">
          <div className="hidden flex-1 items-center gap-2 rounded-xl border border-card-border bg-white px-3 py-2 text-sm text-text-muted shadow-soft md:flex md:max-w-sm">
            <Search size={16} />
            <input
              placeholder="Search here"
              className="w-full bg-transparent text-text-main outline-none placeholder:text-text-muted"
            />
          </div>
          <button
            type="button"
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-card-border bg-white text-text-main shadow-soft"
          >
            <Bell size={18} />
          </button>
          <button
            type="button"
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-card-border bg-white text-text-main shadow-soft"
            onClick={toggleDarkMode}
          >
            {darkMode ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          <button
            type="button"
            className="flex items-center gap-3 rounded-2xl border border-card-border bg-white px-3 py-2 shadow-soft"
            onClick={() => setProfileOpen(true)}
          >
            {profile.avatarUrl ? (
              <img
                src={profile.avatarUrl}
                alt={profile.name}
                className="h-8 w-8 rounded-full object-cover"
              />
            ) : (
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-200 text-xs font-semibold text-text-main">
                {initials}
              </div>
            )}
            <div className="hidden text-sm md:block">
              <p className="font-semibold text-text-main">{profile.name}</p>
              <p className="text-xs text-text-muted">{profile.role}</p>
            </div>
            <ChevronDown size={16} className="text-text-muted" />
          </button>
        </div>
      </div>
      <ProfileModal
        isOpen={profileOpen}
        onClose={() => setProfileOpen(false)}
        profile={profile}
        onSave={updateProfile}
      />
    </header>
  );
};

export default Navbar;
