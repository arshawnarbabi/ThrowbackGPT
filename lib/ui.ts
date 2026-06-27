import { create } from "zustand";

interface UIState {
  settingsOpen: boolean;
  feedbackOpen: boolean;
  sidebarOpen: boolean;
  openSettings: () => void;
  closeSettings: () => void;
  openFeedback: () => void;
  closeFeedback: () => void;
  toggleSidebar: () => void;
  setSidebar: (v: boolean) => void;
}

export const useUI = create<UIState>((set) => ({
  settingsOpen: false,
  feedbackOpen: false,
  sidebarOpen: false,
  openSettings: () => set({ settingsOpen: true }),
  closeSettings: () => set({ settingsOpen: false }),
  openFeedback: () => set({ feedbackOpen: true }),
  closeFeedback: () => set({ feedbackOpen: false }),
  toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
  setSidebar: (v) => set({ sidebarOpen: v }),
}));
