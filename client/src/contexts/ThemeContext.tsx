import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import { apiRequest } from "@/lib/queryClient";

export type ThemeName = "default" | "dark" | "cream" | "midnight";

interface ThemeContextValue {
  theme: ThemeName;
  setTheme: (theme: ThemeName) => void;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

const STORAGE_KEY = "deuce-theme";
const VALID_THEMES: ThemeName[] = ["default", "dark", "cream", "midnight"];

function getStoredTheme(): ThemeName {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored && VALID_THEMES.includes(stored as ThemeName))
    return stored as ThemeName;
  return "default";
}

function applyThemeToDOM(theme: ThemeName) {
  document.documentElement.setAttribute("data-theme", theme);
}

// Apply immediately on module load to prevent flash of wrong theme
applyThemeToDOM(getStoredTheme());

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<ThemeName>(getStoredTheme);

  // Apply to DOM whenever state changes
  useEffect(() => {
    applyThemeToDOM(theme);
    localStorage.setItem(STORAGE_KEY, theme);
  }, [theme]);

  // Sync with server on mount
  useEffect(() => {
    apiRequest("/api/user/theme")
      .then((res) => {
        if (res.theme && VALID_THEMES.includes(res.theme)) {
          setThemeState(res.theme);
        }
      })
      .catch(() => {
        // Not authenticated or error — keep localStorage value
      });
  }, []);

  const setTheme = useCallback((newTheme: ThemeName) => {
    setThemeState(newTheme);
    apiRequest("/api/user/theme", {
      method: "PUT",
      body: JSON.stringify({ theme: newTheme }),
    }).catch(() => {
      // Optimistic — local state already updated
    });
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within a ThemeProvider");
  return ctx;
}
