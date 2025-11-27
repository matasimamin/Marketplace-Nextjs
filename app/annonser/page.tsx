"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Header } from "@/components/Header";
import { ListingCard } from "@/components/ListingCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, SlidersHorizontal, LayoutGrid, List } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

export default function ListingsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [priceRange, setPriceRange] = useState([0, 50000]);
  const [sortBy, setSortBy] = useState("latest");
  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
  const [viewMode, setViewMode] = useState<"grid" | "list">(
    isMobile ? "list" : "grid"
  );

  const { data: listings = [], isLoading } = useQuery({
    queryKey: ["listings", searchQuery, sortBy],
    queryFn: async () => {
      let query = supabase.from("listings").select("*").eq("status", "active");

      if (searchQuery) {
        query = query.ilike("title", `%${searchQuery}%`);
      }

      if (sortBy === "latest") {
        query = query.order("created_at", { ascending: false });
      } else if (sortBy === "price-asc") {
        query = query.order("price", { ascending: true });
      } else if (sortBy === "price-desc") {
        query = query.order("price", { ascending: false });
      }

      const { data, error } = await query;
      if (error) throw error;

      return data.map((listing) => ({
        id: listing.id,
        title: listing.title,
        price: listing.price || 0,
        location: listing.location_text || "",
        image: listing.images?.[0] || "",
        createdAt: listing.created_at,
        condition: listing.condition,
      }));
    },
  });

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-0">
      <Header />

      <main className="container mx-auto px-4 py-8 max-w-full overflow-x-hidden">
        <div className="mb-8">
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="Sök bland annonser..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-12"
              />
            </div>
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="lg" className="gap-2">
                  <SlidersHorizontal className="h-5 w-5" />
                  Filter
                </Button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>Filtrera annonser</SheetTitle>
                  <SheetDescription>
                    Anpassa din sökning med filter nedan
                  </SheetDescription>
                </SheetHeader>
                <div className="mt-6 space-y-6">
                  <div>
                    <Label>Kategori</Label>
                    <Select>
                      <SelectTrigger className="mt-2">
                        <SelectValue placeholder="Välj kategori" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Alla kategorier</SelectItem>
                        <SelectItem value="fordon">Fordon</SelectItem>
                        <SelectItem value="elektronik">Elektronik</SelectItem>
                        <SelectItem value="hem">Hem & Trädgård</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Prisintervall (kr)</Label>
                    <div className="mt-4">
                      <Slider
                        value={priceRange}
                        onValueChange={setPriceRange}
                        max={50000}
                        step={500}
                        className="mb-2"
                      />
                      <div className="flex justify-between text-sm text-muted-foreground">
                        <span>{priceRange[0].toLocaleString("sv-SE")} kr</span>
                        <span>{priceRange[1].toLocaleString("sv-SE")} kr</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <Label>Plats</Label>
                    <Input
                      placeholder="Stad eller postnummer"
                      className="mt-2"
                    />
                  </div>

                  <div>
                    <Label>Skick</Label>
                    <Select>
                      <SelectTrigger className="mt-2">
                        <SelectValue placeholder="Välj skick" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Alla</SelectItem>
                        <SelectItem value="new">Ny</SelectItem>
                        <SelectItem value="used">Begagnad</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Button className="w-full">Tillämpa filter</Button>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>

        <div className="flex items-center justify-between gap-3 mb-4 sm:mb-6">
          <p className="text-muted-foreground text-sm sm:text-base">
            Visar{" "}
            <span className="font-semibold text-foreground">
              {listings.length}
            </span>{" "}
            annonser
          </p>
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="hidden md:flex border rounded-lg p-1 bg-muted/50 gap-1">
              <Button
                variant={viewMode === "grid" ? "secondary" : "ghost"}
                size="sm"
                onClick={() => setViewMode("grid")}
                className="gap-1.5 min-w-[44px] h-9"
                aria-label="Rutnät vy"
              >
                <LayoutGrid className="h-4 w-4" />
                <span className="text-xs">Rutnät</span>
              </Button>
              <Button
                variant={viewMode === "list" ? "secondary" : "ghost"}
                size="sm"
                onClick={() => setViewMode("list")}
                className="gap-1.5 min-w-[44px] h-9"
                aria-label="List vy"
              >
                <List className="h-4 w-4" />
                <span className="text-xs">Lista</span>
              </Button>
            </div>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[140px] sm:w-[180px] h-9">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="latest">Senaste först</SelectItem>
                <SelectItem value="price-asc">Lägsta pris</SelectItem>
                <SelectItem value="price-desc">Högsta pris</SelectItem>
                <SelectItem value="relevant">Mest relevanta</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="space-y-3">
                <Skeleton className="aspect-square rounded-lg" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            ))}
          </div>
        ) : listings.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-xl text-muted-foreground">
              Inga annonser hittades
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              Prova att ändra dina sökfilter eller skapa en ny annons
            </p>
          </div>
        ) : (
          <div
            className={
              typeof window !== "undefined" && window.innerWidth < 768
                ? "flex flex-col gap-3"
                : viewMode === "grid"
                ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6"
                : "flex flex-col gap-3 sm:gap-4"
            }
          >
            {listings.map((listing) => (
              <ListingCard
                key={listing.id}
                {...listing}
                viewMode={
                  typeof window !== "undefined" && window.innerWidth < 768
                    ? "list"
                    : viewMode
                }
              />
            ))}
          </div>
        )}

        <div className="mt-12 flex justify-center">
          <div className="flex gap-2">
            <Button variant="outline">Föregående</Button>
            <Button variant="outline">1</Button>
            <Button>2</Button>
            <Button variant="outline">3</Button>
            <Button variant="outline">Nästa</Button>
          </div>
        </div>
      </main>
    </div>
  );
}
