"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Search, Plus, MessageSquare, User } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";

export const BottomNav = () => {
  const pathname = usePathname();
  const { user } = useAuth();

  const navItems = [
    {
      label: "Hem",
      icon: Home,
      path: "/",
      requiresAuth: false,
    },
    {
      label: "Sök",
      icon: Search,
      path: "/annonser",
      requiresAuth: false,
    },
    {
      label: "Lägg upp",
      icon: Plus,
      path: user ? "/skapa-annons" : "/logga-in?redirect=/skapa-annons",
      requiresAuth: false,
      highlight: true,
    },
    {
      label: "Meddelanden",
      icon: MessageSquare,
      path: user ? "/konto/meddelanden" : "/logga-in",
      requiresAuth: true,
    },
    {
      label: "Konto",
      icon: User,
      path: user ? "/konto" : "/logga-in",
      requiresAuth: false,
    },
  ];

  const visibleItems = navItems.filter((item) => (item.requiresAuth ? !!user : true));

  const isActive = (path: string) => {
    if (!pathname) return false;
    if (path === "/") {
      return pathname === "/";
    }
    return pathname.startsWith(path);
  };

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-background border-t border-border">
      <div className="flex items-center justify-around h-16 px-2">
        {visibleItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);

          return (
            <Link
              key={item.path}
              href={item.path}
              className={cn(
                "flex flex-col items-center justify-center gap-1 flex-1 h-full transition-colors",
                active ? "text-primary" : "text-muted-foreground",
                item.highlight && "relative"
              )}
            >
              {item.highlight ? (
                <div className="absolute -top-6 bg-primary text-primary-foreground rounded-full p-3 shadow-lg">
                  <Icon className="h-6 w-6" />
                </div>
              ) : (
                <>
                  <Icon className={cn("h-6 w-6", active && "fill-primary/20")} />
                  <span className="text-xs font-medium">{item.label}</span>
                </>
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
};
