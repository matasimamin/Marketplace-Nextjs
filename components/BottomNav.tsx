"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Search, Plus, MessageSquare, User } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";

export const BottomNav = () => {
  const pathname = usePathname();
  const { user } = useAuth();

  // Boundary-aware matcher with optional exact flag
  const isActive = (
    currentPath: string | null,
    base: string,
    exact = false
  ) => {
    if (!currentPath) return false;
    if (base === "/") return currentPath === "/";
    if (exact) return currentPath === base;

    if (!currentPath.startsWith(base)) return false;
    const nextChar = currentPath.charAt(base.length);
    return nextChar === "" || nextChar === "/";
  };

  const home = { label: "Hem", icon: Home, path: "/", exact: true };
  const search = { label: "Sök", icon: Search, path: "/annonser" };
  const plus = {
    label: "Lägg upp",
    icon: Plus,
    path: user ? "/skapa-annons" : "/logga-in?redirect=/skapa-annons",
  };
  const messages = {
    label: "Meddelanden",
    icon: MessageSquare,
    path: user ? "/konto/meddelanden" : "/logga-in",
    requiresAuth: true, // boundary-aware by default
  };
  const account = {
    label: "Konto",
    icon: User,
    path: user ? "/konto" : "/logga-in",
    exact: true, // only highlight exactly '/konto'
  };

  // Reusable nav item
  const NavItem = ({
    label,
    Icon,
    href,
    exact = false,
  }: {
    label: string;
    Icon: React.ElementType;
    href: string;
    exact?: boolean;
  }) => {
    const active = isActive(pathname, href, exact);
    return (
      <Link
        href={href}
        className={cn(
          "flex flex-col items-center justify-center gap-1 h-full transition-colors text-xs font-medium",
          active ? "text-primary" : "text-muted-foreground"
        )}
      >
        <Icon className={cn("h-6 w-6", active && "fill-primary/20")} />
        {label}
      </Link>
    );
  };

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-background border-t border-border">
      {/* Fixed 5-column grid so the center FAB never shifts */}
      <div className="relative grid grid-cols-5 items-center h-16 px-2">
        {/* Col 1: Hem */}
        <div className="col-start-1">
          <NavItem
            label={home.label}
            Icon={home.icon}
            href={home.path}
            exact={home.exact}
          />
        </div>

        {/* Col 2: Sök */}
        <div className="col-start-2">
          <NavItem label={search.label} Icon={search.icon} href={search.path} />
        </div>

        {/* Col 3: Center FAB (Plus) */}
        <div className="col-start-3 flex items-center justify-center">
          <Link href={plus.path} aria-label={plus.label} className="relative">
            <div className="bg-primary text-primary-foreground rounded-full p-3 shadow-lg -mt-8">
              <plus.icon className="h-6 w-6" />
            </div>
          </Link>
        </div>

        {/* Col 4: Meddelanden (keep empty slot if logged out) */}
        <div className="col-start-4">
          {user ? (
            <NavItem
              label={messages.label}
              Icon={messages.icon}
              href={messages.path}
            />
          ) : (
            <div className="h-full" />
          )}
        </div>

        {/* Col 5: Konto */}
        <div className="col-start-5">
          <NavItem
            label={account.label}
            Icon={account.icon}
            href={account.path}
            exact={account.exact}
          />
        </div>
      </div>
    </nav>
  );
};
