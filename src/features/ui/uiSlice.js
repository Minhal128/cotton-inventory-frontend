import { createSlice } from '@reduxjs/toolkit';

const initial = {
  sidebarOpen: true,
  darkMode: typeof window !== 'undefined' && localStorage.getItem('theme') === 'dark',
};

const slice = createSlice({
  name: 'ui',
  initialState: initial,
  reducers: {
    toggleSidebar(s) { s.sidebarOpen = !s.sidebarOpen; },
    setSidebar(s, a) { s.sidebarOpen = a.payload; },
    toggleTheme(s) {
      s.darkMode = !s.darkMode;
      if (s.darkMode) document.documentElement.classList.add('dark');
      else document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', s.darkMode ? 'dark' : 'light');
    },
  },
});

export const { toggleSidebar, setSidebar, toggleTheme } = slice.actions;
export default slice.reducer;