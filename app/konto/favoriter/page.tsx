"use client";

import { useAuth } from "@/contexts/AuthContext";
import { Header } from "@/components/Header";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ListingCard } from "@/components/ListingCard";
import { Skeleton } from "@/components/ui/skeleton";
import { ProtectedRoute } from "@/components/ProtectedRoute";

export default function FavoritesPage() {
  const { user } = useAuth();

  const { data: favorites, isLoading } = useQuery({
    queryKey: ["favorites", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("favorites")
        .select(
          `
          *,
          listings (*)
        `,
        )
        .eq("user_id", user?.id);

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
          <h1 className="text-3xl font-bold mb-8">Dina favoriter</h1>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <Skeleton key={i} className="h-[300px]" />
              ))}
            </div>
          ) : favorites && favorites.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {favorites.map((favorite: any) => (
                <ListingCard
                  key={favorite.id}
                  id={favorite.listings.id}
                  title={favorite.listings.title}
                  price={favorite.listings.price || 0}
                  location={favorite.listings.location_text || ""}
                  image={favorite.listings.images?.[0]}
                  createdAt={favorite.listings.created_at}
                  condition={favorite.listings.condition}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Du har inga favoriter än</p>
            </div>
          )}
        </main>
      </div>
    </ProtectedRoute>
  );
}
