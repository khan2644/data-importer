import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/lib/theme";

/**
 * Chunky 3D light/dark switch. Works with touch (min 44px hit area) so it
 * feels the same on mobile as on desktop.
 */
export function ThemeToggle({ className = "" }: { className?: string }) {
  const { theme, toggle } = useTheme();
  const dark = theme === "dark";

  return (
    <button
      type="button"
      role="switch"
      aria-checked={dark}
      aria-label={dark ? "Switch to light theme" : "Switch to dark theme"}
      onClick={toggle}
      className={`switch-3d ${dark ? "is-on" : ""} ${className}`}
    >
      <span className="switch-3d-track">
        <Sun className="switch-3d-icon switch-3d-icon-sun size-3.5" />
        <Moon className="switch-3d-icon switch-3d-icon-moon size-3.5" />
        <span className="switch-3d-knob">
          {dark ? <Moon className="size-3.5" /> : <Sun className="size-3.5" />}
        </span>
      </span>
    </button>
  );
}
