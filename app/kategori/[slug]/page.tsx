"use client";

import { useParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Header } from "@/components/Header";
import { ListingCard } from "@/components/ListingCard";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function CategoryPage() {
  const params = useParams<{ slug: string }>();
  const slug = params?.slug;
  const router = useRouter();

  const { data: category, isLoading: categoryLoading } = useQuery({
    queryKey: ["category", slug],
    queryFn: async () => {
      const { data, error } = await supabase.from("categories").select("*").eq("slug", slug).maybeSingle();

      if (error) throw error;
      return data;
    },
    enabled: !!slug,
  });

  const { data: listings, isLoading: listingsLoading } = useQuery({
    queryKey: ["category-listings", category?.id],
    enabled: !!category?.id,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("listings")
        .select(
          `
          *,
          profiles (
            name,
            avatar_url
          )
        `,
        )
        .eq("category_id", category!.id)
        .eq("status", "active")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  if (categoryLoading) {
    return (
      <>
        <Header />
        <div className="container mx-auto px-4 py-8">
          <Skeleton className="h-10 w-64 mb-8" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <Skeleton key={i} className="h-80 w-full" />
            ))}
          </div>
        </div>
      </>
    );
  }

  if (!category) {
    return (
      <>
        <Header />
        <div className="container mx-auto px-4 py-8">
          <Button variant="ghost" onClick={() => router.push("/")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Tillbaka till startsidan
          </Button>
          <div className="text-center mt-12">
            <h1 className="text-2xl font-bold mb-4">Kategorin hittades inte</h1>
            <p className="text-muted-foreground">Kategorin du söker existerar inte.</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-0">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <Button variant="ghost" onClick={() => router.push("/")} className="mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Tillbaka till startsidan
        </Button>

        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-4xl">{category.icon}</span>
            <h1 className="text-3xl font-bold">{category.name}</h1>
          </div>
          {category.description && <p className="text-muted-foreground text-lg">{category.description}</p>}
        </div>

        {listingsLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <Skeleton key={i} className="h-80 w-full" />
            ))}
          </div>
        ) : listings && listings.length > 0 ? (
          <>
            <p className="text-muted-foreground mb-6">
              {listings.length} {listings.length === 1 ? "annons" : "annonser"}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {listings.map((listing) => (
                <ListingCard
                  key={listing.id}
                  id={listing.id}
                  title={listing.title}
                  price={listing.price}
                  location={listing.location_text || "Plats ej angiven"}
                  image={listing.images?.[0]}
                  createdAt={listing.created_at}
                />
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">Inga annonser hittades i denna kategori ännu.</p>
            <Button onClick={() => router.push("/skapa-annons")} className="mt-4">
              Skapa första annonsen
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
