import { createSlice } from "@reduxjs/toolkit"

const initialState = {
  theme: localStorage.getItem("theme") || "light",
  sidebarOpen: localStorage.getItem("sidebarOpen") !== null ? JSON.parse(localStorage.getItem("sidebarOpen")) : true,
  modals: {},
  notifications: [],
}

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    toggleTheme: (state) => {
      state.theme = state.theme === "light" ? "dark" : "light"
      localStorage.setItem("theme", state.theme)
    },
    setTheme: (state, action) => {
      state.theme = action.payload
      localStorage.setItem("theme", action.payload)
    },
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen
      localStorage.setItem("sidebarOpen", JSON.stringify(state.sidebarOpen))
    },
    openModal: (state, action) => {
      state.modals[action.payload.name] = true
    },
    closeModal: (state, action) => {
      state.modals[action.payload] = false
    },
    addNotification: (state, action) => {
      state.notifications.push({
        id: Date.now(),
        ...action.payload,
      })
    },
    removeNotification: (state, action) => {
      state.notifications = state.notifications.filter((n) => n.id !== action.payload)
    },
  },
})

export const { toggleTheme, setTheme, toggleSidebar, openModal, closeModal, addNotification, removeNotification } =
  uiSlice.actions
export default uiSlice.reducer
