import { create } from "zustand";
import { getCurrentUser, logout as authLogout } from "../services/auth";

const current = getCurrentUser();
const defaultProfile = {
  name: current?.name || "Guest User",
  role: current ? "Admin Manager" : "Visitor",
  email: current?.email || "",
  phone: "",
  avatarUrl: "",
};

const useStore = create((set) => ({
  sidebarCollapsed: false,
  sidebarOpen: true,
  darkMode: false,
  profile: defaultProfile,
  setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  toggleCollapse: () =>
    set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
  toggleDarkMode: () => set((state) => ({ darkMode: !state.darkMode })),
  updateProfile: (updates) =>
    set((state) => ({ profile: { ...state.profile, ...updates } })),
  setProfile: (profile) => set({ profile }),
  logout: () => {
    authLogout();
    set({ profile: { ...defaultProfile, name: "Guest User", role: "Visitor", email: "" } });
  },
}));

export default useStore;
