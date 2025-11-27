"use client";

import { useAuth } from "@/contexts/AuthContext";
import { Header } from "@/components/Header";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ListingCard } from "@/components/ListingCard";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { NavLink } from "@/components/NavLink";
import { Plus } from "lucide-react";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { getPublicImageUrl } from "@/utils/uploadImage";

export default function MyListingsPage() {
  const { user } = useAuth();

  const { data: listings, isLoading } = useQuery({
    queryKey: ["my-listings", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("listings")
        .select(
          `
          *,
          listing_images (
            path
          )
        `
        )
        .eq("seller_id", user?.id)
        .order("created_at", {
          ascending: false,
        });

      if (error) throw error;
      return data;
    },
    enabled: !!user?.id,
  });

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background pb-20 md:pb-0">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold">Dina annonser</h1>
            <NavLink href="/skapa-annons">
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Skapa annons
              </Button>
            </NavLink>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <Skeleton key={i} className="h-[300px]" />
              ))}
            </div>
          ) : listings && listings.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {listings.map((listing: any) => {
                const imagePaths =
                  listing.listing_images?.map((img: { path: string }) => img.path) ?? [];
                const primaryPath = imagePaths[0];
                const fallbackImage = listing.images?.[0];

                return (
                  <ListingCard
                    key={listing.id}
                    id={listing.id}
                    title={listing.title}
                    price={listing.price || 0}
                    location={listing.location_text || ""}
                    image={
                      primaryPath
                        ? getPublicImageUrl(primaryPath, { width: 400, quality: 80 })
                        : fallbackImage
                    }
                    createdAt={listing.created_at}
                    condition={listing.condition}
                  />
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-4">Du har inga annonser än</p>
              <NavLink href="/skapa-annons">
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Skapa din första annons
                </Button>
              </NavLink>
            </div>
          )}
        </main>
      </div>
    </ProtectedRoute>
  );
}
