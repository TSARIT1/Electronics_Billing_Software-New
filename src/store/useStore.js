import { create } from "zustand";
import { getCurrentUser, logout as authLogout } from "../services/auth";

const current = getCurrentUser();
const notificationsKey = "es_notifications";

const safeLoadNotifications = () => {
  try {
    const stored = JSON.parse(localStorage.getItem(notificationsKey) || "null");
    return Array.isArray(stored) && stored.length > 0 ? stored : null;
  } catch (error) {
    return null;
  }
};

const persistNotifications = (notifications) => {
  try {
    localStorage.setItem(notificationsKey, JSON.stringify(notifications));
  } catch (error) {}
};

const now = new Date().toISOString();
const defaultProfile = {
  name: current?.name || "Guest User",
  role: current ? "Admin Manager" : "Visitor",
  email: current?.email || "",
  phone: "",
  avatarUrl: "",
};

const defaultNotifications = [
  {
    id: 1,
    title: "Backend connected",
    message: "The live API is running on port 8081.",
    time: now,
    read: false,
    type: "success",
  },
  {
    id: 2,
    title: "Inventory synced",
    message: "Product and purchase screens now use backend data.",
    time: now,
    read: false,
    type: "info",
  },
];

const initialNotifications = safeLoadNotifications() || defaultNotifications;

const useStore = create((set) => ({
  sidebarCollapsed: false,
  sidebarOpen: true,
  darkMode: (() => {
    try {
      const v = localStorage.getItem("darkMode");
      return v === "true";
    } catch (e) {
      return false;
    }
  })(),
  notifications: initialNotifications,
  profile: defaultProfile,
  setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  toggleCollapse: () =>
    set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
  toggleDarkMode: () => set((state) => {
    const next = !state.darkMode;
    try { localStorage.setItem("darkMode", next ? "true" : "false"); } catch(e){}
    return { darkMode: next };
  }),
  updateProfile: (updates) =>
    set((state) => ({ profile: { ...state.profile, ...updates } })),
  setProfile: (profile) => set({ profile }),
  addNotification: (notification) =>
    set((state) => {
      const nextNotifications = [
        {
          id: Date.now(),
          title: notification.title,
          message: notification.message,
          time: new Date().toISOString(),
          read: false,
          type: notification.type || "info",
        },
        ...state.notifications,
      ];
      persistNotifications(nextNotifications);
      return { notifications: nextNotifications };
    }),
  markNotificationRead: (id) =>
    set((state) => {
      const nextNotifications = state.notifications.map((item) =>
        item.id === id ? { ...item, read: true } : item,
      );
      persistNotifications(nextNotifications);
      return { notifications: nextNotifications };
    }),
  markAllNotificationsRead: () =>
    set((state) => {
      const nextNotifications = state.notifications.map((item) => ({
        ...item,
        read: true,
      }));
      persistNotifications(nextNotifications);
      return { notifications: nextNotifications };
    }),
  deleteNotification: (id) =>
    set((state) => {
      const nextNotifications = state.notifications.filter((item) => item.id !== id);
      persistNotifications(nextNotifications);
      return { notifications: nextNotifications };
    }),
  clearNotifications: () => {
    persistNotifications([]);
    set({ notifications: [] });
  },
  logout: () => {
    authLogout();
    set({
      profile: { ...defaultProfile, name: "Guest User", role: "Visitor", email: "" },
      notifications: defaultNotifications,
    });
  },
}));

export default useStore;
