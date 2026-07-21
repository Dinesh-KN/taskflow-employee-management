import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  mobileSidebarOpen: false,
  sidebarCollapsed: false,
};

const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    openMobileSidebar: (state) => {
      state.mobileSidebarOpen = true;
    },

    closeMobileSidebar: (state) => {
      state.mobileSidebarOpen = false;
    },

    toggleMobileSidebar: (state) => {
      state.mobileSidebarOpen = !state.mobileSidebarOpen;
    },

    setSidebarCollapsed: (state, action) => {
      state.sidebarCollapsed = action.payload;
    },

    toggleSidebarCollapsed: (state) => {
      state.sidebarCollapsed = !state.sidebarCollapsed;
    },
  },
});

export const {
  closeMobileSidebar,
  openMobileSidebar,
  setSidebarCollapsed,
  toggleMobileSidebar,
  toggleSidebarCollapsed,
} = appSlice.actions;

export default appSlice.reducer;
