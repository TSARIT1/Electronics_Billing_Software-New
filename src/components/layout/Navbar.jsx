import {
  Bell,
  ChevronDown,
  ChevronRight,
  Menu,
  Moon,
  Search,
  Sun,
  CheckCheck,
  Trash2,
} from "lucide-react";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import useStore from "../../store/useStore";
import { useEffect, useRef, useState } from "react";
import ProfileModal from "../modals/ProfileModal";
import Badge from "../ui/Badge";

const pageMeta = {
  "/": { title: "Dashboard", subtitle: "Overview & Statistics" },
  "/billing": { title: "Billing (POS)", subtitle: "Fast billing workspace" },
  "/inventory": { title: "Inventory", subtitle: "Manage stock items" },
  "/purchase": { title: "Purchase", subtitle: "Supplier orders" },
  "/bill-history": { title: "Bill History", subtitle: "Invoices & returns" },
  "/reports": { title: "Reports", subtitle: "Business analytics" },
  "/notifications": { title: "Notifications", subtitle: "Alerts and activity" },
};

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const {
    sidebarCollapsed,
    toggleCollapse,
    toggleSidebar,
    darkMode,
    toggleDarkMode,
    profile,
    updateProfile,
    notifications,
    markNotificationRead,
    markAllNotificationsRead,
    clearNotifications,
  } = useStore();
  const [profileOpen, setProfileOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const notificationRef = useRef(null);
  const meta = pageMeta[location.pathname] || pageMeta["/"];
  const initials = profile.name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  const unreadCount = notifications.filter((notification) => !notification.read).length;

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setNotificationsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  return (
    <header className="sticky top-0 z-20 bg-app-bg/90 px-6 py-4 backdrop-blur lg:px-8 dark:bg-surface/80">
      <div className="flex flex-col gap-4 rounded-[28px] border border-card-border bg-surface/75 px-4 py-4 shadow-soft lg:flex-row lg:items-center lg:justify-between dark:bg-surface/55 dark:border-slate-700">
        <div className="flex items-center gap-3">
          <button
            type="button"
            className="flex h-11 w-11 items-center justify-center rounded-2xl border border-card-border bg-gradient-to-br from-surface to-surface-alt text-text-main shadow-soft transition hover:-translate-y-0.5 hover:shadow-card lg:hidden dark:bg-surface-alt dark:border-slate-700 dark:text-slate-100"
            onClick={toggleSidebar}
          >
            <Menu size={19} strokeWidth={2.4} />
          </button>
          <button
            type="button"
            className="hidden h-11 w-11 items-center justify-center rounded-2xl border border-card-border bg-gradient-to-br from-surface to-surface-alt text-text-main shadow-soft transition hover:-translate-y-0.5 hover:shadow-card lg:flex dark:bg-surface-alt dark:border-slate-700 dark:text-slate-100"
            onClick={toggleCollapse}
          >
            <Menu size={19} strokeWidth={2.4} className={sidebarCollapsed ? "rotate-180" : ""} />
          </button>
          <div>
            <h2 className="text-xl font-bold tracking-tight text-text-main">{meta.title}</h2>
            <p className="text-sm font-medium text-text-muted">{meta.subtitle}</p>
          </div>
        </div>

        <div className="flex flex-1 items-center gap-3 lg:justify-end">
          <div className="hidden flex-1 items-center gap-2 rounded-2xl border border-card-border bg-gradient-to-r from-surface via-surface to-surface-alt px-4 py-2.5 text-sm font-medium text-text-muted shadow-soft md:flex md:max-w-sm dark:bg-surface-alt dark:text-slate-300">
            <Search size={17} strokeWidth={2.3} className="text-primary" />
            <input
              placeholder="Search here"
              className="w-full bg-transparent text-text-main outline-none placeholder:text-text-muted"
            />
          </div>
          <div className="relative" ref={notificationRef}>
            <button
              type="button"
              className="relative flex h-11 w-11 items-center justify-center rounded-2xl border border-card-border bg-gradient-to-br from-surface to-surface-alt text-text-main shadow-soft transition hover:-translate-y-0.5 hover:shadow-card dark:bg-surface-alt dark:text-slate-100"
              onClick={() => setNotificationsOpen((open) => !open)}
              aria-label="Open notifications"
              title="Notifications"
            >
              <Bell size={19} strokeWidth={2.3} />
              {unreadCount > 0 ? (
                <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-danger px-1 text-[10px] font-semibold text-white">
                  {unreadCount}
                </span>
              ) : null}
            </button>

            {notificationsOpen ? (
              <div className="absolute right-0 top-12 z-50 w-80 overflow-hidden rounded-3xl border border-card-border bg-surface shadow-2xl dark:bg-surface-alt">
                <div className="flex items-center justify-between border-b border-card-border px-4 py-3 dark:border-slate-700">
                  <div>
                    <p className="text-sm font-semibold text-text-main dark:text-slate-100">Notifications</p>
                    <p className="text-xs text-text-muted dark:text-slate-400">Recent system updates</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      className="rounded-xl border border-card-border/70 bg-surface p-2 text-text-muted shadow-sm transition hover:-translate-y-0.5 hover:bg-surface-alt hover:text-text-main hover:shadow-card dark:border-slate-700 dark:bg-surface-alt dark:hover:bg-surface"
                      onClick={() => {
                        markAllNotificationsRead();
                      }}
                      title="Mark all read"
                    >
                      <CheckCheck size={16} strokeWidth={2.4} />
                    </button>
                    <button
                      type="button"
                      className="rounded-xl border border-card-border/70 bg-surface p-2 text-text-muted shadow-sm transition hover:-translate-y-0.5 hover:bg-surface-alt hover:text-danger hover:shadow-card dark:border-slate-700 dark:bg-surface-alt dark:hover:bg-surface"
                      onClick={() => clearNotifications()}
                      title="Clear notifications"
                    >
                      <Trash2 size={16} strokeWidth={2.4} />
                    </button>
                    <button
                      type="button"
                      className="rounded-xl border border-card-border/70 bg-surface p-2 text-text-muted shadow-sm transition hover:-translate-y-0.5 hover:bg-surface-alt hover:text-primary hover:shadow-card dark:border-slate-700 dark:bg-surface-alt dark:hover:bg-slate-800"
                      onClick={() => {
                        setNotificationsOpen(false);
                        navigate("/notifications");
                      }}
                      title="Open notifications page"
                    >
                      <ChevronRight size={16} strokeWidth={2.4} />
                    </button>
                  </div>
                </div>
                <div className="max-h-80 overflow-y-auto">
                  {notifications.length > 0 ? (
                    notifications.map((notification) => (
                      <button
                        key={notification.id}
                        type="button"
                        className={`flex w-full items-start gap-3 border-b border-card-border px-4 py-3 text-left transition last:border-b-0 hover:bg-surface-alt dark:border-slate-800 dark:hover:bg-slate-800/70 ${notification.read ? "opacity-70" : ""}`}
                        onClick={() => {
                          markNotificationRead(notification.id);
                        }}
                      >
                        <Badge
                          variant={notification.type === "success" ? "success" : notification.type === "warning" ? "warning" : "info"}
                          className="mt-0.5"
                        >
                          {notification.type || "info"}
                        </Badge>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-semibold text-text-main dark:text-slate-100">
                            {notification.title}
                          </p>
                          <p className="mt-1 text-xs text-text-muted dark:text-slate-400">
                            {notification.message}
                          </p>
                          <p className="mt-2 text-[11px] text-text-muted dark:text-slate-500">
                            {new Date(notification.time).toLocaleString()}
                          </p>
                        </div>
                        {!notification.read ? (
                          <span className="mt-1 h-2.5 w-2.5 rounded-full bg-primary" />
                        ) : null}
                      </button>
                    ))
                  ) : (
                    <div className="px-4 py-8 text-center text-sm text-text-muted dark:text-slate-400">
                      No notifications yet.
                    </div>
                  )}
                </div>
                <div className="border-t border-card-border px-4 py-3 dark:border-slate-700">
                  <button
                    type="button"
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-white shadow-glow transition hover:bg-primary-dark"
                    onClick={() => {
                      setNotificationsOpen(false);
                      navigate("/notifications");
                    }}
                  >
                    View all notifications
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            ) : null}
          </div>
          <button
            type="button"
            className="flex h-11 w-11 items-center justify-center rounded-2xl border border-card-border bg-gradient-to-br from-surface to-surface-alt text-text-main shadow-soft transition hover:-translate-y-0.5 hover:shadow-card dark:bg-surface-alt dark:text-slate-100"
            onClick={toggleDarkMode}
            aria-pressed={darkMode}
            aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
            title={darkMode ? "Switch to light mode" : "Switch to dark mode"}
          >
            {darkMode ? (
              <Sun size={19} strokeWidth={2.3} className="text-yellow-400" />
            ) : (
              <Moon size={19} strokeWidth={2.3} className="text-text-main dark:text-slate-100" />
            )}
          </button>
          <button
            type="button"
            className="flex items-center gap-3 rounded-2xl border border-card-border bg-gradient-to-r from-surface via-surface to-surface-alt px-3 py-2 shadow-soft transition hover:-translate-y-0.5 hover:shadow-card dark:bg-surface-alt dark:border-slate-700"
            onClick={() => setProfileOpen(true)}
          >
            {profile.avatarUrl ? (
              <img
                src={profile.avatarUrl}
                alt={profile.name}
                className="h-8 w-8 rounded-full object-cover"
              />
            ) : (
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-indigo-100 to-white text-xs font-semibold text-text-main ring-1 ring-indigo-200 dark:bg-slate-700 dark:text-slate-100">
                {initials}
              </div>
            )}
            <div className="hidden text-sm md:block">
              <p className="font-bold text-text-main">{profile.name}</p>
              <p className="text-xs font-medium text-text-muted">{profile.role}</p>
            </div>
            <ChevronDown size={16} strokeWidth={2.4} className="text-text-muted" />
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
