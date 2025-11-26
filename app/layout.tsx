import type { Metadata } from "next";
import { ReactNode } from "react";
import "./globals.css";
import { Providers } from "./providers";
import { Footer } from "@/components/Footer";
import { BottomNav } from "@/components/BottomNav";

export const metadata: Metadata = {
  title: "Marknadsplatsen",
  description: "Sveriges moderna köp- och säljplattform."
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="sv">
      <body className="min-h-screen bg-background text-foreground antialiased">
        <Providers>
          <div className="flex min-h-screen flex-col">
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
          <BottomNav />
        </Providers>
      </body>
    </html>
  );
}
