import {
  ArrowRight,
  Bell,
  ChevronDown,
  ChevronRight,
  Menu,
  Search,
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
  "/dashboard": { title: "Dashboard", subtitle: "Overview & Statistics" },
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
    profile,
    updateProfile,
    notifications,
    fetchNotifications,
    markNotificationRead,
    markAllNotificationsRead,
    clearNotifications,
  } = useStore();
  const [profileOpen, setProfileOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const notificationRef = useRef(null);
  const meta = pageMeta[location.pathname] || pageMeta["/dashboard"];
  const initials = (profile.name || "")
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  const unreadCount = notifications.filter((notification) => !notification.read).length;

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

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
    <header className="sticky top-0 z-20 px-6 py-4 lg:px-8">
      <div className="flex flex-col gap-4 rounded-[28px] border border-amber-500/20 bg-slate-950/80 px-4 py-4 shadow-[0_0_40px_rgba(245,158,11,0.05)] backdrop-blur-xl lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-3">
          <button
            type="button"
            className="flex h-11 w-11 items-center justify-center rounded-2xl border border-amber-500/10 bg-slate-900/50 text-slate-100 shadow-soft transition duration-300 hover:-translate-y-0.5 hover:border-amber-500/30 hover:shadow-[0_0_20px_rgba(245,158,11,0.15)] lg:hidden"
            onClick={toggleSidebar}
          >
            <Menu size={19} strokeWidth={2.4} />
          </button>
          <button
            type="button"
            className="hidden h-11 w-11 items-center justify-center rounded-2xl border border-amber-500/10 bg-slate-900/50 text-slate-100 shadow-soft transition duration-300 hover:-translate-y-0.5 hover:border-amber-500/30 hover:shadow-[0_0_20px_rgba(245,158,11,0.15)] lg:flex"
            onClick={toggleCollapse}
          >
            <Menu size={19} strokeWidth={2.4} className={sidebarCollapsed ? "rotate-180 transition-transform duration-300" : "transition-transform duration-300"} />
          </button>
          <div>
            <h2 className="text-xl font-semibold tracking-tight text-white">{meta.title}</h2>
            <p className="text-xs tracking-wider text-slate-400">{meta.subtitle}</p>
          </div>
        </div>

        <div className="flex flex-1 items-center gap-3 lg:justify-end">
          <div className="hidden flex-1 items-center gap-2 rounded-2xl border border-amber-500/10 bg-slate-900/50 px-4 py-2.5 text-sm font-medium text-slate-300 shadow-inner shadow-amber-500/5 transition focus-within:border-amber-500/30 focus-within:ring-1 focus-within:ring-amber-500/30 md:flex md:max-w-sm">
            <Search size={17} strokeWidth={2.3} className="text-amber-500" />
            <input
              placeholder="Search here"
              className="w-full bg-transparent text-white outline-none placeholder:text-slate-500"
            />
          </div>
          <button
            type="button"
            onClick={() => navigate("/")}
            className="hidden items-center gap-2 rounded-2xl border border-amber-500/20 bg-slate-900/80 px-4 py-2 text-sm font-semibold text-white shadow-soft transition duration-300 hover:-translate-y-0.5 hover:border-amber-500/40 hover:shadow-[0_0_20px_rgba(245,158,11,0.2)] md:flex"
          >
            <ArrowRight size={16} strokeWidth={2.2} className="text-amber-400" />
            Landing
          </button>
          <div className="relative" ref={notificationRef}>
            <button
              type="button"
              className="relative flex h-11 w-11 items-center justify-center rounded-2xl border border-amber-500/10 bg-slate-900/50 text-slate-100 shadow-soft transition duration-300 hover:-translate-y-0.5 hover:border-amber-500/30 hover:shadow-[0_0_20px_rgba(245,158,11,0.15)]"
              onClick={() => setNotificationsOpen((open) => !open)}
              aria-label="Open notifications"
              title="Notifications"
            >
              <Bell size={19} strokeWidth={2.3} />
              {unreadCount > 0 ? (
                <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-amber-500 px-1 text-[10px] font-bold text-slate-950 shadow-[0_0_10px_rgba(245,158,11,0.5)]">
                  {unreadCount}
                </span>
              ) : null}
            </button>

            {notificationsOpen ? (
              <div className="absolute right-0 top-14 z-50 w-80 overflow-hidden rounded-[24px] border border-amber-500/20 bg-slate-950/95 shadow-[0_15px_50px_rgba(0,0,0,0.5)] backdrop-blur-xl">
                <div className="flex items-center justify-between border-b border-amber-500/10 px-4 py-3 bg-slate-900/50">
                  <div>
                    <p className="text-sm font-semibold text-white">Notifications</p>
                    <p className="text-[10px] uppercase tracking-wider text-amber-500/70">Recent updates</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      className="rounded-xl border border-amber-500/10 bg-slate-900/50 p-2 text-slate-400 transition hover:-translate-y-0.5 hover:border-amber-500/30 hover:text-white"
                      onClick={() => {
                        markAllNotificationsRead();
                      }}
                      title="Mark all read"
                    >
                      <CheckCheck size={16} strokeWidth={2.4} />
                    </button>
                    <button
                      type="button"
                      className="rounded-xl border border-red-500/10 bg-slate-900/50 p-2 text-slate-400 transition hover:-translate-y-0.5 hover:border-red-500/30 hover:text-red-400"
                      onClick={() => clearNotifications()}
                      title="Clear notifications"
                    >
                      <Trash2 size={16} strokeWidth={2.4} />
                    </button>
                    <button
                      type="button"
                      className="rounded-xl border border-amber-500/10 bg-slate-900/50 p-2 text-slate-400 transition hover:-translate-y-0.5 hover:border-amber-500/30 hover:text-amber-400"
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
                <div className="max-h-80 overflow-y-auto custom-scrollbar">
                  {notifications.length > 0 ? (
                    notifications.map((notification) => (
                      <button
                        key={notification.id}
                        type="button"
                        className={`flex w-full items-start gap-3 border-b border-amber-500/5 px-4 py-3 text-left transition duration-300 last:border-b-0 hover:bg-slate-800/80 ${notification.read ? "opacity-60" : ""}`}
                        onClick={() => {
                          markNotificationRead(notification.id);
                        }}
                      >
                        <Badge
                          variant={notification.type === "success" ? "success" : notification.type === "warning" ? "warning" : "info"}
                          className="mt-0.5 bg-opacity-20"
                        >
                          {notification.type || "info"}
                        </Badge>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-semibold text-white">
                            {notification.title}
                          </p>
                          <p className="mt-1 text-xs text-slate-400">
                            {notification.message}
                          </p>
                          <p className="mt-2 text-[10px] text-slate-500 uppercase tracking-wider">
                            {new Date(notification.createdAt || notification.time || Date.now()).toLocaleString()}
                          </p>
                        </div>
                        {!notification.read ? (
                          <span className="mt-1 h-2 w-2 rounded-full bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.8)]" />
                        ) : null}
                      </button>
                    ))
                  ) : (
                    <div className="px-4 py-8 text-center text-xs tracking-wider uppercase text-slate-500">
                      No notifications yet.
                    </div>
                  )}
                </div>
                <div className="border-t border-amber-500/10 px-4 py-3 bg-slate-900/30">
                  <button
                    type="button"
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 px-4 py-2 text-sm font-semibold text-slate-950 shadow-[0_0_20px_rgba(245,158,11,0.3)] transition hover:brightness-110"
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
            className="flex items-center gap-3 rounded-2xl border border-amber-500/10 bg-slate-900/50 px-3 py-2 shadow-soft transition duration-300 hover:-translate-y-0.5 hover:border-amber-500/30 hover:bg-slate-800/80 hover:shadow-[0_0_20px_rgba(245,158,11,0.15)]"
            onClick={() => setProfileOpen(true)}
          >
            {profile.avatarUrl ? (
              <img
                src={profile.avatarUrl}
                alt={profile.name}
                className="h-8 w-8 rounded-full object-cover border border-amber-500/30"
              />
            ) : (
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-500/10 text-xs font-bold text-amber-400 ring-1 ring-amber-500/30 shadow-[0_0_10px_rgba(245,158,11,0.15)]">
                {initials}
              </div>
            )}
            <div className="hidden text-sm md:block text-left">
              <p className="font-semibold text-white line-clamp-1">{profile.name}</p>
              <p className="text-[9px] font-bold uppercase tracking-widest text-amber-400">
                {profile.shopName || "General Store"}
              </p>
            </div>
            <ChevronDown size={16} strokeWidth={2.4} className="text-slate-400 ml-1" />
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
