"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Heart, MessageSquare, User, Plus, LogOut } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ThemeToggle } from "@/components/ThemeToggle";

export const Header = () => {
  const { user, signOut } = useAuth();

  const getInitials = (name?: string) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <header className="sticky top-0 z-50 bg-background border-b border-border">
      <div className="container mx-auto px-4 max-w-full">
        <div className="flex items-center justify-between h-16 gap-2">
          <Link href="/" className="flex items-center space-x-2 flex-shrink-0">
            <div className="text-xl sm:text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              Marknadsplatsen
            </div>
          </Link>

          <nav className="hidden md:flex items-center space-x-6">
            <Link
              href="/annonser"
              className="text-foreground hover:text-primary transition-colors"
            >
              Alla annonser
            </Link>
            <Link
              href="/kategorier"
              className="text-foreground hover:text-primary transition-colors"
            >
              Kategorier
            </Link>
            <Link
              href="/hjalp"
              className="text-foreground hover:text-primary transition-colors"
            >
              Hjälp
            </Link>
          </nav>

          <div className="flex items-center space-x-2 sm:space-x-3 flex-shrink-0">
            <ThemeToggle />
            {user ? (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  asChild
                  className="hidden md:flex"
                >
                  <Link href="/konto/favoriter">
                    <Heart className="h-5 w-5" />
                  </Link>
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  asChild
                  className="hidden md:flex"
                >
                  <Link href="/konto/meddelanden">
                    <MessageSquare className="h-5 w-5" />
                  </Link>
                </Button>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="rounded-full"
                    >
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="bg-primary text-primary-foreground">
                          {getInitials(user.user_metadata?.name)}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel>
                      <div className="flex flex-col">
                        <span className="font-medium">
                          {user.user_metadata?.name || "Användare"}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {user.email}
                        </span>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href="/konto">Min profil</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/konto/dina-annonser">Mina annonser</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/konto/favoriter">Favoriter</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild className="md:flex hidden">
                      <Link href="/konto/meddelanden">Meddelanden</Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => signOut()}
                      className="text-destructive"
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Logga ut
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                <Button
                  asChild
                  className="bg-gradient-primary hover:opacity-90 transition-opacity hidden md:flex"
                >
                  <Link href="/skapa-annons">
                    <Plus className="h-4 w-4 mr-2" />
                    <span className="hidden lg:inline">Lägg upp annons</span>
                    <span className="lg:hidden">Annons</span>
                  </Link>
                </Button>
              </>
            ) : (
              <>
                <Button variant="ghost" asChild className="hidden sm:flex">
                  <Link href="/logga-in">Logga in</Link>
                </Button>
                <Button
                  asChild
                  className="bg-gradient-primary hover:opacity-90 transition-opacity hidden md:flex"
                >
                  <Link
                    href="/logga-in?redirect=/skapa-annons"
                    className="flex items-center"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    <span className="hidden lg:inline">Lägg upp annons</span>
                  </Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
