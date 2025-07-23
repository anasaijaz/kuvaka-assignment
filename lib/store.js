import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

// Main app store
export const useAppStore = create()(
  devtools(
    persist(
      (set, get) => ({
        // User state
        user: null,
        isAuthenticated: false,

        // UI state
        theme: "light",
        sidebarOpen: true,
        loading: false,

        // Actions
        setUser: (user) =>
          set({ user, isAuthenticated: !!user }, false, "setUser"),

        logout: () =>
          set(
            {
              user: null,
              isAuthenticated: false,
            },
            false,
            "logout"
          ),

        setTheme: (theme) => set({ theme }, false, "setTheme"),

        toggleSidebar: () =>
          set(
            (state) => ({
              sidebarOpen: !state.sidebarOpen,
            }),
            false,
            "toggleSidebar"
          ),

        setSidebarOpen: (open) =>
          set({ sidebarOpen: open }, false, "setSidebarOpen"),

        setLoading: (loading) => set({ loading }, false, "setLoading"),

        // Reset store
        reset: () =>
          set(
            {
              user: null,
              isAuthenticated: false,
              theme: "light",
              sidebarOpen: true,
              loading: false,
            },
            false,
            "reset"
          ),
      }),
      {
        name: "app-store",
        partialize: (state) => ({
          user: state.user,
          isAuthenticated: state.isAuthenticated,
          theme: state.theme,
          sidebarOpen: state.sidebarOpen,
        }),
      }
    ),
    {
      name: "app-store",
    }
  )
);

// Example of a specific feature store
export const useUIStore = create()(
  devtools(
    (set, get) => ({
      // Modal states
      modals: {
        profile: false,
        settings: false,
        confirmation: false,
      },

      // Toast notifications
      notifications: [],

      // Actions
      openModal: (modalName) =>
        set(
          (state) => ({
            modals: { ...state.modals, [modalName]: true },
          }),
          false,
          "openModal"
        ),

      closeModal: (modalName) =>
        set(
          (state) => ({
            modals: { ...state.modals, [modalName]: false },
          }),
          false,
          "closeModal"
        ),

      closeAllModals: () =>
        set(
          (state) => ({
            modals: Object.keys(state.modals).reduce((acc, key) => {
              acc[key] = false;
              return acc;
            }, {}),
          }),
          false,
          "closeAllModals"
        ),

      addNotification: (notification) =>
        set(
          (state) => ({
            notifications: [
              ...state.notifications,
              {
                id: Date.now(),
                ...notification,
              },
            ],
          }),
          false,
          "addNotification"
        ),

      removeNotification: (id) =>
        set(
          (state) => ({
            notifications: state.notifications.filter((n) => n.id !== id),
          }),
          false,
          "removeNotification"
        ),

      clearNotifications: () =>
        set(
          {
            notifications: [],
          },
          false,
          "clearNotifications"
        ),
    }),
    {
      name: "ui-store",
    }
  )
);
