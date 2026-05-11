import { create } from 'zustand';

interface ThemeState {
  isDark: boolean;
  toggle: () => void;
}

const applyTheme = (isDark: boolean) => {
  if (isDark) {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
  localStorage.setItem('theme', isDark ? 'dark' : 'light');
};

const stored = localStorage.getItem('theme');
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
const initialDark = stored ? stored === 'dark' : prefersDark;
applyTheme(initialDark);

export const useThemeStore = create<ThemeState>((set) => ({
  isDark: initialDark,
  toggle: () =>
    set((state) => {
      const next = !state.isDark;
      applyTheme(next);
      return { isDark: next };
    }),
}));
