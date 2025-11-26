"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";

export const ThemeToggle = () => {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const isDark = (resolvedTheme ?? "light") === "dark";

  const handleToggle = () => {
    setTheme(isDark ? "light" : "dark");
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={handleToggle}
      aria-label="Växla färgtema"
      className="relative"
      disabled={!mounted}
    >
      <Sun className={`h-5 w-5 transition-opacity ${mounted && !isDark ? "opacity-100" : "opacity-0"}`} />
      <Moon className={`absolute h-5 w-5 transition-opacity ${mounted && isDark ? "opacity-100" : "opacity-0"}`} />
    </Button>
  );
};
