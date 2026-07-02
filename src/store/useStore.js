import { create } from "zustand";
import { getCurrentUser, logout as authLogout } from "../services/auth";
import {
  getNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification as apiDeleteNotification,
  clearNotifications as apiClearNotifications,
} from "../services/notifications";

const current = getCurrentUser();

const defaultProfile = {
  name: current?.name || "Guest User",
  role: current?.role || "Visitor",
  email: current?.email || "",
  phone: "",
  avatarUrl: "",
  shopId: current?.shopId || null,
  shopName: current?.shopName || "",
  planName: current?.planName || "No Plan",
  subscriptionExpiresAt: current?.subscriptionExpiresAt || null,
};


const useStore = create((set) => ({
  sidebarCollapsed: false,
  sidebarOpen: true,
  darkMode: true,
  notifications: [],
  profile: defaultProfile,
  setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  toggleCollapse: () =>
    set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
  updateProfile: (updates) =>
    set((state) => ({ profile: { ...state.profile, ...updates } })),
  setProfile: (profile) => set({ profile }),
  fetchNotifications: async () => {
    try {
      const data = await getNotifications();
      set({ notifications: data || [] });
    } catch (err) {
      console.error(err);
    }
  },
  addNotification: (notification) => {
    set((state) => ({ notifications: [notification, ...state.notifications] }));
  },
  markNotificationRead: async (id) => {
    try {
      await markAsRead(id);
      set((state) => ({
        notifications: state.notifications.map((n) =>
          n.id === id ? { ...n, read: true } : n
        ),
      }));
    } catch (err) {
      console.error(err);
    }
  },
  markAllNotificationsRead: async () => {
    try {
      await markAllAsRead();
      set((state) => ({
        notifications: state.notifications.map((n) => ({ ...n, read: true })),
      }));
    } catch (err) {
      console.error(err);
    }
  },
  deleteNotification: async (id) => {
    try {
      await apiDeleteNotification(id);
      set((state) => ({
        notifications: state.notifications.filter((n) => n.id !== id),
      }));
    } catch (err) {
      console.error(err);
    }
  },
  clearNotifications: async () => {
    try {
      await apiClearNotifications();
      set({ notifications: [] });
    } catch (err) {
      console.error(err);
    }
  },
  logout: () => {
    authLogout();
    set({
      profile: {
        ...defaultProfile,
        name: "Guest User",
        role: "Visitor",
        email: "",
        shopId: null,
        shopName: "",
        planName: "No Plan",
        subscriptionExpiresAt: null,
      },
      notifications: [],
    });
  },
}));

export default useStore;
