import { create } from "zustand";

const useStore = create((set) => ({
  sidebarCollapsed: false,
  sidebarOpen: true,
  darkMode: false,
  profile: {
    name: "Fazal Shaikh",
    role: "Admin Manager",
    email: "fazal.shaikh@electroshop.com",
    phone: "+91 98765 43210",
    avatarUrl: "",
  },
  setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  toggleCollapse: () =>
    set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
  toggleDarkMode: () => set((state) => ({ darkMode: !state.darkMode })),
  updateProfile: (updates) =>
    set((state) => ({ profile: { ...state.profile, ...updates } })),
}));

export default useStore;
