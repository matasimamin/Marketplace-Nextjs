"use client";

import Link, { LinkProps } from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";
import { cn } from "@/lib/utils";

type NavLinkProps = LinkProps & {
  className?: string;
  activeClassName?: string;
  children: ReactNode;
};

export const NavLink = ({ className, activeClassName, href, children, ...props }: NavLinkProps) => {
  const pathname = usePathname();
  const target =
    typeof href === "string"
      ? href
      : "pathname" in href
        ? href.pathname ?? ""
        : "";
  const isActive = target !== "" && pathname?.startsWith(target);

  return (
    <Link href={href} className={cn(className, isActive && activeClassName)} {...props}>
      {children}
    </Link>
  );
};
