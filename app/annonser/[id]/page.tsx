"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { ArrowLeft, MapPin, Calendar, Heart, Share2, Flag } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent } from "@/components/ui/dialog";

export default function ListingDetailPage() {
  const params = useParams<{ id: string }>();
  const listingId = params?.id;
  const router = useRouter();
  const { user } = useAuth();
  const [imageDialogOpen, setImageDialogOpen] = useState(false);
  const [isCreatingThread, setIsCreatingThread] = useState(false);

  const { data: listing, isLoading } = useQuery({
    queryKey: ["listing", listingId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("listings")
        .select(
          `
          *,
          profiles (
            name,
            avatar_url,
            account_type
          )
        `,
        )
        .eq("id", listingId)
        .maybeSingle();

      if (error) throw error;
      return data;
    },
    enabled: !!listingId,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background pb-20 md:pb-0">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <Skeleton className="h-8 w-32 mb-6" />
          <div className="grid md:grid-cols-2 gap-8">
            <Skeleton className="aspect-square rounded-lg" />
            <div className="space-y-4">
              <Skeleton className="h-10 w-3/4" />
              <Skeleton className="h-8 w-1/4" />
              <Skeleton className="h-32 w-full" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="min-h-screen bg-background pb-20 md:pb-0">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <Button variant="ghost" onClick={() => router.push("/annonser")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Tillbaka till annonser
          </Button>
          <div className="text-center mt-12">
            <h1 className="text-2xl font-bold mb-4">Annonsen hittades inte</h1>
            <p className="text-muted-foreground">Annonsen du söker existerar inte eller har tagits bort.</p>
          </div>
        </div>
      </div>
    );
  }

  const createdDate = new Date(listing.created_at);
  const daysAgo = Math.floor((Date.now() - createdDate.getTime()) / (1000 * 60 * 60 * 24));

  const handleContactSeller = async () => {
    if (!user) {
      toast.error("Du måste vara inloggad", {
        description: "Logga in för att kontakta säljaren",
      });
      router.push("/logga-in");
      return;
    }

    if (user.id === listing.seller_id) {
      toast.error("Du kan inte kontakta dig själv");
      return;
    }

    setIsCreatingThread(true);

    try {
      const { data: existingThread } = await supabase
        .from("threads")
        .select("id")
        .eq("listing_id", listing.id)
        .eq("buyer_id", user.id)
        .eq("seller_id", listing.seller_id)
        .maybeSingle();

      if (existingThread) {
        router.push(`/meddelanden/${existingThread.id}`);
        return;
      }

      const { data: newThread, error } = await supabase
        .from("threads")
        .insert({
          listing_id: listing.id,
          buyer_id: user.id,
          seller_id: listing.seller_id,
        })
        .select()
        .single();

      if (error) throw error;

      toast.success("Konversation startad!");
      router.push(`/meddelanden/${newThread.id}`);
    } catch (error) {
      console.error("Error creating thread:", error);
      toast.error("Kunde inte starta konversation", {
        description: "Försök igen senare",
      });
    } finally {
      setIsCreatingThread(false);
    }
  };

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-0">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <Button variant="ghost" onClick={() => router.push("/annonser")} className="mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Tillbaka till annonser
        </Button>

        <div className="grid md:grid-cols-2 gap-8">
          <div>
            {listing.images && listing.images.length > 0 ? (
              <img
                src={listing.images[0]}
                alt={listing.title}
                className="w-full aspect-square object-cover rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
                onClick={() => setImageDialogOpen(true)}
              />
            ) : (
              <div className="w-full aspect-square bg-muted rounded-lg flex items-center justify-center">
                <span className="text-muted-foreground">Ingen bild</span>
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold mb-2">{listing.title}</h1>
              <div className="flex items-center gap-4 text-muted-foreground mb-4">
                <span className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  {listing.location_text || "Plats ej angiven"}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  {daysAgo === 0 ? "Idag" : `${daysAgo} dagar sedan`}
                </span>
              </div>
              <div className="flex items-center gap-3 mb-4">
                <span className="text-3xl font-bold text-primary">
                  {listing.price ? `${listing.price} kr` : "Pris saknas"}
                </span>
                {listing.condition && <Badge variant="secondary">{listing.condition}</Badge>}
              </div>
            </div>

            <div className="flex gap-2">
              <Button variant="outline" size="icon">
                <Heart className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon">
                <Share2 className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon">
                <Flag className="h-4 w-4" />
              </Button>
            </div>

            {listing.profiles && (
              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-3">Säljare</h2>
                <div className="flex items-center gap-3">
                  {listing.profiles.avatar_url ? (
                    <img
                      src={listing.profiles.avatar_url}
                      alt={listing.profiles.name || "Säljare"}
                      className="w-12 h-12 rounded-full"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                      <span className="text-xl">{listing.profiles.name?.[0]?.toUpperCase() || "?"}</span>
                    </div>
                  )}
                  <div>
                    <p className="font-semibold">{listing.profiles.name || "Anonym"}</p>
                    {listing.profiles.account_type === "business" && (
                      <Badge variant="secondary" className="text-xs">
                        Företag
                      </Badge>
                    )}
                  </div>
                </div>
                <Button className="w-full mt-4" onClick={handleContactSeller} disabled={isCreatingThread}>
                  {isCreatingThread ? "Startar konversation..." : "Kontakta säljare"}
                </Button>
              </Card>
            )}
          </div>
        </div>

        <Card className="p-6 mt-8">
          <h2 className="text-xl font-semibold mb-3">Beskrivning</h2>
          <p className="text-foreground/90 whitespace-pre-wrap">{listing.description}</p>
        </Card>

        <Dialog open={imageDialogOpen} onOpenChange={setImageDialogOpen}>
          <DialogContent className="max-w-4xl w-full p-0">
            {listing.images && listing.images.length > 0 && (
              <img src={listing.images[0]} alt={listing.title} className="w-full h-auto max-h-[90vh] object-contain" />
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
