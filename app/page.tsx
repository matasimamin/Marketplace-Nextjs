import Link from "next/link";
import { Header } from "@/components/Header";
import { SearchHero } from "@/components/SearchHero";
import { CategoryGrid } from "@/components/CategoryGrid";
import { ListingCard } from "@/components/ListingCard";
import { Button } from "@/components/ui/button";
import { ArrowRight, Shield, Clock, MessageSquare } from "lucide-react";

const recentListings = [
  {
    id: "1",
    title: "iPhone 14 Pro i perfekt skick",
    price: 8500,
    location: "Stockholm",
    image: "https://images.unsplash.com/photo-1678652197950-794d3baec9bb?w=800&q=80",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    condition: "used",
  },
  {
    id: "2",
    title: "Vintage soffa 3-sits",
    price: 3500,
    location: "Göteborg",
    image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=80",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    condition: "used",
  },
  {
    id: "3",
    title: "Mountainbike Trek X-Caliber",
    price: 12000,
    location: "Malmö",
    image: "https://images.unsplash.com/photo-1576435728678-68d0fbf94e91?w=800&q=80",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
    condition: "used",
  },
  {
    id: "4",
    title: "Nintendo Switch OLED + spel",
    price: 2800,
    location: "Uppsala",
    image: "https://images.unsplash.com/photo-1578303512597-81e6cc155b3e?w=800&q=80",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(),
    condition: "new",
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background pb-20 md:pb-0">
      <Header />

      <main>
        <section className="container mx-auto px-4 pt-8 pb-12">
          <SearchHero />
        </section>

        <section className="container mx-auto px-4 py-12">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold">Upptäck kategorier</h2>
            <Button variant="ghost" asChild>
              <Link href="/kategorier">
                Alla kategorier
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
          <CategoryGrid />
        </section>

        <section className="container mx-auto px-4 py-12 bg-muted/30 rounded-3xl">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold">Senaste annonserna</h2>
            <Button variant="ghost" asChild>
              <Link href="/annonser">
                Visa alla
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {recentListings.map((listing) => (
              <ListingCard key={listing.id} {...listing} />
            ))}
          </div>
        </section>

        <section className="container mx-auto px-4 py-16">
          <h2 className="text-3xl font-bold text-center mb-12">Trygg handel</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary-light mb-4">
                <Shield className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Säker handel</h3>
              <p className="text-muted-foreground">
                Vi verifierar användare och har funktioner för trygg betalning
              </p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary-light mb-4">
                <MessageSquare className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Intern chatt</h3>
              <p className="text-muted-foreground">
                Kontakta säljare direkt i appen utan att dela din mejl
              </p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary-light mb-4">
                <Clock className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Snabbt & enkelt</h3>
              <p className="text-muted-foreground">
                Lägg upp din annons på några minuter och nå tusentals köpare
              </p>
            </div>
          </div>
        </section>

        <section className="container mx-auto px-4 py-16">
          <div className="bg-gradient-primary rounded-3xl p-12 text-center text-white">
            <h2 className="text-4xl font-bold mb-4">Redo att sälja något?</h2>
            <p className="text-xl mb-8 text-white/90">
              Det tar bara några minuter att skapa din annons
            </p>
            <Button size="lg" variant="secondary" asChild>
              <Link href="/skapa-annons">
                Lägg upp annons gratis
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </section>
      </main>
    </div>
  );
}
